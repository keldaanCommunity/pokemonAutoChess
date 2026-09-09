import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DreamEaterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const sleepingTarget = board.find(
      (x, y, entity) => entity.status.sleep && entity.team !== pokemon.team
    )

    if (sleepingTarget) {
      pokemon.broadcastAbility({
        targetX: sleepingTarget.positionX,
        targetY: sleepingTarget.positionY
      })
      const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
        sleepingTarget,
        board,
        1
      )
      if (coord) {
        pokemon.moveTo(coord.x, coord.y, board, false)
      }
      const damage = [45, 90, 150, 250][pokemon.stars - 1] ?? 250
      const { takenDamage } = sleepingTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        true
      )
      pokemon.handleHeal(takenDamage, pokemon, 0, false)
    } else {
      const targetThatCanSleep = [
        target,
        ...(board.cells.filter(
          (e) => e && e.team !== pokemon.team
        ) as PokemonEntity[])
      ].find(
        (e) =>
          !e.status.runeProtect &&
          !e.status.skydiving &&
          !e.effects.has(EffectEnum.IMMUNITY_SLEEP) &&
          e.status.ccCooldown <= 0
      )

      if (targetThatCanSleep) {
        const duration = Math.round(
          ([3000, 4000, 5000, 6000][pokemon.stars - 1] ?? 6000) *
            (1 + pokemon.ap / 100)
        )
        target.status.triggerSleep(duration, target)
        pokemon.broadcastAbility({
          targetX: target.positionX,
          targetY: target.positionY
        })
        pokemon.pp = pokemon.maxPP
      }
    }
  }
}
