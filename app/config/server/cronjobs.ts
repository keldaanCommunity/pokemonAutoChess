export const CRON_ELO_DECAY_DELAY = 86400 * 1000 * 20 // 20 days
export const ELO_DECAY_LOST_PER_DAY = 5
export const CRON_ELO_DECAY_MINIMUM_ELO = 1100
export const CRON_HISTORY_CLEANUP_DELAY = 86400 * 1000 * 30 // 30 days

export const SCRIBBLE_LOBBY_CRON = "0 0 0-20/4 * * *" // every four hours from 00h to 20h
export const GREATBALL_RANKED_LOBBY_CRON = "0 0 2,6,14,18 * * *" // every four hours from 2h to 22h
export const ULTRABALL_RANKED_LOBBY_CRON = "0 0 22 * * *" // every day 22h
