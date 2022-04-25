import { Synergy } from "./enum/Synergy";
import { Pkm } from "./enum/Pokemon";
import { Item } from "./enum/Item";
import { Effect } from "./enum/Effect";
import { Rarity } from "./enum/Game";

export const RARITY_HP_COST= Object.freeze({
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 1,
  [Rarity.RARE]: 2,
  [Rarity.EPIC]: 2,
  [Rarity.LEGENDARY]: 3,
  [Rarity.MYTHICAL]: 4,
  [Rarity.NEUTRAL]: 2,
  [Rarity.SUMMON]: 1
});


export const COST = Object.freeze({
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 2,
  [Rarity.RARE]: 3,
  [Rarity.EPIC]: 4,
  [Rarity.MYTHICAL]: 6,
  [Rarity.LEGENDARY]: 5,
  [Rarity.SUMMON]: 0
});

export const EXP_TABLE = Object.freeze({
  1: 0,
  2: 2,
  3: 6,
  4: 10,
  5: 20,
  6: 32,
  7: 50,
  8: 70,
  9: -1
});

export const TYPE_TRIGGER = {
  [Synergy.NORMAL]: [3, 6, 9],
  [Synergy.GRASS]: [3, 5, 7],
  [Synergy.FIRE]: [2, 4, 6],
  [Synergy.WATER]: [3, 6, 9],
  [Synergy.ELECTRIC]: [2, 4, 6],
  [Synergy.FIGHTING]: [2, 4],
  [Synergy.PSYCHIC]: [2, 4, 6],
  [Synergy.DARK]: [2, 4, 6],
  [Synergy.METAL]: [2, 4],
  [Synergy.GROUND]: [2, 4, 6],
  [Synergy.POISON]: [3, 6],
  [Synergy.DRAGON]: [3, 5],
  [Synergy.FIELD]: [3, 6, 9],
  [Synergy.MONSTER]: [2, 4, 6],
  [Synergy.HUMAN]: [2, 4, 6],
  [Synergy.AQUATIC]: [2, 4],
  [Synergy.BUG]: [2, 5],
  [Synergy.FLYING]: [2, 4, 6, 8],
  [Synergy.FLORA]: [2, 3, 4, 5],
  [Synergy.MINERAL]: [2, 4, 6],
  [Synergy.GHOST]: [2, 4],
  [Synergy.FAIRY]: [2, 4, 6],
  [Synergy.ICE]: [2, 4],
  [Synergy.FOSSIL]: [2, 4, 6],
  [Synergy.SOUND]: [3, 5, 7]
};

export const XP_TABLE = [1000, 1500, 2000, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000];
export const XP_PLACE = [700, 500, 400, 300, 200, 150, 100, 0];
export const RARITY_COLOR = Object.freeze({
  [Rarity.COMMON]: '#686d7d',
  [Rarity.NEUTRAL]: '#686d7d',
  [Rarity.UNCOMMON]: '#478a41',
  [Rarity.RARE]: '#5062ab',
  [Rarity.EPIC]: '#7b469c',
  [Rarity.LEGENDARY]: '#a6802e',
  [Rarity.MYTHICAL]: '#ffc0cb',
  [Rarity.SUMMON]: '#991f1f'
});
export const PROBABILITY = {
  1: [1, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0],
  3: [0.7, 0.3, 0, 0, 0],
  4: [0.55, 0.3, 0.15, 0, 0],
  5: [0.4, 0.3, 0.25, 0.05, 0],
  6: [0.29, 0.295, 0.31, 0.1, 0.005],
  7: [0.24, 0.28, 0.31, 0.15, 0.02],
  8: [0.2, 0.24, 0.31, 0.2, 0.05],
  9: [0.1, 0.19, 0.31, 0.30, 0.1]
};
export const EFFECTS_ICON = Object.freeze({
  [Effect.INGRAIN] : {
    level: 1,
    positive: true,
    type: Synergy.GRASS
  },
  [Effect.GROWTH] : {
    level: 2,
    positive: true,
    type: Synergy.GRASS
  },
  [Effect.SPORE] : {
    level: 3,
    positive: true,
    type: Synergy.GRASS
  },
  [Effect.BLAZE] : {
    level: 1,
    positive: true,
    type: Synergy.FIRE
  },
  [Effect.DROUGHT] : {
    level: 2,
    positive: true,
    type: Synergy.FIRE
  },
  [Effect.DESOLATE_LAND] : {
    level: 3,
    positive: true,
    type: Synergy.FIRE
  },
  [Effect.DRIZZLE] : {
    level: 1,
    positive: true,
    type: Synergy.WATER
  },
  [Effect.RAIN_DANCE] : {
    level: 2,
    positive: true,
    type: Synergy.WATER
  },
  [Effect.PRIMORDIAL_SEA] : {
    level: 3,
    positive: true,
    type: Synergy.WATER
  },
  [Effect.STAMINA] : {
    level: 1,
    positive: true,
    type: Synergy.NORMAL
  },
  [Effect.STRENGTH] : {
    level: 2,
    positive: true,
    type: Synergy.NORMAL
  },
  [Effect.PURE_POWER] : {
    level: 3,
    positive: true,
    type: Synergy.NORMAL
  },
  [Effect.EERIE_IMPULSE] : {
    level: 1,
    positive: true,
    type: Synergy.ELECTRIC
  },
  [Effect.RISING_VOLTAGE] : {
    level: 2,
    positive: true,
    type: Synergy.ELECTRIC
  },
  [Effect.OVERDRIVE] : {
    level: 3,
    positive: true,
    type: Synergy.ELECTRIC
  },
  [Effect.REVENGE] : {
    level: 1,
    positive: true,
    type: Synergy.FIGHTING
  },
  [Effect.PUNISHMENT] : {
    level: 2,
    positive: true,
    type: Synergy.FIGHTING
  },
  [Effect.AMNESIA] : {
    level: 1,
    positive: true,
    type: Synergy.PSYCHIC
  },
  [Effect.LIGHT_SCREEN] : {
    level: 2,
    positive: true,
    type: Synergy.PSYCHIC
  },
  [Effect.EERIE_SPELL] : {
    level: 3,
    positive: true,
    type: Synergy.PSYCHIC
  },
  [Effect.HONE_CLAWS] : {
    level: 1,
    positive: true,
    type: Synergy.DARK
  },
  [Effect.ASSURANCE] : {
    level: 2,
    positive: true,
    type: Synergy.DARK
  },
  [Effect.BEAT_UP] : {
    level: 3,
    positive: true,
    type: Synergy.DARK
  },
  [Effect.IRON_DEFENSE] : {
    level: 1,
    positive: true,
    type: Synergy.METAL
  },
  [Effect.AUTOTOMIZE] : {
    level: 2,
    positive: true,
    type: Synergy.METAL
  },
  [Effect.SHORE_UP] : {
    level: 1,
    positive: true,
    type: Synergy.GROUND
  },
  [Effect.ROTOTILLER] : {
    level: 2,
    positive: true,
    type: Synergy.GROUND
  },
  [Effect.SANDSTORM] : {
    level: 3,
    positive: true,
    type: Synergy.GROUND
  },
  [Effect.POISON_GAS] : {
    level: 1,
    positive: true,
    type: Synergy.POISON
  },
  [Effect.TOXIC] : {
    level: 2,
    positive: true,
    type: Synergy.POISON
  },
  [Effect.DRAGON_ENERGY] : {
    level: 1,
    positive: true,
    type: Synergy.DRAGON
  },
  [Effect.DRAGON_DANCE] : {
    level: 2,
    positive: true,
    type: Synergy.DRAGON
  },
  [Effect.BULK_UP] : {
    level: 1,
    positive: true,
    type: Synergy.FIELD
  },
  [Effect.RAGE] : {
    level: 2,
    positive: true,
    type: Synergy.FIELD
  },
  [Effect.ANGER_POINT] : {
    level: 3,
    positive: true,
    type: Synergy.FIELD
  },
  [Effect.PURSUIT] : {
    level: 1,
    positive: true,
    type: Synergy.MONSTER
  },
  [Effect.BRUTAL_SWING] : {
    level: 2,
    positive: true,
    type: Synergy.MONSTER
  },
  [Effect.POWER_TRIP] : {
    level: 3,
    positive: true,
    type: Synergy.MONSTER
  },
  [Effect.MEDITATE] : {
    level: 1,
    positive: true,
    type: Synergy.HUMAN
  },
  [Effect.FOCUS_ENERGY] : {
    level: 2,
    positive: true,
    type: Synergy.HUMAN
  },
  [Effect.CALM_MIND] : {
    level: 3,
    positive: true,
    type: Synergy.HUMAN
  },
  [Effect.SWARM] : {
    level: 1,
    positive: true,
    type: Synergy.BUG
  },
  [Effect.STICKY_WEB] : {
    level: 2,
    positive: true,
    type: Synergy.BUG
  },
  [Effect.SWIFT_SWIM] : {
    level: 1,
    positive: true,
    type: Synergy.AQUATIC
  },
  [Effect.HYDRO_CANNON] : {
    level: 2,
    positive: true,
    type: Synergy.AQUATIC
  },
  [Effect.TAILWIND] : {
    level: 1,
    positive: true,
    type: Synergy.FLYING
  },
  [Effect.FEATHER_DANCE] : {
    level: 2,
    positive: true,
    type: Synergy.FLYING
  },
  [Effect.MAX_AIRSTREAM] : {
    level: 3,
    positive: true,
    type: Synergy.FLYING
  },
  [Effect.MAX_GUARD] : {
    level: 4,
    positive: true,
    type: Synergy.FLYING
  },
  [Effect.ODD_FLOWER] : {
    level: 1,
    positive: true,
    type: Synergy.FLORA
  },
  [Effect.GLOOM_FLOWER] : {
    level: 2,
    positive: true,
    type: Synergy.FLORA
  },
  [Effect.VILE_FLOWER] : {
    level: 3,
    positive: true,
    type: Synergy.FLORA
  },
  [Effect.SUN_FLOWER] : {
    level: 4,
    positive: true,
    type: Synergy.FLORA
  },
  [Effect.BATTLE_ARMOR] : {
    level: 1,
    positive: true,
    type: Synergy.MINERAL
  },
  [Effect.MOUTAIN_RESISTANCE] : {
    level: 2,
    positive: true,
    type: Synergy.MINERAL
  },
  [Effect.DIAMOND_STORM] : {
    level: 3,
    positive: true,
    type: Synergy.MINERAL
  },
  [Effect.PHANTOM_FORCE] : {
    level: 1,
    positive: true,
    type: Synergy.GHOST
  },
  [Effect.CURSE] : {
    level: 2,
    positive: true,
    type: Synergy.GHOST
  },
  [Effect.AROMATIC_MIST] : {
    level: 1,
    positive: true,
    type: Synergy.FAIRY
  },
  [Effect.FAIRY_WIND] : {
    level: 2,
    positive: true,
    type: Synergy.FAIRY
  },
  [Effect.GROUND] : {
    level: 0,
    positive: true,
    type: Synergy.GROUND
  },
  [Effect.GRASS] : {
    level: 0,
    positive: true,
    type: Synergy.GRASS
  },
  [Effect.FIRE] : {
    level: 0,
    positive: true,
    type: Synergy.FIRE
  },
  [Effect.WATER] : {
    level: 0,
    positive: true,
    type: Synergy.WATER
  },
  [Effect.NORMAL] : {
    level: 0,
    positive: true,
    type: Synergy.NORMAL
  },
  [Effect.ICE] : {
    level: 0,
    positive: true,
    type: Synergy.ICE
  },
  [Effect.SNOW] : {
    level: 1,
    positive: true,
    type: Synergy.ICE
  },
  [Effect.SHEER_COLD] : {
    level: 2,
    positive: true,
    type: Synergy.ICE
  },
  [Effect.ANCIENT_POWER] : {
    level: 1,
    positive: true,
    type: Synergy.FOSSIL
  },
  [Effect.ELDER_POWER] : {
    level: 2,
    positive: true,
    type: Synergy.FOSSIL
  },
  [Effect.UNOWN_GATHERINGS] : {
    level: 3,
    positive: true,
    type: Synergy.FOSSIL
  },
  [Effect.LARGO] : {
    level: 1,
    positive: true,
    type: Synergy.SOUND
  },
  [Effect.ALLEGRO] : {
    level: 2,
    positive: true,
    type: Synergy.SOUND
  },
  [Effect.PRESTO] : {
    level: 3,
    positive: true,
    type: Synergy.SOUND
  }
});
  

  export const NEUTRAL_STAGE = [
    {
      turn: 1,
      avatar: Pkm.MAGIKARP
    },
    {
      turn: 2,
      avatar: Pkm.RATICATE
    },
    {
      turn: 3,
      avatar: Pkm.FEAROW
    },
    {
      turn: 10,
      avatar: Pkm.GYARADOS
    },
    {
      turn: 15,
      avatar: Pkm.LUGIA
    },
    {
      turn: 20,
      avatar: Pkm.GIRATINA
    },
    {
      turn: 25,
      avatar: Pkm.ZAPDOS
    },
    {
      turn: 30,
      avatar: Pkm.DIALGA
    },
    {
      turn: 35,
      avatar: Pkm.SUICUNE
    },
    {
      turn: 40,
      avatar: Pkm.REGICE
    },
    {
      turn: 45,
      avatar: Pkm.RAYQUAZA
    },
    {
      turn: 50,
      avatar: Pkm.RAYQUAZA
    },
    {
      turn: 55,
      avatar: Pkm.RAYQUAZA
    }];


    export const FLYING_PROTECT_THRESHOLD = Object.freeze({
      TAILWIND: {
        duration: 1000,
        threshold: 0.2
      },
      FEATHER_DANCE: {
        duration: 2000,
        threshold: 0.4
      },
      MAX_AIRSTREAM: {
        duration: 3000,
        threshold: 0.5
      },
      MAX_GUARD: {
        duration: 4000,
        threshold: 0.5
      }
    });

    export const RANK = Object.freeze({
      DIAMOND: {
        id: 'DIAMOND',
        threshold: 1400
      },
      PLATINUM: {
        id: 'PLATINUM',
        threshold: 1250
      },
      GOLD: {
        id: 'GOLD',
        threshold: 1100
      },
      SILVER: {
        id: 'SILVER',
        threshold: 900
      },
      BRONZE: {
        id: 'BRONZE',
        threshold: 0
      }
    });
    
    export const HDR = Object.freeze({
      WALL: 'WALL',
      WALL_ALT_1: 'WALL_ALT_1',
      WALL_ALT_2: 'WALL_ALT_2',
      WALL_ALT_3: 'WALL_ALT_3',
      GROUND: 'GROUND',
      GROUND_ALT_1: 'GROUND_ALT_1',
      GROUND_ALT_2: 'GROUND_ALT_2',
      GROUND_ALT_3: 'GROUND_ALT_3',
      GROUND_ALT_4: 'GROUND_ALT_4',
      WATER: 'WATER',
      ABYSS: 'ABYSS',
      ABYSS_ALT_1: 'ABYSS_ALT_1',
      ABYSS_ALT_2: 'ABYSS_ALT_2'
    });
    
    export const MAP = Object.freeze({
      FOURTH_STATION_PATH: {
        id: 'FOURTH_STATION_PATH',
        name: '4th Station Path',
        pokemons: [Pkm.IVYSAUR, Pkm.METAPOD, Pkm.RATICATE, Pkm.WEEPINBELL, Pkm.BAYLEEF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.TORTERRA, Pkm.SKUNTANK, Pkm.URSARING, Pkm.BIBAREL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      SEVEN_STATION_PATH: {
        id: 'SEVEN_STATION_PATH',
        name: '7th Station Path',
        pokemons: [Pkm.SKUNTANK, Pkm.FEAROW, Pkm.PRIMEAPE, Pkm.MAROWAK, Pkm.HITMONCHAN, Pkm.FURRET, Pkm.URSARING, Pkm.SHEDNINJA, Pkm.BIBAREL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FIGHTING
      },
      BARREN_VALLEY: {
        id: 'BARREN_VALLEY',
        name: 'Barren Valley',
        pokemons: [Pkm.JUMPLUFF, Pkm.FLYGON, Pkm.LUNATONE, Pkm.HONCHKROW, Pkm.GLAMEOW, Pkm.TOXICROAK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.DARK
      },
      DARK_ICE_MOUNTAIN_PEAK: {
        id: 'DARK_ICE_MOUNTAIN_PEAK',
        name: 'Dark Ice Mountain Peak',
        pokemons: [Pkm.GENGAR, Pkm.SKARMORY, Pkm.DUSKULL, Pkm.METANG, Pkm.LICKILICKY, Pkm.TANGROWTH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_ICE_MOUNTAIN: {
        id: 'DARK_ICE_MOUNTAIN',
        name: 'Dark Ice Mountain',
        pokemons: [Pkm.BANETTE, Pkm.GENGAR, Pkm.SKARMORY, Pkm.DUSKULL, Pkm.METANG, Pkm.LICKILICKY, Pkm.TANGROWTH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_WASTELAND: {
        id: 'DARK_WASTELAND',
        name: 'Dark Wasteland',
        pokemons: [Pkm.GASTLY, Pkm.ONIX, Pkm.MISDREAVUS, Pkm.SHIFTRY, Pkm.SOLROCK, Pkm.SKORUPI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DEEP_BOULDER_QUARRY: {
        id: 'DEEP_BOULDER_QUARRY',
        name: 'Deep Boulder Quarry',
        pokemons: [Pkm.CLAYDOL, Pkm.GLISCOR, Pkm.NINJASK, Pkm.MUK, Pkm.PROBOPASS, Pkm.SHELGON, Pkm.RHYDON, Pkm.TANGROWTH, Pkm.METANG, Pkm.STEELIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      LIMESTONE_CAVERN: {
        id: 'LIMESTONE_CAVERN',
        name: 'Limestone Cavern',
        pokemons: [Pkm.KINGLER, Pkm.MARILL, Pkm.SLOWKING, Pkm.VOLBEAT, Pkm.ILLUMISE, Pkm.SEVIPER, Pkm.DRAGONAIR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      DEEP_LIMESTONE_CAVERN: {
        id: 'DEEP_LIMESTONE_CAVERN',
        name: 'Deep Limestone Cavern',
        pokemons: [Pkm.DRAGONAIR, Pkm.AERODACTYL, Pkm.MASQUERAIN, Pkm.VOLBEAT, Pkm.ILLUMISE, Pkm.SEVIPER, Pkm.POLIWHIRL, Pkm.DUGTRIO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      ICICLE_FOREST: {
        id: 'ICICLE_FOREST',
        name: 'Icicle Forest',
        pokemons: [Pkm.GENGAR, Pkm.WEEZING, Pkm.CACTURNE, Pkm.METAGROSS, Pkm.LICKILICKY, Pkm.GLISCOR, Pkm.DRIFBLIM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ICE
      },
      MURKY_FOREST: {
        id: 'MURKY_FOREST',
        name: 'Murky Forest',
        pokemons: [Pkm.EXEGGCUTE, Pkm.HOOTHOOT, Pkm.HOPPIP, Pkm.DODUO, Pkm.WEEDLE, Pkm.BURMY, Pkm.SPINARAK, Pkm.WURMPLE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.BUG
      },
      SPACIAL_CLIFFS: {
        id: 'SPACIAL_CLIFFS',
        name: 'Spacial Cliffs',
        pokemons: [Pkm.HAUNTER, Pkm.BELDUM, Pkm.MISDREAVUS, Pkm.KOFFING, Pkm.SHEDNINJA, Pkm.BANETTE, Pkm.MISMAGIUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      TEMPORAL_SPIRE_FUTURE: {
        id: 'TEMPORAL_SPIRE_FUTURE',
        name: 'Temporal Spire Future',
        pokemons: [Pkm.GOLBAT, Pkm.ALAKAZAM, Pkm.MAGNETON, Pkm.GASTLY, Pkm.HYPNO, Pkm.CLAYDOL, Pkm.MISMAGIUS, Pkm.BRONZONG, Pkm.PORYGON_2, Pkm.CROBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TEMPORAL_TOWER_FUTURE: {
        id: 'TEMPORAL_TOWER_FUTURE',
        name: 'Temporal Tower Future',
        pokemons: [Pkm.ZUBAT, Pkm.KADABRA, Pkm.MAGNEMITE, Pkm.GASTLY, Pkm.DROWZEE, Pkm.CLAYDOL, Pkm.MISMAGIUS, Pkm.BRONZONG, Pkm.GOLBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      VAST_ICE_MOUNTAIN_PEAK: {
        id: 'VAST_ICE_MOUNTAIN_PEAK',
        name: 'Vast Ice Mountain Peak',
        pokemons: [Pkm.GENGAR, Pkm.AERODACTYL, Pkm.SMOOCHUM, Pkm.DUSCLOPS, Pkm.ABSOL, Pkm.METAGROSS, Pkm.MAGNEZONE, Pkm.GLISCOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      VAST_ICE_MOUNTAIN: {
        id: 'VAST_ICE_MOUNTAIN',
        name: 'Vast Ice Mountain',
        pokemons: [Pkm.GENGAR, Pkm.AERODACTYL, Pkm.SMOOCHUM, Pkm.DUSCLOPS, Pkm.ABSOL, Pkm.METAGROSS, Pkm.MAGNEZONE, Pkm.GLISCOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      AMP_PLAINS: {
        id: 'AMP_PLAINS',
        name: 'Amp Plains',
        pokemons: [Pkm.PLUSLE, Pkm.MINUN, Pkm.MAREEP, Pkm.PHANPY, Pkm.ELEKID, Pkm.SHINX, Pkm.GIRAFARIG, Pkm.ZAPDOS, Pkm.FLAFFY, Pkm.PIKACHU, Pkm.PICHU, Pkm.YANMEGA, Pkm.ELECTABUZZ],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      FAR_AMP_PLAINS: {
        id: 'FAR_AMP_PLAINS',
        name: 'Far Amp Plains',
        pokemons: [Pkm.SHINX, Pkm.GIRAFARIG, Pkm.PIKACHU, Pkm.PICHU, Pkm.YANMEGA, Pkm.FLAFFY, Pkm.ELECTABUZZ, Pkm.TAUROS, Pkm.DODRIO, Pkm.ELECTRIKE, Pkm.LUXIO, Pkm.LUXRAY, Pkm.AMPHAROS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      FINAL_MAZE_B23F: {
        id: 'FINAL_MAZE_B23F',
        name: 'Final Maze',
        pokemons: [Pkm.MACHOP, Pkm.MAGNEMITE, Pkm.DODUO, Pkm.OMANYTE, Pkm.KABUTO, Pkm.SPINARAK, Pkm.MAREEP, Pkm.MISDREAVUS, Pkm.SWINUB, Pkm.HOUNDOUR, Pkm.PHANPY, Pkm.MAGBY, Pkm. POOCHYENA, Pkm.SHROOMISH, Pkm.MAWILE, Pkm.MEDITITE, Pkm.BAGON, Pkm.STARAVIA, Pkm.SKORUPI, Pkm.CARNIVINE, Pkm.JIRACHI, Pkm.MOLTRES, Pkm.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      FOGGY_FOREST: {
        id: 'FOGGY_FOREST',
        name: 'Foggy Forest',
        pokemons: [Pkm.HOOTHOOT, Pkm.DUNSPARCE, Pkm.SMEARGLE, Pkm.CHERUBI, Pkm.SKIPLOOM, Pkm.ZIGZAGOON, Pkm.PACHIRISU, Pkm.NOCTOWL, Pkm.STANTLER, Pkm.BUNEARY, Pkm.PINSIR, Pkm. BRELOOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      FOREST_PATH: {
        id: 'FOREST_PATH',
        name: 'Forest Path',
        pokemons: [Pkm.PINSIR, Pkm.DUNSPARCE, Pkm.SWINUB, Pkm.HOUNDOUR, Pkm.LINOONE, Pkm.KRICKEROT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      GOLD_CHAMBER: {
        id: 'GOLD_CHAMBER',
        name: 'Gold Chamber',
        pokemons: [Pkm.MACHOP, Pkm.MAGNEMITE, Pkm.DODUO, Pkm.OMANYTE, Pkm.KABUTO, Pkm.SPINARAK, Pkm.MAREEP, Pkm.MISDREAVUS, Pkm.SWINUB, Pkm.HOUNDOUR, Pkm.PHANPY, Pkm.MAGBY, Pkm. POOCHYENA, Pkm.SHROOMISH, Pkm.MAWILE, Pkm.MEDITITE, Pkm.BAGON, Pkm.STARAVIA, Pkm.SKORUPI, Pkm.CARNIVINE, Pkm.JIRACHI, Pkm.MOLTRES, Pkm.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      HIDDEN_HIGHLAND: {
        id: 'HIDDEN_HIGHLAND',
        name: 'Hidden Highland',
        pokemons: [Pkm.DRAGONITE, Pkm.MANECTRIC, Pkm.TROPIUS, Pkm.RAMPARDOS, Pkm.BASTIODON, Pkm.PURUGLY, Pkm.GARCHOMP, Pkm.ABOMASNOW, Pkm.MAGMORTAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTERY_JUNGLE_01F_15F: {
        id: 'MYSTERY_JUNGLE_01F_15F',
        name: 'Mystery Jungle',
        pokemons: [Pkm.MEW, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.WALL_ALT_3, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTERY_JUNGLE_16F_30F: {
        id: 'MYSTERY_JUNGLE_16F_30F',
        name: 'Mystery Jungle',
        pokemons: [Pkm.MEW, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTIFYING_FOREST: {
        id: 'MYSTIFYING_FOREST',
        name: 'Mystifying Forest',
        pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      BEACH_CAVE: {
        id: 'BEACH_CAVE',
        name: 'Beach Cave',
        pokemons: [Pkm.SHELLDER, Pkm.SHELLOS, Pkm.KABUTO, Pkm.CORSOLA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.GROUND_ALT_4, HDR.WATER],
        type: Synergy.WATER
      },
      BOTTOMLESS_SEA: {
        id: 'BOTTOMLESS_SEA',
        name: 'Bottomless Sea',
        pokemons: [Pkm.KYOGRE, Pkm.GYARADOS, Pkm.REMORAID, Pkm.KINGDRA, Pkm.WAILMER, Pkm.CLAMPERL, Pkm.FINNEON, Pkm.TENTACRUEL, Pkm.SLOWBRO, Pkm.HORSEA, Pkm.SEADRA, Pkm.STARMIE, Pkm.SLOWKING, Pkm.LAPRAS, Pkm.WAILORD],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      BRINE_CAVE: {
        id: 'BRINE_CAVE',
        name: 'Brine Cave',
        pokemons: [Pkm.SEEL, Pkm.OMANYTE, Pkm.KINGLER, Pkm.PELIPPER, Pkm.GASTRODON, Pkm.TENTACOOL, Pkm.DEWGONG, Pkm.STARYU, Pkm.DRAGONAIR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      CONCEALED_RUINS: {
        id: 'CONCEALED_RUINS',
        name: 'Concealed Ruins',
        pokemons: [Pkm.PIDGEY, Pkm.VOLTORB, Pkm.POOCHYENA, Pkm.TAILOW, Pkm.LOUDRED, Pkm.NIDOQUEEN, Pkm.WEEZING, Pkm.MURKROW, Pkm.DELCATTY, Pkm.PIDGEOTTO, Pkm.SHUPPET, Pkm.ELECTRODE, Pkm.EXPLOUD, Pkm.RAIKOU, Pkm.PIDGEOT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      CRAGGY_COAST: {
        id: 'CRAGGY_COAST',
        name: 'Craggy Coast',
        pokemons: [Pkm.SPHEAL, Pkm.KRABBY, Pkm.DRATINI, Pkm.WINGULL, Pkm.GASTRODON, Pkm.SEALEO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      CRYSTAL_CAVE_01F_05F: {
        id: 'CRYSTAL_CAVE_01F_05F',
        name: 'Crystal Cave',
        pokemons: [Pkm.GRAVELER, Pkm.SEVIPER, Pkm.BELDUM, Pkm.WORMADAN, Pkm.RIOLU, Pkm.CRANIDOS, Pkm.DONPHAN, Pkm.SHIELDON, Pkm.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      CRYSTAL_CAVE_06F_11F: {
        id: 'CRYSTAL_CAVE_06F_11F',
        name: 'Crystal Cave',
        pokemons: [Pkm.GRAVELER, Pkm.SEVIPER, Pkm.BELDUM, Pkm.WORMADAN, Pkm.RIOLU, Pkm.CRANIDOS, Pkm.DONPHAN, Pkm.SHIELDON, Pkm.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      CRYSTAL_CROSSING: {
        id: 'CRYSTAL_CROSSING',
        name: 'Crystal Crossing',
        pokemons: [Pkm.FLOATZEL, Pkm.BAGON, Pkm.WORMADAN, Pkm.GLAMEOW, Pkm.ABSOL, Pkm.GLALIE, Pkm.FROSLASS, Pkm.AZELF],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DARK_CRATER: {
        id: 'DARK_CRATER',
        name: 'Dark Crater',
        pokemons: [Pkm.CHARMANDER, Pkm.CYNDAQUIL, Pkm.HIPPOWDON, Pkm.NUMEL, Pkm.SLUGMA, Pkm.GROWLITHE, Pkm.PONYTA, Pkm.TORCHIC, Pkm.FLAREON, Pkm.COMBUSKEN, Pkm.RAPIDASH, Pkm.MEWTWO, Pkm.ARCANINE, Pkm.QUILAVA, Pkm.MAGCARGO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      DEEP_DARK_CRATER: {
        id: 'DEEP_DARK_CRATER',
        name: 'Deep Dark Crater',
        pokemons: [Pkm.CHARMELEON, Pkm.QUILAVA, Pkm.MONFERNO, Pkm.CAMERUPT, Pkm.COMBUSKEN, Pkm.ARCANINE, Pkm.RAPIDASH, Pkm.FLAREON, Pkm.MAGCARGO, Pkm.RHYPERIOR, Pkm.MAGMORTAR, Pkm.CHARIZARD, Pkm.TYPHLOSION, Pkm.INFERNAPE, Pkm.MISMAGIUS, Pkm.BLAZIKEN, Pkm.AGGRON, Pkm.ENTEI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      DARK_HILL_01F_06F: {
        id: 'DARK_HILL_01F_06F',
        name: 'Dark Hill',
        pokemons: [Pkm.GASTLY, Pkm.HAUNTER, Pkm.GENGAR, Pkm.BANETTE, Pkm.DUSCLOPS, Pkm.CLAYDOL, Pkm.MISMAGIUS, Pkm.GLISCOR, Pkm.MISDREAVUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_HILL_07F_15F: {
        id: 'DARK_HILL_07F_15F',
        name: 'Dark Hill',
        pokemons: [Pkm.GASTLY, Pkm.HAUNTER, Pkm.GENGAR, Pkm.BANETTE, Pkm.DUSCLOPS, Pkm.CLAYDOL, Pkm.MISMAGIUS, Pkm.GLISCOR, Pkm.MISDREAVUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DEEP_DUSK_FOREST_01F_06F: {
        id: 'DEEP_DUSK_FOREST_01F_06F',
        name: 'Deep Dusk Forest',
        pokemons: [Pkm.VULPIX, Pkm.RHYDON, Pkm.STEELIX, Pkm.AGGRON, Pkm.LEAFEON, Pkm.HIPPOWDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DEEP_DUSK_FOREST_07F_12F: {
        id: 'DEEP_DUSK_FOREST_07F_12F',
        name: 'Deep Dusk Forest',
        pokemons: [Pkm.VULPIX, Pkm.RHYDON, Pkm.STEELIX, Pkm.AGGRON, Pkm.LEAFEON, Pkm.HIPPOWDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DEEP_SEALED_RUIN: {
        id: 'DEEP_SEALED_RUIN',
        name: 'Deep Sealed Ruin',
        pokemons: [Pkm.MUK, Pkm.FORETRESS, Pkm.SHELGON, Pkm.METANG, Pkm.TANGROWTH, Pkm.PROBOPASS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.METAL
      },
      DRENCHED_BLUFF: {
        id: 'DRENCHED_BLUFF',
        name: 'Drenched Bluff',
        pokemons: [Pkm.LILEEP, Pkm.ANORITH, Pkm.SHELLOS, Pkm.CHINGLING],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      DUSK_FOREST_01F_04F: {
        id: 'DUSK_FOREST_01F_04F',
        name: 'Dusk Forest',
        pokemons: [Pkm.JUMPLUFF, Pkm.MOTHIM, Pkm.MISMAGIUS, Pkm.GABITE, Pkm.HAUNTER, Pkm.LICKITUNG, Pkm.CLAYDOL, Pkm.SALAMENCE, Pkm.MISMAGIUS, Pkm.HIPPOWDON, Pkm.RHYPERIOR, Pkm.DRIFLOON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DUSK_FOREST_05F_08F: {
        id: 'DUSK_FOREST_05F_08F',
        name: 'Dusk Forest',
        pokemons: [Pkm.JUMPLUFF, Pkm.MOTHIM, Pkm.MISMAGIUS, Pkm.GABITE, Pkm.HAUNTER, Pkm.LICKITUNG, Pkm.CLAYDOL, Pkm.SALAMENCE, Pkm.MISMAGIUS, Pkm.HIPPOWDON, Pkm.RHYPERIOR, Pkm.DRIFLOON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      NORTHERN_DESERT_01F_07F: {
        id: 'NORTHERN_DESERT_01F_07F',
        name: 'Northern Desert',
        pokemons: [Pkm.BALTOY, Pkm.CUBONE, Pkm.ARON, Pkm.CACNEA, Pkm.LARVITAR, Pkm.SANDSHREW, Pkm.TRAPINCH, Pkm.CARNIVINE, Pkm.RHYHORN, Pkm.LAIRON, Pkm.CACTURNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      QUICKSAND_CAVE: {
        id: 'QUICKSAND_CAVE',
        name: 'Quicksand Cave',
        pokemons: [Pkm.NINCADA, Pkm.VIBRAVA, Pkm.PUPITAR, Pkm.SKORUPI, Pkm.SANDSLASH, Pkm.MAWILE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      QUICKSAND_PIT: {
        id: 'QUICKSAND_PIT',
        name: 'Quicksand Pit',
        pokemons: [Pkm.MESPRIT, Pkm.PUPITAR, Pkm.SKORUPI, Pkm.MAWILE, Pkm.SANDSLASH, Pkm.TYRANITAR, Pkm.HIPPOPOTAS, Pkm.NINJASK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      ROCK_AEGIS_CAVE: {
        id: 'ROCK_AEGIS_CAVE',
        name: 'Rock Aegis Cave',
        pokemons: [Pkm.ZUBAT, Pkm.GOLBAT, Pkm.UNOWN, Pkm.MACHOKE, Pkm.MACHAMP, Pkm.REGIROCK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.MINERAL
      },
      SURROUNDED_SEA: {
        id: 'SURROUNDED_SEA',
        name: 'Surrounded Sea',
        pokemons: [Pkm.SHELLDER, Pkm.CARVANHA, Pkm.WAILMER, Pkm.SLOWBRO, Pkm.TENTACRUEL, Pkm.STARMIE, Pkm.QWILFISH, Pkm.HORSEA, Pkm.SEADRA, Pkm.SLOWKING, Pkm.REMORAID, Pkm.OCTIRELLY, Pkm.KINGDRA, Pkm.CLAMPERL, Pkm.FINNEON, Pkm.LAPRAS, Pkm.WAILORD, Pkm.LUGIA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      TEMPORAL_SPIRE: {
        id: 'TEMPORAL_SPIRE',
        name: 'Temporal Spire',
        pokemons: [Pkm.DIALGA, Pkm.DEOXYS, Pkm.BRONZONG, Pkm.PORYGON, Pkm.SALAMENCE, Pkm.PORYGON_Z, Pkm.METAGROSS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.METAL
      },
      TEMPORAL_TOWER: {
        id: 'TEMPORAL_TOWER',
        name: 'Temporal Tower',
        pokemons: [Pkm.PORYGON, Pkm.LUNATONE, Pkm.SOLROCK, Pkm.BRONZOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TEST_DUNGEON: {
        id: 'TEST_DUNGEON',
        name: 'Test Dungeon',
        pokemons: [Pkm.PORYGON, Pkm.UNOWN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      THE_NIGHTMARE: {
        id: 'THE_NIGHTMARE',
        name: 'The Nightmare',
        pokemons: [Pkm.SPOINK, Pkm.CLEFFA, Pkm.CLEFAIRY, Pkm.JIGGLYPUFF, Pkm.WYNAUT, Pkm.SPINDA, Pkm.LICKITUNG, Pkm.ESPEON, Pkm.WOOBUFFET, Pkm.MILTANK, Pkm.BLISSEY, Pkm.WHISMUR, Pkm.SKITTY, Pkm.PERSIAN, Pkm.IGGLYBUFF, Pkm.CLEFABLE, Pkm.WIGGLYTUFF, Pkm.CHANSEY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      TINY_MEADOW: {
        id: 'TINY_MEADOW',
        name: 'Tiny Meadow',
        pokemons: [Pkm.SKIPLOOM, Pkm.BRELOOM, Pkm.STARAVIA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      TREESHROUD_FOREST_01F_08F: {
        id: 'TREESHROUD_FOREST_01F_08F',
        name: 'Treeshroud Forest',
        pokemons: [Pkm.KADABRA, Pkm.RALTS, Pkm.CHERIM, Pkm.HOUNDOOM, Pkm.NINETALES, Pkm.ALAKAZAM, Pkm.KIRLIA, Pkm.VESPIQUEEN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TREESHROUD_FOREST_09F_21F: {
        id: 'TREESHROUD_FOREST_09F_21F',
        name: 'Treeshroud Forest',
        pokemons: [Pkm.KADABRA, Pkm.RALTS, Pkm.CHERIM, Pkm.HOUNDOOM, Pkm.NINETALES, Pkm.ALAKAZAM, Pkm.KIRLIA, Pkm.VESPIQUEEN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      STEAM_CAVE: {
        id: 'STEAM_CAVE',
        name: 'Steam Cave',
        pokemons: [Pkm.SNUBULL, Pkm.SLUGMA, Pkm.MAGBY, Pkm.NUMEL, Pkm.FARFETCH, Pkm.YANMEGA, Pkm.KRICKETUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      QUICKSAND_PIT_2: {
        id: 'QUICKSAND_PIT_2',
        name: 'Quicksand Pit',
        pokemons: [Pkm.MESPRIT, Pkm.PUPITAR, Pkm.SKORUPI, Pkm.MAWILE, Pkm.SANDSLASH, Pkm.TYRANITAR, Pkm.HIPPOPOTAS, Pkm.NINJASK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      LOWER_BRINE_CAVE: {
        id: 'LOWER_BRINE_CAVE',
        name: 'Lower Brine Cave',
        pokemons: [Pkm.WALREIN, Pkm.DRAGONAIR, Pkm.STARYU, Pkm.TENTACOOL, Pkm.DEWGONG, Pkm.GASTRODON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      HIDDEN_LAND: {
        id: 'HIDDEN_LAND',
        name: 'Hidden land',
        pokemons: [Pkm.DRAGONITE, Pkm.MANECTRIC, Pkm.TROPIUS, Pkm.RAMPARDOS, Pkm.BASTIODON, Pkm.PURUGLY, Pkm.GARCHOMP, Pkm.ABOMASNOW, Pkm.MAGMORTAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      TEMPORAL_TOWER_2: {
        id: 'TEMPORAL_TOWER_2',
        name: 'Temporal Tower',
        pokemons: [Pkm.PORYGON, Pkm.LUNATONE, Pkm.SOLROCK, Pkm.BRONZOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      CRYSTAL_CAVE_2: {
        id: 'CRYSTAL_CAVE_2',
        name: 'Crystal Cave',
        pokemons: [Pkm.GRAVELER, Pkm.SEVIPER, Pkm.BELDUM, Pkm.WORMADAN, Pkm.RIOLU, Pkm.CRANIDOS, Pkm.DONPHAN, Pkm.SHIELDON, Pkm.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      WATERFALL_CAVE: {
        id: 'WATERFALL_CAVE',
        name: 'Waterfall Cave',
        pokemons: [Pkm.PSYDUCK, Pkm.POLIWAG, Pkm.GRIMER, Pkm.TANGELA, Pkm.WOOPER, Pkm.LOTAD, Pkm.SURSKIT, Pkm.BARBOACH, Pkm.WHISCASH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      WORLD_ABYSS: {
        id: 'WORLD_ABYSS',
        name: 'World Abyss',
        pokemons: [Pkm.GIRATINA, Pkm.TAILOW, Pkm.PIDGEY, Pkm.MURKROW, Pkm.VOLTORB, Pkm.POOCHYENA, Pkm.LOUDRED, Pkm.PIDGEOTTO, Pkm.NIDOQUEEN, Pkm.ELECTRODE, Pkm.WEEZING, Pkm.UMBREON, Pkm.DELCATTY, Pkm.SWELLOW, Pkm.EXPLOUD, Pkm.MIGHTYENA, Pkm.PIDGEOT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      ZERO_ISLE_EAST_15F_25F: {
        id: 'ZERO_ISLE_EAST_15F_25F',
        name: 'Zero Isle East',
        pokemons: [Pkm.DEWGONG, Pkm.SHELLDER, Pkm.CORSOLA, Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.YANMA, Pkm.TENTACRUEL, Pkm.VOLTORB, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOOTHOOT, Pkm.WYNAUT, Pkm.HOUNDOUR, Pkm.WAILMER, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.VULPIX, Pkm.FERALIGATR, Pkm.SPINARAK, Pkm.SLUGMA, Pkm.CHANSEY, Pkm.KRABBY, Pkm.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      ZERO_ISLE_EAST_26F_40F: {
        id: 'ZERO_ISLE_EAST_26F_40F',
        name: 'Zero Isle East',
        pokemons: [Pkm.DEWGONG, Pkm.SHELLDER, Pkm.CORSOLA, Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.YANMA, Pkm.TENTACRUEL, Pkm.VOLTORB, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOOTHOOT, Pkm.WYNAUT, Pkm.HOUNDOUR, Pkm.WAILMER, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.VULPIX, Pkm.FERALIGATR, Pkm.SPINARAK, Pkm.SLUGMA, Pkm.CHANSEY, Pkm.KRABBY, Pkm.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      ZERO_ISLE_SOUTH_01F_03F: {
        id: 'ZERO_ISLE_SOUTH_01F_03F',
        name: 'Zero Isle South',
        pokemons: [Pkm.PIDGEY, Pkm.JIGGLYPUFF, Pkm.SHELLDER, Pkm.SEADRA, Pkm.STARYU, Pkm.STARMIE, Pkm.CHINGLING, Pkm.CLEFFA, Pkm.BELLSPROUT, Pkm.EXEGGCUTE, Pkm.CHINCHOU, Pkm.POOCHYENA, Pkm.NIDORANM, Pkm.LARVITAR, Pkm.RATTATA, Pkm.TOGEPI, Pkm.EEVEE, Pkm.RALTS, Pkm.BALTOY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      ZERO_ISLE_SOUTH_04F_08F: {
        id: 'ZERO_ISLE_SOUTH_04F_08F',
        name: 'Zero Isle East',
        pokemons: [Pkm.PIDGEY, Pkm.JIGGLYPUFF, Pkm.SHELLDER, Pkm.SEADRA, Pkm.STARYU, Pkm.STARMIE, Pkm.CHINGLING, Pkm.CLEFFA, Pkm.BELLSPROUT, Pkm.EXEGGCUTE, Pkm.CHINCHOU, Pkm.POOCHYENA, Pkm.NIDORANM, Pkm.LARVITAR, Pkm.RATTATA, Pkm.TOGEPI, Pkm.EEVEE, Pkm.RALTS, Pkm.BALTOY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      BURIED_RELIC_1F_20F: {
        id: 'BURIED_RELIC_1F_20F',
        name: 'Buried Relic',
        pokemons: [Pkm.GOLBAT, Pkm.SNEASEL, Pkm.WYNAUT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.HOOTHOOT, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.MEW, Pkm.SHEDNINJA, Pkm.SANDSHREW, Pkm.MAWILE, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      BURIED_RELIC_21F_50F: {
        id: 'BURIED_RELIC_21F_50F',
        name: 'Buried Relic',
        pokemons: [Pkm.GOLBAT, Pkm.SNEASEL, Pkm.WYNAUT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.HOOTHOOT, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.MEW, Pkm.SHEDNINJA, Pkm.SANDSHREW, Pkm.MAWILE, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      BURIED_RELIC_51F_99F: {
        id: 'BURIED_RELIC_51F_99F',
        name: 'Buried Relic',
        pokemons: [Pkm.GOLBAT, Pkm.SNEASEL, Pkm.WYNAUT, Pkm.RATICATE, Pkm.MACHOP, Pkm.WHISMUR, Pkm.HOOTHOOT, Pkm.PORYGON, Pkm.PORYGON_2, Pkm.ARON, Pkm.REGIROCK, Pkm.GEODUDE, Pkm.REGISTEEL, Pkm.REGICE, Pkm.KADABRA, Pkm.MEW, Pkm.SHEDNINJA, Pkm.SANDSHREW, Pkm.MAWILE, Pkm.GRAVELER, Pkm.HAUNTER, Pkm.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DARKNIGHT_RELIC: {
        id: 'DARKNIGHT_RELIC',
        name: 'Darknight Relic',
        pokemons: [Pkm.SHUPPET, Pkm.GASTLY, Pkm.MISDREAVUS, Pkm.SHEDNINJA, Pkm.SABLEYE, Pkm.BANETTE, Pkm.HAUNTER, Pkm.DUSKULL, Pkm.GENGAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GHOST
      },
      SHIMMER_DESERT: {
        id: 'SHIMMER_DESERT',
        name: 'Shimmer Desert',
        pokemons: [Pkm.EKANS, Pkm.ARBOK, Pkm.SANDSHREW, Pkm.SANDSLASH, Pkm.NIDOKING, Pkm.DIGLETT, Pkm.DUGTRIO, Pkm.SUDOWOODO, Pkm.GARCHOMP, Pkm.RHYPERIOR, Pkm.GROUDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      UNOWN_RELIC: {
        id: 'UNOWN_RELIC',
        name: 'Unown Relic',
        pokemons: [Pkm.UNOWN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      FROSTY_FOREST: {
        id: 'FROSTY_FOREST',
        name: 'Frosty Forest',
        pokemons: [Pkm.AZURILL, Pkm.FURRET, Pkm.NOSEPASS, Pkm.PILOSWINE, Pkm.MIGHTYENA, Pkm.LAIRON, Pkm.SNORUNT, Pkm.ARTICUNO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ICE
      },
      GREAT_CANYON: {
        id: 'GREAT_CANYON',
        name: 'Great Canyon',
        pokemons: [Pkm.SKIPLOOM, Pkm.DUNSPARCE, Pkm.PHANPY, Pkm.DODUO, Pkm.VILEPLUME, Pkm.BRELOOM, Pkm.MURKROW, Pkm.CACTURNE, Pkm.NOCTOWL, Pkm.ARIADOS, Pkm.TAUROS, Pkm.HOUNDOOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      HOWLING_FOREST_01F_06F: {
        id: 'HOWLING_FOREST_01F_06F',
        name: 'Howling Forest',
        pokemons: [Pkm.AZURILL, Pkm.HOUNDOUR, Pkm.POOCHYENA, Pkm.WHISMUR, Pkm.SPOINK, Pkm.FURRET, Pkm.PIDGEY, Pkm.LOUDRED, Pkm.HOUNDOOM, Pkm.MIGHTYENA, Pkm.GRUMPIG, Pkm.SNORLAX, Pkm.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      HOWLING_FOREST_07F_15F: {
        id: 'HOWLING_FOREST_07F_15F',
        name: 'Howling Forest',
        pokemons: [Pkm.AZURILL, Pkm.HOUNDOUR, Pkm.POOCHYENA, Pkm.WHISMUR, Pkm.SPOINK, Pkm.FURRET, Pkm.PIDGEY, Pkm.LOUDRED, Pkm.HOUNDOOM, Pkm.MIGHTYENA, Pkm.GRUMPIG, Pkm.SNORLAX, Pkm.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      MT_FARAWAY: {
        id: 'MT_FARAWAY',
        name: 'Mt Faraway',
        pokemons: [Pkm.LUNATONE, Pkm.SNORUNT, Pkm.SOLROCK, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GRANBULL, Pkm.WEEZING, Pkm.DUGTRIO, Pkm.GLALIE, Pkm.HO_OH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_FARAWAY_10F_20F: {
        id: 'MT_FARAWAY_10F_20F',
        name: 'Mt Faraway',
        pokemons: [Pkm.LUNATONE, Pkm.SNORUNT, Pkm.SOLROCK, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GRANBULL, Pkm.WEEZING, Pkm.DUGTRIO, Pkm.GLALIE, Pkm.HO_OH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_FARAWAY_30F_39F: {
        id: 'MT_FARAWAY_30F_39F',
        name: 'Mt Faraway',
        pokemons: [Pkm.LUNATONE, Pkm.SNORUNT, Pkm.SOLROCK, Pkm.AZUMARILL, Pkm.GOLEM, Pkm.MARSHTOMP, Pkm.VIGOROTH, Pkm.GRANBULL, Pkm.WEEZING, Pkm.DUGTRIO, Pkm.GLALIE, Pkm.HO_OH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ICE
      },
      JOYOUS_TOWER: {
        id: 'JOYOUS_TOWER',
        name: 'Joyous Tower',
        pokemons: [Pkm.JIGGLYPUFF, Pkm.TREECKO, Pkm.BULBASAUR, Pkm.TAILOW, Pkm.PICHU, Pkm.DIGLETT, Pkm.SPINDA, Pkm.PLUSLE, Pkm.MINUN, Pkm.METAPOD, Pkm.CHIKORITA, Pkm.PSYDUCK, Pkm.KAKUNA, Pkm.CLEFAIRY, Pkm.TORCHIC, Pkm.EEVEE, Pkm.CYNDAQUIL, Pkm.BELDUM, Pkm.SCYTHER, Pkm.SLAKOTH, Pkm.TRAPINCH, Pkm.CLEFABLE, Pkm.HOUNDOUR, Pkm.SPINARAK, Pkm.GARDEVOIR, Pkm.BELLOSSOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      LAPIS_CAVE: {
        id: 'LAPIS_CAVE',
        name: 'Lapis Cave',
        pokemons: [Pkm.ZUBAT, Pkm.NINCADA, Pkm.NIDORINA, Pkm.NIDORINO, Pkm.TANGELA, Pkm.BAGON, Pkm.GOLBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      LIGHTNING_FIELD: {
        id: 'LIGHTNING_FIELD',
        name: 'Lightning Field',
        pokemons: [Pkm.MAREEP, Pkm.ELECTRIKE, Pkm.MAGNEMITE, Pkm.PIKACHU, Pkm.FLAFFY, Pkm.PLUSLE, Pkm.MINUN, Pkm.JOLTEON, Pkm.CACTURNE, Pkm.ELECTRODE, Pkm.ELEKID, Pkm.MAGNETON, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.RAICHU, Pkm.RAIKOU],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MAGMA_CAVERN_08F_17F: {
        id: 'MAGMA_CAVERN_08F_17F',
        name: 'Magma Cavern',
        pokemons: [Pkm.RATICATE, Pkm.SANDSHREW, Pkm.NIDOQUEEN, Pkm.NIDOKING, Pkm.GRAVELER, Pkm.MAGMAR, Pkm.MAWILE, Pkm.ARBOK, Pkm.MAGCARGO, Pkm.SANDSLASH, Pkm.GOLEM, Pkm.GRIMER, Pkm.ONIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FIRE
      },
      MAGMA_CAVERN_18F_23F: {
        id: 'MAGMA_CAVERN_18F_23F',
        name: 'Magma Cavern',
        pokemons: [Pkm.GROUDON, Pkm.RATICATE, Pkm.SANDSHREW, Pkm.NIDOQUEEN, Pkm.NIDOKING, Pkm.GRAVELER, Pkm.MAGMAR, Pkm.MAWILE, Pkm.ARBOK, Pkm.MAGCARGO, Pkm.SANDSLASH, Pkm.GOLEM, Pkm.GRIMER, Pkm.ONIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FIRE
      },
      METEOR_CAVE: {
        id: 'METEOR_CAVE',
        name: 'Meteor Cave',
        pokemons: [Pkm.DEOXYS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      MT_BLAZE: {
        id: 'MT_BLAZE',
        name: 'Mt Blaze',
        pokemons: [Pkm.PIDGEOT, Pkm.MAGBY, Pkm.NUMEL, Pkm.SLUGMA, Pkm.RAPIDASH, Pkm.FEAROW, Pkm.ARCANINE, Pkm.MOLTRES],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FIRE
      },
      MT_STEEL_01F_05F: {
        id: 'MT_STEEL_01F_05F',
        name: 'Mt Steel',
        pokemons: [Pkm.SPEAROW, Pkm.BALTOY, Pkm.ZIGZAGOON, Pkm.ARON, Pkm.GEODUDE, Pkm.MEDITITE, Pkm.BELDUM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.METAL
      },
      MT_STEEL_06F_08F: {
        id: 'MT_STEEL_06F_08F',
        name: 'Mt Steel',
        pokemons: [Pkm.SPEAROW, Pkm.BALTOY, Pkm.ZIGZAGOON, Pkm.ARON, Pkm.GEODUDE, Pkm.MEDITITE, Pkm.BELDUM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.METAL
      },
      MT_FREEZE: {
        id: 'MT_FREEZE',
        name: 'Mt Freeze',
        pokemons: [Pkm.SWABLU, Pkm.SHELGON, Pkm.PUPITAR, Pkm.SEEL, Pkm.VIGOROTH, Pkm.SLAKING, Pkm.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_THUNDER_PEAK: {
        id: 'MT_THUNDER_PEAK',
        name: 'Mt Thunder Peak',
        pokemons: [Pkm.WEEDLE, Pkm.NIDORANM, Pkm.ELECTRIKE, Pkm.CACNEA, Pkm.PIDGEOTTO, Pkm.BEEDRILL, Pkm.ELECTABUZZ, Pkm.STANTLER, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.GROWLITHE, Pkm.ZAPDOS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MT_THUNDER: {
        id: 'MT_THUNDER',
        name: 'Mt Thunder',
        pokemons: [Pkm.WEEDLE, Pkm.NIDORANM, Pkm.ELECTRIKE, Pkm.CACNEA, Pkm.PIDGEOTTO, Pkm.BEEDRILL, Pkm.ELECTABUZZ, Pkm.STANTLER, Pkm.AMPHAROS, Pkm.MANECTRIC, Pkm.GROWLITHE, Pkm.ZAPDOS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MURKY_CAVE: {
        id: 'MURKY_CAVE',
        name: 'Murky Cave',
        pokemons: [Pkm.ZUBAT, Pkm.SEVIPER, Pkm.GRIMER, Pkm.GOLBAT, Pkm.SHEDNINJA, Pkm.SHUPPET, Pkm.CROBAT, Pkm.MISDREAVUS, Pkm.MUK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      NORMAL_MAZE: {
        id: 'NORMAL_MAZE',
        name: 'Normal Maze',
        pokemons: [Pkm.RATICATE, Pkm.FARFETCH, Pkm.FURRET],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.NORMAL
      },
      NORTHERN_RANGE_01F_07F: {
        id: 'NORTHERN_RANGE_01F_07F',
        name: 'Northern Range',
        pokemons: [Pkm.HOOTHOOT, Pkm.DODRIO, Pkm.NINJASK, Pkm.SPINARAK, Pkm.SWELLOW, Pkm.PIDGEOT, Pkm.FEAROW, Pkm.TOGETIC, Pkm.LATIOS, Pkm.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FLYING
      },
      NORTHERN_RANGE_08F_16F: {
        id: 'NORTHERN_RANGE_08F_16F',
        name: 'Northern Range',
        pokemons: [Pkm.HOOTHOOT, Pkm.DODRIO, Pkm.NINJASK, Pkm.SPINARAK, Pkm.SWELLOW, Pkm.PIDGEOT, Pkm.FEAROW, Pkm.TOGETIC, Pkm.LATIOS, Pkm.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FLYING
      },
      NORTHWIND_FIELD: {
        id: 'NORTHWIND_FIELD',
        name: 'Northwind Field',
        pokemons: [Pkm.AZUMARILL, Pkm.DELCATTY, Pkm.VAPOREON, Pkm.POLIWHIRL, Pkm.MUK, Pkm.POLITOED, Pkm.ABSOL, Pkm.CROCONAW, Pkm.WARTORTLE, Pkm.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      PITFALL_VALLEY: {
        id: 'PITFALL_VALLEY',
        name: 'Pitfall Valley',
        pokemons: [Pkm.PIDGEOT, Pkm.FARFETCH, Pkm.SWELLOW, Pkm.HOPPIP, Pkm.BUTTERFREE, Pkm.RATICATE, Pkm.DODUO, Pkm.SWABLU, Pkm.YANMA, Pkm.MASQUERAIN, Pkm.SKIPLOOM, Pkm.AERODACTYL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FLYING
      },
      POISON_MAZE: {
        id: 'POISON_MAZE',
        name: 'Poison Maze',
        pokemons: [Pkm.NIDORANF, Pkm.NIDORANM, Pkm.NIDORINO, Pkm.NIDORINA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.POISON
      },
      PURITY_FOREST_04F_07F: {
        id: 'PURITY_FOREST_04F_07F',
        name: 'Purity Forest',
        pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_13F_20F: {
        id: 'PURITY_FOREST_13F_20F',
        name: 'Purity Forest',
        pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_30F_43F: {
        id: 'PURITY_FOREST_30F_43F',
        name: 'Purity Forest',
        pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_44F_60F: {
        id: 'PURITY_FOREST_44F_60F',
        name: 'Purity Forest',
        pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_61F_79F: {
        id: 'PURITY_FOREST_61F_79F',
        name: 'Purity Forest',
        pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_80F_99F: {
        id: 'PURITY_FOREST_80F_99F',
        name: 'Purity Forest',
        pokemons: [Pkm.CELEBI, Pkm.DARKRAI, Pkm.BULBASAUR, Pkm.IVYSAUR, Pkm.VENUSAUR, Pkm.METAPOD, Pkm.RATTATA, Pkm.RATICATE, Pkm.SPEAROW, Pkm.NIDORANF, Pkm.NIDORANM, Pkm.VILEPLUME, Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL, Pkm.EXEGGCUTE, Pkm.KOFFING, Pkm.SCYTHER, Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM, Pkm.TREECKO, Pkm.GROVYLE, Pkm.SCEPTILE, Pkm.SEEDOT, Pkm.NUZLEAF, Pkm.ROSELIA, Pkm.FLYGON, Pkm.MUNCHLAX, Pkm.TURTWIG, Pkm.GROTLE, Pkm.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      RESCUE_TEAM_MAZE: {
        id: 'RESCUE_TEAM_MAZE',
        name: 'Rescue Team Maze',
        pokemons: [Pkm.PIDGEY, Pkm.RATTATA, Pkm.VOLTORB, Pkm.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      ROCK_PATH: {
        id: 'ROCK_PATH',
        name: 'Rock Path',
        pokemons: [Pkm.PIDGEOT, Pkm.NIDORINA, Pkm.NIDORINO, Pkm.ZUBAT, Pkm.NUMEL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      SILENT_CHASM: {
        id: 'SILENT_CHASM',
        name: 'Silent Chasm',
        pokemons: [Pkm.FARFETCH, Pkm.WEEDLE, Pkm.YANMA, Pkm.GLOOM, Pkm.HOUNDOUR, Pkm.POLIWAG, Pkm.SPINARAK, Pkm.TRAPINCH, Pkm.BEEDRILL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.BUG
      },
      SILVER_TRENCH: {
        id: 'SILVER_TRENCH',
        name: 'Silver Trench',
        pokemons: [Pkm.LUGIA, Pkm.DEWGONG, Pkm.SHELLDER, Pkm.CORSOLA, Pkm.KABUTO, Pkm.AZUMARILL, Pkm.SLOWPOKE, Pkm.YANMA, Pkm.TENTACRUEL, Pkm.VOLTORB, Pkm.SPEAROW, Pkm.SEEDOT, Pkm.GOLBAT, Pkm.HOOTHOOT, Pkm.WYNAUT, Pkm.HOUNDOUR, Pkm.WAILMER, Pkm.MAGNETON, Pkm.BEEDRILL, Pkm.VULPIX, Pkm.FERALIGATR, Pkm.SPINARAK, Pkm.SLUGMA, Pkm.CHANSEY, Pkm.KRABBY, Pkm.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      SINISTER_WOODS: {
        id: 'SINISTER_WOODS',
        name: 'Sinister Woods',
        pokemons: [Pkm.SWINUB, Pkm.ODDISH, Pkm.SUDOWOODO, Pkm.SENTRET, Pkm.SHROOMISH, Pkm.WOOPER, Pkm.SCYTHER, Pkm.HOOTHOOT, Pkm.SLAKOTH, Pkm.EKANS, Pkm.GENGAR, Pkm.MEDICHAM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.BUG
      },
      SKY_TOWER: {
        id: 'SKY_TOWER',
        name: 'Sky Tower',
        pokemons: [Pkm.SHEDNINJA, Pkm.SHUPPET, Pkm.LUNATONE, Pkm.RAYQUAZA, Pkm.DUSKULL, Pkm.KOFFING, Pkm.ALTARIA, Pkm.SOLROCK, Pkm.SCIZOR, Pkm.DUSCLOPS, Pkm.FLYGON, Pkm.TROPIUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FLYING
      },
      SNOW_PATH: {
        id: 'SNOW_PATH',
        name: 'Snow Path',
        pokemons: [Pkm.AZURILL, Pkm.FURRET, Pkm.NOSEPASS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ICE
      },
      SOLAR_CAVE: {
        id: 'SOLAR_CAVE',
        name: 'Solar Cave',
        pokemons: [Pkm.WYNAUT, Pkm.GIRAFARIG, Pkm.BELDUM, Pkm.DROWZEE, Pkm.SPOINK, Pkm.ABRA, Pkm.MEDITITE, Pkm.LUNATONE, Pkm.METANG, Pkm.HYPNO, Pkm.KIRLIA, Pkm.KADABRA, Pkm.MEDICHAM, Pkm.GRUMPIG, Pkm.CLAYDOL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      SOUTHERN_CAVERN_01F_23F: {
        id: 'SOUTHERN_CAVERN_01F_23F',
        name: 'Southern Cavern',
        pokemons: [Pkm.GEODUDE, Pkm.DIGLETT, Pkm.SEEDOT, Pkm.CUBONE, Pkm.NIDOKING, Pkm.PHANPY, Pkm.VIBRAVA, Pkm.BALTOY, Pkm.LARVITAR, Pkm.ARIADOS, Pkm.DUGTRIO, Pkm.MAROWAK, Pkm.GRAVELER, Pkm.RHYHORN, Pkm.FLYGON, Pkm.DONPHAN, Pkm.PUPITAR, Pkm.GOLEM, Pkm.ONIX, Pkm.RHYDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      SOUTHERN_CAVERN_24F_50F: {
        id: 'SOUTHERN_CAVERN_24F_50F',
        name: 'Southern Cavern',
        pokemons: [Pkm.GEODUDE, Pkm.DIGLETT, Pkm.SEEDOT, Pkm.CUBONE, Pkm.NIDOKING, Pkm.PHANPY, Pkm.VIBRAVA, Pkm.BALTOY, Pkm.LARVITAR, Pkm.ARIADOS, Pkm.DUGTRIO, Pkm.MAROWAK, Pkm.GRAVELER, Pkm.RHYHORN, Pkm.FLYGON, Pkm.DONPHAN, Pkm.PUPITAR, Pkm.GOLEM, Pkm.ONIX, Pkm.RHYDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      STORMY_SEA_01F_16F: {
        id: 'STORMY_SEA_01F_16F',
        name: 'Stormy Sea',
        pokemons: [Pkm.WINGULL, Pkm.TENTACRUEL, Pkm.TENTACOOL, Pkm.SHELLDER, Pkm.OMANYTE, Pkm.OMASTAR, Pkm.SLOWPOKE, Pkm.SPHEAL, Pkm.OMASTAR, Pkm.GRIMER, Pkm.KABUTOPS, Pkm.ARMALDO, Pkm.SEADRA, Pkm.STARMIE, Pkm.SEALEO, Pkm.KYOGRE, Pkm.CARVANHA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      STORMY_SEA_16F_39F: {
        id: 'STORMY_SEA_16F_39F',
        name: 'Stormy Sea',
        pokemons: [Pkm.WINGULL, Pkm.TENTACRUEL, Pkm.TENTACOOL, Pkm.SHELLDER, Pkm.OMANYTE, Pkm.OMASTAR, Pkm.SLOWPOKE, Pkm.SPHEAL, Pkm.OMASTAR, Pkm.GRIMER, Pkm.KABUTOPS, Pkm.ARMALDO, Pkm.SEADRA, Pkm.STARMIE, Pkm.SEALEO, Pkm.KYOGRE, Pkm.CARVANHA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      THUNDERWAVE_CAVE: {
        id: 'THUNDERWAVE_CAVE',
        name: 'Thunderwave Cave',
        pokemons: [Pkm.RATTATA, Pkm.NIDORANM, Pkm.POOCHYENA, Pkm.VOLTORB, Pkm.ELEKID, Pkm.PLUSLE, Pkm.MINUN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      TINY_WOODS: {
        id: 'TINY_WOODS',
        name: 'Tiny Woods',
        pokemons: [Pkm.RATTATA, Pkm.RATTATA, Pkm.SANDSHREW, Pkm.SPINARAK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.NORMAL
      },
      UPROAR_FOREST: {
        id: 'UPROAR_FOREST',
        name: 'Uproar Forest',
        pokemons: [Pkm.ROSELIA, Pkm.NUZLEAF, Pkm.LOTAD, Pkm.RATICATE, Pkm.GRIMER, Pkm.NOCTOWL, Pkm.KOFFING],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.GRASS
      },
      SERENITY_RIVER: {
        id: 'SERENITY_RIVER',
        name: 'Serenity River',
        pokemons: [Pkm.POLIWAG, Pkm.WOOPER, Pkm.LOTAD, Pkm.BARBOACH, Pkm.MASQUERAIN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      WATERFALL_POND: {
        id: 'WATERFALL_POND',
        name: 'Waterfall Pond',
        pokemons: [Pkm.MUDKIP, Pkm.LOTAD, Pkm.POLIWAG, Pkm.BARBOACH, Pkm.WOOPER, Pkm.TOTODILE, Pkm.SURSKIT, Pkm.MAGIKARP, Pkm.SQUIRTLE, Pkm.LOMBRE, Pkm.MARSHTOMP, Pkm.WHISCASH, Pkm.MASQUERAIN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      WESTERN_CAVE_B01F_B27F: {
        id: 'WESTERN_CAVE_B01F_B27F',
        name: 'Western Cave',
        pokemons: [Pkm.MURKROW, Pkm.BUTTERFREE, Pkm.EKANS, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.EXPLOUD, Pkm.IGGLYBUFF, Pkm.TAUROS, Pkm.MILTANK, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.ARBOK, Pkm.AGGRON, Pkm.PERSIAN, Pkm.DODRIO, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.MEWTWO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WESTERN_CAVE_B28F_B39F: {
        id: 'WESTERN_CAVE_B28F_B39F',
        name: 'Western Cave',
        pokemons: [Pkm.MURKROW, Pkm.BUTTERFREE, Pkm.EKANS, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.EXPLOUD, Pkm.IGGLYBUFF, Pkm.TAUROS, Pkm.MILTANK, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.ARBOK, Pkm.AGGRON, Pkm.PERSIAN, Pkm.DODRIO, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.MEWTWO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WISH_CAVE_01F_13F: {
        id: 'WISH_CAVE_01F_13F',
        name: 'Wish Cave',
        pokemons: [Pkm.MURKROW, Pkm.BUTTERFREE, Pkm.EKANS, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.EXPLOUD, Pkm.IGGLYBUFF, Pkm.TAUROS, Pkm.MILTANK, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.ARBOK, Pkm.AGGRON, Pkm.PERSIAN, Pkm.DODRIO, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.JIRACHI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WISH_CAVE_90F_99F: {
        id: 'WISH_CAVE_90F_99F',
        name: 'Wish Cave',
        pokemons: [Pkm.MURKROW, Pkm.BUTTERFREE, Pkm.EKANS, Pkm.MEOWTH, Pkm.BELLOSSOM, Pkm.EXPLOUD, Pkm.IGGLYBUFF, Pkm.TAUROS, Pkm.MILTANK, Pkm.ESPEON, Pkm.IVYSAUR, Pkm.ARBOK, Pkm.AGGRON, Pkm.PERSIAN, Pkm.DODRIO, Pkm.BAYLEEF, Pkm.ALAKAZAM, Pkm.TYRANITAR, Pkm.SCEPTILE, Pkm.ARCANINE, Pkm.SWAMPERT, Pkm.MACHAMP, Pkm.STEELIX, Pkm.CHARIZARD, Pkm.BLASTOISE, Pkm.JIRACHI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WYVERN_HILL: {
        id: 'WYVERN_HILL',
        name: 'Wyvern Hill',
        pokemons: [Pkm.BAGON, Pkm.DRATINI, Pkm.ALTARIA, Pkm.TOTODILE, Pkm.LUDICOLO, Pkm.SHELGON, Pkm.VIBRAVA, Pkm.DRAGONAIR, Pkm.SALAMENCE, Pkm.FLYGON, Pkm.DRAGONITE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.DRAGON
      }
    });
    
    export const MASK_COORDINATE = Object.freeze({
      X: {x: 1, y: 4},
      A: {x: 1, y: 8},
      B: {x: 0, y: 7},
      C: {x: 1, y: 6},
      D: {x: 2, y: 7},
      AB: {x: 0, y: 5},
      AC: {x: 0, y: 4},
      AD: {x: 2, y: 5},
      BC: {x: 0, y: 3},
      BD: {x: 1, y: 3},
      CD: {x: 2, y: 3},
      ABC: {x: 0, y: 10},
      ABD: {x: 1, y: 11},
      ACD: {x: 2, y: 10},
      BCD: {x: 1, y: 9},
      ABCD: {x: 1, y: 7},
      A1B: {x: 0, y: 2},
      B2C: {x: 0, y: 0},
      C3D: {x: 2, y: 0},
      AD4: {x: 2, y: 2},
      A1BC: {x: 0, y: 17},
      AB2C: {x: 0, y: 18},
      B2CD: {x: 1, y: 19},
      BC3D: {x: 0, y: 19},
      AC3D: {x: 1, y: 18},
      ACD4: {x: 1, y: 17},
      A1BD: {x: 1, y: 20},
      ABD4: {x: 0, y: 20},
      A1B2C: {x: 0, y: 1},
      B2C3D: {x: 1, y: 0},
      AC3D4: {x: 2, y: 1},
      A1BD4: {x: 1, y: 2},
      A1BCD: {x: 0, y: 22},
      AB2CD: {x: 0, y: 21},
      ABC3D: {x: 1, y: 21},
      ABCD4: {x: 1, y: 22},
      A1B2CD: {x: 2, y: 13},
      AB2C3D: {x: 1, y: 14},
      ABC3D4: {x: 0, y: 13},
      A1BCD4: {x: 1, y: 12},
      A1B2C3D: {x: 1, y: 16},
      AB2C3D4: {x: 0, y: 16},
      A1BC3D4: {x: 0, y: 15},
      A1B2CD4: {x: 1, y: 15},
      A1BC3D: {x: 0, y: 23},
      AB2CD4: {x: 1, y: 23},
      A1B2C3D4: {x: 1, y: 1}
    });
    
    export const MASK_TABLE = Object.freeze({
      X: 'X',
      A: 'A',
      B: 'B',
      C: 'C',
      D: 'D',
      AB: 'AB',
      AC: 'AC',
      AD: 'AD',
      BC: 'BC',
      BD: 'BD',
      CD: 'CD',
      ABC: 'ABC',
      ABD: 'ABD',
      ACD: 'ACD',
      BCD: 'BCD',
      ABCD: 'ABCD',
      A1B: 'A1B',
      B2C: 'B2C',
      C3D: 'C3D',
      AD4: 'AD4',
      A1BC: 'A1BC',
      AB2C: 'AB2C',
      B2CD: 'B2CD',
      BC3D: 'BC3D',
      AC3D: 'AC3D',
      ACD4: 'ACD4',
      A1BD: 'A1BD',
      ABD4: 'ABD4',
      A1B2C: 'A1B2C',
      B2C3D: 'B2C3D',
      AC3D4: 'AC3D4',
      A1BD4: 'A1BD4',
      A1BCD: 'A1BCD',
      AB2CD: 'AB2CD',
      ABC3D: 'ABC3D',
      ABCD4: 'ABCD4',
      A1B2CD: 'A1B2CD',
      AB2C3D: 'AB2C3D',
      ABC3D4: 'ABC3D4',
      A1BCD4: 'A1BCD4',
      A1B2C3D: 'A1B2C3D',
      AB2C3D4: 'AB2C3D4',
      A1BC3D4: 'A1BC3D4',
      A1B2CD4: 'A1B2CD4',
      A1BC3D: 'A1BC3D',
      AB2CD4: 'AB2CD4',
      A1B2C3D4: 'A1B2C3D4'
    });
    
    export const TERRAIN = Object.freeze({
      GROUND: 0,
      WALL: 1,
      WATER: 2
    });
    
    export const ID_TABLE = {
      0: 'X', 1: 'A', 2: 'B', 4: 'C', 8: 'D',
      3: 'AB', 5: 'AC', 9: 'AD', 6: 'BC', 10: 'BD', 12: 'CD',
      7: 'ABC', 11: 'ABD', 13: 'ACD', 14: 'BCD', 15: 'ABCD',
      19: 'A1B', 38: 'B2C', 76: 'C3D', 137: 'AD4',
      23: 'A1BC', 39: 'AB2C', 46: 'B2CD', 78: 'BC3D',
      77: 'AC3D', 141: 'ACD4', 27: 'A1BD', 139: 'ABD4',
      55: 'A1B2C', 110: 'B2C3D', 205: 'AC3D4', 155: 'A1BD4',
      31: 'A1BCD', 47: 'AB2CD', 79: 'ABC3D', 143: 'ABCD4',
      63: 'A1B2CD', 111: 'AB2C3D', 207: 'ABC3D4', 159: 'A1BCD4',
      127: 'A1B2C3D', 239: 'AB2C3D4', 223: 'A1BC3D4', 191: 'A1B2CD4',
      95: 'A1BC3D', 175: 'AB2CD4', 255: 'A1B2C3D4'
    };


    export const ITEM_RECIPE = {
      [Item.OLD_AMBER] : [Item.FOSSIL_STONE, Item.FOSSIL_STONE],
      [Item.DAWN_STONE] : [Item.FOSSIL_STONE, Item.TWISTED_SPOON],
      [Item.WATER_STONE] : [Item.FOSSIL_STONE, Item.MYSTIC_WATER],
      [Item.THUNDER_STONE] : [Item.FOSSIL_STONE, Item.MAGNET],
      [Item.FIRE_STONE] : [Item.FOSSIL_STONE, Item.CHARCOAL],
      [Item.MOON_STONE] : [Item.FOSSIL_STONE, Item.HEART_SCALE],
      [Item.DUSK_STONE] : [Item.FOSSIL_STONE, Item.BLACK_GLASSES],
      [Item.LEAF_STONE] : [Item.FOSSIL_STONE, Item.MIRACLE_SEED],
      [Item.ICY_ROCK] : [Item.FOSSIL_STONE, Item.NEVER_MELT_ICE],
      [Item.CHOICE_SPECS] : [Item.TWISTED_SPOON, Item.TWISTED_SPOON],
      [Item.SOUL_DEW] : [Item.TWISTED_SPOON, Item.MYSTIC_WATER],
      [Item.UPGRADE] : [Item.TWISTED_SPOON, Item.MAGNET],
      [Item.REAPER_CLOTH] : [Item.TWISTED_SPOON, Item.BLACK_GLASSES],
      [Item.POKEMONOMICON] : [Item.TWISTED_SPOON, Item.MIRACLE_SEED],
      [Item.WATER_INCENSE] : [Item.TWISTED_SPOON, Item.NEVER_MELT_ICE],
      [Item.SHELL_BELL] : [Item.TWISTED_SPOON, Item.CHARCOAL],
      [Item.LUCKY_EGG] : [Item.TWISTED_SPOON, Item.HEART_SCALE],
      [Item.AQUA_EGG] : [Item.MYSTIC_WATER, Item.MYSTIC_WATER],
      [Item.BLUE_ORB] : [Item.MYSTIC_WATER, Item.MAGNET],
      [Item.ZOOM_LENS] : [Item.MYSTIC_WATER, Item.BLACK_GLASSES],
      [Item.BRIGHT_POWDER] : [Item.MYSTIC_WATER, Item.MIRACLE_SEED],
      [Item.DELTA_ORB] : [Item.MYSTIC_WATER, Item.NEVER_MELT_ICE],
      [Item.MANA_SCARF] : [Item.MYSTIC_WATER, Item.CHARCOAL],
      [Item.SMOKE_BALL] : [Item.MYSTIC_WATER, Item.HEART_SCALE],
      [Item.XRAY_VISION] : [Item.MAGNET, Item.MAGNET],
      [Item.RAZOR_FANG] : [Item.MAGNET, Item.BLACK_GLASSES],
      [Item.LEFTOVERS] : [Item.MAGNET, Item.MIRACLE_SEED],
      [Item.CHOICE_SCARF] : [Item.MAGNET, Item.NEVER_MELT_ICE],
      [Item.FIRE_GEM] : [Item.MAGNET, Item.CHARCOAL],
      [Item.DEFENSIVE_RIBBON] : [Item.MAGNET, Item.HEART_SCALE],
      [Item.WONDER_BOX] : [Item.BLACK_GLASSES, Item.BLACK_GLASSES],
      [Item.RUNE_PROTECT] : [Item.BLACK_GLASSES, Item.MIRACLE_SEED],
      [Item.WIDE_LENS] : [Item.BLACK_GLASSES, Item.NEVER_MELT_ICE],
      [Item.RAZOR_CLAW] : [Item.BLACK_GLASSES, Item.CHARCOAL],
      [Item.FLUFFY_TAIL] : [Item.BLACK_GLASSES, Item.HEART_SCALE],
      [Item.ORAN_BERRY] : [Item.MIRACLE_SEED, Item.MIRACLE_SEED],
      [Item.SHINY_CHARM] : [Item.MIRACLE_SEED, Item.NEVER_MELT_ICE],
      [Item.FOCUS_BAND] : [Item.MIRACLE_SEED, Item.CHARCOAL],
      [Item.FLAME_ORB] : [Item.MIRACLE_SEED, Item.HEART_SCALE],
      [Item.ASSAULT_VEST] : [Item.NEVER_MELT_ICE, Item.NEVER_MELT_ICE],
      [Item.KINGS_ROCK] : [Item.NEVER_MELT_ICE, Item.CHARCOAL],
      [Item.POKE_DOLL] : [Item.NEVER_MELT_ICE, Item.HEART_SCALE],
      [Item.RED_ORB] : [Item.CHARCOAL, Item.CHARCOAL],
      [Item.MAX_REVIVE] : [Item.CHARCOAL, Item.HEART_SCALE],
      [Item.ROCKY_HELMET] : [Item.HEART_SCALE, Item.HEART_SCALE]
    };