import React from "react"
import { useTranslation } from "react-i18next"
import { EloRankThreshold } from "../../../../../types/Config"
import { EloRank } from "../../../../../types/enum/EloRank"
import "./elo-badge.css"

export function EloBadge(props: { elo: number }) {
  const { t } = useTranslation()
  const rank = getRank(props.elo)
  return (
    <div className="elo badge">
      <img
        src={"assets/ranks/" + rank + ".svg"}
        alt={t("elorank." + rank)}
        title={t("elorank." + rank)}
      />
      <p style={{ margin: 0 }}>{props.elo}</p>
    </div>
  )
}

function getRank(elo: number) {
  let rank = EloRank.BEGINNER
  ;(Object.keys(EloRankThreshold) as EloRank[]).forEach((e) => {
    if (elo > EloRankThreshold[e]) {
      rank = e
    }
  })
  return rank
}
