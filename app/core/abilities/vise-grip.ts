import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ViseGripStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [30, 60, 100, 200][pokemon.stars - 1] ?? 200
    target.status.triggerLocked(4000, target)
    pokemon.status.triggerLocked(4000, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const boost = (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    const defGain = Math.round(target.def * boost)
    const spedefGain = Math.round(target.speDef * boost)
    pokemon.addDefense(defGain, pokemon, 0, false)
    pokemon.addSpecialDefense(spedefGain, pokemon, 0, false)
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addDefense(-defGain, pokemon, 0, false)
        pokemon.addSpecialDefense(-spedefGain, pokemon, 0, false)
      }, 4000)
    )
  }
}
