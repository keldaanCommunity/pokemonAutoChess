import Pokemon from "./pokemon"
import { IPokemon, IPokemonAvatar } from "../../../../types"
import { DataChange } from "@colyseus/schema"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"

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

  addPokemon(pokemon: IPokemonAvatar) {
    const pokemonUI = new Pokemon(
      this.scene,
      pokemon.x,
      pokemon.y,
      pokemon,
      pokemon.id,
      false
    )

    this.animationManager.animatePokemon(pokemonUI, pokemon.action)
    this.pokemons.set(pokemonUI.id, pokemonUI)
  }

  removePokemon(pokemonToRemove: IPokemonAvatar) {
    const pokemonUI = this.pokemons.get(pokemonToRemove.id)
    if (pokemonUI) {
      pokemonUI.destroy(true)
    }
    this.pokemons.delete(pokemonToRemove.id)
  }

  changePokemon(pokemon: IPokemonAvatar, change: DataChange<any>) {
    // console.log('change', change.field, pokemon.name);
    const pokemonUI = this.pokemons.get(pokemon.id)
    if (pokemonUI) {
      switch (change.field) {
        case "action":
          this.animationManager.animatePokemon(pokemonUI, change.value)
          break

        default:
          pokemonUI[change.field] = change.value
          break
      }
    }
  }
}
