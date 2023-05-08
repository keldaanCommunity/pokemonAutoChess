import { MapSchema, SetSchema } from "@colyseus/schema";

export function keys(schema: MapSchema): string[] {
    const keys: string[] = []
    schema.forEach((value, key) => keys.push(key))
    return keys
}

export function values<T>(schema: MapSchema<T, any> | SetSchema<T>): T[] {
    const values: T[] = []
    schema.forEach((value: T) => values.push(value))
    return values
}

export function entries<V, K extends string>(schema: MapSchema<V, K>): [K,V][] {
    const entries: [K,V][] = []
    schema.forEach((value, key) => entries.push([key, value]))
    return entries
}