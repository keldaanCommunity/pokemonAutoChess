export type ScalingEffectValue = Readonly<
  {
    apScaling?: number
    luckScaling?: boolean
    nbDecimals?: number
  } & (
    | { value: number; valuePerTier?: undefined }
    | { value?: number; valuePerTier: readonly number[] }
  )
>

export type EffectValue = number | ScalingEffectValue
export type EffectConfig = Readonly<Record<string, EffectValue>>
