# Étape 7

Jusqu'à présent, notre application utilisait des données stockées directement dans l'application mais une grande partie
du temps ces données viennent d'une API et nécessitent d'être récupérées via des appels XHR. Nous allons donc voir
comment gérer les appels asynchrones dans notre application.

## Composants asynchrones

### Ancienne méthode

Avant l'arrivée des hooks la méthode consistait à récupérer les données avec `fetch` dans le `componentDidMount`,
de faire un `setState` pour écrire dans le state du composant qu'il est en train de charger, puis refaire un autre
`setState` en cas de succès ou d'erreur. Ceci forçait encore une fois à l'utilisation d'une classe ES6 :

```jsx harmony
import React, { Component } from 'react';

class Readme extends Component {
  state = {
    loading: false,
    error: false,
    results: [],
  };

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const response = await fetch('/some/url');
      this.setState({ loading: false, results: await response.json() });
    } catch (e) {
      this.setState({ loading: false, error: true });
    }
  }

  render() {
    const { loading, error, results } = this.state;
    if (loading) {
      return 'Loading...';
    }
    if (error) {
      return 'Error :(';
    }
    return (
      <ul>
        {results.map(result => <li>{result}</li>)}
      </ul>
    );
 }
}

export default Readme;
```

### Nouvelle méthode

Grâce aux hooks, la gestion asynchrone est devenue bien plus simple qu'auparavant. En effet il existe un hook fait pour
gérer n'importe quel side effect appelé `useEffect`. Celui-ci permet d'effectuer des actions en dehors de React
(souscrire à des événements sur `window`, ouvrir une websocket, faire un appel XHR, etc), de manière
sécurisées et de nettoyer tout correctement quand le composant est démonté.

`useEffect` prend en paramètre une fonction qui sera executée, par défaut, à tous les rendus. Cette fonction peut, ou
non, renvoyer à son tour une autre fonction de nettoyage (détruire la souscription à des events, nettoyer des timers,
annuler un appel XHR, etc). Cette fonction de nettoyage est appelée aussi à chaque re-rerender **avant** la fonction de
side effect. En effet l'effet précédent doit être cleané avant d'appliquer le suivant. Le cleanup est aussi appelé
lorsque le composant est démonté (`componentWillUnmount`).

```js
const MyComp = () => {
  useEffect(() => {
    // Side-effect
    const timer = setInterval(() => { /* Unicorn dance */ }, 1000);
  
    // Cleanup
    return () => clearInterval(timer);
  });
};
```

Dans certains cas on souhaitera executer la fonction de cleanup/side effect au changement de certaines props uniquement.
`useEffect` prend en deuxième argument, un tableau contenant des valeurs à comparer avec le dernier appel.
Si les valeurs de ce tableau changent alors la fonction de side effect sera appelée sinon elle sera ignorée.
:warning: la comparaison n'est pas profonde, ne modifiez donc pas l'intérieur des objets contenus dans le tableau sans
régénérer une nouvelle instance pour changer sa référence.

```js
const MyComp = ({ intervalTimer }) => {
  useEffect(() => {
    const timer = setInterval(() => console.log('Unicorn dance'), intervalTimer);
    return () => clearInterval(timer);
  }, [intervalTimer]);
  return 'Foo';
}
```

Voici un output potentiel de l'exemple ci-dessus:

```
- MyComp est monté dans le DOM avec la prop intervalTimer à 1000.
- L'interval est crée avec un timer de 1000.
- 1 seconde plus tard, "Unicorn dance" apparaît dans la console.
- Une autre seconde s'écoule et "Unicorn dance" s'affiche à nouveau.
- La propriété intervalTimer change à 500.
- L'ancien timer de 1s est annulé par la fonction de cleanup.
- L'interval est re-créé avec un timer de 500 par la fonction de side-effect.
- 500ms plus tard, la console affiche "Unicorn dance".
```

Il est aussi possible de ne passer aucune valeur et dans ce cas, l'effet ne sera executé qu'une seule fois comme un
`componentDidMount`.

Cela donne donc le résultat suivant pour un appel XHR :

```jsx harmony
const MyComp = ({ intervalTimer }) => {
  const [state, setState] = useState({ loading: false, error: false, results: [] });
  
  useEffect(async () => {
    setState({ ...state, loading: true });
    try {
      const response = await fetch('/some/url');
      setState({ ...state, loading: false, results: await response.json() });
    } catch (e) {
      setState({ ...state, loading: false, error: true });
    }
  }, []);
  
  if (state.loading) {
    return 'Loading...';
  }
  if (state.error) {
    return 'Error :(';
  }
  return (
    <ul>
      {state.results.map(result => <li>{result}</li>)}
    </ul>
  );
}
```

## Annulation d'appel XHR

Dans le cas où un appel XHR est long, il est possible que l'utilisateur change de page ou ferme le composant avant que
l'appel ne finisse d'aboutir. Avec le code précédemment écrit, React jettera une erreur à la ligne
`setState({ loading: false, results: await response.json() });` car il est impossible d'appeler `setState` sur un
composant démonté. Pour éviter cela, il est donc conseillé d'annuler l'appel si jamais l'utilisateur provoque le
démontage du composant.

Pour annuler un appel XHR fait avec fetch, il faut utiliser un `AbortController`. Celui-ci pourra donner un signal sur
commande d'annuler la requête XHR.

```js
const controller = new AbortController();
fetch('/path/to/api', {
  signal: controller.signal,
});

// Somewhere else
controller.abort();
```

On peut donc utiliser cette méthode pour empêcher les erreurs de composant démonté de la manière suivante :

```js
const [state, setState] = useState({ loading: false, error: false, results: [] });
useEffect(async () => {
  setState({ ...state, loading: true });
  const controller = new AbortController();
  try {
    const response = await fetch('/some/url', { signal: controller.signal });
    setState({ ...state, loading: false, results: await response.json() });
  } catch (e) {
    setState({ ...state, loading: false, error: true });
  }
  return () => controller.abort();
}, []);
```

## Composition des hooks

Avec les derniers exemples que l'on a vu, on commence à voir que le code devient assez velu et que si on doit répeter
cela pour chaque composant qui possède un call à une API, ça deviendra vite lourd. Comme dit précédemment, les hooks
sont composables et peuvent facilement être utilisés les uns avec les autres pour former des hooks plus gros.

On pourra donc écrire un hook qui nous servira dans n'importe quel composant à faire un appel XHR via le code suivant :

```js
// useXHRCall.js
export const useXHRCall = (url, options, defaultValue = []) => {
  const [state, setState] = useState({ loading: false, error: false, data: defaultValue });
  useEffect(async () => {
    setState({ ...state, loading: true });
    const controller = new AbortController();
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { ...options.headers, 'Content-Type': 'application/json' },
      });
      setState({ ...state, loading: false, data: await response.json() });
    } catch (e) {
      setState({ ...state, loading: false, error: true });
    }
    return () => controller.abort();
  }, []);
  return [state, setState];
}

// MyComp.jsx
const MyComp = () => {
  const [{ loading, error, data }] = useXHRCall('/path/to/api', { method: 'POST' });
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return 'Error :(';
  }
  return (
    <ul>
      {data.map(result => <li>{result}</li>)}
    </ul>
  );
};
```

## Exercice

Il temps maintenant de mettre en pratique ce que l'on a appris pour utiliser l'API du Choixpeau. Commencez par démarrer
celle-ci avec :

```bash
yarn start:api
```

Cette API possède 3 endpoints :

```
GET /students
GET /houses
```

Vous devrez donc dans cet exercice, utiliser les 2 endpoints GET pour récupérer les données à afficher dans
l'application. Utilisez le hook `useXHRCall` décrit ci-dessus pour vous aider. La création/suppression d'étudiants
devra encore se faire côté frontend uniquement. Pour ce faire, utilisez le `setState` renvoyé par `useXHRCall` pour
modifier la liste des étudiants.
