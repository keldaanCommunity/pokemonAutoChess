import { Schema, type } from "@colyseus/schema"
import { IDps } from "../types"
import { Pkm } from "../types/enum/Pokemon"

export default class Dps extends Schema implements IDps {
  @type("string") id: string
  @type("string") name: string
  @type("uint16") physicalDamage = 0
  @type("uint16") specialDamage = 0
  @type("uint16") trueDamage = 0
  pkm: Pkm

  constructor(id: string, name: string, pkm: Pkm) {
    super()
    this.id = id
    this.name = name
    this.pkm = pkm
  }

  changeDamage(
    physicalDamage: number,
    specialDamage: number,
    trueDamage: number
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
  }
}
