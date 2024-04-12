import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import {
  IItemsStatistic,
  fetchMetaItems
} from "../../../../../models/mongo-models/items-statistic"
import {
  ArtificialItems,
  BasicItems,
  Berries,
  CraftableItems
} from "../../../../../types/enum/Item"
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

  const tabs = [
    { label: t("craftable_items"), key: "craftable", items: CraftableItems },
    {
      label: t("artificial_items"),
      key: "artificial_items",
      items: ArtificialItems
    },
    { label: t("components"), key: "components", items: BasicItems },
    { label: t("berries"), key: "berries", items: Berries }
  ]

  return (
    <div id="item-report">
      <header>
        <h2>{t("best_items")}</h2>
        <select
          value={itemRankingBy}
          onChange={(e) => {
            setItemRanking(e.target.value)
          }}
        >
          <option value="count">
            {t("rank")} {t("by_popularity")}
          </option>
          <option value="rank">
            {t("rank")} {t("by_average_place")}
          </option>
        </select>
      </header>

      <Tabs>
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab.key}>{tab.label}</Tab>
          ))}
        </TabList>
        {tabs.map((tab) => (
          <TabPanel
            key={tab.key}
            style={{ height: "calc(90vh - 12em)", overflowY: "scroll" }}
          >
            {sortedMetaItems.length === 0 && (
              <p>{loading ? t("loading") : t("no_data_available")}</p>
            )}
            {sortedMetaItems
              .filter((item) => tab.items.includes(item.name))
              .map((item, i) => {
                return (
                  <ItemStatistic item={item} key={item.name} rank={i + 1} />
                )
              })}
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}
