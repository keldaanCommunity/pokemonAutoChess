import { MapSchema, Schema, type } from "@colyseus/schema"
import { GameUser } from "../../models/colyseus-models/game-user"
import { DungeonPMDO, EloRank } from "../../types/Config"
import { GameMode } from "../../types/enum/Game"

export interface IPreparationState {
  users: MapSchema<GameUser>
  gameStarted: boolean
  ownerId: string
  ownerName: string
  name: string
  selectedMap: DungeonPMDO | "random"
  minRank: EloRank | null
  gameMode: GameMode
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
  @type("string") selectedMap: DungeonPMDO | "random"
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
    this.ownerId = params.ownerId ?? ""
    this.name = params.roomName
    this.gameStarted = false
    this.ownerName = ""
    this.password = null
    this.noElo = params.noElo ?? false
    this.selectedMap = "random"
    this.minRank = params.minRank ?? null
    this.gameMode = params.gameMode
  }
}
