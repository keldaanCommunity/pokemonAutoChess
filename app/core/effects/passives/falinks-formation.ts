import { Title } from "../../../types"
import { Passive } from "../../../types/enum/Passive"
import { Pkm } from "../../../types/enum/Pokemon"
import { schemaValues } from "../../../utils/schemas"
import { OnSpawnEffect } from "../effect"

export class FalinksFormationEffect extends OnSpawnEffect {
  stacks = 0

  constructor() {
    super((pkm) => {
      if (!pkm.player) return
      const troopers = schemaValues(pkm.player.board).filter(
        (p) =>
          p.name === Pkm.FALINKS_TROOPER && p.positionY === 0 && p.id !== pkm.id
      )
      this.stacks = troopers.length
      if (this.stacks > 0) {
        pkm.addAttack(this.stacks * 1, pkm, 0, false)
        pkm.addDefense(this.stacks * 1, pkm, 0, false)
        pkm.addShield(this.stacks * 30, pkm, 0, false)
      }
      if (this.stacks >= 8 && pkm.player) {
        pkm.player.titles.add(Title.LEGIONNAIRE)
      }
    }, Passive.FALINKS)
  }
}
