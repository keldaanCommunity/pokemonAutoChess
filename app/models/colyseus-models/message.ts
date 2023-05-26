import { Schema, type } from "@colyseus/schema"
import { IChatV2 } from "../../types/index"

export default class Message extends Schema implements IChatV2 {
  @type("string") id: string
  @type("string") payload: string
  @type("string") authorId: string
  @type("string") author: string
  @type("string") avatar: string
  @type("number") time: number

  constructor(
    id: string,
    payload: string,
    authorId: string,
    author: string,
    avatar: string,
    time: number
  ) {
    super()
    this.id = id
    this.payload = payload
    this.authorId = authorId
    this.author = author
    this.avatar = avatar
    this.time = time
  }
}
