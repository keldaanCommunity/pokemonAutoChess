/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Schema,
  type,
  MapSchema,
  ArraySchema,
  CollectionSchema
} from "@colyseus/schema"
import { Pokemon } from "./pokemon"
import Simulation from "../../core/simulation"
import Synergies from "./synergies"
import { Effects } from "../effects"
import ExperienceManager from "./experience-manager"
import { BattleResult } from "../../types/enum/Game"
import { IPlayer, Role, Title } from "../../types"
import PokemonConfig from "./pokemon-config"
import { IPokemonConfig } from "../mongo-models/user-metadata"
import PokemonCollection from "./pokemon-collection"
import HistoryItem from "./history-item"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"

export default class Player extends Schema implements IPlayer {
  @type("string") id: string
  @type("string") name: string
  @type("string") avatar: string
  @type({ map: Pokemon }) board = new MapSchema<Pokemon>()
  @type(["string"]) shop = new ArraySchema<Pkm>()
  @type(Simulation) simulation = new Simulation()
  @type(ExperienceManager) experienceManager = new ExperienceManager()
  @type({ map: "uint8" }) synergies = new Synergies()
  @type(["string"]) itemsProposition = new ArraySchema<Item>()
  @type("uint8") money = process.env.MODE == "dev" ? 400 : 5
  @type("uint8") life = process.env.MODE == "dev" ? 50 : 100
  @type("boolean") shopLocked: boolean = false
  @type("uint8") streak: number = 0
  @type("uint8") interest: number = 0
  @type("string") opponentName: string = ""
  @type("string") opponentAvatar: string = ""
  @type("uint8") boardSize: number = 0
  @type({ collection: "string" }) items = new CollectionSchema<Item>()
  @type("uint8") rank: number
  @type("uint16") elo: number
  @type("boolean") alive = true
  @type([HistoryItem]) history = new ArraySchema<HistoryItem>()
  @type({ map: PokemonConfig }) pokemonCollection
  @type("string") title: Title | ""
  @type("string") role: Role
  effects: Effects = new Effects()
  isBot: boolean
  opponents: string[] = []
  titles: Set<Title> = new Set<Title>()

  constructor(
    id: string,
    name: string,
    elo: number,
    avatar: string,
    isBot: boolean,
    rank: number,
    pokemonCollection: Map<string, IPokemonConfig>,
    title: Title | "",
    role: Role
  ) {
    super()
    this.id = id
    this.name = name
    this.elo = elo
    this.avatar = avatar
    this.isBot = isBot
    this.rank = rank
    this.title = title
    this.role = role
    this.pokemonCollection = new PokemonCollection(pokemonCollection)
  }

  getCurrentBattleResult() {
    if (this.simulation.blueTeam.size == 0) {
      return BattleResult.DEFEAT
    } else if (this.simulation.redTeam.size == 0) {
      return BattleResult.WIN
    }
    return BattleResult.DRAW
  }

  addBattleResult(
    name: string,
    result: BattleResult,
    avatar: string,
    isPVE: boolean
  ) {
    if (this.history.length >= 5) {
      this.history.shift()
    }
    this.history.push(new HistoryItem(name, result, avatar, isPVE))
  }

  getLastBattleResult() {
    if (this.history.length > 0) {
      return this.history[this.history.length - 1].result
    } else {
      return ""
    }
  }

  getLastPlayerBattleResult() {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (!this.history[i].isPVE) {
        return this.history[i].result
      }
    }
    return ""
  }

  getPokemonAt(x: number, y: number): Pokemon | undefined {
    let p: Pokemon | undefined = undefined

    this.board.forEach((pokemon) => {
      if (pokemon.positionX == x && pokemon.positionY == y) {
        p = pokemon
      }
    })
    return p
  }
}
