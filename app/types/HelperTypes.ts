import type { Schema } from "@colyseus/schema"

type DataKey<T, K extends keyof T> = K extends keyof Schema
  ? never
  : T[K] extends (...args: never[]) => unknown
    ? never
    : K
export type NonFunctionPropNames<T> = {
  [K in keyof T]-?: DataKey<T, K>
}[keyof T]
