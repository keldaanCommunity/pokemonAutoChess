// ecosystem.config.js
const os = require("os")

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
      interpreter: "node@22.14.0"
    }
  ],
  deploy: {
    production: {
      user: "root",
      host: [
        "143.198.101.153",
        "164.92.98.9",
        "161.35.234.200",
        "64.23.236.25"
      ],
      ref: "origin/prod",
      repo: "https://github.com/keldaanCommunity/pokemonAutoChess.git",
      path: "/home/deploy",
      "post-deploy":
        "source ~/.nvm/nvm.sh && nvm use 22.14.0 && npm install && npm run build" // && nvm use 20.12.0 && npm run assetpack && nvm use 22.14.0
    }
  }
}
