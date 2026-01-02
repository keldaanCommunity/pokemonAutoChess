import { MapSchema, SetSchema } from "@colyseus/schema"
import { SynergyTriggers } from "../config"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { Ability } from "../types/enum/Ability"
import { EffectEnum } from "../types/enum/Effect"
import { Pkm } from "../types/enum/Pokemon"
import { Synergy, SynergyArray } from "../types/enum/Synergy"
import { isOnBench } from "../utils/board"
import { values } from "../utils/schemas"
import Synergies from "./colyseus-models/synergies"

export class Effects extends SetSchema<EffectEnum> {
  update(synergies: Synergies, board: MapSchema<Pokemon>) {
    this.clear()
    SynergyArray.forEach((synergy) => {
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
          this.add(EffectEnum.GRASSY_TERRAIN)
        }
        if (p.skill === Ability.MISTY_SURGE) {
          this.add(EffectEnum.MISTY_TERRAIN)
        }
        if (p.skill === Ability.ELECTRIC_SURGE) {
          this.add(EffectEnum.ELECTRIC_TERRAIN)
        }
        if (p.skill === Ability.PSYCHIC_SURGE) {
          this.add(EffectEnum.PSYCHIC_TERRAIN)
        }
      }

      if (p.name === Pkm.FALINKS_BRASS) {
        const nbTroopers = values(board).filter(
          (p) => p.name === Pkm.FALINKS_TROOPER
        ).length
        if (nbTroopers < 6) this.add(EffectEnum.FALINKS_BRASS)
        else this.delete(EffectEnum.FALINKS_BRASS)
      }
    })
  }
}

export const SynergyEffects: { [key in Synergy]: readonly EffectEnum[] } = {
  [Synergy.NORMAL]: [
    EffectEnum.STAMINA,
    EffectEnum.STRENGTH,
    EffectEnum.ENDURE,
    EffectEnum.PURE_POWER
  ],
  [Synergy.GRASS]: [EffectEnum.INGRAIN, EffectEnum.GROWTH, EffectEnum.SPORE],
  [Synergy.FIRE]: [
    EffectEnum.FLAME_BODY,
    EffectEnum.WILDFIRE,
    EffectEnum.BLAZE,
    EffectEnum.DESOLATE_LAND
  ],
  [Synergy.WATER]: [
    EffectEnum.RAIN_DANCE,
    EffectEnum.DRIZZLE,
    EffectEnum.PRIMORDIAL_SEA
  ],
  [Synergy.ELECTRIC]: [
    EffectEnum.RISING_VOLTAGE,
    EffectEnum.POWER_SURGE,
    EffectEnum.SUPERCHARGED
  ],
  [Synergy.FIGHTING]: [
    EffectEnum.GUTS,
    EffectEnum.STURDY,
    EffectEnum.DEFIANT,
    EffectEnum.JUSTIFIED
  ],
  [Synergy.PSYCHIC]: [
    EffectEnum.AMNESIA,
    EffectEnum.LIGHT_SCREEN,
    EffectEnum.EERIE_SPELL
  ],
  [Synergy.DARK]: [
    EffectEnum.HONE_CLAWS,
    EffectEnum.ASSURANCE,
    EffectEnum.BEAT_UP
  ],
  [Synergy.STEEL]: [
    EffectEnum.STEEL_SURGE,
    EffectEnum.STEEL_SPIKE,
    EffectEnum.CORKSCREW_CRASH,
    EffectEnum.MAX_MELTDOWN
  ],
  [Synergy.GROUND]: [
    EffectEnum.TILLER,
    EffectEnum.DIGGER,
    EffectEnum.DRILLER,
    EffectEnum.DEEP_MINER
  ],
  [Synergy.POISON]: [
    EffectEnum.POISONOUS,
    EffectEnum.VENOMOUS,
    EffectEnum.TOXIC
  ],
  [Synergy.DRAGON]: [
    EffectEnum.DRAGON_ENERGY,
    EffectEnum.DRAGON_SCALES,
    EffectEnum.DRAGON_DANCE
  ],
  [Synergy.FIELD]: [
    EffectEnum.BULK_UP,
    EffectEnum.RAGE,
    EffectEnum.ANGER_POINT
  ],
  [Synergy.MONSTER]: [
    EffectEnum.PURSUIT,
    EffectEnum.BRUTAL_SWING,
    EffectEnum.POWER_TRIP,
    EffectEnum.MERCILESS
  ],
  [Synergy.HUMAN]: [
    EffectEnum.MEDITATE,
    EffectEnum.FOCUS_ENERGY,
    EffectEnum.CALM_MIND
  ],
  [Synergy.AQUATIC]: [
    EffectEnum.SWIFT_SWIM,
    EffectEnum.HYDRATION,
    EffectEnum.WATER_VEIL,
    EffectEnum.SURGE_SURFER
  ],
  [Synergy.BUG]: [
    EffectEnum.COCOON,
    EffectEnum.INFESTATION,
    EffectEnum.HORDE,
    EffectEnum.HEART_OF_THE_SWARM
  ],
  [Synergy.FLYING]: [
    EffectEnum.TAILWIND,
    EffectEnum.FEATHER_DANCE,
    EffectEnum.MAX_AIRSTREAM,
    EffectEnum.SKYDIVE
  ],
  [Synergy.FLORA]: [
    EffectEnum.COTTONWEED,
    EffectEnum.FLYCATCHER,
    EffectEnum.FRAGRANT,
    EffectEnum.FLOWER_POWER
  ],
  [Synergy.ROCK]: [
    EffectEnum.BATTLE_ARMOR,
    EffectEnum.MOUTAIN_RESISTANCE,
    EffectEnum.DIAMOND_STORM
  ],
  [Synergy.GHOST]: [
    EffectEnum.CURSE_OF_VULNERABILITY,
    EffectEnum.CURSE_OF_WEAKNESS,
    EffectEnum.CURSE_OF_TORMENT,
    EffectEnum.CURSE_OF_FATE
  ],
  [Synergy.FAIRY]: [
    EffectEnum.AROMATIC_MIST,
    EffectEnum.FAIRY_WIND,
    EffectEnum.STRANGE_STEAM,
    EffectEnum.MOON_FORCE
  ],
  [Synergy.ICE]: [
    EffectEnum.CHILLY,
    EffectEnum.FROSTY,
    EffectEnum.FREEZING,
    EffectEnum.SHEER_COLD
  ],
  [Synergy.FOSSIL]: [
    EffectEnum.ANCIENT_POWER,
    EffectEnum.ELDER_POWER,
    EffectEnum.FORGOTTEN_POWER
  ],
  [Synergy.SOUND]: [EffectEnum.LARGO, EffectEnum.ALLEGRO, EffectEnum.PRESTO],
  [Synergy.ARTIFICIAL]: [
    EffectEnum.DUBIOUS_DISC,
    EffectEnum.LINK_CABLE,
    EffectEnum.GOOGLE_SPECS
  ],
  [Synergy.BABY]: [
    EffectEnum.HATCHER,
    EffectEnum.BREEDER,
    EffectEnum.GOLDEN_EGGS
  ],
  [Synergy.LIGHT]: [
    EffectEnum.SHINING_RAY,
    EffectEnum.LIGHT_PULSE,
    EffectEnum.ETERNAL_LIGHT,
    EffectEnum.MAX_ILLUMINATION
  ],
  [Synergy.WILD]: [
    EffectEnum.QUICK_FEET,
    EffectEnum.RUN_AWAY,
    EffectEnum.HUSTLE,
    EffectEnum.BERSERK
  ],
  [Synergy.AMORPHOUS]: [
    EffectEnum.FLUID,
    EffectEnum.SHAPELESS,
    EffectEnum.ETHEREAL
  ],
  [Synergy.GOURMET]: [
    EffectEnum.APPETIZER,
    EffectEnum.LUNCH_BREAK,
    EffectEnum.BANQUET
  ]
} as const
