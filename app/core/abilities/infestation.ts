import { AttackType, Team } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import { isOnBench } from "../../utils/board"
import { distanceM } from "../../utils/distance"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { getStrongestUnit } from "../unit-score"
import { AbilityStrategy } from "./ability-strategy"

export class InfestationStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const numberOfBugAllies = board.cells.filter(
      (entity) =>
        entity && entity.team === pokemon.team && entity.types.has(Synergy.BUG)
    ).length
    const damage = numberOfBugAllies * ([10, 10, 10, 20][pokemon.stars - 1] ?? 20)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    if (pokemon.player && pokemon.count.ult === 1) {
      const bugsOnBench = schemaValues(pokemon.player?.board).filter(
        (p) => p && p.types.has(Synergy.BUG) && isOnBench(p)
      )
      const mostPowerfulBug = getStrongestUnit(bugsOnBench)
      if (mostPowerfulBug) {
        pokemon.broadcastAbility({
          positionX: mostPowerfulBug.positionX,
          positionY: pokemon.team === Team.RED_TEAM ? 8 : 0,
          targetX: pokemon.positionX,
          targetY: pokemon.positionY
        })
        pokemon.commands.push(
          new DelayedCommand(
            () => {
              const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
                pokemon,
                board
              )
              if (coord) {
                pokemon.simulation.addPokemon(
                  mostPowerfulBug,
                  coord.x,
                  coord.y,
                  pokemon.team,
                  true
                )
              }
            },
            distanceM(
              pokemon.positionX,
              pokemon.positionY,
              mostPowerfulBug.positionX,
              mostPowerfulBug.positionY
            ) *
              150 -
              30
          )
        )
      }
    }
  }
}
