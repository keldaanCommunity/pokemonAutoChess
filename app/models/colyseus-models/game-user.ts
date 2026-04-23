import { Schema, type } from "@colyseus/schema"
import { Role } from "../../types"

export interface IGameUser {
  uid: string
  name: string
  avatar: string
  ready: boolean
  isBot: boolean
  elo: number
  games: number
  title: string
  role: Role
  anonymous: boolean
  twitchLogin: string
  twitchDisplayName: string
  youtubeChannelId: string
  youtubeHandle: string
  youtubeChannelTitle: string
}
export class GameUser extends Schema implements IGameUser {
  @type("string") uid: string
  @type("string") name: string
  @type("string") avatar: string
  @type("boolean") ready: boolean
  @type("boolean") isBot: boolean
  @type("uint16") elo: number
  @type("uint16") games: number
  @type("string") title: string
  @type("string") role: Role
  @type("boolean") anonymous: boolean
  @type("string") twitchLogin: string
  @type("string") twitchDisplayName: string
  @type("string") youtubeChannelId: string
  @type("string") youtubeHandle: string
  @type("string") youtubeChannelTitle: string

  constructor(
    uid: string,
    name: string,
    elo: number,
    games: number,
    avatar: string,
    isBot: boolean,
    ready: boolean,
    title: string,
    role: Role,
    anonymous: boolean,
    twitchLogin = "",
    twitchDisplayName = "",
    youtubeChannelId = "",
    youtubeHandle = "",
    youtubeChannelTitle = ""
  ) {
    super()
    this.uid = uid
    this.name = name
    this.avatar = avatar
    this.ready = ready
    this.isBot = isBot
    this.elo = elo
    this.games = games
    this.title = title
    this.role = role
    this.anonymous = anonymous
    this.twitchLogin = twitchLogin
    this.twitchDisplayName = twitchDisplayName
    this.youtubeChannelId = youtubeChannelId
    this.youtubeHandle = youtubeHandle
    this.youtubeChannelTitle = youtubeChannelTitle
  }
}
