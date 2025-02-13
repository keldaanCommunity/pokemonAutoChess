import { MapSchema, Schema, type } from "@colyseus/schema"
import AfterGamePlayer from "../../models/colyseus-models/after-game-player"
import { GameMode } from "../../types/enum/Game"

export default class AfterGameState extends Schema {
  @type({ map: AfterGamePlayer }) players = new MapSchema<AfterGamePlayer>()
  @type("boolean") elligibleToELO = false
  @type("boolean") elligibleToXP = false
  @type("string") gameMode = GameMode.CUSTOM_LOBBY

  constructor({
    elligibleToELO,
    elligibleToXP,
    gameMode
  }: {
    elligibleToELO: boolean
    elligibleToXP: boolean
    gameMode: GameMode
  }) {
    super()
    this.elligibleToXP = elligibleToXP
    this.elligibleToELO = elligibleToELO
    this.gameMode = gameMode
  }
}
