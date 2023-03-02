import Player from "../../models/colyseus-models/player"
import Shop from "../../models/shop"
import Design, { DesignTiled } from "../../core/design"
import BotManager from "../../core/bot-manager"
import { DungeonData, Dungeon } from "../../types/Config"
import { GamePhaseState } from "../../types/enum/Game"
import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema"
import { Pkm } from "../../types/enum/Pokemon"
import { pickRandomIn } from "../../utils/random"

export default class GameState extends Schema {
  @type("string") afterGameId = ""
  @type("uint8") roundTime = 30
  @type("uint8") phase = GamePhaseState.PICK
  @type({ map: Player }) players = new MapSchema<Player>()
  @type(["string"]) additionalPokemons = new ArraySchema<Pkm>()
  @type("uint8") stageLevel = 0
  @type("string") mapName: string
  @type(Shop) shop = new Shop()
  time = 50000
  botManager: BotManager = new BotManager()
  elligibleToXP = false
  id: Dungeon
  design: Design
  tilemap: DesignTiled | undefined
  gameFinished = false
  name: string
  startTime: number
  endTime: number | undefined = undefined
  preparationId: string

  constructor(preparationId: string, name: string) {
    super()
    this.preparationId = preparationId
    this.startTime = Date.now()
    this.name = name
    this.id = pickRandomIn(Dungeon)
    this.mapName = DungeonData[this.id].name
    this.design = new Design(this.id, 5, 0.1)
    this.design.create().then(() => {
      this.tilemap = this.design.exportToTiled()
    })
  }
}
