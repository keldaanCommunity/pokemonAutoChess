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
import { Encoder } from "@colyseus/schema"
import { CronJob } from "cron"
import app from "./app.config"
import { initializeMetrics } from "./metrics"
import { initCronJobs } from "./services/cronjobs"
import { fetchLeaderboards } from "./services/leaderboard"
import { fetchMetaReports } from "./services/meta"

/*
Changed buffer size to 512kb to avoid warnings from colyseus. We need to scale down the amount of data we're sending so it gets sent in multiple packets or increase the buffer size even more.
I think the buffer size is a bit of a sanity check, the only time I've really seen it needed is if you have infra requirements for buffer sizes, for instance working with steamworks the max packet size is 512kb
 */
Encoder.BUFFER_SIZE = 512 * 1024

async function main() {
  fetchLeaderboards()
  setInterval(() => fetchLeaderboards(), 1000 * 60 * 10) // refresh every 10 minutes
  fetchMetaReports()
  setInterval(() => fetchMetaReports(), 1000 * 60 * 60 * 24) // refresh every 24 hours

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
      if (lobbies.length === 0) {
        matchMaker.createRoom("lobby", {})
      }
    },
    start: true
  })
}

main()
