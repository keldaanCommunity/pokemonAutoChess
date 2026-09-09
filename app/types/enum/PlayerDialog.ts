export const PlayerDialogs = [
  "YES",
  "NO",
  "QM",
  "OK",
  "ME",
  "YOU",
  "TRADE",
  "HELP"
] as const

export type PlayerDialog = (typeof PlayerDialogs)[number]
