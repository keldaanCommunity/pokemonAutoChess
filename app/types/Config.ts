import { Synergy } from "./enum/Synergy";
import { Pokemon } from "./enum/Pokemon";
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
      Pokemon.CLEFFA, Pokemon.CLEFAIRY, Pokemon.CLEFABLE,
      Pokemon.IGGLYBUFF, Pokemon.WIGGLYTUFF, Pokemon.JIGGLYPUFF,
      Pokemon.PIDGEY, Pokemon.PIDGEOTTO, Pokemon.PIDGEOT,
      Pokemon.STARLY, Pokemon.STARAVIA, Pokemon.STARAPTOR,
      Pokemon.TOGEPI, Pokemon.TOGETIC, Pokemon.TOGEKISS,
      Pokemon.SLAKOTH, Pokemon.VIGOROTH, Pokemon.SLAKING,
      Pokemon.REGIGIGAS, Pokemon.EEVEE, Pokemon.ARCEUS,
      Pokemon.BUNEARY, Pokemon.LOPUNNY, Pokemon.MEGALOPUNNY,
      Pokemon.PORYGON, Pokemon.PORYGON2, Pokemon.PORYGONZ,
      Pokemon.WHISMUR, Pokemon.LOUDRED, Pokemon.EXPLOUD,
      Pokemon.PIKIPEK, Pokemon.TRUMBEAK, Pokemon.TOUCANNON,
      Pokemon.MELOETTA, Pokemon.CASTFORM, Pokemon.CASTFORMSUN,
      Pokemon.CASTFORMRAIN, Pokemon.CASTFORMHAIL
    ],
    [Synergy.GRASS] : [
      Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR,
      Pokemon.CATERPIE, Pokemon.METAPOD, Pokemon.BUTTERFREE,
      Pokemon.HOPPIP, Pokemon.SKIPLOOM, Pokemon.JUMPLUFF,
      Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.SHIFTRY,
      Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM,
      Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE,
      Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA,
      Pokemon.LOTAD, Pokemon.LOMBRE, Pokemon.LUDICOLO,
      Pokemon.LEAFEON, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL,
      Pokemon.VICTREEBEL, Pokemon.SNOVER, Pokemon.ABOMASNOW,
      Pokemon.MEGAABOMASNOW, Pokemon.VIRIZION, Pokemon.CELEBI,
      Pokemon.SHAYMIN, Pokemon.ODDISH, Pokemon.GLOOM,
      Pokemon.VILEPLUME, Pokemon.BELLOSSOM, Pokemon.LILEEP,
      Pokemon.CRADILY, Pokemon.BUDEW, Pokemon.ROSELIA,
      Pokemon.ROSERADE, Pokemon.SEWADDLE, Pokemon.SWADLOON,
      Pokemon.LEAVANNY
    ],
    [Synergy.FIRE] : [
      Pokemon.CHARMANDER, Pokemon.CHARMELEON, Pokemon.CHARIZARD,
      Pokemon.CYNDAQUIL, Pokemon.QUILAVA, Pokemon.TYPHLOSION,
      Pokemon.TORCHIC, Pokemon.COMBUSKEN, Pokemon.BLAZIKEN,
      Pokemon.CHIMCHAR, Pokemon.MONFERNO, Pokemon.INFERNAPE,
      Pokemon.MAGBY, Pokemon.MAGMAR, Pokemon.MAGMORTAR,
      Pokemon.MOLTRES, Pokemon.ENTEI, Pokemon.GROUDON,
      Pokemon.FLAREON, Pokemon.NUMEL, Pokemon.CAMERUPT,
      Pokemon.MEGACAMERUPT, Pokemon.LITWICK, Pokemon.LAMPENT,
      Pokemon.CHANDELURE, Pokemon.VOLCARONA, Pokemon.RESHIRAM,
      Pokemon.VICTINI, Pokemon.HEATRAN, Pokemon.HOOH,
      Pokemon.PRIMALGROUDON, Pokemon.ALOLANMAROWAK, Pokemon.HOUNDOUR,
      Pokemon.CASTFORMSUN
    ],
    [Synergy.WATER] : [
      Pokemon.SQUIRTLE, Pokemon.WARTORTLE, Pokemon.BLASTOISE,
      Pokemon.AZURILL, Pokemon.MARILL, Pokemon.AZUMARILL,
      Pokemon.MUDKIP, Pokemon.MARSHTOMP, Pokemon.SWAMPERT,
      Pokemon.PIPLUP, Pokemon.PRINPLUP, Pokemon.EMPOLEON,
      Pokemon.HORSEA, Pokemon.SEADRA, Pokemon.KINGDRA,
      Pokemon.LOTAD, Pokemon.LOMBRE, Pokemon.LUDICOLO,
      Pokemon.POLIWAG, Pokemon.POLIWHIRL, Pokemon.POLITOED,
      Pokemon.GYARADOS, Pokemon.PALKIA, Pokemon.SUICUNE,
      Pokemon.KYOGRE, Pokemon.VAPOREON, Pokemon.CARVANHA,
      Pokemon.KELDEO, Pokemon.MANAPHY, Pokemon.LAPRAS,
      Pokemon.PRIMALKYOGRE, Pokemon.TIRTOUGA, Pokemon.CARRACOSTA,
      Pokemon.KABUTO, Pokemon.KABUTOPS, Pokemon.OMANYTE,
      Pokemon.OMASTAR, Pokemon.TYMPOLE, Pokemon.PALPITOAD,
      Pokemon.SEISMITOAD, Pokemon.CASTFORMRAIN
    ],
    [Synergy.ELECTRIC] : [
      Pokemon.MAREEP, Pokemon.FLAFFY,
      Pokemon.AMPHAROS, Pokemon.PICHU,
      Pokemon.PIKACHU, Pokemon.RAICHU,
      Pokemon.MAGNEMITE, Pokemon.MAGNETON,
      Pokemon.MAGNEZONE, Pokemon.SHINX,
      Pokemon.LUXIO, Pokemon.LUXRAY,
      Pokemon.ELEKID, Pokemon.ELECTABUZZ,
      Pokemon.ELECTIVIRE, Pokemon.ZAPDOS,
      Pokemon.RAIKOU, Pokemon.JOLTEON,
      Pokemon.THUNDURUS, Pokemon.ROTOM,
      Pokemon.ZEKROM, Pokemon.PRIMALKYOGRE,
      Pokemon.ELECTRIKE, Pokemon.MANECTRIC,
      Pokemon.MEGAMANECTRIC
    ],
    [Synergy.FIGHTING] : [
      Pokemon.TORCHIC, Pokemon.COMBUSKEN,
      Pokemon.BLAZIKEN, Pokemon.CHIMCHAR,
      Pokemon.MONFERNO, Pokemon.INFERNAPE,
      Pokemon.MACHOP, Pokemon.MACHOKE,
      Pokemon.MACHAMP, Pokemon.POLIWAG,
      Pokemon.POLIWHIRL, Pokemon.POLITOED,
      Pokemon.RIOLU, Pokemon.LUCARIO,
      Pokemon.MEGALUCARIO, Pokemon.MEDITITE,
      Pokemon.MEDICHAM, Pokemon.MEGAMEDICHAM,
      Pokemon.KELDEO, Pokemon.TERRAKION,
      Pokemon.VIRIZION, Pokemon.COBALION,
      Pokemon.BUNEARY, Pokemon.LOPUNNY,
      Pokemon.MEGALOPUNNY, Pokemon.JANGMOO,
      Pokemon.HAKAMOO, Pokemon.KOMMOO
    ],
    [Synergy.PSYCHIC] : [
      Pokemon.ABRA, Pokemon.KADABRA, Pokemon.ALAKAZAM,
      Pokemon.RALTS, Pokemon.KIRLIA, Pokemon.GARDEVOIR,
      Pokemon.BELDUM, Pokemon.METANG, Pokemon.METAGROSS,
      Pokemon.LUGIA, Pokemon.ESPEON, Pokemon.MEDITITE,
      Pokemon.MEDICHAM, Pokemon.MEGAMEDICHAM, Pokemon.SLOWPOKE,
      Pokemon.SLOWBRO, Pokemon.SLOWKING, Pokemon.LATIAS,
      Pokemon.LATIOS, Pokemon.MESPRIT, Pokemon.AZELF,
      Pokemon.UXIE, Pokemon.MEWTWO, Pokemon.CELEBI,
      Pokemon.VICTINI, Pokemon.JIRACHI, Pokemon.DEOXYS,
      Pokemon.CRESSELIA, Pokemon.SOLOSIS, Pokemon.DUOSION,
      Pokemon.REUNICLUS, Pokemon.PORYGON, Pokemon.PORYGON2,
      Pokemon.PORYGONZ
    ],
    [Synergy.DARK] : [
      Pokemon.SEEDOT, Pokemon.NUZLEAF,
      Pokemon.SHIFTRY, Pokemon.DUSKULL,
      Pokemon.DUSCLOPS, Pokemon.DUSKNOIR,
      Pokemon.LARVITAR, Pokemon.PUPITAR,
      Pokemon.TYRANITAR, Pokemon.UMBREON,
      Pokemon.DARKRAI, Pokemon.CARVANHA,
      Pokemon.SPIRITOMB, Pokemon.ABSOL,
      Pokemon.DEINO, Pokemon.ZWEILOUS,
      Pokemon.HYDREIGON, Pokemon.SANDILE,
      Pokemon.KROKOROK, Pokemon.KROOKODILE,
      Pokemon.SHUPPET, Pokemon.BANETTE,
      Pokemon.MEGABANETTE, Pokemon.HOUNDOUR
    ],
    [Synergy.METAL] : [
      Pokemon.PIPLUP, Pokemon.PRINPLUP, Pokemon.EMPOLEON,
      Pokemon.ARON, Pokemon.LAIRON, Pokemon.AGGRON,
      Pokemon.MAGNEMITE, Pokemon.MAGNETON, Pokemon.MAGNEZONE,
      Pokemon.BELDUM, Pokemon.METANG, Pokemon.METAGROSS,
      Pokemon.ONIX, Pokemon.STEELIX, Pokemon.MEGASTEELIX,
      Pokemon.SCIZOR, Pokemon.MEGASCIZOR, Pokemon.LUCARIO,
      Pokemon.MEGALUCARIO, Pokemon.DIALGA, Pokemon.REGISTEEL,
      Pokemon.COBALION, Pokemon.JIRACHI, Pokemon.HEATRAN,
      Pokemon.SHIELDON, Pokemon.BASTIODON, Pokemon.HONEDGE,
      Pokemon.DOUBLADE, Pokemon.AEGISLASH
    ],
    [Synergy.GROUND] : [
      Pokemon.GEODUDE, Pokemon.GRAVELER, Pokemon.GOLEM,
      Pokemon.MUDKIP, Pokemon.MARSHTOMP, Pokemon.SWAMPERT,
      Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA,
      Pokemon.TRAPINCH, Pokemon.VIBRAVA, Pokemon.FLYGON,
      Pokemon.RHYHORN, Pokemon.RHYDON, Pokemon.RHYPERIOR,
      Pokemon.GIBLE, Pokemon.GABITE, Pokemon.GARCHOMP,
      Pokemon.ONIX, Pokemon.STEELIX, Pokemon.MEGASTEELIX,
      Pokemon.GROUDON, Pokemon.NUMEL, Pokemon.CAMERUPT,
      Pokemon.MEGACAMERUPT, Pokemon.SWINUB, Pokemon.PILOSWINE,
      Pokemon.MAMOSWINE, Pokemon.LANDORUS, Pokemon.PRIMALGROUDON,
      Pokemon.SANDILE, Pokemon.KROKOROK, Pokemon.KROOKODILE,
      Pokemon.CUBONE, Pokemon.MAROWAK, Pokemon.ALOLANMAROWAK,
      Pokemon.TYMPOLE, Pokemon.PALPITOAD, Pokemon.SEISMITOAD
    ],
    [Synergy.POISON] : [
      Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR,
      Pokemon.ZUBAT, Pokemon.GOLBAT, Pokemon.CROBAT,
      Pokemon.WEEDLE, Pokemon.KAKUNA, Pokemon.BEEDRILL,
      Pokemon.NIDORANF, Pokemon.NIDORINA, Pokemon.NIDOQUEEN,
      Pokemon.NIDORANM, Pokemon.NIDORINO, Pokemon.NIDOKING,
      Pokemon.GASTLY, Pokemon.HAUNTER, Pokemon.GENGAR,
      Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL,
      Pokemon.ODDISH, Pokemon.GLOOM, Pokemon.VILEPLUME,
      Pokemon.BELLOSSOM, Pokemon.BUDEW, Pokemon.ROSELIA,
      Pokemon.ROSERADE, Pokemon.VENIPEDE, Pokemon.WHIRLIPEDE,
      Pokemon.SCOLIPEDE
    ],
    [Synergy.DRAGON] : [
      Pokemon.CHARMANDER, Pokemon.CHARMELEON, Pokemon.CHARIZARD,
      Pokemon.HORSEA, Pokemon.SEADRA, Pokemon.KINGDRA,
      Pokemon.VIBRAVA, Pokemon.FLYGON, Pokemon.DRATINI,
      Pokemon.DRAGONAIR, Pokemon.DRAGONITE, Pokemon.BAGON,
      Pokemon.SHELGON, Pokemon.SALAMENCE, Pokemon.GIBLE,
      Pokemon.GABITE, Pokemon.GARCHOMP, Pokemon.GIRATINA,
      Pokemon.DIALGA, Pokemon.PALKIA, Pokemon.RAYQUAZA,
      Pokemon.LATIAS, Pokemon.LATIOS, Pokemon.KYUREM,
      Pokemon.RESHIRAM, Pokemon.ZEKROM, Pokemon.DEINO,
      Pokemon.ZWEILOUS, Pokemon.HYDREIGON, Pokemon.MEGARAYQUAZA,
      Pokemon.SWABLU, Pokemon.TYRUNT, Pokemon.TYRANTRUM,
      Pokemon.AXEW, Pokemon.FRAXURE, Pokemon.HAXORUS,
      Pokemon.JANGMOO, Pokemon.HAKAMOO, Pokemon.KOMMOO,
      Pokemon.ALTARIA, Pokemon.MEGAALTARIA
    ],
    [Synergy.FIELD] : [
      Pokemon.SQUIRTLE, Pokemon.WARTORTLE, Pokemon.BLASTOISE,
      Pokemon.MAREEP, Pokemon.FLAFFY, Pokemon.AMPHAROS,
      Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.SHIFTRY,
      Pokemon.CYNDAQUIL, Pokemon.QUILAVA, Pokemon.TYPHLOSION,
      Pokemon.NIDORANF, Pokemon.NIDORINA, Pokemon.NIDOQUEEN,
      Pokemon.NIDORANM, Pokemon.NIDORINO, Pokemon.NIDOKING,
      Pokemon.SHINX, Pokemon.LUXIO, Pokemon.LUXRAY,
      Pokemon.SLAKOTH, Pokemon.VIGOROTH, Pokemon.SLAKING,
      Pokemon.RAIKOU, Pokemon.ENTEI, Pokemon.EEVEE,
      Pokemon.VAPOREON, Pokemon.JOLTEON, Pokemon.FLAREON,
      Pokemon.ESPEON, Pokemon.UMBREON, Pokemon.LEAFEON,
      Pokemon.SYLVEON, Pokemon.NUMEL, Pokemon.CAMERUPT,
      Pokemon.MEGACAMERUPT, Pokemon.SWINUB, Pokemon.PILOSWINE,
      Pokemon.MAMOSWINE, Pokemon.GLACEON, Pokemon.ABSOL,
      Pokemon.ARCEUS, Pokemon.SANDILE, Pokemon.KROKOROK,
      Pokemon.KROOKODILE, Pokemon.ELECTRIKE, Pokemon.MANECTRIC,
      Pokemon.MEGAMANECTRIC
    ],
    [Synergy.MONSTER] : [
      Pokemon.TOTODILE, Pokemon.CROCONAW, Pokemon.FERALIGATR,
      Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE,
      Pokemon.ARON, Pokemon.LAIRON, Pokemon.AGGRON,
      Pokemon.RHYHORN, Pokemon.RHYDON, Pokemon.RHYPERIOR,
      Pokemon.GASTLY, Pokemon.HAUNTER, Pokemon.GENGAR,
      Pokemon.LARVITAR, Pokemon.PUPITAR, Pokemon.TYRANITAR,
      Pokemon.BAGON, Pokemon.SHELGON, Pokemon.SALAMENCE,
      Pokemon.GIBLE, Pokemon.GABITE, Pokemon.GARCHOMP,
      Pokemon.REGIGIGAS, Pokemon.DARKRAI, Pokemon.MEWTWO,
      Pokemon.CRANIDOS, Pokemon.RAMPARDOS, Pokemon.AXEW,
      Pokemon.FRAXURE, Pokemon.HAXORUS
    ],
    [Synergy.HUMAN] : [
      Pokemon.MACHOP, Pokemon.MACHOKE,
      Pokemon.MACHAMP, Pokemon.ABRA,
      Pokemon.KADABRA, Pokemon.ALAKAZAM,
      Pokemon.RALTS, Pokemon.KIRLIA,
      Pokemon.GARDEVOIR, Pokemon.ELEKID,
      Pokemon.ELECTABUZZ, Pokemon.ELECTIVIRE,
      Pokemon.MAGBY, Pokemon.MAGMAR,
      Pokemon.MAGMORTAR, Pokemon.RIOLU,
      Pokemon.LUCARIO, Pokemon.MEGALUCARIO,
      Pokemon.REGICE, Pokemon.REGIROCK,
      Pokemon.REGISTEEL, Pokemon.REGIGIGAS,
      Pokemon.MEDITITE, Pokemon.MEDICHAM,
      Pokemon.MEGAMEDICHAM, Pokemon.DEOXYS
    ],
    [Synergy.AQUATIC] : [
      Pokemon.TOTODILE, Pokemon.CROCONAW,
      Pokemon.FERALIGATR, Pokemon.SPHEAL,
      Pokemon.SEALEO, Pokemon.WALREIN,
      Pokemon.DRATINI, Pokemon.DRAGONAIR,
      Pokemon.DRAGONITE, Pokemon.LUGIA,
      Pokemon.KYOGRE, Pokemon.SLOWPOKE,
      Pokemon.SLOWBRO, Pokemon.SLOWKING,
      Pokemon.PRIMALKYOGRE
    ],
    [Synergy.BUG] : [
      Pokemon.CATERPIE, Pokemon.METAPOD,
      Pokemon.BUTTERFREE, Pokemon.WEEDLE,
      Pokemon.KAKUNA, Pokemon.BEEDRILL,
      Pokemon.TRAPINCH, Pokemon.VIBRAVA,
      Pokemon.FLYGON, Pokemon.SCYTHER,
      Pokemon.SCIZOR, Pokemon.MEGASCIZOR,
      Pokemon.VOLCARONA, Pokemon.MANAPHY,
      Pokemon.ANORITH, Pokemon.ARMALDO,
      Pokemon.VENIPEDE, Pokemon.WHIRLIPEDE,
      Pokemon.SCOLIPEDE, Pokemon.SEWADDLE,
      Pokemon.SWADLOON, Pokemon.LEAVANNY
    ],
    [Synergy.FLYING] : [
      Pokemon.ZUBAT, Pokemon.GOLBAT, Pokemon.CROBAT,
      Pokemon.BUTTERFREE, Pokemon.BEEDRILL, Pokemon.PIDGEY,
      Pokemon.PIDGEOTTO, Pokemon.PIDGEOT, Pokemon.HOPPIP,
      Pokemon.SKIPLOOM, Pokemon.JUMPLUFF, Pokemon.STARLY,
      Pokemon.STARAVIA, Pokemon.STARAPTOR, Pokemon.TORCHIC,
      Pokemon.COMBUSKEN, Pokemon.BLAZIKEN, Pokemon.PIPLUP,
      Pokemon.PRINPLUP, Pokemon.EMPOLEON, Pokemon.TOGETIC,
      Pokemon.TOGEKISS, Pokemon.DRAGONITE, Pokemon.SALAMENCE,
      Pokemon.SCYTHER, Pokemon.SCIZOR, Pokemon.MEGASCIZOR,
      Pokemon.LUGIA, Pokemon.ZAPDOS, Pokemon.MOLTRES,
      Pokemon.ARTICUNO, Pokemon.RAYQUAZA, Pokemon.LANDORUS,
      Pokemon.THUNDURUS, Pokemon.TORNADUS, Pokemon.HOOH,
      Pokemon.AERODACTYL, Pokemon.MEGARAYQUAZA, Pokemon.ARCHEN,
      Pokemon.ARCHEOPS, Pokemon.PIKIPEK, Pokemon.TRUMBEAK,
      Pokemon.TOUCANNON
    ],
    [Synergy.FLORA] : [
      Pokemon.BULBASAUR, Pokemon.IVYSAUR,
      Pokemon.VENUSAUR, Pokemon.HOPPIP,
      Pokemon.SKIPLOOM, Pokemon.JUMPLUFF,
      Pokemon.CHIKORITA, Pokemon.BAYLEEF,
      Pokemon.MEGANIUM, Pokemon.TURTWIG,
      Pokemon.GROTLE, Pokemon.TORTERRA,
      Pokemon.LEAFEON, Pokemon.BELLSPROUT,
      Pokemon.WEEPINBELL, Pokemon.VICTREEBEL,
      Pokemon.SHAYMIN, Pokemon.BUDEW,
      Pokemon.ROSELIA, Pokemon.ROSERADE,
      Pokemon.FLABEBE, Pokemon.FLOETTE,
      Pokemon.FLORGES
    ],
    [Synergy.MINERAL] : [
      Pokemon.GEODUDE, Pokemon.GRAVELER,
      Pokemon.GOLEM, Pokemon.ARON,
      Pokemon.LAIRON, Pokemon.AGGRON,
      Pokemon.RHYHORN, Pokemon.RHYDON,
      Pokemon.RHYPERIOR, Pokemon.LARVITAR,
      Pokemon.PUPITAR, Pokemon.TYRANITAR,
      Pokemon.BELDUM, Pokemon.METANG,
      Pokemon.METAGROSS, Pokemon.ONIX,
      Pokemon.STEELIX, Pokemon.MEGASTEELIX,
      Pokemon.REGIROCK, Pokemon.TERRAKION,
      Pokemon.CUBONE, Pokemon.MAROWAK,
      Pokemon.ALOLANMAROWAK
    ],
    [Synergy.GHOST] : [
      Pokemon.DUSKULL, Pokemon.DUSCLOPS,
      Pokemon.DUSKNOIR, Pokemon.GASTLY,
      Pokemon.HAUNTER, Pokemon.GENGAR,
      Pokemon.GIRATINA, Pokemon.DARKRAI,
      Pokemon.LITWICK, Pokemon.LAMPENT,
      Pokemon.CHANDELURE, Pokemon.SNORUNT,
      Pokemon.GLALIE, Pokemon.FROSLASS,
      Pokemon.ROTOM, Pokemon.SPIRITOMB,
      Pokemon.SOLOSIS, Pokemon.DUOSION,
      Pokemon.REUNICLUS, Pokemon.SHUPPET,
      Pokemon.BANETTE, Pokemon.MEGABANETTE,
      Pokemon.HONEDGE, Pokemon.DOUBLADE,
      Pokemon.AEGISLASH, Pokemon.ALOLANMAROWAK,
      Pokemon.CASTFORM, Pokemon.CASTFORMSUN,
      Pokemon.CASTFORMRAIN, Pokemon.CASTFORMHAIL
    ],
    [Synergy.FAIRY] : [
      Pokemon.AZURILL, Pokemon.MARILL, Pokemon.AZUMARILL,
      Pokemon.CLEFFA, Pokemon.CLEFAIRY, Pokemon.CLEFABLE,
      Pokemon.IGGLYBUFF, Pokemon.WIGGLYTUFF, Pokemon.JIGGLYPUFF,
      Pokemon.PICHU, Pokemon.PIKACHU, Pokemon.RAICHU,
      Pokemon.TOGEPI, Pokemon.TOGETIC, Pokemon.TOGEKISS,
      Pokemon.RALTS, Pokemon.KIRLIA, Pokemon.GARDEVOIR,
      Pokemon.SYLVEON, Pokemon.VANILLITE, Pokemon.VANILLISH,
      Pokemon.VANILLUXE, Pokemon.MESPRIT, Pokemon.AZELF,
      Pokemon.UXIE, Pokemon.CRESSELIA, Pokemon.SWABLU,
      Pokemon.FLABEBE, Pokemon.FLOETTE, Pokemon.FLORGES,
      Pokemon.ALTARIA, Pokemon.MEGAALTARIA
    ],
    [Synergy.ICE] : [
      Pokemon.SPHEAL, Pokemon.SEALEO,
      Pokemon.WALREIN, Pokemon.ARTICUNO,
      Pokemon.SUICUNE, Pokemon.REGICE,
      Pokemon.SWINUB, Pokemon.PILOSWINE,
      Pokemon.MAMOSWINE, Pokemon.SNORUNT,
      Pokemon.GLALIE, Pokemon.FROSLASS,
      Pokemon.SNOVER, Pokemon.ABOMASNOW,
      Pokemon.MEGAABOMASNOW, Pokemon.VANILLITE,
      Pokemon.VANILLISH, Pokemon.VANILLUXE,
      Pokemon.GLACEON, Pokemon.LAPRAS,
      Pokemon.KYUREM, Pokemon.AMAURA,
      Pokemon.AURORUS, Pokemon.CASTFORMHAIL
    ],
    [Synergy.FOSSIL] : [
      Pokemon.AERODACTYL, Pokemon.AMAURA,
      Pokemon.AURORUS, Pokemon.ANORITH,
      Pokemon.ARMALDO, Pokemon.ARCHEN,
      Pokemon.ARCHEOPS, Pokemon.SHIELDON,
      Pokemon.BASTIODON, Pokemon.TIRTOUGA,
      Pokemon.CARRACOSTA, Pokemon.LILEEP,
      Pokemon.CRADILY, Pokemon.CRANIDOS,
      Pokemon.RAMPARDOS, Pokemon.KABUTO,
      Pokemon.KABUTOPS, Pokemon.OMANYTE,
      Pokemon.OMASTAR, Pokemon.TYRUNT,
      Pokemon.TYRANTRUM
    ],
    [Synergy.SOUND] : [
      Pokemon.ZUBAT, Pokemon.GOLBAT, Pokemon.CROBAT,
      Pokemon.IGGLYBUFF, Pokemon.WIGGLYTUFF, Pokemon.JIGGLYPUFF,
      Pokemon.SWABLU, Pokemon.WHISMUR, Pokemon.LOUDRED,
      Pokemon.EXPLOUD, Pokemon.TYMPOLE, Pokemon.PALPITOAD,
      Pokemon.SEISMITOAD, Pokemon.SEWADDLE, Pokemon.SWADLOON,
      Pokemon.LEAVANNY, Pokemon.PIKIPEK, Pokemon.TRUMBEAK,
      Pokemon.TOUCANNON, Pokemon.FLABEBE, Pokemon.FLOETTE,
      Pokemon.FLORGES, Pokemon.JANGMOO, Pokemon.HAKAMOO,
      Pokemon.KOMMOO, Pokemon.MELOETTA, Pokemon.ALTARIA,
      Pokemon.MEGAALTARIA
    ]
  };
  
  export const PRECOMPUTED_RARITY_POKEMONS_ALL = {
    [Rarity.COMMON] : [
      Pokemon.CHARMANDER, Pokemon.CHARMELEON, Pokemon.CHARIZARD,
      Pokemon.GEODUDE, Pokemon.GRAVELER, Pokemon.GOLEM,
      Pokemon.AZURILL, Pokemon.MARILL, Pokemon.AZUMARILL,
      Pokemon.ZUBAT, Pokemon.GOLBAT, Pokemon.CROBAT,
      Pokemon.MAREEP, Pokemon.FLAFFY, Pokemon.AMPHAROS,
      Pokemon.CLEFFA, Pokemon.CLEFAIRY, Pokemon.CLEFABLE,
      Pokemon.CATERPIE, Pokemon.METAPOD, Pokemon.BUTTERFREE,
      Pokemon.WEEDLE, Pokemon.KAKUNA, Pokemon.BEEDRILL,
      Pokemon.PIDGEY, Pokemon.PIDGEOTTO, Pokemon.PIDGEOT,
      Pokemon.HOPPIP, Pokemon.SKIPLOOM, Pokemon.JUMPLUFF,
      Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.SHIFTRY,
      Pokemon.STARLY, Pokemon.STARAVIA, Pokemon.STARAPTOR,
      Pokemon.TOTODILE, Pokemon.CROCONAW, Pokemon.FERALIGATR,
      Pokemon.SWINUB, Pokemon.PILOSWINE, Pokemon.MAMOSWINE
    ],
    [Rarity.UNCOMMON] : [
      Pokemon.SQUIRTLE, Pokemon.WARTORTLE, Pokemon.BLASTOISE, Pokemon.IGGLYBUFF, Pokemon.WIGGLYTUFF,
      Pokemon.JIGGLYPUFF, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.CYNDAQUIL,
      Pokemon.QUILAVA, Pokemon.TYPHLOSION, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE,
      Pokemon.TORCHIC, Pokemon.COMBUSKEN, Pokemon.BLAZIKEN, Pokemon.MUDKIP, Pokemon.MARSHTOMP,
      Pokemon.SWAMPERT, Pokemon.CHIMCHAR, Pokemon.MONFERNO, Pokemon.INFERNAPE, Pokemon.PIPLUP,
      Pokemon.PRINPLUP, Pokemon.EMPOLEON, Pokemon.MACHOP, Pokemon.MACHOKE, Pokemon.MACHAMP,
      Pokemon.HORSEA, Pokemon.SEADRA, Pokemon.KINGDRA, Pokemon.SPHEAL, Pokemon.SEALEO,
      Pokemon.WALREIN, Pokemon.MAGNEMITE, Pokemon.MAGNETON, Pokemon.MAGNEZONE, Pokemon.DUSKULL,
      Pokemon.DUSCLOPS, Pokemon.DUSKNOIR, Pokemon.EEVEE, Pokemon.VAPOREON, Pokemon.JOLTEON,
      Pokemon.FLAREON, Pokemon.ESPEON, Pokemon.UMBREON, Pokemon.LEAFEON, Pokemon.SYLVEON,
      Pokemon.SLOWPOKE, Pokemon.SLOWBRO, Pokemon.SLOWKING, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL,
      Pokemon.VICTREEBEL, Pokemon.GLACEON, Pokemon.SANDILE, Pokemon.KROKOROK, Pokemon.KROOKODILE,
      Pokemon.ANORITH, Pokemon.ARMALDO, Pokemon.LILEEP, Pokemon.CRADILY, Pokemon.KABUTO,
      Pokemon.KABUTOPS, Pokemon.OMANYTE, Pokemon.OMASTAR, Pokemon.VENIPEDE, Pokemon.WHIRLIPEDE,
      Pokemon.SCOLIPEDE, Pokemon.PIKIPEK, Pokemon.TRUMBEAK, Pokemon.TOUCANNON, Pokemon.FLABEBE,
      Pokemon.FLOETTE, Pokemon.FLORGES
    ],
    [Rarity.RARE] : [
      Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.TURTWIG,
      Pokemon.GROTLE, Pokemon.TORTERRA, Pokemon.NIDORANF, Pokemon.NIDORINA,
      Pokemon.NIDOQUEEN, Pokemon.NIDORANM, Pokemon.NIDORINO, Pokemon.NIDOKING,
      Pokemon.PICHU, Pokemon.PIKACHU, Pokemon.RAICHU, Pokemon.TRAPINCH,
      Pokemon.VIBRAVA, Pokemon.FLYGON, Pokemon.ARON, Pokemon.LAIRON,
      Pokemon.AGGRON, Pokemon.RHYHORN, Pokemon.RHYDON, Pokemon.RHYPERIOR,
      Pokemon.TOGEPI, Pokemon.TOGETIC, Pokemon.TOGEKISS, Pokemon.LOTAD,
      Pokemon.LOMBRE, Pokemon.LUDICOLO, Pokemon.SHINX, Pokemon.LUXIO,
      Pokemon.LUXRAY, Pokemon.POLIWAG, Pokemon.POLIWHIRL, Pokemon.POLITOED,
      Pokemon.DRATINI, Pokemon.DRAGONAIR, Pokemon.DRAGONITE, Pokemon.MAGBY,
      Pokemon.MAGMAR, Pokemon.MAGMORTAR, Pokemon.VANILLITE, Pokemon.VANILLISH,
      Pokemon.VANILLUXE, Pokemon.DEINO, Pokemon.ZWEILOUS, Pokemon.HYDREIGON,
      Pokemon.SOLOSIS, Pokemon.DUOSION, Pokemon.REUNICLUS, Pokemon.ARCHEN,
      Pokemon.ARCHEOPS, Pokemon.SHIELDON, Pokemon.BASTIODON, Pokemon.TIRTOUGA,
      Pokemon.CARRACOSTA, Pokemon.CRANIDOS, Pokemon.RAMPARDOS, Pokemon.AXEW,
      Pokemon.FRAXURE, Pokemon.HAXORUS, Pokemon.WHISMUR, Pokemon.LOUDRED,
      Pokemon.EXPLOUD
    ],
    [Rarity.EPIC] : [
      Pokemon.ABRA, Pokemon.KADABRA, Pokemon.ALAKAZAM,
      Pokemon.LARVITAR, Pokemon.PUPITAR, Pokemon.TYRANITAR,
      Pokemon.SLAKOTH, Pokemon.VIGOROTH, Pokemon.SLAKING,
      Pokemon.RALTS, Pokemon.KIRLIA, Pokemon.GARDEVOIR,
      Pokemon.BAGON, Pokemon.SHELGON, Pokemon.SALAMENCE,
      Pokemon.BELDUM, Pokemon.METANG, Pokemon.METAGROSS,
      Pokemon.GIBLE, Pokemon.GABITE, Pokemon.GARCHOMP,
      Pokemon.ELEKID, Pokemon.ELECTABUZZ, Pokemon.ELECTIVIRE,
      Pokemon.LITWICK, Pokemon.LAMPENT, Pokemon.CHANDELURE,
      Pokemon.SNORUNT, Pokemon.GLALIE, Pokemon.FROSLASS,
      Pokemon.AERODACTYL, Pokemon.AMAURA, Pokemon.AURORUS,
      Pokemon.TYRUNT, Pokemon.TYRANTRUM, Pokemon.BUDEW,
      Pokemon.ROSELIA, Pokemon.ROSERADE, Pokemon.PORYGON,
      Pokemon.PORYGON2, Pokemon.PORYGONZ, Pokemon.HONEDGE,
      Pokemon.DOUBLADE, Pokemon.AEGISLASH, Pokemon.CUBONE,
      Pokemon.MAROWAK, Pokemon.ALOLANMAROWAK, Pokemon.TYMPOLE,
      Pokemon.PALPITOAD, Pokemon.SEISMITOAD, Pokemon.SEWADDLE,
      Pokemon.SWADLOON, Pokemon.LEAVANNY, Pokemon.JANGMOO,
      Pokemon.HAKAMOO, Pokemon.KOMMOO
    ],
    [Rarity.LEGENDARY] : [
      Pokemon.GASTLY, Pokemon.HAUNTER, Pokemon.GENGAR,
      Pokemon.ONIX, Pokemon.STEELIX, Pokemon.MEGASTEELIX,
      Pokemon.SCYTHER, Pokemon.SCIZOR, Pokemon.MEGASCIZOR,
      Pokemon.RIOLU, Pokemon.LUCARIO, Pokemon.MEGALUCARIO,
      Pokemon.MEDITITE, Pokemon.MEDICHAM, Pokemon.MEGAMEDICHAM,
      Pokemon.NUMEL, Pokemon.CAMERUPT, Pokemon.MEGACAMERUPT,
      Pokemon.SNOVER, Pokemon.ABOMASNOW, Pokemon.MEGAABOMASNOW,
      Pokemon.SWABLU, Pokemon.BUNEARY, Pokemon.LOPUNNY,
      Pokemon.MEGALOPUNNY, Pokemon.ELECTRIKE, Pokemon.MANECTRIC,
      Pokemon.MEGAMANECTRIC, Pokemon.SHUPPET, Pokemon.BANETTE,
      Pokemon.MEGABANETTE, Pokemon.ALTARIA, Pokemon.MEGAALTARIA
    ],
    [Rarity.MYTHICAL] : [
      Pokemon.LUGIA, Pokemon.GIRATINA, Pokemon.ZAPDOS,
      Pokemon.MOLTRES, Pokemon.ARTICUNO, Pokemon.DIALGA,
      Pokemon.PALKIA, Pokemon.SUICUNE, Pokemon.RAIKOU,
      Pokemon.ENTEI, Pokemon.REGICE, Pokemon.REGIROCK,
      Pokemon.REGISTEEL, Pokemon.KYOGRE, Pokemon.GROUDON,
      Pokemon.RAYQUAZA, Pokemon.REGIGIGAS, Pokemon.DARKRAI,
      Pokemon.VOLCARONA, Pokemon.LANDORUS, Pokemon.THUNDURUS,
      Pokemon.TORNADUS, Pokemon.KELDEO, Pokemon.TERRAKION,
      Pokemon.VIRIZION, Pokemon.COBALION, Pokemon.MANAPHY,
      Pokemon.ROTOM, Pokemon.SPIRITOMB, Pokemon.ABSOL,
      Pokemon.LAPRAS, Pokemon.LATIAS, Pokemon.LATIOS,
      Pokemon.MESPRIT, Pokemon.AZELF, Pokemon.UXIE,
      Pokemon.MEWTWO, Pokemon.KYUREM, Pokemon.RESHIRAM,
      Pokemon.ZEKROM, Pokemon.CELEBI, Pokemon.VICTINI,
      Pokemon.JIRACHI, Pokemon.ARCEUS, Pokemon.DEOXYS,
      Pokemon.SHAYMIN, Pokemon.CRESSELIA, Pokemon.HEATRAN,
      Pokemon.HOOH, Pokemon.PRIMALKYOGRE, Pokemon.PRIMALGROUDON,
      Pokemon.MEGARAYQUAZA, Pokemon.MELOETTA, Pokemon.CASTFORM,
      Pokemon.CASTFORMSUN, Pokemon.CASTFORMRAIN, Pokemon.CASTFORMHAIL
    ],
    [Rarity.NEUTRAL] : [Pokemon.GYARADOS],
    [Rarity.SUMMON] : [
      Pokemon.CARVANHA,
      Pokemon.ODDISH,
      Pokemon.GLOOM,
      Pokemon.VILEPLUME,
      Pokemon.BELLOSSOM,
      Pokemon.HOUNDOUR
    ]
  };


  export const NEUTRAL_STAGE = [
    {
      turn: 1,
      avatar: Pokemon.MAGIKARP
    },
    {
      turn: 2,
      avatar: Pokemon.RATICATE
    },
    {
      turn: 3,
      avatar: Pokemon.FEAROW
    },
    {
      turn: 10,
      avatar: Pokemon.GYARADOS
    },
    {
      turn: 15,
      avatar: Pokemon.LUGIA
    },
    {
      turn: 20,
      avatar: Pokemon.GIRATINA
    },
    {
      turn: 25,
      avatar: Pokemon.ZAPDOS
    },
    {
      turn: 30,
      avatar: Pokemon.DIALGA
    },
    {
      turn: 35,
      avatar: Pokemon.SUICUNE
    },
    {
      turn: 40,
      avatar: Pokemon.REGICE
    },
    {
      turn: 45,
      avatar: Pokemon.RAYQUAZA
    },
    {
      turn: 50,
      avatar: Pokemon.RAYQUAZA
    },
    {
      turn: 55,
      avatar: Pokemon.RAYQUAZA
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
        pokemons: [Pokemon.IVYSAUR, Pokemon.METAPOD, Pokemon.RATICATE, Pokemon.WEEPINBELL, Pokemon.BAYLEEF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.TORTERRA, Pokemon.SKUNTANK, Pokemon.URSARING, Pokemon.BIBAREL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      SEVEN_STATION_PATH: {
        id: 'SEVEN_STATION_PATH',
        name: '7th Station Path',
        pokemons: [Pokemon.SKUNTANK, Pokemon.FEAROW, Pokemon.PRIMEAPE, Pokemon.MAROWAK, Pokemon.HITMONCHAN, Pokemon.FURRET, Pokemon.URSARING, Pokemon.SHEDNINJA, Pokemon.BIBAREL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FIGHTING
      },
      BARREN_VALLEY: {
        id: 'BARREN_VALLEY',
        name: 'Barren Valley',
        pokemons: [Pokemon.JUMPLUFF, Pokemon.FLYGON, Pokemon.LUNATONE, Pokemon.HONCHKROW, Pokemon.GLAMEOW, Pokemon.TOXICROAK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.DARK
      },
      DARK_ICE_MOUNTAIN_PEAK: {
        id: 'DARK_ICE_MOUNTAIN_PEAK',
        name: 'Dark Ice Mountain Peak',
        pokemons: [Pokemon.GENGAR, Pokemon.SKARMORY, Pokemon.DUSKULL, Pokemon.METANG, Pokemon.LICKILICKY, Pokemon.TANGROWTH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_ICE_MOUNTAIN: {
        id: 'DARK_ICE_MOUNTAIN',
        name: 'Dark Ice Mountain',
        pokemons: [Pokemon.BANETTE, Pokemon.GENGAR, Pokemon.SKARMORY, Pokemon.DUSKULL, Pokemon.METANG, Pokemon.LICKILICKY, Pokemon.TANGROWTH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_WASTELAND: {
        id: 'DARK_WASTELAND',
        name: 'Dark Wasteland',
        pokemons: [Pokemon.GASTLY, Pokemon.ONIX, Pokemon.MISDREAVUS, Pokemon.SHIFTRY, Pokemon.SOLROCK, Pokemon.SKORUPI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DEEP_BOULDER_QUARRY: {
        id: 'DEEP_BOULDER_QUARRY',
        name: 'Deep Boulder Quarry',
        pokemons: [Pokemon.CLAYDOL, Pokemon.GLISCOR, Pokemon.NINJASK, Pokemon.MUK, Pokemon.PROBOPASS, Pokemon.SHELGON, Pokemon.RHYDON, Pokemon.TANGROWTH, Pokemon.METANG, Pokemon.STEELIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      LIMESTONE_CAVERN: {
        id: 'LIMESTONE_CAVERN',
        name: 'Limestone Cavern',
        pokemons: [Pokemon.KINGLER, Pokemon.MARILL, Pokemon.SLOWKING, Pokemon.VOLBEAT, Pokemon.ILLUMISE, Pokemon.SEVIPER, Pokemon.DRAGONAIR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      DEEP_LIMESTONE_CAVERN: {
        id: 'DEEP_LIMESTONE_CAVERN',
        name: 'Deep Limestone Cavern',
        pokemons: [Pokemon.DRAGONAIR, Pokemon.AERODACTYL, Pokemon.MASQUERAIN, Pokemon.VOLBEAT, Pokemon.ILLUMISE, Pokemon.SEVIPER, Pokemon.POLIWHIRL, Pokemon.DUGTRIO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      ICICLE_FOREST: {
        id: 'ICICLE_FOREST',
        name: 'Icicle Forest',
        pokemons: [Pokemon.GENGAR, Pokemon.WEEZING, Pokemon.CACTURNE, Pokemon.METAGROSS, Pokemon.LICKILICKY, Pokemon.GLISCOR, Pokemon.DRIFBLIM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ICE
      },
      MURKY_FOREST: {
        id: 'MURKY_FOREST',
        name: 'Murky Forest',
        pokemons: [Pokemon.EXEGGCUTE, Pokemon.HOOTHOOT, Pokemon.HOPPIP, Pokemon.DODUO, Pokemon.WEEDLE, Pokemon.BURMY, Pokemon.SPINARAK, Pokemon.WURMPLE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.BUG
      },
      SPACIAL_CLIFFS: {
        id: 'SPACIAL_CLIFFS',
        name: 'Spacial Cliffs',
        pokemons: [Pokemon.HAUNTER, Pokemon.BELDUM, Pokemon.MISDREAVUS, Pokemon.KOFFING, Pokemon.SHEDNINJA, Pokemon.BANETTE, Pokemon.MISMAGIUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      TEMPORAL_SPIRE_FUTURE: {
        id: 'TEMPORAL_SPIRE_FUTURE',
        name: 'Temporal Spire Future',
        pokemons: [Pokemon.GOLBAT, Pokemon.ALAKAZAM, Pokemon.MAGNETON, Pokemon.GASTLY, Pokemon.HYPNO, Pokemon.CLAYDOL, Pokemon.MISMAGIUS, Pokemon.BRONZONG, Pokemon.PORYGON2, Pokemon.CROBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TEMPORAL_TOWER_FUTURE: {
        id: 'TEMPORAL_TOWER_FUTURE',
        name: 'Temporal Tower Future',
        pokemons: [Pokemon.ZUBAT, Pokemon.KADABRA, Pokemon.MAGNEMITE, Pokemon.GASTLY, Pokemon.DROWZEE, Pokemon.CLAYDOL, Pokemon.MISMAGIUS, Pokemon.BRONZONG, Pokemon.GOLBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      VAST_ICE_MOUNTAIN_PEAK: {
        id: 'VAST_ICE_MOUNTAIN_PEAK',
        name: 'Vast Ice Mountain Peak',
        pokemons: [Pokemon.GENGAR, Pokemon.AERODACTYL, Pokemon.SMOOCHUM, Pokemon.DUSCLOPS, Pokemon.ABSOL, Pokemon.METAGROSS, Pokemon.MAGNEZONE, Pokemon.GLISCOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      VAST_ICE_MOUNTAIN: {
        id: 'VAST_ICE_MOUNTAIN',
        name: 'Vast Ice Mountain',
        pokemons: [Pokemon.GENGAR, Pokemon.AERODACTYL, Pokemon.SMOOCHUM, Pokemon.DUSCLOPS, Pokemon.ABSOL, Pokemon.METAGROSS, Pokemon.MAGNEZONE, Pokemon.GLISCOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      AMP_PLAINS: {
        id: 'AMP_PLAINS',
        name: 'Amp Plains',
        pokemons: [Pokemon.PLUSLE, Pokemon.MINUN, Pokemon.MAREEP, Pokemon.PHANPY, Pokemon.ELEKID, Pokemon.SHINX, Pokemon.GIRAFARIG, Pokemon.ZAPDOS, Pokemon.FLAFFY, Pokemon.PIKACHU, Pokemon.PICHU, Pokemon.YANMEGA, Pokemon.ELECTABUZZ],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      FAR_AMP_PLAINS: {
        id: 'FAR_AMP_PLAINS',
        name: 'Far Amp Plains',
        pokemons: [Pokemon.SHINX, Pokemon.GIRAFARIG, Pokemon.PIKACHU, Pokemon.PICHU, Pokemon.YANMEGA, Pokemon.FLAFFY, Pokemon.ELECTABUZZ, Pokemon.TAUROS, Pokemon.DODRIO, Pokemon.ELECTRIKE, Pokemon.LUXIO, Pokemon.LUXRAY, Pokemon.AMPHAROS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      FINAL_MAZE_B23F: {
        id: 'FINAL_MAZE_B23F',
        name: 'Final Maze',
        pokemons: [Pokemon.MACHOP, Pokemon.MAGNEMITE, Pokemon.DODUO, Pokemon.OMANYTE, Pokemon.KABUTO, Pokemon.SPINARAK, Pokemon.MAREEP, Pokemon.MISDREAVUS, Pokemon.SWINUB, Pokemon.HOUNDOUR, Pokemon.PHANPY, Pokemon.MAGBY, Pokemon. POOCHYENA, Pokemon.SHROOMISH, Pokemon.MAWILE, Pokemon.MEDITITE, Pokemon.BAGON, Pokemon.STARAVIA, Pokemon.SKORUPI, Pokemon.CARNIVINE, Pokemon.JIRACHI, Pokemon.MOLTRES, Pokemon.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      FOGGY_FOREST: {
        id: 'FOGGY_FOREST',
        name: 'Foggy Forest',
        pokemons: [Pokemon.HOOTHOOT, Pokemon.DUNSPARCE, Pokemon.SMEARGLE, Pokemon.CHERUBI, Pokemon.SKIPLOOM, Pokemon.ZIGZAGOON, Pokemon.PACHIRISU, Pokemon.NOCTOWL, Pokemon.STANTLER, Pokemon.BUNEARY, Pokemon.PINSIR, Pokemon. BRELOOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      FOREST_PATH: {
        id: 'FOREST_PATH',
        name: 'Forest Path',
        pokemons: [Pokemon.PINSIR, Pokemon.DUNSPARCE, Pokemon.SWINUB, Pokemon.HOUNDOUR, Pokemon.LINOONE, Pokemon.KRICKEROT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      GOLD_CHAMBER: {
        id: 'GOLD_CHAMBER',
        name: 'Gold Chamber',
        pokemons: [Pokemon.MACHOP, Pokemon.MAGNEMITE, Pokemon.DODUO, Pokemon.OMANYTE, Pokemon.KABUTO, Pokemon.SPINARAK, Pokemon.MAREEP, Pokemon.MISDREAVUS, Pokemon.SWINUB, Pokemon.HOUNDOUR, Pokemon.PHANPY, Pokemon.MAGBY, Pokemon. POOCHYENA, Pokemon.SHROOMISH, Pokemon.MAWILE, Pokemon.MEDITITE, Pokemon.BAGON, Pokemon.STARAVIA, Pokemon.SKORUPI, Pokemon.CARNIVINE, Pokemon.JIRACHI, Pokemon.MOLTRES, Pokemon.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      HIDDEN_HIGHLAND: {
        id: 'HIDDEN_HIGHLAND',
        name: 'Hidden Highland',
        pokemons: [Pokemon.DRAGONITE, Pokemon.MANECTRIC, Pokemon.TROPIUS, Pokemon.RAMPARDOS, Pokemon.BASTIODON, Pokemon.PURUGLY, Pokemon.GARCHOMP, Pokemon.ABOMASNOW, Pokemon.MAGMORTAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTERY_JUNGLE_01F_15F: {
        id: 'MYSTERY_JUNGLE_01F_15F',
        name: 'Mystery Jungle',
        pokemons: [Pokemon.MEW, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.WALL_ALT_3, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTERY_JUNGLE_16F_30F: {
        id: 'MYSTERY_JUNGLE_16F_30F',
        name: 'Mystery Jungle',
        pokemons: [Pokemon.MEW, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      MYSTIFYING_FOREST: {
        id: 'MYSTIFYING_FOREST',
        name: 'Mystifying Forest',
        pokemons: [Pokemon.CELEBI, Pokemon.DARKRAI, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      BEACH_CAVE: {
        id: 'BEACH_CAVE',
        name: 'Beach Cave',
        pokemons: [Pokemon.SHELLDER, Pokemon.SHELLOS, Pokemon.KABUTO, Pokemon.CORSOLA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.GROUND_ALT_4, HDR.WATER],
        type: Synergy.WATER
      },
      BOTTOMLESS_SEA: {
        id: 'BOTTOMLESS_SEA',
        name: 'Bottomless Sea',
        pokemons: [Pokemon.KYOGRE, Pokemon.GYARADOS, Pokemon.REMORAID, Pokemon.KINGDRA, Pokemon.WAILMER, Pokemon.CLAMPERL, Pokemon.FINNEON, Pokemon.TENTACRUEL, Pokemon.SLOWBRO, Pokemon.HORSEA, Pokemon.SEADRA, Pokemon.STARMIE, Pokemon.SLOWKING, Pokemon.LAPRAS, Pokemon.WAILORD],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      BRINE_CAVE: {
        id: 'BRINE_CAVE',
        name: 'Brine Cave',
        pokemons: [Pokemon.SEEL, Pokemon.OMANYTE, Pokemon.KINGLER, Pokemon.PELIPPER, Pokemon.GASTRODON, Pokemon.TENTACOOL, Pokemon.DEWGONG, Pokemon.STARYU, Pokemon.DRAGONAIR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      CONCEALED_RUINS: {
        id: 'CONCEALED_RUINS',
        name: 'Concealed Ruins',
        pokemons: [Pokemon.PIDGEY, Pokemon.VOLTORB, Pokemon.POOCHYENA, Pokemon.TAILOW, Pokemon.LOUDRED, Pokemon.NIDOQUEEN, Pokemon.WEEZING, Pokemon.MURKROW, Pokemon.DELCATTY, Pokemon.PIDGEOTTO, Pokemon.SHUPPET, Pokemon.ELECTRODE, Pokemon.EXPLOUD, Pokemon.RAIKOU, Pokemon.PIDGEOT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      CRAGGY_COAST: {
        id: 'CRAGGY_COAST',
        name: 'Craggy Coast',
        pokemons: [Pokemon.SPHEAL, Pokemon.KRABBY, Pokemon.DRATINI, Pokemon.WINGULL, Pokemon.GASTRODON, Pokemon.SEALEO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      CRYSTAL_CAVE_01F_05F: {
        id: 'CRYSTAL_CAVE_01F_05F',
        name: 'Crystal Cave',
        pokemons: [Pokemon.GRAVELER, Pokemon.SEVIPER, Pokemon.BELDUM, Pokemon.WORMADAN, Pokemon.RIOLU, Pokemon.CRANIDOS, Pokemon.DONPHAN, Pokemon.SHIELDON, Pokemon.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      CRYSTAL_CAVE_06F_11F: {
        id: 'CRYSTAL_CAVE_06F_11F',
        name: 'Crystal Cave',
        pokemons: [Pokemon.GRAVELER, Pokemon.SEVIPER, Pokemon.BELDUM, Pokemon.WORMADAN, Pokemon.RIOLU, Pokemon.CRANIDOS, Pokemon.DONPHAN, Pokemon.SHIELDON, Pokemon.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      CRYSTAL_CROSSING: {
        id: 'CRYSTAL_CROSSING',
        name: 'Crystal Crossing',
        pokemons: [Pokemon.FLOATZEL, Pokemon.BAGON, Pokemon.WORMADAN, Pokemon.GLAMEOW, Pokemon.ABSOL, Pokemon.GLALIE, Pokemon.FROSLASS, Pokemon.AZELF],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DARK_CRATER: {
        id: 'DARK_CRATER',
        name: 'Dark Crater',
        pokemons: [Pokemon.CHARMANDER, Pokemon.CYNDAQUIL, Pokemon.HIPPOWDON, Pokemon.NUMEL, Pokemon.SLUGMA, Pokemon.GROWLITHE, Pokemon.PONYTA, Pokemon.TORCHIC, Pokemon.FLAREON, Pokemon.COMBUSKEN, Pokemon.RAPIDASH, Pokemon.MEWTWO, Pokemon.ARCANINE, Pokemon.QUILAVA, Pokemon.MAGCARGO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      DEEP_DARK_CRATER: {
        id: 'DEEP_DARK_CRATER',
        name: 'Deep Dark Crater',
        pokemons: [Pokemon.CHARMELEON, Pokemon.QUILAVA, Pokemon.MONFERNO, Pokemon.CAMERUPT, Pokemon.COMBUSKEN, Pokemon.ARCANINE, Pokemon.RAPIDASH, Pokemon.FLAREON, Pokemon.MAGCARGO, Pokemon.RHYPERIOR, Pokemon.MAGMORTAR, Pokemon.CHARIZARD, Pokemon.TYPHLOSION, Pokemon.INFERNAPE, Pokemon.MISMAGIUS, Pokemon.BLAZIKEN, Pokemon.AGGRON, Pokemon.ENTEI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      DARK_HILL_01F_06F: {
        id: 'DARK_HILL_01F_06F',
        name: 'Dark Hill',
        pokemons: [Pokemon.GASTLY, Pokemon.HAUNTER, Pokemon.GENGAR, Pokemon.BANETTE, Pokemon.DUSCLOPS, Pokemon.CLAYDOL, Pokemon.MISMAGIUS, Pokemon.GLISCOR, Pokemon.MISDREAVUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DARK_HILL_07F_15F: {
        id: 'DARK_HILL_07F_15F',
        name: 'Dark Hill',
        pokemons: [Pokemon.GASTLY, Pokemon.HAUNTER, Pokemon.GENGAR, Pokemon.BANETTE, Pokemon.DUSCLOPS, Pokemon.CLAYDOL, Pokemon.MISMAGIUS, Pokemon.GLISCOR, Pokemon.MISDREAVUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DEEP_DUSK_FOREST_01F_06F: {
        id: 'DEEP_DUSK_FOREST_01F_06F',
        name: 'Deep Dusk Forest',
        pokemons: [Pokemon.VULPIX, Pokemon.RHYDON, Pokemon.STEELIX, Pokemon.AGGRON, Pokemon.LEAFEON, Pokemon.HIPPOWDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DEEP_DUSK_FOREST_07F_12F: {
        id: 'DEEP_DUSK_FOREST_07F_12F',
        name: 'Deep Dusk Forest',
        pokemons: [Pokemon.VULPIX, Pokemon.RHYDON, Pokemon.STEELIX, Pokemon.AGGRON, Pokemon.LEAFEON, Pokemon.HIPPOWDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DEEP_SEALED_RUIN: {
        id: 'DEEP_SEALED_RUIN',
        name: 'Deep Sealed Ruin',
        pokemons: [Pokemon.MUK, Pokemon.FORETRESS, Pokemon.SHELGON, Pokemon.METANG, Pokemon.TANGROWTH, Pokemon.PROBOPASS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.METAL
      },
      DRENCHED_BLUFF: {
        id: 'DRENCHED_BLUFF',
        name: 'Drenched Bluff',
        pokemons: [Pokemon.LILEEP, Pokemon.ANORITH, Pokemon.SHELLOS, Pokemon.CHINGLING],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      DUSK_FOREST_01F_04F: {
        id: 'DUSK_FOREST_01F_04F',
        name: 'Dusk Forest',
        pokemons: [Pokemon.JUMPLUFF, Pokemon.MOTHIM, Pokemon.MISMAGIUS, Pokemon.GABITE, Pokemon.HAUNTER, Pokemon.LICKITUNG, Pokemon.CLAYDOL, Pokemon.SALAMENCE, Pokemon.MISMAGIUS, Pokemon.HIPPOWDON, Pokemon.RHYPERIOR, Pokemon.DRIFLOON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      DUSK_FOREST_05F_08F: {
        id: 'DUSK_FOREST_05F_08F',
        name: 'Dusk Forest',
        pokemons: [Pokemon.JUMPLUFF, Pokemon.MOTHIM, Pokemon.MISMAGIUS, Pokemon.GABITE, Pokemon.HAUNTER, Pokemon.LICKITUNG, Pokemon.CLAYDOL, Pokemon.SALAMENCE, Pokemon.MISMAGIUS, Pokemon.HIPPOWDON, Pokemon.RHYPERIOR, Pokemon.DRIFLOON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GHOST
      },
      NORTHERN_DESERT_01F_07F: {
        id: 'NORTHERN_DESERT_01F_07F',
        name: 'Northern Desert',
        pokemons: [Pokemon.BALTOY, Pokemon.CUBONE, Pokemon.ARON, Pokemon.CACNEA, Pokemon.LARVITAR, Pokemon.SANDSHREW, Pokemon.TRAPINCH, Pokemon.CARNIVINE, Pokemon.RHYHORN, Pokemon.LAIRON, Pokemon.CACTURNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      QUICKSAND_CAVE: {
        id: 'QUICKSAND_CAVE',
        name: 'Quicksand Cave',
        pokemons: [Pokemon.NINCADA, Pokemon.VIBRAVA, Pokemon.PUPITAR, Pokemon.SKORUPI, Pokemon.SANDSLASH, Pokemon.MAWILE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      QUICKSAND_PIT: {
        id: 'QUICKSAND_PIT',
        name: 'Quicksand Pit',
        pokemons: [Pokemon.MESPRIT, Pokemon.PUPITAR, Pokemon.SKORUPI, Pokemon.MAWILE, Pokemon.SANDSLASH, Pokemon.TYRANITAR, Pokemon.HIPPOPOTAS, Pokemon.NINJASK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      ROCK_AEGIS_CAVE: {
        id: 'ROCK_AEGIS_CAVE',
        name: 'Rock Aegis Cave',
        pokemons: [Pokemon.ZUBAT, Pokemon.GOLBAT, Pokemon.UNOWN, Pokemon.MACHOKE, Pokemon.MACHAMP, Pokemon.REGIROCK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.MINERAL
      },
      SURROUNDED_SEA: {
        id: 'SURROUNDED_SEA',
        name: 'Surrounded Sea',
        pokemons: [Pokemon.SHELLDER, Pokemon.CARVANHA, Pokemon.WAILMER, Pokemon.SLOWBRO, Pokemon.TENTACRUEL, Pokemon.STARMIE, Pokemon.QWILFISH, Pokemon.HORSEA, Pokemon.SEADRA, Pokemon.SLOWKING, Pokemon.REMORAID, Pokemon.OCTIRELLY, Pokemon.KINGDRA, Pokemon.CLAMPERL, Pokemon.FINNEON, Pokemon.LAPRAS, Pokemon.WAILORD, Pokemon.LUGIA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      TEMPORAL_SPIRE: {
        id: 'TEMPORAL_SPIRE',
        name: 'Temporal Spire',
        pokemons: [Pokemon.DIALGA, Pokemon.DEOXYS, Pokemon.BRONZONG, Pokemon.PORYGON, Pokemon.SALAMENCE, Pokemon.PORYGONZ, Pokemon.METAGROSS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.METAL
      },
      TEMPORAL_TOWER: {
        id: 'TEMPORAL_TOWER',
        name: 'Temporal Tower',
        pokemons: [Pokemon.PORYGON, Pokemon.LUNATONE, Pokemon.SOLROCK, Pokemon.BRONZOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TEST_DUNGEON: {
        id: 'TEST_DUNGEON',
        name: 'Test Dungeon',
        pokemons: [Pokemon.PORYGON, Pokemon.UNOWN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      THE_NIGHTMARE: {
        id: 'THE_NIGHTMARE',
        name: 'The Nightmare',
        pokemons: [Pokemon.SPOINK, Pokemon.CLEFFA, Pokemon.CLEFAIRY, Pokemon.JIGGLYPUFF, Pokemon.WYNAUT, Pokemon.SPINDA, Pokemon.LICKITUNG, Pokemon.ESPEON, Pokemon.WOOBUFFET, Pokemon.MILTANK, Pokemon.BLISSEY, Pokemon.WHISMUR, Pokemon.SKITTY, Pokemon.PERSIAN, Pokemon.IGGLYBUFF, Pokemon.CLEFABLE, Pokemon.WIGGLYTUFF, Pokemon.CHANSEY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      TINY_MEADOW: {
        id: 'TINY_MEADOW',
        name: 'Tiny Meadow',
        pokemons: [Pokemon.SKIPLOOM, Pokemon.BRELOOM, Pokemon.STARAVIA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      TREESHROUD_FOREST_01F_08F: {
        id: 'TREESHROUD_FOREST_01F_08F',
        name: 'Treeshroud Forest',
        pokemons: [Pokemon.KADABRA, Pokemon.RALTS, Pokemon.CHERIM, Pokemon.HOUNDOOM, Pokemon.NINETALES, Pokemon.ALAKAZAM, Pokemon.KIRLIA, Pokemon.VESPIQUEEN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      TREESHROUD_FOREST_09F_21F: {
        id: 'TREESHROUD_FOREST_09F_21F',
        name: 'Treeshroud Forest',
        pokemons: [Pokemon.KADABRA, Pokemon.RALTS, Pokemon.CHERIM, Pokemon.HOUNDOOM, Pokemon.NINETALES, Pokemon.ALAKAZAM, Pokemon.KIRLIA, Pokemon.VESPIQUEEN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      STEAM_CAVE: {
        id: 'STEAM_CAVE',
        name: 'Steam Cave',
        pokemons: [Pokemon.SNUBULL, Pokemon.SLUGMA, Pokemon.MAGBY, Pokemon.NUMEL, Pokemon.FARFETCH, Pokemon.YANMEGA, Pokemon.KRICKETUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.FIRE
      },
      QUICKSAND_PIT_2: {
        id: 'QUICKSAND_PIT_2',
        name: 'Quicksand Pit',
        pokemons: [Pokemon.MESPRIT, Pokemon.PUPITAR, Pokemon.SKORUPI, Pokemon.MAWILE, Pokemon.SANDSLASH, Pokemon.TYRANITAR, Pokemon.HIPPOPOTAS, Pokemon.NINJASK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      LOWER_BRINE_CAVE: {
        id: 'LOWER_BRINE_CAVE',
        name: 'Lower Brine Cave',
        pokemons: [Pokemon.WALREIN, Pokemon.DRAGONAIR, Pokemon.STARYU, Pokemon.TENTACOOL, Pokemon.DEWGONG, Pokemon.GASTRODON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      HIDDEN_LAND: {
        id: 'HIDDEN_LAND',
        name: 'Hidden land',
        pokemons: [Pokemon.DRAGONITE, Pokemon.MANECTRIC, Pokemon.TROPIUS, Pokemon.RAMPARDOS, Pokemon.BASTIODON, Pokemon.PURUGLY, Pokemon.GARCHOMP, Pokemon.ABOMASNOW, Pokemon.MAGMORTAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      TEMPORAL_TOWER_2: {
        id: 'TEMPORAL_TOWER_2',
        name: 'Temporal Tower',
        pokemons: [Pokemon.PORYGON, Pokemon.LUNATONE, Pokemon.SOLROCK, Pokemon.BRONZOR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      CRYSTAL_CAVE_2: {
        id: 'CRYSTAL_CAVE_2',
        name: 'Crystal Cave',
        pokemons: [Pokemon.GRAVELER, Pokemon.SEVIPER, Pokemon.BELDUM, Pokemon.WORMADAN, Pokemon.RIOLU, Pokemon.CRANIDOS, Pokemon.DONPHAN, Pokemon.SHIELDON, Pokemon.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      WATERFALL_CAVE: {
        id: 'WATERFALL_CAVE',
        name: 'Waterfall Cave',
        pokemons: [Pokemon.PSYDUCK, Pokemon.POLIWAG, Pokemon.GRIMER, Pokemon.TANGELA, Pokemon.WOOPER, Pokemon.LOTAD, Pokemon.SURSKIT, Pokemon.BARBOACH, Pokemon.WHISCASH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      WORLD_ABYSS: {
        id: 'WORLD_ABYSS',
        name: 'World Abyss',
        pokemons: [Pokemon.GIRATINA, Pokemon.TAILOW, Pokemon.PIDGEY, Pokemon.MURKROW, Pokemon.VOLTORB, Pokemon.POOCHYENA, Pokemon.LOUDRED, Pokemon.PIDGEOTTO, Pokemon.NIDOQUEEN, Pokemon.ELECTRODE, Pokemon.WEEZING, Pokemon.UMBREON, Pokemon.DELCATTY, Pokemon.SWELLOW, Pokemon.EXPLOUD, Pokemon.MIGHTYENA, Pokemon.PIDGEOT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      ZERO_ISLE_EAST_15F_25F: {
        id: 'ZERO_ISLE_EAST_15F_25F',
        name: 'Zero Isle East',
        pokemons: [Pokemon.DEWGONG, Pokemon.SHELLDER, Pokemon.CORSOLA, Pokemon.KABUTO, Pokemon.AZUMARILL, Pokemon.SLOWPOKE, Pokemon.YANMA, Pokemon.TENTACRUEL, Pokemon.VOLTORB, Pokemon.SPEAROW, Pokemon.SEEDOT, Pokemon.GOLBAT, Pokemon.HOOTHOOT, Pokemon.WYNAUT, Pokemon.HOUNDOUR, Pokemon.WAILMER, Pokemon.MAGNETON, Pokemon.BEEDRILL, Pokemon.VULPIX, Pokemon.FERALIGATR, Pokemon.SPINARAK, Pokemon.SLUGMA, Pokemon.CHANSEY, Pokemon.KRABBY, Pokemon.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      ZERO_ISLE_EAST_26F_40F: {
        id: 'ZERO_ISLE_EAST_26F_40F',
        name: 'Zero Isle East',
        pokemons: [Pokemon.DEWGONG, Pokemon.SHELLDER, Pokemon.CORSOLA, Pokemon.KABUTO, Pokemon.AZUMARILL, Pokemon.SLOWPOKE, Pokemon.YANMA, Pokemon.TENTACRUEL, Pokemon.VOLTORB, Pokemon.SPEAROW, Pokemon.SEEDOT, Pokemon.GOLBAT, Pokemon.HOOTHOOT, Pokemon.WYNAUT, Pokemon.HOUNDOUR, Pokemon.WAILMER, Pokemon.MAGNETON, Pokemon.BEEDRILL, Pokemon.VULPIX, Pokemon.FERALIGATR, Pokemon.SPINARAK, Pokemon.SLUGMA, Pokemon.CHANSEY, Pokemon.KRABBY, Pokemon.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      ZERO_ISLE_SOUTH_01F_03F: {
        id: 'ZERO_ISLE_SOUTH_01F_03F',
        name: 'Zero Isle South',
        pokemons: [Pokemon.PIDGEY, Pokemon.JIGGLYPUFF, Pokemon.SHELLDER, Pokemon.SEADRA, Pokemon.STARYU, Pokemon.STARMIE, Pokemon.CHINGLING, Pokemon.CLEFFA, Pokemon.BELLSPROUT, Pokemon.EXEGGCUTE, Pokemon.CHINCHOU, Pokemon.POOCHYENA, Pokemon.NIDORANM, Pokemon.LARVITAR, Pokemon.RATTATA, Pokemon.TOGEPI, Pokemon.EEVEE, Pokemon.RALTS, Pokemon.BALTOY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      ZERO_ISLE_SOUTH_04F_08F: {
        id: 'ZERO_ISLE_SOUTH_04F_08F',
        name: 'Zero Isle East',
        pokemons: [Pokemon.PIDGEY, Pokemon.JIGGLYPUFF, Pokemon.SHELLDER, Pokemon.SEADRA, Pokemon.STARYU, Pokemon.STARMIE, Pokemon.CHINGLING, Pokemon.CLEFFA, Pokemon.BELLSPROUT, Pokemon.EXEGGCUTE, Pokemon.CHINCHOU, Pokemon.POOCHYENA, Pokemon.NIDORANM, Pokemon.LARVITAR, Pokemon.RATTATA, Pokemon.TOGEPI, Pokemon.EEVEE, Pokemon.RALTS, Pokemon.BALTOY],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.NORMAL
      },
      BURIED_RELIC_1F_20F: {
        id: 'BURIED_RELIC_1F_20F',
        name: 'Buried Relic',
        pokemons: [Pokemon.GOLBAT, Pokemon.SNEASEL, Pokemon.WYNAUT, Pokemon.RATICATE, Pokemon.MACHOP, Pokemon.WHISMUR, Pokemon.HOOTHOOT, Pokemon.PORYGON, Pokemon.PORYGON2, Pokemon.ARON, Pokemon.REGIROCK, Pokemon.GEODUDE, Pokemon.REGISTEEL, Pokemon.REGICE, Pokemon.KADABRA, Pokemon.MEW, Pokemon.SHEDNINJA, Pokemon.SANDSHREW, Pokemon.MAWILE, Pokemon.GRAVELER, Pokemon.HAUNTER, Pokemon.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      BURIED_RELIC_21F_50F: {
        id: 'BURIED_RELIC_21F_50F',
        name: 'Buried Relic',
        pokemons: [Pokemon.GOLBAT, Pokemon.SNEASEL, Pokemon.WYNAUT, Pokemon.RATICATE, Pokemon.MACHOP, Pokemon.WHISMUR, Pokemon.HOOTHOOT, Pokemon.PORYGON, Pokemon.PORYGON2, Pokemon.ARON, Pokemon.REGIROCK, Pokemon.GEODUDE, Pokemon.REGISTEEL, Pokemon.REGICE, Pokemon.KADABRA, Pokemon.MEW, Pokemon.SHEDNINJA, Pokemon.SANDSHREW, Pokemon.MAWILE, Pokemon.GRAVELER, Pokemon.HAUNTER, Pokemon.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      BURIED_RELIC_51F_99F: {
        id: 'BURIED_RELIC_51F_99F',
        name: 'Buried Relic',
        pokemons: [Pokemon.GOLBAT, Pokemon.SNEASEL, Pokemon.WYNAUT, Pokemon.RATICATE, Pokemon.MACHOP, Pokemon.WHISMUR, Pokemon.HOOTHOOT, Pokemon.PORYGON, Pokemon.PORYGON2, Pokemon.ARON, Pokemon.REGIROCK, Pokemon.GEODUDE, Pokemon.REGISTEEL, Pokemon.REGICE, Pokemon.KADABRA, Pokemon.MEW, Pokemon.SHEDNINJA, Pokemon.SANDSHREW, Pokemon.MAWILE, Pokemon.GRAVELER, Pokemon.HAUNTER, Pokemon.GOLEM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      DARKNIGHT_RELIC: {
        id: 'DARKNIGHT_RELIC',
        name: 'Darknight Relic',
        pokemons: [Pokemon.SHUPPET, Pokemon.GASTLY, Pokemon.MISDREAVUS, Pokemon.SHEDNINJA, Pokemon.SABLEYE, Pokemon.BANETTE, Pokemon.HAUNTER, Pokemon.DUSKULL, Pokemon.GENGAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GHOST
      },
      SHIMMER_DESERT: {
        id: 'SHIMMER_DESERT',
        name: 'Shimmer Desert',
        pokemons: [Pokemon.EKANS, Pokemon.ARBOK, Pokemon.SANDSHREW, Pokemon.SANDSLASH, Pokemon.NIDOKING, Pokemon.DIGLETT, Pokemon.DUGTRIO, Pokemon.SUDOWOODO, Pokemon.GARCHOMP, Pokemon.RHYPERIOR, Pokemon.GROUDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      UNOWN_RELIC: {
        id: 'UNOWN_RELIC',
        name: 'Unown Relic',
        pokemons: [Pokemon.UNOWN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      FROSTY_FOREST: {
        id: 'FROSTY_FOREST',
        name: 'Frosty Forest',
        pokemons: [Pokemon.AZURILL, Pokemon.FURRET, Pokemon.NOSEPASS, Pokemon.PILOSWINE, Pokemon.MIGHTYENA, Pokemon.LAIRON, Pokemon.SNORUNT, Pokemon.ARTICUNO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ICE
      },
      GREAT_CANYON: {
        id: 'GREAT_CANYON',
        name: 'Great Canyon',
        pokemons: [Pokemon.SKIPLOOM, Pokemon.DUNSPARCE, Pokemon.PHANPY, Pokemon.DODUO, Pokemon.VILEPLUME, Pokemon.BRELOOM, Pokemon.MURKROW, Pokemon.CACTURNE, Pokemon.NOCTOWL, Pokemon.ARIADOS, Pokemon.TAUROS, Pokemon.HOUNDOOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      HOWLING_FOREST_01F_06F: {
        id: 'HOWLING_FOREST_01F_06F',
        name: 'Howling Forest',
        pokemons: [Pokemon.AZURILL, Pokemon.HOUNDOUR, Pokemon.POOCHYENA, Pokemon.WHISMUR, Pokemon.SPOINK, Pokemon.FURRET, Pokemon.PIDGEY, Pokemon.LOUDRED, Pokemon.HOUNDOOM, Pokemon.MIGHTYENA, Pokemon.GRUMPIG, Pokemon.SNORLAX, Pokemon.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      HOWLING_FOREST_07F_15F: {
        id: 'HOWLING_FOREST_07F_15F',
        name: 'Howling Forest',
        pokemons: [Pokemon.AZURILL, Pokemon.HOUNDOUR, Pokemon.POOCHYENA, Pokemon.WHISMUR, Pokemon.SPOINK, Pokemon.FURRET, Pokemon.PIDGEY, Pokemon.LOUDRED, Pokemon.HOUNDOOM, Pokemon.MIGHTYENA, Pokemon.GRUMPIG, Pokemon.SNORLAX, Pokemon.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      MT_FARAWAY: {
        id: 'MT_FARAWAY',
        name: 'Mt Faraway',
        pokemons: [Pokemon.LUNATONE, Pokemon.SNORUNT, Pokemon.SOLROCK, Pokemon.AZUMARILL, Pokemon.GOLEM, Pokemon.MARSHTOMP, Pokemon.VIGOROTH, Pokemon.GRANBULL, Pokemon.WEEZING, Pokemon.DUGTRIO, Pokemon.GLALIE, Pokemon.HOOH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_FARAWAY_10F_20F: {
        id: 'MT_FARAWAY_10F_20F',
        name: 'Mt Faraway',
        pokemons: [Pokemon.LUNATONE, Pokemon.SNORUNT, Pokemon.SOLROCK, Pokemon.AZUMARILL, Pokemon.GOLEM, Pokemon.MARSHTOMP, Pokemon.VIGOROTH, Pokemon.GRANBULL, Pokemon.WEEZING, Pokemon.DUGTRIO, Pokemon.GLALIE, Pokemon.HOOH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_FARAWAY_30F_39F: {
        id: 'MT_FARAWAY_30F_39F',
        name: 'Mt Faraway',
        pokemons: [Pokemon.LUNATONE, Pokemon.SNORUNT, Pokemon.SOLROCK, Pokemon.AZUMARILL, Pokemon.GOLEM, Pokemon.MARSHTOMP, Pokemon.VIGOROTH, Pokemon.GRANBULL, Pokemon.WEEZING, Pokemon.DUGTRIO, Pokemon.GLALIE, Pokemon.HOOH],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ICE
      },
      JOYOUS_TOWER: {
        id: 'JOYOUS_TOWER',
        name: 'Joyous Tower',
        pokemons: [Pokemon.JIGGLYPUFF, Pokemon.TREECKO, Pokemon.BULBASAUR, Pokemon.TAILOW, Pokemon.PICHU, Pokemon.DIGLETT, Pokemon.SPINDA, Pokemon.PLUSLE, Pokemon.MINUN, Pokemon.METAPOD, Pokemon.CHIKORITA, Pokemon.PSYDUCK, Pokemon.KAKUNA, Pokemon.CLEFAIRY, Pokemon.TORCHIC, Pokemon.EEVEE, Pokemon.CYNDAQUIL, Pokemon.BELDUM, Pokemon.SCYTHER, Pokemon.SLAKOTH, Pokemon.TRAPINCH, Pokemon.CLEFABLE, Pokemon.HOUNDOUR, Pokemon.SPINARAK, Pokemon.GARDEVOIR, Pokemon.BELLOSSOM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      LAPIS_CAVE: {
        id: 'LAPIS_CAVE',
        name: 'Lapis Cave',
        pokemons: [Pokemon.ZUBAT, Pokemon.NINCADA, Pokemon.NIDORINA, Pokemon.NIDORINO, Pokemon.TANGELA, Pokemon.BAGON, Pokemon.GOLBAT],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      LIGHTNING_FIELD: {
        id: 'LIGHTNING_FIELD',
        name: 'Lightning Field',
        pokemons: [Pokemon.MAREEP, Pokemon.ELECTRIKE, Pokemon.MAGNEMITE, Pokemon.PIKACHU, Pokemon.FLAFFY, Pokemon.PLUSLE, Pokemon.MINUN, Pokemon.JOLTEON, Pokemon.CACTURNE, Pokemon.ELECTRODE, Pokemon.ELEKID, Pokemon.MAGNETON, Pokemon.AMPHAROS, Pokemon.MANECTRIC, Pokemon.RAICHU, Pokemon.RAIKOU],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MAGMA_CAVERN_08F_17F: {
        id: 'MAGMA_CAVERN_08F_17F',
        name: 'Magma Cavern',
        pokemons: [Pokemon.RATICATE, Pokemon.SANDSHREW, Pokemon.NIDOQUEEN, Pokemon.NIDOKING, Pokemon.GRAVELER, Pokemon.MAGMAR, Pokemon.MAWILE, Pokemon.ARBOK, Pokemon.MAGCARGO, Pokemon.SANDSLASH, Pokemon.GOLEM, Pokemon.GRIMER, Pokemon.ONIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FIRE
      },
      MAGMA_CAVERN_18F_23F: {
        id: 'MAGMA_CAVERN_18F_23F',
        name: 'Magma Cavern',
        pokemons: [Pokemon.GROUDON, Pokemon.RATICATE, Pokemon.SANDSHREW, Pokemon.NIDOQUEEN, Pokemon.NIDOKING, Pokemon.GRAVELER, Pokemon.MAGMAR, Pokemon.MAWILE, Pokemon.ARBOK, Pokemon.MAGCARGO, Pokemon.SANDSLASH, Pokemon.GOLEM, Pokemon.GRIMER, Pokemon.ONIX],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FIRE
      },
      METEOR_CAVE: {
        id: 'METEOR_CAVE',
        name: 'Meteor Cave',
        pokemons: [Pokemon.DEOXYS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      MT_BLAZE: {
        id: 'MT_BLAZE',
        name: 'Mt Blaze',
        pokemons: [Pokemon.PIDGEOT, Pokemon.MAGBY, Pokemon.NUMEL, Pokemon.SLUGMA, Pokemon.RAPIDASH, Pokemon.FEAROW, Pokemon.ARCANINE, Pokemon.MOLTRES],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FIRE
      },
      MT_STEEL_01F_05F: {
        id: 'MT_STEEL_01F_05F',
        name: 'Mt Steel',
        pokemons: [Pokemon.SPEAROW, Pokemon.BALTOY, Pokemon.ZIGZAGOON, Pokemon.ARON, Pokemon.GEODUDE, Pokemon.MEDITITE, Pokemon.BELDUM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.METAL
      },
      MT_STEEL_06F_08F: {
        id: 'MT_STEEL_06F_08F',
        name: 'Mt Steel',
        pokemons: [Pokemon.SPEAROW, Pokemon.BALTOY, Pokemon.ZIGZAGOON, Pokemon.ARON, Pokemon.GEODUDE, Pokemon.MEDITITE, Pokemon.BELDUM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.METAL
      },
      MT_FREEZE: {
        id: 'MT_FREEZE',
        name: 'Mt Freeze',
        pokemons: [Pokemon.SWABLU, Pokemon.SHELGON, Pokemon.PUPITAR, Pokemon.SEEL, Pokemon.VIGOROTH, Pokemon.SLAKING, Pokemon.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ICE
      },
      MT_THUNDER_PEAK: {
        id: 'MT_THUNDER_PEAK',
        name: 'Mt Thunder Peak',
        pokemons: [Pokemon.WEEDLE, Pokemon.NIDORANM, Pokemon.ELECTRIKE, Pokemon.CACNEA, Pokemon.PIDGEOTTO, Pokemon.BEEDRILL, Pokemon.ELECTABUZZ, Pokemon.STANTLER, Pokemon.AMPHAROS, Pokemon.MANECTRIC, Pokemon.GROWLITHE, Pokemon.ZAPDOS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MT_THUNDER: {
        id: 'MT_THUNDER',
        name: 'Mt Thunder',
        pokemons: [Pokemon.WEEDLE, Pokemon.NIDORANM, Pokemon.ELECTRIKE, Pokemon.CACNEA, Pokemon.PIDGEOTTO, Pokemon.BEEDRILL, Pokemon.ELECTABUZZ, Pokemon.STANTLER, Pokemon.AMPHAROS, Pokemon.MANECTRIC, Pokemon.GROWLITHE, Pokemon.ZAPDOS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      MURKY_CAVE: {
        id: 'MURKY_CAVE',
        name: 'Murky Cave',
        pokemons: [Pokemon.ZUBAT, Pokemon.SEVIPER, Pokemon.GRIMER, Pokemon.GOLBAT, Pokemon.SHEDNINJA, Pokemon.SHUPPET, Pokemon.CROBAT, Pokemon.MISDREAVUS, Pokemon.MUK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      NORMAL_MAZE: {
        id: 'NORMAL_MAZE',
        name: 'Normal Maze',
        pokemons: [Pokemon.RATICATE, Pokemon.FARFETCH, Pokemon.FURRET],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.NORMAL
      },
      NORTHERN_RANGE_01F_07F: {
        id: 'NORTHERN_RANGE_01F_07F',
        name: 'Northern Range',
        pokemons: [Pokemon.HOOTHOOT, Pokemon.DODRIO, Pokemon.NINJASK, Pokemon.SPINARAK, Pokemon.SWELLOW, Pokemon.PIDGEOT, Pokemon.FEAROW, Pokemon.TOGETIC, Pokemon.LATIOS, Pokemon.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FLYING
      },
      NORTHERN_RANGE_08F_16F: {
        id: 'NORTHERN_RANGE_08F_16F',
        name: 'Northern Range',
        pokemons: [Pokemon.HOOTHOOT, Pokemon.DODRIO, Pokemon.NINJASK, Pokemon.SPINARAK, Pokemon.SWELLOW, Pokemon.PIDGEOT, Pokemon.FEAROW, Pokemon.TOGETIC, Pokemon.LATIOS, Pokemon.SEVIPER],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FLYING
      },
      NORTHWIND_FIELD: {
        id: 'NORTHWIND_FIELD',
        name: 'Northwind Field',
        pokemons: [Pokemon.AZUMARILL, Pokemon.DELCATTY, Pokemon.VAPOREON, Pokemon.POLIWHIRL, Pokemon.MUK, Pokemon.POLITOED, Pokemon.ABSOL, Pokemon.CROCONAW, Pokemon.WARTORTLE, Pokemon.SUICUNE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      PITFALL_VALLEY: {
        id: 'PITFALL_VALLEY',
        name: 'Pitfall Valley',
        pokemons: [Pokemon.PIDGEOT, Pokemon.FARFETCH, Pokemon.SWELLOW, Pokemon.HOPPIP, Pokemon.BUTTERFREE, Pokemon.RATICATE, Pokemon.DODUO, Pokemon.SWABLU, Pokemon.YANMA, Pokemon.MASQUERAIN, Pokemon.SKIPLOOM, Pokemon.AERODACTYL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.FLYING
      },
      POISON_MAZE: {
        id: 'POISON_MAZE',
        name: 'Poison Maze',
        pokemons: [Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.NIDORINO, Pokemon.NIDORINA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.POISON
      },
      PURITY_FOREST_04F_07F: {
        id: 'PURITY_FOREST_04F_07F',
        name: 'Purity Forest',
        pokemons: [Pokemon.CELEBI, Pokemon.DARKRAI, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_13F_20F: {
        id: 'PURITY_FOREST_13F_20F',
        name: 'Purity Forest',
        pokemons: [Pokemon.CELEBI, Pokemon.DARKRAI, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_30F_43F: {
        id: 'PURITY_FOREST_30F_43F',
        name: 'Purity Forest',
        pokemons: [Pokemon.CELEBI, Pokemon.DARKRAI, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_44F_60F: {
        id: 'PURITY_FOREST_44F_60F',
        name: 'Purity Forest',
        pokemons: [Pokemon.CELEBI, Pokemon.DARKRAI, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_61F_79F: {
        id: 'PURITY_FOREST_61F_79F',
        name: 'Purity Forest',
        pokemons: [Pokemon.CELEBI, Pokemon.DARKRAI, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GRASS
      },
      PURITY_FOREST_80F_99F: {
        id: 'PURITY_FOREST_80F_99F',
        name: 'Purity Forest',
        pokemons: [Pokemon.CELEBI, Pokemon.DARKRAI, Pokemon.BULBASAUR, Pokemon.IVYSAUR, Pokemon.VENUSAUR, Pokemon.METAPOD, Pokemon.RATTATA, Pokemon.RATICATE, Pokemon.SPEAROW, Pokemon.NIDORANF, Pokemon.NIDORANM, Pokemon.VILEPLUME, Pokemon.BELLSPROUT, Pokemon.WEEPINBELL, Pokemon.VICTREEBEL, Pokemon.EXEGGCUTE, Pokemon.KOFFING, Pokemon.SCYTHER, Pokemon.CHIKORITA, Pokemon.BAYLEEF, Pokemon.MEGANIUM, Pokemon.TREECKO, Pokemon.GROVYLE, Pokemon.SCEPTILE, Pokemon.SEEDOT, Pokemon.NUZLEAF, Pokemon.ROSELIA, Pokemon.FLYGON, Pokemon.MUNCHLAX, Pokemon.TURTWIG, Pokemon.GROTLE, Pokemon.TORTERRA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GRASS
      },
      RESCUE_TEAM_MAZE: {
        id: 'RESCUE_TEAM_MAZE',
        name: 'Rescue Team Maze',
        pokemons: [Pokemon.PIDGEY, Pokemon.RATTATA, Pokemon.VOLTORB, Pokemon.EXEGGCUTE],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.NORMAL
      },
      ROCK_PATH: {
        id: 'ROCK_PATH',
        name: 'Rock Path',
        pokemons: [Pokemon.PIDGEOT, Pokemon.NIDORINA, Pokemon.NIDORINO, Pokemon.ZUBAT, Pokemon.NUMEL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.POISON
      },
      SILENT_CHASM: {
        id: 'SILENT_CHASM',
        name: 'Silent Chasm',
        pokemons: [Pokemon.FARFETCH, Pokemon.WEEDLE, Pokemon.YANMA, Pokemon.GLOOM, Pokemon.HOUNDOUR, Pokemon.POLIWAG, Pokemon.SPINARAK, Pokemon.TRAPINCH, Pokemon.BEEDRILL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.BUG
      },
      SILVER_TRENCH: {
        id: 'SILVER_TRENCH',
        name: 'Silver Trench',
        pokemons: [Pokemon.LUGIA, Pokemon.DEWGONG, Pokemon.SHELLDER, Pokemon.CORSOLA, Pokemon.KABUTO, Pokemon.AZUMARILL, Pokemon.SLOWPOKE, Pokemon.YANMA, Pokemon.TENTACRUEL, Pokemon.VOLTORB, Pokemon.SPEAROW, Pokemon.SEEDOT, Pokemon.GOLBAT, Pokemon.HOOTHOOT, Pokemon.WYNAUT, Pokemon.HOUNDOUR, Pokemon.WAILMER, Pokemon.MAGNETON, Pokemon.BEEDRILL, Pokemon.VULPIX, Pokemon.FERALIGATR, Pokemon.SPINARAK, Pokemon.SLUGMA, Pokemon.CHANSEY, Pokemon.KRABBY, Pokemon.MAGMAR],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      SINISTER_WOODS: {
        id: 'SINISTER_WOODS',
        name: 'Sinister Woods',
        pokemons: [Pokemon.SWINUB, Pokemon.ODDISH, Pokemon.SUDOWOODO, Pokemon.SENTRET, Pokemon.SHROOMISH, Pokemon.WOOPER, Pokemon.SCYTHER, Pokemon.HOOTHOOT, Pokemon.SLAKOTH, Pokemon.EKANS, Pokemon.GENGAR, Pokemon.MEDICHAM],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.BUG
      },
      SKY_TOWER: {
        id: 'SKY_TOWER',
        name: 'Sky Tower',
        pokemons: [Pokemon.SHEDNINJA, Pokemon.SHUPPET, Pokemon.LUNATONE, Pokemon.RAYQUAZA, Pokemon.DUSKULL, Pokemon.KOFFING, Pokemon.ALTARIA, Pokemon.SOLROCK, Pokemon.SCIZOR, Pokemon.DUSCLOPS, Pokemon.FLYGON, Pokemon.TROPIUS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.FLYING
      },
      SNOW_PATH: {
        id: 'SNOW_PATH',
        name: 'Snow Path',
        pokemons: [Pokemon.AZURILL, Pokemon.FURRET, Pokemon.NOSEPASS],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.ICE
      },
      SOLAR_CAVE: {
        id: 'SOLAR_CAVE',
        name: 'Solar Cave',
        pokemons: [Pokemon.WYNAUT, Pokemon.GIRAFARIG, Pokemon.BELDUM, Pokemon.DROWZEE, Pokemon.SPOINK, Pokemon.ABRA, Pokemon.MEDITITE, Pokemon.LUNATONE, Pokemon.METANG, Pokemon.HYPNO, Pokemon.KIRLIA, Pokemon.KADABRA, Pokemon.MEDICHAM, Pokemon.GRUMPIG, Pokemon.CLAYDOL],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      SOUTHERN_CAVERN_01F_23F: {
        id: 'SOUTHERN_CAVERN_01F_23F',
        name: 'Southern Cavern',
        pokemons: [Pokemon.GEODUDE, Pokemon.DIGLETT, Pokemon.SEEDOT, Pokemon.CUBONE, Pokemon.NIDOKING, Pokemon.PHANPY, Pokemon.VIBRAVA, Pokemon.BALTOY, Pokemon.LARVITAR, Pokemon.ARIADOS, Pokemon.DUGTRIO, Pokemon.MAROWAK, Pokemon.GRAVELER, Pokemon.RHYHORN, Pokemon.FLYGON, Pokemon.DONPHAN, Pokemon.PUPITAR, Pokemon.GOLEM, Pokemon.ONIX, Pokemon.RHYDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.GROUND
      },
      SOUTHERN_CAVERN_24F_50F: {
        id: 'SOUTHERN_CAVERN_24F_50F',
        name: 'Southern Cavern',
        pokemons: [Pokemon.GEODUDE, Pokemon.DIGLETT, Pokemon.SEEDOT, Pokemon.CUBONE, Pokemon.NIDOKING, Pokemon.PHANPY, Pokemon.VIBRAVA, Pokemon.BALTOY, Pokemon.LARVITAR, Pokemon.ARIADOS, Pokemon.DUGTRIO, Pokemon.MAROWAK, Pokemon.GRAVELER, Pokemon.RHYHORN, Pokemon.FLYGON, Pokemon.DONPHAN, Pokemon.PUPITAR, Pokemon.GOLEM, Pokemon.ONIX, Pokemon.RHYDON],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.GROUND
      },
      STORMY_SEA_01F_16F: {
        id: 'STORMY_SEA_01F_16F',
        name: 'Stormy Sea',
        pokemons: [Pokemon.WINGULL, Pokemon.TENTACRUEL, Pokemon.TENTACOOL, Pokemon.SHELLDER, Pokemon.OMANYTE, Pokemon.OMASTAR, Pokemon.SLOWPOKE, Pokemon.SPHEAL, Pokemon.OMASTAR, Pokemon.GRIMER, Pokemon.KABUTOPS, Pokemon.ARMALDO, Pokemon.SEADRA, Pokemon.STARMIE, Pokemon.SEALEO, Pokemon.KYOGRE, Pokemon.CARVANHA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      STORMY_SEA_16F_39F: {
        id: 'STORMY_SEA_16F_39F',
        name: 'Stormy Sea',
        pokemons: [Pokemon.WINGULL, Pokemon.TENTACRUEL, Pokemon.TENTACOOL, Pokemon.SHELLDER, Pokemon.OMANYTE, Pokemon.OMASTAR, Pokemon.SLOWPOKE, Pokemon.SPHEAL, Pokemon.OMASTAR, Pokemon.GRIMER, Pokemon.KABUTOPS, Pokemon.ARMALDO, Pokemon.SEADRA, Pokemon.STARMIE, Pokemon.SEALEO, Pokemon.KYOGRE, Pokemon.CARVANHA],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.WATER],
        type: Synergy.WATER
      },
      THUNDERWAVE_CAVE: {
        id: 'THUNDERWAVE_CAVE',
        name: 'Thunderwave Cave',
        pokemons: [Pokemon.RATTATA, Pokemon.NIDORANM, Pokemon.POOCHYENA, Pokemon.VOLTORB, Pokemon.ELEKID, Pokemon.PLUSLE, Pokemon.MINUN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.ELECTRIC
      },
      TINY_WOODS: {
        id: 'TINY_WOODS',
        name: 'Tiny Woods',
        pokemons: [Pokemon.RATTATA, Pokemon.RATTATA, Pokemon.SANDSHREW, Pokemon.SPINARAK],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.NORMAL
      },
      UPROAR_FOREST: {
        id: 'UPROAR_FOREST',
        name: 'Uproar Forest',
        pokemons: [Pokemon.ROSELIA, Pokemon.NUZLEAF, Pokemon.LOTAD, Pokemon.RATICATE, Pokemon.GRIMER, Pokemon.NOCTOWL, Pokemon.KOFFING],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.WATER],
        type: Synergy.GRASS
      },
      SERENITY_RIVER: {
        id: 'SERENITY_RIVER',
        name: 'Serenity River',
        pokemons: [Pokemon.POLIWAG, Pokemon.WOOPER, Pokemon.LOTAD, Pokemon.BARBOACH, Pokemon.MASQUERAIN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.WATER
      },
      WATERFALL_POND: {
        id: 'WATERFALL_POND',
        name: 'Waterfall Pond',
        pokemons: [Pokemon.MUDKIP, Pokemon.LOTAD, Pokemon.POLIWAG, Pokemon.BARBOACH, Pokemon.WOOPER, Pokemon.TOTODILE, Pokemon.SURSKIT, Pokemon.MAGIKARP, Pokemon.SQUIRTLE, Pokemon.LOMBRE, Pokemon.MARSHTOMP, Pokemon.WHISCASH, Pokemon.MASQUERAIN],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.WATER
      },
      WESTERN_CAVE_B01F_B27F: {
        id: 'WESTERN_CAVE_B01F_B27F',
        name: 'Western Cave',
        pokemons: [Pokemon.MURKROW, Pokemon.BUTTERFREE, Pokemon.EKANS, Pokemon.MEOWTH, Pokemon.BELLOSSOM, Pokemon.EXPLOUD, Pokemon.IGGLYBUFF, Pokemon.TAUROS, Pokemon.MILTANK, Pokemon.ESPEON, Pokemon.IVYSAUR, Pokemon.ARBOK, Pokemon.AGGRON, Pokemon.PERSIAN, Pokemon.DODRIO, Pokemon.BAYLEEF, Pokemon.ALAKAZAM, Pokemon.TYRANITAR, Pokemon.SCEPTILE, Pokemon.ARCANINE, Pokemon.SWAMPERT, Pokemon.MACHAMP, Pokemon.STEELIX, Pokemon.CHARIZARD, Pokemon.BLASTOISE, Pokemon.MEWTWO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WESTERN_CAVE_B28F_B39F: {
        id: 'WESTERN_CAVE_B28F_B39F',
        name: 'Western Cave',
        pokemons: [Pokemon.MURKROW, Pokemon.BUTTERFREE, Pokemon.EKANS, Pokemon.MEOWTH, Pokemon.BELLOSSOM, Pokemon.EXPLOUD, Pokemon.IGGLYBUFF, Pokemon.TAUROS, Pokemon.MILTANK, Pokemon.ESPEON, Pokemon.IVYSAUR, Pokemon.ARBOK, Pokemon.AGGRON, Pokemon.PERSIAN, Pokemon.DODRIO, Pokemon.BAYLEEF, Pokemon.ALAKAZAM, Pokemon.TYRANITAR, Pokemon.SCEPTILE, Pokemon.ARCANINE, Pokemon.SWAMPERT, Pokemon.MACHAMP, Pokemon.STEELIX, Pokemon.CHARIZARD, Pokemon.BLASTOISE, Pokemon.MEWTWO],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WISH_CAVE_01F_13F: {
        id: 'WISH_CAVE_01F_13F',
        name: 'Wish Cave',
        pokemons: [Pokemon.MURKROW, Pokemon.BUTTERFREE, Pokemon.EKANS, Pokemon.MEOWTH, Pokemon.BELLOSSOM, Pokemon.EXPLOUD, Pokemon.IGGLYBUFF, Pokemon.TAUROS, Pokemon.MILTANK, Pokemon.ESPEON, Pokemon.IVYSAUR, Pokemon.ARBOK, Pokemon.AGGRON, Pokemon.PERSIAN, Pokemon.DODRIO, Pokemon.BAYLEEF, Pokemon.ALAKAZAM, Pokemon.TYRANITAR, Pokemon.SCEPTILE, Pokemon.ARCANINE, Pokemon.SWAMPERT, Pokemon.MACHAMP, Pokemon.STEELIX, Pokemon.CHARIZARD, Pokemon.BLASTOISE, Pokemon.JIRACHI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WISH_CAVE_90F_99F: {
        id: 'WISH_CAVE_90F_99F',
        name: 'Wish Cave',
        pokemons: [Pokemon.MURKROW, Pokemon.BUTTERFREE, Pokemon.EKANS, Pokemon.MEOWTH, Pokemon.BELLOSSOM, Pokemon.EXPLOUD, Pokemon.IGGLYBUFF, Pokemon.TAUROS, Pokemon.MILTANK, Pokemon.ESPEON, Pokemon.IVYSAUR, Pokemon.ARBOK, Pokemon.AGGRON, Pokemon.PERSIAN, Pokemon.DODRIO, Pokemon.BAYLEEF, Pokemon.ALAKAZAM, Pokemon.TYRANITAR, Pokemon.SCEPTILE, Pokemon.ARCANINE, Pokemon.SWAMPERT, Pokemon.MACHAMP, Pokemon.STEELIX, Pokemon.CHARIZARD, Pokemon.BLASTOISE, Pokemon.JIRACHI],
        tileset: [HDR.WALL, HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.GROUND, HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.WATER],
        type: Synergy.PSYCHIC
      },
      WYVERN_HILL: {
        id: 'WYVERN_HILL',
        name: 'Wyvern Hill',
        pokemons: [Pokemon.BAGON, Pokemon.DRATINI, Pokemon.ALTARIA, Pokemon.TOTODILE, Pokemon.LUDICOLO, Pokemon.SHELGON, Pokemon.VIBRAVA, Pokemon.DRAGONAIR, Pokemon.SALAMENCE, Pokemon.FLYGON, Pokemon.DRAGONITE],
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