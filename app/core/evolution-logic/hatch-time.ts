import { EvolutionTime } from "../../config"
import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { EffectEnum } from "../../types/enum/Effect"
import { Pkm } from "../../types/enum/Pokemon"

export function getHatchTime(pokemon: Pokemon, player: Player): number {
  if (pokemon.name === Pkm.EGG) {
    return player.effects.has(EffectEnum.BREEDER) ||
      player.effects.has(EffectEnum.GOLDEN_EGGS)
      ? EvolutionTime.EGG_HATCH - 1
      : EvolutionTime.EGG_HATCH
  }
  return EvolutionTime.EVOLVE_HATCH
}
