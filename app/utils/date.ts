export function isValidDate(date: Date | number): boolean {
  if (typeof date === "number") date = new Date(date)
  return !isNaN(date.getTime())
}
