import { t } from "i18next"
import React, { useState } from "react"
import { IItemsStatistic } from "../../../../../models/mongo-models/items-statistic"
import { useAppSelector } from "../../../hooks"
import ItemStatistic from "./item-statistic"

export function ItemReport() {
  const metaItems = useAppSelector((state) => state.lobby.metaItems)
  let sortedMetaItems = new Array<IItemsStatistic>()
  const [itemRankingBy, setItemRanking] = useState<string>("count")

  if (itemRankingBy == "count") {
    sortedMetaItems = [...metaItems].sort((a, b) => {
      return b[itemRankingBy] - a[itemRankingBy]
    })
  } else {
    sortedMetaItems = [...metaItems].sort((a, b) => {
      return a[itemRankingBy] - b[itemRankingBy]
    })
  }

  return (
    <div id="item-report">
      <header>
        <h2>{t("best_items")}</h2>
        <select
          value={itemRankingBy}
          onChange={(e) => {
            setItemRanking(e.target.value)
          }}
          className="my-select"
        >
          <option value="count">
            {t("rank")} {t("by_popularity")}
          </option>
          <option value="rank">
            {t("rank")} {t("by_average_place")}
          </option>
        </select>
      </header>
      <div style={{ height: "calc(90vh - 8em)", overflowY: "scroll" }}>
        {sortedMetaItems.length === 0 && <p>No data available</p>}
        {sortedMetaItems.map((item, i) => {
          return <ItemStatistic item={item} key={item.name} rank={i + 1} />
        })}
      </div>
    </div>
  )
}
