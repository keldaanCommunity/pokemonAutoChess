import { MapSchema } from "@colyseus/schema"
import { IPokemon } from "../../types"
import { SynergyTriggers } from "../../types/Config"
import { SynergyByStone, SynergyStones } from "../../types/enum/Item"
import { Pkm, PkmFamily } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { values } from "../../utils/schemas"
import { Pokemon } from "./pokemon"

export default class Synergies
  extends MapSchema<number, Synergy>
  implements Map<Synergy, number>
{
  constructor() {
    super()
    Object.keys(Synergy).forEach((key) => {
      this.set(key as Synergy, 0)
    })
  }

  update(board: MapSchema<Pokemon>) {
    const pokemons: Pokemon[] = values(board)
    const updatedSynergies = computeSynergies(pokemons)
    updatedSynergies.forEach((value, synergy) => this.set(synergy, value))
  }
}

export function computeSynergies(board: IPokemon[]): Map<Synergy, number> {
  const synergies = new Map<Synergy, number>()
  Object.keys(Synergy).forEach((key) => {
    synergies.set(key as Synergy, 0)
  })

  const typesPerFamily = new Map<Pkm, Set<Synergy>>()
  const dragonDoubleTypes = new Map<Pkm, Set<Synergy>>()

  board.forEach((pkm: IPokemon) => {
    addSynergiesFromStones(pkm)
    if (pkm.positionY != 0) {
      const family = PkmFamily[pkm.name]
      if (!typesPerFamily.has(family)) typesPerFamily.set(family, new Set())
      const types: Set<Synergy> = typesPerFamily.get(family)!
      pkm.types.forEach((type) => types.add(type))
      if (pkm.types.has(Synergy.DRAGON)) {
        if (!dragonDoubleTypes.has(family))
          dragonDoubleTypes.set(family, new Set())
        dragonDoubleTypes.get(family)!.add(values(pkm.types)[1])
      }
    }
  })

  typesPerFamily.forEach((types) => {
    types.forEach((type, i) => {
      synergies.set(type, (synergies.get(type) ?? 0) + 1)
    })
  })

  if (
    (synergies.get(Synergy.DRAGON) ?? 0) >= SynergyTriggers[Synergy.DRAGON][0]
  ) {
    dragonDoubleTypes.forEach((types) => {
      types.forEach((type, i) => {
        synergies.set(type, (synergies.get(type) ?? 0) + 1)
      })
    })
  }

  return synergies
}

export function addSynergiesFromStones(pkm: IPokemon) {
  for (let stone of SynergyStones) {
    if (pkm.items.has(stone)) {
      pkm.types.add(SynergyByStone[stone])
    }
  }
}
