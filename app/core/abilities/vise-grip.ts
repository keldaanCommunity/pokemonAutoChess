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
    const defGain = target.def * 1
    const spedefGain = target.speDef * 1
    pokemon.addDefense(defGain, pokemon, 1, crit)
    pokemon.addSpecialDefense(spedefGain, pokemon, 1, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addDefense(-defGain, pokemon, 1, crit)
        pokemon.addSpecialDefense(-spedefGain, pokemon, 1, crit)
      }, 4000)
    )
  }
}
