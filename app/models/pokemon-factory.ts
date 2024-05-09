import { MapSchema } from "@colyseus/schema"
import { Emotion, IPlayer } from "../types"
import { RarityCost } from "../types/Config"
import { PokemonActionState, Rarity } from "../types/enum/Game"
import {
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmIndex,
  Unowns
} from "../types/enum/Pokemon"
import { SpecialGameRule } from "../types/enum/SpecialGameRule"
import { logger } from "../utils/logger"
import { min } from "../utils/number"
import { pickRandomIn } from "../utils/random"
import { Egg, Pokemon, PokemonClasses } from "./colyseus-models/pokemon"
import { PRECOMPUTED_POKEMONS_PER_RARITY, getPokemonData } from "./precomputed"
import { PVEStage } from "./pve-stages"

export default class PokemonFactory {
  static makePveBoard(
    pveStage: PVEStage,
    shinyEncounter: boolean
  ): MapSchema<Pokemon> {
    const pokemons = new MapSchema<Pokemon>()
    pveStage.board.forEach(([pkm, x, y]) => {
      const pokemon = PokemonFactory.createPokemonFromName(pkm, {
        selectedEmotion: pveStage.emotion ?? Emotion.NORMAL,
        selectedShiny: shinyEncounter
      })
      pokemon.positionX = x
      pokemon.positionY = y
      pokemons.set(pokemon.id, pokemon)
    })
    return pokemons
  }

  // transforms a pokemon into another pokemon,
  // transferring its items and position to
  // the new pokemon
  static transformPokemon(before: Pokemon, afterName: Pkm, player?: IPlayer) {
    const transformation = this.createPokemonFromName(afterName, player)
    transformation.positionX = before.positionX
    transformation.positionY = before.positionY
    transformation.items = before.items
    return transformation
  }

  static getPokemonBaseEvolution(name: Pkm) {
    switch (name) {
      case Pkm.VAPOREON:
      case Pkm.JOLTEON:
      case Pkm.FLAREON:
      case Pkm.ESPEON:
      case Pkm.UMBREON:
      case Pkm.LEAFEON:
      case Pkm.SYLVEON:
      case Pkm.GLACEON:
        return Pkm.EEVEE
      case Pkm.SHEDINJA:
        return Pkm.NINCADA
      case Pkm.WORMADAM_PLANT:
        return Pkm.BURMY_PLANT
      case Pkm.WORMADAM_SANDY:
        return Pkm.BURMY_SANDY
      case Pkm.WORMADAM_TRASH:
        return Pkm.BURMY_TRASH
      default:
        return PkmFamily[name]
    }
  }

  static createPokemonFromName(
    name: Pkm,
    config?: IPlayer | { selectedShiny?: boolean; selectedEmotion?: Emotion }
  ): Pokemon {
    if (config && "pokemonCollection" in config) {
      config = config.pokemonCollection.get(PkmIndex[name])
    }
    const shiny = config && config.selectedShiny ? true : false
    const emotion =
      config && config.selectedEmotion ? config.selectedEmotion : Emotion.NORMAL
    if (name in PokemonClasses) {
      const PokemonClass = PokemonClasses[name]

      return new PokemonClass(shiny, emotion)
    } else {
      logger.warn(`No pokemon with name "${name}" found, return MissingNo`)
      return new Pokemon(shiny, emotion)
    }
  }

  static createRandomEgg(shiny: boolean): Egg {
    const hatchList = PRECOMPUTED_POKEMONS_PER_RARITY.HATCH.filter(
      (p) => getPokemonData(p).stars === 1
    )
    const egg = PokemonFactory.createPokemonFromName(Pkm.EGG, {
      selectedShiny: shiny
    })
    egg.action = PokemonActionState.SLEEP
    egg.evolution = pickRandomIn(hatchList)
    return egg as Egg
  }

  static getSellPrice(
    name: Pkm,
    shiny: boolean,
    specialGameRule?: SpecialGameRule | null
  ): number {
    if (specialGameRule === SpecialGameRule.FREE_MARKET && name !== Pkm.EGG)
      return 0

    const pokemonData = getPokemonData(name)
    const duo = Object.entries(PkmDuos).find(([key, duo]) => duo.includes(name))

    let price = 1

    if (name === Pkm.EGG) {
      price = shiny ? 10 : 2
    } else if (name == Pkm.DITTO) {
      price = 5
    } else if (name === Pkm.MAGIKARP) {
      price = 0
    } else if (name === Pkm.FEEBAS) {
      price = 1
    } else if (name === Pkm.GYARADOS || name === Pkm.MILOTIC) {
      price = 10
    } else if (Unowns.includes(name)) {
      price = 1
    } else if (pokemonData.rarity === Rarity.HATCH) {
      price = [3, 4, 5][pokemonData.stars - 1] ?? 5
    } else if (pokemonData.rarity === Rarity.UNIQUE) {
      price = duo ? 8 : 15
    } else if (pokemonData.rarity === Rarity.LEGENDARY) {
      price = duo ? 10 : 20
    } else if (PokemonFactory.getPokemonBaseEvolution(name) == Pkm.EEVEE) {
      price = RarityCost[pokemonData.rarity]
    } else if (duo) {
      price = Math.ceil(
        (RarityCost[pokemonData.rarity] * pokemonData.stars) / 2
      )
    } else {
      price = RarityCost[pokemonData.rarity] * pokemonData.stars
    }

    if (
      specialGameRule === SpecialGameRule.RARE_IS_EXPENSIVE &&
      name !== Pkm.EGG
    ) {
      price = min(0)(price - 1)
    }

    return price
  }

  static getBuyPrice(
    name: Pkm,
    specialGameRule?: SpecialGameRule | null
  ): number {
    if (specialGameRule === SpecialGameRule.FREE_MARKET) return 0

    let price = 1

    if (name === Pkm.DITTO) {
      price = 5
    } else if (Unowns.includes(name)) {
      price = 1
    } else {
      price = RarityCost[getPokemonData(name).rarity]
    }

    if (specialGameRule === SpecialGameRule.RARE_IS_EXPENSIVE) {
      price = min(0)(price - 1)
    }

    return price
  }
}
