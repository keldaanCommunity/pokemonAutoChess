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
import { initCronJobs } from "./services/cronjobs"
import { fetchLeaderboards } from "./services/leaderboard"

async function main() {
  fetchLeaderboards()
  setInterval(() => fetchLeaderboards(), 1000 * 60 * 10) // refresh every 10 minutes

  if (process.env.NODE_APP_INSTANCE) {
    const processNumber = Number(process.env.NODE_APP_INSTANCE || "0")
    initializeMetrics()
    await listen(app)
    if (processNumber === 0) {
      await matchMaker.createRoom("lobby", {})
      checkLobby()
      initCronJobs()
    }
  } else {
    await listen(app, process.env.PORT ? parseInt(process.env.PORT) : 9000)
    await matchMaker.createRoom("lobby", {})
    initCronJobs()
  }
}

function checkLobby() {
  logger.info("checkLobby cron job")
  CronJob.from({
    cronTime: "* * * * *",
    timeZone: "Europe/Paris",
    onTick: async () => {
      logger.debug(`Refresh lobby room`)
      const lobbies = await matchMaker.query({ name: "lobby" })
      if(lobbies.length === 0) {
        matchMaker.createRoom("lobby", {})
      }
    },
    start: true
  })
}

main()
