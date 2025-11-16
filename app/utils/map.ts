export function reverseMap<K, V>(map: Map<K, V>): Map<V, K> {
  return new Map(Array.from(map.entries()).map(([k, v]) => [v, k]))
}

export function mapToObj<K extends string, V>(map: Map<K, V>): Record<K, V> {
  const obj = {} as Record<K, V>
  for (const [k, v] of map) obj[k] = v
  return obj
}

export function objToMap<K extends string, V>(obj: Record<K, V>): Map<K, V> {
  const map = new Map<K, V>()
  for (const k of Object.keys(obj) as K[]) {
    map.set(k, obj[k])
  }
  return map
}
