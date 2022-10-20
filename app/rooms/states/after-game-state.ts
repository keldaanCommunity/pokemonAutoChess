import { Schema, MapSchema, type } from "@colyseus/schema"
import SimplePlayer from "../../models/colyseus-models/simple-player"

export default class AfterGameState extends Schema {
  @type({ map: SimplePlayer }) players = new MapSchema<SimplePlayer>()
}
