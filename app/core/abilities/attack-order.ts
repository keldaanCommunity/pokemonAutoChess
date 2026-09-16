import PokemonFactory from "../../models/pokemon-factory"
import { EffectEnum } from "../../types/enum/Effect"
import { Pkm } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AttackOrderStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Spawn a Combee nearby then all Combee allies get enraged for 3 seconds
    // The next attack of the user deals [20,40,60,120,SP] additional special damage + [10,20,30,60,SP] per Combee ally on the board.
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

    pokemon.effects.add(EffectEnum.ATTACK_ORDER_NEXT_ATTACK)
    board.forEach((x: number, y: number, p: PokemonEntity | undefined) => {
      if (p && p.name === Pkm.COMBEE && p.team === pokemon.team) {
        p.status.triggerRage(3000, p)
        pokemon.broadcastAbility({
          skill: "ATTACK_ORDER",
          positionX: x,
          positionY: y
        })
      }
    })
  }
}
