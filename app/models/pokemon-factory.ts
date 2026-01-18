import { MapSchema } from "@colyseus/schema"
import { FlowerPot } from "../core/flower-pots"
import { TownEncounter, TownEncounters } from "../core/town-encounters"
import { Emotion, IPlayer, PkmCustom } from "../types"
import { Stat } from "../types/enum/Game"
import { Pkm, PkmFamily, PkmIndex } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
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
      for (const stat in pveStage.statBoosts) {
        pokemon.applyStat(stat as Stat, pveStage.statBoosts[stat], undefined)
      }
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
      const pokemon = new PokemonClass(name, shiny, emotion)
      pokemon.maxHP = pokemon.hp
      return pokemon
    } else {
      logger.warn(`No pokemon with name "${name}" found, return MissingNo`)
      return new Pokemon(Pkm.DEFAULT, shiny, emotion)
    }
  }
}

export function getColorVariantForPlayer(basePkm: Pkm, player: IPlayer): Pkm {
  switch (basePkm) {
    case Pkm.FLABEBE: {
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
    }
    case Pkm.FLOETTE: {
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
    }
    case Pkm.FLORGES: {
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

    case Pkm.VIVILLON: {
      const synergyVivillon: { synergy: Synergy; form: Pkm; count: number }[] =
        [
          { synergy: Synergy.SOUND, form: Pkm.VIVILLON, count: 0 },
          { synergy: Synergy.NORMAL, form: Pkm.VIVILLON_ICY_SNOW, count: 0 },
          { synergy: Synergy.GHOST, form: Pkm.VIVILLON_POLAR, count: 0 },
          { synergy: Synergy.ICE, form: Pkm.VIVILLON_TUNDRA, count: 0 },
          { synergy: Synergy.FOSSIL, form: Pkm.VIVILLON_CONTINENTAL, count: 0 },
          { synergy: Synergy.GRASS, form: Pkm.VIVILLON_GARDEN, count: 0 },
          { synergy: Synergy.PSYCHIC, form: Pkm.VIVILLON_ELEGANT, count: 0 },
          { synergy: Synergy.FIELD, form: Pkm.VIVILLON_MODERN, count: 0 },
          { synergy: Synergy.WATER, form: Pkm.VIVILLON_MARINE, count: 0 },
          {
            synergy: Synergy.FIGHTING,
            form: Pkm.VIVILLON_ARCHIPELAGO,
            count: 0
          },
          { synergy: Synergy.HUMAN, form: Pkm.VIVILLON_HIGH_PLAINS, count: 0 },
          { synergy: Synergy.ROCK, form: Pkm.VIVILLON_SANDSTORM, count: 0 },
          { synergy: Synergy.AQUATIC, form: Pkm.VIVILLON_RIVER, count: 0 },
          { synergy: Synergy.STEEL, form: Pkm.VIVILLON_MONSOON, count: 0 },
          { synergy: Synergy.ELECTRIC, form: Pkm.VIVILLON_SAVANNA, count: 0 },
          { synergy: Synergy.FIRE, form: Pkm.VIVILLON_SUN, count: 0 },
          { synergy: Synergy.LIGHT, form: Pkm.VIVILLON_OCEAN, count: 0 },
          { synergy: Synergy.POISON, form: Pkm.VIVILLON_JUNGLE, count: 0 },
          { synergy: Synergy.FAIRY, form: Pkm.VIVILLON_FANCY, count: 0 },
          {
            synergy: Synergy.ARTIFICIAL,
            form: Pkm.VIVILLON_POKE_BALL,
            count: 0
          }
        ]

      for (const s of synergyVivillon) {
        s.count = player.synergies.get(s.synergy) || 0
      }

      synergyVivillon.sort((a, b) => b.count - a.count)
      return synergyVivillon[0].form
    }

    default:
      return basePkm
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
  Pkm.FLORGES_WHITE,
  Pkm.MINIOR_KERNEL_RED,
  Pkm.MINIOR_KERNEL_ORANGE,
  Pkm.MINIOR_KERNEL_GREEN,
  Pkm.MINIOR_KERNEL_BLUE,
  Pkm.VIVILLON_ICY_SNOW,
  Pkm.VIVILLON_POLAR,
  Pkm.VIVILLON_TUNDRA,
  Pkm.VIVILLON_CONTINENTAL,
  Pkm.VIVILLON_GARDEN,
  Pkm.VIVILLON_ELEGANT,
  Pkm.VIVILLON_MODERN,
  Pkm.VIVILLON_MARINE,
  Pkm.VIVILLON_ARCHIPELAGO,
  Pkm.VIVILLON_HIGH_PLAINS,
  Pkm.VIVILLON_SANDSTORM,
  Pkm.VIVILLON_RIVER,
  Pkm.VIVILLON_MONSOON,
  Pkm.VIVILLON_SAVANNA,
  Pkm.VIVILLON_SUN,
  Pkm.VIVILLON_OCEAN,
  Pkm.VIVILLON_JUNGLE,
  Pkm.VIVILLON_FANCY,
  Pkm.VIVILLON_POKE_BALL,
  Pkm.SILVALLY_FIGHTING,
  Pkm.SILVALLY_FLYING,
  Pkm.SILVALLY_POISON,
  Pkm.SILVALLY_GROUND,
  Pkm.SILVALLY_ROCK,
  Pkm.SILVALLY_BUG,
  Pkm.SILVALLY_GHOST,
  Pkm.SILVALLY_STEEL,
  Pkm.SILVALLY_FIRE,
  Pkm.SILVALLY_WATER,
  Pkm.SILVALLY_GRASS,
  Pkm.SILVALLY_ELECTRIC,
  Pkm.SILVALLY_PSYCHIC,
  Pkm.SILVALLY_ICE,
  Pkm.SILVALLY_DRAGON,
  Pkm.SILVALLY_DARK,
  Pkm.SILVALLY_FAIRY,
  Pkm.ARCEUS_BUG,
  Pkm.ARCEUS_DARK,
  Pkm.ARCEUS_DRAGON,
  Pkm.ARCEUS_ELECTRIC,
  Pkm.ARCEUS_FIGHTING,
  Pkm.ARCEUS_FIRE,
  Pkm.ARCEUS_FLYING,
  Pkm.ARCEUS_GHOST,
  Pkm.ARCEUS_GRASS,
  Pkm.ARCEUS_GROUND,
  Pkm.ARCEUS_ICE,
  Pkm.ARCEUS_POISON,
  Pkm.ARCEUS_PSYCHIC,
  Pkm.ARCEUS_ROCK,
  Pkm.ARCEUS_STEEL,
  Pkm.ARCEUS_WATER,
  Pkm.ARCEUS_FAIRY
]

export type PkmColorVariant = (typeof PkmColorVariants)[number]

export const PkmColorVariantsByPkm = {
  [Pkm.FLABEBE]: [
    Pkm.FLABEBE_YELLOW,
    Pkm.FLABEBE_ORANGE,
    Pkm.FLABEBE_BLUE,
    Pkm.FLABEBE_WHITE
  ],
  [Pkm.FLOETTE]: [
    Pkm.FLOETTE_YELLOW,
    Pkm.FLOETTE_ORANGE,
    Pkm.FLOETTE_BLUE,
    Pkm.FLOETTE_WHITE
  ],
  [Pkm.FLORGES]: [
    Pkm.FLORGES_YELLOW,
    Pkm.FLORGES_ORANGE,
    Pkm.FLORGES_BLUE,
    Pkm.FLORGES_WHITE
  ],
  [Pkm.MINIOR]: [
    Pkm.MINIOR_KERNEL_RED,
    Pkm.MINIOR_KERNEL_ORANGE,
    Pkm.MINIOR_KERNEL_GREEN,
    Pkm.MINIOR_KERNEL_BLUE
  ],
  [Pkm.VIVILLON]: [
    Pkm.VIVILLON_ICY_SNOW,
    Pkm.VIVILLON_POLAR,
    Pkm.VIVILLON_TUNDRA,
    Pkm.VIVILLON_CONTINENTAL,
    Pkm.VIVILLON_GARDEN,
    Pkm.VIVILLON_ELEGANT,
    Pkm.VIVILLON_MODERN,
    Pkm.VIVILLON_MARINE,
    Pkm.VIVILLON_ARCHIPELAGO,
    Pkm.VIVILLON_HIGH_PLAINS,
    Pkm.VIVILLON_SANDSTORM,
    Pkm.VIVILLON_RIVER,
    Pkm.VIVILLON_MONSOON,
    Pkm.VIVILLON_SAVANNA,
    Pkm.VIVILLON_SUN,
    Pkm.VIVILLON_OCEAN,
    Pkm.VIVILLON_JUNGLE,
    Pkm.VIVILLON_FANCY,
    Pkm.VIVILLON_POKE_BALL
  ],
  [Pkm.SILVALLY]: [
    Pkm.SILVALLY_FIGHTING,
    Pkm.SILVALLY_FLYING,
    Pkm.SILVALLY_POISON,
    Pkm.SILVALLY_GROUND,
    Pkm.SILVALLY_ROCK,
    Pkm.SILVALLY_BUG,
    Pkm.SILVALLY_GHOST,
    Pkm.SILVALLY_STEEL,
    Pkm.SILVALLY_FIRE,
    Pkm.SILVALLY_WATER,
    Pkm.SILVALLY_GRASS,
    Pkm.SILVALLY_ELECTRIC,
    Pkm.SILVALLY_PSYCHIC,
    Pkm.SILVALLY_ICE,
    Pkm.SILVALLY_DRAGON,
    Pkm.SILVALLY_DARK,
    Pkm.SILVALLY_FAIRY
  ],
  [Pkm.ARCEUS]: [
    Pkm.ARCEUS_BUG,
    Pkm.ARCEUS_DARK,
    Pkm.ARCEUS_DRAGON,
    Pkm.ARCEUS_ELECTRIC,
    Pkm.ARCEUS_FIGHTING,
    Pkm.ARCEUS_FIRE,
    Pkm.ARCEUS_FLYING,
    Pkm.ARCEUS_GHOST,
    Pkm.ARCEUS_GRASS,
    Pkm.ARCEUS_GROUND,
    Pkm.ARCEUS_ICE,
    Pkm.ARCEUS_POISON,
    Pkm.ARCEUS_PSYCHIC,
    Pkm.ARCEUS_ROCK,
    Pkm.ARCEUS_STEEL,
    Pkm.ARCEUS_WATER,
    Pkm.ARCEUS_FAIRY
  ]
} satisfies { [base in Pkm]?: PkmColorVariant[] }

export type PkmWithColorVariant = keyof typeof PkmColorVariantsByPkm

export function getPokemonBaseline(name: Pkm) {
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
      if (PkmFamily[name] === Pkm.UNOWN_A) {
        return name
      }
      return PkmFamily[name]
  }
}

export function isSameFamily(pkm1: Pkm, pkm2: Pkm): boolean {
  return getPokemonBaseline(pkm1) === getPokemonBaseline(pkm2)
}
