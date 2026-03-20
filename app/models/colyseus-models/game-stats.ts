import { Schema, type } from "@colyseus/schema"
import { GameStats } from "../../types/interfaces/GameStats"

export class GameStatsSchema extends Schema implements GameStats {
  @type("uint16") maxHP = 0
  @type("uint16") maxAttack = 0
  @type("uint16") maxDefense = 0
  @type("uint16") maxAP = 0
  @type("uint16") maxSpecialDefense = 0
  @type("uint16") maxSpeed = 0
  @type("uint16") maxPhysicalDamage = 0
  @type("uint16") maxSpecialDamage = 0
  @type("uint16") maxTrueDamage = 0
  @type("uint16") maxShield = 0
  @type("uint16") maxHeal = 0
  @type("uint8") maxWinStreak = 0
  @type("uint8") dittosUsed = 0
  @type("uint16") rerollCount: number = 0
  @type("uint16") totalMoneyEarned: number = 0
  @type("uint16") totalPlayerDamageDealt: number = 0

  constructor(...args: any[]) {
    super()
    Object.assign(this, ...args)
  }
}
