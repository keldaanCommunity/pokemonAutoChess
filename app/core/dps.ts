import { Schema, type } from "@colyseus/schema"
import { IDps } from "../types"

export default class Dps extends Schema implements IDps {
  @type("string") id: string
  @type("string") name: string
  @type("uint16") physicalDamage = 0
  @type("uint16") specialDamage = 0
  @type("uint16") trueDamage = 0
  @type("uint16") hpDamageTaken = 0
  @type("uint16") shieldDamageTaken = 0
  @type("uint16") heal = 0
  @type("uint16") shield = 0

  constructor(id: string, name: string) {
    super()
    this.id = id
    this.name = name
  }

  update(
    physicalDamage: number,
    specialDamage: number,
    trueDamage: number,
    hpDamageTaken: number,
    shieldDamageTaken: number,
    heal: number,
    shield: number
  ) {
    if (this.physicalDamage != physicalDamage) {
      this.physicalDamage = physicalDamage
    }
    if (this.specialDamage != specialDamage) {
      this.specialDamage = specialDamage
    }
    if (this.trueDamage != trueDamage) {
      this.trueDamage = trueDamage
    }
    if (this.hpDamageTaken != hpDamageTaken) {
      this.hpDamageTaken = hpDamageTaken
    }
    if (this.shieldDamageTaken != shieldDamageTaken) {
      this.shieldDamageTaken = shieldDamageTaken
    }
    if (this.heal != heal) {
      this.heal = heal
    }
    if (this.shield != shield) {
      this.shield = shield
    }
  }
}
