// ecosystem.config.js
const os = require("os");

module.exports = {
    apps: [{
        name        : "colyseus",
        script      : "./app/public/dist/server/app/index.js", // your entrypoint file
        instances   : 1,
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
        "user" : "root",  
        "host" : ["146.190.113.96"],
        "key"  : "./id_digital_ocean",
        "ref"  : "origin/prod",  
        "repo" : "git@github.com:keldaanCommunity/pokemonAutoChess.git",  
        "path" : "/home/deploy",  
        "post-deploy" : "npm install && npm run build && npm run colyseus-post-deploy"  
      },
      vultr : {  
        "user" : "deploy",  
        "host" : ["45.76.130.174"],
        "ref"  : "origin/prod",  
        "repo" : "git@github.com:keldaanCommunity/pokemonAutoChess.git",  
        "path" : "/home/deploy",  
        "post-deploy" : "npm install && npm run build && npm run colyseus-post-deploy"  
      }    
    }  
}