import i18n from "../../i18n"

export function formatDate(n: number) {
  const date = new Date(n)
  return new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date)
}
