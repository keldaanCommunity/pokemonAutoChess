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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "27px",
          paddingLeft: "15px"
        }}
      >
        <h3>{t("best_items")}</h3>
        <div
          style={{
            display: "flex",
            width: "23%",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "rgb(84, 89, 107)"
          }}
          className="my-select"
        >
          <p style={{ margin: 0 }}>{t("rank")}</p>
          <select
            value={itemRankingBy}
            onChange={(e) => {
              setItemRanking(e.target.value)
            }}
            style={{ background: "none", border: "none", color: "white" }}
          >
            <option value="count">{t("by_popularity")}</option>
            <option value="rank">{t("by_average_place")}</option>
          </select>
        </div>
      </div>
      <div style={{ height: "70vh", overflowY: "scroll" }}>
        {sortedMetaItems.length === 0 && <p>No data available</p>}
        {sortedMetaItems.map((item) => {
          return <ItemStatistic item={item} key={item.name} />
        })}
      </div>
    </div>
  )
}
