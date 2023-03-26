import Pokemon from "./pokemon"
import { FloatingItem } from "./floating-item"
import { IFloatingItem, IPokemonAvatar } from "../../../../types"
import { DataChange } from "@colyseus/schema"
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

  changeItem(item: IFloatingItem, change: DataChange<any>) {
    const itemUI = this.items.get(item.id)
    if (itemUI) {
      switch (change.field) {
        case "x":
          itemUI.x = transformMiniGameXCoordinate(change.value)
          break

        case "y":
          itemUI.y = transformMiniGameYCoordinate(change.value)
          break
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

  changePokemon(pokemon: IPokemonAvatar, change: DataChange<any>) {
    const pokemonUI = this.pokemons.get(pokemon.id)
    if (pokemonUI) {
      switch (change.field) {
        case "orientation":
          pokemonUI.orientation = change.value
          this.animationManager.animatePokemon(pokemonUI, pokemonUI.action)
          break

        case "action":
          pokemonUI.action = change.value
          this.animationManager.animatePokemon(pokemonUI, change.value)
          break

        case "x":
          pokemonUI.x = transformMiniGameXCoordinate(change.value)
          break

        case "y":
          pokemonUI.y = transformMiniGameYCoordinate(change.value)
          break

        case "timer":
          pokemonUI.updateCircleTimer(change.value)
          break
      }
    }
  }
}
