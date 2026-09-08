import { Ability } from "../../types/enum/Ability"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShieldsUpStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    pokemon.broadcastAbility({ skill: Ability.SHIELDS_UP })
    pokemon.index = PkmIndex[Pkm.MINIOR]
    pokemon.name = Pkm.MINIOR
    pokemon.skill = Ability.SHIELDS_DOWN
    pokemon.cooldown = 0
  }
}
