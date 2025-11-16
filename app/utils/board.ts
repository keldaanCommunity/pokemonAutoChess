import { MapSchema } from "@colyseus/schema"
import { PokemonEntity } from "../core/pokemon-entity"
import { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonSprite from "../public/src/game/components/pokemon"
import { SpecialGameRule } from "../types/enum/SpecialGameRule"
import { values } from "./schemas"

export function isOnBench(pokemon: Pokemon | PokemonEntity | PokemonSprite) {
  return pokemon.positionY === 0
}

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
): number | null {
  for (let i = 0; i < 8; i++) {
    if (isPositionEmpty(i, 0, board)) {
      return i
    }
  }
  return null
}

export function getFirstAvailablePositionOnBoard(
  board: MapSchema<Pokemon, string>,
  range: number
) {
  let rowsOrder: number[]
  switch (Math.min(range, 3)) {
    case 2:
      rowsOrder = [2, 1, 3]
      break

    case 3:
      rowsOrder = [1, 2, 3]
      break

    case 1:
    default:
      rowsOrder = [3, 2, 1]
      break
  }
  for (let y = 0; y < rowsOrder.length; y++) {
    for (let x = 0; x < 8; x++) {
      if (isPositionEmpty(x, rowsOrder[y], board)) {
        return [x, rowsOrder[y]]
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
  specialGameRule?: SpecialGameRule | null
) {
  if (specialGameRule === SpecialGameRule.CROWDED) return playerLevel + 3
  return playerLevel
}
