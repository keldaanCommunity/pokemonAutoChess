import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FollowMeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Jump to a free cell far away and gain [40,SP] SHIELD. Enemies that were targeting the user are CHARM for 3 seconds.
    const cellToJump = board.getSafePlaceAwayFrom(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (cellToJump) {
      const enemiesTargetingPokemon = board.cells.filter<PokemonEntity>(
        (entity): entity is PokemonEntity =>
          entity != null &&
          entity.targetEntityId === pokemon.id &&
          entity.team !== pokemon.team
      )
      const charmDuration = [1000, 2000, 3000, 5000][pokemon.stars - 1] ?? 5000
      enemiesTargetingPokemon.forEach((enemy) => {
        enemy.status.triggerCharm(charmDuration, enemy, pokemon, false)
      })
      pokemon.moveTo(cellToJump.x, cellToJump.y, board, false)
      const shield = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
      pokemon.addShield(shield, pokemon, 1, crit)
    }
  }
}
