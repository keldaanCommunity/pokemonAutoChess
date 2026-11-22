import PokemonFactory from "../../models/pokemon-factory"
import { Pkm } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SubstituteStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const x = pokemon.positionX
    const y = pokemon.positionY
    const coord = pokemon.simulation.getClosestFreeCellTo(x, y, pokemon.team)
    if (coord) {
      const substitute = PokemonFactory.createPokemonFromName(
        Pkm.SUBSTITUTE,
        pokemon.player
      )
      const bonusHP = Math.round(
        ([0.25, 0.25, 0.25, 0.5][pokemon.stars - 1] ?? 0.5) *
          pokemon.maxHP *
          (1 + pokemon.ap / 100) *
          (crit ? pokemon.critPower : 1)
      )
      substitute.addMaxHP(bonusHP)
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
