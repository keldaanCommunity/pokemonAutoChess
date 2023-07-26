import { t } from "i18next"

export function getRankLabel(rank: number) {
  switch (rank) {
    case 1:
      return t("first_place")
    case 2:
      return t("second_place")
    case 3:
      return t("third_place")
  }
  return `${rank} ${t("th_place")}`
}
