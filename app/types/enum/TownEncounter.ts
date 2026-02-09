import { Pkm } from "./Pokemon"

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
  [Pkm.CELEBI]: Pkm.CELEBI,
  [Pkm.MAKUHITA]: Pkm.MAKUHITA,
  [Pkm.CROAGUNK]: Pkm.CROAGUNK,
  [Pkm.WIGGLYTUFF]: Pkm.WIGGLYTUFF,
  [Pkm.CINCCINO]: Pkm.CINCCINO,
  [Pkm.MAGNEZONE]: Pkm.MAGNEZONE,
  [Pkm.KINGAMBIT]: Pkm.KINGAMBIT
} as const

export type TownEncounter = (typeof TownEncounters)[keyof typeof TownEncounters]
