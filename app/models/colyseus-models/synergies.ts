import { MapSchema } from "@colyseus/schema"
import { IPokemon } from "../../types"
import { SynergyTriggers } from "../../types/Config"
import { Item } from "../../types/enum/Item"
import { Pkm, PkmFamily } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
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
    const pokemons: Pokemon[] = [...board.values()]
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
      if (pkm.types.includes(Synergy.DRAGON)) {
        if (!dragonDoubleTypes.has(family))
          dragonDoubleTypes.set(family, new Set())
        dragonDoubleTypes.get(family)!.add(pkm.types[1])
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
  if (pkm.items == null) {
    console.error("items is undefined ?", pkm)
  }
  if (pkm.items.has(Item.FIRE_STONE) && !pkm.types.includes(Synergy.FIRE)) {
    pkm.types.push(Synergy.FIRE)
  }
  if (pkm.items.has(Item.WATER_STONE) && !pkm.types.includes(Synergy.WATER)) {
    pkm.types.push(Synergy.WATER)
  }
  if (
    pkm.items.has(Item.THUNDER_STONE) &&
    !pkm.types.includes(Synergy.ELECTRIC)
  ) {
    pkm.types.push(Synergy.ELECTRIC)
  }
  if (pkm.items.has(Item.DUSK_STONE) && !pkm.types.includes(Synergy.DARK)) {
    pkm.types.push(Synergy.DARK)
  }
  if (pkm.items.has(Item.MOON_STONE) && !pkm.types.includes(Synergy.FAIRY)) {
    pkm.types.push(Synergy.FAIRY)
  }
  if (pkm.items.has(Item.LEAF_STONE) && !pkm.types.includes(Synergy.GRASS)) {
    pkm.types.push(Synergy.GRASS)
  }
  if (pkm.items.has(Item.DAWN_STONE) && !pkm.types.includes(Synergy.PSYCHIC)) {
    pkm.types.push(Synergy.PSYCHIC)
  }
  if (pkm.items.has(Item.ICE_STONE) && !pkm.types.includes(Synergy.ICE)) {
    pkm.types.push(Synergy.ICE)
  }
  if (pkm.items.has(Item.OLD_AMBER) && !pkm.types.includes(Synergy.FOSSIL)) {
    pkm.types.push(Synergy.FOSSIL)
  }
}
