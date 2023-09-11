// ecosystem.config.js
const os = require("os");

module.exports = {
    apps: [{
        port        : 9000,
        name        : "colyseus",
        cwd         : "./app/public/dist/server/app",
        script      : "index.js", // your entrypoint file
        instances   : os.cpus().length,
        exec_mode   : "fork",         // IMPORTANT: do not use cluster mode.
        watch       : true,
        env: {
            DEBUG: "colyseus:errors",
            NODE_ENV: "production"
        }
    }]
}