import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { EloRankThreshold } from "../../../../../config"
import { fetchMetaTypes } from "../../../../../models/mongo-models/pokemons-statistic-v2"
import { EloRank } from "../../../../../types/enum/EloRank"
import { Synergy } from "../../../../../types/enum/Synergy"
import { ITypeStatistics } from "../../../../../types/meta"
import SynergyStatistic from "./synergy-statistic"
import "./synergy-report.css"

export function SynergyReport() {
  const [loading, setLoading] = useState<boolean>(true)
  const [eloThreshold, setEloTreshold] = useState<EloRank>(EloRank.LEVEL_BALL)
  const [synergyRankingBy, setSynergyRanking] = useState<string>("count")

  const [metaTypes, setMetaTypes] = useState<ITypeStatistics>()
  useEffect(() => {
    fetchMetaTypes().then((res) => {
      setMetaTypes(res)
      setLoading(false)
    })
  }, [])

  const sortedSynergies = useMemo(() => {
    if (!metaTypes || !metaTypes[eloThreshold]) {
      return []
    }

    const synergyData = Object.entries(metaTypes[eloThreshold]).map(
      ([synergyName, data]) => ({
        name: synergyName as Synergy,
        count: data.count,
        average_rank: data.average_rank
      })
    )

    return synergyData.sort((a, b) => {
      const order = synergyRankingBy === "count" ? -1 : 1
      return (a[synergyRankingBy] - b[synergyRankingBy]) * order
    })
  }, [metaTypes, eloThreshold, synergyRankingBy])

  return (
    <div id="synergy-report">
      <header>
        <h2>{t("synergies")}</h2>
        <div className="filters">
          <select
            value={synergyRankingBy}
            onChange={(e) => setSynergyRanking(e.target.value)}
          >
            <option value="count">
              {t("rank")} {t("by_popularity")}
            </option>
            <option value="average_rank">
              {t("rank")} {t("by_average_place")}
            </option>
          </select>
          <select
            value={eloThreshold}
            onChange={(e) => setEloTreshold(e.target.value as EloRank)}
          >
            {Object.keys(EloRank).map((r) => (
              <option value={r} key={r}>
                {t(`elorank.${r}`)} ({t("elo")} {">"} {EloRankThreshold[r]})
              </option>
            ))}
          </select>
        </div>
      </header>
      {loading && <p>{t("loading")}</p>}
      {!loading && (
        <SynergyStatistic
          synergies={sortedSynergies}
          rankingBy={synergyRankingBy}
        />
      )}
    </div>
  )
}
