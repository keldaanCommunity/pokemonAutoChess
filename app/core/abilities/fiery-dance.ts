import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FieryDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const cast = {
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      orientation: pokemon.orientation,
      ap
    }
    pokemon.broadcastAbility({
      ...cast,
      skill: Ability.FIERY_DANCE,
      targetX: target.positionX,
      targetY: target.positionY,
      data: { casterId: pokemon.id, targetId: target.id }
    })
    pokemon.addAbilityPower(30, pokemon, 0, false)
    const { chargeDuration, flightDuration } =
      AbilityConfigs[Ability.FIERY_DANCE]
    pokemon.simulation.commands.push(
      new DelayedCommand(() => {
        if (target.hp <= 0) return
        pokemon.broadcastAbility({
          ...cast,
          skill: "FIERY_DANCE_HIT",
          targetX: target.positionX,
          targetY: target.positionY,
          data: { targetId: target.id }
        })
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }, chargeDuration + flightDuration)
    )
  }
}
