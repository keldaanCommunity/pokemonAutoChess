import { Pkm } from "../../types/enum/Pokemon"
import { TownEncounter } from "../../types/enum/TownEncounter"
import { randomWeighted } from "../../utils/random"

export const TownEncounterSellPrice: { [encounter in TownEncounter]?: number } =
  {
    [Pkm.KECLEON]: 10,
    [Pkm.KANGASKHAN]: 10,
    [Pkm.CHANSEY]: 10,
    [Pkm.ELECTIVIRE]: 10
  }

export const TownEncountersByStage: {
  [stageLevel: number]: { [encounter in TownEncounter]?: number }
} = {
  4: {
    [Pkm.WIGGLYTUFF]: 1 / 20,
    [Pkm.CHANSEY]: 1 / 20,
    [Pkm.MEOWTH]: 1 / 20,
    [Pkm.DUSKULL]: 1 / 20,
    [Pkm.CINCCINO]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.CELEBI]: 1 / 40,
    [Pkm.MAKUHITA]: 1 / 20,
    [Pkm.MAGNEZONE]: 1 / 20
  },
  12: {
    [Pkm.KANGASKHAN]: 1 / 20,
    [Pkm.WOBBUFFET]: 1 / 20,
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.CINCCINO]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SABLEYE]: 1 / 20,
    [Pkm.MAKUHITA]: 1 / 20,
    [Pkm.CELEBI]: 1 / 40
  },
  17: {
    [Pkm.WOBBUFFET]: 1 / 20,
    [Pkm.CROAGUNK]: 1 / 20,
    [Pkm.KANGASKHAN]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SABLEYE]: 1 / 20,
    [Pkm.MAKUHITA]: 1 / 20
  },
  22: {
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20,
    [Pkm.MUNCHLAX]: 1 / 20,
    [Pkm.WOBBUFFET]: 1 / 20
  },
  27: {
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20,
    [Pkm.MUNCHLAX]: 1 / 20,
    [Pkm.WOBBUFFET]: 1 / 20
  },
  34: {
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20,
    [Pkm.MUNCHLAX]: 1 / 20
  }
}

export const OUTLAW_GOLD_REWARD = 10

export const TREASURE_BOX_LIFE_THRESHOLD = 40
export type TreasureBoxReward =
  | "gold"
  | "mushrooms"
  | "sweets"
  | "componentsAndTickets"
  | "itemComponents"
  | "craftableItems"
  | "goldBow"

export function getTreasureBoxReward(): TreasureBoxReward {
  return (
    randomWeighted<TreasureBoxReward>({
      gold: 0.2,
      mushrooms: 0.1,
      sweets: 0.1,
      itemComponents: 0.1,
      componentsAndTickets: 0.1,
      craftableItems: 0.15,
      goldBow: 0.05
    }) ?? "itemComponents"
  )
}
