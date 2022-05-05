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

export const TypeTrigger: {[key in Synergy]: number[]} = {
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
  [Synergy.BUG]: [2, 4, 6],
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