// ecosystem.config.js
const os = require("os")
require("dotenv").config()

const deployHosts = process.env.DEPLOY_HOSTS?.split(",") || []
const deploymentDefaults = {
  user: "root",
  ref: "origin/prod",
  repo: "https://github.com/keldaanCommunity/pokemonAutoChess.git",
  path: "/home/deploy",
  "post-deploy":
    "source ~/.nvm/nvm.sh && nvm install 24.19.0 && nvm use 24.19.0 && npm ci --include=dev && npm run build" // && npm run assetpack
}

module.exports = {
  apps: [
    {
      name: "colyseus",
      script: "./app/public/dist/server/app/index.js", // your entrypoint file
      instances: os.cpus().length,
      exec_mode: "fork", // IMPORTANT: do not use cluster mode.
      watch: false,
      time: true,
      wait_ready: true,
      env_production: {
        NODE_ENV: "production"
      },
      interpreter: "node@24.19.0"
    }
  ],
  deploy: Object.fromEntries(
    deployHosts.map((host, index) => [
      `production-${index + 1}`,
      { ...deploymentDefaults, host }
    ])
  )
}
