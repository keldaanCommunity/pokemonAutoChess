import { MapSchema } from "@colyseus/schema"
import { Emotion, IPlayer, PkmCustom } from "../types"
import { Pkm, PkmFamily, PkmIndex } from "../types/enum/Pokemon"
import { logger } from "../utils/logger"
import { Pokemon, PokemonClasses } from "./colyseus-models/pokemon"
import { PVEStage } from "./pve-stages"
import { TownEncounter, TownEncounters } from "../core/town-encounters"
import { getPkmWithCustom } from "./colyseus-models/pokemon-customs"
import Player from "./colyseus-models/player"

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
      return new PokemonClass(shiny, emotion)
    } else {
      logger.warn(`No pokemon with name "${name}" found, return MissingNo`)
      return new Pokemon(shiny, emotion)
    }
  }
}
