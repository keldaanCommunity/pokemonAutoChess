import { Schema, type } from "@colyseus/schema"
import { BattleStats } from "../../types/interfaces/BattleStats"

export class BattleStatsSchema extends Schema implements BattleStats {
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
}
