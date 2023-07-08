import { Effect } from "./Effect"

export enum Synergy {
  NORMAL = "NORMAL",
  GRASS = "GRASS",
  FIRE = "FIRE",
  WATER = "WATER",
  ELECTRIC = "ELECTRIC",
  FIGHTING = "FIGHTING",
  PSYCHIC = "PSYCHIC",
  DARK = "DARK",
  STEEL = "STEEL",
  GROUND = "GROUND",
  POISON = "POISON",
  DRAGON = "DRAGON",
  FIELD = "FIELD",
  MONSTER = "MONSTER",
  HUMAN = "HUMAN",
  AQUATIC = "AQUATIC",
  BUG = "BUG",
  FLYING = "FLYING",
  FLORA = "FLORA",
  ROCK = "ROCK",
  GHOST = "GHOST",
  FAIRY = "FAIRY",
  ICE = "ICE",
  FOSSIL = "FOSSIL",
  SOUND = "SOUND",
  ARTIFICIAL = "ARTIFICIAL",
  BABY = "BABY"
}

export const SynergyEffects: { [key in Synergy]: Effect[] } = Object.freeze({
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
  [Synergy.ELECTRIC]: [Effect.RISING_VOLTAGE, Effect.OVERDRIVE],
  [Synergy.FIGHTING]: [Effect.GUTS, Effect.DEFIANT, Effect.JUSTIFIED],
  [Synergy.PSYCHIC]: [Effect.AMNESIA, Effect.LIGHT_SCREEN, Effect.EERIE_SPELL],
  [Synergy.DARK]: [Effect.HONE_CLAWS, Effect.ASSURANCE, Effect.BEAT_UP],
  [Synergy.STEEL]: [Effect.IRON_DEFENSE, Effect.AUTOMATE, Effect.STEEL_SURGE],
  [Synergy.GROUND]: [Effect.TILLER, Effect.DIGGER, Effect.DRILLER],
  [Synergy.POISON]: [Effect.POISONOUS, Effect.VENOMOUS, Effect.TOXIC],
  [Synergy.DRAGON]: [
    Effect.DRAGON_ENERGY,
    Effect.DRAGON_SCALES,
    Effect.DRAGON_DANCE
  ],
  [Synergy.FIELD]: [Effect.BULK_UP, Effect.RAGE, Effect.ANGER_POINT],
  [Synergy.MONSTER]: [Effect.PURSUIT, Effect.BRUTAL_SWING, Effect.POWER_TRIP],
  [Synergy.HUMAN]: [Effect.MEDITATE, Effect.FOCUS_ENERGY, Effect.CALM_MIND],
  [Synergy.AQUATIC]: [Effect.SWIFT_SWIM, Effect.HYDRATION, Effect.WATER_VEIL],
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
  [Synergy.ROCK]: [
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
  [Synergy.ICE]: [Effect.FROSTY, Effect.SHEER_COLD],
  [Synergy.FOSSIL]: [
    Effect.ANCIENT_POWER,
    Effect.ELDER_POWER,
    Effect.FORGOTTEN_POWER
  ],
  [Synergy.SOUND]: [Effect.LARGO, Effect.ALLEGRO, Effect.PRESTO],
  [Synergy.ARTIFICIAL]: [
    Effect.DUBIOUS_DISC,
    Effect.LINK_CABLE,
    Effect.GOOGLE_SPECS
  ],
  [Synergy.BABY]: [Effect.HATCHER, Effect.BREEDER]
})
