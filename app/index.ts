/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to host your server on Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually
 * instantiate a Colyseus Server as documented here:
 *
 * See: https://docs.colyseus.io/server/api/#constructor-options
 */
import { listen } from "@colyseus/tools"

// Import Colyseus config
import app from "./app.config"

// Create and listen on 9000 (or PORT environment variable.)
const port = Number(process.env.PORT) || 9000
listen(app, port)
