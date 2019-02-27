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

Grâce aux hooks, la gestion asynchrone est devenue bien plus simple qu'auparavant. Il existe un hook fait pour gérer
n'importe quel side effect appelé `useEffect`. Celui-ci permet d'effectuer des actions en dehors de React (souscrire
à des événements sur `window`, ouvrir une websocket, faire un appel XHR, etc), de manière
sécurisées et de nettoyer tout correctement quand le composant est démonté.
