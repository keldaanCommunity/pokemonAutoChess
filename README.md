# Pokemon Auto Chess

Non profit game. For fans, by fans.

## All rights to the Pokemon Company. Pokemon Auto Chess can stop at any time, whenever The Pokemon Company wants.

[![translation badge](https://inlang.com/badge?url=github.com/keldaanCommunity/pokemonAutoChess)](https://inlang.com/editor/github.com/keldaanCommunity/pokemonAutoChess?ref=badge)

![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)

Play: [https://pokemon-auto-chess.com](https://pokemon-auto-chess.com/)

Source: [https://github.com/keldaanCommunity/pokemonAutoChess](https://github.com/keldaanCommunity/pokemonAutoChess)

## Getting started

Install [Node LTS](https://nodejs.org/en). (It's recommended to use [nvm](https://github.com/nvm-sh/nvm) to install Node with the proper version)

Install project dependencies:
```
npm install
```

Download and pack all the game assets:
```
npm run assetpack
npm run download-music
```

Main libs used

Pokemon Auto Chess use mongoDB to store its data and Firebase for authentication. Those 2 dependencies requires credentials to use. Credentials will be stored in a `.env` at the root of the repository. If you do not have a `.env` in your root repository, make one now.

### MongoDB

You can either setup using the cloud based [MongoDB Atlas](https://www.mongodb.com/atlas/database) or using the [local installation](https://www.mongodb.com/try/download/community).

In order to play against bots, you will need to load bots data into your newly created database.

In both cases, create a database named `dev` with an empty collection named `botV2`. Then retrieve the URI connection. 

You may need to create an admin user under Database Access > Create a New User. Make sure to Add Built-in Role > Atlas admin.

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

This option is available in Project settings > Service accounts

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

To start the development server:

```
npm run dev
```

Game runs locally on port [http://localhost:9000/](http://localhost:9000/)

### Administration rights

You might want to have full access rights on your local version. To do so, you can set your role to `ADMIN` by editing your player rights in the `usermetadatas` table.

# Extensions

With VS Code, use Biome for formatting and linting and Inlang for translations management.

# Development

- Assets are automatically packed from `public/src/assets` to `public/dist/client/assets` with assetpack: `npm run assetpack` ; You will need to run assetpack everytime you change the assets
- The game use precomputed data stored in `app/models/precomputed` folder ; You will need to run `npm run precompute` everytime you change pokemon or synergy data

## Internationalisation

- In VSCode, use the inlang (i18n) extension
- Bind the Inlang: Extract Message on a keyboard touch, for example (²)
- Select the string you want to translate. Press ², a prompt will ask the id you want for this string. It'll add the corresponding entry in the english translation file.
- Once you are finished, you can run npm run translate to machine translate the missing translations

Please note that we only support the english language. Other languages are managed by the community.
