import { MapSchema } from "@colyseus/schema"
import { Item } from "../../types/enum/Item"
import { Pkm, PkmFamily } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { Pokemon } from "./pokemon"

export default class Synergies
  extends MapSchema<number>
  implements Map<string, number>
{
  constructor() {
    super()
    Object.keys(Synergy).forEach((key) => {
      this.set(key, 0)
    })
  }

  update(board: MapSchema<Pokemon>) {
    const pokemonNames = new Array<Pkm>()
    this.setToZero()

    board.forEach((pkm: Pokemon) => {
      if (pkm.items.has(Item.FIRE_STONE) && !pkm.types.includes(Synergy.FIRE)) {
        pkm.types.push(Synergy.FIRE)
      }
      if (
        pkm.items.has(Item.WATER_STONE) &&
        !pkm.types.includes(Synergy.WATER)
      ) {
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
      if (
        pkm.items.has(Item.MOON_STONE) &&
        !pkm.types.includes(Synergy.FAIRY)
      ) {
        pkm.types.push(Synergy.FAIRY)
      }
      if (
        pkm.items.has(Item.LEAF_STONE) &&
        !pkm.types.includes(Synergy.GRASS)
      ) {
        pkm.types.push(Synergy.GRASS)
      }
      if (
        pkm.items.has(Item.DAWN_STONE) &&
        !pkm.types.includes(Synergy.PSYCHIC)
      ) {
        pkm.types.push(Synergy.PSYCHIC)
      }
      if (pkm.items.has(Item.ICY_ROCK) && !pkm.types.includes(Synergy.ICE)) {
        pkm.types.push(Synergy.ICE)
      }
      if (
        pkm.items.has(Item.OLD_AMBER) &&
        !pkm.types.includes(Synergy.FOSSIL)
      ) {
        pkm.types.push(Synergy.FOSSIL)
      }
    })

    board.forEach((pkm: Pokemon) => {
      const family = PkmFamily[pkm.name]
      if (!pokemonNames.includes(family) && pkm.positionY != 0) {
        pokemonNames.push(family)
        pkm.types.forEach((type) => {
          const t = this.get(type)
          if (t) {
            this.set(type, t + 1)
          } else {
            this.set(type, 1)
          }
        })
      }
    })
  }

  setToZero() {
    this.forEach((value, key) => {
      this.set(key, 0)
    })
  }
}
