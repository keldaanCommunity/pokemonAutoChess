import { Pkm } from "../types/enum/Pokemon"

export const TownEncounters = {
  [Pkm.KECLEON]: Pkm.KECLEON,
  [Pkm.CHANSEY]: Pkm.CHANSEY,
  [Pkm.ELECTIVIRE]: Pkm.ELECTIVIRE,
  [Pkm.XATU]: Pkm.XATU,
  [Pkm.KANGASKHAN]: Pkm.KANGASKHAN,
  [Pkm.DUSKULL]: Pkm.DUSKULL,
  [Pkm.MEOWTH]: Pkm.MEOWTH,
  [Pkm.MAROWAK]: Pkm.MAROWAK,
  [Pkm.WOBBUFFET]: Pkm.WOBBUFFET,
  [Pkm.SPINDA]: Pkm.SPINDA,
  [Pkm.REGIROCK]: Pkm.REGIROCK,
  [Pkm.MUNCHLAX]: Pkm.MUNCHLAX,
  [Pkm.SABLEYE]: Pkm.SABLEYE,
  [Pkm.CELEBI]: Pkm.CELEBI
} as const

export type TownEncounter = (typeof TownEncounters)[keyof typeof TownEncounters]

export const TownEncounterSellPrice: { [encounter in TownEncounter]?: number } =
  {
    [Pkm.KECLEON]: 10,
    [Pkm.KANGASKHAN]: 10,
    [Pkm.CHANSEY]: 10,
    [Pkm.ELECTIVIRE]: 10,
    [Pkm.XATU]: 10
  }

export const TownEncountersByStage: {
  [stageLevel: number]: { [encounter in TownEncounter]?: number }
} = {
  4: {
    [Pkm.MEOWTH]: 1 / 20,
    [Pkm.DUSKULL]: 1 / 20,
    [Pkm.CHANSEY]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SABLEYE]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.CELEBI]: 1 / 40
  },
  12: {
    [Pkm.KANGASKHAN]: 1 / 20,
    [Pkm.WOBBUFFET]: 1 / 20,
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SABLEYE]: 1 / 20
  },
  17: {
    [Pkm.WOBBUFFET]: 1 / 10,
    [Pkm.KANGASKHAN]: 1 / 20,
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.CELEBI]: 1 / 40
  },
  22: {
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20,
    [Pkm.MUNCHLAX]: 1 / 20
  },
  27: {
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20,
    [Pkm.MUNCHLAX]: 1 / 20
  },
  34: {
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20,
    [Pkm.MUNCHLAX]: 1 / 20
  }
}
