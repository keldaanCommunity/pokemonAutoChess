export enum GameEvent {
  VICTORY_ROAD = "VICTORY_ROAD",
  EXPEDITIONS = "EXPEDITIONS",
  POKEPALS = "POKEPALS",
  RAINBOW_PEAK = "RAINBOW_PEAK"
}

export const GameEvents: GameEvent[] = [
  GameEvent.VICTORY_ROAD,
  GameEvent.POKEPALS,
  GameEvent.EXPEDITIONS,
  GameEvent.RAINBOW_PEAK
]

export type GameEventData = {
  pal?: string
}
