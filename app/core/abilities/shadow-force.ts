import { Ability } from "../../types/enum/Ability"
import { AttackType, Team } from "../../types/enum/Game"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShadowForceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage = [30, 45, 60, 120][pokemon.stars - 1] ?? 120
    pokemon.index = PkmIndex[Pkm.ORIGIN_GIRATINA]
    pokemon.skill = Ability.SHADOW_CLAW
    pokemon.toMovingState()
    if (pokemon.player) {
      pokemon.player.pokemonsPlayed.add(Pkm.ORIGIN_GIRATINA)
    }

    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )
    }

    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      skill: Ability.SHADOW_FORCE
    })

    const adjacentEnemies = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)

    for (const enemy of adjacentEnemies) {
      if (enemy.status.protect) {
        enemy.status.protect = false
        enemy.status.protectCooldown = 0
      }
      if (enemy.status.reflect) {
        enemy.status.reflect = false
        enemy.status.reflectCooldown = 0
      }
      if (enemy.status.magicBounce) {
        enemy.status.magicBounce = false
        enemy.status.magicBounceCooldown = 0
      }
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}
