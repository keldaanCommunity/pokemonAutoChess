import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HeadSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = [40, 80, 150, 300][pokemon.stars - 1] ?? 300
    const recoil = [10, 20, 40, 80][pokemon.stars - 1] ?? 80

    if (target.status.sleep || target.status.freeze) {
      target.handleSpecialDamage(9999, board, AttackType.TRUE, pokemon, crit)
    } else {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
    if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}
