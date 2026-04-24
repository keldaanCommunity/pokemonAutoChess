export type {
  IGameActivity,
  IGameActivityDay
} from "../../../types/models/game-activity"

export async function fetchGameActivity(): Promise<
  import("../../../types/models/game-activity").IGameActivity
> {
  const response = await fetch("/meta/game-activity")
  if (!response.ok) {
    throw new Error(`Failed to fetch game activity: ${response.status}`)
  }
  return response.json()
}
