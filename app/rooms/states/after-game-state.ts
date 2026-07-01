import { MapSchema, Schema, type } from "@colyseus/schema"
import AfterGamePlayer from "../../models/colyseus-models/after-game-player"
import { GameMode } from "../../types/enum/Game"

export default class AfterGameState extends Schema {
  @type({ map: AfterGamePlayer }) players = new MapSchema<AfterGamePlayer>()
  @type("boolean") eligibleToELO = false
  @type("boolean") eligibleToXP = false
  @type("string") gameMode = GameMode.CUSTOM_LOBBY

  constructor({
    eligibleToELO,
    eligibleToXP,
    gameMode
  }: {
    eligibleToELO: boolean
    eligibleToXP: boolean
    gameMode: GameMode
  }) {
    super()
    this.eligibleToXP = eligibleToXP
    this.eligibleToELO = eligibleToELO
    this.gameMode = gameMode
  }
}
