import { Pkm } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { getStrongestUnit } from "../unit-score"
import { AbilityStrategy } from "./ability-strategy"

export class DecorateStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const atkBoost = [1, 2, 3, 6][pokemon.stars - 1] ?? 6
    const apBoost = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    const nearestAllies = pokemon.state.getNearestAllies(pokemon, board)
    const strongestNearestAlly = getStrongestUnit(nearestAllies)
    if (strongestNearestAlly) {
      pokemon.broadcastAbility({
        targetX: strongestNearestAlly.positionX,
        targetY: strongestNearestAlly.positionY
      })
      strongestNearestAlly.addAttack(atkBoost, pokemon, 1, crit)
      strongestNearestAlly.addAbilityPower(apBoost, pokemon, 1, crit)

      if (pokemon.name === Pkm.ALCREMIE_VANILLA) {
        strongestNearestAlly.addShield(80, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_RUBY) {
        strongestNearestAlly.addSpeed(30, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_MATCHA) {
        strongestNearestAlly.addMaxHP(60, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_MINT) {
        strongestNearestAlly.handleHeal(40, pokemon, 1, crit)
        strongestNearestAlly.addSpecialDefense(15, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_LEMON) {
        strongestNearestAlly.addCritChance(40, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_SALTED) {
        strongestNearestAlly.handleHeal(40, pokemon, 1, crit)
        strongestNearestAlly.addDefense(15, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_RUBY_SWIRL) {
        strongestNearestAlly.addAttack(10, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_CARAMEL_SWIRL) {
        strongestNearestAlly.addCritPower(80, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_RAINBOW_SWIRL) {
        strongestNearestAlly.addPP(50, pokemon, 1, crit)
      }
    }
  }
}
