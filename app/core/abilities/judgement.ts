import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class JudgementStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let synergyLevelsCount = 0
    const synergies = pokemon.player?.synergies
    if (synergies) {
      pokemon.types.forEach((type) => {
        synergyLevelsCount += synergies.get(type) ?? 0
      })
    }
    const damage = ([10, 10, 10, 20][pokemon.stars - 1] ?? 20) * synergyLevelsCount
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
