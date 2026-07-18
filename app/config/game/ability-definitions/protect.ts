import { Ability } from "../../../types/enum/Ability"
import {
  defineAbility,
  formatTierMilliseconds,
  scaling
} from "./define-ability"

export default defineAbility({
  ability: Ability.PROTECT,
  balance: {
    durationMs: [1000, 3000, 5000, 8000],
    durationScalingFactor: 0.5
  },
  describe: (balance) => ({
    duration: formatTierMilliseconds(
      balance.durationMs,
      scaling.ap(balance.durationScalingFactor)
    )
  })
})
