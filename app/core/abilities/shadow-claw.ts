import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShadowClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const baseDamage = [20, 40, 60, 120][pokemon.stars - 1] ?? 120
    const singleTargetDamage = [60, 100, 140, 280][pokemon.stars - 1] ?? 280
    const enemies = board
      .getCellsInFront(pokemon, target)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)
    const orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      orientation: orientation
    })
    const damage = enemies.length === 1 ? singleTargetDamage : baseDamage
    let damageDone = 0
    for (const enemy of enemies) {
      const report = enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      damageDone += report.takenDamage
    }
    pokemon.handleHeal(damageDone * 0.25, pokemon, 0, false)
  }
}
