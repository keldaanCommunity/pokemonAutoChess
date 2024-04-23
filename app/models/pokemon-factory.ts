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
import { Synergy } from "../types/enum/Synergy"
import { logger } from "../utils/logger"
import { min } from "../utils/number"
import { pickRandomIn } from "../utils/random"
import { Egg, Pokemon, PokemonClasses } from "./colyseus-models/pokemon"
import {
  PRECOMPUTED_POKEMONS_PER_RARITY,
  PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY,
  getPokemonData
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
      case Pkm.SHEDINJA:
        return Pkm.NINCADA
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

export function isAdditionalPick(pkm: Pkm): boolean {
  return getPokemonData(pkm).additional
}

export function isInRegion(pkm: Pkm, regionSynergies: Synergy[]) {
  if (pkm === Pkm.ALOLAN_MAROWAK) return regionSynergies.includes(Synergy.FIRE)
  if (pkm === Pkm.ALOLAN_RAICHU)
    return regionSynergies.includes(Synergy.PSYCHIC)
  if (pkm === Pkm.ALOLAN_EXEGGUTOR)
    return regionSynergies.includes(Synergy.DRAGON)
  if (pkm === Pkm.HISUIAN_TYPHLOSION)
    return regionSynergies.includes(Synergy.GHOST)
  if (pkm === Pkm.BURMY_PLANT) return regionSynergies.includes(Synergy.GRASS)
  if (pkm === Pkm.BURMY_SANDY) return regionSynergies.includes(Synergy.GROUND)
  if (pkm === Pkm.BURMY_TRASH)
    return regionSynergies.includes(Synergy.ARTIFICIAL)

  return regionSynergies.some((s) => getPokemonData(pkm).types.includes(s))
}
