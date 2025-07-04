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
import { fetchMetaReports } from "./services/meta"

async function main() {
  if (process.env.NODE_APP_INSTANCE) {
    const processNumber = Number(process.env.NODE_APP_INSTANCE ?? "0")
    const port = (Number(process.env.PORT) ?? 2569) + processNumber
    initializeMetrics()
    await listen(app)
    if (port === 2569) {
      // only the first thread of the first instance will create the lobby and init cron jobs
      await matchMaker.createRoom("lobby", {})
      checkLobby()
      initCronJobs()
    }
  } else {
    await listen(app, process.env.PORT ? parseInt(process.env.PORT) : 9000)
    await matchMaker.createRoom("lobby", {})
    initCronJobs()
  }

  logger.info("Fetching leaderboards...")
  fetchLeaderboards()
  setInterval(() => fetchLeaderboards(), 1000 * 60 * 10) // refresh every 10 minutes
  logger.info("Fetching meta reports...")
  fetchMetaReports()
  setInterval(() => fetchMetaReports(), 1000 * 60 * 60 * 24) // refresh every 24 hours
}

function checkLobby() {
  logger.info("checkLobby cron job")
  CronJob.from({
    cronTime: "* * * * *",
    timeZone: "Europe/Paris",
    onTick: async () => {
      const lobbies = await matchMaker.query({ name: "lobby" })
      if (lobbies.length === 0) {
        logger.warn(`Lobby room has not been found, automatically remaking one`)
        matchMaker.createRoom("lobby", {})
      }
    },
    start: true
  })
}

main()
