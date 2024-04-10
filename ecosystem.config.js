// ecosystem.config.js
const os = require("os");

module.exports = {
    apps: [{
        name        : "colyseus",
        cwd         : "./app/public/dist/server/app",
        script      : "index.js", // your entrypoint file
        instances   : os.cpus().length,
        exec_mode   : "fork",         // IMPORTANT: do not use cluster mode.
        watch       : false,
        time        : true,
        wait_ready  : true,
        env: {
            DEBUG: "colyseus:errors",
            NODE_ENV: "production"
        }
    }],  
    deploy : {  
      production : {  
        "user" : "deploy",  
        "host" : ["45.76.130.174"],  
        "ref"  : "origin/main",  
        "repo" : "git@github.com/keldaanCommunity/pokemonAutoChess.git",  
        "path" : "/home/deploy",  
        "post-deploy" : "npm install && npm run build && npm run colyseus-post-deploy"  
      }  
    }  
}