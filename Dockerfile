# Build Step 1 - Create the base
FROM node:20.18-alpine AS base
RUN apk add git --no-cache
COPY ./ /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN npm run download-music
RUN npm run assetpack

# Build Step 2 - Build the application
FROM base AS builder
WORKDIR /usr/src/app
RUN npm run build

# Build Step 3 - Build a minimal production-ready image
#
# --ignore-scripts is used in the `npm install` to ignore the postinstall-script
# because in the production-ready image we do not need the sources for
# the assetpack or music assets in the isolated image for running the app.

FROM node:20.18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production --ignore-scripts
COPY --from=builder /usr/src/app/app/public/dist ./app/public/dist
EXPOSE 9000
ENTRYPOINT ["node", "app/public/dist/server/app/index.js"]