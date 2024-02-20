import { MapSchema } from "@colyseus/schema"
import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { SpecialLobbyRule } from "../types/enum/SpecialLobbyRule"
import { values } from "./schemas"

export function isPositionEmpty(
  x: number,
  y: number,
  board: MapSchema<Pokemon, string>
) {
  return (
    values(board).some((p) => p.positionX === x && p.positionY === y) === false
  )
}

export function getFirstAvailablePositionInBench(
  board: MapSchema<Pokemon, string>
) {
  for (let i = 0; i < 8; i++) {
    if (isPositionEmpty(i, 0, board)) {
      return i
    }
  }
}

export function getFirstAvailablePositionOnBoard(
  board: MapSchema<Pokemon, string>
) {
  for (let x = 0; x < 8; x++) {
    for (let y = 1; y < 4; y++) {
      if (isPositionEmpty(x, y, board)) {
        return [x, y]
      }
    }
  }
}

export function getFreeSpaceOnBench(board: MapSchema<Pokemon, string>): number {
  let numberOfFreeSpace = 0
  for (let i = 0; i < 8; i++) {
    if (isPositionEmpty(i, 0, board)) {
      numberOfFreeSpace++
    }
  }
  return numberOfFreeSpace
}

export function getMaxTeamSize(
  playerLevel: number,
  specialLobbyRule?: SpecialLobbyRule | null
) {
  if (specialLobbyRule === SpecialLobbyRule.SIX_PACK) return 6
  if (specialLobbyRule === SpecialLobbyRule.CROWDED) return playerLevel + 3
  return playerLevel
}
