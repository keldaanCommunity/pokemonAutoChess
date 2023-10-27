import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import {
  IItemsStatistic,
  fetchMetaItems
} from "../../../../../models/mongo-models/items-statistic"
import ItemStatistic from "./item-statistic"

export function ItemReport() {
  const [loading, setLoading] = useState<boolean>(true)
  const [metaItems, setMetaItems] = useState<IItemsStatistic[]>([])
  useEffect(() => {
    fetchMetaItems().then((res) => {
      setLoading(false)
      setMetaItems(res)
    })
  }, [])

  const [itemRankingBy, setItemRanking] = useState<string>("count")

  const sortedMetaItems = useMemo(() => {
    return [...metaItems].sort((a, b) => {
      const order = itemRankingBy == "count" ? -1 : 1
      return (a[itemRankingBy] - b[itemRankingBy]) * order
    })
  }, [metaItems, itemRankingBy])

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
        {sortedMetaItems.length === 0 && (
          <p>{loading ? t("loading") : t("no_data_available")}</p>
        )}
        {sortedMetaItems.map((item, i) => {
          return <ItemStatistic item={item} key={item.name} rank={i + 1} />
        })}
      </div>
    </div>
  )
}
