import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, Team } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { PeriodicEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

class DarkHarvestEffect extends PeriodicEffect {
  duration: number
  constructor(duration: number, pokemon: PokemonEntity) {
    super(
      (pokemon) => {
        this.duration -= this.intervalMs
        if (this.duration <= 0) {
          pokemon.effectsSet.delete(this)
          pokemon.effects.delete(EffectEnum.DARK_HARVEST)
          return
        }

        if (
          pokemon.status.resurrecting ||
          pokemon.status.freeze ||
          pokemon.status.sleep
        ) {
          return
        }
        pokemon.broadcastAbility({ skill: Ability.DARK_HARVEST })
        const board = pokemon.simulation.board
        const crit = pokemon.effects.has(EffectEnum.ABILITY_CRIT)
          ? chance(pokemon.critChance / 100, pokemon)
          : false
        const darkHarvestDamage = [5, 10, 20, 40][pokemon.stars - 1] ?? 40
        const healFactor = 0.3
        board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              const { takenDamage } = cell.value.handleSpecialDamage(
                darkHarvestDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit,
                true
              )
              pokemon.handleHeal(
                Math.round(takenDamage * healFactor),
                pokemon,
                0,
                false
              )
            }
          })
      },
      EffectEnum.DARK_HARVEST,
      1000
    )

    this.timer = 0 // delay the first tick
    this.duration = duration + 200 // to ensure the effect ticks 3 times exactly, 200ms is a good margin for 3 event loops

    if (pokemon.effects.has(EffectEnum.DARK_HARVEST)) {
      pokemon.effectsSet.delete(this)
      for (const effect of pokemon.effectsSet) {
        if (effect instanceof DarkHarvestEffect) {
          effect.duration = Math.max(this.duration, effect.duration)
          effect.timer = this.timer
          break
        }
      }
    } else {
      pokemon.effects.add(EffectEnum.DARK_HARVEST)
    }
  }
}

export class DarkHarvestStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )
    const effectDuration = 3000

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )
      pokemon.effectsSet.add(new DarkHarvestEffect(effectDuration, pokemon))
      pokemon.status.triggerSilence(effectDuration, pokemon, pokemon)
    }
  }
}
