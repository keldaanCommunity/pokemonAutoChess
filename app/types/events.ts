export enum GameEvent {
  VICTORY_ROAD = "VICTORY_ROAD",
  EXPEDITIONS = "EXPEDITIONS"
}

export const GameEvents: GameEvent[] = [
  // TODO: switch order so that Expeditions start on April
  GameEvent.EXPEDITIONS,
  GameEvent.VICTORY_ROAD
]
