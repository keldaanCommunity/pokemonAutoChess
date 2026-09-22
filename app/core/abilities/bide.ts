import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { OnDamageReceivedEffect, PeriodicEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

class BideEffect extends PeriodicEffect {
  duration: number
  damageReceived: number = 0
  constructor(
    pokemon: PokemonEntity,
    duration: number,
    board: Board,
    crit: boolean
  ) {
    super(
      (pokemon) => {
        if (this.duration <= 0) {
          this.procDamage(pokemon, board, crit)
          pokemon.effectsSet.delete(this)
          pokemon.effectsSet.delete(damageMonitor)
          pokemon.effects.delete(EffectEnum.NO_PP_GAIN)
        } else {
          this.duration -= this.intervalMs
        }
      },
      Ability.BIDE,
      1000
    )
    this.duration = duration
    const damageMonitor = new OnDamageReceivedEffect(({ damage }) => {
      this.damageReceived += damage
    }, Ability.BIDE)
    pokemon.effectsSet.add(damageMonitor)
    pokemon.effects.add(EffectEnum.NO_PP_GAIN)
  }
  procDamage(pokemon: PokemonEntity, board: Board, crit: boolean) {
    pokemon.broadcastAbility({ skill: Ability.BIDE })
    const damageFactor = [1.0, 1.5, 2.0, 4.0][pokemon.stars - 1] ?? 4.0
    const damage = damageFactor * this.damageReceived
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class BideStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.effectsSet.add(new BideEffect(pokemon, 3000, board, crit))
  }
}
