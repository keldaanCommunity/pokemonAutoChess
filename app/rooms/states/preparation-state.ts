import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema"
import { nanoid } from "nanoid"
import { GameUser } from "../../models/colyseus-models/game-user"
import Message from "../../models/colyseus-models/message"
import { EloRank } from "../../types/Config"
import { GameMode } from "../../types/enum/Game"

export interface IPreparationState {
  users: MapSchema<GameUser>
  messages: ArraySchema<Message>
  gameStarted: boolean
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
  @type("boolean") gameStarted: boolean
  @type("string") ownerId: string
  @type("string") ownerName: string
  @type("string") name: string
  @type("string") password: string | null
  @type("string") minRank: EloRank | null
  @type("string") gameMode: GameMode = GameMode.NORMAL
  @type("boolean") noElo: boolean

  constructor(params: {
    ownerId?: string
    roomName: string
    minRank?: EloRank
    noElo?: boolean
    gameMode: GameMode
  }) {
    super()
    this.ownerId =
      params.gameMode === GameMode.NORMAL ? params.ownerId ?? "" : ""
    this.name = params.roomName
    this.gameStarted = false
    this.ownerName = ""
    this.password = null
    this.noElo = params.noElo ?? false
    this.minRank = params.minRank ?? null
    this.gameMode = params.gameMode
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
    this.messages.push(message)
  }

  removeMessage(id: string) {
    const messageIndex = this.messages.findIndex((m) => m.id === id)
    if (messageIndex !== -1) {
      this.messages.splice(messageIndex, 1)
    }
  }
}
