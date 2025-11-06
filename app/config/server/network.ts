export const MAX_POOL_CONNECTIONS_SIZE = 16
export const MAX_CONCURRENT_PLAYERS_ON_SERVER = 1000
export const MAX_CONCURRENT_PLAYERS_ON_LOBBY = 500
export const MAX_PLAYERS_PER_GAME = 8
export const MIN_HUMAN_PLAYERS = process.env.MIN_HUMAN_PLAYERS
  ? parseInt(process.env.MIN_HUMAN_PLAYERS)
  : 1
export const INACTIVITY_TIMEOUT = 60 * 1000 * 30 // 30 minutes

export const MAX_SIMULATION_DELTA_TIME = 50 // milliseconds
