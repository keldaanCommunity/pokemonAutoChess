import { Schema, type } from "@colyseus/schema"
import { ExpTable } from "../../config"
import type { IExperienceManager } from "../../types"
import type { SpecialGameRule } from "../../types/enum/SpecialGameRule"

export default class ExperienceManager
  extends Schema
  implements IExperienceManager
{
  @type("uint8") level: number
  @type("uint8") experience: number
  @type("uint8") expNeeded: number
  @type("uint8") maxLevel: number

  constructor() {
    super()
    this.level = 2
    this.experience = 0
    this.expNeeded = ExpTable[2]
    this.maxLevel = 9
  }

  canLevelUp() {
    return this.level < this.maxLevel
  }

  addExperience(quantity: number): number {
    if (!this.canLevelUp()) return 0

    let expToAdd = quantity
    while (this.canLevelUpWithXP(expToAdd)) {
      expToAdd -= ExpTable[this.level]
      this.level += 1
      this.expNeeded = ExpTable[this.level] ?? 255
    }
    if (this.level < this.maxLevel) {
      this.experience += expToAdd
      return quantity
    }

    // The XP already held also counted toward reaching the level cap.
    return quantity - expToAdd - this.experience
  }

  canLevelUpWithXP(quantity: number): boolean {
    return (
      this.experience + quantity >= ExpTable[this.level] &&
      this.level < this.maxLevel
    )
  }
}

export function getLevelUpCost(specialGameRule?: SpecialGameRule | null) {
  const cost = 4
  return cost
}
