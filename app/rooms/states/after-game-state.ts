import { MapSchema, Schema, type } from "@colyseus/schema"
import AfterGamePlayer from "../../models/colyseus-models/after-game-player"

export default class AfterGameState extends Schema {
  @type({ map: AfterGamePlayer }) players = new MapSchema<AfterGamePlayer>()
  @type("boolean") elligibleToELO = false
  @type("boolean") elligibleToXP = false

  constructor({
    elligibleToELO,
    elligibleToXP
  }: {
    elligibleToELO: boolean
    elligibleToXP: boolean
  }) {
    super()
    this.elligibleToXP = elligibleToXP
    this.elligibleToELO = elligibleToELO
  }
}
