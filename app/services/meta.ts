import { log } from "console"
import PokemonsStatistics, {
  IPokemonsStatisticV2
} from "../models/mongo-models/pokemons-statistic-v2"
import ReportMetadata, {
  IReportMetadata
} from "../models/mongo-models/report-metadata"
import { logger } from "../utils/logger"
import ItemsStatistic, {
  IItemsStatisticV2
} from "../models/mongo-models/items-statistic-v2"

export async function fetchMetaReports() {
  logger.info("Refreshing meta reports...")
  const data = await Promise.all([
    fetchMetadata(),
    fetchMetaItems(),
    fetchMetaPokemons()
  ])
  logger.info("Meta reports refreshed")
  return data
}

let metadata = new Array<IReportMetadata>()
let metaItems = new Array<IItemsStatisticV2>()
let metaPokemons = new Array<IPokemonsStatisticV2>()

async function fetchMetaItems() {
  metaItems = await ItemsStatistic.find().exec()
  return metaItems
}

async function fetchMetaPokemons() {
  metaPokemons = await PokemonsStatistics.find().exec()
  return metaPokemons
}

async function fetchMetadata() {
  metadata = await ReportMetadata.find().exec()
  return metadata
}

export function getMetaPokemons() {
  return metaPokemons
}

export function getMetaItems() {
  return metaItems
}

export function getMetadata() {
  return metadata
}
