import { Schema, type } from "@colyseus/schema"
import { IDpsHeal } from "../types"
import { Pkm } from "../types/enum/Pokemon"

export default class DpsHeal extends Schema implements IDpsHeal {
  @type("string") id: string
  @type("string") name: string
  @type("uint16") heal = 0
  @type("uint16") shield = 0
  pkm: Pkm

  constructor(id: string, name: string, pkm: Pkm) {
    super()
    this.id = id
    this.name = name
    this.pkm = pkm
  }

  changeHeal(heal: number, shield: number) {
    if (this.heal != heal) {
      this.heal = heal
    }
    if (this.shield != shield) {
      this.shield = shield
    }
  }
}
