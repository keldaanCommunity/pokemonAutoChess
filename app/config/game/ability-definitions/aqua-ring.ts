import { Ability } from "../../../types/enum/Ability"
import { defineAbility, tiered } from "./define-ability"

export default defineAbility({
  ability: Ability.AQUA_RING,
  balance: {
    heal: [20, 40, 80, 160]
  },
  describe: (balance) => ({
    heal: tiered(balance.heal, "SP")
  })
})
