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
import { logger, matchMaker } from "colyseus"
import { CronJob } from "cron"
import app from "./app.config"
import { initializeMetrics } from "./metrics"

async function main() {
  if (process.env.NODE_APP_INSTANCE) {
    const processNumber = Number(process.env.NODE_APP_INSTANCE || "0")
    initializeMetrics()
    await listen(app)
    if (processNumber === 0) {
      await matchMaker.createRoom("lobby", {})
      initializeLobby()
    }
  } else {
    await listen(app, process.env.PORT ? parseInt(process.env.PORT) : 9000)
    await matchMaker.createRoom("lobby", {})
  }
}

function initializeLobby() {
  logger.info("initializeLobby cron job")
  CronJob.from({
    cronTime: "0 */12 * * *", // every 12 hours
    timeZone: "Europe/Paris",
    onTick: async () => {
      logger.debug(`Refresh lobby room`)
      const query = await matchMaker.query({ name: "lobby" })
      for (let i = 0; i < query.length; i++) {
        try {
          // Attempt to see if the room exit. If it exist, disconnect it
          const disconnection = await matchMaker.remoteRoomCall(
            query[i].roomId,
            "disconnect",
            [],
            60000
          )

          logger.error("lobby disconected", disconnection)
        } catch (error) {
          logger.error(error)
        } finally {
          matchMaker.presence.hdel("roomcaches", query[i].roomId)
        }
      }
      matchMaker.createRoom("lobby", {})
    },
    start: true
  })
}

main()
