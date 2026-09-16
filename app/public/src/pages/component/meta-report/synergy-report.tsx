import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { EloRankThreshold } from "../../../../../config"
import { EloRank } from "../../../../../types/enum/EloRank"
import type { Synergy } from "../../../../../types/enum/Synergy"
import type { ITypeStatistics } from "../../../../../types/meta"
import { keys } from "../../../../../utils/object"
import { fetchMetaTypes } from "../../../models/pokemons-statistic-v2"
import { SynergyDistribution } from "./synergy-distribution"
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
        <div className="my-box" style={{ marginBottom: "0.5em" }}>
          <p>{t("meta_report.synergy_report_note")}</p>
        </div>
        <div className="filters">
          <select
            value={synergyRankingBy}
            onChange={(e) => setSynergyRanking(e.target.value)}
          >
            <option value="count">
              {t("rank")} {t("meta_report.by_popularity")}
            </option>
            <option value="average_rank">
              {t("rank")} {t("meta_report.by_average_place")}
            </option>
          </select>
          <select
            value={eloThreshold}
            onChange={(e) => setEloTreshold(e.target.value as EloRank)}
          >
            {keys(EloRank).map((r) => (
              <option value={r} key={r}>
                {t(`elorank.${r}`)} ({t("elo")} {">"} {EloRankThreshold[r]})
              </option>
            ))}
          </select>
        </div>
      </header>
      {loading && <p>{t("loading")}</p>}
      {!loading && (
        <div className="synergy-report-content">
          <div className="synergy-statistics-list">
            <SynergyStatistic
              synergies={sortedSynergies}
              rankingBy={synergyRankingBy}
            />
          </div>
          <div className="synergy-distribution-chart">
            <SynergyDistribution
              metaTypes={metaTypes}
              eloThreshold={eloThreshold}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  )
}
