import { Client, Room } from 'colyseus'
import {Dispatcher} from '@colyseus/command'
import GameState from './states/game-state'
import Player from '../models/colyseus-models/player'
import {MapSchema} from '@colyseus/schema'
import UserMetadata from '../models/mongo-models/user-metadata'
import BOT from '../models/mongo-models/bot-v2'
import {OnShopCommand, OnItemCommand, OnSellDropCommand, OnRefreshCommand, OnLockCommand, OnLevelUpCommand, OnUpdateCommand, OnDragDropCommand, OnJoinCommand, OnDragDropItemCommand, OnDragDropCombineCommand} from './commands/game-commands'
import { ExpPlace } from '../types/Config'
import { Item, BasicItems } from '../types/enum/Item'
import PokemonFactory from '../models/pokemon-factory'
import EloRank from 'elo-rank'
import admin from 'firebase-admin'
import DetailledStatistic from '../models/mongo-models/detailled-statistic-v2'
import { IDragDropCombineMessage, IDragDropItemMessage, IDragDropMessage, IPlayer, IPokemon, Transfer } from '../types'
import {Pkm, PkmIndex} from '../types/enum/Pokemon'
import PokemonConfig from '../models/colyseus-models/pokemon-config'
import { Synergy } from '../types/enum/Synergy'
import { Pokemon } from '../models/colyseus-models/pokemon'
import { IGameUser } from '../models/colyseus-models/game-user'
import History from '../models/mongo-models/history'
import { components } from '../api-v1/openapi'

export default class GameRoom extends Room<GameState> {
  dispatcher: Dispatcher<this>
  eloEngine: EloRank
  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
    this.eloEngine = new EloRank()
  }

  // When room is initialized
  onCreate(options: {users: {[key: string]: IGameUser}, preparationId: string, name: string, idToken: string}) {
    console.log('create game room')
    // console.log(options);
    this.setState(new GameState(options.preparationId, options.name))
    this.maxClients = 8
    for (const id in options.users) {
      const user = options.users[id]
      // console.log(user);
      if (user.isBot) {
        const player = new Player(user.id, user.name, user.elo, user.avatar, true, this.state.players.size + 1, new Map<string,PokemonConfig>())
        this.state.players.set(user.id, player)
        this.state.botManager.addBot(player)
        this.state.shop.assignShop(player)
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
          console.log('shop error', message, error)
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

    this.onMessage(Transfer.DRAG_DROP, (client, message: IDragDropMessage) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnDragDropCommand(), {
            client: client,
            detail: message
          })
        } catch (error) {
          const errorInformation = {
            'updateBoard': true,
            'updateItems': true
          }
          client.send(Transfer.DRAG_DROP_FAILED, errorInformation)
          console.log('drag drop error', error)
        }
      }
    })

    this.onMessage(Transfer.DRAG_DROP_ITEM, (client, message: IDragDropItemMessage) => {
        if (!this.state.gameFinished) {
          try {
            this.dispatcher.dispatch(new OnDragDropItemCommand(), {
              client: client,
              detail: message
            })
          } catch (error) {
            const errorInformation = {
              'updateBoard': true,
              'updateItems': true
            }
            client.send(Transfer.DRAG_DROP_FAILED, errorInformation)
            console.log('drag drop error', error)
          }
        }
      })

      this.onMessage(Transfer.DRAG_DROP_COMBINE, (client, message: IDragDropCombineMessage) => {
        if (!this.state.gameFinished) {
          try {
            this.dispatcher.dispatch(new OnDragDropCombineCommand(), {
              client: client,
              detail: message
            })
          } catch (error) {
            const errorInformation = {
              'updateBoard': true,
              'updateItems': true
            }
            client.send(Transfer.DRAG_DROP_FAILED, errorInformation)
            console.log('drag drop error', error)
          }
        }
      })

    this.onMessage(Transfer.SELL_DROP, (client, message: {pokemonId: string}) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnSellDropCommand(), {
            client,
            detail: message
          })
        } catch (error) {
          console.log('sell drop error', message)
        }
      }
    })

    this.onMessage(Transfer.REQUEST_TILEMAP, (client, message)=>{
      client.send(Transfer.REQUEST_TILEMAP, this.state.tilemap)
    })

    this.onMessage(Transfer.REFRESH, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnRefreshCommand(), client.auth.uid)
        } catch (error) {
          console.log('refresh error', message)
        }
      }
    })

    this.onMessage(Transfer.LOCK, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnLockCommand(), client.auth.uid)
        } catch (error) {
          console.log('lock error', message)
        }
      }
    })

    this.onMessage(Transfer.LEVEL_UP, (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnLevelUpCommand(), client.auth.uid)
        } catch (error) {
          console.log('level up error', message)
        }
      }
    })

    this.onMessage(Transfer.BROADCAST_EMOTE, (client: Client, message: string) => {
      if(client.auth){
        this.broadcast(Transfer.BROADCAST_EMOTE, {id: client.auth.uid, emote: message})
      }
    })

    this.setSimulationInterval((deltaTime: number) =>{
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new OnUpdateCommand(), {deltaTime})
        } catch (error) {
          console.log('update error', error)
        }
      }
    })
  }

  async onAuth(client: Client, options: any, request: any) {
    const token = await admin.auth().verifyIdToken(options.idToken)
    const user = await admin.auth().getUser(token.uid)
    return user
  }

  onJoin(client: Client, options: any, auth: any) {
    this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth})
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} is leaving`)
      }
      if (consented) {
        throw new Error('consented leave')
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
    const requiredStageLevel = process.env.MODE == 'dev' ? 0: 10
    this.state.endTime = Date.now()
    const ps = new Array<components['schemas']['GameHistory']>()
    this.state.players.forEach(p=> {
      if(!p.isBot){
        ps.push(this.transformToSimplePlayer(p)
        )
      }
    })
    History.create({
      id: this.state.preparationId,
      name: this.state.name,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      players: ps
    })

    if (this.state.stageLevel >= requiredStageLevel && this.state.elligibleToXP) {
      this.state.players.forEach((player) =>{
        if (player.isBot) {
          BOT.find({'avatar': player.id}, (err, bots)=>{
            if (bots) {
              bots.forEach((bot) =>{
                bot.elo = Math.max(0, this.computeElo(player, player.rank, player.elo))
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
            this.state.players.forEach((plyr) =>{
              if (plyr.life <= 0) {
                rankOfLastPlayerAlive = Math.min(rankOfLastPlayerAlive, plyr.rank)
              }
            })
            rank = rankOfLastPlayerAlive
          }

          UserMetadata.findOne({uid: player.id}, (err: any, usr: any)=> {
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
              if (rank == 1) {
                usr.wins += 1
              }

              if (usr.elo) {
                const elo = Math.max(0, this.computeElo(player, rank, usr.elo))
                if (elo) {
                  usr.elo = elo
                }
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
      pokemons: new Array<{name: string, avatar: string, items: Item[], inventory: Item[]}>(),
      elo: player.elo
    }

    player.board.forEach((pokemon: IPokemon) => {
      if (pokemon.positionY != 0) {
        const shinyPad = pokemon.shiny ? '/0000/0001' : '' 
        const avatar = `${pokemon.index}${shinyPad}/${pokemon.emotion}`
        const s = {
          name: pokemon.name,
          avatar: avatar,
          items: new Array<Item>(),
          inventory: new Array<Item>()
        }
        pokemon.items.forEach((i)=>{
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
    this.state.players.forEach((plyr) =>{
      if (player.name != plyr.name) {
        const expectedScoreA = this.eloEngine.getExpected(elo, plyr.elo)
        if (rank < plyr.rank) {
          eloGains.push(this.eloEngine.updateRating(expectedScoreA, 1, player.elo))
        } else {
          eloGains.push(this.eloEngine.updateRating(expectedScoreA, 0, player.elo))
        }
      }
    })

    eloGains.forEach((gain) => {
      meanGain += gain
    })
    meanGain = Math.max(0,Math.floor(meanGain / eloGains.length))
    if (rank <= 4 && meanGain < elo) {
      meanGain = elo
    }
    // console.log(eloGains);
    console.log(`${player.name} (was ${player.elo}) will be ${meanGain} (${rank})`)
    return meanGain
  }

  computeRandomOpponent(playerId: string) {
    const player = this.state.players.get(playerId)
    if(player){
      this.checkOpponents(playerId)
      if (player.opponents.length == 0) {
        this.fillOpponents(playerId)
      }
      if (player.opponents.length > 0) {
        const id = player.opponents.pop()
        if(id){
          const opponent = this.state.players.get(id)
          if(opponent){
            player.opponentName = opponent.name
            player.opponentAvatar = opponent.avatar
            return id
          }
        }
      }
    }
  }

  checkOpponents(playerId: string) {
    const player = this.state.players.get(playerId)
    const indexToDelete = new Array<number>()
    if(player){
      player.opponents.forEach((p: string, i: number) =>{
        const opponent = this.state.players.get(p)
        if (opponent && !opponent.alive) {
          indexToDelete.push(i)
        }
      })
      indexToDelete.forEach((index) =>{
        player.opponents.splice(index, 1)
      })
    }
  }

  fillOpponents(playerId: string) {
    const player = this.state.players.get(playerId)
    if(player){
      this.state.players.forEach((plyr: Player, key: string) =>{
        if (plyr.alive && player.id != plyr.id) {
          player.opponents.push(key)
        }
      })
      player.opponents.sort(() => Math.random() - 0.5)
    }
  }

  swap(playerId: string, pokemon: IPokemon, x: number, y: number) {
    const pokemonToSwap = this.getPokemonByPosition(playerId, x, y)
    if(pokemonToSwap){
      pokemonToSwap.positionX = pokemon.positionX
      pokemonToSwap.positionY = pokemon.positionY
    }
    pokemon.positionX = x
    pokemon.positionY = y
  }


  getPokemonByPosition(playerId: string, x: number, y: number) {
    let pkm: IPokemon | undefined
    const player = this.state.players.get(playerId)
    if(player){
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
    if(player){
      player.board.forEach((pokemon, key) => {
        if (pokemon.positionX == x && pokemon.positionY == y) {
          empty = false
        }
      })
    }
    return empty
  }

  getFirstAvailablePositionInBoard(playerId: string) {
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

  updateEvolution(id: string) {
    let evolve = false
    const itemsToAdd = new Array<Item>()
    const basicItemsToAdd = new Array<Item>()
    const player = this.state.players.get(id)
    if(player){
      player.board.forEach((pokemon, key) => {
        let count = 0
        const pokemonEvolutionName = pokemon.evolution
  
        if (pokemonEvolutionName !== Pkm.DEFAULT && pokemon.name !== Pkm.DITTO) {
          player.board.forEach((pkm, id) => {
            if ( pkm.index == pokemon.index) {
              count += 1
            }
          })
  
          if (count == 3) {
            let coord: {x: number, y: number} | undefined
  
            player.board.forEach((pkm, id) => {
              if (pkm.index == pokemon.index) {
                // console.log(pkm.name, pokemon.name)
                if (coord) {
                    if(pkm.positionY >= coord.y){
                        coord.x = pkm.positionX
                        coord.y = pkm.positionY
                        // console.log('better coord', coord)
                    }
                }
                else {
                    coord = {x: pkm.positionX, y: pkm.positionY}
                    // console.log('first coord', coord)
                }
  
                pkm.items.forEach((el)=>{
                  if (BasicItems.includes(el)) {
                    basicItemsToAdd.push(el)
                  } else {
                    itemsToAdd.push(el)
                  }
                })
                player.board.delete(id)
              }
            })
            const pokemonEvolved = PokemonFactory.createPokemonFromName(pokemonEvolutionName, player.pokemonCollection.get(PkmIndex[pokemonEvolutionName]))
            for (let i = 0; i < 3; i++) {
              const itemToAdd = itemsToAdd.pop()
              if (itemToAdd) {
                if (pokemonEvolved.items.has(itemToAdd)) {
                  player.items.add(itemToAdd)
                } else {
                  pokemonEvolved.items.add(itemToAdd)
                  switch (itemToAdd) {
                    case Item.WATER_STONE:
                      pokemonEvolved.types.push(Synergy.WATER)
                      break
                    case Item.FIRE_STONE:
                      pokemonEvolved.types.push(Synergy.FIRE)
                      break
                    case Item.THUNDER_STONE:
                      pokemonEvolved.types.push(Synergy.ELECTRIC)
                      break
                    case Item.DUSK_STONE:
                      pokemonEvolved.types.push(Synergy.DARK)
                      break
                    case Item.MOON_STONE:
                      pokemonEvolved.types.push(Synergy.FAIRY)
                      break
                    case Item.LEAF_STONE:
                      pokemonEvolved.types.push(Synergy.GRASS)
                      break
                    case Item.DAWN_STONE:
                      pokemonEvolved.types.push(Synergy.PSYCHIC)
                      break
                    case Item.ICY_ROCK:
                      pokemonEvolved.types.push(Synergy.ICE)
                      break
                    case Item.OLD_AMBER:
                      pokemonEvolved.types.push(Synergy.FOSSIL)
                      break
                  }
                }
              }
            }
            itemsToAdd.forEach( (item) =>{
              player.items.add(item)
            })
            basicItemsToAdd.forEach( (item)=>{
              player.items.add(item)
            })
            if(coord){
                // console.log(coord, pokemonEvolved.name)
                pokemonEvolved.positionX = coord.x
                pokemonEvolved.positionY = coord.y
                player.board.set(pokemonEvolved.id, pokemonEvolved)
                evolve = true
            }
            else{
                console.log('error, no coordinate found for new evolution')
            }
          }
        }
      })
  
      if (evolve) {
        player.synergies.update(player.board)
        player.effects.update(player.synergies)
      }
      player.boardSize = this.getTeamSize(player.board)
    }

    return evolve
  }

  getNumberOfPlayersAlive(players :MapSchema<Player>) {
    let numberOfPlayersAlive = 0
    players.forEach((player, key) => {
      if (player.alive) {
        numberOfPlayersAlive ++
      }
    })
    return numberOfPlayersAlive
  }

  getBoardSize(board: MapSchema<Pokemon>) {
    let boardSize = 0

    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0) {
        boardSize ++
      }
    })

    return boardSize
  }

  getBoardSizeWithoutDitto(board: MapSchema<Pokemon>) {
    let boardSize = 0

    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0 && pokemon.name != Pkm.DITTO) {
        boardSize ++
      }
    })

    return boardSize
  }

  getPossibleEvolution(board: MapSchema<Pokemon>, name: Pkm) {
    let count = 0

    board.forEach((pokemon, key) => {
      if (pokemon.name == name && pokemon.evolution != Pkm.DEFAULT) {
        count ++
      }
    })
    return (count >= 2)
  }

  getFirstPokemonOnBench(board: MapSchema<Pokemon>): Pokemon|undefined  {
    let pkm: Pokemon | undefined = undefined
    let found = false
    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0 && pokemon.name != Pkm.DITTO && !found) {
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
        size ++
      }
    })

    return size
  }
}