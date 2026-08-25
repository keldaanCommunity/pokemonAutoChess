import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, Orientation } from "../../types/enum/Game"
import { min } from "../../utils/number"
import { OrientationVector } from "../../utils/orientation"
import type { Board } from "../board"
import { PeriodicEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

class DragonRageEffect extends PeriodicEffect {
  ticksRemaining = 6
  // tracks only the shield granted by this ability, so unrelated shield sources aren't converted to heal
  shieldGiven = 0
  constructor(pokemon: PokemonEntity, crit: boolean, initialShield: number) {
    super(
      (pokemon: PokemonEntity, board: Board) => {
        this.ticksRemaining--
        if (this.ticksRemaining < 0) {
          pokemon.effectsSet.delete(this)
          pokemon.effects.delete(EffectEnum.DRAGON_RAGE)
          const shieldToConvert = min(this.shieldGiven)(pokemon.shield)
          pokemon.addShield(-shieldToConvert, pokemon, 0, false)
          pokemon.handleHeal(
            Math.round(shieldToConvert * 0.4),
            pokemon,
            0,
            false
          )
          return
        }
        const shield = [5, 10, 15, 20][pokemon.stars - 1] ?? 20
        const damage = [5, 10, 15, 20][pokemon.stars - 1] ?? 20
        pokemon.addShield(shield, pokemon, 1, crit)
        this.shieldGiven += shield

        Object.values(Orientation).forEach((orientation, index) => {
          pokemon.commands.push(
            new DelayedCommand(() => {
              pokemon.broadcastAbility({
                positionX: pokemon.positionX,
                positionY: pokemon.positionY,
                targetX: pokemon.positionX + OrientationVector[orientation][0],
                targetY: pokemon.positionY + OrientationVector[orientation][1]
              })
            }, 125 * index)
          )
        })

        board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .forEach((cell, index) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
      },
      EffectEnum.DRAGON_RAGE,
      1000
    )
    this.shieldGiven = initialShield
    pokemon.effects.add(EffectEnum.DRAGON_RAGE)
  }
}

export class DragonRageStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const initialShield = [15, 30, 45, 60][pokemon.stars - 1] ?? 60
    if (pokemon.effects.has(EffectEnum.DRAGON_RAGE)) {
      const dragonRageEffect = Array.from(pokemon.effectsSet).find(
        (effect) => effect instanceof DragonRageEffect
      )
      if (dragonRageEffect) {
        dragonRageEffect.ticksRemaining = 6
      }
    } else {
      pokemon.addShield(initialShield, pokemon, 1, crit)
      pokemon.effectsSet.add(new DragonRageEffect(pokemon, crit, initialShield))
    }
  }
}
