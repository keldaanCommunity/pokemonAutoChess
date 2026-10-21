import PokemonFactory from "../../models/pokemon-factory"
import { Pkm } from "../../types/enum/Pokemon"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BeatUpStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const nbSpawns = [1, 2, 3, 5][pokemon.stars - 1] ?? 5
    for (let i = 0; i < nbSpawns; i++) {
      const houndour = PokemonFactory.createPokemonFromName(
        Pkm.HOUNDOUR,
        pokemon.player
      )
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(pokemon)
      if (coord) {
        const entity = pokemon.simulation.addPokemon(
          houndour,
          coord.x,
          coord.y,
          pokemon.team,
          true
        )
        const scale = (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
        entity.maxHP = min(1)(Math.round(entity.maxHP * scale))
        entity.hp = entity.maxHP
      }
    }
  }
}
