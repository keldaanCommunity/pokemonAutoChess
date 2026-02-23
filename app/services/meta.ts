import Dendrogram, { IDendrogram } from "../models/mongo-models/dendrogram"
import ItemsStatistic, {
  IItemsStatisticV2
} from "../models/mongo-models/items-statistic-v2"
import MetaV2, { IMetaV2 } from "../models/mongo-models/meta-v2"
import PokemonsStatistics, {
  IPokemonsStatisticV2
} from "../models/mongo-models/pokemons-statistic-v2"
import RegionStatistic, {
  IRegionStatistic
} from "../models/mongo-models/regions-statistic"
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
    fetchMetaPokemons(),
    fetchMetaRegions(),
    fetchMetaV2(),
    fetchDendrogramData()
  ])
  logger.info("Meta reports refreshed")
  return data
}

let metadata = new Array<IReportMetadata>()
let metaItems = new Array<IItemsStatisticV2>()
let metaPokemons = new Array<IPokemonsStatisticV2>()
let metaRegions = new Array<IRegionStatistic>()
let metaV2 = new Array<IMetaV2>()
let dendrogram: IDendrogram | null = null

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

async function fetchMetaRegions() {
  metaRegions = await RegionStatistic.find().exec()
  return metaRegions
}

async function fetchMetaV2() {
  metaV2 = await MetaV2.find().exec()
  return metaV2
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

export function getMetaRegions() {
  return metaRegions
}

export function getMetaV2() {
  return metaV2
}

async function fetchDendrogramData() {
  dendrogram = await Dendrogram.findOne().exec()
  return dendrogram
}

export function getDendrogram() {
  return dendrogram
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
