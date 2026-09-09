import PokemonFactory from "../../models/pokemon-factory"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { Pillars, Pkm } from "../../types/enum/Pokemon"
import { isIn } from "../../utils/array"
import { distanceE } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ColumnCrushStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const pillar = board.cells.find(
      (e) => e && e.team === pokemon.team && isIn(Pillars, e.name)
    )
    if (pillar) {
      // If a pillar is already on the board, jumps to it and throw the pillar at the closest target, dealing [50,100,150,SP] + the remaining HP of the pillar as SPECIAL
      const pillarX = pillar.positionX
      const pillarY = pillar.positionY
      const remainingHp = pillar.hp
      const pillarType = pillar.name
      pillar.shield = 0
      pillar.handleSpecialDamage(9999, board, AttackType.TRUE, null, false)
      pokemon.moveTo(pillarX, pillarY, board, false)
      pokemon.resetCooldown(800)

      pokemon.commands.push(
        new DelayedCommand(() => {
          const damage =
            ([50, 100, 150, 300][pokemon.stars - 1] ?? 300) + remainingHp

          let enemyHit
          const targetCoordinate = pokemon.state.getNearestTargetAtSight(
            pokemon,
            board
          )
          if (targetCoordinate) {
            enemyHit = targetCoordinate.target
          }
          if (!enemyHit) {
            enemyHit = board.cells.find(
              (entity) => entity && entity.team !== pokemon.team
            )
          }
          if (enemyHit) {
            pokemon.setTarget(enemyHit)
            const landingX = enemyHit.positionX
            const landingY = enemyHit.positionY
            const travelTime =
              distanceE(
                pillarX,
                pillarY,
                enemyHit.positionX,
                enemyHit.positionY
              ) * 160

            pokemon.broadcastAbility({
              positionX: pillar.positionX,
              positionY: pillar.positionY,
              targetX: enemyHit.positionX,
              targetY: enemyHit.positionY,
              orientation: [
                Pkm.PILLAR_WOOD,
                Pkm.PILLAR_IRON,
                Pkm.PILLAR_CONCRETE
              ].indexOf(pillarType)
            })

            pokemon.commands.push(
              new DelayedCommand(() => {
                pokemon.broadcastAbility({
                  skill: Ability.ROCK_SMASH,
                  positionX: landingX,
                  positionY: landingY,
                  targetX: landingX,
                  targetY: landingY
                })

                if (enemyHit && enemyHit.hp > 0) {
                  enemyHit.handleSpecialDamage(
                    damage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              }, travelTime)
            )
          }
        }, 500)
      )
    } else {
      //Builds a pillar of 100/200/300 HP and 1/3/5 DEF and SPE_DEF on the closest empty spot.
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(pokemon)
      if (!coord) return
      const pillarType = Pillars[pokemon.stars - 1] ?? Pkm.PILLAR_CONCRETE
      const pillar = PokemonFactory.createPokemonFromName(
        pillarType,
        pokemon.player
      )

      pokemon.simulation.addPokemon(
        pillar,
        coord.x,
        coord.y,
        pokemon.team,
        true
      )
    }
  }
}
