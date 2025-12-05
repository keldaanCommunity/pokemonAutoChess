import React from "react"
import { useTranslation } from "react-i18next"
import { Synergy } from "../../../../../types/enum/Synergy"
import SynergyIcon from "../icons/synergy-icon"

interface SynergyData {
  name: Synergy
  count: number
  average_rank: number
}

export default function SynergyStatistic(props: {
  synergies: SynergyData[]
  rankingBy: string
}) {
  const { t } = useTranslation()

  return (
    <article className="synergy-statistics">
      <div className="synergy-grid">
        <div className="synergy-header">
          <span>{t("synergies")}</span>
          <span>{t("count")}</span>
          <span>{t("average_place")}</span>
        </div>
        {props.synergies.map((synergy, index) => (
          <div key={synergy.name} className="synergy-row">
            <div className="synergy-info">
              <span className="synergy-rank">#{index + 1}</span>
              <SynergyIcon type={synergy.name} />
              <span className="synergy-name">
                {t(`synergy.${synergy.name}`)}
              </span>
            </div>
            <span className="synergy-count">{synergy.count ?? 0}</span>
            <span className="synergy-rank-value">
              {synergy.average_rank
                ? synergy.average_rank.toFixed(2)
                : "No data"}
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}
