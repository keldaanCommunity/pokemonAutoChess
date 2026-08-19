import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const rageDuration = 3000
    pokemon.status.triggerRage(rageDuration, pokemon)

    //gain 1 attack for each 10% of max HP missing
    const missingHp = pokemon.maxHP - pokemon.hp
    const atkBoost =
      pokemon.baseAtk * ([10, 10, 10, 20][pokemon.stars - 1] ?? 20) / 100 * Math.floor(missingHp / (pokemon.maxHP / 10))
    pokemon.addAttack(atkBoost, pokemon, 1, crit)
    pokemon.resetCooldown(1000)
  }
}
