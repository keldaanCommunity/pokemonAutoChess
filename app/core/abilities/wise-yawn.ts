import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WiseYawnStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    // Find ally with lowest current health
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp - b.hp)[0]

    if (lowestHealthAlly) {
      // Find enemies targeting the lowest health ally
      const opponentsTargetingLowestHealthAlly =
        board.cells.filter<PokemonEntity>(
          (entity): entity is PokemonEntity =>
            entity != null &&
            entity.team !== lowestHealthAlly.team &&
            entity.targetEntityId === lowestHealthAlly.id
        )

      // Apply fatigue and AP reduction to attackers
      opponentsTargetingLowestHealthAlly.forEach((opponent) => {
        opponent.status.triggerFatigue(3000, pokemon)
        opponent.addAbilityPower(-20, pokemon, 0, false)
      })

      // Shield the lowest health ally
      const shield = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
      lowestHealthAlly.addShield(shield, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}
