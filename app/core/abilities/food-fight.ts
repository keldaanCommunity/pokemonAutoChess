import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { Dishes } from "../../types"
import { AttackType } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FoodFightStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const duration = 3000
    pokemon.cooldown = duration

    // Throw [6,8,10,16,24,SP] random dishes in the next 3 seconds to random allies and enemies.
    // Allies hit heal 50 HP and receive the dish effect while enemies take 50 SPECIAL.

    const nbDishes = [6, 8, 10, 16, 24][pokemon.stars - 1] ?? 24
    const dt = Math.round(duration / nbDishes)
    for (let i = 0; i < nbDishes; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const dish = pickRandomIn(Dishes)
          const randomTarget = pickRandomIn(
            board.cells.filter<PokemonEntity>(
              (entity): entity is PokemonEntity =>
                entity != null && entity.id !== pokemon.id
            )
          )
          pokemon.broadcastAbility({
            targetX: randomTarget.positionX,
            targetY: randomTarget.positionY,
            delay: Dishes.indexOf(dish) // delay is used to pass the index of the dish
          })

          pokemon.simulation.commands.push(
            new DelayedCommand(() => {
              if (randomTarget.hp <= 0) return
              if (randomTarget.team === pokemon.team) {
                randomTarget.simulation.applyDishEffects(
                  dish,
                  randomTarget.refToBoardPokemon as Pokemon,
                  randomTarget,
                  randomTarget.player
                )
              } else {
                randomTarget.handleSpecialDamage(
                  50,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }, 500)
          )
        }, i * dt)
      )
    }
  }
}
