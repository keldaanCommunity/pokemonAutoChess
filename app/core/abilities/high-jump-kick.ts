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
    super.process(pokemon, board, target, crit, true)
    const damage = [15, 30, 60, 120, 240][pokemon.stars - 1] ?? 240
    const ppStolen = max(40)(target.pp)
    const casterPPBefore = pokemon.pp
    const targetPPBefore = target.pp
    if (target.items.has(Item.TWIST_BAND) === false) {
      pokemon.addPP(ppStolen, pokemon, 0, false)
      target.addPP(-ppStolen, pokemon, 0, false)
      target.count.manaBurnCount++
    }
    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1)),
      data: {
        ppLost: target.pp < targetPPBefore,
        ppGained: pokemon.pp > casterPPBefore
      }
    })
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
