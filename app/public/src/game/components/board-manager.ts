import Pokemon from "./pokemon"
import {
  transformAttackCoordinate,
  transformCoordinate
} from "../../pages/utils/utils"
import { IBoardEvent, IPlayer, IPokemon } from "../../../../types"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import { Item } from "../../../../types/enum/Item"
import { Pkm } from "../../../../types/enum/Pokemon"
import { BoardEvent, GamePhaseState, Orientation } from "../../../../types/enum/Game"
import { Ability } from "../../../../types/enum/Ability"
import { PokemonAvatar } from "../../../../models/colyseus-models/pokemon-avatar"

export enum BoardMode { PICK = "pick", BATTLE = "battle", MINIGAME = "minigame" }

export default class BoardManager {
  pokemons: Map<string, Pokemon>
  uid: string
  scene: GameScene
  player: IPlayer
  mode: BoardMode
  animationManager: AnimationManager
  playerAvatar: Pokemon
  opponentAvatar: Pokemon | null

  constructor(
    scene: GameScene,
    player: IPlayer,
    animationManager: AnimationManager,
    uid: string
  ) {
    this.pokemons = new Map<string, Pokemon>()
    this.uid = uid
    this.scene = scene
    this.player = player
    this.mode = BoardMode.PICK
    this.animationManager = animationManager
    this.buildPokemons()

    if (this.scene.room?.state.phase == GamePhaseState.FIGHT) {
      this.battleMode()
    } else if (this.scene.room?.state.phase === GamePhaseState.MINIGAME) {
      this.minigameMode()
    } else {
      this.pickMode()
    }
  }

  addPokemon(pokemon: IPokemon) {
    const coordinates = transformCoordinate(
      pokemon.positionX,
      pokemon.positionY
    )
    const pokemonUI = new Pokemon(
      this.scene,
      coordinates[0],
      coordinates[1],
      pokemon,
      this.player.id,
      false
    )

    this.animationManager.animatePokemon(pokemonUI, pokemon.action)
    this.pokemons.set(pokemonUI.id, pokemonUI)
    if (pokemon.positionY != 0 && this.mode === BoardMode.BATTLE) {
      pokemonUI.setVisible(false)
    }
  }

  removePokemon(pokemonToRemove: IPokemon) {
    const pokemonUI = this.pokemons.get(pokemonToRemove.id)
    if (pokemonUI) {
      pokemonUI.destroy(true)
    }
    this.pokemons.delete(pokemonToRemove.id)
  }

  buildPokemons() {
    this.player.board.forEach((pokemon, key) => {
      this.addPokemon(pokemon)
    })
  }

  updatePlayerAvatar(){
    if(this.playerAvatar){
      this.playerAvatar.destroy(true)
    }
    const playerAvatar = new PokemonAvatar(this.player.id, this.player.avatar, 0, 0, 0)
    this.playerAvatar = new Pokemon(
      this.scene,
      504,
      696,
      playerAvatar,
      this.player.id,
      false
    )
    this.playerAvatar.disableInteractive()
    this.playerAvatar.orientation = Orientation.UPRIGHT
    this.animationManager.animatePokemon(this.playerAvatar, this.playerAvatar.action)    
  }

  updateOpponentAvatar(opponentId: string, opponentAvatarString: string){
    if(this.opponentAvatar){
      this.opponentAvatar.destroy(true)
    }

    if(this.mode === BoardMode.BATTLE){
      const opponentAvatar = new PokemonAvatar(this.player.id, opponentAvatarString, 0, 0, 0)
      this.opponentAvatar = new Pokemon(
        this.scene,
        1512,
        122,
        opponentAvatar,
        opponentId,
        false
      )
      this.opponentAvatar.disableInteractive()
      this.opponentAvatar.orientation = Orientation.DOWNLEFT
      this.animationManager.animatePokemon(this.opponentAvatar, this.opponentAvatar.action)
    }
  }

  battleMode() {
    // logger.debug('battleMode');
    this.mode = BoardMode.BATTLE
    this.pokemons.forEach((pokemon) => {
      if (pokemon.positionY != 0) {
        pokemon.setVisible(false)
      }
    })
    this.closeTooltips()
    this.scene.input.setDragState(this.scene.input.activePointer, 0)
  }

  pickMode() {
    // logger.debug('pickMode');
    this.mode = BoardMode.PICK
    this.pokemons.forEach((pokemon) => {
      pokemon.setVisible(true)
    })
    this.updatePlayerAvatar()
    if(this.opponentAvatar){
      this.opponentAvatar.destroy(true)
    }
  }

  minigameMode(){
    this.mode = BoardMode.MINIGAME
    this.pokemons.forEach((pokemon) => {
      if (pokemon.positionY != 0) {
        pokemon.setVisible(false)
      }
    })
    this.closeTooltips()
    this.scene.input.setDragState(this.scene.input.activePointer, 0)

    if(this.playerAvatar){
      this.playerAvatar.destroy(true)
    }
    if(this.opponentAvatar){
      this.opponentAvatar.destroy(true)
    }
  }

  setPlayer(player: IPlayer) {
    if (player.id != this.player.id) {
      this.pokemons.forEach((pokemon, key) => {
        pokemon.destroy(true)
      })
      this.pokemons.clear()
      this.player = player
      this.buildPokemons()
      this.updatePlayerAvatar()
      this.updateOpponentAvatar(this.player.opponentId, this.player.opponentAvatar)
    }
  }

  addPokemonItem(playerId: string, value: Item, pokemon: IPokemon) {
    // logger.debug(change);
    if (this.player.id === playerId) {
      const pkm = this.pokemons.get(pokemon.id)
      if (pkm && !pkm.itemsContainer.findItem(value)) {
        pkm.itemsContainer.addItem(value)
      }
    }
  }

  removePokemonItem(playerId: string, value: Item, pokemon: IPokemon) {
    if (this.player.id == playerId) {
      if (this.player.id == playerId) {
        const pkm = this.pokemons.get(pokemon.id)
        if (pkm) {
          pkm.itemsContainer.removeItem(value)
        }
      }
    }
  }

  changePokemon(pokemon: IPokemon, field: string, value: any) {
    // logger.debug('change', change.field, pokemon.name);
    const pokemonUI = this.pokemons.get(pokemon.id)
    let coordinates: number[]
    if (pokemonUI) {
      switch (field) {
        case "positionX":
          pokemonUI.positionX = value
          pokemonUI.positionY = pokemon.positionY
          coordinates = transformCoordinate(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          break

        case "positionY":
          pokemonUI.positionY = value
          pokemonUI.positionX = pokemon.positionX
          coordinates = transformCoordinate(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          if (pokemonUI.positionY != 0 && this.mode == "battle") {
            pokemonUI.setVisible(false)
          }
          break

        case "action":
          this.animationManager.animatePokemon(pokemonUI, value)
          break

        default:
          pokemonUI[field] = value
          break
      }
    }
  }

  getPossibleEvolution(pokemonIndex: string) {
    let count = 0

    this.pokemons.forEach((p) => {
      if (p.index == pokemonIndex && p.evolution != Pkm.DEFAULT) {
        count++
      }
    })
    return count === 2 || count === 5 || count === 8
  }

  closeTooltips() {
    this.pokemons.forEach((pokemon) => {
      if (pokemon.detail) {
        pokemon.closeDetail()
      }
      if (pokemon.itemsContainer) {
        pokemon.itemsContainer.closeDetails()
      }
    })
  }

  getBenchSize(): number {
    let benchSize = 0

    this.pokemons.forEach((pokemon, key) => {
      if (pokemon.positionY == 0) {
        benchSize++
      }
    })

    return benchSize
  }

  get isBenchFull(): boolean {
    return this.getBenchSize() >= 8
  }

  handleBoardEvent(event: IBoardEvent) {
    if (
      event.type === BoardEvent.LIGHTNING &&
      event.x != null &&
      event.y != null
    ) {
      this.triggerLightning(event.x, event.y)
    }
  }

  triggerLightning(x: number, y: number) {
    const coordinates = transformAttackCoordinate(x, y)
    const thunderSprite = this.scene.add.sprite(
      coordinates[0],
      coordinates[1],
      "specials",
      `${Ability.THUNDER}/000`
    )
    thunderSprite.setDepth(7)
    thunderSprite.setScale(2, 2)
    thunderSprite.anims.play(Ability.THUNDER)
    thunderSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      thunderSprite.destroy()
    })
  }
}
