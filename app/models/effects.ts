import { MapSchema, SetSchema } from "@colyseus/schema"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { SynergyTriggers } from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { Effect } from "../types/enum/Effect"
import { Synergy } from "../types/enum/Synergy"
import { isOnBench } from "../utils/board"
import Synergies from "./colyseus-models/synergies"

export class Effects extends SetSchema<Effect> {
  update(synergies: Synergies, board: MapSchema<Pokemon>) {
    this.clear()
    ;(Object.values(Synergy) as Synergy[]).forEach((synergy) => {
      for (let i = SynergyTriggers[synergy].length; i >= 0; i--) {
        const v = SynergyTriggers[synergy][i]
        const s = synergies.get(synergy)
        if (s && s >= v) {
          this.add(SynergyEffects[synergy][i])
          break
        }
      }
    })

    board.forEach((p) => {
      if (!isOnBench(p)) {
        if (p.skill === Ability.GRASSY_SURGE) {
          this.add(Effect.GRASSY_TERRAIN)
        }
        if (p.skill === Ability.MISTY_SURGE) {
          this.add(Effect.MISTY_TERRAIN)
        }
        if (p.skill === Ability.ELECTRIC_SURGE) {
          this.add(Effect.ELECTRIC_TERRAIN)
        }
        if (p.skill === Ability.PSYCHIC_SURGE) {
          this.add(Effect.PSYCHIC_TERRAIN)
        }
      }
    })
  }
}

export const SynergyEffects: { [key in Synergy]: readonly Effect[] } = {
  [Synergy.NORMAL]: [
    Effect.STAMINA,
    Effect.STRENGTH,
    Effect.ENDURE,
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
    Effect.RISING_VOLTAGE,
    Effect.OVERDRIVE,
    Effect.POWER_SURGE
  ],
  [Synergy.FIGHTING]: [
    Effect.GUTS,
    Effect.STURDY,
    Effect.DEFIANT,
    Effect.JUSTIFIED
  ],
  [Synergy.PSYCHIC]: [Effect.AMNESIA, Effect.LIGHT_SCREEN, Effect.EERIE_SPELL],
  [Synergy.DARK]: [Effect.HONE_CLAWS, Effect.ASSURANCE, Effect.BEAT_UP],
  [Synergy.STEEL]: [
    Effect.STEEL_SURGE,
    Effect.STEEL_SPIKE,
    Effect.CORKSCREW_CRASH,
    Effect.MAX_MELTDOWN
  ],
  [Synergy.GROUND]: [
    Effect.TILLER,
    Effect.DIGGER,
    Effect.DRILLER,
    Effect.DEEP_MINER
  ],
  [Synergy.POISON]: [Effect.POISONOUS, Effect.VENOMOUS, Effect.TOXIC],
  [Synergy.DRAGON]: [
    Effect.DRAGON_ENERGY,
    Effect.DRAGON_SCALES,
    Effect.DRAGON_DANCE
  ],
  [Synergy.FIELD]: [Effect.BULK_UP, Effect.RAGE, Effect.ANGER_POINT],
  [Synergy.MONSTER]: [
    Effect.PURSUIT,
    Effect.BRUTAL_SWING,
    Effect.POWER_TRIP,
    Effect.MERCILESS
  ],
  [Synergy.HUMAN]: [Effect.MEDITATE, Effect.FOCUS_ENERGY, Effect.CALM_MIND],
  [Synergy.AQUATIC]: [Effect.SWIFT_SWIM, Effect.HYDRATION, Effect.WATER_VEIL],
  [Synergy.BUG]: [
    Effect.COCOON,
    Effect.INFESTATION,
    Effect.HORDE,
    Effect.HEART_OF_THE_SWARM
  ],
  [Synergy.FLYING]: [
    Effect.TAILWIND,
    Effect.FEATHER_DANCE,
    Effect.MAX_AIRSTREAM,
    Effect.SKYDIVE
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
    Effect.CURSE_OF_VULNERABILITY,
    Effect.CURSE_OF_WEAKNESS,
    Effect.CURSE_OF_TORMENT,
    Effect.CURSE_OF_FATE
  ],
  [Synergy.FAIRY]: [
    Effect.AROMATIC_MIST,
    Effect.FAIRY_WIND,
    Effect.STRANGE_STEAM,
    Effect.MOON_FORCE
  ],
  [Synergy.ICE]: [
    Effect.CHILLY,
    Effect.FROSTY,
    Effect.FREEZING,
    Effect.SHEER_COLD
  ],
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
  [Synergy.BABY]: [Effect.HATCHER, Effect.BREEDER, Effect.GOLDEN_EGGS],
  [Synergy.LIGHT]: [
    Effect.SHINING_RAY,
    Effect.LIGHT_PULSE,
    Effect.ETERNAL_LIGHT,
    Effect.MAX_ILLUMINATION
  ],
  [Synergy.WILD]: [
    Effect.QUICK_FEET,
    Effect.RUN_AWAY,
    Effect.HUSTLE,
    Effect.BERSERK
  ],
  [Synergy.AMORPHOUS]: [Effect.FLUID, Effect.SHAPELESS, Effect.ETHEREAL],
  [Synergy.GOURMET]: [Effect.APPETIZER, Effect.LUNCH_BREAK, Effect.BANQUET]
} as const
