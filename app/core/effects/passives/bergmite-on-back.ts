import { Passive } from "../../../types/enum/Passive"
import { Pkm } from "../../../types/enum/Pokemon"
import { schemaValues } from "../../../utils/schemas"
import { OnSpawnEffect } from "../effect"

export class BergmiteOnBackEffect extends OnSpawnEffect {
  stacks = 0

  constructor() {
    super((pkm) => {
      if (!pkm.player) return
      const bergmites = schemaValues(pkm.player.board).filter(
        (p) => p.name === Pkm.BERGMITE && p.positionY === 0 && p.id !== pkm.id
      )
      this.stacks = bergmites.length
    }, Passive.AVALUGG)
  }
}
