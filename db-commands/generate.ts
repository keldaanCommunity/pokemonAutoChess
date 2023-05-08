import PokemonFactory from "../app/models/pokemon-factory"
import { Pkm } from "../app/types/enum/Pokemon"
import { logger } from "../app/utils/logger"

Object.keys(Pkm).forEach((k) => {
  const p = PokemonFactory.createPokemonFromName(Pkm[k])
  logger.info(`"${Pkm[k]}" = "${p.index}",`)
})
