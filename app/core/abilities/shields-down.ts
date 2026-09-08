import { Ability } from "../../types/enum/Ability"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShieldsDownStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    pokemon.broadcastAbility({ skill: Ability.SHIELDS_UP })
    const pkm = pickRandomIn([
      Pkm.MINIOR_KERNEL_BLUE,
      Pkm.MINIOR_KERNEL_GREEN,
      Pkm.MINIOR_KERNEL_ORANGE,
      Pkm.MINIOR_KERNEL_RED
    ])
    pokemon.index = PkmIndex[pkm]
    pokemon.name = pkm
    pokemon.skill = Ability.SHIELDS_UP
    pokemon.cooldown = 0
    if (pokemon.player) {
      pokemon.player.pokemonsPlayed.add(pkm)
    }
  }
}
