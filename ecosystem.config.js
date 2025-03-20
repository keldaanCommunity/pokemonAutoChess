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
    max_memory_restart: "1300M",
    env_production: {
      NODE_ENV: "production"
    },
    interpreter: "node@22.13.1",
  }],
  deploy: {
    production: {
      "user": "root",
      "host": ["64.23.193.77", "143.198.101.153", "164.92.98.9", "161.35.234.200"],
      "ref": "origin/prod",
      "repo": "https://github.com/keldaanCommunity/pokemonAutoChess.git",
      "path": "/home/deploy",
      "post-deploy": "npm run build"
    }
  }
}