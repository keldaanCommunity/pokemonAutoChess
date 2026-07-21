import { AttackType } from "../../types/enum/Game"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AuraWheelStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.name === Pkm.MORPEKO) {
      pokemon.name = Pkm.MORPEKO_HANGRY
      pokemon.index = PkmIndex[Pkm.MORPEKO_HANGRY]
      if (pokemon.player) {
        pokemon.player.pokemonsPlayed.add(Pkm.MORPEKO_HANGRY)
      }
    } else {
      pokemon.name = Pkm.MORPEKO
      pokemon.index = PkmIndex[Pkm.MORPEKO]
    }
    pokemon.addSpeed(10, pokemon, 0, false)

    const damage = [20, 40, 60, 120][pokemon.stars - 1] ?? 120
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    pokemon.resetCooldown(500)
  }
}
