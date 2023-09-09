// ecosystem.config.js
const os = require('os');
const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
    apps: [{
        port        : 3000,
        name        : "colyseus",
        script      : "./app/public/dist/server/app/index.js", // your entrypoint file
        instances   : os.cpus().length,
        exec_mode   : 'fork',         // IMPORTANT: do not use cluster mode.
        env: {
            DEBUG: "colyseus:errors",
            NODE_ENV: "production",
            MONGO_URI: process.env.MONGO_URI,
            AUTH_PROVIDER_X509_CERT_URL:process.env.AUTH_PROVIDER_X509_CERT_URL,
            AUTH_URI:process.env.AUTH_URI,
            CLIENT_EMAIL:process.env.CLIENT_EMAIL,
            CLIENT_ID:process.env.CLIENT_ID,
            CLIENT_X509_CERT_URL:process.env.CLIENT_X509_CERT_URL,
            FACEBOOK_APP_TOKEN:process.env.FACEBOOK_APP_TOKEN,
            PRIVATE_KEY:process.env.PRIVATE_KEY,
            PRIVATE_KEY_ID:process.env.PRIVATE_KEY_ID,
            PROJECT_ID:process.env.PROJECT_ID,
            TOKEN_URI:process.env.TOKEN_URI,
            TYPE:process.env.TYPE,
            PASTEBIN_API_DEV_KEY:process.env.PASTEBIN_API_DEV_KEY,
            PASTEBIN_API_PASSWORD:process.env.PASTEBIN_API_PASSWORD,
            PASTEBIN_API_USERNAME:process.env.PASTEBIN_API_USERNAME,
            MODE:process.env.MODE,
            WEBHOOK_URL:process.env.WEBHOOK_URL
        }
    }]
}