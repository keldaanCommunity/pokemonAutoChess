# using alpine version of node reduces image size
FROM node:20.16-alpine
RUN apk add git --no-cache
COPY ./ /app
WORKDIR /app
RUN npm install
RUN npm run download-music
RUN npm run assetpack
EXPOSE 9000
RUN touch /app/.env
ENTRYPOINT ["npm", "run", "dev"]