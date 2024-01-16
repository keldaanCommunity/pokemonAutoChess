import { Pkm } from "../app/types/enum/Pokemon"
import PokemonFactory from "../app/models/pokemon-factory"
import { Synergy } from "../app/types/enum/Synergy"
import { logger } from "../app/utils/logger"

Object.values(Pkm).forEach((p) => {
  const pkm = PokemonFactory.createPokemonFromName(p)
  if (pkm.stars === 2 && pkm.final && !pkm.types.has(Synergy.FOSSIL)) {
    logger.debug(pkm.name)
  }
})
