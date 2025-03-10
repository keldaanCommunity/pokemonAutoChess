import { Pkm } from "../types/enum/Pokemon"

export const TownEncounters = {
  [Pkm.KECLEON]: Pkm.KECLEON,
  [Pkm.CHANSEY]: Pkm.CHANSEY,
  [Pkm.ELECTIVIRE]: Pkm.ELECTIVIRE,
  [Pkm.XATU]: Pkm.XATU,
  [Pkm.KANGASKHAN]: Pkm.KANGASKHAN,
  [Pkm.DUSKULL]: Pkm.DUSKULL,
  [Pkm.MAROWAK]: Pkm.MAROWAK,
  [Pkm.WOBBUFFET]: Pkm.WOBBUFFET,
  [Pkm.SPINDA]: Pkm.SPINDA,
  [Pkm.REGIROCK]: Pkm.REGIROCK
} as const

export type TownEncounter = (typeof TownEncounters)[keyof typeof TownEncounters]

export const TownEncounterSellPrice: { [encounter in TownEncounter]?: number } =
  {
    [Pkm.KECLEON]: 10,
    [Pkm.KANGASKHAN]: 10,
    [Pkm.CHANSEY]: 10,
    [Pkm.ELECTIVIRE]: 10,
    [Pkm.XATU]: 10,
    [Pkm.DUSKULL]: 10
  }

export const TownEncountersByStage: {
  [stageLevel: number]: { [encounter in TownEncounter]?: number }
} = {
  4: {
    [Pkm.CHANSEY]: 1 / 10,
    [Pkm.KANGASKHAN]: 1 / 10,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20
  },
  12: {
    [Pkm.DUSKULL]: 1 / 10,
    [Pkm.KANGASKHAN]: 1 / 10,
    [Pkm.WOBBUFFET]: 1 / 20,
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20
  },
  17: {
    [Pkm.WOBBUFFET]: 1 / 10,
    [Pkm.DUSKULL]: 1 / 20,
    [Pkm.KANGASKHAN]: 1 / 20,
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20
  },
  22: {
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20
  },
  27: {
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20
  },
  34: {
    [Pkm.KECLEON]: 1 / 20,
    [Pkm.ELECTIVIRE]: 1 / 20,
    [Pkm.XATU]: 1 / 20,
    [Pkm.MAROWAK]: 1 / 20,
    [Pkm.SPINDA]: 1 / 20,
    [Pkm.REGIROCK]: 1 / 20
  }
}
