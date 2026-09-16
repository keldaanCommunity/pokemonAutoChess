import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { clamp } from "../../utils/number"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ArmThrustStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deal 2 to 5 hits (luck based increasing with AP) each dealing [100,100,200,400]% of the user's ATK as physical damage.
    // Each hit has the same individual crit chance.
    const damageFactor = [1, 1, 2, 4][pokemon.stars - 1] ?? 4
    const damage = pokemon.atk * damageFactor
    const nbHits = clamp(
      Math.floor(2 + Math.random() * 4 * (1 + pokemon.luck / 100)),
      2,
      5
    )
    pokemon.broadcastAbility({
      skill: Ability.ARM_THRUST,
      delay: nbHits
    })
    for (let i = 0; i < nbHits; i++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.PHYSICAL,
        pokemon,
        chance(pokemon.critChance / 100, pokemon)
      )
    }
  }
}
