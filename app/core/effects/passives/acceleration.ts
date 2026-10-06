import { Passive } from "../../../types/enum/Passive"
import { OnMoveEffect } from "../effect"

export class AccelerationEffect extends OnMoveEffect {
  accelerationStacks = 0

  constructor() {
    super(({ pokemon }) => {
      pokemon.addSpeed(15, pokemon, 0, false)
      this.accelerationStacks += 1
    }, Passive.ACCELERATION)
  }
}
