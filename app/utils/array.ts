import { ArraySchema } from "@colyseus/schema"

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      const k = key(item)
      if (!(k in groups)) groups[k] = []
      groups[k].push(item)
      return groups
    },
    {} as Record<K, T[]>
  )

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

export function deduplicateArray<T>(arr: T[]): T[] {
  return arr.filter((item, index, array) => array.indexOf(item) === index)
}

export function removeInArray<T>(
  arr: T[] | ArraySchema<T>,
  el: T
): T[] | ArraySchema<T> {
  const index = arr.indexOf(el)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

export function count<T>(arr: T[] | ArraySchema<T>, el: T): number {
  let count = 0
  for (let i = 0; i < arr.length; i++) if (arr[i] === el) count++
  return count
}

export function wrapInArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
