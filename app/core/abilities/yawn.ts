import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class YawnStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const opponentsTargetingMe = board.cells.filter<PokemonEntity>(
      (entity): entity is PokemonEntity =>
        entity != null &&
        entity.team !== pokemon.team &&
        entity.targetEntityId === pokemon.id
    )

    opponentsTargetingMe.forEach((opponent) => {
      opponent.status.triggerFatigue(3000, opponent, pokemon)
      opponent.addAbilityPower(-20, pokemon, 0, false)
    })

    const shield = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.resetCooldown(1000)
  }
}
