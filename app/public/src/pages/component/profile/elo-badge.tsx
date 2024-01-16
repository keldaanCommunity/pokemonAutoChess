import React from "react"
import { EloRankThreshold, EloRank } from "../../../../../types/Config"
import CSS from "csstype"
import { useTranslation } from "react-i18next"

const style: CSS.Properties = {
  display: "flex",
  alignItems: "center",
  width: "calc(48px + 2.5em)",
  flex: "0 0 calc(48px + 2.5em)",
  gap: "5px"
}

const imgStyle: CSS.Properties = {
  width: "50px",
  height: "50px"
}

export function EloBadge(props: { elo: number }) {
  const { t } = useTranslation()
  const rank = getRank(props.elo)
  return (
    <div style={style} className="elo">
      <img
        style={imgStyle}
        src={"assets/ranks/" + rank + ".svg"}
        alt={t("elorank." + rank)}
        title={t("elorank." + rank)}
      />
      <p style={{ margin: "0px", fontSize: "1vw" }}>{props.elo}</p>
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
