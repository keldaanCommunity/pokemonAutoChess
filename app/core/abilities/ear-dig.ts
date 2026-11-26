import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class EarDigStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deal [30,60,120,240,SP] SPECIAL + [5,10,20,40,SP] per depth level of the hole the target is in. If the target is not in a hole, also dig a hole under them.
    const { bluePlayer, redPlayer } = target.simulation
    const blueIndex = target.positionY * BOARD_WIDTH + target.positionX
    const redIndex =
      (BOARD_HEIGHT - 1 - target.positionY) * BOARD_WIDTH + target.positionX
    let holeLevel = Math.max(
      bluePlayer?.groundHoles[blueIndex] ?? 0,
      redPlayer?.groundHoles[redIndex] ?? 0
    )
    const damage =
      ([30, 60, 120, 240][pokemon.stars - 1] ?? 240) +
      holeLevel * ([5, 10, 20, 40][pokemon.stars - 1] ?? 40)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    if (bluePlayer && holeLevel === 0) {
      bluePlayer.groundHoles[blueIndex] = 1
      holeLevel = 1
    }
    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      delay: holeLevel // delay will hold the ground hole depth info
    })
  }
}
