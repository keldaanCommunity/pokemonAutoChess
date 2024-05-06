// ecosystem.config.js
const os = require("os");

module.exports = {
    apps: [{
        name        : "colyseus",
        script      : "./app/public/dist/server/app/index.js", // your entrypoint file
        instances   : os.cpus().length,
        exec_mode   : "fork",         // IMPORTANT: do not use cluster mode.
        watch       : false,
        time        : true,
        wait_ready  : true,
        env_production: {
            NODE_ENV: "production"
        },
        interpreter: "node@20.12.2"
    }],  
    deploy : {  
      production : {  
        "user" : "deploy",  
        "host" : ["45.76.130.174"],  
        "ref"  : "origin/prod",  
        "repo" : "git@github.com:keldaanCommunity/pokemonAutoChess.git",  
        "path" : "/home/deploy",  
        "post-deploy" : "npm run colyseus-post-deploy" // npm install && npm run build &&
      }  
    }  
}