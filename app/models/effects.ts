import { MapSchema, SetSchema } from "@colyseus/schema"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { SynergyTriggers } from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { Effect } from "../types/enum/Effect"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { isOnBench } from "../utils/board"
import Synergies from "./colyseus-models/synergies"

export class Effects extends SetSchema<Effect> {
  update(synergies: Synergies, board: MapSchema<Pokemon>) {
    this.clear()
    ;(Object.values(Synergy) as Synergy[]).forEach((synergy) => {
      for (let i = SynergyTriggers[synergy].length; i >= 0; i--) {
        const v = SynergyTriggers[synergy][i]
        const s = synergies.get(synergy)
        if (s && s >= v) {
          this.add(SynergyEffects[synergy][i])
          break
        }
      }
    })

    board.forEach((p) => {
      if (!isOnBench(p)) {
        if (p.skill === Ability.GRASSY_SURGE) {
          this.add(Effect.GRASSY_TERRAIN)
        }
        if (p.skill === Ability.MISTY_SURGE) {
          this.add(Effect.MISTY_TERRAIN)
        }
        if (p.skill === Ability.ELECTRIC_SURGE) {
          this.add(Effect.ELECTRIC_TERRAIN)
        }
        if (p.skill === Ability.PSYCHIC_SURGE) {
          this.add(Effect.PSYCHIC_TERRAIN)
        }
      }
    })
  }
}
