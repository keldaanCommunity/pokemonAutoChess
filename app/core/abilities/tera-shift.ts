import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { Ability } from "../../types/enum/Ability"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import { EvolutionManager } from "../evolution-logic/evolution-manager"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TeraShiftStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.index = PkmIndex[Pkm.TERAPAGOS_TERASTAL]
    pokemon.name = Pkm.TERAPAGOS_TERASTAL
    pokemon.stars++
    pokemon.addAttack(10, pokemon, 0, false)
    pokemon.addMaxHP(100, pokemon, 0, false)
    pokemon.skill = Ability.TERA_STARSTORM
    pokemon.toMovingState()

    if (pokemon.refToBoardPokemon && pokemon.player) {
      EvolutionManager.evolve(
        pokemon.refToBoardPokemon as Pokemon,
        pokemon.player
      )
      pokemon.player.pokemonsPlayed.add(Pkm.TERAPAGOS_TERASTAL)
    }
  }
}
