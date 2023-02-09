import { Effect } from "../enum/Effect"
import { Synergy } from "../enum/Synergy"

export const SynergyName: {
  [key in Synergy]: { eng: string; esp: string; fra: string }
} = {
  [Synergy.NORMAL]: {
    eng: "Normal",
    esp: "Normal",
    fra: "Normal"
  },
  [Synergy.GRASS]: {
    eng: "Grass",
    esp: "Planta",
    fra: "Feuille"
  },
  [Synergy.FIRE]: {
    eng: "Fire",
    esp: "Fuego",
    fra: "Feu"
  },
  [Synergy.WATER]: {
    eng: "Water",
    esp: "Agua",
    fra: "Eau"
  },
  [Synergy.ELECTRIC]: {
    eng: "Elec",
    esp: "Elec",
    fra: "Elec"
  },
  [Synergy.FIGHTING]: {
    eng: "Fighting",
    esp: "Lucha",
    fra: "Combat"
  },
  [Synergy.PSYCHIC]: {
    eng: "Psychic",
    esp: "Psiquico",
    fra: "Psy"
  },
  [Synergy.DARK]: {
    eng: "Dark",
    esp: "Siniestro",
    fra: "Ténèbres"
  },
  [Synergy.METAL]: {
    eng: "Steel",
    esp: "Acero",
    fra: "Acier"
  },
  [Synergy.GROUND]: {
    eng: "Ground",
    esp: "Tierra",
    fra: "Sol"
  },
  [Synergy.POISON]: {
    eng: "Poison",
    esp: "Veneno",
    fra: "Poison"
  },
  [Synergy.DRAGON]: {
    eng: "Dragon",
    esp: "Dragón",
    fra: "Dragon"
  },
  [Synergy.FIELD]: {
    eng: "Field",
    esp: "Campo",
    fra: "Terrestre"
  },
  [Synergy.MONSTER]: {
    eng: "Monster",
    esp: "Monstruo",
    fra: "Monstre"
  },
  [Synergy.HUMAN]: {
    eng: "Human",
    esp: "Humanoide",
    fra: "Humain"
  },
  [Synergy.AQUATIC]: {
    eng: "Aquatic",
    esp: "Acuático",
    fra: "Aquatique"
  },
  [Synergy.BUG]: {
    eng: "Bug",
    esp: "Bicho",
    fra: "Insecte"
  },
  [Synergy.FLYING]: {
    eng: "Flying",
    esp: "Volador",
    fra: "Vol"
  },
  [Synergy.FLORA]: {
    eng: "Flora",
    esp: "Flor",
    fra: "Fleur"
  },
  [Synergy.MINERAL]: {
    eng: "Rock",
    esp: "Roca",
    fra: "Minéral"
  },
  [Synergy.GHOST]: {
    eng: "Ghost",
    esp: "Fantasma",
    fra: "Fantome"
  },
  [Synergy.FAIRY]: {
    eng: "Fairy",
    esp: "Hada",
    fra: "Fée"
  },
  [Synergy.ICE]: {
    eng: "Ice",
    esp: "Hielo",
    fra: "Glace"
  },
  [Synergy.FOSSIL]: {
    eng: "Fossil",
    esp: "Fossil",
    fra: "Fossile"
  },
  [Synergy.SOUND]: {
    eng: "Sound",
    esp: "Sound",
    fra: "Sound"
  },
  [Synergy.ARTIFICIAL]: {
    eng: "Artificial",
    esp: "Artificial",
    fra: "Artificial"
  }
}

export const SynergyDetail: { [key in Synergy]: Effect[] } = Object.freeze({
  [Synergy.NORMAL]: [
    Effect.STAMINA,
    Effect.STRENGTH,
    Effect.ROCK_SMASH,
    Effect.PURE_POWER
  ],
  [Synergy.GRASS]: [Effect.INGRAIN, Effect.GROWTH, Effect.SPORE],
  [Synergy.FIRE]: [
    Effect.BLAZE,
    Effect.VICTORY_STAR,
    Effect.DROUGHT,
    Effect.DESOLATE_LAND
  ],
  [Synergy.WATER]: [Effect.RAIN_DANCE, Effect.DRIZZLE, Effect.PRIMORDIAL_SEA],
  [Synergy.ELECTRIC]: [
    Effect.EERIE_IMPULSE,
    Effect.RISING_VOLTAGE,
    Effect.OVERDRIVE
  ],
  [Synergy.FIGHTING]: [Effect.GUTS, Effect.DEFIANT, Effect.JUSTIFIED],
  [Synergy.PSYCHIC]: [Effect.AMNESIA, Effect.LIGHT_SCREEN, Effect.EERIE_SPELL],
  [Synergy.DARK]: [Effect.HONE_CLAWS, Effect.ASSURANCE, Effect.BEAT_UP],
  [Synergy.METAL]: [Effect.IRON_DEFENSE, Effect.AUTOTOMIZE],
  [Synergy.GROUND]: [Effect.SHORE_UP, Effect.ROTOTILLER, Effect.SANDSTORM],
  [Synergy.POISON]: [Effect.POISON_GAS, Effect.TOXIC],
  [Synergy.DRAGON]: [Effect.DRAGON_ENERGY, Effect.DRAGON_DANCE],
  [Synergy.FIELD]: [Effect.BULK_UP, Effect.RAGE, Effect.ANGER_POINT],
  [Synergy.MONSTER]: [Effect.PURSUIT, Effect.BRUTAL_SWING, Effect.POWER_TRIP],
  [Synergy.HUMAN]: [Effect.MEDITATE, Effect.FOCUS_ENERGY, Effect.CALM_MIND],
  [Synergy.AQUATIC]: [Effect.SWIFT_SWIM, Effect.HYDRO_CANNON],
  [Synergy.BUG]: [Effect.INFESTATION, Effect.HORDE, Effect.HEART_OF_THE_SWARM],
  [Synergy.FLYING]: [
    Effect.TAILWIND,
    Effect.FEATHER_DANCE,
    Effect.MAX_AIRSTREAM,
    Effect.MAX_GUARD
  ],
  [Synergy.FLORA]: [
    Effect.ODD_FLOWER,
    Effect.GLOOM_FLOWER,
    Effect.VILE_FLOWER,
    Effect.SUN_FLOWER
  ],
  [Synergy.MINERAL]: [
    Effect.BATTLE_ARMOR,
    Effect.MOUTAIN_RESISTANCE,
    Effect.DIAMOND_STORM
  ],
  [Synergy.GHOST]: [
    Effect.PHANTOM_FORCE,
    Effect.CURSE,
    Effect.SHADOW_TAG,
    Effect.WANDERING_SPIRIT
  ],
  [Synergy.FAIRY]: [
    Effect.AROMATIC_MIST,
    Effect.FAIRY_WIND,
    Effect.STRANGE_STEAM
  ],
  [Synergy.ICE]: [Effect.SNOW, Effect.SHEER_COLD],
  [Synergy.FOSSIL]: [
    Effect.ANCIENT_POWER,
    Effect.ELDER_POWER,
    Effect.UNOWN_GATHERINGS,
    Effect.SCIENCE_MUSEUM
  ],
  [Synergy.SOUND]: [Effect.LARGO, Effect.ALLEGRO, Effect.PRESTO],
  [Synergy.ARTIFICIAL]: [
    Effect.DUBIOUS_DISC,
    Effect.LINK_CABLE,
    Effect.GOOGLE_SPECS
  ]
})
