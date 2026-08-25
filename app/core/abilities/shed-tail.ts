import PokemonFactory from "../../models/pokemon-factory"
import { Pkm } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShedTailStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const x = pokemon.positionX
    const y = pokemon.positionY
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthAlly) {
      lowestHealthAlly.addShield([40, 60, 80, 160][pokemon.stars - 1] ?? 160, pokemon, 1, crit)
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(lowestHealthAlly)
      if (coord) {
        const substitute = PokemonFactory.createPokemonFromName(
          Pkm.SUBSTITUTE,
          pokemon.player
        )
        pokemon.moveTo(coord.x, coord.y, board, false)
        pokemon.simulation.addPokemon(substitute, x, y, pokemon.team, true)
        for (const pokemonTargetingCaster of board.cells.filter(
          (p) => p?.targetEntityId === pokemon.id
        )) {
          pokemonTargetingCaster!.targetEntityId = substitute.id
        }
      }
    }
  }
}
