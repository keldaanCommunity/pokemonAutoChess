import { MapSchema, SetSchema } from "@colyseus/schema"
import {
  ArceusFormPerSynergy,
  SynergyTiers,
  SynergyTiersThresholds
} from "../../config"
import type { IPlayer, IPokemon } from "../../types"
import type { EffectEnum } from "../../types/enum/Effect"
import { SynergyGivenByItem } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { PkmFamily, PkmIndex } from "../../types/enum/Pokemon"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule"
import { Synergy } from "../../types/enum/Synergy"
import { isOnBench } from "../../utils/board"
import { schemaValues } from "../../utils/schemas"
import { PVEStages } from "../pve-stages"

export default class Synergies extends MapSchema<number, Synergy> {
  constructor(synergies?: Map<Synergy, number>) {
    super()
    Object.keys(Synergy).forEach((key) => {
      this.set(key as Synergy, synergies?.get(key as Synergy) ?? 0)
    })
  }

  hasSynergyActive(type: Synergy): boolean {
    return (this.get(type) ?? 0) >= SynergyTiersThresholds[type][0]
  }

  hasSynergyTriggerOrMore(type: Synergy, level: number): boolean {
    return (this.get(type) ?? 0) >= SynergyTiersThresholds[type][level - 1]
  }

  countActiveSynergies(): number {
    let count = 0
    this.forEach((value, synergy) => {
      if (value >= SynergyTiersThresholds[synergy][0]) {
        count++
      }
    })
    return count
  }

  getActiveSynergies(): Synergy[] {
    const activeSynergies: Synergy[] = []
    this.forEach((value, synergy) => {
      if (value >= SynergyTiersThresholds[synergy][0]) {
        activeSynergies.push(synergy)
      }
    })
    return activeSynergies
  }

  getActiveSynergyTiers(): EffectEnum[] {
    const synergyTiers: EffectEnum[] = []
    this.forEach((value, synergy) => {
      const level = SynergyTiersThresholds[synergy].filter(
        (n) => value >= n
      ).length
      if (level > 0 && level - 1 in SynergyTiers[synergy]) {
        synergyTiers.push(SynergyTiers[synergy][level - 1])
      }
    })
    return synergyTiers
  }

  getTopSynergies(amount?: number): Synergy[] {
    const synergiesSortedByLevel: [Synergy, number][] = sortSynergies(
      this.toMap()
    )
    if (amount) {
      return synergiesSortedByLevel.slice(0, amount).map(([s, v]) => s)
    }
    const topSynergyCount = synergiesSortedByLevel[0][1]
    const topSynergies = synergiesSortedByLevel
      .filter(([s, v]) => v >= topSynergyCount)
      .map(([s, v]) => s)
    return topSynergies
  }

  toMap() {
    const map = new Map<Synergy, number>()
    this.forEach((value, key) => {
      map.set(key as Synergy, value)
    })
    return map
  }
}

export function computeSynergies(
  board: IPokemon[],
  bonusSynergies?: Map<Synergy, number>,
  specialGameRule?: SpecialGameRule | null
): Map<Synergy, number> {
  const synergies = new Map<Synergy, number>()
  Object.keys(Synergy).forEach((key) => {
    synergies.set(key as Synergy, bonusSynergies?.get(key as Synergy) ?? 0)
  })

  const typesPerFamily = new Map<string, Set<Synergy>>()

  board.forEach((pkm: IPokemon, index) => {
    // reset dynamic synergies
    if (pkm.passive === Passive.PROTEAN2 || pkm.passive === Passive.PROTEAN3) {
      pkm.types.clear()
    }

    addSynergiesGivenByItems(pkm)
    if (pkm.positionY != 0) {
      const family =
        specialGameRule === SpecialGameRule.FAMILY_OUTING
          ? `pkm${index}`
          : PkmFamily[pkm.name]
      if (!typesPerFamily.has(family)) typesPerFamily.set(family, new Set())
      const types: Set<Synergy> = typesPerFamily.get(family)!
      pkm.types.forEach((type) => types.add(type))
    }
  })

  typesPerFamily.forEach((types) => {
    types.forEach((type, i) => {
      synergies.set(type, (synergies.get(type) ?? 0) + 1)
    })
  })

  function applyDragonDoubleTypes() {
    const dragonDoubleTypes = new Map<string, Set<Synergy>>()
    board.forEach((pkm: IPokemon, index) => {
      if (
        pkm.positionY != 0 &&
        pkm.types.has(Synergy.DRAGON) &&
        pkm.types.size > 1
      ) {
        const family =
          specialGameRule === SpecialGameRule.FAMILY_OUTING
            ? `pkm${index}`
            : PkmFamily[pkm.name]
        if (!dragonDoubleTypes.has(family))
          dragonDoubleTypes.set(family, new Set())
        dragonDoubleTypes.get(family)!.add(schemaValues(pkm.types)[1])
      }
    })
    dragonDoubleTypes.forEach((types) => {
      types.forEach((type, i) => {
        synergies.set(type, (synergies.get(type) ?? 0) + 1)
      })
    })
  }

  if (
    (synergies.get(Synergy.DRAGON) ?? 0) >=
    SynergyTiersThresholds[Synergy.DRAGON][0]
  ) {
    applyDragonDoubleTypes()
  }

  // add dynamic synergies (Arceus & Kecleon)
  board.forEach((pkm: IPokemon) => {
    if (
      pkm.positionY !== 0 &&
      (pkm.passive === Passive.PROTEAN2 || pkm.passive === Passive.PROTEAN3)
    ) {
      const nbDynamicSynergies = pkm.passive === Passive.PROTEAN3 ? 3 : 2
      const synergiesSorted = sortSynergies(synergies).map(([s, v]) => s)

      if (
        synergiesSorted.slice(0, nbDynamicSynergies).includes(Synergy.DRAGON)
      ) {
        // if dragon is in the top synergies, we need to ensure it is the first one
        const dragonIndex = synergiesSorted.indexOf(Synergy.DRAGON)
        if (dragonIndex > 0) {
          synergiesSorted.splice(dragonIndex, 1)
          synergiesSorted.unshift(Synergy.DRAGON)
        }
      }

      let shouldComputeDragonDoubleTypeAgain = false
      for (let i = 0; i < nbDynamicSynergies; i++) {
        const type = synergiesSorted[i]
        if (type && !pkm.types.has(type) && synergies.get(type)! > 0) {
          pkm.types.add(type)
          synergies.set(type, (synergies.get(type) ?? 0) + 1)
          //apply dragon double synergies just for Arceus & Kecleon if Dragon
          if (type === Synergy.DRAGON) {
            if (
              synergies.get(Synergy.DRAGON) ===
              SynergyTiersThresholds[Synergy.DRAGON][0]
            ) {
              // Arceus/Kecleon just activated Dragon 3, so we need to apply the double synergies to all pokemons
              shouldComputeDragonDoubleTypeAgain = true
            } else if (
              synergies.get(Synergy.DRAGON)! >
              SynergyTiersThresholds[Synergy.DRAGON][0]
            ) {
              // Dragon 3 was already activated, so we just need to double the synergy of Arceus/Kecleon
              const doubledType = synergiesSorted[1]
              synergies.set(doubledType, (synergies.get(doubledType) ?? 0) + 1)
            }
          }
        }
      }

      if (shouldComputeDragonDoubleTypeAgain) {
        applyDragonDoubleTypes()
      }

      if (pkm.name.startsWith("ARCEUS")) {
        const firstType = schemaValues(pkm.types)[0]
        pkm.index = PkmIndex[ArceusFormPerSynergy[firstType]!]
      }
    }
  })

  return synergies
}

export function sortSynergies(
  synergies: Map<Synergy, number>
): [Synergy, number][] {
  // sort by synergy level, then by number of synergy thresholds reached tier, then by order in the Synergies enum
  return [...synergies.entries()].sort(([s1, v1], [s2, v2]) => {
    if (v2 === v1) {
      // if equal level, prioritize the highest amount of synergy steps reached
      const tier1 = SynergyTiersThresholds[s1].filter((n) => n <= v1).length
      const tier2 = SynergyTiersThresholds[s2].filter((n) => n <= v2).length
      if (tier2 === tier1) {
        return (
          Object.keys(Synergy).indexOf(s2) - Object.keys(Synergy).indexOf(s1)
        )
      }
      return tier2 - tier1
    }
    return v2 - v1
  })
}

export function getDominantSynergy(
  synergies: Map<Synergy, number>,
  choices = Object.keys(Synergy)
): Synergy | null {
  const sorted = sortSynergies(synergies)
  for (const [synergy, _] of sorted) {
    if (choices.includes(synergy)) {
      return synergy
    }
  }
  return null
}

export function addSynergiesGivenByItems(pkm: IPokemon) {
  pkm.items.forEach((item) => {
    const synergy = SynergyGivenByItem[item]
    if (synergy) {
      if (synergy === Synergy.DRAGON) {
        pkm.types = new SetSchema<Synergy>([synergy, ...pkm.types])
      } else {
        pkm.types.add(synergy)
      }
    }
  })
}

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
    .filter((p) => p.types.has(Synergy.WILD) && isOnBench(p) === false)
    .reduce((total, p) => total + p.stars, 0)
  const bonusChance = wildLevel > 0 ? nbWildStars * 0.5 : 0
  return (baseChance + bonusChance) / 100
}
