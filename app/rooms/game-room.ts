import { Client, Room } from "colyseus"
import { Dispatcher } from "@colyseus/command"
import GameState from "./states/game-state"
import Player from "../models/colyseus-models/player"
import { MapSchema } from "@colyseus/schema"
import UserMetadata, {
  IPokemonConfig,
  IUserMetadata
} from "../models/mongo-models/user-metadata"
import BOT from "../models/mongo-models/bot-v2"
import {
  OnShopCommand,
  OnItemCommand,
  OnSellDropCommand,
  OnRefreshCommand,
  OnLockCommand,
  OnLevelUpCommand,
  OnUpdateCommand,
  OnDragDropCommand,
  OnJoinCommand,
  OnDragDropItemCommand,
  OnDragDropCombineCommand,
  OnPokemonPropositionCommand
} from "./commands/game-commands"
import {
  ExpPlace,
  getEvolutionCountNeeded,
  RequiredStageLevelForXpElligibility
} from "../types/Config"
import { Item, BasicItems } from "../types/enum/Item"
import PokemonFactory from "../models/pokemon-factory"
import EloRank from "elo-rank"
import admin from "firebase-admin"
import DetailledStatistic from "../models/mongo-models/detailled-statistic-v2"
import {
  Emotion,
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  IGameHistoryPokemonRecord,
  IGameHistorySimplePlayer,
  IGameMetadata,
  IPokemon,
  Transfer
} from "../types"
import { TitleName } from "../types/strings/Title"
import { Pkm, PkmFamily, PkmIndex } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { IGameUser } from "../models/colyseus-models/game-user"
import History from "../models/mongo-models/history"
import { components } from "../api-v1/openapi"
import { Title, Role } from "../types"
import PRECOMPUTED_TYPE_POKEMONS from "../models/precomputed/type-pokemons.json"
import BannedUser from "../models/mongo-models/banned-user"
import { coinflip, pickRandomIn, shuffleArray } from "../utils/random"
import { Rarity } from "../types/enum/Game"
import { Weather } from "../types/enum/Weather"
import { FilterQuery } from "mongoose"
import { MiniGame } from "../core/matter/mini-game"
import { logger } from "../utils/logger"
import { computeElo } from "../core/elo"
import { Passive } from "../types/enum/Passive"

export default class GameRoom extends Room<GameState> {
  dispatcher: Dispatcher<this>
  eloEngine: EloRank
  additionalPokemonsPool1: Array<Pkm>
  additionalPokemonsPool2: Array<Pkm>
  miniGame: MiniGame
  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
    this.eloEngine = new EloRank()
    this.additionalPokemonsPool1 = new Array<Pkm>()
    this.additionalPokemonsPool2 = new Array<Pkm>()
    this.miniGame = new MiniGame()
  }

  // When room is initialized
  onCreate(options: {
    users: { [key: string]: IGameUser }
    preparationId: string
    name: string
    idToken: string
    noElo: boolean
  }) {
    logger.trace("create game room")
    this.setMetadata(<IGameMetadata>{
      name: options.name,
      nbPlayers: Object.values(options.users).length,
      stageLevel: 0,
      type: "game"
    })
    // logger.debug(options);
    this.setState(
      new GameState(options.preparationId, options.name, options.noElo)
    )
    this.miniGame.create(this.state.avatars, this.state.floatingItems)
    Object.keys(PRECOMPUTED_TYPE_POKEMONS).forEach((type) => {
      PRECOMPUTED_TYPE_POKEMONS[type].additionalPokemons.forEach((p) => {
        const pokemon = PokemonFactory.createPokemonFromName(p)
        if (
          !this.additionalPokemonsPool1.includes(p) &&
          !this.additionalPokemonsPool2.includes(p) &&
          pokemon.stars === 1
        ) {
          if ([Rarity.COMMON, Rarity.UNCOMMON].includes(pokemon.rarity)) {
            this.additionalPokemonsPool1.push(p)
          } else {
            this.additionalPokemonsPool2.push(p)
          }
        }
      })
    })
    shuffleArray(this.additionalPokemonsPool1)
    shuffleArray(this.additionalPokemonsPool2)

    for (const id in options.users) {
      const user = options.users[id]
      // logger.debug(user);
      if (user.isBot) {
        const player = new Player(
          user.id,
          user.name,
          user.elo,
          user.avatar,
          true,
          this.state.players.size + 1,
          new Map<string, IPokemonConfig>(),
          "",
          Role.BOT,
          this
        )
        this.state.players.set(user.id, player)
        this.state.botManager.addBot(player)
        //this.state.shop.assignShop(player)
      }
    }

    setTimeout(() => {
      this.broadcast(Transfer.LOADING_COMPLETE)
      this.startGame()
    }, 5 * 60 * 1000) // maximum 5 minutes of loading game, game will start no matter what after that

    this.onMessage(Transfer.ITEM, (client, message) => {
      if (!this.state.gameFinished && client.auth) {
        try {
          this.dispatcher.dispatch(new OnItemCommand(), {
            playerId: client.auth.uid,
            id: message.id
          })
        } catch (error) {
          logger.error(error)
        }
      }
    })

    this.onMessage(Transfer.SHOP, (client, message) => {
      if (!this.state.gameFinished && client.auth) {
        try {
          this.dispatcher.dispatch(new OnShopCommand(), {
            id: client.auth.uid,
            index: message.id
          })
        } catch (error) {
          logger.error("shop error", message, error)
        }
      }
    })

    this.onMessage(Transfer.POKEMON_PROPOSITION, (client, message) => {
      if (!this.state.gameFinished && client.auth) {
        try {
          this.dispatcher.dispatch(new OnPokemonPropositionCommand(), {
            playerId: client.auth.uid,
            pkm: message
          })
        } catch (error) {
          logger.error(error)
        }
      }
    })

    this.onMessage(Transfer.DRAG_DROP, (client, message: IDragDropMessage) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnDragDropCommand(), {
            client: client,
            detail: message
          })
        } catch (error) {
          const errorInformation = {
            updateBoard: true,
            updateItems: true
          }
          client.send(Transfer.DRAG_DROP_FAILED, errorInformation)
          logger.error("drag drop error", error)
        }
      }
    })

    this.onMessage(
      Transfer.DRAG_DROP_ITEM,
      (client, message: IDragDropItemMessage) => {
        if (!this.state.gameFinished) {
          try {
            this.dispatcher.dispatch(new OnDragDropItemCommand(), {
              client: client,
              detail: message
            })
          } catch (error) {
            const errorInformation = {
              updateBoard: true,
              updateItems: true
            }
            client.send(Transfer.DRAG_DROP_FAILED, errorInformation)
            logger.error("drag drop error", error)
          }
        }
      }
    )

    this.onMessage(
      Transfer.DRAG_DROP_COMBINE,
      (client, message: IDragDropCombineMessage) => {
        if (!this.state.gameFinished) {
          try {
            this.dispatcher.dispatch(new OnDragDropCombineCommand(), {
              client: client,
              detail: message
            })
          } catch (error) {
            const errorInformation = {
              updateBoard: true,
              updateItems: true
            }
            client.send(Transfer.DRAG_DROP_FAILED, errorInformation)
            logger.error("drag drop error", error)
          }
        }
      }
    )

    this.onMessage(
      Transfer.VECTOR,
      (client, message: { x: number; y: number }) => {
        try {
          if (client.auth) {
            this.miniGame.applyVector(client.auth.uid, message.x, message.y)
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(
      Transfer.SELL_DROP,
      (client, message: { pokemonId: string }) => {
        if (!this.state.gameFinished && client.auth) {
          try {
            this.dispatcher.dispatch(new OnSellDropCommand(), {
              client,
              detail: message
            })
          } catch (error) {
            logger.error("sell drop error", message)
          }
        }
      }
    )

    this.onMessage(Transfer.REQUEST_TILEMAP, (client, message) => {
      client.send(Transfer.REQUEST_TILEMAP, this.state.tilemap)
    })

    this.onMessage(Transfer.REFRESH, (client, message) => {
      if (!this.state.gameFinished && client.auth) {
        try {
          this.dispatcher.dispatch(new OnRefreshCommand(), client.auth.uid)
        } catch (error) {
          logger.error("refresh error", message)
        }
      }
    })

    this.onMessage(Transfer.LOCK, (client, message) => {
      if (!this.state.gameFinished && client.auth) {
        try {
          this.dispatcher.dispatch(new OnLockCommand(), client.auth.uid)
        } catch (error) {
          logger.error("lock error", message)
        }
      }
    })

    this.onMessage(Transfer.LEVEL_UP, (client, message) => {
      if (!this.state.gameFinished && client.auth) {
        try {
          this.dispatcher.dispatch(new OnLevelUpCommand(), client.auth.uid)
        } catch (error) {
          logger.error("level up error", message)
        }
      }
    })

    this.onMessage(
      Transfer.BROADCAST_EMOTE,
      (client: Client, message: string) => {
        if (client.auth) {
          this.broadcast(Transfer.BROADCAST_EMOTE, {
            id: client.auth.uid,
            emote: message
          })
        }
      }
    )

    this.onMessage(Transfer.UNOWN_ENCOUNTER, (client, unownIndex) => {
      try {
        if (client.auth) {
          const DUST_PER_ENCOUNTER = 50
          UserMetadata.findOne(
            { uid: client.auth.uid },
            (err, u: FilterQuery<IUserMetadata>) => {
              const c = u.pokemonCollection.get(unownIndex)
              if (c) {
                c.dust += DUST_PER_ENCOUNTER
              } else {
                u.pokemonCollection.set(unownIndex, {
                  id: unownIndex,
                  emotions: [],
                  shinyEmotions: [],
                  dust: DUST_PER_ENCOUNTER,
                  selectedEmotion: Emotion.NORMAL,
                  selectedShiny: false
                })
              }
              u.save()
            }
          )
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.LOADING_PROGRESS, (client, progress: number) => {
      if (client.auth) {
        const player = this.state.players.get(client.auth.uid)
        if (player) {
          player.loadingProgress = progress
        }
      }
    })

    this.onMessage(Transfer.LOADING_COMPLETE, (client) => {
      if (client.auth) {
        const player = this.state.players.get(client.auth.uid)
        if (player) {
          player.loadingProgress = 100
        }
        if (this.state.gameLoaded) {
          // already started, presumably a user refreshed page and wants to reconnect to game
          client.send(Transfer.LOADING_COMPLETE)
        } else if (
          Array.from(this.state.players.values()).every(
            (player) => player.loadingProgress === 100
          )
        ) {
          this.broadcast(Transfer.LOADING_COMPLETE)
          this.startGame()
        }
      }
    })
  }

  startGame() {
    if (this.state.gameLoaded) return // already started
    this.state.gameLoaded = true
    this.setSimulationInterval((deltaTime: number) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnUpdateCommand(), { deltaTime })
        } catch (error) {
          logger.error("update error", error)
        }
      }
    })
  }

  async onAuth(client: Client, options: any, request: any) {
    try {
      super.onAuth(client, options, request)
      const token = await admin.auth().verifyIdToken(options.idToken)
      const user = await admin.auth().getUser(token.uid)
      const isBanned = await BannedUser.findOne({ uid: user.uid })

      if (!user.displayName) {
        throw "No display name"
      } else if (isBanned) {
        throw "User banned"
      } else {
        return user
      }
    } catch (error) {
      logger.error(error)
    }
  }

  onJoin(client: Client, options: any, auth: any) {
    this.dispatcher.dispatch(new OnJoinCommand(), { client, options, auth })
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      if (client && client.auth && client.auth.displayName) {
        logger.info(`${client.auth.displayName} has been disconnected`)
      }
      if (consented) {
        throw new Error("consented leave")
      }

      // allow disconnected client to reconnect into this room until 3 minutes
      await this.allowReconnection(client, 180)
    } catch (e) {
      if (client && client.auth && client.auth.displayName) {
        logger.info(`${client.auth.displayName} left game`)
        const player = this.state.players.get(client.auth.uid)
        if (
          player &&
          (player.loadingProgress < 100 || this.state.stageLevel < 4)
        ) {
          // if player left game during the loading screen or before stage 4, remove it from the players
          this.state.players.delete(client.auth.uid)
          this.state.players.forEach((player) => {
            player.opponents.delete(client.auth.uid)
          })
          logger.info(
            `${client.auth.displayName} has been removed from players list`
          )
        }
      }
      if (
        Array.from(this.state.players.values()).every(
          (player) => player.loadingProgress === 100
        )
      ) {
        this.broadcast(Transfer.LOADING_COMPLETE)
        this.startGame()
      }
    }
  }

  onDispose() {
    // logger.info(`dispose game room`);
    this.state.endTime = Date.now()
    const players: components["schemas"]["GameHistory"]["players"] = []
    this.state.players.forEach((p) => {
      if (!p.isBot) {
        players.push(this.transformToSimplePlayer(p))
      }
    })
    History.create({
      id: this.state.preparationId,
      name: this.state.name,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      players
    })

    const humans: Player[] = []
    const bots: Player[] = []

    this.state.players.forEach((player) => {
      if (player.isBot) {
        bots.push(player)
      } else {
        humans.push(player)
      }
    })

    const elligibleToXP =
      this.state.players.size >= 2 &&
      this.state.stageLevel >= RequiredStageLevelForXpElligibility
    const elligibleToELO =
      elligibleToXP && !this.state.noElo && humans.length >= 2

    if (elligibleToXP) {
      bots.forEach((player) => {
        BOT.find({ id: player.id }, (err, results) => {
          if (err != null) logger.error(err)
          else if (results) {
            results.forEach((bot) => {
              bot.elo = computeElo(
                this.transformToSimplePlayer(player),
                player.rank,
                bot.elo,
                [...humans, ...bots].map((p) => this.transformToSimplePlayer(p))
              )
              bot.save()
            })
          }
        })
      })

      humans.forEach((player) => {
        const exp = ExpPlace[player.rank - 1]
        let rank = player.rank

        if (!this.state.gameFinished && player.life > 0) {
          let rankOfLastPlayerAlive = this.state.players.size
          this.state.players.forEach((plyr) => {
            if (plyr.life <= 0 && plyr.rank < rankOfLastPlayerAlive) {
              rankOfLastPlayerAlive = plyr.rank
            }
          })
          rank = rankOfLastPlayerAlive
        }

        UserMetadata.findOne({ uid: player.id }, (err: any, usr: any) => {
          if (err) {
            return logger.error(err)
          }
          const expThreshold = 1000
          if (usr.exp + exp >= expThreshold) {
            usr.level += 1
            usr.booster += 1
            usr.exp = usr.exp + exp - expThreshold
          } else {
            usr.exp = usr.exp + exp
          }
          usr.exp = !isNaN(usr.exp) ? usr.exp : 0

          if (rank === 1) {
            usr.wins += 1
          }

          if (usr.level >= 10) {
            player.titles.add(Title.ROOKIE)
            player.titles.add(Title.BOT_BUILDER)
          }
          if (usr.level >= 20) {
            player.titles.add(Title.AMATEUR)
          }
          if (usr.level >= 30) {
            player.titles.add(Title.VETERAN)
          }
          if (usr.level >= 50) {
            player.titles.add(Title.PRO)
          }
          if (usr.level >= 100) {
            player.titles.add(Title.EXPERT)
          }
          if (usr.level >= 150) {
            player.titles.add(Title.ELITE)
          }
          if (usr.level >= 200) {
            player.titles.add(Title.MASTER)
          }
          if (usr.level >= 300) {
            player.titles.add(Title.GRAND_MASTER)
          }

          if (usr.elo && elligibleToELO) {
            const elo = computeElo(
              this.transformToSimplePlayer(player),
              rank,
              usr.elo,
              humans.map((p) => this.transformToSimplePlayer(p))
            )
            if (elo) {
              if (elo > 1100) {
                player.titles.add(Title.GYM_TRAINER)
              }
              if (elo > 1200) {
                player.titles.add(Title.GYM_CHALLENGER)
              }
              if (elo > 1400) {
                player.titles.add(Title.GYM_LEADER)
              }
              usr.elo = elo
            }

            const dbrecord = this.transformToSimplePlayer(player)
            DetailledStatistic.create({
              time: Date.now(),
              name: dbrecord.name,
              pokemons: dbrecord.pokemons,
              rank: dbrecord.rank,
              avatar: dbrecord.avatar,
              playerId: dbrecord.id,
              elo: elo
            })
          }

          if (player.life === 100 && rank === 1) {
            player.titles.add(Title.TYRANT)
          }
          if (player.life === 1 && rank === 1) {
            player.titles.add(Title.SURVIVOR)
          }

          if (player.rerollCount > 60) {
            player.titles.add(Title.GAMBLER)
          }

          if (usr.titles === undefined) {
            usr.titles = []
          }

          player.titles.forEach((t) => {
            if (!usr.titles.includes(t)) {
              logger.info("title added ", t)
              usr.titles.push(t)
            }
          })
          //logger.debug(usr);
          //usr.markModified('metadata');
          usr.save()
        })
      })
    }
    this.dispatcher.stop()
  }

  transformToSimplePlayer(player: Player): IGameHistorySimplePlayer {
    const simplePlayer: IGameHistorySimplePlayer = {
      name: player.name,
      id: player.id,
      rank: player.rank,
      avatar: player.avatar,
      pokemons: new Array<{
        name: Pkm
        avatar: string
        items: Item[]
        inventory: Item[]
      }>(),
      elo: player.elo,
      synergies: [],
      title: player.title,
      role: player.role
    }

    player.synergies.forEach((v, k) => {
      simplePlayer.synergies.push({ name: k as Synergy, value: v })
    })

    player.board.forEach((pokemon: IPokemon) => {
      if (pokemon.positionY != 0) {
        const shinyPad = pokemon.shiny ? "/0000/0001" : ""
        const avatar = `${pokemon.index}${shinyPad}/${pokemon.emotion}`
        const s: IGameHistoryPokemonRecord = {
          name: pokemon.name,
          avatar: avatar,
          items: new Array<Item>(),
          inventory: new Array<Item>()
        }
        pokemon.items.forEach((i) => {
          s.items.push(i)
          s.inventory.push(i)
        })
        simplePlayer.pokemons.push(s)
      }
    })
    return simplePlayer
  }

  computeRandomOpponent(playerId: string) {
    const player = this.state.players.get(playerId)
    if (player) {
      this.state.players.forEach((p) => {
        if (player.id !== p.id) {
          if (!player.opponents.has(p.id) && p.alive) {
            player.opponents.set(p.id, 0)
          }
          if (player.opponents.has(p.id) && !p.alive) {
            player.opponents.delete(p.id)
          }
        }
      })
      const sortArray = Array.from(player.opponents)
      sortArray.sort((a, b) => {
        return a[1] - b[1]
      })

      if (sortArray.length > 0) {
        const min = sortArray[0][1]
        const potentials = sortArray.filter((o) => o[1] === min)
        const potential = pickRandomIn(potentials)
        const id = potential[0]
        const opponent = this.state.players.get(id)
        if (opponent) {
          player.opponents.set(id, this.state.stageLevel)
          player.opponentId = id
          player.opponentName = opponent.name
          player.opponentAvatar = opponent.avatar
          player.opponentTitle = TitleName[opponent.title] ?? ""
          return id
        } else {
          logger.error(
            "ERROR, no opponent found. Players size:",
            this.state.players.size
          )
          logger.error("ERROR, sortArray =")
          sortArray.forEach((p) => logger.error(p))
          logger.error("ERROR, potentials = ")
          potentials.forEach((p) => logger.error(p))
          logger.error("ERROR, potentail = ", potential)
          logger.error("ERROR, id", id)
          logger.error("ERROR", opponent)
          this.state.players.forEach((player) => {
            logger.error(player.id, player.name, player.alive)
            logger.error(player.opponents)
          })
        }
        else{
          logger.error("ERROR, no opponent found. Players size:", this.state.players.size)
          logger.error("ERROR, sortArray =")
          sortArray.forEach((p) => logger.error(p))
          logger.error("ERROR, potentials = ")
          potentials.forEach((p) => logger.error(p))
          logger.error("ERROR, potentail = ", potential)
          logger.error("ERROR, id", id)
          logger.error("ERROR", opponent)
          this.state.players.forEach((player) => {
            logger.error(player.id, player.name, player.alive)
            logger.error(player.opponents)
          })
        }
      }
    }
  }

  swap(playerId: string, pokemon: IPokemon, x: number, y: number) {
    const pokemonToSwap = this.getPokemonByPosition(playerId, x, y)
    if (pokemonToSwap) {
      pokemonToSwap.positionX = pokemon.positionX
      pokemonToSwap.positionY = pokemon.positionY
    }
    pokemon.positionX = x
    pokemon.positionY = y
  }

  getPokemonByPosition(
    playerId: string,
    x: number,
    y: number
  ): Pokemon | undefined {
    let pkm: Pokemon | undefined
    const player = this.state.players.get(playerId)
    if (player) {
      player.board.forEach((pokemon, key) => {
        if (pokemon.positionX == x && pokemon.positionY == y) {
          pkm = pokemon
        }
      })
      return pkm
    }
  }

  isPositionEmpty(playerId: string, x: number, y: number) {
    let empty = true
    const player = this.state.players.get(playerId)
    if (player) {
      player.board.forEach((pokemon, key) => {
        if (pokemon.positionX == x && pokemon.positionY == y) {
          empty = false
        }
      })
    }
    return empty
  }

  getFirstAvailablePositionInBench(playerId: string) {
    for (let i = 0; i < 8; i++) {
      if (this.isPositionEmpty(playerId, i, 0)) {
        return i
      }
    }
  }

  getFirstAvailablePositionInTeam(playerId: string) {
    for (let x = 0; x < 8; x++) {
      for (let y = 1; y < 4; y++) {
        if (this.isPositionEmpty(playerId, x, y)) {
          return [x, y]
        }
      }
    }
  }

  checkDynamicSynergies(player: Player, pokemon: Pokemon) {
    const n =
      pokemon.passive === Passive.PROTEAN3
        ? 3
        : pokemon.passive === Passive.PROTEAN2
        ? 2
        : 1
    const rankArray = new Array<{ s: Synergy; v: number }>()
    player.synergies.forEach((value, key) => {
      if (value > 0) {
        rankArray.push({ s: key as Synergy, v: value })
      }
    })
    rankArray.sort((a, b) => {
      return b.v - a.v
    })
    while (pokemon.types.length > 0) {
      pokemon.types.pop()
    }
    for (let i = 0; i < n; i++) {
      const kv = rankArray.shift()
      if (kv) {
        pokemon.types.push(kv.s)
      }
    }
    player.synergies.update(player.board)
    player.effects.update(player.synergies, player.board)
  }

  updateEvolution(playerId: string) {
    let evolve = false
    const itemsToAdd = new Array<Item>()
    const basicItemsToAdd = new Array<Item>()
    const player = this.state.players.get(playerId)
    if (!player) return false

    player.board.forEach((pokemon, key) => {
      const count = [...player.board.values()].filter(
        (pkm) => pkm.index === pokemon.index
      ).length

      let pokemonEvolutionName = pokemon.evolution

      if (
        pokemonEvolutionName !== Pkm.DEFAULT &&
        pokemon.rarity !== Rarity.HATCH &&
        count >= getEvolutionCountNeeded(pokemon.name)
      ) {
        let coord: { x: number; y: number } | undefined

        if (pokemon.name === Pkm.POLIWHIRL) {
          if (
            Math.max(
              ...[...player.board.values()]
                .filter((pkm) => pkm.index === pokemon.index)
                .map((v) => v.positionY)
            ) === 3
          ) {
            pokemonEvolutionName = Pkm.POLIWRATH
          } else {
            pokemonEvolutionName = Pkm.POLITOED
          }
        }

        if (pokemon.name === Pkm.CLAMPERL) {
          if (
            Math.max(
              ...[...player.board.values()]
                .filter((pkm) => pkm.index === pokemon.index)
                .map((v) => v.positionY)
            ) === 3
          ) {
            pokemonEvolutionName = Pkm.HUNTAIL
          } else {
            pokemonEvolutionName = Pkm.GOREBYSS
          }
        }

        if (pokemon.name === Pkm.WURMPLE) {
          const lastWeather = player.getLastBattle()?.weather ?? Weather.NEUTRAL
          let existingSecondTier: Pkm | null = null
          player.board.forEach((pkm) => {
            if (pkm.name === Pkm.CASCOON) existingSecondTier = Pkm.CASCOON
            else if (pkm.name === Pkm.SILCOON) existingSecondTier = Pkm.SILCOON
          })
          if (existingSecondTier !== null) {
            pokemonEvolutionName = existingSecondTier
          } else if (
            [
              Weather.NIGHT,
              Weather.STORM,
              Weather.SANDSTORM,
              Weather.SNOW
            ].includes(lastWeather)
          ) {
            pokemonEvolutionName = Pkm.CASCOON
          } else if (
            [Weather.SUN, Weather.RAIN, Weather.MISTY, Weather.WINDY].includes(
              lastWeather
            )
          ) {
            pokemonEvolutionName = Pkm.SILCOON
          } else {
            pokemonEvolutionName = coinflip() ? Pkm.CASCOON : Pkm.SILCOON
          }
        }

        player.board.forEach((pkm, id) => {
          if (pkm.index == pokemon.index) {
            // logger.debug(pkm.name, pokemon.name)
            if (coord) {
              if (pkm.positionY > coord.y) {
                coord.x = pkm.positionX
                coord.y = pkm.positionY
                // logger.debug('better coord', coord)
              }
            } else {
              if (pkm.positionX !== -1) {
                coord = { x: pkm.positionX, y: pkm.positionY }
              }

              // logger.debug('first coord', coord)
            }

            pkm.items.forEach((el) => {
              if (BasicItems.includes(el)) {
                basicItemsToAdd.push(el)
              } else {
                itemsToAdd.push(el)
              }
            })
            player.board.delete(id)
          }
        })
        const pokemonEvolved = PokemonFactory.createPokemonFromName(
          pokemonEvolutionName,
          player.pokemonCollection.get(PkmIndex[pokemonEvolutionName])
        )
        for (let i = 0; i < 3; i++) {
          const itemToAdd = itemsToAdd.pop()
          if (itemToAdd) {
            if (pokemonEvolved.items.has(itemToAdd)) {
              player.items.add(itemToAdd)
            } else {
              pokemonEvolved.items.add(itemToAdd)
            }
          }
        }
        itemsToAdd.forEach((item) => {
          player.items.add(item)
        })
        basicItemsToAdd.forEach((item) => {
          player.items.add(item)
        })
        if (coord) {
          // logger.debug(coord, pokemonEvolved.name)
          pokemonEvolved.positionX = coord.x
          pokemonEvolved.positionY = coord.y
          player.board.set(pokemonEvolved.id, pokemonEvolved)
          evolve = true
        } else {
          logger.error("no coordinate found for new evolution")
        }
      }
    })

    if (evolve) {
      player.synergies.update(player.board)
      player.effects.update(player.synergies, player.board)
    }
    player.boardSize = this.getTeamSize(player.board)

    return evolve
  }

  getNumberOfPlayersAlive(players: MapSchema<Player>) {
    let numberOfPlayersAlive = 0
    players.forEach((player, key) => {
      if (player.alive) {
        numberOfPlayersAlive++
      }
    })
    return numberOfPlayersAlive
  }

  getBenchSize(board: MapSchema<Pokemon>) {
    let boardSize = 0

    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0) {
        boardSize++
      }
    })

    return boardSize
  }

  getBenchSizeWithoutNeutral(board: MapSchema<Pokemon>) {
    let boardSize = 0

    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0 && pokemon.canBePlaced) {
        boardSize++
      }
    })

    return boardSize
  }

  getPossibleEvolution(board: MapSchema<Pokemon>, name: Pkm) {
    let count = 0

    board.forEach((pokemon, key) => {
      if (pokemon.name == name && pokemon.evolution != Pkm.DEFAULT) {
        count++
      }
    })
    return count >= getEvolutionCountNeeded(name) - 1
  }

  getFirstPlaceablePokemonOnBench(
    board: MapSchema<Pokemon>
  ): Pokemon | undefined {
    let pkm: Pokemon | undefined = undefined
    let found = false
    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0 && pokemon.canBePlaced && !found) {
        found = true
        pkm = pokemon
      }
    })
    return pkm
  }

  getTeamSize(board: MapSchema<Pokemon>) {
    let size = 0

    board.forEach((pokemon, key) => {
      if (pokemon.positionY != 0) {
        size++
      }
    })

    return size
  }

  updateCastform(weather: Weather) {
    let newForm: Pkm = Pkm.CASTFORM
    if (weather === Weather.SNOW) {
      newForm = Pkm.CASTFORM_HAIL
    } else if (weather === Weather.RAIN) {
      newForm = Pkm.CASTFORM_RAIN
    } else if (weather === Weather.SUN) {
      newForm = Pkm.CASTFORM_SUN
    }

    this.state.players.forEach((player) => {
      player.board.forEach((pokemon, id) => {
        if (
          PkmFamily[pokemon.name] === PkmFamily[Pkm.CASTFORM] &&
          pokemon.name !== newForm
        ) {
          const newPokemon = PokemonFactory.createPokemonFromName(
            newForm,
            player.pokemonCollection.get(PkmIndex[newForm])
          )
          pokemon.items.forEach((item) => {
            newPokemon.items.add(item)
          })
          newPokemon.positionX = pokemon.positionX
          newPokemon.positionY = pokemon.positionY
          player.board.delete(id)
          player.board.set(newPokemon.id, newPokemon)
          player.synergies.update(player.board)
          player.effects.update(player.synergies, player.board)
        }
      })
    })
  }
}
