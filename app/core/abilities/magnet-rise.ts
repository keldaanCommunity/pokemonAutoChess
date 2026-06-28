import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MagnetRiseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbAlliesBuffed = [2, 4, 6, 8][pokemon.stars - 1] ?? 8
    const alliesBuffed = (
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY)
        .map((cell) => cell.value)
        .filter((mon) => mon && mon.team === pokemon.team) as PokemonEntity[]
    )
      .sort((a, b) => a.hp - b.hp)
      .slice(0, nbAlliesBuffed)

    alliesBuffed.push(pokemon)
    alliesBuffed.forEach((ally) => {
      ally.status.triggerProtect(2000)
      ally.addDodgeChance([0.1, 0.1, 0.1, 0.2][pokemon.stars - 1] ?? 0.2, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: ally.positionX,
        positionY: ally.positionY
      })
    })
  }
}
