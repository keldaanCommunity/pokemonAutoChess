import Player from "../../models/colyseus-models/player"
import { PokemonAvatarModel } from "../../models/colyseus-models/pokemon-avatar"
import { FloatingItem } from "../../models/colyseus-models/floating-item"
import Shop from "../../models/shop"
import Design, { DesignTiled } from "../../core/design"
import BotManager from "../../core/bot-manager"
import {
  DungeonData,
  Dungeon,
  StageDuration,
  BOARD_WIDTH,
  BOARD_HEIGHT
} from "../../types/Config"
import { GamePhaseState } from "../../types/enum/Game"
import { Weather } from "../../types/enum/Weather"
import {
  Schema,
  MapSchema,
  ArraySchema,
  type,
  SetSchema
} from "@colyseus/schema"
import { PkmProposition } from "../../types/enum/Pokemon"
import { pickRandomIn, randomBetween } from "../../utils/random"
import { Portal, SynergySymbol } from "../../models/colyseus-models/portal"
import Simulation from "../../core/simulation"
import { Item } from "../../types/enum/Item"

export default class GameState extends Schema {
  @type("string") afterGameId = ""
  @type("uint8") roundTime = StageDuration[1]
  @type("uint8") phase = GamePhaseState.PICK
  @type({ map: Player }) players = new MapSchema<Player>()
  @type({ map: PokemonAvatarModel }) avatars =
    new MapSchema<PokemonAvatarModel>()
  @type({ map: FloatingItem }) floatingItems = new MapSchema<FloatingItem>()
  @type({ map: Portal }) portals = new MapSchema<Portal>()
  @type({ map: SynergySymbol }) symbols = new MapSchema<SynergySymbol>()
  @type(["string"]) additionalPokemons = new ArraySchema<PkmProposition>()
  @type("uint8") stageLevel = 1
  @type("string") mapName: string
  @type("string") weather: Weather
  @type("boolean") noElo = false
  @type({ set: "string" }) spectators = new SetSchema<string>()
  @type({ map: Simulation }) simulations = new MapSchema<Simulation>()
  @type("uint8") lightX = randomBetween(0, BOARD_WIDTH - 1)
  @type("uint8") lightY = randomBetween(1, BOARD_HEIGHT / 2 - 1)

  time = StageDuration[1] * 1000
  updatePhaseNeeded = false
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
  pveRewards: Item[] = []

  constructor(
    preparationId: string,
    name: string,
    noElo: boolean,
    selectedMap: Dungeon | "random"
  ) {
    super()
    this.preparationId = preparationId
    this.startTime = Date.now()
    this.name = name
    this.id = selectedMap === "random" ? pickRandomIn(Dungeon) : selectedMap
    this.noElo = noElo
    this.mapName = DungeonData[this.id].name
    this.weather = Weather.NEUTRAL
    this.design = new Design(this.id, 5, 0.1)
    this.design.create().then(() => {
      this.tilemap = this.design.exportToTiled()
    })
  }
}
