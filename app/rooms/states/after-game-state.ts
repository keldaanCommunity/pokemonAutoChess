import { Schema, MapSchema, type } from "@colyseus/schema"
import SimplePlayer from "../../models/colyseus-models/simple-player"

export default class AfterGameState extends Schema {
  @type({ map: SimplePlayer }) players = new MapSchema<SimplePlayer>()
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
