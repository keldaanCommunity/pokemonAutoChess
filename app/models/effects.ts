import { type MapSchema, SetSchema } from "@colyseus/schema"
import { SynergyTriggers } from "../config"
import { SynergyEffects } from "../config/game/synergies"
import type { Pokemon } from "../models/colyseus-models/pokemon"
import { Ability } from "../types/enum/Ability"
import { EffectEnum } from "../types/enum/Effect"
import { Pkm } from "../types/enum/Pokemon"
import { SynergyArray } from "../types/enum/Synergy"
import { isOnBench } from "../utils/board"
import { schemaValues } from "../utils/schemas"
import type Synergies from "./colyseus-models/synergies"

export class Effects extends SetSchema<EffectEnum> {
  update(synergies: Synergies, board: MapSchema<Pokemon>) {
    this.clear()
    SynergyArray.forEach((synergy) => {
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
          this.add(EffectEnum.GRASSY_TERRAIN)
        }
        if (p.skill === Ability.MISTY_SURGE) {
          this.add(EffectEnum.MISTY_TERRAIN)
        }
        if (p.skill === Ability.ELECTRIC_SURGE) {
          this.add(EffectEnum.ELECTRIC_TERRAIN)
        }
        if (p.skill === Ability.PSYCHIC_SURGE) {
          this.add(EffectEnum.PSYCHIC_TERRAIN)
        }
      }

      if (p.name === Pkm.FALINKS_BRASS) {
        const nbTroopers = schemaValues(board).filter(
          (p) => p.name === Pkm.FALINKS_TROOPER
        ).length
        if (nbTroopers < 6) this.add(EffectEnum.FALINKS_BRASS)
        else this.delete(EffectEnum.FALINKS_BRASS)
      }
    })
  }
}
