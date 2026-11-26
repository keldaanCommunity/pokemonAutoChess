import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import PokemonFactory from "../../models/pokemon-factory"
import { Ability } from "../../types/enum/Ability"
import { Pkm } from "../../types/enum/Pokemon"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PurpleRainStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // [4,6,8,10,12,SP] Ditto fall from the sky on random spots of the board. Their ability is replaced with Fusion,
    // which cause them to merge with the closest other Ditto ally, combining their stats.
    const nbDittos = Math.round(
      [4, 6, 8, 10, 12][pokemon.stars - 1] *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    const totalDuration = 3000
    const delayBetweenDittos = Math.round(totalDuration / nbDittos)
    for (let i = 0; i < nbDittos; i++) {
      pokemon.simulation.commands.push(
        new DelayedCommand(() => {
          const emptyCells: { x: number; y: number }[] = []
          for (let x = 0; x < BOARD_WIDTH; x++) {
            for (let y = 0; y < BOARD_HEIGHT; y++) {
              const entityOnCell = board.getEntityOnCell(x, y)
              if (!entityOnCell) {
                emptyCells.push({ x, y })
              }
            }
          }
          if (emptyCells.length === 0) return
          const { x: spawnX, y: spawnY } = pickRandomIn(emptyCells)
          const dittoPokemon = PokemonFactory.createPokemonFromName(
            Pkm.DITTO,
            pokemon.player
          )
          dittoPokemon.skill = Ability.AMALGAMATE
          const ditto = pokemon.simulation.addPokemon(
            dittoPokemon,
            spawnX,
            spawnY,
            pokemon.team,
            true
          )
          ditto.broadcastAbility({
            skill: "FLYING_SKYDIVE",
            targetX: spawnX,
            targetY: spawnY
          })
        }, i * delayBetweenDittos)
      )
    }
  }
}
