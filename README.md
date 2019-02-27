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
annuler un appel XHR, etc).

```js
useEffect(() => {
  const timer = setInterval(() => { /* Unicorn dance */ }, 1000);
  return () => clearInterval(timer);
});
```

Dans le cas d'un appel XHR, on ne souhaite par forcément le refaire à chaque rendu du composant. Heureusement,
`useEffect` prend en deuxième argument, un tableau contenant des valeurs à comparer avec le dernier appel à `useEffect`.
Si les valeurs de ce tableau changent alors le la fonction de side effect sera appelée sinon elle sera ignorée.

```js
const MyComp = ({ intervalTimer }) => {
  useEffect(() => {
    const timer = setInterval(() => { /* Unicorn dance */ }, intervalTimer);
    return () => clearInterval(timer);
  }, [intervalTimer]);
  return 'Foo';
}
```

Il est possible de ne passer aucune valeur et dans ce cas, l'effet ne sera executé qu'une seule fois comme un
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
démontage du composant. `fetch` ne supporte pas de base l'annulation
