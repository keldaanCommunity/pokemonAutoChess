import { MapSchema } from "@colyseus/schema"
import { FlowerPot } from "../core/flower-pots"
import { TownEncounter, TownEncounters } from "../core/town-encounters"
import { Emotion, IPlayer, PkmCustom } from "../types"
import { Pkm, PkmFamily, PkmIndex } from "../types/enum/Pokemon"
import { logger } from "../utils/logger"
import Player from "./colyseus-models/player"
import { Pokemon, PokemonClasses } from "./colyseus-models/pokemon"
import { getPkmWithCustom } from "./colyseus-models/pokemon-customs"
import { PVEStage } from "./pve-stages"

export default class PokemonFactory {
  static makePveBoard(
    pveStage: PVEStage,
    shinyEncounter: boolean,
    townEncounter: TownEncounter | null
  ): MapSchema<Pokemon> {
    const pokemons = new MapSchema<Pokemon>()
    pveStage.board.forEach(([pkm, x, y], index) => {
      const pokemon = PokemonFactory.createPokemonFromName(pkm, {
        emotion: pveStage.emotion ?? Emotion.NORMAL,
        shiny: shinyEncounter
      })
      pokemon.positionX = x
      pokemon.positionY = y
      if (
        townEncounter === TownEncounters.MAROWAK &&
        pveStage.marowakItems &&
        index in pveStage.marowakItems
      ) {
        pveStage.marowakItems[index]!.forEach((item) => pokemon.items.add(item))
      }
      pokemons.set(pokemon.id, pokemon)
    })
    return pokemons
  }

  static getPokemonBaseline(name: Pkm) {
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
      case Pkm.FLABEBE_BLUE:
      case Pkm.FLABEBE_ORANGE:
      case Pkm.FLABEBE_YELLOW:
      case Pkm.FLABEBE_WHITE:
      case Pkm.FLOETTE_BLUE:
      case Pkm.FLOETTE_ORANGE:
      case Pkm.FLOETTE_YELLOW:
      case Pkm.FLOETTE_WHITE:
      case Pkm.FLORGES_BLUE:
      case Pkm.FLORGES_ORANGE:
      case Pkm.FLORGES_YELLOW:
      case Pkm.FLORGES_WHITE:
        return Pkm.FLABEBE

      default:
        if (PkmFamily[name] == Pkm.UNOWN_A) {
          return name
        }
        return PkmFamily[name]
    }
  }

  static createPokemonFromName(
    name: Pkm,
    custom?: PkmCustom | Player
  ): Pokemon {
    let shiny = false
    let emotion = Emotion.NORMAL
    if (custom && "pokemonCustoms" in custom) {
      const pkmWithCustom = getPkmWithCustom(
        PkmIndex[name],
        (custom as IPlayer).pokemonCustoms
      )
      shiny = pkmWithCustom.shiny ?? false
      emotion = pkmWithCustom.emotion ?? Emotion.NORMAL
    } else if (custom) {
      shiny = custom.shiny ?? false
      emotion = custom.emotion ?? Emotion.NORMAL
    }
    if (name in PokemonClasses) {
      const PokemonClass = PokemonClasses[name]
      return new PokemonClass(name, shiny, emotion)
    } else {
      logger.warn(`No pokemon with name "${name}" found, return MissingNo`)
      return new Pokemon(Pkm.DEFAULT, shiny, emotion)
    }
  }
}

export const PkmColorVariantsByPkm: { [pkm in Pkm]?: (player: Player) => Pkm } = {
  [Pkm.FLABEBE]: (player) => {
    switch (player.flowerPotsSpawnOrder[0]) {
      case FlowerPot.YELLOW:
        return Pkm.FLABEBE_YELLOW
      case FlowerPot.ORANGE:
        return Pkm.FLABEBE_ORANGE
      case FlowerPot.BLUE:
        return Pkm.FLABEBE_BLUE
      case FlowerPot.WHITE:
        return Pkm.FLABEBE_WHITE
    }
    return Pkm.FLABEBE
  },
  [Pkm.FLOETTE]: (player) => {
    switch (player.flowerPotsSpawnOrder[0]) {
      case FlowerPot.YELLOW:
        return Pkm.FLOETTE_YELLOW
      case FlowerPot.ORANGE:
        return Pkm.FLOETTE_ORANGE
      case FlowerPot.BLUE:
        return Pkm.FLOETTE_BLUE
      case FlowerPot.WHITE:
        return Pkm.FLOETTE_WHITE
    }
    return Pkm.FLOETTE
  },
  [Pkm.FLORGES]: (player) => {
    switch (player.flowerPotsSpawnOrder[0]) {
      case FlowerPot.YELLOW:
        return Pkm.FLORGES_YELLOW
      case FlowerPot.ORANGE:
        return Pkm.FLORGES_ORANGE
      case FlowerPot.BLUE:
        return Pkm.FLORGES_BLUE
      case FlowerPot.WHITE:
        return Pkm.FLORGES_WHITE
    }
    return Pkm.FLORGES
  }
}

export const PkmColorVariants: readonly Pkm[] = [
  Pkm.FLABEBE_YELLOW,
  Pkm.FLABEBE_ORANGE,
  Pkm.FLABEBE_BLUE,
  Pkm.FLABEBE_WHITE,
  Pkm.FLOETTE_YELLOW,
  Pkm.FLOETTE_ORANGE,
  Pkm.FLOETTE_BLUE,
  Pkm.FLOETTE_WHITE,
  Pkm.FLORGES_YELLOW,
  Pkm.FLORGES_ORANGE,
  Pkm.FLORGES_BLUE,
  Pkm.FLORGES_WHITE
]