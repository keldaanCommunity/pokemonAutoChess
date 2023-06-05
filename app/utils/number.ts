export const min = (minimum: number) => (value: number): number => Math.max(minimum, value)
export const max = (maximum: number) => (value: number): number => Math.min(maximum, value)

export const clamp = (num: number, min: number, max: number): number =>
  Math.min(Math.max(num, min), max)

export const roundTo2Digits = (value: number) => parseFloat(value.toFixed(2))

export const average = (...values: number[]): number => {
  const sum = values.reduce((a, b) => a + b, 0)
  return sum / values.length
}