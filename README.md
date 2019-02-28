# Étape 6

Nous avons vu précédemment comment un composant pouvait contenir un state via les classes ES6 qui étendent
`React.Component`. Depuis React 16.8, il existe maintenant une approche fonctionnelle pour arriver au même résultat,
appelé les Hooks.

## Hooks

Ils se présentent sous forme de fonctions qui se câblent directement à React. Cette approche rend le code plus facile
à lire, plus simple à tester et permet de séparer de l'orienté Objet qui est presque totalement inutile en JavaScript.

Les hooks sont composables entre eux et permettent d'atteindre des comportements complexes en quelques lignes de code
seulement.

### `useState`

`useState` est le hook qui permet de remplacer complètement le système des states via classe ES6. Il se présente
sous la forme d'une fonction qui prend en paramètre un état initial et renvoie un array contenant l'état actuel du
state et une fonction permettant de changer sa valeur.

```jsx harmony
const MyComponent = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      Counter value is: {count}
      <br />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### `useReducer`

Ce hook est basé sur le concept de [Redux](https://redux.js.org/) et permet de gérer des states complexes et de
multiples interactions utilisateur au sein d'un même composant via un système d'action et d'une fonction de réduction.
Celle-ci calcule le nouvel état du composant en fonction de l'action et de son ancien état. On pourra donc augmenter
notre exemple du compteur ci-dessus pour arriver à :

```jsx harmony
const initialState = {count: 0};

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error('Unhandled action');
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

A chaque fois que l'on appelle dispatch avec une action, celle-ci passe à travers le reducer et calcule le nouveau
state. Si rien n'a changé, React ne fera pas de nouveau rendu.

Il est fortement recommandé de stocker les types d'actions dans des constantes que vous réutiliserez dans toute votre
application. Le mieux étant de créer un fichier contenant les actions. Il est aussi recommandé d'utiliser des factory
pour vos actions (appelées action creators), pour uniformiser la manière dont vous créez les actions. Une autre bonne
pratique est de stocker le type de l'action dans `type` et les données de l'action dans `payload`. Cela donne un fichier
d'actions comme suis :

```js
export const INCREMENT = 'INCREMENT';
export const increment = (amount = 1) => ({ type: INCREMENT, payload: { amount } })

export const DECREMENT = 'DECREMENT';
export const decrement = (amount = 1) => ({ type: DECREMENT, payload: { amount } })
```

Et votre composant se changera en :

```jsx harmony
const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT:
      return {count: state.count + action.payload.amount};
    case DECREMENT:
      return {count: state.count - action.payload.amount};
    default:
      throw new Error('Unhandled action');
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </>
  );
}
```

## Exercice

Il est temps maintenant de remplacer toutes les composants classes ES6 dans notre application par des composants
fonctionnels utilisant les hooks. Ajoutez, en même temps, la possibilité de supprimer des étudiants d'une maison, cela
permettra d'utiliser `useReducer` dans le composant `App` en lui faisant gérer deux actions : ajout et suppression.
