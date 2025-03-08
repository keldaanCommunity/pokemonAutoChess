import { IPokemon, IPokemonEntity } from "../types"

export function chance(
  probability: number,
  pokemon?: IPokemonEntity | IPokemon
): boolean {
  return Math.random() < probability * (1 + (pokemon?.luck ?? 0) / 100)
}

export function randomWeighted<T extends string>(
  weights: { [item in T]?: number },
  totalWeight?: number
): T | null {
  if (totalWeight === undefined) {
    totalWeight = (Object.values(weights) as number[]).reduce(
      (sum: number, weight: number) => sum + weight,
      0
    )
  }
  let random = Math.random() * totalWeight
  for (const [item, weight] of Object.entries(weights) as [T, number][]) {
    if ((random -= weight) < 0) return item
  }
  return null
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function pickRandomIn<T>(list: T[] | Record<string, T>): T {
  if (!Array.isArray(list)) return pickRandomIn(Object.values(list))
  return list[Math.floor(Math.random() * list.length)]
}

export function pickNRandomIn<T>(array: T[], number: number): T[] {
  const selection: T[] = [],
    options = [...array]
  shuffleArray(options)
  while (selection.length < number && options.length > 0) {
    selection.push(options.pop()!)
  }
  return selection
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export function shuffleArray<T extends Array<unknown>>(array: T): T {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
