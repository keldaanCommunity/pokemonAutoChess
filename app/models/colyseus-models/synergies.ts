import { MapSchema, SetSchema } from "@colyseus/schema"
import { SynergyTriggers } from "../../config"
import { IPokemon } from "../../types"
import { SynergyGivenByItem } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { PkmFamily } from "../../types/enum/Pokemon"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule"
import { Synergy } from "../../types/enum/Synergy"
import { values } from "../../utils/schemas"

export default class Synergies extends MapSchema<number, Synergy> {
  constructor(synergies?: Map<Synergy, number>) {
    super()
    Object.keys(Synergy).forEach((key) => {
      this.set(key as Synergy, synergies?.get(key as Synergy) ?? 0)
    })
  }

  getSynergyStep(type: Synergy): number {
    return SynergyTriggers[type].filter((n) => (this.get(type) ?? 0) >= n)
      .length
  }

  countActiveSynergies() {
    let count = 0
    this.forEach((value, key) => {
      if (value >= SynergyTriggers[key][0]) {
        count++
      }
    })
    return count
  }

  getTopSynergies(amount?: number): Synergy[] {
    const synergiesSortedByLevel: [Synergy, number][] = []
    this.forEach((value, key) => {
      synergiesSortedByLevel.push([key as Synergy, value])
    })
    synergiesSortedByLevel.sort(([s1, v1], [s2, v2]) => {
      if (v2 === v1) {
        // if equal level, prioritize the highest amount of synergy steps reached
        return (
          SynergyTriggers[s2].filter((n) => n <= v2).length -
          SynergyTriggers[s1].filter((n) => n <= v1).length
        )
      }
      return v2 - v1
    })
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
        dragonDoubleTypes.get(family)!.add(values(pkm.types)[1])
      }
    })
    dragonDoubleTypes.forEach((types) => {
      types.forEach((type, i) => {
        synergies.set(type, (synergies.get(type) ?? 0) + 1)
      })
    })
  }

  if (
    (synergies.get(Synergy.DRAGON) ?? 0) >= SynergyTriggers[Synergy.DRAGON][0]
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
      const synergiesSorted = [...synergies.keys()].sort(
        (a, b) => +synergies.get(b)! - +synergies.get(a)!
      )

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
              SynergyTriggers[Synergy.DRAGON][0]
            ) {
              // Arceus/Kecleon just activated Dragon 3, so we need to apply the double synergies to all pokemons
              shouldComputeDragonDoubleTypeAgain = true
            } else if (
              synergies.get(Synergy.DRAGON)! >
              SynergyTriggers[Synergy.DRAGON][0]
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
    }
  })

  return synergies
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
