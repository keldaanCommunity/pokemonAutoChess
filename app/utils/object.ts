// typed version of Object.keys
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

// typed version of Object.values
export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][]
}

// typed version of Object.entries
export function entries<T extends object, K extends keyof T>(
  obj: T
): [K, T[K]][] {
  return Object.entries(obj) as [K, T[K]][]
}

export function invertKeysValues<T extends Record<string, string>>(
  obj: T
): Record<T[keyof T], keyof T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  ) as Record<T[keyof T], keyof T>
}
