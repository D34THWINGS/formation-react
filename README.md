# Étape 8

Nous avons vu comment construire un hook simple pour faire des appels XHR avec `useState` et `useEffect`. Nous avons
aussi vu comment gérer des actions au sein de notre application avec `useReducer`. Dans notre exercice précédant il
était demandé pour des raisons de simplification de ne pas utiliser `useReducer` pour faire les appels XHR, nous
allons maintenant voir comment procéder.

## Composition complexe

Commençons par écrire un reducer qui pourrait gérer des appels XHR : Nous avons besoin de 3 actions, une pour le
démarrage du call et indiquer que l'on est en train de charger, une pour le succès et une pour l'erreur. On pourra
donc écrire :

```js
const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_STUDENT':
      // Handle student add
    case 'DELETE_STUDENT':
      // Handle student delete
    case 'FETCH_STUDENTS_START':
      return { ...state, loading: true };
    case 'FETCH_STUDENTS_SUCCESS':
      return { ...state, loading: false, students: action.payload };
    case 'FETCH_STUDENTS_ERROR':
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}
```

On commence à voir que cela représente potentiellement beaucoup d'actions si plusieurs appels à l'API sont fait. On
peut donc imaginer un reducer qui fonctionnerait pour n'importe quel appel à l'API et que l'on pourrait réutiliser à
souhait au sein d'autres reducers.

### Composition de reducers

Les reducers, au même titre que les hooks, sont de simples fonctions. Il est donc possible aussi de les composer entre
eux afin de les éclater en plus petits morceaux. Par exemple :

```js
const fetchStudentsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_STUDENTS_START':
      return { ...state, loading: true };
    case 'FETCH_STUDENTS_SUCCESS':
      return { ...state, loading: false, students: action.payload };
    case 'FETCH_STUDENTS_ERROR':
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_STUDENT':
      // Handle student add
    case 'DELETE_STUDENT':
      // Handle student delete
    default:
      return fetchStudentsReducer(state, action);
  }
}
```

`fetchStudentsReducer` pourrait très bien être utilisé pour n'importe quel autre call XHR s'il ne stockait pas ses
données dans le state global de l'application et s'il n'était pas dépendant de la clé `students` pour stocker les
résultats du call. Essayons donc de voir comment cela serait possible :

```js
const fetchReducer = actionPrefix => (state, action) => {
  switch (action.type) {
    case `${actionPrefix}_START`:
      return { ...state, loading: true };
    case `${actionPrefix}_SUCCESS`:
      return { ...state, loading: false, data: action.payload };  // <-- remplacement de `students` par `data`
    case `${actionPrefix}_ERROR`:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}

const fetchStudentsReducer = fetchReducer('FETCH_STUDENTS');

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_STUDENT':
      // Handle student add
    case 'DELETE_STUDENT':
      // Handle student delete
    default:
      return { students: fetchStudentsReducer(state.students, action) }; // <-- Stockage dans `state.students`
  }
}
```

Malheureusement le code ci-dessus pose un problème. Il génère systématiquement un nouvel objet lorsque que l'on tombe
dans le cas par défaut, ce qui veut dire un re-render systématique alors que ce n'est pas forcément nécessaire. Pour
palier à ce problème on doit donc ajouter une condition pour vérifier que `state.students` n'a pas changé pour
générer un nouvel objet.

```js
const appReducer = (state, action) => {
  switch (action.type) {
    // Other cases...
    default:
      const newStudentsState = fetchStudentsReducer(state.students, action);
      return newStudentsState !== state.students ? { ...state, students: newStudentsState } : state;
  }
}
```

Nous avons maintenant un sous-reducer complètement fonctionnel et non-dépendant d'un call particulier. Cependant on voit
vite que si plusieurs call sont gérés dans le même reducer, cela va vite devenir chaotique :

```js
const appReducer = (state, action) => {
  switch (action.type) {
    // Other cases...
    default:
      const newStudentsState = fetchStudentsReducer(state.students, action);
      const newHousesState = fetchHousesReducer(state.house, action);
      let newState = state;
      if (newStudentsState !== state.students) {
        newState = { ...newState, students: newStudentsState };
      }
      if (newHousesState !== state.houses) {
        newState = { ...newState, students: newHousesState };
      }
      return newState;
  }
}
```

Encore une fois, essayons de factoriser ce code pour minimiser la répétition :

```js
const composeReducers = (reducers) => (state, action) => Object.entries(reducers).reduce((oldState, [key, reducer]) => {
  const reducerState = reducer(oldState[key], action);
  return reducerState !== oldState[key] ? { ...oldState, [key]: reducerState } : oldState;
}, state);

const fetchReducers = composeReducers({
  students: fetchReducer('FETCH_STUDENTS'),
  houses: fetchReducer('FETCH_HOUSES'),
});

const appReducer = (state, action) => {
  switch (action.type) {
    // Other cases...
    default:
      return fetchReducers(state, action);
  }
}
```

Pour détailler un peu plus le fonctionnement de `composeReducers`, c'est une fonction qui va donc prendre en paramètre
une collection de reducers, et qui en sortie, renverra un autre reducer chargé d'appeler tous ceux présent dans la
collection un par un. Dans le cas ou un reducer renvoie un objet différent de l'ancien state, on générera un nouveau
state global sinon l'ancien sera retourné.

### Adaptation des hooks

Maintenant que nous avons un moyen simple de gérer des appels à l'API dans notre reducer, il est temps de regarder du
côté de nos hooks pour voir comment on peut les simplifier aussi. En effet pour le moment, si on veut faire un appel
pour récupérer les étudiants, il va nous falloir écrire :

```js
const [state, dispatch] = useReducer(appReducer, initialState);
useEffect(() => {
  dispatch({ type: 'FETCH_STUDENTS_START' });
  fetch('/students')
    .then((response) => response.json())
    .then((data) => dispatch({ type: 'FETCH_STUDENTS_SUCCESS', payload: data }))
    .catch((e) => dispatch({ type: 'FETCH_STUDENTS_ERROR', payload: e }));
}, []);
```

Encore une fois, on voit qu'il est possible de factoriser ce code en créant un hook qui va gérer tout cela pour nous :

```js
const useFetchWithDispatch = (actionPrefix, url, options = {}) => (dispatch) => {
  useEffect(() => {
    dispatch({ type: `${actionPrefix}_START` });
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => dispatch({ type: `${actionPrefix}_SUCCESS`, payload: data }))
      .catch((e) => dispatch({ type: `${actionPrefix}_ERROR`, payload: e }));
  }, []);
}
```

Que l'on utilisera de la manière suivante :

```js
// Outside of the component
const useFetchStudents = useFetchWithDispatch('FETCH_STUDENTS', '/students');

// Inside render function
const [state, dispatch] = useReducer(appReducer, initialState);
useFetchStudents(dispatch);
```

_Note: la volonté de couper `useFetchWithDispatch` en deux fonctions permet de réutiliser facilement dans n'importe
quel composant avec un reducer l'appel à /students sans avoir à reconfigurer l'url, le prefix des actions et les options
de fetch._

### State et dispatch globaux

Dans notre application, plusieurs composants sont amenés à travailler avec le state de l'application (`StudentForm` et
`StudentsList`). Pour éviter d'avoir à passer des props de parent à enfant de manière répétée (props drilling), on
peut utiliser le context pour stocker notre state et notre dispatch. Pour cela suffira de créer un nouveau couple
Provider/Consumer et de passer en `value` un objet contenant `{ state, dispatch }`. Chaque consumer pourra alors
récupérer via le consumer le state ou le dispatch selon ses besoin via le Consumer.

```jsx harmony
const { Provider, Consumer } = React.createContext({});

const AppStateProvider = ({ children }) => {
  const store = useReducer(mainReducer, initialState);
  return (
    <Provider value={store}>{children}</Provider>
  );
}

// In any other component bellow AppStateProvider
const MyComp = () => (
  <Consumer>
    {({ state, dispatch }) => `Hello ${state.user.firstName}`}
  </Consumer>
)
```

L'utilisation du context via le composant `Consumer` peut vite se réveler lourde à l'utilisation en terme de syntaxe, dû
principalement à la callback utilisée pour récupérer la valeur du context. Il existe deux méthode pour palier à cela.

#### Higher Order Component

Première solution, il est possible d'utiliser un pattern appelé HOC (Higher Order Component).
Le pattern du HOC est une fonction qui prend en paramètre un composant et qui retourne un autre composant qui est son
augmentation. Cela permet bien souvent de réutiliser du code de rendu commun. Voici donc comment écrire un HOC qui
simplifiera l'utilisation du context :

```jsx harmony
const withState = Component => {
  const NewComponent = props => (
    <Consumer>
      {({ state, dispatch }) => <Component {...props} state={state} dispatch={dispatch} />}
    </Consumer>
  );
  NewComponent.displayName = `WithState(${Component.displayName || Component.name})`;
  return NewComponent;
} 
```

_Note : `displayName` sert uniquement à des fins de debugging dans les React Developer Tools. En effet cela permet
d'éviter les <Unknown> ou que tous les composants qui utilisent le HOC s'appellent <NewComponent>._

Les HOC s'utilisent ensuite de la manière suivante :

```jsx harmony
const CompontToWrap = ({ state, dispatch }) => `Hello ${state.user.firstName}`;

export default withState(CompontToWrap);
```

#### `useContext`

La deuxième solution est d'utiliser le hook `useContext` qui permet de récupérer une valeur depuis le context React.
Il prend en paramètre l'objet *entier* retourné par la fonction `React.createContext` et retourne la valeur actuelle
du Provider (props `value`). Rappel, c'est le Provider le plus proche en remontant l'arborescence React qui sera utilisé.

On pourra don écrire un hook qui retourne ce qui nous intéresse :

```jsx harmony
const context = React.createContext({});

const useAppState = () => useContext(context);
```

Et l'utiliser comme ceci :

```jsx harmony
const MyComp = () => {
  const { state, dispatch } = useAppState();
  return `Hello ${state.user.firstName}`;
}
```

### Conclusion

Nous avons maintenant la possibilité de dispatch des actions depuis n'importe où dans notre application grâce au context et
le hook `useAppState`. Nous avons aussi le moyen de gérer entièrement tous nos appels API via le hook `useFetchWithDispatch`,
qui permet d'influer sur l'état de notre application global selon le retour de la requête. On pourra donc écrire un composant
qui récupère des données de cette manière :

```jsx harmony
const useFetchStudents = useFetchWithDispatch(FETCH_STUDENTS, '/students');

const MyComp = () => {
  const { state, dispatch } = useAppState();
  useFetchStudents(dispatch);

  return (
    <ul>
      {state.students.data.map(student => <li>{student.firstName} {student.lastName}</li>)}
    </ul>
  )
};
```

Et dans le reducer principale de l'application :

```js
export const FETCH_STUDENTS = 'FETCH_STUDENTS';

export default composeReducer({
  students: fetchReducer(FETCH_STUDENTS),
});
```

## Exercice

Maintenant que vous avez toute les clés en main pour gérer des comportement complexes dans l'application, le but va être de
gérer toutes les interactions utilisateur via des actions et le reducer global de l'application. Voivi la liste des choses
que vous aurez à faire :

- Ecrire le `AppStateProvider` et l'inclure à la racine de l'application pour rendre le state disponnible dans toute
l'application.
- Ecrire le reducer princpale de l'application qui va gérer toutes les actions de l'utilisateur.
- Ecrire tous les action creators qui seront chargé de gérer les différentes interractions.
- Remplacer les `useState` par `useAppState`.
