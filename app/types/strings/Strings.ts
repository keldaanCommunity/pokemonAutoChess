import { t } from "i18next"

export function getRankLabel(rank: number) {
  switch (rank) {
    case 1:
      return t("rank_labels.first_place")
    case 2:
      return t("rank_labels.second_place")
    case 3:
      return t("rank_labels.third_place")
  }
  return `${rank}${t("rank_labels.th_place")}`
}
