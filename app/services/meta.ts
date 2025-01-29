import ItemsStatistics, {
  IItemsStatistic
} from "../models/mongo-models/items-statistic"
import PokemonsStatistics, {
  IPokemonsStatisticV2
} from "../models/mongo-models/pokemons-statistic-v2"
import { logger } from "../utils/logger"

export function fetchMetaReports() {
  logger.info("Refreshing meta reports...")
  return Promise.all([fetchMetaItems(), fetchMetaPokemons()])
}

let metaItems = new Array<IItemsStatistic>()
let metaPokemons = new Array<IPokemonsStatisticV2>()

export async function fetchMetaItems() {
  metaItems = await ItemsStatistics.find()
  return metaItems
}

export async function fetchMetaPokemons() {
  metaPokemons = await PokemonsStatistics.find()
  return metaPokemons
}

export function getMetaPokemons() {
  return metaPokemons
}

export function getMetaItems() {
  return metaItems
}
