import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class LinkCableStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate && farthestTarget) {
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
      pokemon.setTarget(farthestTarget)
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        if (pokemon.hp <= 0) return
        const partner = board.find(
          (x, y, entity) =>
            entity.skill === Ability.LINK_CABLE &&
            entity.id !== pokemon.id &&
            entity.team === pokemon.team
        )
        if (partner) {
          const damage = [40, 40, 40, 80][pokemon.stars - 1] ?? 80
          const targetsHit = new Set<PokemonEntity>()
          effectInLine(board, pokemon, partner, (cell) => {
            if (cell.value != null && cell.value.team !== pokemon.team) {
              targetsHit.add(cell.value)
            }
          })
          board
            .getAdjacentCells(pokemon.positionX, pokemon.positionY)
            .forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                targetsHit.add(cell.value)
              }
            })
          board
            .getAdjacentCells(partner.positionX, partner.positionY)
            .forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                targetsHit.add(cell.value)
              }
            })

          targetsHit.forEach((target) => {
            target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          })
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_link",
            targetX: partner.positionX,
            targetY: partner.positionY
          })
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_discharge",
            positionX: pokemon.positionX,
            positionY: pokemon.positionY
          })
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_discharge",
            positionX: partner.positionX,
            positionY: partner.positionY,
            delay: 200
          })
        } else {
          const damage = [20, 20, 20, 40][pokemon.stars - 1] ?? 40
          const cells = board.getAdjacentCells(
            pokemon.positionX,
            pokemon.positionY
          )
          cells.forEach((cell) => {
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
          pokemon.broadcastAbility({ skill: "LINK_CABLE_discharge" })
        }
      }, 300)
    )
  }
}
