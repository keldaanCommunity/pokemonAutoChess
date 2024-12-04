import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema"
import { PokemonEntity } from "../../core/pokemon-entity"
import type GameState from "../../rooms/states/game-state"
import type { IPlayer, Role, Title } from "../../types"
import { SynergyTriggers, UniqueShop } from "../../types/Config"
import { DungeonPMDO } from "../../types/enum/Dungeon"
import { BattleResult, Rarity, Team } from "../../types/enum/Game"
import {
  ArtificialItems,
  Berries,
  Item,
  ItemComponents,
  SynergyGivenByItem,
  WeatherRocks
} from "../../types/enum/Item"
import {
  Pkm,
  PkmByIndex,
  PkmDuos,
  PkmFamily,
  type PkmProposition,
  PkmRegionalVariants
} from "../../types/enum/Pokemon"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule"
import { Synergy } from "../../types/enum/Synergy"
import { Weather } from "../../types/enum/Weather"
import { removeInArray } from "../../utils/array"
import { getPokemonConfigFromAvatar } from "../../utils/avatar"
import { getFirstAvailablePositionInBench, isOnBench } from "../../utils/board"
import { pickNRandomIn, pickRandomIn } from "../../utils/random"
import { resetArraySchema, values } from "../../utils/schemas"
import { Effects } from "../effects"
import { createRandomEgg } from "../egg-factory"
import type { IPokemonConfig } from "../mongo-models/user-metadata"
import PokemonFactory from "../pokemon-factory"
import {
  PRECOMPUTED_REGIONAL_MONS,
  getPokemonData
} from "../precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../precomputed/precomputed-rarity"
import { getRegularsTier1, getSellPrice } from "../shop"
import ExperienceManager from "./experience-manager"
import HistoryItem from "./history-item"
import { Pokemon, PokemonClasses } from "./pokemon"
import PokemonCollection from "./pokemon-collection"
import PokemonConfig from "./pokemon-config"
import Synergies, { computeSynergies } from "./synergies"

export default class Player extends Schema implements IPlayer {
  @type("string") id: string
  @type("string") simulationId = ""
  @type("number") team: Team = Team.BLUE_TEAM
  @type("string") name: string
  @type("string") avatar: string
  @type({ map: Pokemon }) board = new MapSchema<Pokemon>()
  @type(["string"]) shop = new ArraySchema<Pkm>()
  @type(ExperienceManager) experienceManager = new ExperienceManager()
  @type({ map: "uint8" }) synergies = new Synergies()
  @type("uint16") money = process.env.MODE == "dev" ? 999 : 5
  @type("int16") life = 100
  @type("boolean") shopLocked: boolean = false
  @type("uint8") shopFreeRolls: number = 0
  @type("uint8") streak: number = 0
  @type("uint8") interest: number = 0
  @type("string") opponentId: string = ""
  @type("string") opponentName: string = ""
  @type("string") opponentAvatar: string = ""
  @type("string") opponentTitle: string = ""
  @type("string") spectatedPlayerId: string
  @type("uint8") boardSize: number = 0
  @type(["string"]) items = new ArraySchema<Item>()
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
  @type(["string"]) pveRewardsPropositions = new ArraySchema<Item>()
  @type("float32") loadingProgress: number = 0
  @type(["string"]) berryTreesType: Item[] = [
    pickRandomIn(Berries),
    pickRandomIn(Berries),
    pickRandomIn(Berries)
  ]
  @type(["uint8"]) berryTreesStage: number[] = [1, 1, 1]
  @type("string") map: DungeonPMDO
  @type({ set: "string" }) effects: Effects = new Effects()
  @type(["string"]) regionalPokemons = new ArraySchema<Pkm>()
  @type("uint16") rerollCount: number = 0
  @type("uint16") totalMoneyEarned: number = 0
  @type("uint16") totalPlayerDamageDealt: number = 0
  @type("float32") eggChance: number = 0
  @type("float32") wildChance: number = 0
  commonRegionalPool: Pkm[] = new Array<Pkm>()
  uncommonRegionalPool: Pkm[] = new Array<Pkm>()
  rareRegionalPool: Pkm[] = new Array<Pkm>()
  epicRegionalPool: Pkm[] = new Array<Pkm>()
  ultraRegionalPool: Pkm[] = new Array<Pkm>()
  isBot: boolean
  opponents: Map<string, number> = new Map<string, number>()
  titles: Set<Title> = new Set<Title>()
  artificialItems: Item[] = pickNRandomIn(ArtificialItems, 3)
  weatherRocks: Item[] = []
  randomComponentsGiven: Item[] = []
  randomEggsGiven: Pkm[] = []
  lightX: number
  lightY: number
  canRegainLife: boolean = true
  ghost: boolean = false
  firstPartner: Pkm | undefined
  hasLeftGame: boolean = false

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
    this.spectatedPlayerId = id
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
    this.map = pickRandomIn(DungeonPMDO)
    this.updateRegionalPool(state, true)

    if (isBot) {
      this.loadingProgress = 100
      this.lightX = 3
      this.lightY = 2
    }

    if (state.specialGameRule === SpecialGameRule.NINE_LIVES) {
      this.life = 9
      this.canRegainLife = false
    } else if (state.specialGameRule === SpecialGameRule.DESPERATE_MOVES) {
      this.life = 150
    }

    if (state.specialGameRule === SpecialGameRule.DITTO_PARTY) {
      for (let i = 0; i < 5; i++) {
        const ditto = PokemonFactory.createPokemonFromName(Pkm.DITTO, this)
        ditto.positionX = getFirstAvailablePositionInBench(this.board) ?? 0
        ditto.positionY = 0
        this.board.set(ditto.id, ditto)
        ditto.onAcquired(this)
      }
    }

    if (state.specialGameRule === SpecialGameRule.UNIQUE_STARTER) {
      const randomUnique = pickRandomIn(UniqueShop)
      const pokemonsObtained: Pokemon[] = (
        randomUnique in PkmDuos ? PkmDuos[randomUnique] : [randomUnique]
      ).map((p) => PokemonFactory.createPokemonFromName(p, this))
      this.firstPartner = pokemonsObtained[0].name
      pokemonsObtained.forEach((pokemon) => {
        pokemon.positionX = getFirstAvailablePositionInBench(this.board) ?? 0
        pokemon.positionY = 0
        this.board.set(pokemon.id, pokemon)
        pokemon.onAcquired(this)
      })
    } else if (state.specialGameRule === SpecialGameRule.DO_IT_ALL_YOURSELF) {
      const { index, emotion, shiny } = getPokemonConfigFromAvatar(this.avatar)
      this.firstPartner = PkmByIndex[index]
      let avatar: Pokemon
      if (this.firstPartner === Pkm.EGG) {
        avatar = createRandomEgg(shiny, this)
      } else {
        avatar = PokemonFactory.createPokemonFromName(this.firstPartner, {
          selectedEmotion: emotion,
          selectedShiny: shiny
        })
      }

      avatar.positionX = getFirstAvailablePositionInBench(this.board) ?? 0
      avatar.positionY = 0
      avatar.hp += 100
      this.board.set(avatar.id, avatar)
      avatar.onAcquired(this)
      this.money += 40 - 2 * getSellPrice(avatar, state.specialGameRule)
    } else if (state.specialGameRule === SpecialGameRule.FIRST_PARTNER) {
      const randomCommons = pickNRandomIn(
        getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.COMMON).filter(
          (p) => getPokemonData(p).stages === 3
        ),
        3
      )
      this.pokemonsProposition.push(...randomCommons)
    } else {
      this.firstPartner = state.shop.getRandomPokemonFromPool(
        Rarity.COMMON,
        this
      )
      const pokemon = PokemonFactory.createPokemonFromName(
        this.firstPartner,
        this
      )
      pokemon.positionX = getFirstAvailablePositionInBench(this.board) ?? 0
      pokemon.positionY = 0
      this.board.set(pokemon.id, pokemon)
      pokemon.onAcquired(this)
    }

    if (state.specialGameRule === SpecialGameRule.SLAMINGO) {
      for (let i = 0; i < 4; i++) this.items.push(pickRandomIn(ItemComponents))
    }
  }

  addMoney(
    value: number,
    countTotalEarned: boolean,
    origin: PokemonEntity | null
  ) {
    if (origin?.isGhostOpponent) {
      return // do not count money earned by pokemons from a ghost player
    }
    this.money += value
    if (countTotalEarned && value > 0) this.totalMoneyEarned += value
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
    newPokemon.onAcquired(this)
    this.updateSynergies()
    return newPokemon
  }

  updateSynergies() {
    const pokemons: Pokemon[] = values(this.board)
    let updatedSynergies = computeSynergies(pokemons)

    const artifNeedsRecomputing = this.updateArtificialItems(updatedSynergies)
    if (artifNeedsRecomputing) {
      /* NOTE: computing twice is costly in performance but the safest way to get the synergies
      right after losing an artificial item, since many edgecases may need to be adressed when 
      losing a type (Axew double dragon + artif item for example) ; it's not as easy as just 
      decrementing by 1 in updatedSynergies map count
      */
      updatedSynergies = computeSynergies(pokemons)
    }

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

    this.updateFishingRods()
    this.updateWeatherRocks()
    this.updateWildChance()
    this.effects.update(this.synergies, this.board)
  }

  updateArtificialItems(updatedSynergies: Map<Synergy, number>): boolean {
    let needsRecomputingSynergiesAgain = false
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
        this.items.push(item)
      })
    } else if (newNbArtifItems < previousNbArtifItems) {
      // some artificial items are lost
      const lostArtificialItems = this.artificialItems.slice(
        newNbArtifItems,
        previousNbArtifItems
      )

      // variables for managing number of "Trash" items
      const lostTrash = lostArtificialItems.filter(
        (item) => item === Item.TRASH
      ).length
      let cleanedTrash = 0

      this.board.forEach((pokemon) => {
        lostArtificialItems.forEach((item) => {
          if (pokemon.items.has(item)) {
            if (item === Item.TRASH && lostTrash - cleanedTrash > 0) {
              pokemon.items.delete(item)
              cleanedTrash++
            } else if (item !== Item.TRASH) {
              pokemon.items.delete(item)

              if (item in SynergyGivenByItem) {
                const type = SynergyGivenByItem[item]
                const nativeTypes = getPokemonData(pokemon.name).types
                if (nativeTypes.includes(type) === false) {
                  pokemon.types.delete(type)
                  if (!isOnBench(pokemon)) {
                    needsRecomputingSynergiesAgain = true
                  }
                }
              }
            }
          }
        })
      })

      lostArtificialItems.forEach((item) => {
        if (item !== Item.TRASH) {
          removeInArray<Item>(this.items, item)
        } else if (item === Item.TRASH && lostTrash - cleanedTrash > 0) {
          removeInArray<Item>(this.items, item)
          cleanedTrash++
        }
      })
    }

    return needsRecomputingSynergiesAgain
  }

  updateWeatherRocks() {
    const nbWeatherRocks = SynergyTriggers[Synergy.ROCK].filter(
      (n) => (this.synergies.get(Synergy.ROCK) ?? 0) >= n
    ).length

    let weatherRockInInventory
    do {
      weatherRockInInventory = this.items.findIndex((item, index) =>
        WeatherRocks.includes(item)
      )
      if (weatherRockInInventory != -1) {
        this.items.splice(weatherRockInInventory, 1)
      }
    } while (weatherRockInInventory != -1)

    if (nbWeatherRocks > 0) {
      const rocksCollected = this.weatherRocks.slice(-nbWeatherRocks)
      this.items.push(...rocksCollected)
    }
  }

  updateFishingRods() {
    const fishingLevel = SynergyTriggers[Synergy.WATER].filter(
      (n) => (this.synergies.get(Synergy.WATER) ?? 0) >= n
    ).length

    if (this.items.includes(Item.OLD_ROD) && fishingLevel !== 1)
      removeInArray<Item>(this.items, Item.OLD_ROD)
    if (this.items.includes(Item.GOOD_ROD) && fishingLevel !== 2)
      removeInArray<Item>(this.items, Item.GOOD_ROD)
    if (this.items.includes(Item.SUPER_ROD) && fishingLevel !== 3)
      removeInArray<Item>(this.items, Item.SUPER_ROD)

    if (this.items.includes(Item.OLD_ROD) === false && fishingLevel === 1)
      this.items.push(Item.OLD_ROD)
    if (this.items.includes(Item.GOOD_ROD) === false && fishingLevel === 2)
      this.items.push(Item.GOOD_ROD)
    if (this.items.includes(Item.SUPER_ROD) === false && fishingLevel === 3)
      this.items.push(Item.SUPER_ROD)
  }

  updateWildChance() {
    this.wildChance =
      values(this.board)
        .filter((p) => p.types.has(Synergy.WILD))
        .reduce((total, p) => total + p.stars * (1 + p.luck / 100), 0) / 100
  }

  updateRegionalPool(state: GameState, mapChanged: boolean) {
    const newRegionalPokemons = PRECOMPUTED_REGIONAL_MONS.filter((p) =>
      new PokemonClasses[p]().isInRegion(this.map, state)
    )

    if (mapChanged) {
      state.shop.resetRegionalPool(this)
      newRegionalPokemons.forEach((p) => {
        const isVariant = Object.values(PkmRegionalVariants).some((variants) =>
          variants.includes(p)
        )
        if (getPokemonData(p).stars === 1 && !isVariant) {
          state.shop.addRegionalPokemon(p, this)
        }
      })
    }

    newRegionalPokemons.sort(
      (a, b) => getPokemonData(a).stars - getPokemonData(b).stars
    )

    resetArraySchema(
      this.regionalPokemons,
      newRegionalPokemons.filter(
        (p, index, array) =>
          array.findIndex((p2) => PkmFamily[p] === PkmFamily[p2]) === index // dedup same family
      )
    )
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
