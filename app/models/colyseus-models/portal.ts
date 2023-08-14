import { Schema, type } from "@colyseus/schema"
import { IPortal, ISynergySymbol } from "../../types"
import { nanoid } from "nanoid"
import { Synergy } from "../../types/enum/Synergy"

export class Portal extends Schema implements IPortal {
  @type("string") id: string
  @type("number") x: number
  @type("number") y: number
  @type("string") avatarId: string = ""
  index: number

  constructor(x: number, y: number, index: number) {
    super()
    this.id = nanoid()
    this.x = x
    this.y = y
    this.index = index
  }
}

export class SynergySymbol extends Schema implements ISynergySymbol {
  @type("string") id: string
  @type("number") x: number
  @type("number") y: number
  @type("string") synergy: Synergy
  @type("string") portalId: string = ""
  index: number

  constructor(x: number, y: number, synergy: Synergy, index: number) {
    super()
    this.id = nanoid()
    this.x = x
    this.y = y
    this.synergy = synergy
    this.index = index
  }
}
