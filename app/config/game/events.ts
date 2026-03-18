import { GameEvent, GameEvents } from "../../types/events"

export const VICTORY_ROAD_MAX_EVENT_POINTS = 500

export const VictoryRoadPointsPerRank = [
  +15, // 1st
  +8, // 2nd
  +5, // 3rd
  +1, // 4th
  -1, // 5th
  -3, // 6th
  -5, // 7th
  -8 // 8th
]

export const TOURNAMENT_REGISTRATION_TIME = 60 * 60 * 1000 // 1 hour
export const TOURNAMENT_CLEANUP_DELAY = 24 * 60 * 60 * 1000 // 1 day

export function getGameEventResetDate(): Date {
  // midnight UTC on the first day of each month
  const now = new Date()
  const resetDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0)
  )
  return resetDate
}

export function getCurrentGameEvent(): GameEvent {
  // Implementation for determining the current event
  const month = new Date().getUTCMonth()
  return GameEvents[month % GameEvents.length]
}
