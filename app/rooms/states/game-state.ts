import Player from "../../models/colyseus-models/player"
import { PokemonAvatar } from "../../models/colyseus-models/pokemon-avatar"
import { FloatingItem } from "../../models/colyseus-models/floating-item"
import Shop from "../../models/shop"
import Design, { DesignTiled } from "../../core/design"
import BotManager from "../../core/bot-manager"
import { DungeonData, Dungeon, StageDuration } from "../../types/Config"
import { GamePhaseState } from "../../types/enum/Game"
import {
  Schema,
  MapSchema,
  ArraySchema,
  type,
  SetSchema
} from "@colyseus/schema"
import { Pkm } from "../../types/enum/Pokemon"
import { pickRandomIn } from "../../utils/random"

export default class GameState extends Schema {
  @type("string") afterGameId = ""
  @type("uint8") roundTime = StageDuration[1]
  @type("uint8") phase = GamePhaseState.PICK
  @type({ map: Player }) players = new MapSchema<Player>()
  @type({ map: PokemonAvatar }) avatars = new MapSchema<PokemonAvatar>()
  @type({ map: FloatingItem }) floatingItems = new MapSchema<FloatingItem>()
  @type(["string"]) additionalPokemons = new ArraySchema<Pkm>()
  @type("uint8") stageLevel = 1
  @type("string") mapName: string
  @type("boolean") noElo = false
  @type({ set: "string" }) spectators = new SetSchema<string>()
  time = StageDuration[1] * 1000
  botManager: BotManager = new BotManager()
  shop: Shop = new Shop()
  id: Dungeon
  design: Design
  tilemap: DesignTiled | undefined
  gameFinished = false
  gameLoaded = false
  name: string
  startTime: number
  endTime: number | undefined = undefined
  preparationId: string
  shinyEncounter = false

  constructor(preparationId: string, name: string, noElo: boolean) {
    super()
    this.preparationId = preparationId
    this.startTime = Date.now()
    this.name = name
    this.id = pickRandomIn(Dungeon)
    this.noElo = noElo
    this.mapName = DungeonData[this.id].name
    this.design = new Design(this.id, 5, 0.1)
    this.design.create().then(() => {
      this.tilemap = this.design.exportToTiled()
    })
  }
}
