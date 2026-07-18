import { Ability } from "../../../types/enum/Ability"
import {
  bonusMultiplierToPercent,
  defineAbility,
  millisecondsToSeconds,
  tiered
} from "./define-ability"

export default defineAbility({
  ability: Ability.BLIZZARD,
  balance: {
    damage: [10, 20, 40, 80],
    freezeDurationMs: 1500,
    radius: 4,
    frozenTargetDamageMultiplier: 1.3
  },
  describe: (balance) => ({
    radius: balance.radius,
    freezeDuration: millisecondsToSeconds(balance.freezeDurationMs),
    damage: tiered(balance.damage, "SP"),
    frozenTargetBonusPercent: bonusMultiplierToPercent(
      balance.frozenTargetDamageMultiplier
    )
  })
})
