import { MapSchema, Schema, type } from "@colyseus/schema"
import { GameUser } from "../../models/colyseus-models/game-user"
import { Dungeon, EloRank } from "../../types/Config"
import { LobbyType } from "../../types/enum/Game"

export interface IPreparationState {
  users: MapSchema<GameUser>
  gameStarted: boolean
  ownerId: string
  ownerName: string
  name: string
  selectedMap: Dungeon | "random"
  minRank: EloRank | null
  lobbyType: LobbyType
}

export default class PreparationState
  extends Schema
  implements IPreparationState
{
  @type({ map: GameUser }) users = new MapSchema<GameUser>()
  @type("boolean") gameStarted: boolean
  @type("string") ownerId: string
  @type("string") ownerName: string
  @type("string") name: string
  @type("string") password: string | null
  @type("boolean") noElo: boolean
  @type("string") selectedMap: Dungeon | "random"
  @type("string") minRank: EloRank | null
  @type("string") lobbyType: LobbyType = LobbyType.NORMAL

  constructor(params: {
    ownerId?: string
    roomName: string
    minRank?: EloRank
    lobbyType: LobbyType
  }) {
    super()
    this.ownerId = params.ownerId ?? ""
    this.name = params.roomName
    this.gameStarted = false
    this.ownerName = ""
    this.password = null
    this.noElo = false
    this.selectedMap = "random"
    this.minRank = params.minRank ?? null
    this.lobbyType = params.lobbyType
  }
}
