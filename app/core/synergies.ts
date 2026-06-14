import type { MapSchema } from "@colyseus/schema"
import { SynergyTriggers } from "../config/game/synergies"
import { PVEStages } from "../models/pve-stages"
import type { IPlayer } from "../types"
import { Synergy } from "../types/enum/Synergy"
import { isOnBench } from "../utils/board"
import { schemaValues } from "../utils/schemas"

export function getSynergyStep(
  synergies: Map<Synergy, number> | MapSchema<number, Synergy>,
  type: Synergy
): number {
  return SynergyTriggers[type].filter((n) => (synergies.get(type) ?? 0) >= n)
    .length
}

export function getWildChance(player: IPlayer, stageLevel: number): number {
  const isPVE = stageLevel === 0 || stageLevel in PVEStages
  const wildLevel = getSynergyStep(player.synergies, Synergy.WILD)
  // 6% base chance in PvE stage or if Wild is active
  const baseChance = isPVE || wildLevel > 0 ? 6 : 0
  // each star of a pokemon with wild synergy gives 0.5% wild chance
  const nbWildStars = schemaValues(player.board)
    .filter(
      (p) =>
        (p.types.has(Synergy.WILD) || p.types.has(Synergy.STELLAR)) &&
        isOnBench(p) === false
    )
    .reduce((total, p) => total + p.stars, 0)
  const bonusChance = wildLevel > 0 ? nbWildStars * 0.5 : 0
  return (baseChance + bonusChance) / 100
}
