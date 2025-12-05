import { log } from "console"
import ItemsStatistic, {
  IItemsStatisticV2
} from "../models/mongo-models/items-statistic-v2"
import PokemonsStatistics, {
  IPokemonsStatisticV2
} from "../models/mongo-models/pokemons-statistic-v2"
import ReportMetadata, {
  IReportMetadata
} from "../models/mongo-models/report-metadata"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { EloRank } from "../types/enum/EloRank"
import { Synergy } from "../types/enum/Synergy"
import { ITypeStatistics } from "../types/meta"
import { logger } from "../utils/logger"
import { mapToObj } from "../utils/map"

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

export function computeSynergyAverages() {
  const rankPerTierAndSynergy: Map<EloRank, Map<Synergy, number>> = new Map()
  const countPerTierAndSynergy: Map<EloRank, Map<Synergy, number>> = new Map()
  metaPokemons.forEach((pokemonStat) => {
    pokemonStat.pokemons.forEach((pkm) => {
      const tier = pokemonStat.tier
      if (!rankPerTierAndSynergy.has(tier)) {
        rankPerTierAndSynergy.set(tier, new Map())
        countPerTierAndSynergy.set(tier, new Map())
      }

      const pokemon = getPokemonData(pkm.name)
      for (const synergy of pokemon.types) {
        const count = pkm.count
        const rank = pkm.rank

        const ranksPerSynergy = rankPerTierAndSynergy.get(tier)!
        const countsPerSynergy = countPerTierAndSynergy.get(tier)!
        if (!ranksPerSynergy.has(synergy)) {
          ranksPerSynergy.set(synergy, 0)
          countsPerSynergy.set(synergy, 0)
        }
        ranksPerSynergy.set(
          synergy,
          ranksPerSynergy.get(synergy)! + rank * count
        )
        countsPerSynergy.set(synergy, countsPerSynergy.get(synergy)! + count)
      }
    })
  })

  const synergyAveragesPerTier: Map<
    EloRank,
    { [type in Synergy]: { average_rank: number; count: number } }
  > = new Map()
  rankPerTierAndSynergy.forEach((ranksPerSynergy, tier) => {
    const countsPerSynergy = countPerTierAndSynergy.get(tier)!
    const averagesPerSynergy: Map<
      Synergy,
      { average_rank: number; count: number }
    > = new Map()
    ranksPerSynergy.forEach((totalRank, synergy) => {
      const totalCount = countsPerSynergy.get(synergy)!
      averagesPerSynergy.set(synergy, {
        average_rank: totalRank / totalCount,
        count: totalCount
      })
    })
    synergyAveragesPerTier.set(tier, mapToObj(averagesPerSynergy))
  })

  // return json
  return mapToObj(synergyAveragesPerTier) as ITypeStatistics
}
