import PokemonFactory from "../../models/pokemon-factory"
import { AttackType } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { distanceM } from "../../utils/distance"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class GulpMissileStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    let missilePkm = Pkm.ARROKUDA
    let missilePkmString = "arrokuda"

    const damage = [25, 40, 55, 110][pokemon.stars - 1] ?? 110

    if (chance(0.2, pokemon)) {
      missilePkm = Pkm.PIKACHU
      missilePkmString = "pikachu"
    }

    pokemon.broadcastAbility({
      skill: `GULP_MISSILE/${missilePkmString}`
    })

    const missile = PokemonFactory.createPokemonFromName(
      missilePkm,
      pokemon.player
    )
    if (pokemon.player) pokemon.player.pokemonsPlayed.add(missilePkm)

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
            target,
            board
          )
          if (coord) {
            const entity = pokemon.simulation.addPokemon(
              missile,
              coord.x,
              coord.y,
              pokemon.team,
              true
            )

            entity.pp = entity.maxPP

            target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        },
        distanceM(
          target.positionX,
          target.positionY,
          pokemon.positionX,
          pokemon.positionY
        ) *
          150 -
          30
      )
    )
  }
}
