import { Ability } from "../../types/enum/Ability"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import { OnResurrectionEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class UnboundStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.index = PkmIndex[Pkm.HOOPA_UNBOUND]
    this.transformToHoopaUnbound(pokemon)
    pokemon.effectsSet.add(
      new OnResurrectionEffect(({ pokemon }: { pokemon: PokemonEntity }) => {
        this.transformToHoopaUnbound(pokemon)
      }, Ability.UNBOUND)
    )

    if (pokemon.player) {
      pokemon.player.pokemonsPlayed.add(Pkm.HOOPA_UNBOUND)
    }
  }

  transformToHoopaUnbound(pokemon: PokemonEntity) {
    pokemon.skill = Ability.HYPERSPACE_FURY
    pokemon.addAttack(10, pokemon, 0, false)
    pokemon.addMaxHP(100, pokemon, 0, false)
    pokemon.toMovingState()
  }
}
