import { AttackType } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MindBlownStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const FIREWORK_COLORS = ["pink", "blue", "yellow", "white"]
    const nbFireworks = Math.floor([3, 4, 5, 8][pokemon.stars - 1] ?? 8 * (1 + pokemon.ap / 100))
    // Throws its head in the air, which then explodes into 5 fireworks.
    for (let i = 0; i < nbFireworks; i++) {
      const color = pickRandomIn(FIREWORK_COLORS)
      const randomTarget =
        pickRandomIn(board.cells.filter((e) => e && e.team !== pokemon.team)) ??
        target
      const x = i === 0 ? target.positionX : randomTarget?.positionX
      const y = i === 0 ? target.positionY : randomTarget?.positionY

      /*
        Fireworks hit in a 2 tile radius above random enemies, with effect depending on their color:
        - Pink: Deal [20,SP] PHYSICAL and BURN for 5 seconds
        - Blue: Deal [20,SP] SPECIAL and FATIGUE for 5 seconds.
        - Yellow: Deal [20,SP] TRUE and FLINCH for 5 seconds.
        - White: Give [20,SP] SHIELD and cure status afflictions for allies.
      */
      pokemon.simulation.room.clock.setTimeout(
        () => {
          if (
            !pokemon.simulation ||
            !pokemon.simulation.room ||
            pokemon.simulation.finished
          ) {
            return
          }
          const cellsHit = board.getCellsInRadius(x, y, 2, true)
          cellsHit.forEach((cell) => {
            switch (color) {
              case "pink":
                if (cell.value && cell.value.team !== pokemon.team) {
                  cell.value.handleSpecialDamage(
                    20,
                    board,
                    AttackType.PHYSICAL,
                    pokemon,
                    crit,
                    false
                  )
                  cell.value.status.triggerBurn(5000, cell.value, pokemon)
                }
                break
              case "blue":
                if (cell.value && cell.value.team !== pokemon.team) {
                  cell.value.handleSpecialDamage(
                    20,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit,
                    false
                  )
                  cell.value.status.triggerFatigue(5000, cell.value, pokemon)
                }
                break
              case "yellow":
                if (cell.value && cell.value.team !== pokemon.team) {
                  cell.value.handleSpecialDamage(
                    20,
                    board,
                    AttackType.TRUE,
                    pokemon,
                    crit,
                    false
                  )
                }
                break
              case "white":
                if (cell.value && cell.value.team === pokemon.team) {
                  cell.value.addShield(20, pokemon, 0, crit)
                  cell.value.status.clearNegativeStatus(cell.value, pokemon)
                }
                break
            }
          })
          pokemon.broadcastAbility({
            targetX: x,
            targetY: y,
            skill: "MIND_BLOWN_FIREWORK",
            delay: FIREWORK_COLORS.indexOf(color)
          })
        },
        1000 + 250 * i
      )
    }

    // The user loses 50% of its max HP in the process
    pokemon.handleSpecialDamage(
      pokemon.maxHP / 2,
      board,
      AttackType.TRUE,
      pokemon,
      false,
      false
    )
  }
}
