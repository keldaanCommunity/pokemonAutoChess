import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TranseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.skill = Ability.HEADBUTT
    if (pokemon.name === Pkm.GALARIAN_DARMANITAN_ZEN) {
      pokemon.index = PkmIndex[Pkm.GALARIAN_DARMANITAN]
      pokemon.name = Pkm.GALARIAN_DARMANITAN
      pokemon.changePassive(Passive.GALARIAN_DARMANITAN)
      pokemon.status.tree = false
      pokemon.status.untargettable = false
      pokemon.addAttack(-6, pokemon, 0, false)
      pokemon.addSpeed(60, pokemon, 0, false)
    } else {
      pokemon.index = PkmIndex[Pkm.DARMANITAN]
      pokemon.name = Pkm.DARMANITAN
      pokemon.changePassive(Passive.DARMANITAN)
      pokemon.addAttack(10, pokemon, 0, false)
      pokemon.addSpeed(20, pokemon, 0, false)
      pokemon.addDefense(-6, pokemon, 0, false)
      pokemon.addSpecialDefense(-6, pokemon, 0, false)
      pokemon.range = min(1)(pokemon.range - 4)
      pokemon.effects.delete(EffectEnum.SPECIAL_ATTACKS)
    }
    pokemon.skill = Ability.HEADBUTT
    pokemon.handleHeal(Math.round(0.3 * pokemon.maxHP), pokemon, 0, false)
    pokemon.toMovingState()
    pokemon.cooldown = 0
  }
}
