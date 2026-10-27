import { EffectEnum } from "../../types/enum/Effect"
import { Passive } from "../../types/enum/Passive"
import { EffectConfigs } from "./effects"
import { StatusConfigs } from "./statuses"

export const PassiveConfigs = {
  [Passive.ELECTRIC_TERRAIN]: StatusConfigs.ELECTRIC_FIELD,
  [Passive.GRASSY_TERRAIN]: StatusConfigs.GRASS_FIELD,
  [Passive.MISTY_TERRAIN]: StatusConfigs.FAIRY_FIELD,
  [Passive.PSYCHIC_TERRAIN]: StatusConfigs.PSYCHIC_FIELD,
  [Passive.TADBULB]: EffectConfigs[EffectEnum.SUPERCHARGE]
} satisfies Partial<Record<Passive, Readonly<Record<string, number>>>>
