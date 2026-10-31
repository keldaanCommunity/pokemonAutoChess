import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PowerGemStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const atkPercentage = 100
    const nbGems = Math.round(
      4 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    pokemon.broadcastAbility({ data: { nbGems } })
    const damage = atkPercentage * pokemon.atk
    pokemon.commands.push(
      new DelayedCommand(() => {
        for (let i = 0; i < nbGems; i++) {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }, 300)
    )
  }
}
