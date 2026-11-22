import { AttackType } from "../../types/enum/Game"
import { min } from "../../utils/number"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class LastRespectsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Reduction factor for curse delay based on AP and crit
    const factor = 0.2

    // Base damage scales with star level: 1★=30, 2★=60, 3★=90
    const damage = [30, 60, 90, 180][pokemon.stars - 1] ?? 180

    // Calculate curse delay with AP and crit scaling
    // Base delays: 1★=10s, 2★=8s, 3★=6s, 4★=4s, reduced by AP and crit power
    const curseDelay = min(0)(
      ([10000, 8000, 6000, 4000][pokemon.stars - 1] ?? 4000) *
        (1 - (factor * pokemon.ap) / 100) *
        (crit ? 1 - (pokemon.critPower - 1) * factor : 1)
    )

    // Find all adjacent enemies that aren't already cursed
    const cells = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter((c) => c.value?.team === target.team && !c.value?.status.curse)
      .map((c) => c.value)

    // Pick a random uncursed ally to curse, fallback to original target
    const curseTarget = pickRandomIn(cells)
    const damageTarget = curseTarget || target

    // Broadcast ability animation
    pokemon.broadcastAbility({
      targetX: damageTarget.positionX,
      targetY: damageTarget.positionY,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })

    // Deal immediate damage to the target
    damageTarget.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    // Apply curse status that will KO after the calculated delay
    curseTarget?.status.triggerCurse(curseDelay, curseTarget)
  }
}
