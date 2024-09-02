import { Schema, type } from "@colyseus/schema"
import { Role } from "../../types"

export interface IGameUser {
  uid: string
  name: string
  avatar: string
  ready: boolean
  isBot: boolean
  elo: number
  title: string
  role: Role
  anonymous: boolean
}
export class GameUser extends Schema implements IGameUser {
  @type("string") uid: string
  @type("string") name: string
  @type("string") avatar: string
  @type("boolean") ready: boolean
  @type("boolean") isBot: boolean
  @type("uint16") elo: number
  @type("string") title: string
  @type("string") role: Role
  @type("boolean") anonymous: boolean

  constructor(
    uid: string,
    name: string,
    elo: number,
    avatar: string,
    isBot: boolean,
    ready: boolean,
    title: string,
    role: Role,
    anonymous: boolean
  ) {
    super()
    this.uid = uid
    this.name = name
    this.avatar = avatar
    this.ready = ready
    this.isBot = isBot
    this.elo = elo
    this.title = title
    this.role = role
    this.anonymous = anonymous
  }
}
