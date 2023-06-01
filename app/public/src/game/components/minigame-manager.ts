import Pokemon from "./pokemon"
import { FloatingItem } from "./floating-item"
import { IFloatingItem, IPokemonAvatar } from "../../../../types"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import {
  transformMiniGameXCoordinate,
  transformMiniGameYCoordinate
} from "../../pages/utils/utils"

export default class MinigameManager {
  pokemons: Map<string, Pokemon>
  items: Map<string, FloatingItem>
  uid: string
  scene: GameScene
  display: boolean
  animationManager: AnimationManager

  constructor(
    scene: GameScene,
    animationManager: AnimationManager,
    uid: string,
    avatars: Map<string, IPokemonAvatar>,
    items: Map<string, IFloatingItem>
  ) {
    this.pokemons = new Map<string, Pokemon>()
    this.items = new Map<string, FloatingItem>()
    this.uid = uid
    this.scene = scene
    this.display = false
    this.animationManager = animationManager
    this.buildPokemons(avatars)
    this.buildItems(items)
  }

  buildPokemons(avatars: Map<string, IPokemonAvatar>) {
    avatars.forEach((pkm) => {
      this.addPokemon(pkm)
    })
  }

  buildItems(items: Map<string, IFloatingItem>) {
    items.forEach((item) => {
      this.addItem(item)
    })
  }

  getVector(x: number, y: number) {
    const avatar = this.pokemons.get(this.uid)
    if (avatar) {
      return {
        x: x - avatar.x,
        y: y - avatar.y
      }
    } else {
      return { x: 0, y: 0 }
    }
  }

  addItem(item: IFloatingItem) {
    const it = new FloatingItem(
      this.scene,
      item.id,
      transformMiniGameXCoordinate(item.x),
      transformMiniGameYCoordinate(item.y),
      item.name
    )
    this.items.set(it.id, it)
  }

  removeItem(itemToRemove: IFloatingItem) {
    const itemUI = this.items.get(itemToRemove.id)
    if (itemUI) {
      itemUI.destroy(true)
    }
    this.items.delete(itemToRemove.id)
  }

  changeItem(item: IFloatingItem, field: string, value: any) {
    const itemUI = this.items.get(item.id)
    if (itemUI) {
      switch (field) {
        case "x":
          itemUI.x = transformMiniGameXCoordinate(value)
          break

        case "y":
          itemUI.y = transformMiniGameYCoordinate(value)
          break

        case "avatarId":
          itemUI.onGrab(value)
      }
    }
  }

  addPokemon(pokemon: IPokemonAvatar) {
    const pokemonUI = new Pokemon(
      this.scene,
      transformMiniGameXCoordinate(pokemon.x),
      transformMiniGameYCoordinate(pokemon.y),
      pokemon,
      pokemon.id,
      true
    )

    if (pokemonUI.isCurrentPlayerAvatar) {      
      const arrowIndicator = this.scene.add.sprite(
        pokemonUI.x + pokemonUI.width / 2 - 8,
        pokemonUI.y - 70,
        "arrowDown"
      ).setDepth(10).setScale(2)
      this.scene.tweens.add({
        targets: arrowIndicator,
        y: pokemonUI.y - 50,
        duration: 500,
        ease: Phaser.Math.Easing.Sine.InOut,
        loop: 3,
        yoyo: true,
        onComplete() {
          arrowIndicator.destroy()
        }
      })
    }

    this.animationManager.animatePokemon(pokemonUI, pokemon.action)
    this.pokemons.set(pokemonUI.playerId, pokemonUI)
  }

  removePokemon(pokemonToRemove: IPokemonAvatar) {
    const pokemonUI = this.pokemons.get(pokemonToRemove.id)
    if (pokemonUI) {
      pokemonUI.destroy(true)
    }
    this.pokemons.delete(pokemonToRemove.id)
  }

  changePokemon(pokemon: IPokemonAvatar, field: string, value: any) {
    const pokemonUI = this.pokemons.get(pokemon.id)
    if (pokemonUI) {
      switch (field) {
        case "orientation":
          pokemonUI.orientation = value
          this.animationManager.animatePokemon(pokemonUI, pokemonUI.action)
          break

        case "action":
          pokemonUI.action = value
          this.animationManager.animatePokemon(pokemonUI, value)
          break

        case "x":
          pokemonUI.x = transformMiniGameXCoordinate(value)
          break

        case "y":
          pokemonUI.y = transformMiniGameYCoordinate(value)
          break

        case "timer":
          pokemonUI.updateCircleTimer(value)
          break
      }
    }
  }
}
