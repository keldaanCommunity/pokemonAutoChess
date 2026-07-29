export enum GameEvent {
  VICTORY_ROAD = "VICTORY_ROAD",
  EXPEDITIONS = "EXPEDITIONS",
  POKEPALS = "POKEPALS"
}

export const GameEvents: GameEvent[] = [
  GameEvent.VICTORY_ROAD,
  GameEvent.POKEPALS,
  GameEvent.EXPEDITIONS
]

export type GameEventData = {
  pal?: string
}
