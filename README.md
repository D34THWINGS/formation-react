# Étape 4

Maintenant que notre application commence à grossir, il est temps de mettre en place des choses permettant de
garantir sa stabilité et sa maintenabilité.

## ESLint

ESLint est un linter (outil permettant de vérifier la syntaxe du code). Celui-ci est intégré de base à
`create-react-app` via un plugin Webpack qui affiche les erreurs directement dans votre navigateur. Cependant sa
configuration est extrêmement laxiste. C'est pourquoi nous allons à la place utiliser la configuration d'AirBnB.

Pour ce faire, nous allons devoir installer le package suivant :

```bash
yarn add -D eslint-config-airbnb
```

Vous allez pouvoir ensuite créer un fichier de configuration ESLint à la racine du projet appelé `.eslintrc`, qui
contiendra le nom de la configuration à étendre, ainsi que différentes surcharges de règles si vous le souhaitez.
Nous partiront sur la configuration suivante :

```json
{
  "extends": ["airbnb"],
  "rules": {
    "max-len": ["error", 120]
  }
}
```

_Note : La configuration de base est assez restrictive en terme de longueur de ligne, c'est pourquoi nous l'étendont à
120 caractères._

Nous avons besoin ensuite d'un fichier permettant d'ignorer des fichiers du linter qui se situera aussi à la racine
du projet et nommé `.eslintignore` :

```
node_modules/
build/
```

Vous pouvez ensuite configurer votre IDE pour utiliser ESLint. Sur VSCode il existe une extension, sur WebStorm il est
intégré de base.

Nous allons ensuite ajouter un script Yarn via notre `package.json` pour simplifier l'utilisation du linter. Cette
commande pourra être executée sur votre CI, ou dans vos hook Git pre-push/pre-commit.

```json
{
  "lint": "eslint '**/*.{js,jsx}'"
}
```

## Jest

Jest un outil de test qui nous servira à écrire des tests unitaires pour notre application. Celui-ci fonction par
système de suites de tests contenus dans des fichiers `*.spec.{js,jsx}` ou `*.test.{js,jsx}`. Je vous recommande de
faire un fichier de test par composant dans un dossier `__tests__/` immédiatement adjacent à votre composant et de le
faire terminer par `.spec.jsx`. Par exemple pour le composant `App` cela donnera la structure suivante :

```
src
 |- App.js
 |- __tests__
 |  |- App.spec.js
```

Ces suites de test utilisent une API similaire à celle de Mocha et Jasmine. Vous écrirez donc vos tests à l'aide des
méthodes `describe`, `it` et `expect`, ce qui donnera l'exemple suivant :

```js
import App from '../App.js';

describe('App', () => {
  it('should exist', () => {
    expect(App).toBeDefined();
  });
});
```

Les tests peuvent être lancés via la commande `yarn test`.

Pour tester de manière simple le rendu d'un composant React, AirBnB a développé un package appelé `enzyme` qui permet
de rapidement accéder à n'importe quel élément du rendu. Nous allons donc commencer par installer Enzyme via :

```bash
yarn add -D enzyme enzyme-adapter-react-16
```

Il faudra ensuite créer un fichier pour configurer Enzyme afin de lui dire quel adapter utiliser pour faire le rendu
React. Ce fichier sera lancé par Jest avant chaque suite de test. Le chemin pour le fichier sera
`./src/jestSetup.js`, il contiendra le code suivant :

```
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
```

Pour configurer Jest pour utiliser ce fichier, ajoutez les lignes suivantes à la fin de votre `package.json` :

```
"jest": {
  "setupTestFrameworkScriptFile": "<rootDir>/tests/jestSetup.js",
}
```

Vous êtes maintenant prêt à écrire votre premier test de rendu React.

## Enzyme

Les tests de rendu React peuvent se présenter sous 2 formes, les `shallow` et les `mount`. Le premier permet de rendre
uniquement le composant passé en paramètre alors que le second permet de rendre aussi l'intérieur des composants
enfant. On utilisera donc plus facilement `shallow` pour des tests unitaires et `mount` pour des tests d'intégration.

Lorsque l'on utilise une de ces 2 méthodes, Enzyme nous renvoie un wrapper autour du composant React qui possède toute
une API similaire à JQuery pour trouver des éléments et vérifier qu'ils possèdent certaines propriétés. Par exemple,
la méthode `find` nous permettra de chercher parmi tous les composants enfants. On pourra donc tester que le
composant `HouseList` rend bien une `div` par maison de la manière suivante :

```jsx harmony
import React from 'react';
import { shallow } from 'enzyme';
import HousesList from '../HousesList';

describe('HousesList', () => {
  it('should render a div per house', () => {
    const wrapper = shallow(<HousesList students={[]} />);
    expect(wrapper.find('div.housesList__house').length).toEqual(3);
  });
});
```

La limitation de ce type de test se ressent assez rapidement lorsque l'on a un grand nombre de props et de sous
composant à vérifier, c'est pourquoi Jest possède la capacité de faire des tests de Snapshot.

## Snapshots

Les tests snapshots sont des tests qui consiste à écrire le résultat d'un test dans un fichier et de comparer les
prochaines executions du même test avec ce fichier. En cas de différence, le test échouera. Ce la est très utile
lorsque couplé à Enzyme, car celui-ci offre la possibilité de faire un rendu spécial snapshot qui permet de voir
instantanément sous forme de pseudo HTML le rendu React. Mais tout autre objet JavaScript pouvant être transformé
en JSON peut fonctionner. La méthode pour effectuer des tests snapshot est `expect(value).toMatchSnapshot()`.

Pour rendre les tests snapshots avec Enzyme possible il faut tout d'abord installer `enzyme-to-json` en tant que
`devDependencies` et ensuite changer la configuration de Jest pour utiliser son serializer de snapshot :

```json
{
  "jest": {
    "snapshotSerializers": [
      "enzyme-to-json/serializer"
    ]
  }
}
```

On pourra donc ensuite changer notre test pour `HousesList` par :

```jsx harmony
import React from 'react';
import { shallow } from 'enzyme';
import HousesList from '../HousesList';

describe('HousesList', () => {
  it('should render a div per house', () => {
    const wrapper = shallow(<HousesList students={[]} />);
    expect(wrapper).toMatchSnapshot();
  });
});
```

Il est aussi possible de tester des interactions avec Enzyme via la fonction `trigger`. Par exemple, pour tester le
submit d'un formulaire on écrira :

```js
wrapper.find('form').trigger('submit', eventMock);
```

## Exercice

Maintenant que vous êtes en mesure de tester et maintenir correctement votre application, écrivez les tests pour
couvrir 100% de votre application. Vous pouvez vérifier le taux de couverture via `yarn test --coverage`. Assurez vous
aussi que votre app ne contienne aucune erreur de lint via la commande `yarn lint`.
