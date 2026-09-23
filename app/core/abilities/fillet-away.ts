import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FilletAwayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // lose 50% of max HP and gain 10 attack and 20 speed
    const lostMaxHP = Math.floor(pokemon.maxHP * 0.3)
    pokemon.addMaxHP(-lostMaxHP, pokemon, 0, false)

    const atkBuff = [5, 8, 10, 20][pokemon.stars - 1] ?? 20
    const speedBuff = [10, 15, 20, 40][pokemon.stars - 1] ?? 40

    pokemon.addAttack(atkBuff, pokemon, 1, crit)
    pokemon.addSpeed(speedBuff, pokemon, 1, crit)
    pokemon.status.triggerProtect(1000)
    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.moveTo(corner.x, corner.y, board, false)
    }
  }
}
