import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class DarkestLariatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // The user swings both arms and hits the target several times while moving behind them.
    // Each hit deals [100,SP]% ATK as SPECIAL. Number of hits increase with SPEED. Target is FLINCH during the attack.
    const hits = Math.round((1 + 0.01 * pokemon.speed) * 3)
    target.status.triggerFlinch(1000, target, pokemon)
    for (let i = 0; i < hits; i++) {
      pokemon.commands.push(
        new DelayedCommand(
          () => {
            if (target.hp > 0) {
              const damage =
                ([1, 1, 1, 2][pokemon.stars - 1] ?? 2) * pokemon.atk
              target.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              if (pokemon.effects.has(EffectEnum.WILDFIRE)) {
                pokemon.addAttack(1, pokemon, 0, false)
              } else if (pokemon.effects.has(EffectEnum.BLAZE)) {
                pokemon.addAttack(2, pokemon, 0, false)
              } else if (pokemon.effects.has(EffectEnum.DESOLATE_LAND)) {
                pokemon.addAttack(3, pokemon, 0, false)
              }
            }
          },
          Math.round((i * 1000) / hits)
        )
      )
    }
    const dx = target.positionX - pokemon.positionX
    const dy = target.positionY - pokemon.positionY
    const freeCellBehind = board.getClosestAvailablePlace(
      target.positionX + dx,
      target.positionY + dy
    )
    pokemon.broadcastAbility({
      targetX: freeCellBehind?.x ?? pokemon.positionX,
      targetY: freeCellBehind?.y ?? pokemon.positionY
    })

    if (freeCellBehind) {
      pokemon.moveTo(freeCellBehind.x, freeCellBehind.y, board, false)
      pokemon.resetCooldown(500)
    }
  }
}
