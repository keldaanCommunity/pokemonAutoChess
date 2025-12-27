import { t } from "i18next"
import React, { useEffect, useState } from "react"
import {
  fetchMetaRegions,
  IRegionStatistic
} from "../../../../../models/mongo-models/regions-statistic"
import RegionStatistic from "./region-statistic"
import "./region-report.css"

export function RegionReport() {
  const [loading, setLoading] = useState<boolean>(true)
  const [metaRegions, setMetaRegions] = useState<IRegionStatistic[]>([])
  const [regionRankingBy, setRegionRanking] = useState<"count" | "rank">(
    "count"
  )

  useEffect(() => {
    fetchMetaRegions().then((res) => {
      setMetaRegions(res)
      setLoading(false)
    })
  }, [])

  const sortedMetaRegions = [...metaRegions].sort((a, b) => {
    const order = regionRankingBy === "count" ? -1 : 1
    return (a[regionRankingBy] - b[regionRankingBy]) * order
  })

  return (
    <div id="region-report">
      <header>
        <h2>{t("best_regions")}</h2>
        <div className="filters">
          <select
            value={regionRankingBy}
            onChange={(e) => {
              setRegionRanking(e.target.value as "count" | "rank")
            }}
          >
            <option value="count">
              {t("rank")} {t("by_popularity")}
            </option>
            <option value="rank">
              {t("rank")} {t("by_average_place")}
            </option>
          </select>
        </div>
      </header>

      <div style={{ height: "calc(90vh - 12em)", overflowY: "scroll" }}>
        {loading && <p>{t("loading")}</p>}
        {!loading && metaRegions.length === 0 && (
          <p>{t("no_data_available")}</p>
        )}
        {sortedMetaRegions.map((region, i) => (
          <RegionStatistic region={region} key={region.name} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
