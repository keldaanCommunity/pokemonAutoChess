import { AttackType } from "../../types/enum/Game"
import { max } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PsyShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const ppBurn =
      ([20, 40, 80, 160][pokemon.stars - 1] ?? 160) * (1 + pokemon.ap / 100)
    const ppStolen = max(target.pp)(ppBurn)
    const extraPP = ppBurn - ppStolen

    target.addPP(-ppStolen, pokemon, 0, false)
    pokemon.addShield(ppBurn, pokemon, 0, false)
    if (extraPP > 0) {
      target.handleSpecialDamage(
        extraPP,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        false
      )
    }
  }
}
