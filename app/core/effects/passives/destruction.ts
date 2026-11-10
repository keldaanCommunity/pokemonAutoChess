import { Ability } from "../../../types/enum/Ability"
import { Passive } from "../../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../../types/enum/Pokemon"
import type { PokemonEntity } from "../../pokemon-entity"

export function transformToCocoon(pokemon: PokemonEntity) {
  pokemon.maxPP = 10
  pokemon.pp = 0
  pokemon.skill = Ability.DARK_AURA
  pokemon.name = Pkm.YVELTAL_COCOON
  pokemon.index = PkmIndex[Pkm.YVELTAL_COCOON]
  pokemon.changePassive(Passive.COCOON_OF_DESTRUCTION)
  pokemon.status.tree = true
  pokemon.toIdleState()
  if (pokemon.player) {
    pokemon.player.pokemonsPlayed.add(Pkm.YVELTAL_COCOON)
  }
}

export function restoreYveltal(pokemon: PokemonEntity) {
  pokemon.maxPP = 100
  pokemon.pp = 0
  pokemon.skill = Ability.OBLIVION_WING
  pokemon.name = Pkm.YVELTAL
  pokemon.index = PkmIndex[Pkm.YVELTAL]
  pokemon.changePassive(Passive.DESTRUCTION)
  pokemon.status.tree = false
  pokemon.toMovingState()
  pokemon.cooldown = 0
}
