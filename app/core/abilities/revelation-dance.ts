import { AttackType } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RevelationDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    /* Performs a dance which projects feathers on ADJACENT tiles. 
    Enemies hit take [15,30,50,80,SP] SPECIAL and allies gain a bonus dependent of the style:
    - Baile Style: [3,6,10,15,SP] SPEED
    - Pom-Pom Style: [2,4,6,10,SP] ATK
    - Pa’u Style: [2,4,6,10,SP] SPE_DEF
    - Sensu Style: [15,30,50,80,SP] SHIELD
    */

    const speedBuff = [3, 6, 10, 15][pokemon.stars - 1] ?? 15
    const speDefBuff = [2, 4, 6, 10][pokemon.stars - 1] ?? 10
    const atkBuff = [2, 4, 6, 10][pokemon.stars - 1] ?? 10
    const shieldBuff = [15, 30, 50, 80][pokemon.stars - 1] ?? 80
    const damage = [15, 30, 50, 80][pokemon.stars - 1] ?? 80

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    cells.forEach((cell) => {
      if (cell.value?.team === pokemon.team) {
        switch (pokemon.name) {
          case Pkm.ORICORIO_BAILE:
            cell.value.addSpeed(speedBuff, pokemon, 1, crit)
            break
          case Pkm.ORICORIO_PA_U:
            cell.value.addSpecialDefense(speDefBuff, pokemon, 1, crit)
            break
          case Pkm.ORICORIO_POMPOM:
            cell.value.addAttack(atkBuff, pokemon, 1, crit)
            break
          case Pkm.ORICORIO_SENSU:
            cell.value.addShield(shieldBuff, pokemon, 1, crit)
            break
        }
      } else if (cell.value) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}
