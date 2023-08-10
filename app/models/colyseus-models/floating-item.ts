import { Schema, type } from "@colyseus/schema"
import { IFloatingItem } from "../../types"
import { nanoid } from "nanoid"
import { Item } from "../../types/enum/Item"

export class FloatingItem extends Schema implements IFloatingItem {
  @type("string") id: string
  @type("string") name: Item
  @type("number") x: number
  @type("number") y: number
  @type("string") avatarId: string = ""
  index: number

  constructor(name: Item, x: number, y: number, index: number) {
    super()
    this.id = nanoid()
    this.name = name
    this.x = x
    this.y = y
    this.index = index
  }
}
