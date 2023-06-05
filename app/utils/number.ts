export const clamp = (num: number, min: number, max: number): number =>
  Math.min(Math.max(num, min), max)

export const roundTo2Digits = (value: number) => parseFloat(value.toFixed(2))
