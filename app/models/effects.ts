import Synergies from "./colyseus-models/synergies"
import { Effect } from "../types/enum/Effect"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { Climate } from "../types/enum/Game"
import { TypeTrigger } from "../types/Config"

export class Effects {
  climate: string
  list: Effect[]

  constructor() {
    this.climate = Climate.NEUTRAL
    this.list = []
  }

  update(synergies: Synergies) {
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
  }
}
