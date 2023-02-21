import { Client, Room } from "colyseus"
import { Dispatcher } from "@colyseus/command"
import GameState from "./states/game-state"
import Player from "../models/colyseus-models/player"
import { MapSchema } from "@colyseus/schema"
import UserMetadata from "../models/mongo-models/user-metadata"
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
import { ExpPlace } from "../types/Config"
import { Item, BasicItems } from "../types/enum/Item"
import PokemonFactory from "../models/pokemon-factory"
import EloRank from "elo-rank"
import admin from "firebase-admin"
import DetailledStatistic from "../models/mongo-models/detailled-statistic-v2"
import {
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  IGameMetadata,
  IPokemon,
  Transfer
} from "../types"
import { Pkm, PkmIndex } from "../types/enum/Pokemon"
import PokemonConfig from "../models/colyseus-models/pokemon-config"
import { Synergy } from "../types/enum/Synergy"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { IGameUser } from "../models/colyseus-models/game-user"
import History from "../models/mongo-models/history"
import { components } from "../api-v1/openapi"
import { Title, Role } from "../types"
import PRECOMPUTED_TYPE_POKEMONS from "../models/precomputed/type-pokemons.json"
import BannedUser from "../models/mongo-models/banned-user"
import { pickRandomIn, shuffleArray } from "../utils/random"
import { Rarity } from "../types/enum/Game"

export default class GameRoom extends Room<GameState> {
  dispatcher: Dispatcher<this>
  eloEngine: EloRank
  additionalPokemonsPool: Array<Pkm>
  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
    this.eloEngine = new EloRank()
    this.additionalPokemonsPool = new Array<Pkm>()
  }

  // When room is initialized
  onCreate(options: {
    users: { [key: string]: IGameUser }
    preparationId: string
    name: string
    idToken: string
  }) {
    console.log("create game room")
    this.setMetadata(<IGameMetadata>{
      name: options.name,
      nbPlayers: Object.values(options.users).length,
      stageLevel: 0,
      type: "game"
    })
    // console.log(options);
    this.setState(new GameState(options.preparationId, options.name))
    Object.keys(PRECOMPUTED_TYPE_POKEMONS).forEach((type) => {
      PRECOMPUTED_TYPE_POKEMONS[type].additionalPokemons.forEach((p) => {
        const pokemon = PokemonFactory.createPokemonFromName(p)
        if (!this.additionalPokemonsPool.includes(p) && pokemon.stars === 1) {
          this.additionalPokemonsPool.push(p)
        }
      })
    })
    shuffleArray(this.additionalPokemonsPool)

    this.maxClients = 8
    for (const id in options.users) {
      const user = options.users[id]
      // console.log(user);
      if (user.isBot) {
        const player = new Player(
          user.id,
          user.name,
          user.elo,
          user.avatar,
          true,
          this.state.players.size + 1,
          new Map<string, PokemonConfig>(),
          "",
          Role.BOT,
          this
        )
        this.state.players.set(user.id, player)
        this.state.botManager.addBot(player)
        //this.state.shop.assignShop(player)
      }
    }

    this.onMessage(Transfer.SHOP, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnShopCommand(), {
            id: client.auth.uid,
            index: message.id
          })
        } catch (error) {
          console.log("shop error", message, error)
        }
      }
    })

    this.onMessage(Transfer.ITEM, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnItemCommand(), {
            playerId: client.auth.uid,
            id: message.id
          })
        } catch (error) {
          console.log(error)
        }
      }
    })

    this.onMessage(Transfer.POKEMON_PROPOSITION, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnPokemonPropositionCommand(), {
            playerId: client.auth.uid,
            pkm: message
          })
        } catch (error) {
          console.log(error)
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
          console.log("drag drop error", error)
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
            console.log("drag drop error", error)
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
            console.log("drag drop error", error)
          }
        }
      }
    )

    this.onMessage(
      Transfer.SELL_DROP,
      (client, message: { pokemonId: string }) => {
        if (!this.state.gameFinished) {
          try {
            this.dispatcher.dispatch(new OnSellDropCommand(), {
              client,
              detail: message
            })
          } catch (error) {
            console.log("sell drop error", message)
          }
        }
      }
    )

    this.onMessage(Transfer.REQUEST_TILEMAP, (client, message) => {
      client.send(Transfer.REQUEST_TILEMAP, this.state.tilemap)
    })

    this.onMessage(Transfer.REFRESH, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnRefreshCommand(), client.auth.uid)
        } catch (error) {
          console.log("refresh error", message)
        }
      }
    })

    this.onMessage(Transfer.LOCK, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnLockCommand(), client.auth.uid)
        } catch (error) {
          console.log("lock error", message)
        }
      }
    })

    this.onMessage(Transfer.LEVEL_UP, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnLevelUpCommand(), client.auth.uid)
        } catch (error) {
          console.log("level up error", message)
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

    this.setSimulationInterval((deltaTime: number) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnUpdateCommand(), { deltaTime })
        } catch (error) {
          console.log("update error", error)
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
      console.log(error)
    }
  }

  onJoin(client: Client, options: any, auth: any) {
    this.dispatcher.dispatch(new OnJoinCommand(), { client, options, auth })
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} is leaving`)
      }
      if (consented) {
        throw new Error("consented leave")
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 60)
    } catch (e) {
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} leave game room`)
      }
    }
  }

  onDispose() {
    // console.log(`dispose game room`);
    const requiredStageLevel = process.env.MODE == "dev" ? 0 : 10
    this.state.endTime = Date.now()
    const ps = new Array<components["schemas"]["GameHistory"]>()
    this.state.players.forEach((p) => {
      if (!p.isBot) {
        ps.push(this.transformToSimplePlayer(p))
      }
    })
    History.create({
      id: this.state.preparationId,
      name: this.state.name,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      players: ps
    })

    if (
      this.state.stageLevel >= requiredStageLevel &&
      this.state.elligibleToXP
    ) {
      this.state.players.forEach((player) => {
        if (player.isBot) {
          BOT.find({ id: player.id }, (err, bots) => {
            if (bots) {
              bots.forEach((bot) => {
                bot.elo = Math.max(
                  0,
                  this.computeElo(player, player.rank, player.elo)
                )
                bot.save()
              })
            }
          })
        } else {
          const dbrecord = this.transformToSimplePlayer(player)
          const exp = ExpPlace[player.rank - 1]
          let rank = player.rank

          if (!this.state.gameFinished && player.life != 0) {
            let rankOfLastPlayerAlive = this.state.players.size
            this.state.players.forEach((plyr) => {
              if (plyr.life <= 0) {
                rankOfLastPlayerAlive = Math.min(
                  rankOfLastPlayerAlive,
                  plyr.rank
                )
              }
            })
            rank = rankOfLastPlayerAlive
          }

          UserMetadata.findOne({ uid: player.id }, (err: any, usr: any) => {
            if (err) {
              console.log(err)
            } else {
              const expThreshold = 1000
              if (usr.exp + exp >= expThreshold) {
                usr.level += 1
                usr.booster += 1
                usr.exp = usr.exp + exp - expThreshold
              } else {
                usr.exp = usr.exp + exp
              }
              usr.exp = !isNaN(usr.exp) ? usr.exp : 0
              if (rank == 1) {
                usr.wins += 1
              }

              if (usr.elo) {
                const elo = Math.max(0, this.computeElo(player, rank, usr.elo))
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

                if (player.life === 100 && rank === 1) {
                  player.titles.add(Title.TYRANT)
                }

                if (player.rerollCount > 60) {
                  player.titles.add(Title.GAMBLER)
                }

                if (usr.titles === undefined) {
                  usr.titles = []
                }

                player.titles.forEach((t) => {
                  if (!usr.titles.includes(t)) {
                    console.log("title added ", t)
                    usr.titles.push(t)
                  }
                })
                //console.log(usr);
                // usr.markModified('metadata';
                usr.save()

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
            }
          })
        }
      })
    }
    this.dispatcher.stop()
  }

  transformToSimplePlayer(player: Player) {
    const simplePlayer = {
      name: player.name,
      id: player.id,
      rank: player.rank,
      avatar: player.avatar,
      pokemons: new Array<{
        name: string
        avatar: string
        items: Item[]
        inventory: Item[]
      }>(),
      elo: player.elo,
      title: player.title,
      role: player.role
    }

    player.board.forEach((pokemon: IPokemon) => {
      if (pokemon.positionY != 0) {
        const shinyPad = pokemon.shiny ? "/0000/0001" : ""
        const avatar = `${pokemon.index}${shinyPad}/${pokemon.emotion}`
        const s = {
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

  computeElo(player: Player, rank: number, elo: number) {
    const eloGains = new Array<number>()
    let meanGain = 0
    this.state.players.forEach((plyr) => {
      if (player.name != plyr.name) {
        const expectedScoreA = this.eloEngine.getExpected(elo, plyr.elo)
        if (rank < plyr.rank) {
          eloGains.push(
            this.eloEngine.updateRating(expectedScoreA, 1, player.elo)
          )
        } else {
          eloGains.push(
            this.eloEngine.updateRating(expectedScoreA, 0, player.elo)
          )
        }
      }
    })

    eloGains.forEach((gain) => {
      meanGain += gain
    })
    meanGain = Math.max(0, Math.floor(meanGain / eloGains.length))
    if (rank <= 4 && meanGain < elo) {
      meanGain = elo
    }
    // console.log(eloGains);
    console.log(
      `${player.name} (was ${player.elo}) will be ${meanGain} (${rank})`
    )
    return meanGain
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
          player.opponentName = opponent.name
          player.opponentAvatar = opponent.avatar
          return id
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

  getPokemonByPosition(playerId: string, x: number, y: number) {
    let pkm: IPokemon | undefined
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

  checkProtean(player: Player, pokemon: Pokemon) {
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
    for (let i = 0; i < pokemon.stars; i++) {
      const kv = rankArray.shift()
      if (kv) {
        pokemon.types.push(kv.s)
      }
    }
    player.synergies.update(player.board)
    player.effects.update(player.synergies)
  }

  updateEvolution(id: string) {
    let evolve = false
    const itemsToAdd = new Array<Item>()
    const basicItemsToAdd = new Array<Item>()
    const player = this.state.players.get(id)
    if (!player) return false

    player.board.forEach((pokemon, key) => {
      const count = [...player.board.values()].filter(
        (pkm) => pkm.index === pokemon.index
      ).length

      const pokemonEvolutionName = pokemon.evolution

      if (
        pokemonEvolutionName !== Pkm.DEFAULT &&
        ![Rarity.NEUTRAL, Rarity.HATCH].includes(pokemon.rarity) &&
        count >= 3
      ) {
        let coord: { x: number; y: number } | undefined

        player.board.forEach((pkm, id) => {
          if (pkm.index == pokemon.index) {
            // console.log(pkm.name, pokemon.name)
            if (coord) {
              if (pkm.positionY > coord.y) {
                coord.x = pkm.positionX
                coord.y = pkm.positionY
                // console.log('better coord', coord)
              }
            } else {
              if (pkm.positionX !== -1) {
                coord = { x: pkm.positionX, y: pkm.positionY }
              }

              // console.log('first coord', coord)
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
          // console.log(coord, pokemonEvolved.name)
          pokemonEvolved.positionX = coord.x
          pokemonEvolved.positionY = coord.y
          player.board.set(pokemonEvolved.id, pokemonEvolved)
          evolve = true
        } else {
          console.log("error, no coordinate found for new evolution")
        }
      }
    })

    if (evolve) {
      player.synergies.update(player.board)
      player.effects.update(player.synergies)
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
      if (pokemon.positionY == 0 && pokemon.rarity !== Rarity.NEUTRAL) {
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
    return count >= 2
  }

  getFirstPokemonOnBench(board: MapSchema<Pokemon>): Pokemon | undefined {
    let pkm: Pokemon | undefined = undefined
    let found = false
    board.forEach((pokemon, key) => {
      if (
        pokemon.positionY == 0 &&
        pokemon.rarity != Rarity.NEUTRAL &&
        !found
      ) {
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
}
