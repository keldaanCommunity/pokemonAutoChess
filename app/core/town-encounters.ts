import { Pkm } from "../types/enum/Pokemon"

export const TownEncounters = {
  [Pkm.KECLEON]: Pkm.KECLEON,
  [Pkm.CHANSEY]: Pkm.CHANSEY,
  [Pkm.ELECTIVIRE]: Pkm.ELECTIVIRE,
  [Pkm.XATU]: Pkm.XATU,
  [Pkm.KANGASKHAN]: Pkm.KANGASKHAN
} as const

export type TownEncounter = (typeof TownEncounters)[keyof typeof TownEncounters]

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
    [Pkm.CHANSEY]: 1 / 10,
    [Pkm.KECLEON]: 1 / 10,
    [Pkm.ELECTIVIRE]: 1 / 10,
    [Pkm.XATU]: 1 / 10
  }
}
