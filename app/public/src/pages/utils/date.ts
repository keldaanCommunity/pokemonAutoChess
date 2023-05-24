export function formatDate(n: number) {
  const date = new Date(n)
  return new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date)
}
