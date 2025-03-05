import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema"
import { nanoid } from "nanoid"
import { GameUser } from "../../models/colyseus-models/game-user"
import Message from "../../models/colyseus-models/message"
import { EloRank } from "../../types/Config"
import { GameMode } from "../../types/enum/Game"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule"
import chatV2 from "../../models/mongo-models/chat-v2"

export interface IPreparationState {
  users: MapSchema<GameUser>
  messages: ArraySchema<Message>
  gameStartedAt: string | null
  ownerId: string
  ownerName: string
  name: string
  minRank: EloRank | null
  gameMode: GameMode
}

export default class PreparationState
  extends Schema
  implements IPreparationState
{
  @type([Message]) messages = new ArraySchema<Message>()
  @type({ map: GameUser }) users = new MapSchema<GameUser>()
  @type("string") gameStartedAt: string | null
  @type("string") ownerId: string
  @type("string") ownerName: string
  @type("string") name: string
  @type("string") password: string | null
  @type("string") minRank: EloRank | null
  @type("string") maxRank: EloRank | null
  @type("string") gameMode: GameMode = GameMode.CUSTOM_LOBBY
  @type("string") specialGameRule: SpecialGameRule | null
  @type("boolean") noElo: boolean
  @type(["string"]) whitelist: string[]
  @type(["string"]) blacklist: string[]
  abortOnPlayerLeave?: AbortController

  constructor(params: {
    ownerId?: string
    roomName: string
    minRank?: EloRank
    maxRank?: EloRank
    noElo?: boolean
    password?: string
    gameMode: GameMode
    specialGameRule?: SpecialGameRule
    whitelist?: string[]
    blacklist?: string[]
  }) {
    super()
    this.ownerId =
      params.gameMode === GameMode.CUSTOM_LOBBY ? (params.ownerId ?? "") : ""
    this.name = params.roomName
    this.gameStartedAt = null
    this.ownerName = ""
    this.password = params.password ?? null
    this.noElo = params.noElo ?? false
    this.minRank = params.minRank ?? null
    this.maxRank = params.maxRank ?? null
    this.gameMode = params.gameMode
    this.specialGameRule = params.specialGameRule ?? null
    this.whitelist = params.whitelist ?? []
    this.blacklist = params.blacklist ?? []
  }

  addMessage(params: {
    payload: string
    authorId: string
    author?: string | undefined
    avatar?: string | undefined
  }) {
    const id = nanoid()
    const time = Date.now()
    const message = new Message(
      id,
      params.payload,
      params.authorId,
      params.author ?? "",
      params.avatar ?? "",
      time
    )
    if (params.author) {
      chatV2.create({
        id: id,
        payload: message.payload,
        authorId: message.authorId,
        author: message.author,
        avatar: message.avatar,
        time: time
      })
    }
    this.messages.push(message)
  }

  removeMessage(id: string) {
    const messageIndex = this.messages.findIndex((m) => m.id === id)
    if (messageIndex !== -1) {
      this.messages.splice(messageIndex, 1)
    }
  }
}
