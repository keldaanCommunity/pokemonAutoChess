// ecosystem.config.js
const os = require("os");

module.exports = {
  apps: [{
    name: "colyseus",
    script: "./app/public/dist/server/app/index.js", // your entrypoint file
    instances: os.cpus().length,
    exec_mode: "fork",         // IMPORTANT: do not use cluster mode.
    watch: false,
    time: true,
    wait_ready: true,
    env_production: {
      NODE_ENV: "production"
    },
    interpreter: "node@20.12.2"
  }],
  deploy: {
    production: {
      "user": "root",
      "host": ["146.190.113.96", "143.198.101.153", "164.92.98.9"],
      "ref": "origin/prod",
      "repo": "https://github.com/keldaanCommunity/pokemonAutoChess.git",
      "path": "/home/deploy",
      "post-deploy": "npm install && npm run assetpack && npm run build && pm2 delete all && pm2 update"
    }
  }
}