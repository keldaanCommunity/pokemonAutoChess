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
  specialGameRule?: SpecialGameRule | null
) {
  if (specialGameRule === SpecialGameRule.CROWDED) return playerLevel + 3
  return playerLevel
}
