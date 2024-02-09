import { Schema, type } from "@colyseus/schema"
import { IExperienceManager } from "../../types"
import { ExpTable } from "../../types/Config"
import { SpecialLobbyRule } from "../../types/enum/SpecialLobbyRule"

export default class ExperienceManager
  extends Schema
  implements IExperienceManager
{
  @type("uint8") level: number
  @type("uint8") experience: number
  @type("uint8") expNeeded: number
  maxLevel: number

  constructor() {
    super()
    this.level = 2
    this.experience = 0
    this.expNeeded = ExpTable[2]
    this.maxLevel = 9
  }

  canLevel() {
    return this.level < this.maxLevel
  }

  addExperience(quantity: number) {
    let expToAdd = quantity
    while (this.checkForLevelUp(expToAdd)) {
      expToAdd -= ExpTable[this.level]
      this.level += 1
      this.expNeeded = ExpTable[this.level]
    }
  }

  checkForLevelUp(quantity: number) {
    if (
      this.experience + quantity >= ExpTable[this.level] &&
      this.level < this.maxLevel
    ) {
      return true
    } else {
      this.experience += quantity
      return false
    }
  }
}

export function getLevelUpCost(specialLobbyRule?: SpecialLobbyRule | null) {
  let cost = 4
  if (specialLobbyRule === SpecialLobbyRule.RARE_IS_EXPENSIVE) {
    cost = 8
  }

  return cost
}
