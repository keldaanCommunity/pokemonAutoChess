export type NonFunctionPropNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]
