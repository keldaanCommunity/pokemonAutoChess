import { Schema, type } from "@colyseus/schema"
import { IFloatingItem } from "../../types"
import { nanoid } from "nanoid"
import { Item } from "../../types/enum/Item"

export class FloatingItem extends Schema implements IFloatingItem {
  @type("string") id: string = nanoid()
  @type("string") name: Item = Item.LEFTOVERS
  @type("number") x: number
  @type("number") y: number

  constructor(id: string, name: Item, x: number, y: number) {
    super()
    this.name = name
    this.x = x
    this.y = y
  }
}
