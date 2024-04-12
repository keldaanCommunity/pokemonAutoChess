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

if (process.env.NODE_APP_INSTANCE) {
  listen(app)
} else {
  listen(app, 9000)
}
