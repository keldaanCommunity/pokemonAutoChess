import { Ability } from "../../types/enum/Ability"
import { EffectConfigs } from "./effects"
import { ZMoves } from "../../types/enum/ZMoves"

const unownSTidalWaveLevel = 2
const tidalWave = EffectConfigs.TIDAL_WAVE

export const AbilityConfigs = {
  [Ability.MIST_BALL]: {
    returnDelay: 1000
  },
  [Ability.LUSTER_PURGE]: {
    returnDelay: 1000
  },
  [Ability.FIERY_DANCE]: {
    chargeDuration: 600,
    flightDuration: 300
  },
  [Ability.DYNAMAX_CANNON]: {
    chargeDuration: 600,
    beamDuration: 350,
    fadeDuration: 200
  },
  [Ability.HYPER_BEAM]: {
    chargeDuration: 1000
  },
  [Ability.HIDDEN_POWER_S]: {
    tidalWaveLevel: unownSTidalWaveLevel,
    healingPercent: unownSTidalWaveLevel * tidalWave.healingPercentPerLevel,
    damagePercent: unownSTidalWaveLevel * tidalWave.damagePercentPerLevel
  },
  [Ability.STICKY_WEB]: EffectConfigs.STICKY_WEB
} satisfies Partial<Record<Ability, Readonly<Record<string, number>>>>

export const InimitableAbilities: Ability[] = [
  Ability.ASSIST,
  Ability.AURA_WHEEL,
  Ability.DARK_AURA,
  Ability.ENCORE,
  Ability.HIDDEN_POWER_A,
  Ability.HIDDEN_POWER_B,
  Ability.HIDDEN_POWER_C,
  Ability.HIDDEN_POWER_D,
  Ability.HIDDEN_POWER_E,
  Ability.HIDDEN_POWER_EM,
  Ability.HIDDEN_POWER_F,
  Ability.HIDDEN_POWER_G,
  Ability.HIDDEN_POWER_H,
  Ability.HIDDEN_POWER_I,
  Ability.HIDDEN_POWER_J,
  Ability.HIDDEN_POWER_K,
  Ability.HIDDEN_POWER_L,
  Ability.HIDDEN_POWER_M,
  Ability.HIDDEN_POWER_N,
  Ability.HIDDEN_POWER_O,
  Ability.HIDDEN_POWER_P,
  Ability.HIDDEN_POWER_Q,
  Ability.HIDDEN_POWER_QM,
  Ability.HIDDEN_POWER_R,
  Ability.HIDDEN_POWER_S,
  Ability.HIDDEN_POWER_T,
  Ability.HIDDEN_POWER_U,
  Ability.HIDDEN_POWER_V,
  Ability.HIDDEN_POWER_W,
  Ability.HIDDEN_POWER_X,
  Ability.HIDDEN_POWER_Y,
  Ability.HIDDEN_POWER_Z,
  Ability.KNOWLEDGE_THIEF,
  Ability.MAGNET_PULL,
  Ability.METRONOME,
  Ability.MIMIC,
  Ability.ORDER_UP,
  Ability.REVELATION_DANCE,
  Ability.SHADOW_FORCE,
  Ability.SKETCH,
  Ability.SKILL_SWAP,
  Ability.SWARM,
  Ability.TRANSE,
  Ability.UNBOUND,
  Ability.TERA_SHIFT,
  ...ZMoves
]
