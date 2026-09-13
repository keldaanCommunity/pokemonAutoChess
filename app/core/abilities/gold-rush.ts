import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GoldRushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const goldDamage = pokemon.player?.money ? pokemon.player?.money : 0
    const damage = ([20, 20, 20, 50][pokemon.stars - 1] ?? 50) + goldDamage * ([1, 1, 1, 3][pokemon.stars - 1] ?? 3)
    if (pokemon.player) {
      pokemon.player.addMoney(2, true, pokemon)
    }
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}
