import Synergies from "./colyseus-models/synergies"
import { Effect } from "../types/enum/Effect"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { Weather } from "../types/enum/Weather"
import { TypeTrigger } from "../types/Config"
import { MapSchema } from "@colyseus/schema"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { Ability } from "../types/enum/Ability"

export class Effects {
  list: Effect[]

  constructor() {
    this.list = []
  }

  update(synergies: Synergies, board: MapSchema<Pokemon>) {
    this.list = []
    ;(Object.values(Synergy) as Synergy[]).forEach((synergy) => {
      for (let i = TypeTrigger[synergy].length; i >= 0; i--) {
        const v = TypeTrigger[synergy][i]
        const s = synergies.get(synergy)
        if (s && s >= v) {
          this.list.push(SynergyEffects[synergy][i])
          break
        }
      }
    })

    board.forEach((p) => {
      if (p.skill === Ability.GRASSY_SURGE) {
        this.list.push(Effect.GRASSY_TERRAIN)
      }
      if (p.skill === Ability.MISTY_SURGE) {
        this.list.push(Effect.MISTY_TERRAIN)
      }
      if (p.skill === Ability.ELECTRIC_SURGE) {
        this.list.push(Effect.ELECTRIC_TERRAIN)
      }
      if (p.skill === Ability.PSYCHIC_SURGE) {
        this.list.push(Effect.PSYCHIC_TERRAIN)
      }
    })
  }
}
