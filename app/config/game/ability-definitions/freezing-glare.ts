import { Ability } from "../../../types/enum/Ability"
import {
  defineAbility,
  formatTierMilliseconds,
  formatTierValues,
  scaling
} from "./define-ability"

export default defineAbility({
  ability: Ability.FREEZING_GLARE,
  balance: {
    damage: [20, 40, 80, 160],
    freezeChance: 0.5,
    freezeDurationMs: [3000, 3000, 3000, 6000]
  },
  describe: (balance) => ({
    damage: formatTierValues(balance.damage, scaling.ap()),
    freezeChance: formatTierValues(
      [balance.freezeChance * 100],
      scaling.luck()
    ),
    freezeDuration: formatTierMilliseconds(balance.freezeDurationMs)
  })
})
