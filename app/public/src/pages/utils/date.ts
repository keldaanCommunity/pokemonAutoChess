import i18n from "../../i18n"

export function formatDate(date: number | Date) {
  if (typeof date === "number") date = new Date(date)
  try {
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date)
  } catch (err) {
    return "Invalid Date"
  }
}

export function formatTimeout(s: number) {
  const h = Math.floor(s / 3600)
  s -= h * 3600
  const m = Math.floor(s / 60)
  s -= m * 60
  return `${h > 0 ? h + "h" : ""}${("00" + m).slice(-2)}:${("00" + s).slice(
    -2
  )}`
}
