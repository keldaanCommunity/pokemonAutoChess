import { Schema, type } from "@colyseus/schema"
import { ICount } from "../../types"

export default class Count extends Schema implements ICount {
  @type("uint8") crit = 0
  @type("uint8") ult = 0
  @type("uint8") petalDanceCount = 0
  @type("uint8") fieldCount = 0
  @type("uint8") soundCount = 0
  @type("uint8") fairyCritCount = 0
  @type("uint8") attackCount = 0
  @type("uint8") growGroundCount = 0
  @type("uint8") fightingBlockCount = 0
  @type("uint8") dodgeCount = 0
  @type("uint8") powerLensCount = 0
  @type("uint8") starDustCount = 0
  @type("uint8") tripleAttackCount = 0
  @type("uint8") staticHolderCount = 0
  @type("uint8") defensiveRibbonCount = 0
  @type("uint8") earthquakeCount = 0
  @type("uint8") mindBlownCount = 0
  @type("uint8") spellBlockedCount = 0
  @type("uint8") manaBurnCount = 0
  @type("uint8") moneyCount = 0
  @type("uint8") amuletCoinCount = 0
  @type("uint8") futureSightCount = 0
  @type("uint8") upgradeCount = 0
  @type("uint8") soulDewCount = 0
  @type("uint8") healOrderCount = 0
  @type("uint8") attackOrderCount = 0
  @type("uint8") magmarizerCount = 0
}
