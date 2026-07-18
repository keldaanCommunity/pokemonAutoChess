import { Ability } from "../../../types/enum/Ability"
import { defineAbility, formatTierValues, scaling } from "./define-ability"

export default defineAbility({
  ability: Ability.STRUGGLE_BUG,
  balance: {
    damage: [10, 20, 30, 60],
    abilityPowerReduction: 30
  },
  describe: (balance) => ({
    damage: formatTierValues(balance.damage, scaling.ap()),
    abilityPowerReduction: balance.abilityPowerReduction
  })
})
