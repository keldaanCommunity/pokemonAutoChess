import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SandTombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const statusDuration = [3000, 5000, 8000, 16000][pokemon.stars - 1] ?? 16000
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80

    target.status.triggerParalysis(statusDuration, target, pokemon)
    target.status.triggerSilence(statusDuration, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
