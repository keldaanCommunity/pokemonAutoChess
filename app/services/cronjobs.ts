import { CronJob } from "cron"
import { logger } from "../utils/logger"
import { fetchLeaderboards } from "./leaderboard"

export function initCronJobs() {
  logger.debug("init cron jobs")
  CronJob.from({
    cronTime: "0 0/10 * * * *", // every 10 minutes
    timeZone: "Europe/Paris",
    onTick: () => {
      fetchLeaderboards()
    },
    start: true
  })
}
