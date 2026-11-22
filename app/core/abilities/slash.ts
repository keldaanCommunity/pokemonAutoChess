import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SlashStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    const increasedCrit = [30, 60, 90, 100][pokemon.stars - 1] ?? 100
    crit = chance((pokemon.critChance + increasedCrit) / 100, pokemon) // can crit by default with increased crit chance
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
