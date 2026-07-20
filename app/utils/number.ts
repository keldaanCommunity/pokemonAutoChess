export const min =
  (minimum: number) =>
  (value: number): number =>
    Math.max(minimum, value)
export const max =
  (maximum: number) =>
  (value: number): number =>
    Math.min(maximum, value)

export const clamp = (num: number, min: number, max: number): number =>
  Math.min(Math.max(num, min), max)

export const isBetween = (a: number, b: number) => (value: number) =>
  a < b ? value >= a && value <= b : value >= b && value <= a

export const roundToNDigits = (
  value: number,
  nbDigits = 2,
  mode: "up" | "down" | "closest" = "closest"
): number => {
  const factor = 10 ** nbDigits
  const scaled = value * factor

  const rounded =
    mode === "up"
      ? Math.ceil(scaled)
      : mode === "down"
        ? Math.floor(scaled)
        : Math.round(scaled)

  return rounded / factor
}

export const average = (...values: number[]): number => {
  const sum = values.reduce((a, b) => a + b, 0)
  return sum / values.length
}

export const fpsToDuration =
  (targetFramesPerSecond: number) => (nbFrames: number) =>
    Math.round(nbFrames * (1000 / targetFramesPerSecond))

export function calcAngleDegrees(x: number, y: number) {
  return (Math.atan2(y, x) * 180) / Math.PI
}

export function angleBetween(
  pointA: [number, number],
  pointB: [number, number]
): number {
  const dx = pointB[0] - pointA[0]
  const dy = pointB[1] - pointA[1]
  return Math.atan2(dy, dx)
}
