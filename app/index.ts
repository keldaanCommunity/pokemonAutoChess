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
import { matchMaker } from "colyseus"
import app from "./app.config"
import { initializeMetrics } from "./metrics"

async function main() {
  if (process.env.NODE_APP_INSTANCE) {
    const processNumber = Number(process.env.NODE_APP_INSTANCE || "0")
    initializeMetrics()
    matchMaker.setHealthChecksEnabled(false)
    await listen(app)
    processNumber === 0 && matchMaker.createRoom("lobby", {})
  } else {
    await listen(app, 9000)
    matchMaker.createRoom("lobby", {})
  }
}

main()
