import { AttackType } from "../../types/enum/Game"
import { distanceM } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ArmorCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const mainDamage = [15, 30, 50, 100][pokemon.stars - 1] ?? 100
    const secondaryDamage = [15, 30, 50, 100][pokemon.stars - 1] ?? 100
    const finalDamage = [6, 12, 25, 50][pokemon.stars - 1] ?? 50
    const numberOfTargets = 2

    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })
    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          mainDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        const possibleTargets = new Array<PokemonEntity>()
        board.forEach((x, y, entity) => {
          if (entity && entity.team !== pokemon.team && entity !== target) {
            possibleTargets.push(entity)
          }
        })
        possibleTargets.sort(
          (a, b) =>
            distanceM(
              a.positionX,
              a.positionY,
              pokemon.positionX,
              pokemon.positionY
            ) -
            distanceM(
              b.positionX,
              b.positionY,
              pokemon.positionX,
              pokemon.positionY
            )
        )
        const targets = possibleTargets.slice(0, numberOfTargets)
        targets.forEach((tg) => {
          pokemon.broadcastAbility({
            positionX: target.positionX,
            positionY: target.positionY,
            targetX: tg.positionX,
            targetY: tg.positionY,
            delay: 1
          })
          pokemon.commands.push(
            new DelayedCommand(() => {
              tg.handleSpecialDamage(
                secondaryDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              pokemon.broadcastAbility({
                positionX: tg.positionX,
                positionY: tg.positionY,
                targetX: target.positionX,
                targetY: target.positionY,
                delay: 2
              })
              pokemon.commands.push(
                new DelayedCommand(() => {
                  target.handleSpecialDamage(
                    finalDamage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }, 300)
              )
            }, 300)
          )
        })
      }, 300)
    )
  }
}
