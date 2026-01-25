import { FlowerPot } from "../../core/flower-pots"
import { IPlayer } from "../../types"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { isIn } from "../../utils/array"

export const EvolutionTime = {
  EGG_HATCH: 5,
  EVOLVE_HATCH: 5
}

export const UnownsStage1 = [
  Pkm.UNOWN_A,
  Pkm.UNOWN_C,
  Pkm.UNOWN_D,
  Pkm.UNOWN_E,
  Pkm.UNOWN_F,
  Pkm.UNOWN_G,
  Pkm.UNOWN_I,
  Pkm.UNOWN_O,
  Pkm.UNOWN_R,
  Pkm.UNOWN_T,
  Pkm.UNOWN_V,
  Pkm.UNOWN_W
]

export const UnownsStage2 = [
  Pkm.UNOWN_A,
  Pkm.UNOWN_B,
  Pkm.UNOWN_C,
  Pkm.UNOWN_D,
  Pkm.UNOWN_G,
  Pkm.UNOWN_H,
  Pkm.UNOWN_I,
  Pkm.UNOWN_J,
  Pkm.UNOWN_K,
  Pkm.UNOWN_L,
  Pkm.UNOWN_M,
  Pkm.UNOWN_N,
  Pkm.UNOWN_O,
  Pkm.UNOWN_P,
  Pkm.UNOWN_Q,
  Pkm.UNOWN_R,
  Pkm.UNOWN_S,
  Pkm.UNOWN_T,
  Pkm.UNOWN_U,
  Pkm.UNOWN_V,
  Pkm.UNOWN_W,
  Pkm.UNOWN_X,
  Pkm.UNOWN_Y,
  Pkm.UNOWN_Z,
  Pkm.UNOWN_QUESTION
]

export const UnownsStage3 = [
  Pkm.UNOWN_B,
  Pkm.UNOWN_H,
  Pkm.UNOWN_J,
  Pkm.UNOWN_K,
  Pkm.UNOWN_L,
  Pkm.UNOWN_M,
  Pkm.UNOWN_N,
  Pkm.UNOWN_O,
  Pkm.UNOWN_P,
  Pkm.UNOWN_R,
  Pkm.UNOWN_S,
  Pkm.UNOWN_U,
  Pkm.UNOWN_V,
  Pkm.UNOWN_W,
  Pkm.UNOWN_X,
  Pkm.UNOWN_Y,
  Pkm.UNOWN_Z,
  Pkm.UNOWN_QUESTION,
  Pkm.UNOWN_EXCLAMATION
]

export function getUnownsPoolPerStage(stageLevel: number) {
  if (stageLevel < 10) return UnownsStage1
  else if (stageLevel < 20) return UnownsStage2
  else return UnownsStage3
}

export function getAltFormForPlayer(pkm: Pkm, player: IPlayer): Pkm {
  const basePkm = getBaseAltForm(pkm)
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

export const PkmAltForms: readonly Pkm[] = [
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
  Pkm.ARCEUS_FAIRY,

  Pkm.ALCREMIE_RUBY,
  Pkm.ALCREMIE_MATCHA,
  Pkm.ALCREMIE_MINT,
  Pkm.ALCREMIE_LEMON,
  Pkm.ALCREMIE_SALTED,
  Pkm.ALCREMIE_RUBY_SWIRL,
  Pkm.ALCREMIE_CARAMEL_SWIRL,
  Pkm.ALCREMIE_RAINBOW_SWIRL,

  Pkm.OGERPON_CORNERSTONE,
  Pkm.OGERPON_CORNERSTONE_MASK,
  Pkm.OGERPON_HEARTHFLAME,
  Pkm.OGERPON_HEARTHFLAME_MASK,
  Pkm.OGERPON_WELLSPRING,
  Pkm.OGERPON_WELLSPRING_MASK,
  Pkm.OGERPON_TEAL_MASK,

  Pkm.BASCULIN_BLUE,
  Pkm.BASCULIN_RED,
  Pkm.BASCULEGION_FEMALE,

  Pkm.DARMANITAN_ZEN,
  Pkm.MAUSHOLD_FOUR,
  Pkm.HOOPA_UNBOUND,
  Pkm.AEGISLASH_BLADE,
  Pkm.MIMIKYU_BUSTED,
  Pkm.MORPEKO_HANGRY,

  Pkm.DEOXYS_ATTACK,
  Pkm.DEOXYS_DEFENSE,
  Pkm.DEOXYS_SPEED,

  Pkm.LYCANROC_NIGHT,
  Pkm.LYCANROC_DUSK
]

export type PkmAltForm = (typeof PkmAltForms)[number]

export const PkmAltFormsByPkm = {
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
  ],
  [Pkm.ALCREMIE_VANILLA]: [
    Pkm.ALCREMIE_RUBY,
    Pkm.ALCREMIE_MATCHA,
    Pkm.ALCREMIE_MINT,
    Pkm.ALCREMIE_LEMON,
    Pkm.ALCREMIE_SALTED,
    Pkm.ALCREMIE_RUBY_SWIRL,
    Pkm.ALCREMIE_CARAMEL_SWIRL,
    Pkm.ALCREMIE_RAINBOW_SWIRL
  ],
  [Pkm.OGERPON_TEAL]: [
    Pkm.OGERPON_TEAL_MASK,
    Pkm.OGERPON_CORNERSTONE,
    Pkm.OGERPON_CORNERSTONE_MASK,
    Pkm.OGERPON_HEARTHFLAME,
    Pkm.OGERPON_HEARTHFLAME_MASK,
    Pkm.OGERPON_WELLSPRING,
    Pkm.OGERPON_WELLSPRING_MASK
  ],

  [Pkm.BASCULIN_WHITE]: [Pkm.BASCULIN_BLUE, Pkm.BASCULIN_RED],
  [Pkm.BASCULEGION_MALE]: [Pkm.BASCULEGION_FEMALE],
  [Pkm.DARMANITAN]: [Pkm.DARMANITAN_ZEN],
  [Pkm.MAUSHOLD_FOUR]: [Pkm.MAUSHOLD_THREE],
  [Pkm.HOOPA]: [Pkm.HOOPA_UNBOUND],
  [Pkm.AEGISLASH]: [Pkm.AEGISLASH_BLADE],
  [Pkm.MIMIKYU]: [Pkm.MIMIKYU_BUSTED],
  [Pkm.MORPEKO]: [Pkm.MORPEKO_HANGRY],
  [Pkm.DEOXYS]: [Pkm.DEOXYS_ATTACK, Pkm.DEOXYS_DEFENSE, Pkm.DEOXYS_SPEED],
  [Pkm.LYCANROC_DAY]: [Pkm.LYCANROC_NIGHT, Pkm.LYCANROC_DUSK]
} satisfies { [base in Pkm]?: PkmAltForm[] }

export type PkmWithAltForm = keyof typeof PkmAltFormsByPkm

export const PkmsWithAltForms: Pkm[] = Object.entries(PkmAltFormsByPkm).reduce(
  (acc, [base, forms]) => {
    acc.push(base as Pkm)
    acc.push(...forms)
    return acc
  },
  [] as Pkm[]
)

export function getBaseAltForm(pkm: Pkm): Pkm {
  if (pkm in PkmAltFormsByPkm) {
    return pkm
  }
  for (const [base, forms] of Object.entries(PkmAltFormsByPkm)) {
    if (isIn(forms, pkm)) {
      return base as Pkm
    }
  }
  return pkm
}
