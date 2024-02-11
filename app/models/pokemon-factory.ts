import { MapSchema } from "@colyseus/schema"
import { Emotion, IPlayer } from "../types"
import { HatchList, RarityCost } from "../types/Config"
import { Effect } from "../types/enum/Effect"
import { PokemonActionState, Rarity } from "../types/enum/Game"
import {
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmIndex,
  Unowns
} from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { logger } from "../utils/logger"
import { pickRandomIn } from "../utils/random"
import Player from "./colyseus-models/player"
import { Egg, Pokemon, PokemonClasses } from "./colyseus-models/pokemon"
import {
  getPokemonData,
  PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY
} from "./precomputed"
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

  static createRandomEgg(): Egg {
    const egg = PokemonFactory.createPokemonFromName(Pkm.EGG)
    egg.action = PokemonActionState.SLEEP
    egg.evolution = pickRandomIn(HatchList)
    return egg as Egg
  }

  static getRandomFossil(board: MapSchema<Pokemon>) {
    const currentFossils = new Array<Pkm>()
    board.forEach((p) => {
      if (p.types.has(Synergy.FOSSIL)) {
        currentFossils.push(PkmFamily[p.name])
      }
    })
    const possibleFossils = (
      PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY[Synergy.FOSSIL]
        .pokemons as Pkm[]
    ).filter((p) => {
      const pokemon = PokemonFactory.createPokemonFromName(p)
      return (
        currentFossils.includes(p) === false &&
        [Rarity.UNIQUE, Rarity.LEGENDARY].includes(pokemon.rarity) === false
      )
    })

    if (possibleFossils.length > 0) {
      return pickRandomIn(possibleFossils)
    } else {
      return Pkm.CARBINK
    }
  }

  static getSellPrice(name: Pkm, player?: Player): number {
    const pokemonData = getPokemonData(name)
    const duo = Object.entries(PkmDuos).find(([key, duo]) => duo.includes(name))

    if (name === Pkm.EGG) {
      return player && player.effects.has(Effect.GOLDEN_EGGS) ? 10 : 2
    } else if (name == Pkm.DITTO) {
      return 5
    } else if (name === Pkm.MAGIKARP) {
      return 0
    } else if (name === Pkm.GYARADOS) {
      return 10
    } else if (Unowns.includes(name)) {
      return 1
    } else if (pokemonData.rarity === Rarity.HATCH) {
      return [3, 4, 5][pokemonData.stars - 1] ?? 5
    } else if (pokemonData.rarity === Rarity.UNIQUE) {
      return duo ? 8 : 15
    } else if (pokemonData.rarity === Rarity.LEGENDARY) {
      return duo ? 10 : 20
    } else if (PokemonFactory.getPokemonBaseEvolution(name) == Pkm.EEVEE) {
      return RarityCost[pokemonData.rarity]
    } else if (duo) {
      return Math.ceil((RarityCost[pokemonData.rarity] * pokemonData.stars) / 2)
    } else {
      return RarityCost[pokemonData.rarity] * pokemonData.stars
    }
  }

  static getBuyPrice(name: Pkm): number {
    if (name === Pkm.DITTO) {
      return 5
    } else if (Unowns.includes(name)) {
      return 1
    } else {
      return RarityCost[getPokemonData(name).rarity]
    }
  }
}

export function isAdditionalPick(pkm: Pkm): boolean {
  return getPokemonData(pkm).additional
}
