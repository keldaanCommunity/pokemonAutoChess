import GameScene from './scenes/game-scene'
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js'
import {transformCoordinate} from '../pages/utils/utils'
import Phaser from 'phaser'
import Player from '../../../models/colyseus-models/player'
import { Room } from 'colyseus.js'
import GameState from '../../../rooms/states/game-state'
import {Pokemon} from '../../../models/colyseus-models/pokemon'
import {DataChange} from '@colyseus/schema'
import { CDN_PORTRAIT_URL, Emotion, IDragDropCombineMessage, IDragDropItemMessage, IDragDropMessage, IPlayer, IPokemon, IPokemonEntity, Transfer } from '../../../types'
import PokemonEntity from '../../../core/pokemon-entity'
import { Item } from '../../../types/enum/Item'
import { DesignTiled } from '../../../core/design'
import { Pkm } from '../../../types/enum/Pokemon'
import { toast } from 'react-toastify'
import React from 'react'
import { IPokemonConfig } from '../../../models/mongo-models/user-metadata'

class GameContainer {
  room: Room<GameState>
  div: HTMLDivElement
  game: Phaser.Game | undefined
  player: Player | undefined
  tilemap: DesignTiled | undefined
  uid: string
  constructor(div: HTMLDivElement, uid: string, room: Room<GameState>) {
    this.room = room
    this.div = div
    this.game = undefined
    this.player = undefined
    this.tilemap = undefined
    this.uid = uid
    this.initializeEvents()
  }

  initializeGame() {
    // Create Phaser game
    const config = {
      type: Phaser.CANVAS,
      width: 2000,
      height: 1000,
      parent: this.div,
      pixelArt: true,
      scene: GameScene,
      scale: {mode: Phaser.Scale.FIT},
      dom: {
        createContainer: true
      },
      plugins: {
        global: [{
          key: 'rexMoveTo',
          plugin: MoveToPlugin,
          start: true
        }]
      }
    }
    this.game = new Phaser.Game(config)
    this.game.scene.start('gameScene', {room: this.room, tilemap: this.tilemap})
  }

  initializeEvents() {
    this.room.onMessage(Transfer.DRAG_DROP_FAILED, (message) => this.handleDragDropFailed(message))
    this.room.onError((err) => console.log('room error', err))
  }

  setTilemap(tilemap) {
    this.tilemap = tilemap
    if (this.player) {
      // console.log('setTilemap', this.player, this.tilemap);
      this.initializeGame()
    }
  }

  initializePlayer(player: Player) {
    // //console.log(player);
    if (this.uid == player.id) {
      this.player = player
      if (this.tilemap) {
        // console.log('initializePlayer', this.player, this.tilemap);
        this.initializeGame()
      }
    }

    player.board.onAdd = ((pokemon, key) => {
      const p = <Pokemon> pokemon
      if(p.stars > 1){
        const config: IPokemonConfig|undefined = player.pokemonCollection.get(pokemon.index)
        let emotion: Emotion = Emotion.NORMAL
        let shinyPad = ''
        if(config && config.selectedEmotion){
            emotion = config.selectedEmotion
            shinyPad = config.selectedShiny ? '/0000/0001' : ''
        }
        const i = React.createElement('img',{src: `${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}${shinyPad}/${emotion}.png`}, null)
        toast(i,{containerId: player.rank.toString()})
      }
      p.onChange = (changes: DataChange<any>[]) => {
        changes.forEach((change) => {
          this.handleBoardPokemonChange(player, p, change)
        })
      }

      p.items.onAdd = ((value, key) => {
        // console.log('added', value, key)
        this.handleBoardPokemonItemAdd(player.id, value, p)
      })
      p.items.onRemove = ((value, key) => {
        // console.log('removed', value, key)
        this.handleBoardPokemonItemRemove(player.id, value, p)
      })

      this.handleBoardPokemonAdd(player, p)
    }).bind(this)

    player.board.onRemove = ((pokemon, key) => {
      this.handleBoardPokemonRemove(player, pokemon)
    }).bind(this)

    player.items.onAdd = ((value, key) => {
      // console.log('added', value, key);
      this.handleItemAdd(player, value)
    })

    player.items.onRemove = ((value, key) => {
      // console.log('removed', value, key);
      this.handleItemRemove(player, value)
    })


    player.simulation.onChange = ((changes: DataChange<any>[]) => {
      if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene') != null) {
        changes.forEach((change) =>{
          // console.log('simulation change ', change.field, change.value);
          if (change.field == 'climate') {
            this.handleClimateChange(change, player)
          }
        })
      }
    })

    player.simulation.blueTeam.onAdd = (p, key) => {
      // console.log('add pokemon');
      const pokemon = <PokemonEntity> p
      this.handlePokemonAdd(player.id, pokemon)

      pokemon.status.onChange = (changes: DataChange<any>[]) =>{
        changes.forEach((change) => {
          this.handlePokemonStatusChange(player.id, change, pokemon)
        })
      }

      pokemon.onChange = (changes: DataChange<any>[]) => {
        // console.log('change pokemon');
        changes.forEach((change) => {
          // console.log(change.field);
          this.handlePokemonChange(player.id, change, pokemon)
        })
      }

      pokemon.items.onAdd = ((value, key) => {
        // console.log('added', value, key)
        this.handleBattleManagerPokemonItemAdd(player.id, value, pokemon)
      })
      pokemon.items.onRemove = ((value, key) => {
        // console.log('removed', value, key)
        this.handleBattleManagerPokemonItemRemove(player.id, value, pokemon)
      })

      pokemon.count.onChange = (changes: DataChange<any>[]) => {
        // console.log('change item');
        changes.forEach((change) => {
          this.handlePokemonCountChange(player.id, change, pokemon)
        })
      }
    }

    player.simulation.redTeam.onAdd = (p, key) => {
      // console.log('add pokemon');
      const pokemon = <PokemonEntity> p
      this.handlePokemonAdd(player.id, pokemon)

      pokemon.status.onChange = (changes) =>{
        changes.forEach((change) => {
          this.handlePokemonStatusChange(player.id, change, pokemon)
        })
      }

      pokemon.onChange = (changes: DataChange<any>[]) => {
        // console.log('change pokemon');
        changes.forEach((change) => {
          this.handlePokemonChange(player.id, change, pokemon)
        })
      }
      pokemon.items.onAdd = ((value, key) => {
        // console.log('added', value, key)
        this.handleBattleManagerPokemonItemAdd(player.id, value, pokemon)
      })
      pokemon.items.onRemove = ((value, key) => {
        // console.log('removed', value, key)
        this.handleBattleManagerPokemonItemRemove(player.id, value, pokemon)
      })
      pokemon.count.onChange = (changes: DataChange<any>[]) => {
        // console.log('change item');
        changes.forEach((change) => {
          this.handlePokemonCountChange(player.id, change, pokemon)
        })
      }
    }
    player.simulation.blueTeam.onRemove = (pokemon, key) => {
      // console.log('remove pokemon');
      this.handlePokemonRemove(player.id, pokemon)
    }
    player.simulation.redTeam.onRemove = (pokemon, key) => {
      // console.log('remove pokemon');
      this.handlePokemonRemove(player.id, pokemon)
    }
    player.triggerAll()
  }

  handlePokemonAdd(playerId: string, pokemon: IPokemonEntity) {
    // console.log('simulation add' + pokemon.name);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.battle){
        g.battle.addPokemon(playerId, pokemon)
      }
    }
  }

  handlePokemonRemove(playerId: string, pokemon: IPokemonEntity) {
    // console.log('simulation remove' + pokemon.name);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.battle){
        g.battle.removePokemon(playerId, pokemon)
      }
    }
  }

  handleItemAdd(player: Player, value: Item) {
    if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.itemsContainer){
        g.itemsContainer.addItem(value)
      }
    }
  }

  handleItemRemove(player: Player, value: Item) {
    if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.itemsContainer){
        g.itemsContainer.removeItem(value)
      }
    }
  }


  handlePokemonChange(playerId:string, change: DataChange<any>, pokemon: IPokemonEntity) {
    // console.log('simulation change' + change.field);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.battle){
        g.battle.changePokemon(playerId, change, pokemon)
      }
    }
  }

  handlePokemonStatusChange(playerId: string, change: DataChange<any>, pokemon: IPokemonEntity) {
    // console.log('simulation change' + change.field);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.battle){
        g.battle.changeStatus(playerId, change, pokemon)
      }
    }
  }

  handleBattleManagerPokemonItemAdd(playerId: string, value: Item, pokemon: IPokemonEntity) {
    if (this.game != null && playerId == this.uid && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.battle){
        g.battle.addPokemonItem(playerId, value, pokemon)
      }
    }
  }

  handleBattleManagerPokemonItemRemove(playerId: string, value: Item, pokemon: IPokemonEntity) {
    if (this.game != null && playerId == this.uid && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.battle){
        g.battle.removePokemonItem(playerId, value, pokemon)
      }
    }
  }

  handlePokemonCountChange(playerId: string, change: DataChange<any>, pokemon: IPokemonEntity) {
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.battle){
        g.battle.changeCount(playerId, change, pokemon)
      }
    }
  }

  handleClimateChange(change: DataChange<any>, player: Player) {
    if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if(g.weatherManager){
        switch (change.value) {
          case 'RAIN':
            g.weatherManager.addRain()
            break
  
          case 'SUN':
            g.weatherManager.addSun()
            break
  
          case 'SANDSTORM':
            g.weatherManager.addSandstorm()
            break
  
          case 'SNOW':
            g.weatherManager.addSnow()
            break
  
          case 'NEUTRAL':
            g.weatherManager.clearWeather()
            break
  
          default:
            break
        }
      }
    }
  }

  handleBoardPokemonAdd(player: IPlayer, pokemon: IPokemon) {
    if (this.game != null && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if (g.board && g.board.player && g.board.player.id == player.id) {
        g.board.addPokemon(pokemon)
      }
    }
  }

  handleBoardPokemonRemove(player: IPlayer, pokemon: IPokemon) {
    if (this.game != null && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if (g.board && g.board.player && g.board.player.id == player.id) {
        g.board.removePokemon(pokemon)
      }
    }
  }

  handleBoardPokemonChange(player: IPlayer, pokemon: IPokemon, change: DataChange<any>) {
    if (this.game != null && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      if (g.board && g.board.player && g.board.player.id == player.id) {
        g.board.changePokemon(pokemon, change)
      }
    }
  }

  handleBoardPokemonItemAdd(playerId: string, value: Item, pokemon: IPokemon) {
    if (this.game != null && playerId == this.uid && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      g.board?.addPokemonItem(playerId, value, pokemon)
    }
  }

  handleBoardPokemonItemRemove(playerId: string, value: Item, pokemon: IPokemon) {
    if (this.game != null && playerId == this.uid && this.game.scene.getScene('gameScene')) {
      const g = <GameScene> this.game.scene.getScene('gameScene')
      g.board?.removePokemonItem(playerId, value, pokemon)
    }
  }

  handleDragDropFailed(message: any) {
    const g = <GameScene> this.game?.scene.getScene('gameScene')

    if (g && message.updateBoard) {
      const tg = g.lastDragDropPokemon
      if(tg){
        const coordinates = transformCoordinate(tg.positionX, tg.positionY)
        tg.x = coordinates[0]
        tg.y = coordinates[1]
      }
    }

    if (g && message.updateItems) {
      g.itemsContainer?.updateItems()
    }
  }

  onPlayerClick(id: string) {
    if(this.game && this.game.scene.getScene('gameScene')){
      const g = <GameScene> this.game.scene.getScene('gameScene')
      const player = this.room.state.players.get(id)
      if(player){
        g.board?.setPlayer(player)
        g.battle?.setPlayer(player)
      }
    }
  }

  onDragDrop(event: CustomEvent<IDragDropMessage>) {
    this.room.send(Transfer.DRAG_DROP, event.detail)
  }

  onDragDropCombine(event: CustomEvent<IDragDropCombineMessage>) {
      this.room.send(Transfer.DRAG_DROP_COMBINE, event.detail)
  }

  onDragDropItem(event: CustomEvent<IDragDropItemMessage>) {
    this.room.send(Transfer.DRAG_DROP_ITEM, event.detail)
  }

  onSellDrop(event: CustomEvent<{pokemonId: string}>) {
    this.room.send(Transfer.SELL_DROP, event.detail)
  }

  transformToSimplePlayer(player: IPlayer) {
    const simplePlayer = {
      name: player.name,
      id: player.id,
      rank: player.rank,
      avatar: player.avatar,
      pokemons: new Array<string>()
    }

    if(player.board && player.board.size > 0){
      player.board.forEach((pokemon) => {
        if (pokemon.positionY != 0) {
          const shinyPad = pokemon.shiny ? '/0000/0001' : '' 
          simplePlayer.pokemons.push(`${pokemon.index}${shinyPad}/${pokemon.emotion}`)
        }
      })
    }

    return simplePlayer
  }
}

export default GameContainer
