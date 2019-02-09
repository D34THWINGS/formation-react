# Étape 1

La première étape de la formation consiste à savoir utiliser `create-react-app`. Par conséquent la première étape ne possédera pas de tag.

Create-React-App est une CLI, créée par Facebook, pour vous aider à démarrer un projet React avec tout son outillage prêt à l'emploi. L'application React obtenue comprends une configuration Webpack complète avec une version dev et une version production. Vient aussi avec une configuration ESLint basique (outil de contrôle de qualité de code). L'installation des dépendances de base sera aussi effectuée. Enfin un repo Git est automatiquement mis en place dans le dossier créer.

Vous allez maintenant executer dans votre terminal :

```bash
npx create-react-app [nom de votre app]
```

_Note : NPX est une CLI fournie par NPM qui permet d'executer le binaire de n'importe quel node_module sans avoir à l'installer globalement._

Vous aurez donc en sortie, une application React fonctionnelle avec la structure suivante :

```
[nom de votre app]
  |- public
  |   |- index.html
  |   |- favicon.ico
  |   |- manifest.json
  |- src
  |   |- index.js
  |   |- index.css
  |   |- App.js
  |   |- App.test.js
  |   |- App.css
  |   |- logo.svg
  |   |- serviceorker.js
  |- node_modules
  |- package.json
  |- README.md
  |- yarn.lock / package-lock.json
```

## Explication des différents fichiers

#### `public`

Ce dossier contient tous les fichiers qui seront copiés tel quel dans votre dossier de destination par Webpack.

#### `public/index.html`

Ceci est le point d'entrée principale de votre application, ce sera la page HTML utilisée pour démarrer votre application React. Si vous souhaitez changer le titre, ajouter des meta, charger des third parties, etc, c'est ici qu'il faudra le faire.

#### `public/manifest.json`

Ce fichier est le manifest utilisé pour rendre votre application "progressive". Il contient les chemins vers les logos, les couleurs et les titres utilisés lorsqu'un utilisateur ajoute votre application à son Home Screen. Cela permet aussi de régler la couleur de la barre du navigateur dans certains cas.

#### `src`

Dossier principal de votre applciation. Tous les fichiers sources devront s'y trouver.

#### `src/index.js`

Fichier de démarage de l'application. Celui-ci sera votre point d'entrée JavaScript et sera donc le premier fichier executé. Pour toute tâche d'initialisation, utilisez donc ce fichier.

#### `src/App.js`

Composant React principal qui sera le top level component rendu par React DOM.

_Note : React DOM est librairie chargé de faire le lien entre le VDOM de React et le DOM HTML. En effet, React ne manipule pas directement la page mais passe par une copie en mémoire, appelée VDOM pour permettre de modifier la page en batch et économiser des performances._

#### `src/App.test.js`

Fichier de tests unitaires pour le composant `App`. Celui-ci sera executé avec Jest avec la commande `yarn test` que nous étudiront plus en détail dans une prochaine étape.

#### `src/serviceWorker.js`

Ce fichier permet de charger un Service Worker dans votre aplication afin de lui donner la possibilité d'être utilisé en offline, de profiter du caching/pre-caching des assets et des push notifications. Dans le cadre de cette formation, il ne sera pas détaillé sa mise en place, si vous souhaitez en savoir plus, vous pouvez consulter la documentation à ce sujet.

## Lancement de l'applciation

Pour voir votre application dans le navigateur, lancer la commande suivante :

```
yarn start
```

Ceci aura pour effet de lancer Webpack en mode developement. Chaque changement sur le code source de l'application sera observé et provoquera une recontsruction suiiv d'un rechargement de votre navigateur.

Vous pouvez donc dès à présent modifier le contenu du fichier `App.js` et les observer dans votre navigateur.

## Etape suivante

Pour passer à la deuxième étape de la formation vous pouvez supprimer l'application précédement créer et utiliser à partir de maintenant uniquement ce dossier comme application. Executez ensuite la commande suivante :

```
<<<<<<< HEAD
yarn next-step
=======
git checkout step-2
>>>>>>> First step
```
