import { Ability } from "../../types/enum/Ability"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TrickOrTreatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    if (target.items.size > 0) {
      const item = schemaValues(target.items)[0]!
      target.removeItem(item)
      pokemon.addItem(item)
    } else {
      // transforms the unit into magikarp for X seconds, replacing its ability with splash
      const originalAbility = target.skill
      const originalAttack = target.atk
      const originalDefense = target.def
      const originalSpecialDefense = target.speDef
      const originalIndex = target.index
      const baseDuration = [3000, 3000, 10000, 30000][pokemon.stars - 1] ?? 30000
      const duration = Math.round(
        baseDuration * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
      )
      target.index = PkmIndex[Pkm.MAGIKARP]
      target.skill = Ability.SPLASH
      target.atk = 1
      target.def = 1
      target.speDef = 1
      target.commands.push(
        new DelayedCommand(() => {
          target.skill = originalAbility
          target.atk = originalAttack
          target.def = originalDefense
          target.speDef = originalSpecialDefense
          target.index = originalIndex
        }, duration)
      )
    }
  }
}
