export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    const k = key(item)
    if (!(k in groups)) groups[k] = []
    groups[k].push(item)
    return groups
  }, {} as Record<K, T[]>)

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

export function deduplicateArray<T>(arr: T[]): T[] {
  return arr.filter((item, index, array) => array.indexOf(item) === index)
}

export function removeInArray<T>(arr: T[], el: T) {
  if (arr.find((e) => e === el)) {
    arr.splice(arr.indexOf(el), 1)
  }
}
