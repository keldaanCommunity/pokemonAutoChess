import { Schema, type, ArraySchema } from "@colyseus/schema"
import { IPortal } from "../../types"
import { nanoid } from "nanoid"
import { Synergy } from "../../types/enum/Synergy"

export class Portal extends Schema implements IPortal {
  @type("string") id: string
  @type(["string"]) symbols = new ArraySchema<Synergy>()
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
