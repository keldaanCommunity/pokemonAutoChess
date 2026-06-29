import type { MapSchema } from "@colyseus/schema"
import { SynergyTiersThresholds } from "../config/game/synergies"
import { PVEStages } from "../models/pve-stages"
import type { IPlayer, IPokemon, IPokemonEntity } from "../types"
import { Synergy } from "../types/enum/Synergy"
import { isOnBench } from "../utils/board"
import { schemaValues } from "../utils/schemas"

export function getSynergyTier(
  synergies: Map<Synergy, number> | MapSchema<number, Synergy>,
  type: Synergy
): number {
  return SynergyTiersThresholds[type].filter(
    (n) => (synergies.get(type) ?? 0) >= n
  ).length
}

export function getWildChance(player: IPlayer, stageLevel: number): number {
  const isPVE = stageLevel === 0 || stageLevel in PVEStages
  const wildLevel = getSynergyTier(player.synergies, Synergy.WILD)
  // 6% base chance in PvE stage or if Wild is active
  const baseChance = isPVE || wildLevel > 0 ? 6 : 0
  // each star of a pokemon with wild synergy gives 0.5% wild chance
  const nbWildStars = schemaValues(player.board)
    .filter((p) => hasSynergy(p, Synergy.WILD) && isOnBench(p) === false)
    .reduce((total, p) => total + p.stars, 0)
  const bonusChance = wildLevel > 0 ? nbWildStars * 0.5 : 0
  return (baseChance + bonusChance) / 100
}

export function hasSynergy(
  pokemon: IPokemon | IPokemonEntity,
  synergy: Synergy
) {
  return pokemon.types.has(synergy) || pokemon.types.has(Synergy.STELLAR)
}
