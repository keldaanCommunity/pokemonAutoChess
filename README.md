# Pokemon Auto Chess

Non profit game. For fans, by fans.

## All rights to the Pokemon Company. Pokemon Auto Chess can stop at any time, whenever The Pokemon Company wants.

[![translation badge](https://inlang.com/badge?url=github.com/keldaanCommunity/pokemonAutoChess)](https://inlang.com/editor/github.com/keldaanCommunity/pokemonAutoChess?ref=badge)

<a href="https://discord.gg/6JMS7tr">
<img src="https://img.shields.io/discord/737230355039387749.svg?style=for-the-badge&colorB=7581dc&logo=discord&logoColor=white">
</a>

![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)

Play: [https://pokemon-auto-chess.com](https://pokemon-auto-chess.com/)

Support: [https://en.tipeee.com/pokemon-auto-chess](https://en.tipeee.com/pokemon-auto-chess)

Discord: [https://discord.com/invite/6JMS7tr](https://discord.com/invite/6JMS7tr)

Source: [https://github.com/keldaanCommunity/pokemonAutoChess](https://github.com/keldaanCommunity/pokemonAutoChess)

## Getting started

Pokemon Auto Chess use mongoDB to store its data and Firebase for authentication. Those 2 dependencies requires credentials to use. Credentials will be stored in a `.env` at the root of the repository.

### MongoDB

You can either setup using the cloud based [https://www.mongodb.com/atlas/database](MongoDB Atlas) or using the [https://www.mongodb.com/try/download/community](local installation).

In order to play against bots, you will need to load bots data into your newly created database.

In both cases, create a database named `dev` with an empty collection named `botV2`. Then retrieve de URI connection.

- A cloud uri will look like smth `mongodb+srv://admin:<password>@<cluster>.mongodb.net/dev?retryWrites=true&w=majority`.
- The local uri will look smth like `mongodb://localhost:27017/dev`.

In MongoDB Compass, import bots data (`./db-commmands/botv2.json`) in the `botV2` empty collection.

In the `.env` at the root repository, add the mongoDB URI:

```
MONGO_URI=mongodb://localhost:27017/dev
```

### Firebase

Pokemon Auto Chess use the Firebase authentication module to connect to the game.

First create an account and a firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).

Inside the firebase project, create a web app called for example `pokemon-auto-chess-test`.

Add your newly created firebase config in `.env`. All those credentials should be available in the "Configure SDK" section.

```
FIREBASE_API_KEY=<firebase_api_key>
FIREBASE_AUTH_DOMAIN=<firebase_auth_domain>
FIREBASE_PROJECT_ID=<firebase_project_id>
FIREBASE_STORAGE_BUCKET=<firebase_storage_bucket>
FIREBASE_MESSAGING_SENDER_ID=<firebase_messaging_sender_id>
FIREBASE_APP_ID=<firebase_app_id>
```

Then setup the authentication module. In sign in methods, only choose mail/password and anonymous.

You need to generate a SDK Admin Firebase private key for the server to be able to connect as administrator of the firebase project.

This option is available in parameters project / service account

The private key is a json that contain those informations:

```json
{
  "type": "<type>",
  "project_id": "<project_id>",
  "private_key_id": "<private_key_id>",
  "private_key": "<private_key>",
  "client_email": "<client_email>",
  "client_id": "<client_id>",
  "auth_uri": "<auth_uri>",
  "token_uri": "<token_uri>",
  "auth_provider_x509_cert_url": "<auth_provider_x509_cert_url>",
  "client_x509_cert_url": "<client_x509_cert_url>",
  "universe_domain": "<universe_domain>"
}
```

Add those informations to the `.env`

```
FIREBASE_CLIENT_EMAIL=<client_email>
FIREBASE_PRIVATE_KEY=<private_key>
```

And you are done for the configuration part.

To start the development,

```
npm install
npm run dev
```

Game runs locally on port [http://localhost:9000/](http://localhost:9000/)

# Extensions

With VS Code, use Prettier, Eslint, Inlang.
