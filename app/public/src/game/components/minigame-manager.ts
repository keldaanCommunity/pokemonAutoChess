import Pokemon from "./pokemon"
import { IPokemon, IPokemonAvatar } from "../../../../types"
import { DataChange } from "@colyseus/schema"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import {
  transformMiniGameXCoordinate,
  transformMiniGameYCoordinate
} from "../../pages/utils/utils"

export default class MinigameManager {
  pokemons: Map<string, Pokemon>
  uid: string
  scene: GameScene
  display: boolean
  animationManager: AnimationManager

  constructor(
    scene: GameScene,
    animationManager: AnimationManager,
    uid: string,
    avatars: Map<string, IPokemonAvatar>
  ) {
    this.pokemons = new Map<string, Pokemon>()
    this.uid = uid
    this.scene = scene
    this.display = false
    this.animationManager = animationManager
    this.buildPokemons(avatars)
  }

  buildPokemons(avatars: Map<string, IPokemonAvatar>) {
    avatars.forEach((pkm) => {
      this.addPokemon(pkm)
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
        case "action":
          this.animationManager.animatePokemon(pokemonUI, change.value)
          break

        case "x":
          pokemonUI.x = transformMiniGameXCoordinate(change.value)
          break

        case "y":
          pokemonUI.y = transformMiniGameYCoordinate(change.value)
          break
      }
    }
  }
}
