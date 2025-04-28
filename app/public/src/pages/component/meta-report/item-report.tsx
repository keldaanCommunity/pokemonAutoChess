import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import {
  IItemV2,
  IItemsStatisticV2,
  fetchMetaItems
} from "../../../../../models/mongo-models/items-statistic-v2"
import {
  ArtificialItems,
  CraftableItems,
  WeatherRocks,
  ShinyItems,
  Item
} from "../../../../../types/enum/Item"
import ItemStatistic from "./item-statistic"
import { EloRank, EloRankThreshold } from "../../../../../types/Config"

export function ItemReport() {
  const [loading, setLoading] = useState<boolean>(true)
  const [metaItems, setMetaItems] = useState<IItemsStatisticV2[]>([])
  const [itemRankingBy, setItemRanking] = useState<string>("count")
  const [eloThreshold, setEloTreshold] = useState<EloRank>(EloRank.LEVEL_BALL)

  useEffect(() => {
    fetchMetaItems().then((res) => {
      setMetaItems(res)
      setLoading(false)
    })
  }, [])

  const sortedMetaItems = useMemo(() => {
    return [...metaItems].map((m) => ({
      tier: m.tier,
      items: ((Object.values(m.items) || []) as IItemV2[]).sort((a, b) => {
        const order = itemRankingBy === "count" ? -1 : 1
        return (a[itemRankingBy] - b[itemRankingBy]) * order
      })
    }))
  }, [metaItems, itemRankingBy])

  const tabs = [
    { label: t("craftable_items"), key: "craftable", items: CraftableItems },
    {
      label: t("artificial_items"),
      key: "artificial_items",
      items: ArtificialItems
    },
    { label: t("shiny_items"), key: "shiny_items", items: ShinyItems }
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
              ?.find((i) => i.tier === eloThreshold)
              ?.items.filter((item) => tab.items.includes(item.name))
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
