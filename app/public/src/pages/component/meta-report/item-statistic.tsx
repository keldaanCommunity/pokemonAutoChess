import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { IItemV2 } from "../../../../../models/mongo-models/items-statistic-v2"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import PokemonPortrait from "../pokemon-portrait"
import { HistoryChart } from "./history-chart"
import { HistoryDelta } from "./history-delta"

export default function ItemStatistic(props: { item: IItemV2; rank: number }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const rankHistory = props.item.rank_history ?? []
  const countHistory = props.item.count_history ?? []

  return (
    <div className="item-stat my-box">
      <div className="item-stat-main">
        <div className="pokemon-rank-col">
          <span className="rank">{props.rank}</span>
          <button
            className="history-expand-btn"
            onClick={() => setExpanded((v) => !v)}
            title={t("history")}
          >
            {expanded ? "▾" : "▸"}
          </button>
        </div>
        <img
          src={"assets/item/" + props.item.name + ".png"}
          style={{
            width: "48px",
            height: "48px"
          }}
        ></img>
        <span>{t(`item.${props.item.name}`)}</span>
        <span className="item-stat-metric">
          <label>{t("average_place")}:</label>
          <span>{props.item.rank}</span>
          <HistoryDelta entries={rankHistory} invertY={true} />
        </span>
        <span className="item-stat-metric">
          <label>{t("count")}:</label>
          <span>{props.item.count}</span>
          <HistoryDelta entries={countHistory} />
        </span>
        <div style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
          <label>{t("popular_holders")}:</label>
          {props.item.pokemons.map((pokemon) => (
            <PokemonPortrait portrait={PkmIndex[pokemon]} key={pokemon} />
          ))}
        </div>
      </div>
      {expanded && (
        <div className="pokemon-history-charts">
          <HistoryChart
            entries={rankHistory}
            label="average_place"
            color="#e8a838"
            invertY={true}
          />
          <HistoryChart entries={countHistory} label="count" color="#76c893" />
        </div>
      )}
    </div>
  )
}
