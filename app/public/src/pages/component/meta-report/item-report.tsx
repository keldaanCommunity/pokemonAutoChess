import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { List, useDynamicRowHeight } from "react-window"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { EloRankThreshold } from "../../../../../config"
import {
  fetchMetaItems,
  IItemsStatisticV2,
  IItemV2
} from "../../../../../models/mongo-models/items-statistic-v2"
import { EloRank } from "../../../../../types/enum/EloRank"
import {
  CraftableItems,
  Item,
  ShinyItems,
  Tools
} from "../../../../../types/enum/Item"
import { ItemDistribution } from "./item-distribution"
import { ItemHistoryPanel } from "./item-history-panel"
import ItemStatistic from "./item-statistic"
import "./item-report.css"

type ViewMode = "distribution" | "count-history" | "rank-history"

export function ItemReport() {
  const [loading, setLoading] = useState<boolean>(true)
  const [metaItems, setMetaItems] = useState<IItemsStatisticV2[]>([])
  const [itemRankingBy, setItemRanking] = useState<string>("count")
  const [eloThreshold, setEloTreshold] = useState<EloRank>(EloRank.LEVEL_BALL)
  const [viewMode, setViewMode] = useState<ViewMode>("distribution")

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

  const tabs: { label: string; key: string; items?: readonly Item[] }[] = [
    { label: t("craftable_items"), key: "craftable", items: CraftableItems },
    { label: t("tools"), key: "tools", items: Tools },
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
          <TabPanel key={tab.key}>
            <div className="item-statistics-list">
              {sortedMetaItems.length === 0 && (
                <p>{loading ? t("loading") : t("no_data_available")}</p>
              )}
              <VirtualizedItemList
                items={
                  sortedMetaItems
                    ?.find((i) => i.tier === eloThreshold)
                    ?.items.filter(
                      (item) => tab.items && tab.items.includes(item.name)
                    ) ?? []
                }
              />
            </div>
            <div className="item-distribution-chart">
              <div className="view-switcher">
                <button
                  className={viewMode === "distribution" ? "active" : ""}
                  onClick={() => setViewMode("distribution")}
                >
                  {t("overview")}
                  <span className="view-limit-hint">
                    {t("top_n", { count: 400 })}
                  </span>
                </button>
                <button
                  className={viewMode === "count-history" ? "active" : ""}
                  onClick={() => setViewMode("count-history")}
                >
                  {t("popularity_over_time")}
                  <span className="view-limit-hint">
                    {t("top_n", { count: 200 })}
                  </span>
                </button>
                <button
                  className={viewMode === "rank-history" ? "active" : ""}
                  onClick={() => setViewMode("rank-history")}
                >
                  {t("placement_over_time")}
                  <span className="view-limit-hint">
                    {t("top_n", { count: 200 })}
                  </span>
                </button>
              </div>
              {viewMode === "distribution" && (
                <ItemDistribution
                  metaItems={metaItems}
                  eloThreshold={eloThreshold}
                  loading={loading}
                  itemFilter={tab.items}
                />
              )}
              {viewMode === "count-history" && (
                <ItemHistoryPanel
                  metaItems={metaItems}
                  eloThreshold={eloThreshold}
                  loading={loading}
                  metric="count"
                  itemFilter={tab.items}
                />
              )}
              {viewMode === "rank-history" && (
                <ItemHistoryPanel
                  metaItems={metaItems}
                  eloThreshold={eloThreshold}
                  loading={loading}
                  metric="rank"
                  itemFilter={tab.items}
                />
              )}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}

const ESTIMATED_ITEM_HEIGHT = 80

function VirtualizedItemList({ items }: { items: IItemV2[] }) {
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: ESTIMATED_ITEM_HEIGHT,
    key: items.length
  })

  if (items.length === 0) return null

  return (
    <AutoSizer
      renderProp={({ height, width }) => {
        if (height === undefined || width === undefined) return null
        return (
          <List<ItemRowData>
            style={{ height, width }}
            rowCount={items.length}
            rowHeight={dynamicRowHeight}
            rowComponent={ItemRow}
            rowProps={{ items }}
          />
        )
      }}
    />
  )
}

type ItemRowData = {
  items: IItemV2[]
}

function ItemRow({
  index,
  style,
  items
}: {
  ariaAttributes: object
  index: number
  style: React.CSSProperties
} & ItemRowData): React.ReactElement | null {
  return (
    <div style={style}>
      <div>
        <ItemStatistic item={items[index]} rank={index + 1} />
      </div>
    </div>
  )
}
