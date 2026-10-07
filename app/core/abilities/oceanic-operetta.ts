import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class OceanicOperettaStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    //For the next 5 seconds, each second a wave of water and music hits in a 3-tile radius. All enemies hit are pushed back and receive [10,20,30,60,100,SP] SPECIAL. All allies in the area are cured of BURN and other SOUND allies receive [10,SP] PP.
    super.process(pokemon, board, target, crit, true)
    const nbWaves = 5
    const nbPP = [10, 20, 30, 60, 100][pokemon.stars - 1] ?? 100
    const radius = 3
    const damage = [10, 20, 40, 60, 100][pokemon.stars - 1] ?? 100

    function applyWave() {
      pokemon.broadcastAbility()
      pokemon.status.healBurn(pokemon)

      const pokemonsHit = board
        .getCellsInRadius(pokemon.positionX, pokemon.positionY, radius, false)
        .map((cell) => cell.value)
        .filter((p): p is PokemonEntity => !!p)
      pokemonsHit.forEach((p) => {
        if (p.team !== pokemon.team) {
          const orientation = board.orientation(
            pokemon.positionX,
            pokemon.positionY,
            p.positionX,
            p.positionY,
            pokemon
          )
          const destination = board.getKnockBackPlace(
            p.positionX,
            p.positionY,
            orientation
          )

          if (destination) {
            p.moveTo(destination.x, destination.y, board, true)
            p.resetCooldown(500)
          }

          p.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        } else {
          p.status.healBurn(p)
          if (p.types.has(Synergy.SOUND)) {
            p.addPP(nbPP, pokemon, 1, crit)
          }
        }
      })
    }

    for (let i = 0; i < nbWaves; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          applyWave()
        }, i * 1000)
      )
    }
  }
}
