# Formation JavaScript / React

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Bienvenue dans la formation JavaScript / React. Cette formation en 2 jours a pour but de vous apprendre à construire une
application React from scratch. Cette application sera résiliente et durable car basée sur les bonnes pratiques. Les
étapes de la formation seront donc :

- Créer le squelette de l'application à l'aide de `create-react-app` et comprendre sa configuration.
- Création de composants, stateless et stateful dans le but de produire une interface utilisateur interactive.
- Ecriture de tests unitaires avec Jest et Enzyme.
- Utilisation du contexte pour configurer l'application de manière globale.
- Design CSS de l'interface avec styled-components et theming.
- Découverte des hooks pour remplacer les composants stateful.

## Mode d'emploi

Votre application sera construite au fur et à mesure tout au long de la formation. A chaque étape vous sera proposé un
point de sauvegarde si jamais vous n'avez pas eu le temps de finir ou si vous n'arrivez pas à retrouver un état
d'application stable. Ces points de sauvegrade se présenteront sous la forme de branches Git que vous pourrez atteindre
via la commande `git checkout [branch]`.

La liste des branches se trouvera en permanence à la fin du README. Les instructions pour chaque étapes seront aussi
rapellées dans le README sur chaque branche.

La commande `yarn next-step` vus permettra depuis n'importe quelle étape de passer à la suivante.

### Prérequis

Avant de commencer, assurez vous de posséder localement une version de Node supérieure ou égale à 10. Vous pouvez l'installer via `brew` avec la commande suivante :

```bash
brew install node
```

Ou via NVM, outil permettant de gérer plusieurs versions de Node sur la même machine (voir l'installation de NVM).
Pour ce faire :

```bash
nvm install 10
```

Ou encore via Docker :

```
docker pull node:10
```

Vous devrez aussi être familier avec l'utilisation des `node_modules` via `yarn` ou `npm`. Les bases du JavaScript et
la connaissance de la syntaxe jusqu'à la spécification ES7 sont un plus. Si vous n'êtes pas encore à l'aise avec la
syntaxe, n'hésitez pas à consulter le README qui contiendra des notes pour vous aider.

## Get Started

Pour démarrer la première étape de la formation, lancer la commande suivante :

```
yarn next-step
```
