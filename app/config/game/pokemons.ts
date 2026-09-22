import { sortSynergies } from "../../models/colyseus-models/synergies"
import { FlowerPot, type IPlayer } from "../../types"
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
  Pkm.UNOWN_D,
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
      const synergiesSorted = sortSynergies(player.synergies.toMap())
      const synergyVivillon =
        synergiesSorted
          .map(([type]) => type)
          .find((type) => type in VivillonFormPerSynergy) ?? Synergy.NORMAL
      return VivillonFormPerSynergy[synergyVivillon]
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
  Pkm.GALARIAN_DARMANITAN_ZEN,
  Pkm.MAUSHOLD_FOUR,
  Pkm.HOOPA_UNBOUND,
  Pkm.AEGISLASH_BLADE,
  Pkm.MIMIKYU_BUSTED,
  Pkm.MORPEKO_HANGRY,

  Pkm.DEOXYS_ATTACK,
  Pkm.DEOXYS_DEFENSE,
  Pkm.DEOXYS_SPEED,

  Pkm.LYCANROC_NIGHT,
  Pkm.LYCANROC_DUSK,

  Pkm.TATSUGIRI_DROOPY,
  Pkm.TATSUGIRI_STRETCHY,

  Pkm.KECLEON_PURPLE
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
  [Pkm.GALARIAN_DARMANITAN]: [Pkm.GALARIAN_DARMANITAN_ZEN],
  [Pkm.MAUSHOLD_THREE]: [Pkm.MAUSHOLD_FOUR],
  [Pkm.HOOPA]: [Pkm.HOOPA_UNBOUND],
  [Pkm.AEGISLASH]: [Pkm.AEGISLASH_BLADE],
  [Pkm.MIMIKYU]: [Pkm.MIMIKYU_BUSTED],
  [Pkm.MORPEKO]: [Pkm.MORPEKO_HANGRY],
  [Pkm.DEOXYS]: [Pkm.DEOXYS_ATTACK, Pkm.DEOXYS_DEFENSE, Pkm.DEOXYS_SPEED],
  [Pkm.LYCANROC_DAY]: [Pkm.LYCANROC_NIGHT, Pkm.LYCANROC_DUSK],
  [Pkm.TATSUGIRI_CURLY]: [Pkm.TATSUGIRI_DROOPY, Pkm.TATSUGIRI_STRETCHY],
  [Pkm.KECLEON]: [Pkm.KECLEON_PURPLE]
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

export function getAllAltForms(pkm: Pkm): Pkm[] {
  const base = getBaseAltForm(pkm)
  return base in PkmAltFormsByPkm
    ? [base, ...(PkmAltFormsByPkm[base] as Pkm[])]
    : [pkm]
}

export type PkmWithTroopers =
  | Pkm.FALINKS_BRASS
  | Pkm.AVALUGG
  | Pkm.HISUI_AVALUGG

export const Troopers = [Pkm.FALINKS_TROOPER, Pkm.BERGMITE] as const

export const MaxTroopersPerPkm: { [key in PkmWithTroopers]: number } = {
  [Pkm.FALINKS_BRASS]: 8,
  [Pkm.AVALUGG]: 4,
  [Pkm.HISUI_AVALUGG]: 4
}

export const VivillonFormPerSynergy = {
  [Synergy.SOUND]: Pkm.VIVILLON,
  [Synergy.NORMAL]: Pkm.VIVILLON_ICY_SNOW,
  [Synergy.GHOST]: Pkm.VIVILLON_POLAR,
  [Synergy.ICE]: Pkm.VIVILLON_TUNDRA,
  [Synergy.FOSSIL]: Pkm.VIVILLON_CONTINENTAL,
  [Synergy.GRASS]: Pkm.VIVILLON_GARDEN,
  [Synergy.PSYCHIC]: Pkm.VIVILLON_ELEGANT,
  [Synergy.FIELD]: Pkm.VIVILLON_MODERN,
  [Synergy.WATER]: Pkm.VIVILLON_MARINE,
  [Synergy.FIGHTING]: Pkm.VIVILLON_ARCHIPELAGO,
  [Synergy.HUMAN]: Pkm.VIVILLON_HIGH_PLAINS,
  [Synergy.ROCK]: Pkm.VIVILLON_SANDSTORM,
  [Synergy.AQUATIC]: Pkm.VIVILLON_RIVER,
  [Synergy.STEEL]: Pkm.VIVILLON_MONSOON,
  [Synergy.ELECTRIC]: Pkm.VIVILLON_SAVANNA,
  [Synergy.FIRE]: Pkm.VIVILLON_SUN,
  [Synergy.LIGHT]: Pkm.VIVILLON_OCEAN,
  [Synergy.POISON]: Pkm.VIVILLON_JUNGLE,
  [Synergy.FAIRY]: Pkm.VIVILLON_FANCY,
  [Synergy.ARTIFICIAL]: Pkm.VIVILLON_POKE_BALL
} satisfies { [key in Synergy]?: Pkm }


export const ArceusFormPerSynergy = {
  [Synergy.BUG]: Pkm.ARCEUS_BUG,
  [Synergy.DARK]: Pkm.ARCEUS_DARK,
  [Synergy.DRAGON]: Pkm.ARCEUS_DRAGON,
  [Synergy.FOSSIL]: Pkm.ARCEUS_DRAGON,
  [Synergy.ELECTRIC]: Pkm.ARCEUS_ELECTRIC,
  [Synergy.FIGHTING]: Pkm.ARCEUS_FIGHTING,
  [Synergy.WILD]: Pkm.ARCEUS_FIGHTING,
  [Synergy.FIRE]: Pkm.ARCEUS_FIRE,
  [Synergy.GOURMET]: Pkm.ARCEUS_FIRE,
  [Synergy.FLYING]: Pkm.ARCEUS_FLYING,
  [Synergy.GHOST]: Pkm.ARCEUS_GHOST,
  [Synergy.GRASS]: Pkm.ARCEUS_GRASS,
  [Synergy.FLORA]: Pkm.ARCEUS_GRASS,
  [Synergy.GROUND]: Pkm.ARCEUS_GROUND,
  [Synergy.FIELD]: Pkm.ARCEUS_GROUND,
  [Synergy.ICE]: Pkm.ARCEUS_ICE,
  [Synergy.POISON]: Pkm.ARCEUS_POISON,
  [Synergy.MONSTER]: Pkm.ARCEUS_POISON,
  [Synergy.PSYCHIC]: Pkm.ARCEUS_PSYCHIC,
  [Synergy.SOUND]: Pkm.ARCEUS_PSYCHIC,
  [Synergy.ROCK]: Pkm.ARCEUS_ROCK,
  [Synergy.STEEL]: Pkm.ARCEUS_STEEL,
  [Synergy.ARTIFICIAL]: Pkm.ARCEUS_STEEL,
  [Synergy.WATER]: Pkm.ARCEUS_WATER,
  [Synergy.AQUATIC]: Pkm.ARCEUS_WATER,
  [Synergy.FAIRY]: Pkm.ARCEUS_FAIRY,
  [Synergy.AMORPHOUS]: Pkm.ARCEUS_FAIRY,
  [Synergy.HUMAN]: Pkm.ARCEUS,
  [Synergy.LIGHT]: Pkm.ARCEUS,
  [Synergy.BABY]: Pkm.ARCEUS,
  [Synergy.NORMAL]: Pkm.ARCEUS
} satisfies { [key in Synergy]: Pkm }
