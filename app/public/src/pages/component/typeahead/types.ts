export interface TypeaheadProps<T = string> {
  value: string
  onChange: (value: T) => void
}
