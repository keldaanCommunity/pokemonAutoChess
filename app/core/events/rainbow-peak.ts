import { SynergyTiersThresholds } from "../../config"
import type Player from "../../models/colyseus-models/player"
import { Rarity } from "../../types/enum/Game"
import { Synergy, SynergyArray } from "../../types/enum/Synergy"
import { schemaValues } from "../../utils/schemas"
import { getSynergyTier } from "../synergies"

export function isRainbowPeakObjectiveComplete(
  player: Player,
  synergy: Synergy
): boolean {
  switch (synergy) {
    case Synergy.BABY:
      return (
        schemaValues(player.board).filter(
          (pokemon) => pokemon.rarity === Rarity.HATCH
        ).length >= 3
      )
    case Synergy.STELLAR:
      return player.synergies.hasSynergyActive(Synergy.STELLAR)
    default:
      return (
        getSynergyTier(player.synergies, synergy) >=
        SynergyTiersThresholds[synergy].length
      )
  }
}

const RAINBOW_PEAK_SYNERGIES = SynergyArray.filter(
  (synergy) => synergy !== Synergy.STELLAR
)

function hashPlayerUid(uid: string): number {
  let hash = 0
  for (const char of uid) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash
}

export function getRainbowPeakSynergyOrder(uid: string): Synergy[] {
  const startIndex = hashPlayerUid(uid) % RAINBOW_PEAK_SYNERGIES.length
  return [
    ...RAINBOW_PEAK_SYNERGIES.slice(startIndex),
    ...RAINBOW_PEAK_SYNERGIES.slice(0, startIndex),
    Synergy.STELLAR
  ]
}

export function getRainbowPeakTargetSynergy(
  uid: string,
  eventPoints: number
): Synergy | undefined {
  return getRainbowPeakSynergyOrder(uid)[eventPoints]
}
