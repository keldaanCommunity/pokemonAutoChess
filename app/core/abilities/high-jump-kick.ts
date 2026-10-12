import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { max } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HighJumpKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    const ppStolen = max(40)(target.pp)
    if (target.items.has(Item.TWIST_BAND) === false) {
      pokemon.addPP(ppStolen, pokemon, 0, false)
      target.addPP(-ppStolen, pokemon, 0, false)
      target.count.manaBurnCount++
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
