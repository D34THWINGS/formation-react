# Étape 3

Dans cette étape nous allons apprendre à gérer l'état interne d'un composant et son cycle de vie.

## State

Le `state` d'un composant est son état interne, c'est une valeur qui n'est pas globale à l'application mais propre à ce
composant et qui permet de déterminer à un instant T dans quel état il est. Ceci est très utilisé pour stocker des
interactions utilisateur tel que ouvrir ou fermer un menu mais aussi pour stocker des changements externes tels que des
timers ou des WebSockets.

Mettre à jour le `state` provoque automatiquement un rafraîchissement du composant et de ses composants enfants. Il en
va de même pour les `props`, si vous changez celles passées à un composant grâce à une mise à jour du state, celui-ci
sera aussi forcé d'effectuer un nouveau rendu.

### Ajouter un state à un composant

Seul les composants sous forme de classe ES6 peuvent posséder un state. Celui-ci est stocké dans la propriété `state`
de la classe comme suis :

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  render() {
    const { value } = this.state;
    return <div>Counter value: {value}</div>;
  }
}
```

Il existe une autre syntaxe plus rapide pour les propriétés de classe :

```jsx
class Counter extends React.Component {
  state = {
    value: 0
  };

  render() {
    const { value } = this.state;
    return <div>Counter value: {value}</div>;
  }
}
```

_Remarque : Le state ne doit jamais être initialisé avec une props, car comme les props sont changeantes, il n'est pas
garanti que le state sois toujours initialisé avec la valeur que l'on souhaite._

### Modifier le state d'un composant

Le fait d'étendre `React.Component` nous donne accès à certaines API supplémentaire de React face aux composants sous
forme de fonctions. En effet la méthode `this.setState()` est celle qui permet de changer l'état d'un composant et de
déclencher un nouveau rendu.

La fonction `setState` prend en paramètre un objet contenant la mise à jour que vous souhaitez effectuer et qui sera
fusionné avec le state existant. Cela permet d'effectuer des mise à jour partiel du state si vous ne souhaitez pas
changer toutes les valeur qu'il contient.

### Réagir aux événement utilisateur

Les éléments DOM possèdent des attributs permettant d'écouter les interactions de l'utilisateur tel que `onclick`,
`onblur`, etc. De la même manière en JSX ces attributs existent mais sont écrits en camelCase. Par exemple `onclick`
devient `onClick`.

On pourra donc effectuer une mise à jour du state au clique d'un bouton :

```jsx
class Counter extends React.Component {
  state = {
    value: 0
  };

  handleClick = () => this.setState({ value: this.state.value + 1 });

  render() {
    const { value } = this.state;
    return (
      <div>
        Counter value: {value}
        <br />
        <button onClick={this.handleClick}>Increment</buutton>
      </div>
    );
  }
}
```

_Note : la syntaxe `handleClick = () => ...` est aussi une propriété de classe, mais avec la particularité de bind
l'instance de la classe à la fonction. Cela revient à écrire dans le constructeur
`this.handleClick = this.handleClick.bind(this);`. Cela permet de s'assurer que la méthode `handleClick` est toujours
bien appelé avec le bon `this`._

Les listeners reçoivent en argument un événement synthétique React qui englobe l'événement DOM original. Toutes les
propriétés de l'événement original sont conservées.

## Cycle de vie

Les composants React possèdent plusieurs événement internes au cours de leur utilisation dans l'application. Nous
allons nous concentrer sur 2 particulièrement qui sont `componentDidMount` et `componentWillUnmount` qui permettent
respectivement d'effectuer des opération quand le composant React est monté dans le DOM et juste avant qu'il soit
nettoyé du DOM quand celui-ci est détruit.

`componentDidMount` est très souvent utilisé pour aller chercher des données avec des appels XHR ou mettre en place
des timers. Comme il est appelé au moment où le composant apparaît dans le DOM, on s'assure qu'on n'execute pas des
actions pour rien car on sait que le composant va être affiché.

`componentWillUnmount` sert quand à lui à faire le nettoyage. Vous pouvez par exemple supprimer les timers créer
dans le `componentDidMount`. Enlever des listeners sur `window`, etc. Ceci est important car provoquer un `setState`
sur un composant qui est détruit aura pour conséquence de faire crasher votre application. En plus de cela, le fait
de ne pas nettoyer vos listeners/timers peut créer des fuites mémoires importantes.

### Utilisation

De la même manière que pour le state, les méthodes de cycle de vie ne sont disponible que dans les classes ES6 :

```jsx
class Counter extends React.Component {
  state = {
    value: 0
  };

  componentDidMount() {
    this.timer = setInterval(() => this.setState({ value: this.state.value + 1 }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { value } = this.state;
    return <div>Counter value: {value}</div>;
  }
}
```

## Exercice

Maintenant que vous êtes en mesure de gérer des interactions en React, nous allons ajouter à notre Choixpeau la
possibilité d'ajouter des étudiants aux différentes maisons. Pour ce faire, il va falloir ajouter un petit formulaire
en haut de la page permettant de saisir le nom et prénom d'un étudiant, puis un bouton permettant de valider.
L'étudiant sera ensuite assigné de manière aléatoire à l'une des 3 maisons.

Vous pouvez écouter l'événement `onChange` sur les éléments de type `input` pour stocker leur valeur dans le state.
La valeur d'un input peut être trouvé dans `event.target.value`.

Pour la soumission du formulaire, écoutez l'événement `onSubmit` de l'élément `form`. N'oubliez pas d'annuler le
comportement de base via `event.preventDefault()`.

Ajoutez un state au composant `App` contenant la liste des étudiants courante initialisée avec les données contenues
dans le JSON `./src/data/students.json` que vous passerez en prop à `HousesList`. Ensuite créez un composant
`StudentForm` qui contiendra le formulaire ainsi qu'un state contenant les valeurs des 2 champs textes. Passez en prop
de `StudentForm` une fonction de callback pour gérer la soumission du formulaire qui modifiera le state de `App`
avec le nouvel étudiant en paramètre.
