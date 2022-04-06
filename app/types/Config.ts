import { Synergy } from "./enum/Synergy";
import { Pkmn } from "./enum/Pokemon";
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



  
  export const PRECOMPUTED_TYPE_POKEMONS_ALL = {
    [Synergy.NORMAL] : [
      Pkmn.CLEFFA, Pkmn.CLEFAIRY, Pkmn.CLEFABLE,
      Pkmn.IGGLYBUFF, Pkmn.WIGGLYTUFF, Pkmn.JIGGLYPUFF,
      Pkmn.PIDGEY, Pkmn.PIDGEOTTO, Pkmn.PIDGEOT,
      Pkmn.STARLY, Pkmn.STARAVIA, Pkmn.STARAPTOR,
      Pkmn.TOGEPI, Pkmn.TOGETIC, Pkmn.TOGEKISS,
      Pkmn.SLAKOTH, Pkmn.VIGOROTH, Pkmn.SLAKING,
      Pkmn.REGIGIGAS, Pkmn.EEVEE, Pkmn.ARCEUS,
      Pkmn.BUNEARY, Pkmn.LOPUNNY, Pkmn.MEGALOPUNNY,
      Pkmn.PORYGON, Pkmn.PORYGON2, Pkmn.PORYGONZ,
      Pkmn.WHISMUR, Pkmn.LOUDRED, Pkmn.EXPLOUD,
      Pkmn.PIKIPEK, Pkmn.TRUMBEAK, Pkmn.TOUCANNON,
      Pkmn.MELOETTA, Pkmn.CASTFORM, Pkmn.CASTFORMSUN,
      Pkmn.CASTFORMRAIN, Pkmn.CASTFORMHAIL
    ],
    [Synergy.GRASS] : [
      Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR,
      Pkmn.CATERPIE, Pkmn.METAPOD, Pkmn.BUTTERFREE,
      Pkmn.HOPPIP, Pkmn.SKIPLOOM, Pkmn.JUMPLUFF,
      Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.SHIFTRY,
      Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM,
      Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE,
      Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA,
      Pkmn.LOTAD, Pkmn.LOMBRE, Pkmn.LUDICOLO,
      Pkmn.LEAFEON, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL,
      Pkmn.VICTREEBEL, Pkmn.SNOVER, Pkmn.ABOMASNOW,
      Pkmn.MEGAABOMASNOW, Pkmn.VIRIZION, Pkmn.CELEBI,
      Pkmn.SHAYMIN, Pkmn.ODDISH, Pkmn.GLOOM,
      Pkmn.VILEPLUME, Pkmn.BELLOSSOM, Pkmn.LILEEP,
      Pkmn.CRADILY, Pkmn.BUDEW, Pkmn.ROSELIA,
      Pkmn.ROSERADE, Pkmn.SEWADDLE, Pkmn.SWADLOON,
      Pkmn.LEAVANNY
    ],
    [Synergy.FIRE] : [
      Pkmn.CHARMANDER, Pkmn.CHARMELEON, Pkmn.CHARIZARD,
      Pkmn.CYNDAQUIL, Pkmn.QUILAVA, Pkmn.TYPHLOSION,
      Pkmn.TORCHIC, Pkmn.COMBUSKEN, Pkmn.BLAZIKEN,
      Pkmn.CHIMCHAR, Pkmn.MONFERNO, Pkmn.INFERNAPE,
      Pkmn.MAGBY, Pkmn.MAGMAR, Pkmn.MAGMORTAR,
      Pkmn.MOLTRES, Pkmn.ENTEI, Pkmn.GROUDON,
      Pkmn.FLAREON, Pkmn.NUMEL, Pkmn.CAMERUPT,
      Pkmn.MEGACAMERUPT, Pkmn.LITWICK, Pkmn.LAMPENT,
      Pkmn.CHANDELURE, Pkmn.VOLCARONA, Pkmn.RESHIRAM,
      Pkmn.VICTINI, Pkmn.HEATRAN, Pkmn.HOOH,
      Pkmn.PRIMALGROUDON, Pkmn.ALOLANMAROWAK, Pkmn.HOUNDOUR,
      Pkmn.CASTFORMSUN
    ],
    [Synergy.WATER] : [
      Pkmn.SQUIRTLE, Pkmn.WARTORTLE, Pkmn.BLASTOISE,
      Pkmn.AZURILL, Pkmn.MARILL, Pkmn.AZUMARILL,
      Pkmn.MUDKIP, Pkmn.MARSHTOMP, Pkmn.SWAMPERT,
      Pkmn.PIPLUP, Pkmn.PRINPLUP, Pkmn.EMPOLEON,
      Pkmn.HORSEA, Pkmn.SEADRA, Pkmn.KINGDRA,
      Pkmn.LOTAD, Pkmn.LOMBRE, Pkmn.LUDICOLO,
      Pkmn.POLIWAG, Pkmn.POLIWHIRL, Pkmn.POLITOED,
      Pkmn.GYARADOS, Pkmn.PALKIA, Pkmn.SUICUNE,
      Pkmn.KYOGRE, Pkmn.VAPOREON, Pkmn.CARVANHA,
      Pkmn.KELDEO, Pkmn.MANAPHY, Pkmn.LAPRAS,
      Pkmn.PRIMALKYOGRE, Pkmn.TIRTOUGA, Pkmn.CARRACOSTA,
      Pkmn.KABUTO, Pkmn.KABUTOPS, Pkmn.OMANYTE,
      Pkmn.OMASTAR, Pkmn.TYMPOLE, Pkmn.PALPITOAD,
      Pkmn.SEISMITOAD, Pkmn.CASTFORMRAIN
    ],
    [Synergy.ELECTRIC] : [
      Pkmn.MAREEP, Pkmn.FLAFFY,
      Pkmn.AMPHAROS, Pkmn.PICHU,
      Pkmn.PIKACHU, Pkmn.RAICHU,
      Pkmn.MAGNEMITE, Pkmn.MAGNETON,
      Pkmn.MAGNEZONE, Pkmn.SHINX,
      Pkmn.LUXIO, Pkmn.LUXRAY,
      Pkmn.ELEKID, Pkmn.ELECTABUZZ,
      Pkmn.ELECTIVIRE, Pkmn.ZAPDOS,
      Pkmn.RAIKOU, Pkmn.JOLTEON,
      Pkmn.THUNDURUS, Pkmn.ROTOM,
      Pkmn.ZEKROM, Pkmn.PRIMALKYOGRE,
      Pkmn.ELECTRIKE, Pkmn.MANECTRIC,
      Pkmn.MEGAMANECTRIC
    ],
    [Synergy.FIGHTING] : [
      Pkmn.TORCHIC, Pkmn.COMBUSKEN,
      Pkmn.BLAZIKEN, Pkmn.CHIMCHAR,
      Pkmn.MONFERNO, Pkmn.INFERNAPE,
      Pkmn.MACHOP, Pkmn.MACHOKE,
      Pkmn.MACHAMP, Pkmn.POLIWAG,
      Pkmn.POLIWHIRL, Pkmn.POLITOED,
      Pkmn.RIOLU, Pkmn.LUCARIO,
      Pkmn.MEGALUCARIO, Pkmn.MEDITITE,
      Pkmn.MEDICHAM, Pkmn.MEGAMEDICHAM,
      Pkmn.KELDEO, Pkmn.TERRAKION,
      Pkmn.VIRIZION, Pkmn.COBALION,
      Pkmn.BUNEARY, Pkmn.LOPUNNY,
      Pkmn.MEGALOPUNNY, Pkmn.JANGMOO,
      Pkmn.HAKAMOO, Pkmn.KOMMOO
    ],
    [Synergy.PSYCHIC] : [
      Pkmn.ABRA, Pkmn.KADABRA, Pkmn.ALAKAZAM,
      Pkmn.RALTS, Pkmn.KIRLIA, Pkmn.GARDEVOIR,
      Pkmn.BELDUM, Pkmn.METANG, Pkmn.METAGROSS,
      Pkmn.LUGIA, Pkmn.ESPEON, Pkmn.MEDITITE,
      Pkmn.MEDICHAM, Pkmn.MEGAMEDICHAM, Pkmn.SLOWPOKE,
      Pkmn.SLOWBRO, Pkmn.SLOWKING, Pkmn.LATIAS,
      Pkmn.LATIOS, Pkmn.MESPRIT, Pkmn.AZELF,
      Pkmn.UXIE, Pkmn.MEWTWO, Pkmn.CELEBI,
      Pkmn.VICTINI, Pkmn.JIRACHI, Pkmn.DEOXYS,
      Pkmn.CRESSELIA, Pkmn.SOLOSIS, Pkmn.DUOSION,
      Pkmn.REUNICLUS, Pkmn.PORYGON, Pkmn.PORYGON2,
      Pkmn.PORYGONZ
    ],
    [Synergy.DARK] : [
      Pkmn.SEEDOT, Pkmn.NUZLEAF,
      Pkmn.SHIFTRY, Pkmn.DUSKULL,
      Pkmn.DUSCLOPS, Pkmn.DUSKNOIR,
      Pkmn.LARVITAR, Pkmn.PUPITAR,
      Pkmn.TYRANITAR, Pkmn.UMBREON,
      Pkmn.DARKRAI, Pkmn.CARVANHA,
      Pkmn.SPIRITOMB, Pkmn.ABSOL,
      Pkmn.DEINO, Pkmn.ZWEILOUS,
      Pkmn.HYDREIGON, Pkmn.SANDILE,
      Pkmn.KROKOROK, Pkmn.KROOKODILE,
      Pkmn.SHUPPET, Pkmn.BANETTE,
      Pkmn.MEGABANETTE, Pkmn.HOUNDOUR
    ],
    [Synergy.METAL] : [
      Pkmn.PIPLUP, Pkmn.PRINPLUP, Pkmn.EMPOLEON,
      Pkmn.ARON, Pkmn.LAIRON, Pkmn.AGGRON,
      Pkmn.MAGNEMITE, Pkmn.MAGNETON, Pkmn.MAGNEZONE,
      Pkmn.BELDUM, Pkmn.METANG, Pkmn.METAGROSS,
      Pkmn.ONIX, Pkmn.STEELIX, Pkmn.MEGASTEELIX,
      Pkmn.SCIZOR, Pkmn.MEGASCIZOR, Pkmn.LUCARIO,
      Pkmn.MEGALUCARIO, Pkmn.DIALGA, Pkmn.REGISTEEL,
      Pkmn.COBALION, Pkmn.JIRACHI, Pkmn.HEATRAN,
      Pkmn.SHIELDON, Pkmn.BASTIODON, Pkmn.HONEDGE,
      Pkmn.DOUBLADE, Pkmn.AEGISLASH
    ],
    [Synergy.GROUND] : [
      Pkmn.GEODUDE, Pkmn.GRAVELER, Pkmn.GOLEM,
      Pkmn.MUDKIP, Pkmn.MARSHTOMP, Pkmn.SWAMPERT,
      Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA,
      Pkmn.TRAPINCH, Pkmn.VIBRAVA, Pkmn.FLYGON,
      Pkmn.RHYHORN, Pkmn.RHYDON, Pkmn.RHYPERIOR,
      Pkmn.GIBLE, Pkmn.GABITE, Pkmn.GARCHOMP,
      Pkmn.ONIX, Pkmn.STEELIX, Pkmn.MEGASTEELIX,
      Pkmn.GROUDON, Pkmn.NUMEL, Pkmn.CAMERUPT,
      Pkmn.MEGACAMERUPT, Pkmn.SWINUB, Pkmn.PILOSWINE,
      Pkmn.MAMOSWINE, Pkmn.LANDORUS, Pkmn.PRIMALGROUDON,
      Pkmn.SANDILE, Pkmn.KROKOROK, Pkmn.KROOKODILE,
      Pkmn.CUBONE, Pkmn.MAROWAK, Pkmn.ALOLANMAROWAK,
      Pkmn.TYMPOLE, Pkmn.PALPITOAD, Pkmn.SEISMITOAD
    ],
    [Synergy.POISON] : [
      Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR,
      Pkmn.ZUBAT, Pkmn.GOLBAT, Pkmn.CROBAT,
      Pkmn.WEEDLE, Pkmn.KAKUNA, Pkmn.BEEDRILL,
      Pkmn.NIDORANF, Pkmn.NIDORINA, Pkmn.NIDOQUEEN,
      Pkmn.NIDORANM, Pkmn.NIDORINO, Pkmn.NIDOKING,
      Pkmn.GASTLY, Pkmn.HAUNTER, Pkmn.GENGAR,
      Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL,
      Pkmn.ODDISH, Pkmn.GLOOM, Pkmn.VILEPLUME,
      Pkmn.BELLOSSOM, Pkmn.BUDEW, Pkmn.ROSELIA,
      Pkmn.ROSERADE, Pkmn.VENIPEDE, Pkmn.WHIRLIPEDE,
      Pkmn.SCOLIPEDE
    ],
    [Synergy.DRAGON] : [
      Pkmn.CHARMANDER, Pkmn.CHARMELEON, Pkmn.CHARIZARD,
      Pkmn.HORSEA, Pkmn.SEADRA, Pkmn.KINGDRA,
      Pkmn.VIBRAVA, Pkmn.FLYGON, Pkmn.DRATINI,
      Pkmn.DRAGONAIR, Pkmn.DRAGONITE, Pkmn.BAGON,
      Pkmn.SHELGON, Pkmn.SALAMENCE, Pkmn.GIBLE,
      Pkmn.GABITE, Pkmn.GARCHOMP, Pkmn.GIRATINA,
      Pkmn.DIALGA, Pkmn.PALKIA, Pkmn.RAYQUAZA,
      Pkmn.LATIAS, Pkmn.LATIOS, Pkmn.KYUREM,
      Pkmn.RESHIRAM, Pkmn.ZEKROM, Pkmn.DEINO,
      Pkmn.ZWEILOUS, Pkmn.HYDREIGON, Pkmn.MEGARAYQUAZA,
      Pkmn.SWABLU, Pkmn.TYRUNT, Pkmn.TYRANTRUM,
      Pkmn.AXEW, Pkmn.FRAXURE, Pkmn.HAXORUS,
      Pkmn.JANGMOO, Pkmn.HAKAMOO, Pkmn.KOMMOO,
      Pkmn.ALTARIA, Pkmn.MEGAALTARIA
    ],
    [Synergy.FIELD] : [
      Pkmn.SQUIRTLE, Pkmn.WARTORTLE, Pkmn.BLASTOISE,
      Pkmn.MAREEP, Pkmn.FLAFFY, Pkmn.AMPHAROS,
      Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.SHIFTRY,
      Pkmn.CYNDAQUIL, Pkmn.QUILAVA, Pkmn.TYPHLOSION,
      Pkmn.NIDORANF, Pkmn.NIDORINA, Pkmn.NIDOQUEEN,
      Pkmn.NIDORANM, Pkmn.NIDORINO, Pkmn.NIDOKING,
      Pkmn.SHINX, Pkmn.LUXIO, Pkmn.LUXRAY,
      Pkmn.SLAKOTH, Pkmn.VIGOROTH, Pkmn.SLAKING,
      Pkmn.RAIKOU, Pkmn.ENTEI, Pkmn.EEVEE,
      Pkmn.VAPOREON, Pkmn.JOLTEON, Pkmn.FLAREON,
      Pkmn.ESPEON, Pkmn.UMBREON, Pkmn.LEAFEON,
      Pkmn.SYLVEON, Pkmn.NUMEL, Pkmn.CAMERUPT,
      Pkmn.MEGACAMERUPT, Pkmn.SWINUB, Pkmn.PILOSWINE,
      Pkmn.MAMOSWINE, Pkmn.GLACEON, Pkmn.ABSOL,
      Pkmn.ARCEUS, Pkmn.SANDILE, Pkmn.KROKOROK,
      Pkmn.KROOKODILE, Pkmn.ELECTRIKE, Pkmn.MANECTRIC,
      Pkmn.MEGAMANECTRIC
    ],
    [Synergy.MONSTER] : [
      Pkmn.TOTODILE, Pkmn.CROCONAW, Pkmn.FERALIGATR,
      Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE,
      Pkmn.ARON, Pkmn.LAIRON, Pkmn.AGGRON,
      Pkmn.RHYHORN, Pkmn.RHYDON, Pkmn.RHYPERIOR,
      Pkmn.GASTLY, Pkmn.HAUNTER, Pkmn.GENGAR,
      Pkmn.LARVITAR, Pkmn.PUPITAR, Pkmn.TYRANITAR,
      Pkmn.BAGON, Pkmn.SHELGON, Pkmn.SALAMENCE,
      Pkmn.GIBLE, Pkmn.GABITE, Pkmn.GARCHOMP,
      Pkmn.REGIGIGAS, Pkmn.DARKRAI, Pkmn.MEWTWO,
      Pkmn.CRANIDOS, Pkmn.RAMPARDOS, Pkmn.AXEW,
      Pkmn.FRAXURE, Pkmn.HAXORUS
    ],
    [Synergy.HUMAN] : [
      Pkmn.MACHOP, Pkmn.MACHOKE,
      Pkmn.MACHAMP, Pkmn.ABRA,
      Pkmn.KADABRA, Pkmn.ALAKAZAM,
      Pkmn.RALTS, Pkmn.KIRLIA,
      Pkmn.GARDEVOIR, Pkmn.ELEKID,
      Pkmn.ELECTABUZZ, Pkmn.ELECTIVIRE,
      Pkmn.MAGBY, Pkmn.MAGMAR,
      Pkmn.MAGMORTAR, Pkmn.RIOLU,
      Pkmn.LUCARIO, Pkmn.MEGALUCARIO,
      Pkmn.REGICE, Pkmn.REGIROCK,
      Pkmn.REGISTEEL, Pkmn.REGIGIGAS,
      Pkmn.MEDITITE, Pkmn.MEDICHAM,
      Pkmn.MEGAMEDICHAM, Pkmn.DEOXYS
    ],
    [Synergy.AQUATIC] : [
      Pkmn.TOTODILE, Pkmn.CROCONAW,
      Pkmn.FERALIGATR, Pkmn.SPHEAL,
      Pkmn.SEALEO, Pkmn.WALREIN,
      Pkmn.DRATINI, Pkmn.DRAGONAIR,
      Pkmn.DRAGONITE, Pkmn.LUGIA,
      Pkmn.KYOGRE, Pkmn.SLOWPOKE,
      Pkmn.SLOWBRO, Pkmn.SLOWKING,
      Pkmn.PRIMALKYOGRE
    ],
    [Synergy.BUG] : [
      Pkmn.CATERPIE, Pkmn.METAPOD,
      Pkmn.BUTTERFREE, Pkmn.WEEDLE,
      Pkmn.KAKUNA, Pkmn.BEEDRILL,
      Pkmn.TRAPINCH, Pkmn.VIBRAVA,
      Pkmn.FLYGON, Pkmn.SCYTHER,
      Pkmn.SCIZOR, Pkmn.MEGASCIZOR,
      Pkmn.VOLCARONA, Pkmn.MANAPHY,
      Pkmn.ANORITH, Pkmn.ARMALDO,
      Pkmn.VENIPEDE, Pkmn.WHIRLIPEDE,
      Pkmn.SCOLIPEDE, Pkmn.SEWADDLE,
      Pkmn.SWADLOON, Pkmn.LEAVANNY
    ],
    [Synergy.FLYING] : [
      Pkmn.ZUBAT, Pkmn.GOLBAT, Pkmn.CROBAT,
      Pkmn.BUTTERFREE, Pkmn.BEEDRILL, Pkmn.PIDGEY,
      Pkmn.PIDGEOTTO, Pkmn.PIDGEOT, Pkmn.HOPPIP,
      Pkmn.SKIPLOOM, Pkmn.JUMPLUFF, Pkmn.STARLY,
      Pkmn.STARAVIA, Pkmn.STARAPTOR, Pkmn.TORCHIC,
      Pkmn.COMBUSKEN, Pkmn.BLAZIKEN, Pkmn.PIPLUP,
      Pkmn.PRINPLUP, Pkmn.EMPOLEON, Pkmn.TOGETIC,
      Pkmn.TOGEKISS, Pkmn.DRAGONITE, Pkmn.SALAMENCE,
      Pkmn.SCYTHER, Pkmn.SCIZOR, Pkmn.MEGASCIZOR,
      Pkmn.LUGIA, Pkmn.ZAPDOS, Pkmn.MOLTRES,
      Pkmn.ARTICUNO, Pkmn.RAYQUAZA, Pkmn.LANDORUS,
      Pkmn.THUNDURUS, Pkmn.TORNADUS, Pkmn.HOOH,
      Pkmn.AERODACTYL, Pkmn.MEGARAYQUAZA, Pkmn.ARCHEN,
      Pkmn.ARCHEOPS, Pkmn.PIKIPEK, Pkmn.TRUMBEAK,
      Pkmn.TOUCANNON
    ],
    [Synergy.FLORA] : [
      Pkmn.BULBASAUR, Pkmn.IVYSAUR,
      Pkmn.VENUSAUR, Pkmn.HOPPIP,
      Pkmn.SKIPLOOM, Pkmn.JUMPLUFF,
      Pkmn.CHIKORITA, Pkmn.BAYLEEF,
      Pkmn.MEGANIUM, Pkmn.TURTWIG,
      Pkmn.GROTLE, Pkmn.TORTERRA,
      Pkmn.LEAFEON, Pkmn.BELLSPROUT,
      Pkmn.WEEPINBELL, Pkmn.VICTREEBEL,
      Pkmn.SHAYMIN, Pkmn.BUDEW,
      Pkmn.ROSELIA, Pkmn.ROSERADE,
      Pkmn.FLABEBE, Pkmn.FLOETTE,
      Pkmn.FLORGES
    ],
    [Synergy.MINERAL] : [
      Pkmn.GEODUDE, Pkmn.GRAVELER,
      Pkmn.GOLEM, Pkmn.ARON,
      Pkmn.LAIRON, Pkmn.AGGRON,
      Pkmn.RHYHORN, Pkmn.RHYDON,
      Pkmn.RHYPERIOR, Pkmn.LARVITAR,
      Pkmn.PUPITAR, Pkmn.TYRANITAR,
      Pkmn.BELDUM, Pkmn.METANG,
      Pkmn.METAGROSS, Pkmn.ONIX,
      Pkmn.STEELIX, Pkmn.MEGASTEELIX,
      Pkmn.REGIROCK, Pkmn.TERRAKION,
      Pkmn.CUBONE, Pkmn.MAROWAK,
      Pkmn.ALOLANMAROWAK
    ],
    [Synergy.GHOST] : [
      Pkmn.DUSKULL, Pkmn.DUSCLOPS,
      Pkmn.DUSKNOIR, Pkmn.GASTLY,
      Pkmn.HAUNTER, Pkmn.GENGAR,
      Pkmn.GIRATINA, Pkmn.DARKRAI,
      Pkmn.LITWICK, Pkmn.LAMPENT,
      Pkmn.CHANDELURE, Pkmn.SNORUNT,
      Pkmn.GLALIE, Pkmn.FROSLASS,
      Pkmn.ROTOM, Pkmn.SPIRITOMB,
      Pkmn.SOLOSIS, Pkmn.DUOSION,
      Pkmn.REUNICLUS, Pkmn.SHUPPET,
      Pkmn.BANETTE, Pkmn.MEGABANETTE,
      Pkmn.HONEDGE, Pkmn.DOUBLADE,
      Pkmn.AEGISLASH, Pkmn.ALOLANMAROWAK,
      Pkmn.CASTFORM, Pkmn.CASTFORMSUN,
      Pkmn.CASTFORMRAIN, Pkmn.CASTFORMHAIL
    ],
    [Synergy.FAIRY] : [
      Pkmn.AZURILL, Pkmn.MARILL, Pkmn.AZUMARILL,
      Pkmn.CLEFFA, Pkmn.CLEFAIRY, Pkmn.CLEFABLE,
      Pkmn.IGGLYBUFF, Pkmn.WIGGLYTUFF, Pkmn.JIGGLYPUFF,
      Pkmn.PICHU, Pkmn.PIKACHU, Pkmn.RAICHU,
      Pkmn.TOGEPI, Pkmn.TOGETIC, Pkmn.TOGEKISS,
      Pkmn.RALTS, Pkmn.KIRLIA, Pkmn.GARDEVOIR,
      Pkmn.SYLVEON, Pkmn.VANILLITE, Pkmn.VANILLISH,
      Pkmn.VANILLUXE, Pkmn.MESPRIT, Pkmn.AZELF,
      Pkmn.UXIE, Pkmn.CRESSELIA, Pkmn.SWABLU,
      Pkmn.FLABEBE, Pkmn.FLOETTE, Pkmn.FLORGES,
      Pkmn.ALTARIA, Pkmn.MEGAALTARIA
    ],
    [Synergy.ICE] : [
      Pkmn.SPHEAL, Pkmn.SEALEO,
      Pkmn.WALREIN, Pkmn.ARTICUNO,
      Pkmn.SUICUNE, Pkmn.REGICE,
      Pkmn.SWINUB, Pkmn.PILOSWINE,
      Pkmn.MAMOSWINE, Pkmn.SNORUNT,
      Pkmn.GLALIE, Pkmn.FROSLASS,
      Pkmn.SNOVER, Pkmn.ABOMASNOW,
      Pkmn.MEGAABOMASNOW, Pkmn.VANILLITE,
      Pkmn.VANILLISH, Pkmn.VANILLUXE,
      Pkmn.GLACEON, Pkmn.LAPRAS,
      Pkmn.KYUREM, Pkmn.AMAURA,
      Pkmn.AURORUS, Pkmn.CASTFORMHAIL
    ],
    [Synergy.FOSSIL] : [
      Pkmn.AERODACTYL, Pkmn.AMAURA,
      Pkmn.AURORUS, Pkmn.ANORITH,
      Pkmn.ARMALDO, Pkmn.ARCHEN,
      Pkmn.ARCHEOPS, Pkmn.SHIELDON,
      Pkmn.BASTIODON, Pkmn.TIRTOUGA,
      Pkmn.CARRACOSTA, Pkmn.LILEEP,
      Pkmn.CRADILY, Pkmn.CRANIDOS,
      Pkmn.RAMPARDOS, Pkmn.KABUTO,
      Pkmn.KABUTOPS, Pkmn.OMANYTE,
      Pkmn.OMASTAR, Pkmn.TYRUNT,
      Pkmn.TYRANTRUM
    ],
    [Synergy.SOUND] : [
      Pkmn.ZUBAT, Pkmn.GOLBAT, Pkmn.CROBAT,
      Pkmn.IGGLYBUFF, Pkmn.WIGGLYTUFF, Pkmn.JIGGLYPUFF,
      Pkmn.SWABLU, Pkmn.WHISMUR, Pkmn.LOUDRED,
      Pkmn.EXPLOUD, Pkmn.TYMPOLE, Pkmn.PALPITOAD,
      Pkmn.SEISMITOAD, Pkmn.SEWADDLE, Pkmn.SWADLOON,
      Pkmn.LEAVANNY, Pkmn.PIKIPEK, Pkmn.TRUMBEAK,
      Pkmn.TOUCANNON, Pkmn.FLABEBE, Pkmn.FLOETTE,
      Pkmn.FLORGES, Pkmn.JANGMOO, Pkmn.HAKAMOO,
      Pkmn.KOMMOO, Pkmn.MELOETTA, Pkmn.ALTARIA,
      Pkmn.MEGAALTARIA
    ]
  };
  
  export const PRECOMPUTED_RARITY_POKEMONS_ALL = {
    [Rarity.COMMON] : [
      Pkmn.CHARMANDER, Pkmn.CHARMELEON, Pkmn.CHARIZARD,
      Pkmn.GEODUDE, Pkmn.GRAVELER, Pkmn.GOLEM,
      Pkmn.AZURILL, Pkmn.MARILL, Pkmn.AZUMARILL,
      Pkmn.ZUBAT, Pkmn.GOLBAT, Pkmn.CROBAT,
      Pkmn.MAREEP, Pkmn.FLAFFY, Pkmn.AMPHAROS,
      Pkmn.CLEFFA, Pkmn.CLEFAIRY, Pkmn.CLEFABLE,
      Pkmn.CATERPIE, Pkmn.METAPOD, Pkmn.BUTTERFREE,
      Pkmn.WEEDLE, Pkmn.KAKUNA, Pkmn.BEEDRILL,
      Pkmn.PIDGEY, Pkmn.PIDGEOTTO, Pkmn.PIDGEOT,
      Pkmn.HOPPIP, Pkmn.SKIPLOOM, Pkmn.JUMPLUFF,
      Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.SHIFTRY,
      Pkmn.STARLY, Pkmn.STARAVIA, Pkmn.STARAPTOR,
      Pkmn.TOTODILE, Pkmn.CROCONAW, Pkmn.FERALIGATR,
      Pkmn.SWINUB, Pkmn.PILOSWINE, Pkmn.MAMOSWINE
    ],
    [Rarity.UNCOMMON] : [
      Pkmn.SQUIRTLE, Pkmn.WARTORTLE, Pkmn.BLASTOISE, Pkmn.IGGLYBUFF, Pkmn.WIGGLYTUFF,
      Pkmn.JIGGLYPUFF, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.CYNDAQUIL,
      Pkmn.QUILAVA, Pkmn.TYPHLOSION, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE,
      Pkmn.TORCHIC, Pkmn.COMBUSKEN, Pkmn.BLAZIKEN, Pkmn.MUDKIP, Pkmn.MARSHTOMP,
      Pkmn.SWAMPERT, Pkmn.CHIMCHAR, Pkmn.MONFERNO, Pkmn.INFERNAPE, Pkmn.PIPLUP,
      Pkmn.PRINPLUP, Pkmn.EMPOLEON, Pkmn.MACHOP, Pkmn.MACHOKE, Pkmn.MACHAMP,
      Pkmn.HORSEA, Pkmn.SEADRA, Pkmn.KINGDRA, Pkmn.SPHEAL, Pkmn.SEALEO,
      Pkmn.WALREIN, Pkmn.MAGNEMITE, Pkmn.MAGNETON, Pkmn.MAGNEZONE, Pkmn.DUSKULL,
      Pkmn.DUSCLOPS, Pkmn.DUSKNOIR, Pkmn.EEVEE, Pkmn.VAPOREON, Pkmn.JOLTEON,
      Pkmn.FLAREON, Pkmn.ESPEON, Pkmn.UMBREON, Pkmn.LEAFEON, Pkmn.SYLVEON,
      Pkmn.SLOWPOKE, Pkmn.SLOWBRO, Pkmn.SLOWKING, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL,
      Pkmn.VICTREEBEL, Pkmn.GLACEON, Pkmn.SANDILE, Pkmn.KROKOROK, Pkmn.KROOKODILE,
      Pkmn.ANORITH, Pkmn.ARMALDO, Pkmn.LILEEP, Pkmn.CRADILY, Pkmn.KABUTO,
      Pkmn.KABUTOPS, Pkmn.OMANYTE, Pkmn.OMASTAR, Pkmn.VENIPEDE, Pkmn.WHIRLIPEDE,
      Pkmn.SCOLIPEDE, Pkmn.PIKIPEK, Pkmn.TRUMBEAK, Pkmn.TOUCANNON, Pkmn.FLABEBE,
      Pkmn.FLOETTE, Pkmn.FLORGES
    ],
    [Rarity.RARE] : [
      Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.TURTWIG,
      Pkmn.GROTLE, Pkmn.TORTERRA, Pkmn.NIDORANF, Pkmn.NIDORINA,
      Pkmn.NIDOQUEEN, Pkmn.NIDORANM, Pkmn.NIDORINO, Pkmn.NIDOKING,
      Pkmn.PICHU, Pkmn.PIKACHU, Pkmn.RAICHU, Pkmn.TRAPINCH,
      Pkmn.VIBRAVA, Pkmn.FLYGON, Pkmn.ARON, Pkmn.LAIRON,
      Pkmn.AGGRON, Pkmn.RHYHORN, Pkmn.RHYDON, Pkmn.RHYPERIOR,
      Pkmn.TOGEPI, Pkmn.TOGETIC, Pkmn.TOGEKISS, Pkmn.LOTAD,
      Pkmn.LOMBRE, Pkmn.LUDICOLO, Pkmn.SHINX, Pkmn.LUXIO,
      Pkmn.LUXRAY, Pkmn.POLIWAG, Pkmn.POLIWHIRL, Pkmn.POLITOED,
      Pkmn.DRATINI, Pkmn.DRAGONAIR, Pkmn.DRAGONITE, Pkmn.MAGBY,
      Pkmn.MAGMAR, Pkmn.MAGMORTAR, Pkmn.VANILLITE, Pkmn.VANILLISH,
      Pkmn.VANILLUXE, Pkmn.DEINO, Pkmn.ZWEILOUS, Pkmn.HYDREIGON,
      Pkmn.SOLOSIS, Pkmn.DUOSION, Pkmn.REUNICLUS, Pkmn.ARCHEN,
      Pkmn.ARCHEOPS, Pkmn.SHIELDON, Pkmn.BASTIODON, Pkmn.TIRTOUGA,
      Pkmn.CARRACOSTA, Pkmn.CRANIDOS, Pkmn.RAMPARDOS, Pkmn.AXEW,
      Pkmn.FRAXURE, Pkmn.HAXORUS, Pkmn.WHISMUR, Pkmn.LOUDRED,
      Pkmn.EXPLOUD
    ],
    [Rarity.EPIC] : [
      Pkmn.ABRA, Pkmn.KADABRA, Pkmn.ALAKAZAM,
      Pkmn.LARVITAR, Pkmn.PUPITAR, Pkmn.TYRANITAR,
      Pkmn.SLAKOTH, Pkmn.VIGOROTH, Pkmn.SLAKING,
      Pkmn.RALTS, Pkmn.KIRLIA, Pkmn.GARDEVOIR,
      Pkmn.BAGON, Pkmn.SHELGON, Pkmn.SALAMENCE,
      Pkmn.BELDUM, Pkmn.METANG, Pkmn.METAGROSS,
      Pkmn.GIBLE, Pkmn.GABITE, Pkmn.GARCHOMP,
      Pkmn.ELEKID, Pkmn.ELECTABUZZ, Pkmn.ELECTIVIRE,
      Pkmn.LITWICK, Pkmn.LAMPENT, Pkmn.CHANDELURE,
      Pkmn.SNORUNT, Pkmn.GLALIE, Pkmn.FROSLASS,
      Pkmn.AERODACTYL, Pkmn.AMAURA, Pkmn.AURORUS,
      Pkmn.TYRUNT, Pkmn.TYRANTRUM, Pkmn.BUDEW,
      Pkmn.ROSELIA, Pkmn.ROSERADE, Pkmn.PORYGON,
      Pkmn.PORYGON2, Pkmn.PORYGONZ, Pkmn.HONEDGE,
      Pkmn.DOUBLADE, Pkmn.AEGISLASH, Pkmn.CUBONE,
      Pkmn.MAROWAK, Pkmn.ALOLANMAROWAK, Pkmn.TYMPOLE,
      Pkmn.PALPITOAD, Pkmn.SEISMITOAD, Pkmn.SEWADDLE,
      Pkmn.SWADLOON, Pkmn.LEAVANNY, Pkmn.JANGMOO,
      Pkmn.HAKAMOO, Pkmn.KOMMOO
    ],
    [Rarity.LEGENDARY] : [
      Pkmn.GASTLY, Pkmn.HAUNTER, Pkmn.GENGAR,
      Pkmn.ONIX, Pkmn.STEELIX, Pkmn.MEGASTEELIX,
      Pkmn.SCYTHER, Pkmn.SCIZOR, Pkmn.MEGASCIZOR,
      Pkmn.RIOLU, Pkmn.LUCARIO, Pkmn.MEGALUCARIO,
      Pkmn.MEDITITE, Pkmn.MEDICHAM, Pkmn.MEGAMEDICHAM,
      Pkmn.NUMEL, Pkmn.CAMERUPT, Pkmn.MEGACAMERUPT,
      Pkmn.SNOVER, Pkmn.ABOMASNOW, Pkmn.MEGAABOMASNOW,
      Pkmn.SWABLU, Pkmn.BUNEARY, Pkmn.LOPUNNY,
      Pkmn.MEGALOPUNNY, Pkmn.ELECTRIKE, Pkmn.MANECTRIC,
      Pkmn.MEGAMANECTRIC, Pkmn.SHUPPET, Pkmn.BANETTE,
      Pkmn.MEGABANETTE, Pkmn.ALTARIA, Pkmn.MEGAALTARIA
    ],
    [Rarity.MYTHICAL] : [
      Pkmn.LUGIA, Pkmn.GIRATINA, Pkmn.ZAPDOS,
      Pkmn.MOLTRES, Pkmn.ARTICUNO, Pkmn.DIALGA,
      Pkmn.PALKIA, Pkmn.SUICUNE, Pkmn.RAIKOU,
      Pkmn.ENTEI, Pkmn.REGICE, Pkmn.REGIROCK,
      Pkmn.REGISTEEL, Pkmn.KYOGRE, Pkmn.GROUDON,
      Pkmn.RAYQUAZA, Pkmn.REGIGIGAS, Pkmn.DARKRAI,
      Pkmn.VOLCARONA, Pkmn.LANDORUS, Pkmn.THUNDURUS,
      Pkmn.TORNADUS, Pkmn.KELDEO, Pkmn.TERRAKION,
      Pkmn.VIRIZION, Pkmn.COBALION, Pkmn.MANAPHY,
      Pkmn.ROTOM, Pkmn.SPIRITOMB, Pkmn.ABSOL,
      Pkmn.LAPRAS, Pkmn.LATIAS, Pkmn.LATIOS,
      Pkmn.MESPRIT, Pkmn.AZELF, Pkmn.UXIE,
      Pkmn.MEWTWO, Pkmn.KYUREM, Pkmn.RESHIRAM,
      Pkmn.ZEKROM, Pkmn.CELEBI, Pkmn.VICTINI,
      Pkmn.JIRACHI, Pkmn.ARCEUS, Pkmn.DEOXYS,
      Pkmn.SHAYMIN, Pkmn.CRESSELIA, Pkmn.HEATRAN,
      Pkmn.HOOH, Pkmn.PRIMALKYOGRE, Pkmn.PRIMALGROUDON,
      Pkmn.MEGARAYQUAZA, Pkmn.MELOETTA, Pkmn.CASTFORM,
      Pkmn.CASTFORMSUN, Pkmn.CASTFORMRAIN, Pkmn.CASTFORMHAIL
    ],
    [Rarity.NEUTRAL] : [Pkmn.GYARADOS],
    [Rarity.SUMMON] : [
      Pkmn.CARVANHA,
      Pkmn.ODDISH,
      Pkmn.GLOOM,
      Pkmn.VILEPLUME,
      Pkmn.BELLOSSOM,
      Pkmn.HOUNDOUR
    ]
  };


  export const NEUTRAL_STAGE = [
    {
      turn: 1,
      avatar: Pkmn.MAGIKARP
    },
    {
      turn: 2,
      avatar: Pkmn.RATICATE
    },
    {
      turn: 3,
      avatar: Pkmn.FEAROW
    },
    {
      turn: 10,
      avatar: Pkmn.GYARADOS
    },
    {
      turn: 15,
      avatar: Pkmn.LUGIA
    },
    {
      turn: 20,
      avatar: Pkmn.GIRATINA
    },
    {
      turn: 25,
      avatar: Pkmn.ZAPDOS
    },
    {
      turn: 30,
      avatar: Pkmn.DIALGA
    },
    {
      turn: 35,
      avatar: Pkmn.SUICUNE
    },
    {
      turn: 40,
      avatar: Pkmn.REGICE
    },
    {
      turn: 45,
      avatar: Pkmn.RAYQUAZA
    },
    {
      turn: 50,
      avatar: Pkmn.RAYQUAZA
    },
    {
      turn: 55,
      avatar: Pkmn.RAYQUAZA
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
        pokemons: [Pkmn.IVYSAUR, Pkmn.METAPOD, Pkmn.RATICATE, Pkmn.WEEPINBELL, Pkmn.BAYLEEF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.TORTERRA, Pkmn.SKUNTANK, Pkmn.URSARING, Pkmn.BIBAREL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      SEVEN_STATION_PATH: {
        id: 'SEVEN_STATION_PATH',
        name: '7th Station Path',
        pokemons: [Pkmn.SKUNTANK, Pkmn.FEAROW, Pkmn.PRIMEAPE, Pkmn.MAROWAK, Pkmn.HITMONCHAN, Pkmn.FURRET, Pkmn.URSARING, Pkmn.SHEDNINJA, Pkmn.BIBAREL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FIGHTING
      },
      BARREN_VALLEY: {
        id: 'BARREN_VALLEY',
        name: 'Barren Valley',
        pokemons: [Pkmn.JUMPLUFF, Pkmn.FLYGON, Pkmn.LUNATONE, Pkmn.HONCHKROW, Pkmn.GLAMEOW, Pkmn.TOXICROAK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.DARK
      },
      DARK_ICE_MOUNTAIN_PEAK: {
        id: 'DARK_ICE_MOUNTAIN_PEAK',
        name: 'Dark Ice Mountain Peak',
        pokemons: [Pkmn.GENGAR, Pkmn.SKARMORY, Pkmn.DUSKULL, Pkmn.METANG, Pkmn.LICKILICKY, Pkmn.TANGROWTH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_ICE_MOUNTAIN: {
        id: 'DARK_ICE_MOUNTAIN',
        name: 'Dark Ice Mountain',
        pokemons: [Pkmn.BANETTE, Pkmn.GENGAR, Pkmn.SKARMORY, Pkmn.DUSKULL, Pkmn.METANG, Pkmn.LICKILICKY, Pkmn.TANGROWTH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_WASTELAND: {
        id: 'DARK_WASTELAND',
        name: 'Dark Wasteland',
        pokemons: [Pkmn.GASTLY, Pkmn.ONIX, Pkmn.MISDREAVUS, Pkmn.SHIFTRY, Pkmn.SOLROCK, Pkmn.SKORUPI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DEEP_BOULDER_QUARRY: {
        id: 'DEEP_BOULDER_QUARRY',
        name: 'Deep Boulder Quarry',
        pokemons: [Pkmn.CLAYDOL, Pkmn.GLISCOR, Pkmn.NINJASK, Pkmn.MUK, Pkmn.PROBOPASS, Pkmn.SHELGON, Pkmn.RHYDON, Pkmn.TANGROWTH, Pkmn.METANG, Pkmn.STEELIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      LIMESTONE_CAVERN: {
        id: 'LIMESTONE_CAVERN',
        name: 'Limestone Cavern',
        pokemons: [Pkmn.KINGLER, Pkmn.MARILL, Pkmn.SLOWKING, Pkmn.VOLBEAT, Pkmn.ILLUMISE, Pkmn.SEVIPER, Pkmn.DRAGONAIR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      DEEP_LIMESTONE_CAVERN: {
        id: 'DEEP_LIMESTONE_CAVERN',
        name: 'Deep Limestone Cavern',
        pokemons: [Pkmn.DRAGONAIR, Pkmn.AERODACTYL, Pkmn.MASQUERAIN, Pkmn.VOLBEAT, Pkmn.ILLUMISE, Pkmn.SEVIPER, Pkmn.POLIWHIRL, Pkmn.DUGTRIO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      ICICLE_FOREST: {
        id: 'ICICLE_FOREST',
        name: 'Icicle Forest',
        pokemons: [Pkmn.GENGAR, Pkmn.WEEZING, Pkmn.CACTURNE, Pkmn.METAGROSS, Pkmn.LICKILICKY, Pkmn.GLISCOR, Pkmn.DRIFBLIM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ICE
      },
      MURKY_FOREST: {
        id: 'MURKY_FOREST',
        name: 'Murky Forest',
        pokemons: [Pkmn.EXEGGCUTE, Pkmn.HOOTHOOT, Pkmn.HOPPIP, Pkmn.DODUO, Pkmn.WEEDLE, Pkmn.BURMY, Pkmn.SPINARAK, Pkmn.WURMPLE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.BUG
      },
      SPACIAL_CLIFFS: {
        id: 'SPACIAL_CLIFFS',
        name: 'Spacial Cliffs',
        pokemons: [Pkmn.HAUNTER, Pkmn.BELDUM, Pkmn.MISDREAVUS, Pkmn.KOFFING, Pkmn.SHEDNINJA, Pkmn.BANETTE, Pkmn.MISMAGIUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      TEMPORAL_SPIRE_FUTURE: {
        id: 'TEMPORAL_SPIRE_FUTURE',
        name: 'Temporal Spire Future',
        pokemons: [Pkmn.GOLBAT, Pkmn.ALAKAZAM, Pkmn.MAGNETON, Pkmn.GASTLY, Pkmn.HYPNO, Pkmn.CLAYDOL, Pkmn.MISMAGIUS, Pkmn.BRONZONG, Pkmn.PORYGON2, Pkmn.CROBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TEMPORAL_TOWER_FUTURE: {
        id: 'TEMPORAL_TOWER_FUTURE',
        name: 'Temporal Tower Future',
        pokemons: [Pkmn.ZUBAT, Pkmn.KADABRA, Pkmn.MAGNEMITE, Pkmn.GASTLY, Pkmn.DROWZEE, Pkmn.CLAYDOL, Pkmn.MISMAGIUS, Pkmn.BRONZONG, Pkmn.GOLBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      VAST_ICE_MOUNTAIN_PEAK: {
        id: 'VAST_ICE_MOUNTAIN_PEAK',
        name: 'Vast Ice Mountain Peak',
        pokemons: [Pkmn.GENGAR, Pkmn.AERODACTYL, Pkmn.SMOOCHUM, Pkmn.DUSCLOPS, Pkmn.ABSOL, Pkmn.METAGROSS, Pkmn.MAGNEZONE, Pkmn.GLISCOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      VAST_ICE_MOUNTAIN: {
        id: 'VAST_ICE_MOUNTAIN',
        name: 'Vast Ice Mountain',
        pokemons: [Pkmn.GENGAR, Pkmn.AERODACTYL, Pkmn.SMOOCHUM, Pkmn.DUSCLOPS, Pkmn.ABSOL, Pkmn.METAGROSS, Pkmn.MAGNEZONE, Pkmn.GLISCOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      AMP_PLAINS: {
        id: 'AMP_PLAINS',
        name: 'Amp Plains',
        pokemons: [Pkmn.PLUSLE, Pkmn.MINUN, Pkmn.MAREEP, Pkmn.PHANPY, Pkmn.ELEKID, Pkmn.SHINX, Pkmn.GIRAFARIG, Pkmn.ZAPDOS, Pkmn.FLAFFY, Pkmn.PIKACHU, Pkmn.PICHU, Pkmn.YANMEGA, Pkmn.ELECTABUZZ],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      FAR_AMP_PLAINS: {
        id: 'FAR_AMP_PLAINS',
        name: 'Far Amp Plains',
        pokemons: [Pkmn.SHINX, Pkmn.GIRAFARIG, Pkmn.PIKACHU, Pkmn.PICHU, Pkmn.YANMEGA, Pkmn.FLAFFY, Pkmn.ELECTABUZZ, Pkmn.TAUROS, Pkmn.DODRIO, Pkmn.ELECTRIKE, Pkmn.LUXIO, Pkmn.LUXRAY, Pkmn.AMPHAROS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      FINAL_MAZE_B23F: {
        id: 'FINAL_MAZE_B23F',
        name: 'Final Maze',
        pokemons: [Pkmn.MACHOP, Pkmn.MAGNEMITE, Pkmn.DODUO, Pkmn.OMANYTE, Pkmn.KABUTO, Pkmn.SPINARAK, Pkmn.MAREEP, Pkmn.MISDREAVUS, Pkmn.SWINUB, Pkmn.HOUNDOUR, Pkmn.PHANPY, Pkmn.MAGBY, Pkmn. POOCHYENA, Pkmn.SHROOMISH, Pkmn.MAWILE, Pkmn.MEDITITE, Pkmn.BAGON, Pkmn.STARAVIA, Pkmn.SKORUPI, Pkmn.CARNIVINE, Pkmn.JIRACHI, Pkmn.MOLTRES, Pkmn.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      FOGGY_FOREST: {
        id: 'FOGGY_FOREST',
        name: 'Foggy Forest',
        pokemons: [Pkmn.HOOTHOOT, Pkmn.DUNSPARCE, Pkmn.SMEARGLE, Pkmn.CHERUBI, Pkmn.SKIPLOOM, Pkmn.ZIGZAGOON, Pkmn.PACHIRISU, Pkmn.NOCTOWL, Pkmn.STANTLER, Pkmn.BUNEARY, Pkmn.PINSIR, Pkmn. BRELOOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      FOREST_PATH: {
        id: 'FOREST_PATH',
        name: 'Forest Path',
        pokemons: [Pkmn.PINSIR, Pkmn.DUNSPARCE, Pkmn.SWINUB, Pkmn.HOUNDOUR, Pkmn.LINOONE, Pkmn.KRICKEROT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      GOLD_CHAMBER: {
        id: 'GOLD_CHAMBER',
        name: 'Gold Chamber',
        pokemons: [Pkmn.MACHOP, Pkmn.MAGNEMITE, Pkmn.DODUO, Pkmn.OMANYTE, Pkmn.KABUTO, Pkmn.SPINARAK, Pkmn.MAREEP, Pkmn.MISDREAVUS, Pkmn.SWINUB, Pkmn.HOUNDOUR, Pkmn.PHANPY, Pkmn.MAGBY, Pkmn. POOCHYENA, Pkmn.SHROOMISH, Pkmn.MAWILE, Pkmn.MEDITITE, Pkmn.BAGON, Pkmn.STARAVIA, Pkmn.SKORUPI, Pkmn.CARNIVINE, Pkmn.JIRACHI, Pkmn.MOLTRES, Pkmn.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      HIDDEN_HIGHLAND: {
        id: 'HIDDEN_HIGHLAND',
        name: 'Hidden Highland',
        pokemons: [Pkmn.DRAGONITE, Pkmn.MANECTRIC, Pkmn.TROPIUS, Pkmn.RAMPARDOS, Pkmn.BASTIODON, Pkmn.PURUGLY, Pkmn.GARCHOMP, Pkmn.ABOMASNOW, Pkmn.MAGMORTAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTERY_JUNGLE_01F_15F: {
        id: 'MYSTERY_JUNGLE_01F_15F',
        name: 'Mystery Jungle',
        pokemons: [Pkmn.MEW, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.WALL_ALT_3, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTERY_JUNGLE_16F_30F: {
        id: 'MYSTERY_JUNGLE_16F_30F',
        name: 'Mystery Jungle',
        pokemons: [Pkmn.MEW, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTIFYING_FOREST: {
        id: 'MYSTIFYING_FOREST',
        name: 'Mystifying Forest',
        pokemons: [Pkmn.CELEBI, Pkmn.DARKRAI, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      BEACH_CAVE: {
        id: 'BEACH_CAVE',
        name: 'Beach Cave',
        pokemons: [Pkmn.SHELLDER, Pkmn.SHELLOS, Pkmn.KABUTO, Pkmn.CORSOLA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.GROUND_ALT_4, HDR.WATER],
        type: Synergy.WATER
      },
      BOTTOMLESS_SEA: {
        id: 'BOTTOMLESS_SEA',
        name: 'Bottomless Sea',
        pokemons: [Pkmn.KYOGRE, Pkmn.GYARADOS, Pkmn.REMORAID, Pkmn.KINGDRA, Pkmn.WAILMER, Pkmn.CLAMPERL, Pkmn.FINNEON, Pkmn.TENTACRUEL, Pkmn.SLOWBRO, Pkmn.HORSEA, Pkmn.SEADRA, Pkmn.STARMIE, Pkmn.SLOWKING, Pkmn.LAPRAS, Pkmn.WAILORD],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      BRINE_CAVE: {
        id: 'BRINE_CAVE',
        name: 'Brine Cave',
        pokemons: [Pkmn.SEEL, Pkmn.OMANYTE, Pkmn.KINGLER, Pkmn.PELIPPER, Pkmn.GASTRODON, Pkmn.TENTACOOL, Pkmn.DEWGONG, Pkmn.STARYU, Pkmn.DRAGONAIR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      CONCEALED_RUINS: {
        id: 'CONCEALED_RUINS',
        name: 'Concealed Ruins',
        pokemons: [Pkmn.PIDGEY, Pkmn.VOLTORB, Pkmn.POOCHYENA, Pkmn.TAILOW, Pkmn.LOUDRED, Pkmn.NIDOQUEEN, Pkmn.WEEZING, Pkmn.MURKROW, Pkmn.DELCATTY, Pkmn.PIDGEOTTO, Pkmn.SHUPPET, Pkmn.ELECTRODE, Pkmn.EXPLOUD, Pkmn.RAIKOU, Pkmn.PIDGEOT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      CRAGGY_COAST: {
        id: 'CRAGGY_COAST',
        name: 'Craggy Coast',
        pokemons: [Pkmn.SPHEAL, Pkmn.KRABBY, Pkmn.DRATINI, Pkmn.WINGULL, Pkmn.GASTRODON, Pkmn.SEALEO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      CRYSTAL_CAVE_01F_05F: {
        id: 'CRYSTAL_CAVE_01F_05F',
        name: 'Crystal Cave',
        pokemons: [Pkmn.GRAVELER, Pkmn.SEVIPER, Pkmn.BELDUM, Pkmn.WORMADAN, Pkmn.RIOLU, Pkmn.CRANIDOS, Pkmn.DONPHAN, Pkmn.SHIELDON, Pkmn.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      CRYSTAL_CAVE_06F_11F: {
        id: 'CRYSTAL_CAVE_06F_11F',
        name: 'Crystal Cave',
        pokemons: [Pkmn.GRAVELER, Pkmn.SEVIPER, Pkmn.BELDUM, Pkmn.WORMADAN, Pkmn.RIOLU, Pkmn.CRANIDOS, Pkmn.DONPHAN, Pkmn.SHIELDON, Pkmn.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      CRYSTAL_CROSSING: {
        id: 'CRYSTAL_CROSSING',
        name: 'Crystal Crossing',
        pokemons: [Pkmn.FLOATZEL, Pkmn.BAGON, Pkmn.WORMADAN, Pkmn.GLAMEOW, Pkmn.ABSOL, Pkmn.GLALIE, Pkmn.FROSLASS, Pkmn.AZELF],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DARK_CRATER: {
        id: 'DARK_CRATER',
        name: 'Dark Crater',
        pokemons: [Pkmn.CHARMANDER, Pkmn.CYNDAQUIL, Pkmn.HIPPOWDON, Pkmn.NUMEL, Pkmn.SLUGMA, Pkmn.GROWLITHE, Pkmn.PONYTA, Pkmn.TORCHIC, Pkmn.FLAREON, Pkmn.COMBUSKEN, Pkmn.RAPIDASH, Pkmn.MEWTWO, Pkmn.ARCANINE, Pkmn.QUILAVA, Pkmn.MAGCARGO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      DEEP_DARK_CRATER: {
        id: 'DEEP_DARK_CRATER',
        name: 'Deep Dark Crater',
        pokemons: [Pkmn.CHARMELEON, Pkmn.QUILAVA, Pkmn.MONFERNO, Pkmn.CAMERUPT, Pkmn.COMBUSKEN, Pkmn.ARCANINE, Pkmn.RAPIDASH, Pkmn.FLAREON, Pkmn.MAGCARGO, Pkmn.RHYPERIOR, Pkmn.MAGMORTAR, Pkmn.CHARIZARD, Pkmn.TYPHLOSION, Pkmn.INFERNAPE, Pkmn.MISMAGIUS, Pkmn.BLAZIKEN, Pkmn.AGGRON, Pkmn.ENTEI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      DARK_HILL_01F_06F: {
        id: 'DARK_HILL_01F_06F',
        name: 'Dark Hill',
        pokemons: [Pkmn.GASTLY, Pkmn.HAUNTER, Pkmn.GENGAR, Pkmn.BANETTE, Pkmn.DUSCLOPS, Pkmn.CLAYDOL, Pkmn.MISMAGIUS, Pkmn.GLISCOR, Pkmn.MISDREAVUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_HILL_07F_15F: {
        id: 'DARK_HILL_07F_15F',
        name: 'Dark Hill',
        pokemons: [Pkmn.GASTLY, Pkmn.HAUNTER, Pkmn.GENGAR, Pkmn.BANETTE, Pkmn.DUSCLOPS, Pkmn.CLAYDOL, Pkmn.MISMAGIUS, Pkmn.GLISCOR, Pkmn.MISDREAVUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DEEP_DUSK_FOREST_01F_06F: {
        id: 'DEEP_DUSK_FOREST_01F_06F',
        name: 'Deep Dusk Forest',
        pokemons: [Pkmn.VULPIX, Pkmn.RHYDON, Pkmn.STEELIX, Pkmn.AGGRON, Pkmn.LEAFEON, Pkmn.HIPPOWDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DEEP_DUSK_FOREST_07F_12F: {
        id: 'DEEP_DUSK_FOREST_07F_12F',
        name: 'Deep Dusk Forest',
        pokemons: [Pkmn.VULPIX, Pkmn.RHYDON, Pkmn.STEELIX, Pkmn.AGGRON, Pkmn.LEAFEON, Pkmn.HIPPOWDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DEEP_SEALED_RUIN: {
        id: 'DEEP_SEALED_RUIN',
        name: 'Deep Sealed Ruin',
        pokemons: [Pkmn.MUK, Pkmn.FORETRESS, Pkmn.SHELGON, Pkmn.METANG, Pkmn.TANGROWTH, Pkmn.PROBOPASS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.METAL
      },
      DRENCHED_BLUFF: {
        id: 'DRENCHED_BLUFF',
        name: 'Drenched Bluff',
        pokemons: [Pkmn.LILEEP, Pkmn.ANORITH, Pkmn.SHELLOS, Pkmn.CHINGLING],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      DUSK_FOREST_01F_04F: {
        id: 'DUSK_FOREST_01F_04F',
        name: 'Dusk Forest',
        pokemons: [Pkmn.JUMPLUFF, Pkmn.MOTHIM, Pkmn.MISMAGIUS, Pkmn.GABITE, Pkmn.HAUNTER, Pkmn.LICKITUNG, Pkmn.CLAYDOL, Pkmn.SALAMENCE, Pkmn.MISMAGIUS, Pkmn.HIPPOWDON, Pkmn.RHYPERIOR, Pkmn.DRIFLOON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DUSK_FOREST_05F_08F: {
        id: 'DUSK_FOREST_05F_08F',
        name: 'Dusk Forest',
        pokemons: [Pkmn.JUMPLUFF, Pkmn.MOTHIM, Pkmn.MISMAGIUS, Pkmn.GABITE, Pkmn.HAUNTER, Pkmn.LICKITUNG, Pkmn.CLAYDOL, Pkmn.SALAMENCE, Pkmn.MISMAGIUS, Pkmn.HIPPOWDON, Pkmn.RHYPERIOR, Pkmn.DRIFLOON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      NORTHERN_DESERT_01F_07F: {
        id: 'NORTHERN_DESERT_01F_07F',
        name: 'Northern Desert',
        pokemons: [Pkmn.BALTOY, Pkmn.CUBONE, Pkmn.ARON, Pkmn.CACNEA, Pkmn.LARVITAR, Pkmn.SANDSHREW, Pkmn.TRAPINCH, Pkmn.CARNIVINE, Pkmn.RHYHORN, Pkmn.LAIRON, Pkmn.CACTURNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      QUICKSAND_CAVE: {
        id: 'QUICKSAND_CAVE',
        name: 'Quicksand Cave',
        pokemons: [Pkmn.NINCADA, Pkmn.VIBRAVA, Pkmn.PUPITAR, Pkmn.SKORUPI, Pkmn.SANDSLASH, Pkmn.MAWILE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      QUICKSAND_PIT: {
        id: 'QUICKSAND_PIT',
        name: 'Quicksand Pit',
        pokemons: [Pkmn.MESPRIT, Pkmn.PUPITAR, Pkmn.SKORUPI, Pkmn.MAWILE, Pkmn.SANDSLASH, Pkmn.TYRANITAR, Pkmn.HIPPOPOTAS, Pkmn.NINJASK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      ROCK_AEGIS_CAVE: {
        id: 'ROCK_AEGIS_CAVE',
        name: 'Rock Aegis Cave',
        pokemons: [Pkmn.ZUBAT, Pkmn.GOLBAT, Pkmn.UNOWN, Pkmn.MACHOKE, Pkmn.MACHAMP, Pkmn.REGIROCK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.MINERAL
      },
      SURROUNDED_SEA: {
        id: 'SURROUNDED_SEA',
        name: 'Surrounded Sea',
        pokemons: [Pkmn.SHELLDER, Pkmn.CARVANHA, Pkmn.WAILMER, Pkmn.SLOWBRO, Pkmn.TENTACRUEL, Pkmn.STARMIE, Pkmn.QWILFISH, Pkmn.HORSEA, Pkmn.SEADRA, Pkmn.SLOWKING, Pkmn.REMORAID, Pkmn.OCTIRELLY, Pkmn.KINGDRA, Pkmn.CLAMPERL, Pkmn.FINNEON, Pkmn.LAPRAS, Pkmn.WAILORD, Pkmn.LUGIA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      TEMPORAL_SPIRE: {
        id: 'TEMPORAL_SPIRE',
        name: 'Temporal Spire',
        pokemons: [Pkmn.DIALGA, Pkmn.DEOXYS, Pkmn.BRONZONG, Pkmn.PORYGON, Pkmn.SALAMENCE, Pkmn.PORYGONZ, Pkmn.METAGROSS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.METAL
      },
      TEMPORAL_TOWER: {
        id: 'TEMPORAL_TOWER',
        name: 'Temporal Tower',
        pokemons: [Pkmn.PORYGON, Pkmn.LUNATONE, Pkmn.SOLROCK, Pkmn.BRONZOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TEST_DUNGEON: {
        id: 'TEST_DUNGEON',
        name: 'Test Dungeon',
        pokemons: [Pkmn.PORYGON, Pkmn.UNOWN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      THE_NIGHTMARE: {
        id: 'THE_NIGHTMARE',
        name: 'The Nightmare',
        pokemons: [Pkmn.SPOINK, Pkmn.CLEFFA, Pkmn.CLEFAIRY, Pkmn.JIGGLYPUFF, Pkmn.WYNAUT, Pkmn.SPINDA, Pkmn.LICKITUNG, Pkmn.ESPEON, Pkmn.WOOBUFFET, Pkmn.MILTANK, Pkmn.BLISSEY, Pkmn.WHISMUR, Pkmn.SKITTY, Pkmn.PERSIAN, Pkmn.IGGLYBUFF, Pkmn.CLEFABLE, Pkmn.WIGGLYTUFF, Pkmn.CHANSEY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      TINY_MEADOW: {
        id: 'TINY_MEADOW',
        name: 'Tiny Meadow',
        pokemons: [Pkmn.SKIPLOOM, Pkmn.BRELOOM, Pkmn.STARAVIA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      TREESHROUD_FOREST_01F_08F: {
        id: 'TREESHROUD_FOREST_01F_08F',
        name: 'Treeshroud Forest',
        pokemons: [Pkmn.KADABRA, Pkmn.RALTS, Pkmn.CHERIM, Pkmn.HOUNDOOM, Pkmn.NINETALES, Pkmn.ALAKAZAM, Pkmn.KIRLIA, Pkmn.VESPIQUEEN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TREESHROUD_FOREST_09F_21F: {
        id: 'TREESHROUD_FOREST_09F_21F',
        name: 'Treeshroud Forest',
        pokemons: [Pkmn.KADABRA, Pkmn.RALTS, Pkmn.CHERIM, Pkmn.HOUNDOOM, Pkmn.NINETALES, Pkmn.ALAKAZAM, Pkmn.KIRLIA, Pkmn.VESPIQUEEN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      STEAM_CAVE: {
        id: 'STEAM_CAVE',
        name: 'Steam Cave',
        pokemons: [Pkmn.SNUBULL, Pkmn.SLUGMA, Pkmn.MAGBY, Pkmn.NUMEL, Pkmn.FARFETCH, Pkmn.YANMEGA, Pkmn.KRICKETUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      QUICKSAND_PIT_2: {
        id: 'QUICKSAND_PIT_2',
        name: 'Quicksand Pit',
        pokemons: [Pkmn.MESPRIT, Pkmn.PUPITAR, Pkmn.SKORUPI, Pkmn.MAWILE, Pkmn.SANDSLASH, Pkmn.TYRANITAR, Pkmn.HIPPOPOTAS, Pkmn.NINJASK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      LOWER_BRINE_CAVE: {
        id: 'LOWER_BRINE_CAVE',
        name: 'Lower Brine Cave',
        pokemons: [Pkmn.WALREIN, Pkmn.DRAGONAIR, Pkmn.STARYU, Pkmn.TENTACOOL, Pkmn.DEWGONG, Pkmn.GASTRODON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      HIDDEN_LAND: {
        id: 'HIDDEN_LAND',
        name: 'Hidden land',
        pokemons: [Pkmn.DRAGONITE, Pkmn.MANECTRIC, Pkmn.TROPIUS, Pkmn.RAMPARDOS, Pkmn.BASTIODON, Pkmn.PURUGLY, Pkmn.GARCHOMP, Pkmn.ABOMASNOW, Pkmn.MAGMORTAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      TEMPORAL_TOWER_2: {
        id: 'TEMPORAL_TOWER_2',
        name: 'Temporal Tower',
        pokemons: [Pkmn.PORYGON, Pkmn.LUNATONE, Pkmn.SOLROCK, Pkmn.BRONZOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      CRYSTAL_CAVE_2: {
        id: 'CRYSTAL_CAVE_2',
        name: 'Crystal Cave',
        pokemons: [Pkmn.GRAVELER, Pkmn.SEVIPER, Pkmn.BELDUM, Pkmn.WORMADAN, Pkmn.RIOLU, Pkmn.CRANIDOS, Pkmn.DONPHAN, Pkmn.SHIELDON, Pkmn.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      WATERFALL_CAVE: {
        id: 'WATERFALL_CAVE',
        name: 'Waterfall Cave',
        pokemons: [Pkmn.PSYDUCK, Pkmn.POLIWAG, Pkmn.GRIMER, Pkmn.TANGELA, Pkmn.WOOPER, Pkmn.LOTAD, Pkmn.SURSKIT, Pkmn.BARBOACH, Pkmn.WHISCASH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      WORLD_ABYSS: {
        id: 'WORLD_ABYSS',
        name: 'World Abyss',
        pokemons: [Pkmn.GIRATINA, Pkmn.TAILOW, Pkmn.PIDGEY, Pkmn.MURKROW, Pkmn.VOLTORB, Pkmn.POOCHYENA, Pkmn.LOUDRED, Pkmn.PIDGEOTTO, Pkmn.NIDOQUEEN, Pkmn.ELECTRODE, Pkmn.WEEZING, Pkmn.UMBREON, Pkmn.DELCATTY, Pkmn.SWELLOW, Pkmn.EXPLOUD, Pkmn.MIGHTYENA, Pkmn.PIDGEOT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      ZERO_ISLE_EAST_15F_25F: {
        id: 'ZERO_ISLE_EAST_15F_25F',
        name: 'Zero Isle East',
        pokemons: [Pkmn.DEWGONG, Pkmn.SHELLDER, Pkmn.CORSOLA, Pkmn.KABUTO, Pkmn.AZUMARILL, Pkmn.SLOWPOKE, Pkmn.YANMA, Pkmn.TENTACRUEL, Pkmn.VOLTORB, Pkmn.SPEAROW, Pkmn.SEEDOT, Pkmn.GOLBAT, Pkmn.HOOTHOOT, Pkmn.WYNAUT, Pkmn.HOUNDOUR, Pkmn.WAILMER, Pkmn.MAGNETON, Pkmn.BEEDRILL, Pkmn.VULPIX, Pkmn.FERALIGATR, Pkmn.SPINARAK, Pkmn.SLUGMA, Pkmn.CHANSEY, Pkmn.KRABBY, Pkmn.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      ZERO_ISLE_EAST_26F_40F: {
        id: 'ZERO_ISLE_EAST_26F_40F',
        name: 'Zero Isle East',
        pokemons: [Pkmn.DEWGONG, Pkmn.SHELLDER, Pkmn.CORSOLA, Pkmn.KABUTO, Pkmn.AZUMARILL, Pkmn.SLOWPOKE, Pkmn.YANMA, Pkmn.TENTACRUEL, Pkmn.VOLTORB, Pkmn.SPEAROW, Pkmn.SEEDOT, Pkmn.GOLBAT, Pkmn.HOOTHOOT, Pkmn.WYNAUT, Pkmn.HOUNDOUR, Pkmn.WAILMER, Pkmn.MAGNETON, Pkmn.BEEDRILL, Pkmn.VULPIX, Pkmn.FERALIGATR, Pkmn.SPINARAK, Pkmn.SLUGMA, Pkmn.CHANSEY, Pkmn.KRABBY, Pkmn.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      ZERO_ISLE_SOUTH_01F_03F: {
        id: 'ZERO_ISLE_SOUTH_01F_03F',
        name: 'Zero Isle South',
        pokemons: [Pkmn.PIDGEY, Pkmn.JIGGLYPUFF, Pkmn.SHELLDER, Pkmn.SEADRA, Pkmn.STARYU, Pkmn.STARMIE, Pkmn.CHINGLING, Pkmn.CLEFFA, Pkmn.BELLSPROUT, Pkmn.EXEGGCUTE, Pkmn.CHINCHOU, Pkmn.POOCHYENA, Pkmn.NIDORANM, Pkmn.LARVITAR, Pkmn.RATTATA, Pkmn.TOGEPI, Pkmn.EEVEE, Pkmn.RALTS, Pkmn.BALTOY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      ZERO_ISLE_SOUTH_04F_08F: {
        id: 'ZERO_ISLE_SOUTH_04F_08F',
        name: 'Zero Isle East',
        pokemons: [Pkmn.PIDGEY, Pkmn.JIGGLYPUFF, Pkmn.SHELLDER, Pkmn.SEADRA, Pkmn.STARYU, Pkmn.STARMIE, Pkmn.CHINGLING, Pkmn.CLEFFA, Pkmn.BELLSPROUT, Pkmn.EXEGGCUTE, Pkmn.CHINCHOU, Pkmn.POOCHYENA, Pkmn.NIDORANM, Pkmn.LARVITAR, Pkmn.RATTATA, Pkmn.TOGEPI, Pkmn.EEVEE, Pkmn.RALTS, Pkmn.BALTOY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      BURIED_RELIC_1F_20F: {
        id: 'BURIED_RELIC_1F_20F',
        name: 'Buried Relic',
        pokemons: [Pkmn.GOLBAT, Pkmn.SNEASEL, Pkmn.WYNAUT, Pkmn.RATICATE, Pkmn.MACHOP, Pkmn.WHISMUR, Pkmn.HOOTHOOT, Pkmn.PORYGON, Pkmn.PORYGON2, Pkmn.ARON, Pkmn.REGIROCK, Pkmn.GEODUDE, Pkmn.REGISTEEL, Pkmn.REGICE, Pkmn.KADABRA, Pkmn.MEW, Pkmn.SHEDNINJA, Pkmn.SANDSHREW, Pkmn.MAWILE, Pkmn.GRAVELER, Pkmn.HAUNTER, Pkmn.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      BURIED_RELIC_21F_50F: {
        id: 'BURIED_RELIC_21F_50F',
        name: 'Buried Relic',
        pokemons: [Pkmn.GOLBAT, Pkmn.SNEASEL, Pkmn.WYNAUT, Pkmn.RATICATE, Pkmn.MACHOP, Pkmn.WHISMUR, Pkmn.HOOTHOOT, Pkmn.PORYGON, Pkmn.PORYGON2, Pkmn.ARON, Pkmn.REGIROCK, Pkmn.GEODUDE, Pkmn.REGISTEEL, Pkmn.REGICE, Pkmn.KADABRA, Pkmn.MEW, Pkmn.SHEDNINJA, Pkmn.SANDSHREW, Pkmn.MAWILE, Pkmn.GRAVELER, Pkmn.HAUNTER, Pkmn.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      BURIED_RELIC_51F_99F: {
        id: 'BURIED_RELIC_51F_99F',
        name: 'Buried Relic',
        pokemons: [Pkmn.GOLBAT, Pkmn.SNEASEL, Pkmn.WYNAUT, Pkmn.RATICATE, Pkmn.MACHOP, Pkmn.WHISMUR, Pkmn.HOOTHOOT, Pkmn.PORYGON, Pkmn.PORYGON2, Pkmn.ARON, Pkmn.REGIROCK, Pkmn.GEODUDE, Pkmn.REGISTEEL, Pkmn.REGICE, Pkmn.KADABRA, Pkmn.MEW, Pkmn.SHEDNINJA, Pkmn.SANDSHREW, Pkmn.MAWILE, Pkmn.GRAVELER, Pkmn.HAUNTER, Pkmn.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DARKNIGHT_RELIC: {
        id: 'DARKNIGHT_RELIC',
        name: 'Darknight Relic',
        pokemons: [Pkmn.SHUPPET, Pkmn.GASTLY, Pkmn.MISDREAVUS, Pkmn.SHEDNINJA, Pkmn.SABLEYE, Pkmn.BANETTE, Pkmn.HAUNTER, Pkmn.DUSKULL, Pkmn.GENGAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GHOST
      },
      SHIMMER_DESERT: {
        id: 'SHIMMER_DESERT',
        name: 'Shimmer Desert',
        pokemons: [Pkmn.EKANS, Pkmn.ARBOK, Pkmn.SANDSHREW, Pkmn.SANDSLASH, Pkmn.NIDOKING, Pkmn.DIGLETT, Pkmn.DUGTRIO, Pkmn.SUDOWOODO, Pkmn.GARCHOMP, Pkmn.RHYPERIOR, Pkmn.GROUDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      UNOWN_RELIC: {
        id: 'UNOWN_RELIC',
        name: 'Unown Relic',
        pokemons: [Pkmn.UNOWN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      FROSTY_FOREST: {
        id: 'FROSTY_FOREST',
        name: 'Frosty Forest',
        pokemons: [Pkmn.AZURILL, Pkmn.FURRET, Pkmn.NOSEPASS, Pkmn.PILOSWINE, Pkmn.MIGHTYENA, Pkmn.LAIRON, Pkmn.SNORUNT, Pkmn.ARTICUNO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ICE
      },
      GREAT_CANYON: {
        id: 'GREAT_CANYON',
        name: 'Great Canyon',
        pokemons: [Pkmn.SKIPLOOM, Pkmn.DUNSPARCE, Pkmn.PHANPY, Pkmn.DODUO, Pkmn.VILEPLUME, Pkmn.BRELOOM, Pkmn.MURKROW, Pkmn.CACTURNE, Pkmn.NOCTOWL, Pkmn.ARIADOS, Pkmn.TAUROS, Pkmn.HOUNDOOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      HOWLING_FOREST_01F_06F: {
        id: 'HOWLING_FOREST_01F_06F',
        name: 'Howling Forest',
        pokemons: [Pkmn.AZURILL, Pkmn.HOUNDOUR, Pkmn.POOCHYENA, Pkmn.WHISMUR, Pkmn.SPOINK, Pkmn.FURRET, Pkmn.PIDGEY, Pkmn.LOUDRED, Pkmn.HOUNDOOM, Pkmn.MIGHTYENA, Pkmn.GRUMPIG, Pkmn.SNORLAX, Pkmn.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      HOWLING_FOREST_07F_15F: {
        id: 'HOWLING_FOREST_07F_15F',
        name: 'Howling Forest',
        pokemons: [Pkmn.AZURILL, Pkmn.HOUNDOUR, Pkmn.POOCHYENA, Pkmn.WHISMUR, Pkmn.SPOINK, Pkmn.FURRET, Pkmn.PIDGEY, Pkmn.LOUDRED, Pkmn.HOUNDOOM, Pkmn.MIGHTYENA, Pkmn.GRUMPIG, Pkmn.SNORLAX, Pkmn.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      MT_FARAWAY: {
        id: 'MT_FARAWAY',
        name: 'Mt Faraway',
        pokemons: [Pkmn.LUNATONE, Pkmn.SNORUNT, Pkmn.SOLROCK, Pkmn.AZUMARILL, Pkmn.GOLEM, Pkmn.MARSHTOMP, Pkmn.VIGOROTH, Pkmn.GRANBULL, Pkmn.WEEZING, Pkmn.DUGTRIO, Pkmn.GLALIE, Pkmn.HOOH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_FARAWAY_10F_20F: {
        id: 'MT_FARAWAY_10F_20F',
        name: 'Mt Faraway',
        pokemons: [Pkmn.LUNATONE, Pkmn.SNORUNT, Pkmn.SOLROCK, Pkmn.AZUMARILL, Pkmn.GOLEM, Pkmn.MARSHTOMP, Pkmn.VIGOROTH, Pkmn.GRANBULL, Pkmn.WEEZING, Pkmn.DUGTRIO, Pkmn.GLALIE, Pkmn.HOOH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_FARAWAY_30F_39F: {
        id: 'MT_FARAWAY_30F_39F',
        name: 'Mt Faraway',
        pokemons: [Pkmn.LUNATONE, Pkmn.SNORUNT, Pkmn.SOLROCK, Pkmn.AZUMARILL, Pkmn.GOLEM, Pkmn.MARSHTOMP, Pkmn.VIGOROTH, Pkmn.GRANBULL, Pkmn.WEEZING, Pkmn.DUGTRIO, Pkmn.GLALIE, Pkmn.HOOH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ICE
      },
      JOYOUS_TOWER: {
        id: 'JOYOUS_TOWER',
        name: 'Joyous Tower',
        pokemons: [Pkmn.JIGGLYPUFF, Pkmn.TREECKO, Pkmn.BULBASAUR, Pkmn.TAILOW, Pkmn.PICHU, Pkmn.DIGLETT, Pkmn.SPINDA, Pkmn.PLUSLE, Pkmn.MINUN, Pkmn.METAPOD, Pkmn.CHIKORITA, Pkmn.PSYDUCK, Pkmn.KAKUNA, Pkmn.CLEFAIRY, Pkmn.TORCHIC, Pkmn.EEVEE, Pkmn.CYNDAQUIL, Pkmn.BELDUM, Pkmn.SCYTHER, Pkmn.SLAKOTH, Pkmn.TRAPINCH, Pkmn.CLEFABLE, Pkmn.HOUNDOUR, Pkmn.SPINARAK, Pkmn.GARDEVOIR, Pkmn.BELLOSSOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      LAPIS_CAVE: {
        id: 'LAPIS_CAVE',
        name: 'Lapis Cave',
        pokemons: [Pkmn.ZUBAT, Pkmn.NINCADA, Pkmn.NIDORINA, Pkmn.NIDORINO, Pkmn.TANGELA, Pkmn.BAGON, Pkmn.GOLBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      LIGHTNING_FIELD: {
        id: 'LIGHTNING_FIELD',
        name: 'Lightning Field',
        pokemons: [Pkmn.MAREEP, Pkmn.ELECTRIKE, Pkmn.MAGNEMITE, Pkmn.PIKACHU, Pkmn.FLAFFY, Pkmn.PLUSLE, Pkmn.MINUN, Pkmn.JOLTEON, Pkmn.CACTURNE, Pkmn.ELECTRODE, Pkmn.ELEKID, Pkmn.MAGNETON, Pkmn.AMPHAROS, Pkmn.MANECTRIC, Pkmn.RAICHU, Pkmn.RAIKOU],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MAGMA_CAVERN_08F_17F: {
        id: 'MAGMA_CAVERN_08F_17F',
        name: 'Magma Cavern',
        pokemons: [Pkmn.RATICATE, Pkmn.SANDSHREW, Pkmn.NIDOQUEEN, Pkmn.NIDOKING, Pkmn.GRAVELER, Pkmn.MAGMAR, Pkmn.MAWILE, Pkmn.ARBOK, Pkmn.MAGCARGO, Pkmn.SANDSLASH, Pkmn.GOLEM, Pkmn.GRIMER, Pkmn.ONIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FIRE
      },
      MAGMA_CAVERN_18F_23F: {
        id: 'MAGMA_CAVERN_18F_23F',
        name: 'Magma Cavern',
        pokemons: [Pkmn.GROUDON, Pkmn.RATICATE, Pkmn.SANDSHREW, Pkmn.NIDOQUEEN, Pkmn.NIDOKING, Pkmn.GRAVELER, Pkmn.MAGMAR, Pkmn.MAWILE, Pkmn.ARBOK, Pkmn.MAGCARGO, Pkmn.SANDSLASH, Pkmn.GOLEM, Pkmn.GRIMER, Pkmn.ONIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FIRE
      },
      METEOR_CAVE: {
        id: 'METEOR_CAVE',
        name: 'Meteor Cave',
        pokemons: [Pkmn.DEOXYS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      MT_BLAZE: {
        id: 'MT_BLAZE',
        name: 'Mt Blaze',
        pokemons: [Pkmn.PIDGEOT, Pkmn.MAGBY, Pkmn.NUMEL, Pkmn.SLUGMA, Pkmn.RAPIDASH, Pkmn.FEAROW, Pkmn.ARCANINE, Pkmn.MOLTRES],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FIRE
      },
      MT_STEEL_01F_05F: {
        id: 'MT_STEEL_01F_05F',
        name: 'Mt Steel',
        pokemons: [Pkmn.SPEAROW, Pkmn.BALTOY, Pkmn.ZIGZAGOON, Pkmn.ARON, Pkmn.GEODUDE, Pkmn.MEDITITE, Pkmn.BELDUM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.METAL
      },
      MT_STEEL_06F_08F: {
        id: 'MT_STEEL_06F_08F',
        name: 'Mt Steel',
        pokemons: [Pkmn.SPEAROW, Pkmn.BALTOY, Pkmn.ZIGZAGOON, Pkmn.ARON, Pkmn.GEODUDE, Pkmn.MEDITITE, Pkmn.BELDUM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.METAL
      },
      MT_FREEZE: {
        id: 'MT_FREEZE',
        name: 'Mt Freeze',
        pokemons: [Pkmn.SWABLU, Pkmn.SHELGON, Pkmn.PUPITAR, Pkmn.SEEL, Pkmn.VIGOROTH, Pkmn.SLAKING, Pkmn.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_THUNDER_PEAK: {
        id: 'MT_THUNDER_PEAK',
        name: 'Mt Thunder Peak',
        pokemons: [Pkmn.WEEDLE, Pkmn.NIDORANM, Pkmn.ELECTRIKE, Pkmn.CACNEA, Pkmn.PIDGEOTTO, Pkmn.BEEDRILL, Pkmn.ELECTABUZZ, Pkmn.STANTLER, Pkmn.AMPHAROS, Pkmn.MANECTRIC, Pkmn.GROWLITHE, Pkmn.ZAPDOS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MT_THUNDER: {
        id: 'MT_THUNDER',
        name: 'Mt Thunder',
        pokemons: [Pkmn.WEEDLE, Pkmn.NIDORANM, Pkmn.ELECTRIKE, Pkmn.CACNEA, Pkmn.PIDGEOTTO, Pkmn.BEEDRILL, Pkmn.ELECTABUZZ, Pkmn.STANTLER, Pkmn.AMPHAROS, Pkmn.MANECTRIC, Pkmn.GROWLITHE, Pkmn.ZAPDOS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MURKY_CAVE: {
        id: 'MURKY_CAVE',
        name: 'Murky Cave',
        pokemons: [Pkmn.ZUBAT, Pkmn.SEVIPER, Pkmn.GRIMER, Pkmn.GOLBAT, Pkmn.SHEDNINJA, Pkmn.SHUPPET, Pkmn.CROBAT, Pkmn.MISDREAVUS, Pkmn.MUK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      NORMAL_MAZE: {
        id: 'NORMAL_MAZE',
        name: 'Normal Maze',
        pokemons: [Pkmn.RATICATE, Pkmn.FARFETCH, Pkmn.FURRET],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.NORMAL
      },
      NORTHERN_RANGE_01F_07F: {
        id: 'NORTHERN_RANGE_01F_07F',
        name: 'Northern Range',
        pokemons: [Pkmn.HOOTHOOT, Pkmn.DODRIO, Pkmn.NINJASK, Pkmn.SPINARAK, Pkmn.SWELLOW, Pkmn.PIDGEOT, Pkmn.FEAROW, Pkmn.TOGETIC, Pkmn.LATIOS, Pkmn.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FLYING
      },
      NORTHERN_RANGE_08F_16F: {
        id: 'NORTHERN_RANGE_08F_16F',
        name: 'Northern Range',
        pokemons: [Pkmn.HOOTHOOT, Pkmn.DODRIO, Pkmn.NINJASK, Pkmn.SPINARAK, Pkmn.SWELLOW, Pkmn.PIDGEOT, Pkmn.FEAROW, Pkmn.TOGETIC, Pkmn.LATIOS, Pkmn.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FLYING
      },
      NORTHWIND_FIELD: {
        id: 'NORTHWIND_FIELD',
        name: 'Northwind Field',
        pokemons: [Pkmn.AZUMARILL, Pkmn.DELCATTY, Pkmn.VAPOREON, Pkmn.POLIWHIRL, Pkmn.MUK, Pkmn.POLITOED, Pkmn.ABSOL, Pkmn.CROCONAW, Pkmn.WARTORTLE, Pkmn.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      PITFALL_VALLEY: {
        id: 'PITFALL_VALLEY',
        name: 'Pitfall Valley',
        pokemons: [Pkmn.PIDGEOT, Pkmn.FARFETCH, Pkmn.SWELLOW, Pkmn.HOPPIP, Pkmn.BUTTERFREE, Pkmn.RATICATE, Pkmn.DODUO, Pkmn.SWABLU, Pkmn.YANMA, Pkmn.MASQUERAIN, Pkmn.SKIPLOOM, Pkmn.AERODACTYL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FLYING
      },
      POISON_MAZE: {
        id: 'POISON_MAZE',
        name: 'Poison Maze',
        pokemons: [Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.NIDORINO, Pkmn.NIDORINA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.POISON
      },
      PURITY_FOREST_04F_07F: {
        id: 'PURITY_FOREST_04F_07F',
        name: 'Purity Forest',
        pokemons: [Pkmn.CELEBI, Pkmn.DARKRAI, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_13F_20F: {
        id: 'PURITY_FOREST_13F_20F',
        name: 'Purity Forest',
        pokemons: [Pkmn.CELEBI, Pkmn.DARKRAI, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_30F_43F: {
        id: 'PURITY_FOREST_30F_43F',
        name: 'Purity Forest',
        pokemons: [Pkmn.CELEBI, Pkmn.DARKRAI, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_44F_60F: {
        id: 'PURITY_FOREST_44F_60F',
        name: 'Purity Forest',
        pokemons: [Pkmn.CELEBI, Pkmn.DARKRAI, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_61F_79F: {
        id: 'PURITY_FOREST_61F_79F',
        name: 'Purity Forest',
        pokemons: [Pkmn.CELEBI, Pkmn.DARKRAI, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_80F_99F: {
        id: 'PURITY_FOREST_80F_99F',
        name: 'Purity Forest',
        pokemons: [Pkmn.CELEBI, Pkmn.DARKRAI, Pkmn.BULBASAUR, Pkmn.IVYSAUR, Pkmn.VENUSAUR, Pkmn.METAPOD, Pkmn.RATTATA, Pkmn.RATICATE, Pkmn.SPEAROW, Pkmn.NIDORANF, Pkmn.NIDORANM, Pkmn.VILEPLUME, Pkmn.BELLSPROUT, Pkmn.WEEPINBELL, Pkmn.VICTREEBEL, Pkmn.EXEGGCUTE, Pkmn.KOFFING, Pkmn.SCYTHER, Pkmn.CHIKORITA, Pkmn.BAYLEEF, Pkmn.MEGANIUM, Pkmn.TREECKO, Pkmn.GROVYLE, Pkmn.SCEPTILE, Pkmn.SEEDOT, Pkmn.NUZLEAF, Pkmn.ROSELIA, Pkmn.FLYGON, Pkmn.MUNCHLAX, Pkmn.TURTWIG, Pkmn.GROTLE, Pkmn.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      RESCUE_TEAM_MAZE: {
        id: 'RESCUE_TEAM_MAZE',
        name: 'Rescue Team Maze',
        pokemons: [Pkmn.PIDGEY, Pkmn.RATTATA, Pkmn.VOLTORB, Pkmn.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      ROCK_PATH: {
        id: 'ROCK_PATH',
        name: 'Rock Path',
        pokemons: [Pkmn.PIDGEOT, Pkmn.NIDORINA, Pkmn.NIDORINO, Pkmn.ZUBAT, Pkmn.NUMEL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      SILENT_CHASM: {
        id: 'SILENT_CHASM',
        name: 'Silent Chasm',
        pokemons: [Pkmn.FARFETCH, Pkmn.WEEDLE, Pkmn.YANMA, Pkmn.GLOOM, Pkmn.HOUNDOUR, Pkmn.POLIWAG, Pkmn.SPINARAK, Pkmn.TRAPINCH, Pkmn.BEEDRILL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.BUG
      },
      SILVER_TRENCH: {
        id: 'SILVER_TRENCH',
        name: 'Silver Trench',
        pokemons: [Pkmn.LUGIA, Pkmn.DEWGONG, Pkmn.SHELLDER, Pkmn.CORSOLA, Pkmn.KABUTO, Pkmn.AZUMARILL, Pkmn.SLOWPOKE, Pkmn.YANMA, Pkmn.TENTACRUEL, Pkmn.VOLTORB, Pkmn.SPEAROW, Pkmn.SEEDOT, Pkmn.GOLBAT, Pkmn.HOOTHOOT, Pkmn.WYNAUT, Pkmn.HOUNDOUR, Pkmn.WAILMER, Pkmn.MAGNETON, Pkmn.BEEDRILL, Pkmn.VULPIX, Pkmn.FERALIGATR, Pkmn.SPINARAK, Pkmn.SLUGMA, Pkmn.CHANSEY, Pkmn.KRABBY, Pkmn.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      SINISTER_WOODS: {
        id: 'SINISTER_WOODS',
        name: 'Sinister Woods',
        pokemons: [Pkmn.SWINUB, Pkmn.ODDISH, Pkmn.SUDOWOODO, Pkmn.SENTRET, Pkmn.SHROOMISH, Pkmn.WOOPER, Pkmn.SCYTHER, Pkmn.HOOTHOOT, Pkmn.SLAKOTH, Pkmn.EKANS, Pkmn.GENGAR, Pkmn.MEDICHAM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.BUG
      },
      SKY_TOWER: {
        id: 'SKY_TOWER',
        name: 'Sky Tower',
        pokemons: [Pkmn.SHEDNINJA, Pkmn.SHUPPET, Pkmn.LUNATONE, Pkmn.RAYQUAZA, Pkmn.DUSKULL, Pkmn.KOFFING, Pkmn.ALTARIA, Pkmn.SOLROCK, Pkmn.SCIZOR, Pkmn.DUSCLOPS, Pkmn.FLYGON, Pkmn.TROPIUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FLYING
      },
      SNOW_PATH: {
        id: 'SNOW_PATH',
        name: 'Snow Path',
        pokemons: [Pkmn.AZURILL, Pkmn.FURRET, Pkmn.NOSEPASS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ICE
      },
      SOLAR_CAVE: {
        id: 'SOLAR_CAVE',
        name: 'Solar Cave',
        pokemons: [Pkmn.WYNAUT, Pkmn.GIRAFARIG, Pkmn.BELDUM, Pkmn.DROWZEE, Pkmn.SPOINK, Pkmn.ABRA, Pkmn.MEDITITE, Pkmn.LUNATONE, Pkmn.METANG, Pkmn.HYPNO, Pkmn.KIRLIA, Pkmn.KADABRA, Pkmn.MEDICHAM, Pkmn.GRUMPIG, Pkmn.CLAYDOL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      SOUTHERN_CAVERN_01F_23F: {
        id: 'SOUTHERN_CAVERN_01F_23F',
        name: 'Southern Cavern',
        pokemons: [Pkmn.GEODUDE, Pkmn.DIGLETT, Pkmn.SEEDOT, Pkmn.CUBONE, Pkmn.NIDOKING, Pkmn.PHANPY, Pkmn.VIBRAVA, Pkmn.BALTOY, Pkmn.LARVITAR, Pkmn.ARIADOS, Pkmn.DUGTRIO, Pkmn.MAROWAK, Pkmn.GRAVELER, Pkmn.RHYHORN, Pkmn.FLYGON, Pkmn.DONPHAN, Pkmn.PUPITAR, Pkmn.GOLEM, Pkmn.ONIX, Pkmn.RHYDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      SOUTHERN_CAVERN_24F_50F: {
        id: 'SOUTHERN_CAVERN_24F_50F',
        name: 'Southern Cavern',
        pokemons: [Pkmn.GEODUDE, Pkmn.DIGLETT, Pkmn.SEEDOT, Pkmn.CUBONE, Pkmn.NIDOKING, Pkmn.PHANPY, Pkmn.VIBRAVA, Pkmn.BALTOY, Pkmn.LARVITAR, Pkmn.ARIADOS, Pkmn.DUGTRIO, Pkmn.MAROWAK, Pkmn.GRAVELER, Pkmn.RHYHORN, Pkmn.FLYGON, Pkmn.DONPHAN, Pkmn.PUPITAR, Pkmn.GOLEM, Pkmn.ONIX, Pkmn.RHYDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      STORMY_SEA_01F_16F: {
        id: 'STORMY_SEA_01F_16F',
        name: 'Stormy Sea',
        pokemons: [Pkmn.WINGULL, Pkmn.TENTACRUEL, Pkmn.TENTACOOL, Pkmn.SHELLDER, Pkmn.OMANYTE, Pkmn.OMASTAR, Pkmn.SLOWPOKE, Pkmn.SPHEAL, Pkmn.OMASTAR, Pkmn.GRIMER, Pkmn.KABUTOPS, Pkmn.ARMALDO, Pkmn.SEADRA, Pkmn.STARMIE, Pkmn.SEALEO, Pkmn.KYOGRE, Pkmn.CARVANHA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      STORMY_SEA_16F_39F: {
        id: 'STORMY_SEA_16F_39F',
        name: 'Stormy Sea',
        pokemons: [Pkmn.WINGULL, Pkmn.TENTACRUEL, Pkmn.TENTACOOL, Pkmn.SHELLDER, Pkmn.OMANYTE, Pkmn.OMASTAR, Pkmn.SLOWPOKE, Pkmn.SPHEAL, Pkmn.OMASTAR, Pkmn.GRIMER, Pkmn.KABUTOPS, Pkmn.ARMALDO, Pkmn.SEADRA, Pkmn.STARMIE, Pkmn.SEALEO, Pkmn.KYOGRE, Pkmn.CARVANHA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      THUNDERWAVE_CAVE: {
        id: 'THUNDERWAVE_CAVE',
        name: 'Thunderwave Cave',
        pokemons: [Pkmn.RATTATA, Pkmn.NIDORANM, Pkmn.POOCHYENA, Pkmn.VOLTORB, Pkmn.ELEKID, Pkmn.PLUSLE, Pkmn.MINUN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      TINY_WOODS: {
        id: 'TINY_WOODS',
        name: 'Tiny Woods',
        pokemons: [Pkmn.RATTATA, Pkmn.RATTATA, Pkmn.SANDSHREW, Pkmn.SPINARAK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.NORMAL
      },
      UPROAR_FOREST: {
        id: 'UPROAR_FOREST',
        name: 'Uproar Forest',
        pokemons: [Pkmn.ROSELIA, Pkmn.NUZLEAF, Pkmn.LOTAD, Pkmn.RATICATE, Pkmn.GRIMER, Pkmn.NOCTOWL, Pkmn.KOFFING],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.GRASS
      },
      SERENITY_RIVER: {
        id: 'SERENITY_RIVER',
        name: 'Serenity River',
        pokemons: [Pkmn.POLIWAG, Pkmn.WOOPER, Pkmn.LOTAD, Pkmn.BARBOACH, Pkmn.MASQUERAIN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      WATERFALL_POND: {
        id: 'WATERFALL_POND',
        name: 'Waterfall Pond',
        pokemons: [Pkmn.MUDKIP, Pkmn.LOTAD, Pkmn.POLIWAG, Pkmn.BARBOACH, Pkmn.WOOPER, Pkmn.TOTODILE, Pkmn.SURSKIT, Pkmn.MAGIKARP, Pkmn.SQUIRTLE, Pkmn.LOMBRE, Pkmn.MARSHTOMP, Pkmn.WHISCASH, Pkmn.MASQUERAIN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      WESTERN_CAVE_B01F_B27F: {
        id: 'WESTERN_CAVE_B01F_B27F',
        name: 'Western Cave',
        pokemons: [Pkmn.MURKROW, Pkmn.BUTTERFREE, Pkmn.EKANS, Pkmn.MEOWTH, Pkmn.BELLOSSOM, Pkmn.EXPLOUD, Pkmn.IGGLYBUFF, Pkmn.TAUROS, Pkmn.MILTANK, Pkmn.ESPEON, Pkmn.IVYSAUR, Pkmn.ARBOK, Pkmn.AGGRON, Pkmn.PERSIAN, Pkmn.DODRIO, Pkmn.BAYLEEF, Pkmn.ALAKAZAM, Pkmn.TYRANITAR, Pkmn.SCEPTILE, Pkmn.ARCANINE, Pkmn.SWAMPERT, Pkmn.MACHAMP, Pkmn.STEELIX, Pkmn.CHARIZARD, Pkmn.BLASTOISE, Pkmn.MEWTWO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WESTERN_CAVE_B28F_B39F: {
        id: 'WESTERN_CAVE_B28F_B39F',
        name: 'Western Cave',
        pokemons: [Pkmn.MURKROW, Pkmn.BUTTERFREE, Pkmn.EKANS, Pkmn.MEOWTH, Pkmn.BELLOSSOM, Pkmn.EXPLOUD, Pkmn.IGGLYBUFF, Pkmn.TAUROS, Pkmn.MILTANK, Pkmn.ESPEON, Pkmn.IVYSAUR, Pkmn.ARBOK, Pkmn.AGGRON, Pkmn.PERSIAN, Pkmn.DODRIO, Pkmn.BAYLEEF, Pkmn.ALAKAZAM, Pkmn.TYRANITAR, Pkmn.SCEPTILE, Pkmn.ARCANINE, Pkmn.SWAMPERT, Pkmn.MACHAMP, Pkmn.STEELIX, Pkmn.CHARIZARD, Pkmn.BLASTOISE, Pkmn.MEWTWO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WISH_CAVE_01F_13F: {
        id: 'WISH_CAVE_01F_13F',
        name: 'Wish Cave',
        pokemons: [Pkmn.MURKROW, Pkmn.BUTTERFREE, Pkmn.EKANS, Pkmn.MEOWTH, Pkmn.BELLOSSOM, Pkmn.EXPLOUD, Pkmn.IGGLYBUFF, Pkmn.TAUROS, Pkmn.MILTANK, Pkmn.ESPEON, Pkmn.IVYSAUR, Pkmn.ARBOK, Pkmn.AGGRON, Pkmn.PERSIAN, Pkmn.DODRIO, Pkmn.BAYLEEF, Pkmn.ALAKAZAM, Pkmn.TYRANITAR, Pkmn.SCEPTILE, Pkmn.ARCANINE, Pkmn.SWAMPERT, Pkmn.MACHAMP, Pkmn.STEELIX, Pkmn.CHARIZARD, Pkmn.BLASTOISE, Pkmn.JIRACHI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WISH_CAVE_90F_99F: {
        id: 'WISH_CAVE_90F_99F',
        name: 'Wish Cave',
        pokemons: [Pkmn.MURKROW, Pkmn.BUTTERFREE, Pkmn.EKANS, Pkmn.MEOWTH, Pkmn.BELLOSSOM, Pkmn.EXPLOUD, Pkmn.IGGLYBUFF, Pkmn.TAUROS, Pkmn.MILTANK, Pkmn.ESPEON, Pkmn.IVYSAUR, Pkmn.ARBOK, Pkmn.AGGRON, Pkmn.PERSIAN, Pkmn.DODRIO, Pkmn.BAYLEEF, Pkmn.ALAKAZAM, Pkmn.TYRANITAR, Pkmn.SCEPTILE, Pkmn.ARCANINE, Pkmn.SWAMPERT, Pkmn.MACHAMP, Pkmn.STEELIX, Pkmn.CHARIZARD, Pkmn.BLASTOISE, Pkmn.JIRACHI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WYVERN_HILL: {
        id: 'WYVERN_HILL',
        name: 'Wyvern Hill',
        pokemons: [Pkmn.BAGON, Pkmn.DRATINI, Pkmn.ALTARIA, Pkmn.TOTODILE, Pkmn.LUDICOLO, Pkmn.SHELGON, Pkmn.VIBRAVA, Pkmn.DRAGONAIR, Pkmn.SALAMENCE, Pkmn.FLYGON, Pkmn.DRAGONITE],
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