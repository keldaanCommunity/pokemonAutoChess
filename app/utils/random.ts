export function chance(probability: number): boolean {
  return Math.random() < probability
}

export function coinflip(): boolean {
  return Math.random() < 0.5
}

export function pickRandomIn<T>(list: T[] | Record<any, T>): T {
  if (!Array.isArray(list)) return pickRandomIn(Object.values(list))
  return list[Math.floor(Math.random() * list.length)]
}

export function pickNRandomIn<T>(array: T[], number = 1): T[] {
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
export function shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}
