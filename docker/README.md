# Deploy Pokemon-Auto-Chess With Docker

This methods suites anyone who has an environment with Docker and would like to host pokemon-auto-chess in an isolated containerized environment. This could be a VPS, a dedicated server, or a home server. The Docker image also makes it possible to run multiple game servers by changing the port binding settings and access different databases.

This method also sets up a local mongodb-server in the `docker-compose.yaml`-file so you only need to setup Firebase to get Pokemon-Auto-Chess up and running with Docker.

## Pre-requisite

To work with the Docker image, you should comfortable with:
- Building and running Docker images
- Basic Linux and
- Working with command line interface

## Building the Docker Image

- First, follow the instructions on the [Official Install Docker Engine](https://docs.docker.com/engine/install/) documentation.
- Clone the GitHub repository or download and extract a release file.
- Open terminal/cmd application and navigate to pokemonAutoChess directory
- Run `docker compose build` and wait for the build process to finish.
- If the build process was successful you'll see `[+] Building 176.2s (19/19) FINISHED`. Note: This finish message will show on top.

## Running / Deploying the Docker Image

### Preparations
Now that the image has been built, continue with setting up Firebase from the [Deployment Tutorial](/deployment/README.md). Copy the `.env.EXAMPLE`-file and name it `.env`, `.env.development`, or `.env.production` as it suits you.

For MongoDB you will need to create an initial root user, and root password, like the following example. When MongoDB first starts up, it reads this value and adds the user/password to the admin-database. Which is why we need to specify the authSource in the MongoDB connection string; `MONGO_URI: "mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/dev?authSource=admin"

```
MONGO_INITDB_ROOT_USERNAME="root"
MONGO_INITDB_ROOT_PASSWORD="VERY-SECURE-PASSWORD"
```

### Run Docker Compose

The following command starts the database and the application and runs it in the background

```
$ docker compose up -d
[+] Running 2/2
 ✔ Container pokemonautochess-mongo-1  Started                               0.2s
 ✔ Container pokemonautochess-app-1    Started                               0.2s
$
```

### Watch application logs from Docker Compose

You can simply run `docker compose logs -f` to start tailing the logs of both the application and database server.

If you want to just watch the logs from the application, run `docker compose logs -f app`.
Or similiar for the database, run `docker compose logs -f mongo`.

```
$ docker compose logs -f app
app-1  | ℹ️  optional .env file not found: .env.development, .env
app-1  | precompute-types: 7.409ms
app-1  | precompute-rarity: 3.459ms
app-1  | precompute-pokemon-data: 215.524ms
app-1  | precompute-types-and-categories: 8.66ms
app-1  | Refreshing leaderboards...
app-1  | ✅ Express initialized
app-1  |
app-1  |        ___      _
app-1  |       / __\___ | |_   _ ___  ___ _   _ ___
app-1  |      / /  / _ \| | | | / __|/ _ \ | | / __|
app-1  |     / /__| (_) | | |_| \__ \  __/ |_| \__ \
app-1  |     \____/\___/|_|\__, |___/\___|\__,_|___/
app-1  |                   |___/
app-1  |
app-1  | Multiplayer Framework for Node.js · Open-source
app-1  |
app-1  | 💖 Sponsor Colyseus on GitHub → https://github.com/sponsors/endel
app-1  | 🌟 Give it a star on GitHub → https://github.com/colyseus/colyseus
app-1  | ☁️  Deploy and scale your project on Colyseus Cloud → https://cloud.colyseus.io
app-1  |
app-1  | ⚔️  Listening on http://localhost:9000
app-1  | create lobby ut88uWcHQ
app-1  | init lobby cron jobs
app-1  | init cron jobs
```

## Access the Application

If you installed docker on your own PC/notebook, you can now use the pokemon-auto-chess server on `http://localhost:9000`
If you installed docker on your server, you can now use the pokemon-auto-chess server on `http://<server_ip_address>:9000`

### Access the Database - MongoDB

If you need to access the database directly, port 27017 is exposed in the `docker-compose.yaml`-file to make it easy to connect from e.g. MongoDB Compass or MongoDB Shell locally. Use the root-user and -password specified earlier and connect to localhost:27017.

`mongodb://root:VERY-SECURE-PASSWORD@localhost:27017/?authSource=admin`