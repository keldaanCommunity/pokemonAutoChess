import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CoilStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Ensnares the target with it's powerful tail, inflicting LOCKED and PARALYSIS for 3 seconds.
    // User also buffs its ATK and DEF by [3,5,10,20,SP]
    super.process(pokemon, board, target, crit)

    target.status.triggerLocked(3000, target)
    target.status.triggerParalysis(3000, target, pokemon)
    const atkBuff = [3, 5, 10, 20][pokemon.stars - 1] ?? 20
    const defBuff = [3, 5, 10, 20][pokemon.stars - 1] ?? 20
    pokemon.addAttack(atkBuff, pokemon, 1, crit)
    pokemon.addDefense(defBuff, pokemon, 1, crit)
  }
}
