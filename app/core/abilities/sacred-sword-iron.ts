import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SacredSwordIronStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)
    const baseDmg = [40, 60, 80, 160][pokemon.stars - 1] ?? 160
    const perFallenDmg = [15, 15, 15, 30][pokemon.stars - 1] ?? 30
    const damage = baseDmg + perFallenDmg * nbFallenAllies
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}
