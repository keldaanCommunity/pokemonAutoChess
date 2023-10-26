import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { fetchMeta, IMeta } from "../../../../../models/mongo-models/meta"
import TeamComp from "./team-comp"

export function CompositionReport() {
  const [loading, setLoading] = useState<boolean>(true)
  const [meta, setMeta] = useState<IMeta[]>([])
  useEffect(() => {
    fetchMeta().then((res) => {
      setLoading(false)
      setMeta(res)
    })
  }, [])
  const [rankingBy, setRanking] = useState<string>("count")

  const sortedMeta = useMemo(() => {
    return [...meta].sort((a, b) => {
      const order = rankingBy == "count" || rankingBy == "winrate" ? -1 : 1
      return (a[rankingBy] - b[rankingBy]) * order
    })
  }, [meta, rankingBy])

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
        {sortedMeta.length === 0 && (
          <p>{loading ? t("loading") : t("no_data_available")}</p>
        )}
        {sortedMeta.map((team, i) => {
          return <TeamComp team={team} rank={i + 1} key={team.cluster_id} />
        })}
      </div>
    </div>
  )
}
