# Deploy Pokemon-Auto-Chess With Docker

This method is for people who have a VPS or a free dedicated server or a home server and would like to host pokemon-auto-chess without messing up with installed files in their system. Docker image makes it possible to run multiple game servers by changing the port binding settings and access different database.

## Pre-requisite
- some medium level docker expertise
- comfortable using command line interface / terminal

## Docker image creation
- Go to [this docker install guide page](https://docs.docker.com/engine/install/) and follow the instructions.
- Clone the github repository or download and extract release file
- Open terminal/cmd application and navigate to pokemonAutoChess directory
- run `docker build .` and wait for the build process to finish
- if the build process was successful you'll see `Successfully built abcdef123456`, where the example `abcdef123456` would be the image id of the server image.
- optionally you can rename the image for example as "pokemon-auto-chess:test" with command `docker tag abcdef123456 pokemon-auto-chess:test`. Don't forget to replace `abcdef123456` with the output of your build.

## Deploying the image
Now that the image had been built, continue with setting up MongoDB and Firebase from the deployment tutorial. Name your env file as `env` and run your server by inputting this command:  
`docker run -d -v "$(pwd)"/env:/app/.env --name auto-chess --restart unless-stopped -p 9000:9000 pokemon-auto-chess:test`

If you installed docker in your own PC/notebook, you can now try the pokemon-auto-chess server on `http://localhost:9000`. If you installed the docker on your server, try the server on `http://<server_ip_address>:9000`