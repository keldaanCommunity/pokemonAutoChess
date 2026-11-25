# Local development with Docker

This Docker Compose configuration is for local development, not deployment.
It starts the game, MongoDB and the Firebase Authentication emulator using the
demo project `demo-pokemon-auto-chess`. It does not need a Firebase project,
private key, MongoDB installation or `.env` file.

Compose builds the application from `Dockerfile.dev` and the emulator from
`Dockerfile.firebase`; both use the repository root as their build context.

## Start

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Clone or download this repository.
3. On Windows, run `start-local.bat`. Alternatively, on any platform, run:

   ```sh
   docker compose up --build --watch
   ```

4. Wait for the game to start and open http://localhost:9000. Register with an
   email and password; these are local test accounts, so do not use real
   credentials.

The first build downloads npm dependencies and the separate music repository,
then packs the assets. This can take significant time and disk space. Docker
Desktop's Compose must support `up --watch`; update Docker Desktop if it does not.

MongoDB is seeded with `db-commands/botv2.json` when its volume is first created.
MongoDB data and Firebase users are stored in separate Docker volumes. Firebase
exports its users during a graceful shutdown and imports them at the next start;
an abrupt termination can lose changes since the last export.

## Developing

The application container runs `npm run dev`. Changes to application code under
`app/` are synchronized into the container; the development server restarts
when server code changes and rebuilds the client when client code changes.
Refresh the browser to see client changes.

Changes under `app/public/src/assets/` and `app/public/dist/` are not
synchronized. Restart with `--build` to repack assets or apply changes to
tracked files in `app/public/dist/`, such as translations. Changes to package
manifests or `esbuild.js` cause an image rebuild. Changes to other build inputs
also require restarting with `--build`.

The emulator uses email/password authentication only in the game UI. Verification
and password-reset messages are printed in the Firebase container logs instead of
being sent by email. Google and Twitter sign-in are not available in this mode.
External integrations such as Twitch are not configured.

## Stop and troubleshoot

Press Ctrl+C in the terminal running Compose for a graceful shutdown. To inspect
logs or stop containers from another terminal:

```sh
docker compose logs -f
docker compose down
```

Make sure ports 9000 and 9099 are free. They are published only on localhost;
MongoDB is not published to the host. To start over with empty local data, stop
the services and run `docker compose down --volumes`. This deletes both MongoDB
data and local accounts; the bot seed will be imported again on the next start.

This emulator issues unsigned tokens, accepted by the server only in the
explicitly configured development mode with a demo project ID. Never use this
configuration for a public server or production.
