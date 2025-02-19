import {
  ArraySchema,
  CollectionSchema,
  MapSchema,
  Schema,
  SetSchema
} from "@colyseus/schema"

export function keys(schema: MapSchema): string[] {
  const keys: string[] = []
  schema.forEach((value, key) => keys.push(key))
  return keys
}

export function values<T>(
  schema: MapSchema<T> | SetSchema<T> | CollectionSchema<T> | ArraySchema<T>
): T[] {
  const values: T[] = []
  schema.forEach((value: T) => values.push(value))
  return values
}

export function entries<V, K extends string>(
  schema: MapSchema<V, K>
): [K, V][] {
  const entries: [K, V][] = []
  schema.forEach((value, key) => entries.push([key, value]))
  return entries
}

export function resetArraySchema<T>(
  schema: ArraySchema<T>,
  newArray: T[] | ArraySchema<T>
) {
  schema.clear()
  newArray.forEach((value: T) => schema.push(value))
}

export function convertSchemaToRawObject(schema: any): any {
  if (schema instanceof ArraySchema) {
    const values: any[] = []
    schema.forEach((value) => values.push(convertSchemaToRawObject(value)))
    return values
  }
  if (schema instanceof CollectionSchema) {
    const values: any[] = []
    schema.forEach((value) => values.push(convertSchemaToRawObject(value)))
    return values
  }
  if (schema instanceof MapSchema) {
    const map = new Map()
    schema.forEach((val, key) => map.set(key, convertSchemaToRawObject(val)))
    return map
  }
  if (schema instanceof SetSchema) {
    const set = new Set()
    schema.forEach((val) => set.add(convertSchemaToRawObject(val)))
    return set
  }

  if (schema instanceof Schema === false) return schema

  const raw = {}
  Object.getOwnPropertyNames(schema).forEach((prop) => {
    if (prop.startsWith("_") === false && prop.startsWith("$") === false) {
      raw[prop] = convertSchemaToRawObject(schema[prop])
    }
  })

  return raw
}
