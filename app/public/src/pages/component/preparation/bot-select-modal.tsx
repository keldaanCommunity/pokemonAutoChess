import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Grid } from "react-window"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { addBot } from "../../../network"
import { cc } from "../../utils/jsx"
import { Modal } from "../modal/modal"
import { EloBadge } from "../profile/elo-badge"
import { InlineAvatar } from "../profile/inline-avatar"
import "./bot-select-modal.css"

const MIN_COL_WIDTH = 360
const ROW_HEIGHT = 58

export function BotSelectModal(props: {
  botsSelected: string[]
  close: () => void
}) {
  const [sortBotsOrder, setSortBotsOrder] = useState<boolean>(false)
  const [sortBotsCriteria, setSortBotsCriteria] = useState<string>("name")
  const [queryBot, setQueryBot] = useState<string>("")
  const [botsSelection, setBotsSelection] = useState<Set<IBot>>(new Set())
  const { t } = useTranslation()

  function sortBy(criteria: string) {
    if (sortBotsCriteria === criteria) {
      setSortBotsOrder(!sortBotsOrder)
    } else {
      setSortBotsCriteria(criteria)
      setSortBotsOrder(false)
    }
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [botsList, setBotsList] = useState<IBot[] | null>(null)
  useEffect(() => {
    if (botsList === null) {
      fetch(`/bots?approved=true&t=${Date.now()}`)
        .then((r) => r.json())
        .then((bots) => {
          setBotsList(bots)
          setLoading(false)
        })
    }
  }, [])

  const botsListSorted = (botsList ?? [])
    .filter(
      (bot) =>
        !props.botsSelected || props.botsSelected.includes(bot.id) === false
    )
    .filter((bot) => bot.name.toLowerCase().includes(queryBot.toLowerCase()))
    .sort(
      (a, b) =>
        (a[sortBotsCriteria] < b[sortBotsCriteria] ? -1 : 1) *
        (sortBotsOrder ? -1 : 1)
    )

  return (
    <Modal
      show={true}
      className="bot-select-modal"
      onClose={() => props.close()}
      header={
        <>
          {t("select_bots_for_this_game")}
          <div className="spacer"></div>
          <input
            type="search"
            style={{ maxWidth: "20ch" }}
            placeholder="Search by name"
            value={queryBot}
            onInput={(e) => setQueryBot((e.target as HTMLInputElement).value)}
          />
          <button
            onClick={() => {
              sortBy("elo")
            }}
            className="bubbly pink"
          >
            {t("sort_by_elo")}
          </button>
          <button
            onClick={() => {
              sortBy("name")
            }}
            className="bubbly blue"
          >
            {t("sort_by_name")}
          </button>
        </>
      }
      body={
        <>
          {loading && <p>{t("loading")}</p>}
          {!loading && botsListSorted.length === 0 && (
            <p>{t("no_bots_found")}</p>
          )}
          {!loading && botsListSorted.length > 0 && (
            <div className="bot-select-grid">
              <AutoSizer
                renderProp={({ height, width }) => {
                  if (height === undefined || width === undefined) return null
                  const columnCount = Math.max(
                    1,
                    Math.floor(width / MIN_COL_WIDTH)
                  )
                  const columnWidth = Math.floor(width / columnCount)
                  const rowCount = Math.ceil(
                    botsListSorted.length / columnCount
                  )
                  return (
                    <Grid<BotCellData>
                      style={{ height, width }}
                      columnCount={columnCount}
                      columnWidth={columnWidth}
                      rowCount={rowCount}
                      rowHeight={ROW_HEIGHT}
                      cellComponent={BotCell}
                      cellProps={{
                        botsListSorted,
                        columnCount,
                        botsSelection,
                        setBotsSelection
                      }}
                    />
                  )
                }}
              />
            </div>
          )}
        </>
      }
      footer={
        <>
          <button
            className="bubbly red"
            onClick={() => {
              props.close()
            }}
          >
            {t("cancel")}
          </button>
          <button
            className="bubbly blue"
            onClick={() => {
              botsSelection.forEach((bot) => addBot(bot))
              props.close()
            }}
          >
            {t("add")} {botsSelection.size} {t("bot")}
            {botsSelection.size === 1 ? "" : "s"}
          </button>
        </>
      }
    />
  )
}

type BotCellData = {
  botsListSorted: IBot[]
  columnCount: number
  botsSelection: Set<IBot>
  setBotsSelection: React.Dispatch<React.SetStateAction<Set<IBot>>>
}

function BotCell({
  columnIndex,
  rowIndex,
  style,
  botsListSorted,
  columnCount,
  botsSelection,
  setBotsSelection
}: {
  ariaAttributes: object
  columnIndex: number
  rowIndex: number
  style: React.CSSProperties
} & BotCellData): React.ReactElement | null {
  const index = rowIndex * columnCount + columnIndex
  if (index >= botsListSorted.length) return null
  const bot = botsListSorted[index]
  return (
    <div style={{ ...style, padding: "0 4px 8px 0" }}>
      <li
        className={cc("player", "my-box", "preparation-menu-user", {
          selected: botsSelection.has(bot)
        })}
        onClick={() => {
          if (botsSelection.has(bot)) {
            botsSelection.delete(bot)
          } else {
            botsSelection.add(bot)
          }
          setBotsSelection(new Set([...botsSelection]))
        }}
      >
        <EloBadge elo={bot.elo} />
        <InlineAvatar avatar={bot.avatar} name={bot.name} />
      </li>
    </div>
  )
}
