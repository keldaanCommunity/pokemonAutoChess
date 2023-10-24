import { MapSchema } from "@colyseus/schema"
import { Emotion, IPlayer } from "../types"
import { EvolutionTime, HatchList, RarityCost } from "../types/Config"
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
import { Magikarp, Pokemon, PokemonClasses } from "./colyseus-models/pokemon"
import PRECOMPUTED_TYPE_POKEMONS from "./precomputed/type-pokemons.json"
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
      logger.warn(`No pokemon with name "${name}" found, return magikarp`)
      return new Magikarp(shiny, emotion)
    }
  }

  static getPokemonRarityFromName(name: Pkm) {
    const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name)
    return pokemon.rarity
  }

  static createRandomEgg(): Pokemon {
    const egg = PokemonFactory.createPokemonFromName(Pkm.EGG)
    egg.action = PokemonActionState.SLEEP
    egg.evolution = pickRandomIn(HatchList)
    egg.evolutionTimer = EvolutionTime.EGG_HATCH
    return egg
  }

  static getRandomFossil(board: MapSchema<Pokemon>) {
    const currentFossils = new Array<Pkm>()
    board.forEach((p) => {
      if (p.types.has(Synergy.FOSSIL)) {
        currentFossils.push(PkmFamily[p.name])
      }
    })
    const possibleFossils = (
      PRECOMPUTED_TYPE_POKEMONS[Synergy.FOSSIL].pokemons as Pkm[]
    ).filter((p) => {
      const pokemon = PokemonFactory.createPokemonFromName(p)
      return (
        currentFossils.includes(p) === false &&
        [Rarity.UNIQUE, Rarity.LEGENDARY, Rarity.MYTHICAL].includes(
          pokemon.rarity
        ) === false
      )
    })

    if (possibleFossils.length > 0) {
      return pickRandomIn(possibleFossils)
    } else {
      return Pkm.CARBINK
    }
  }

  static getSellPrice(name: Pkm): number {
    const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name)
    if (name === Pkm.EGG) {
      return 2
    } else if (name == Pkm.DITTO) {
      return 5
    } else if (name === Pkm.MAGIKARP) {
      return 1
    } else if (name === Pkm.GYARADOS) {
      return 10
    } else if (Unowns.includes(name)) {
      return 1
    } else if (pokemon.rarity === Rarity.HATCH) {
      return [3, 4, 5][pokemon.stars - 1] ?? 5
    } else if (
      [Rarity.UNIQUE, Rarity.LEGENDARY, Rarity.MYTHICAL].includes(
        pokemon.rarity
      )
    ) {
      const duo = Object.entries(PkmDuos).find(([key, duo]) =>
        duo.includes(pokemon.name)
      )
      if (pokemon.rarity === Rarity.UNIQUE) {
        return duo ? 8 : 15
      } else {
        return duo ? 10 : 20
      }
    } else if (PokemonFactory.getPokemonBaseEvolution(name) == Pkm.EEVEE) {
      return RarityCost[pokemon.rarity]
    } else {
      return RarityCost[pokemon.rarity] * pokemon.stars
    }
  }

  static getBuyPrice(name: Pkm): number {
    if (name === Pkm.DITTO) {
      return 5
    } else if (Unowns.includes(name)) {
      return 1
    } else {
      const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name)
      return RarityCost[pokemon.rarity]
    }
  }
}

export function isAdditionalPick(pkm: Pkm): boolean {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)
  return pokemon.additional
}
