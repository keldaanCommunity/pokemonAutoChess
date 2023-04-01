import Pokemon from "./pokemon"
import { transformCoordinate } from "../../pages/utils/utils"
import { IPlayer, IPokemon } from "../../../../types"
import { DataChange } from "@colyseus/schema"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import { Item } from "../../../../types/enum/Item"
import { Pkm } from "../../../../types/enum/Pokemon"

export default class BoardManager {
  pokemons: Map<string, Pokemon>
  uid: string
  scene: GameScene
  player: IPlayer
  mode: string
  animationManager: AnimationManager

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
    this.mode = "pick"
    this.animationManager = animationManager
    this.buildPokemons()
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
    if (pokemon.positionY != 0 && this.mode == "battle") {
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

  battleMode() {
    // console.log('battleMode');
    this.mode = "battle"
    this.pokemons.forEach((pokemon) => {
      if (pokemon.positionY != 0) {
        pokemon.setVisible(false)
      }
    })
    this.closeTooltips()
  }

  pickMode() {
    // console.log('pickMode');
    this.mode = "pick"
    this.pokemons.forEach((pokemon) => {
      pokemon.setVisible(true)
    })
  }

  setPlayer(player: IPlayer) {
    if (player.id != this.player.id) {
      this.pokemons.forEach((pokemon, key) => {
        pokemon.destroy(true)
      })
      this.pokemons.clear()
      this.player = player
      this.buildPokemons()
    }
  }

  addPokemonItem(playerId: string, value: Item, pokemon: IPokemon) {
    // console.log(change);
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

  changePokemon(pokemon: IPokemon, change: DataChange<any>) {
    // console.log('change', change.field, pokemon.name);
    const pokemonUI = this.pokemons.get(pokemon.id)
    let coordinates: number[]
    if (pokemonUI) {
      switch (change.field) {
        case "positionX":
          pokemonUI.positionX = change.value
          pokemonUI.positionY = pokemon.positionY
          coordinates = transformCoordinate(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          break

        case "positionY":
          pokemonUI.positionY = change.value
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
          this.animationManager.animatePokemon(pokemonUI, change.value)
          break

        default:
          pokemonUI[change.field] = change.value
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

  closeTooltips(){
    this.pokemons.forEach((pokemon) => {
      if (pokemon.detail) {
        pokemon.closeDetail()
      }
      if(pokemon.itemsContainer){
        pokemon.itemsContainer.closeDetails()
      }
    })
  }
}
