/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Schema,
  type,
  MapSchema,
  ArraySchema,
  CollectionSchema
} from "@colyseus/schema"
import { Pokemon } from "./pokemon"
import Synergies, { computeSynergies } from "./synergies"
import ExperienceManager from "./experience-manager"
import { BattleResult } from "../../types/enum/Game"
import { IPlayer, Role, Title } from "../../types"
import PokemonConfig from "./pokemon-config"
import { IPokemonConfig } from "../mongo-models/user-metadata"
import PokemonCollection from "./pokemon-collection"
import HistoryItem from "./history-item"
import {
  ArtificialItems,
  Berries,
  Item,
  SynergyGivenByItem
} from "../../types/enum/Item"
import { Pkm, PkmProposition } from "../../types/enum/Pokemon"
import { Weather } from "../../types/enum/Weather"
import PokemonFactory from "../pokemon-factory"
import { Effects } from "../effects"
import { values } from "../../utils/schemas"
import { pickNRandomIn, pickRandomIn } from "../../utils/random"
import { Synergy } from "../../types/enum/Synergy"
import { SynergyTriggers } from "../../types/Config"
import GameState from "../../rooms/states/game-state"

export default class Player extends Schema implements IPlayer {
  @type("string") id: string
  @type("string") simulationId = ""
  @type("number") simulationTeamIndex: number = 0
  @type("string") name: string
  @type("string") avatar: string
  @type({ map: Pokemon }) board = new MapSchema<Pokemon>()
  @type(["string"]) shop = new ArraySchema<Pkm>()
  @type(ExperienceManager) experienceManager = new ExperienceManager()
  @type({ map: "uint8" }) synergies = new Synergies()
  @type("uint16") money = process.env.MODE == "dev" ? 999 : 6
  @type("uint8") life = 100
  @type("boolean") shopLocked: boolean = false
  @type("uint8") streak: number = 0
  @type("uint8") interest: number = 0
  @type("string") opponentId: string = ""
  @type("string") opponentName: string = ""
  @type("string") opponentAvatar: string = ""
  @type("string") opponentTitle: string = ""
  @type("uint8") boardSize: number = 0
  @type({ collection: "string" }) items = new CollectionSchema<Item>()
  @type("uint8") rank: number
  @type("uint16") elo: number
  @type("boolean") alive = true
  @type([HistoryItem]) history = new ArraySchema<HistoryItem>()
  @type({ map: PokemonConfig }) pokemonCollection
  @type("string") title: Title | ""
  @type("string") role: Role
  @type(["string"]) itemsProposition = new ArraySchema<Item>()
  @type(["string"]) pokemonsProposition = new ArraySchema<PkmProposition>()
  @type(["string"]) pveRewards = new ArraySchema<Item>()
  @type("float32") loadingProgress: number = 0
  @type("string") berry: Item = pickRandomIn(Berries)
  @type("uint8") berryTreeStage: number = 1
  @type({ set: "string" }) effects: Effects = new Effects()
  isBot: boolean
  opponents: Map<string, number> = new Map<string, number>()
  titles: Set<Title> = new Set<Title>()
  rerollCount: number = 0
  artificialItems: Item[] = pickNRandomIn(ArtificialItems, 3)
  lightX: number
  lightY: number

  constructor(
    id: string,
    name: string,
    elo: number,
    avatar: string,
    isBot: boolean,
    rank: number,
    pokemonCollection: Map<string, IPokemonConfig>,
    title: Title | "",
    role: Role,
    state: GameState
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
    this.lightX = state.lightX
    this.lightY = state.lightY
    if (isBot) {
      this.loadingProgress = 100
      this.lightX = 3
      this.lightY = 2
    }
  }

  addBattleResult(
    id: string,
    name: string,
    result: BattleResult,
    avatar: string,
    weather: Weather | undefined
  ) {
    this.history.push(
      new HistoryItem(
        id,
        name,
        result,
        avatar,
        weather ? weather : Weather.NEUTRAL
      )
    )
  }

  getLastBattle(): HistoryItem | null {
    if (this.history.length > 0) {
      return this.history[this.history.length - 1]
    } else {
      return null
    }
  }

  getLastBattleResult(): BattleResult | "" {
    return this.getLastBattle()?.result ?? ""
  }

  getCurrentStreakType(): BattleResult | null {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (
        !this.history[i].isPVE &&
        this.history[i].result !== BattleResult.DRAW
      ) {
        return this.history[i].result
      }
    }
    return null
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

  transformPokemon(pokemon: Pokemon, newEntry: Pkm): Pokemon {
    const newPokemon = PokemonFactory.createPokemonFromName(newEntry, this)
    pokemon.items.forEach((item) => {
      newPokemon.items.add(item)
    })
    newPokemon.positionX = pokemon.positionX
    newPokemon.positionY = pokemon.positionY
    this.board.delete(pokemon.id)
    this.board.set(newPokemon.id, newPokemon)
    this.updateSynergies()
    this.effects.update(this.synergies, this.board)
    return newPokemon
  }

  getFirstAvailablePositionOnBoard() {
    for (let x = 0; x < 8; x++) {
      for (let y = 1; y < 4; y++) {
        if (this.isPositionEmpty(x, y)) {
          return [x, y]
        }
      }
    }
  }

  isPositionEmpty(x: number, y: number): boolean {
    return (
      values(this.board).some((p) => p.positionX === x && p.positionY === y) ===
      false
    )
  }

  getFreeSpaceOnBench(): number {
    let numberOfFreeSpace = 0
    for (let i = 0; i < 8; i++) {
      if (this.isPositionEmpty(i, 0)) {
        numberOfFreeSpace++
      }
    }
    return numberOfFreeSpace
  }

  getFirstAvailablePositionInBench() {
    for (let i = 0; i < 8; i++) {
      if (this.isPositionEmpty(i, 0)) {
        return i
      }
    }
  }

  updateSynergies() {
    const pokemons: Pokemon[] = values(this.board)
    const updatedSynergies = computeSynergies(pokemons)

    this.updateArtificialItems(updatedSynergies)

    const previousLight = this.synergies.get(Synergy.LIGHT) ?? 0
    const newLight = updatedSynergies.get(Synergy.LIGHT) ?? 0
    const minimumToGetLight = SynergyTriggers[Synergy.LIGHT][0]
    const lightChanged =
      (previousLight >= minimumToGetLight && newLight < minimumToGetLight) || // light lost
      (previousLight < minimumToGetLight && newLight >= minimumToGetLight) // light gained

    updatedSynergies.forEach((value, synergy) =>
      this.synergies.set(synergy, value)
    )

    if (lightChanged) this.onLightChange()
  }

  updateArtificialItems(updatedSynergies: Map<Synergy, number>) {
    const previousNbArtifItems = SynergyTriggers[Synergy.ARTIFICIAL].filter(
      (n) => (this.synergies.get(Synergy.ARTIFICIAL) ?? 0) >= n
    ).length

    const newNbArtifItems = SynergyTriggers[Synergy.ARTIFICIAL].filter(
      (n) => (updatedSynergies.get(Synergy.ARTIFICIAL) ?? 0) >= n
    ).length

    if (newNbArtifItems > previousNbArtifItems) {
      // some artificial items are gained
      const gainedArtificialItems = this.artificialItems.slice(
        previousNbArtifItems,
        newNbArtifItems
      )
      gainedArtificialItems.forEach((item) => {
        this.items.add(item)
      })
    } else if (newNbArtifItems < previousNbArtifItems) {
      // some artificial items are lost
      const lostArtificialItems = this.artificialItems.slice(
        newNbArtifItems,
        previousNbArtifItems
      )
      lostArtificialItems.forEach((item) => {
        this.items.delete(item)
      })
      this.board.forEach((pokemon) => {
        lostArtificialItems.forEach((item) => {
          if (pokemon.items.has(item)) {
          pokemon.items.delete(item)
            if (SynergyGivenByItem.hasOwnProperty(item)) {
            const type = SynergyGivenByItem[item]
            pokemon.types.delete(type)
            }
          }
        })
      })
    }
  }

  onLightChange() {
    const pokemonsReactingToLight = [
      Pkm.NECROZMA,
      Pkm.ULTRA_NECROZMA,
      Pkm.CHERRIM_SUNLIGHT,
      Pkm.CHERRIM
    ]
    this.board.forEach((pokemon) => {
      if (pokemonsReactingToLight.includes(pokemon.name)) {
        pokemon.onChangePosition(pokemon.positionX, pokemon.positionY, this)
      }
    })
  }
}
