# Étape 5

Les applications frontend étant très dynamique et de plus en plus complexe en terme d'interface, il est venu la
nécessité de rendre les classes CSS dynamiques plutôt que d'en créer une quantité astronomique que l'on doit
composer entres elles.

C'est de cette idée qu'est né le concept du "CSS in JS". Le principe est de profiter encore une fois de toute la
puissance du JavaScript pour générer du CSS très complexe. Dans le cadre de cette formation nous feront le choix de la
librairie Emotion (car très performante), mais il en existes d'autres très répendues tel que
[Styled-Components](https://www.styled-components.com/).

La puissance du CSS in JS en React va encore plus loin que tu simple CSS dynamique. En effet il va nous permettre
d'adapter le CSS de nos composant en fonction de leurs props. Par exemple avec une propriété `size` sur notre composant
on pourra contrôler de multiples propriétés CSS en même temps tel que `padding`, `margin`, `width`, `heigt`, etc.

Pour commencer à utiliser Emotion, installer le via la commande :

```
yarn add --save @emotion/core @emotion/styled
```

Il est ensuite possible d'utiliser Emotion de 2 manières différentes :

- Via une prop `css` sur les composants React (nécessite cependant de rajouter des lignes de configuration Babel dans
vos fichiers).
- Via des composants stylisés, plus simple à utiliser mais potentiellement plus difficile à utiliser dans des cas très
dynamiques.

Nous ne verrons que la deuxième méthode dans cette formation.

## Styled components

Emotion permet de créer des composants React avec des styles qui lui sont attachés. Cela se présente sous la forme
d'une template string taggée :

```jsx harmony
import React from 'react';
import styled from '@emotion/styled'

const Button = styled.button`
  color: turquoise;
`;

const MyComponent = () => (
  <Button>
    Button content
  </Button>
)

export default MyComponent;
```

Le CSS que vous écrivez est strictement scopé à ce composants. Si vous souhaitez appliquer des styles à des éléments
génériques tel que `div` ou `a`, vous devrez utiliser des styles globaux que nous verrons après.

Ces composants sont réutilisables à l'infini et son particulièrement pratiques pour construire des blocks de
constructions pour votre interface que vous aurez juste à placer dans votre JSX.

Pour rendre un composant Emotion dynamique, il suffit d'utiliser l'interpolation dans la template string de son CSS et 
d'y passer une fonction. Celle-ci recevra en paramètre les propriété du composant :

```jsx harmony
const Button = styled.button`
  color: ${props => props.color};
`;

render(<Button color="red">My button</Button>)
```

Le caractère `&` dans la template string permet de référencer le composant lui-même, ainsi on pourra modifier les
styles avec différents modificateurs tels que `:hover`, `:focus`, etc, comme suis :

```js
const Button = styled.button`
  color: ${props => props.color};
  &:hover {
    opacity: 0.8;
  } 
`;
```

Mais aussi pour appliquer des style à ce composant lorsqu'il est contenu dans d'autres composants spécifiques, tel que :

```js
const Button = styled.button`
  color: ${props => props.color};
  a & {
    cursor: pointer;
  } 
`;
```

N'hésitez pas à consulter la [documentation](https://emotion.sh/docs/styled) pour plus d'informations.

## Styles globaux

Il peut parfois être intéressant d'injecter du CSS dit "global" pour pouvoir appliquer des styles à n'importe quel type
d'élément sans aucune restriction. Pour ce faire, il existe un composant spécifique appelé `Global` dans
`@emotion/core`. Celui-ci possède une prop nommée `styles` qui va contenir le CSS à appliquer globalement. Les styles
devront être générés avec la fonction de tag `css`. Par exemple :

```jsx harmony
const styles = css`
  body {
    background-color: red;
  }
`;

const MyComponent = () => (
  <Global styles={styles} />
);
```

Retenez tout de même que ce genre d'utilisation doit rester marginal, principalement pour déclarer vos `@font-face` et
appliquer des styles au `body` mais rien de plus.

## Themes

Lorsque vous développez une application de large envergure, il est préférable de conserver le thème (couleurs,
espacements, polices, tailles, etc) à une seul endroit pour s'assurer de son homogénéité. Pour ce faire, Emotion
possède un mécanisme utilisant le contexte de React pour transmettre de manière implicite le thème à tous les
composants de l'application.

### Contexte React

Comme énoncé plus haut, React possède un moyen de passer des données de manière implicite à tous les composants via
ce que l'on appelle le contexte. Depuis React 16, le contexte est accessible via une paire de composants : un
Provider et un Consumer, créés à partir de la fonction `React.createContext()`.

```js
import React from 'react';

const initialContextValue = 'foo';
const { Consumer, Provider } = React.createContext(initialContextValue);
```

Le Provider ne comporte qu'un seule prop `value` qui sera la valeur injectée dans le contexte.
Toute modification apportée à cette propre aura pour effet de trigger le re-render de tous les Consumers qui lui sont
rattachés. Le provider doit être impérativement situé en amont de ses Consumers dans l'arborescence des composants
React. Il est donc recommandé de les placer dans votre composant racine.

```jsx harmony
const App = () => (
  <MyProvider value="foo">
    <RestOfTheApp />
  </MyProvider>
)
```

Le Consumer quand à lui ne possède aucune prop, mais prend en tant qu'enfant une fonction (aussi appelé render prop) :

```jsx harmony
const MyComponent = () => (
  <MyConsumer>
    {contexteValue => (
      <AnotherComponent>{contexteValue}</AnotherComponent>
    )}
  </MyConsumer>
)
```

Cette fonction recevra en paramètre la valeur injectée par le provider (soit la prop `value`).

### ThemeProvider

Emotion possède un Provider pour le thème nommé `ThemeProvider` qui prend une seule prop nommée `theme`. Il
sera passé à tous les styled components et pourra être récupéré via la prop theme dans les fonctions d'interpolation
comme suis :

```js
const MyButton = styled.button`
  color: ${({ theme }) => theme.palette.primary.main};
`;
```

Vous pouvez aussi utiliser le HOC (Higher Order Component) `withTheme` pour que votre composant reçoive le thème en
propriété :

```js
const MyComponent = ({ theme }) => (
  <div>Primary color is: {theme.palette.primary.main}</div>
)

export default withTheme(MyComponent);
```

Votre theme peut contenir absolument ce que vous voulez, il n'y a aucun format particulier à respecter.

## Exercice

Il est temps maintenant de remplacer le CSS dans notre application par Emotion. Créer des styled components pour chaque
classe CSS.

Dans un deuxième temps, implémentez un thème qui contiendra les informations suivantes :

```js
const theme = {
  typography: {
    default : {
      fontSize: '16px',
      fontWeight: 'normal',
      fontFamily: '\'Roboto\', Helvetica, Arial, sans-serif',
    },
    variants: {
      menu: { fontSize: '32px', fontWeight: 'bold' },
      title: { fontSize: '24px', fontWeight: 'bold' },
    }
  },
  palette: {
    background: '#333'
  }
}
```

Remplacer toutes les utilisations de la couleur `#333` par `theme.palette.background` et enfin créez un styled component
basé sur un `span` nommé `Typography`. Celui-ci devra appliquer les styles par défaut de font depuis le thème ou
utiliser la variante si elle est spécifiée avec la prop `variant`. Entourez ensuite tous les textes de l'application
dans ce composant pour leur appliquer les styles de texte souhaités.

Votre composant devra gérer les trois cas suivants :

```jsx harmony
render([
  <Typography>Default font styles</Typography>, // fontSize: 16px, fontWeight: 'normal', fontFamily: ...
  <Typography variant="title">Default + title font styles</Typography>, // fontSize: 24px, fontWeight: 'bold', fontFamily: ...
  <Typography variant="menu">Default + menu font styles</Typography>, // fontSize: 32px, fontWeight: 'bold', fontFamily: ...
])
```

:warning: N'oubliez pas de mettre à jour vos tests et de vérifier le linter.
