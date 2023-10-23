import { t } from "i18next"
import React, { useState } from "react"
import { IMeta } from "../../../../../models/mongo-models/meta"
import { useAppSelector } from "../../../hooks"
import TeamComp from "./team-comp"

export function CompositionReport() {
  const meta = useAppSelector((state) => state.lobby.meta)
  const [rankingBy, setRanking] = useState<string>("count")

  let sortedMeta = new Array<IMeta>()
  if (rankingBy == "count" || rankingBy == "winrate") {
    sortedMeta = [...meta].sort((a, b) => {
      return b[rankingBy] - a[rankingBy]
    })
  } else {
    sortedMeta = [...meta].sort((a, b) => {
      return a[rankingBy] - b[rankingBy]
    })
  }

  return (
    <div id="meta-report-compo">
      <header>
        <h2>{t("best_team_compositions")}</h2>
        <select
          value={rankingBy}
          onChange={(e) => setRanking(e.target.value)}
          className="my-select"
        >
          <option value="count">
            {t("rank")} {t("by_poularity")}
          </option>
          <option value="mean_rank">
            {t("rank")} {t("by_average_place")}
          </option>
          <option value="winrate">
            {t("rank")} {t("by_winrate")}
          </option>
        </select>
      </header>

      <div style={{ height: "calc(90vh - 8em)", overflowY: "scroll" }}>
        {sortedMeta.length === 0 && <p>No data available</p>}
        {sortedMeta.map((team, i) => {
          return <TeamComp team={team} rank={i + 1} key={team.cluster_id} />
        })}
      </div>
    </div>
  )
}
