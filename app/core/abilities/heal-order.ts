import PokemonFactory from "../../models/pokemon-factory"
import { Pkm } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HealOrderStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Spawn a Combee nearby then user and every Combee heals adjacent allies for [10,20,30] HP and clear their negative statuses.
    super.process(pokemon, board, target, crit, true)

    const combee = PokemonFactory.createPokemonFromName(
      Pkm.COMBEE,
      pokemon.player
    )
    const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
      pokemon,
      board
    )
    if (coord) {
      if (pokemon.player) pokemon.player.pokemonsPlayed.add(Pkm.COMBEE)
      pokemon.simulation.addPokemon(
        combee,
        coord.x,
        coord.y,
        pokemon.team,
        true
      )
    }

    const heal = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    board.forEach((x: number, y: number, p: PokemonEntity | undefined) => {
      if (
        p &&
        (p.name === Pkm.COMBEE || p.id === pokemon.id) &&
        p.team === pokemon.team
      ) {
        const cells = board.getAdjacentCells(p.positionX, p.positionY)
        cells.forEach((cell) => {
          if (cell.value && cell.value.team === pokemon.team) {
            cell.value.handleHeal(heal, pokemon, 1, crit)
            cell.value.status.clearNegativeStatus(cell.value, pokemon)
          }
        })
        pokemon.broadcastAbility({
          skill: "HEAL_ORDER",
          positionX: x,
          positionY: y
        })
      }
    })
  }
}
