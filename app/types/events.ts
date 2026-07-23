export enum GameEvent {
  VICTORY_ROAD = "VICTORY_ROAD",
  EXPEDITIONS = "EXPEDITIONS",
  POKEPALS = "POKEPALS"
}

export const GameEvents: GameEvent[] = [
  GameEvent.POKEPALS,
  GameEvent.EXPEDITIONS,
  GameEvent.VICTORY_ROAD
]

export type GameEventData = {
  pal?: string
}
