import type { ArraySchema } from "@colyseus/schema"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { List, useDynamicRowHeight } from "react-window"
import { BOARD_WIDTH, SynergyTiersThresholds } from "../../../../../config"
import type {
  IGameRecord,
  IPokemonRecord
} from "../../../../../models/colyseus-models/game-record"
import { computeSynergies } from "../../../../../models/colyseus-models/synergies"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { type Item, SynergyGivenByGem } from "../../../../../types"
import type { Synergy } from "../../../../../types/enum/Synergy"
import type { IDetailledPokemon } from "../../../../../types/interfaces/IDetailledPokemon"
import { getPokemonCustomFromAvatar } from "../../../../../utils/avatar"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { formatDate } from "../../utils/date"
import Team from "../after/team"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import { GameModeIcon } from "../icons/game-mode-icon"
import SynergyIcon from "../icons/synergy-icon"
import { EloBadge } from "./elo-badge"
import "./game-history.css"

const ROW_HEIGHT = 72

export default function GameHistory(props: {
  uid: string
  onUpdate?: (history: IGameRecord[]) => void
}) {
  const { t } = useTranslation()
  const [gameHistory, setGameHistory] = useState<IGameRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  useEffect(() => {
    if (props.onUpdate) {
      props.onUpdate(gameHistory)
    }
  }, [gameHistory, props.onUpdate])

  const pageSize = 10
  const loadHistory = async (uid: string, page: number) => {
    try {
      setLoading(true)

      const response = await fetch(
        `/game-history/${uid}?page=${page}&t=${Date.now()}`
      )
      const data: IGameRecord[] = await response.json()
      if (props.uid !== uid) return // ignore response if uid changed in the meantime

      if (data.length < pageSize) {
        setHasMore(false) // No more data to load
      }

      setGameHistory((prevHistory) => [
        ...prevHistory,
        ...data.filter(
          (h) => prevHistory.some((p) => p.time == h.time) == false
        )
      ])
    } catch (error) {
      console.error("Failed to load history:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (loading || !hasMore) return
    const skip = gameHistory.length
    const page = Math.floor(skip / pageSize + 1)
    loadHistory(props.uid, page)
  }

  useEffect(() => {
    // reset history on uid change
    setGameHistory([])
    setHasMore(true)
    loadHistory(props.uid, 1) // load last 10 games history
  }, [props.uid])

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: ROW_HEIGHT,
    key: gameHistory.length
  })

  // Trigger loadMore when user scrolls near the end
  const handleRowsRendered = useCallback(
    (
      _visibleRows: { startIndex: number; stopIndex: number },
      allRows: { startIndex: number; stopIndex: number }
    ) => {
      if (hasMore && !loading && allRows.stopIndex >= gameHistory.length - 3) {
        loadMore()
      }
    },
    [hasMore, loading, gameHistory.length]
  )

  return (
    <article className="game-history-list">
      <h2>{t("game_history")}</h2>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {(!gameHistory || gameHistory.length === 0) && (
          <p>{t("no_history_found")}</p>
        )}
        {gameHistory && gameHistory.length > 0 && (
          <AutoSizer
            renderProp={({ height, width }) => {
              if (height === undefined || width === undefined) return null
              return (
                <List<HistoryRowData>
                  style={{ height, width }}
                  rowCount={gameHistory.length}
                  rowHeight={dynamicRowHeight}
                  rowComponent={GameHistoryRow}
                  rowProps={{
                    gameHistory
                  }}
                  onRowsRendered={handleRowsRendered}
                />
              )
            }}
          />
        )}
      </div>
      <GamePokemonDetailTooltip origin="history" />
      <ItemDetailTooltip />
    </article>
  )
}

type HistoryRowData = {
  gameHistory: IGameRecord[]
}

function GameHistoryRow({
  index,
  style,
  gameHistory
}: {
  ariaAttributes: object
  index: number
  style: React.CSSProperties
} & HistoryRowData): React.ReactElement | null {
  const r = gameHistory[index]
  const { t } = useTranslation()

  return (
    <div style={style}>
      <div className="my-box game-history">
        <span className="top">
          <GameModeIcon gameMode={r.gameMode} />
          {t("top")} {r.rank}
        </span>
        <EloBadge elo={r.elo} />
        <ul className="synergies">
          {getTopSynergies(r.pokemons, r.unholdableItems).map(
            ([type, value]) => (
              <li key={r.time + type}>
                <SynergyIcon type={type} />
                <span>{value}</span>
              </li>
            )
          )}
        </ul>
        <p className="date">{formatDate(r.time)}</p>
        <Team team={r.pokemons}></Team>
        <div className="player-items">
          {r.unholdableItems.map((item, i) => (
            <img
              key={i}
              src={"/assets/item/" + item + ".png"}
              data-tooltip-id="item-detail-tooltip"
              data-tooltip-content={item}
            />
          ))}
        </div>
        <div className="actions">
          <button
            className="bubbly dark xs"
            title={t("save")}
            onClick={() => saveFile(r)}
          >
            <img src="assets/ui/save.svg" />
          </button>
        </div>
      </div>
    </div>
  )
}

function getTopSynergies(
  team: IPokemonRecord[] | ArraySchema<IPokemonRecord>,
  unholdableItems: Item[]
): [Synergy, number][] {
  const synergies = computeSynergies(
    team.map((pkmRecord) => {
      const pkm = PokemonFactory.createPokemonFromName(pkmRecord.name)
      pkm.positionY = 1 // just to not be counted on bench
      pkmRecord.items.forEach((item) => {
        pkm.items.add(item)
      })
      return pkm
    })
  )

  for (const item of unholdableItems) {
    const type = SynergyGivenByGem[item]
    if (type) {
      synergies.set(type, (synergies.get(type) ?? 0) + 1)
    }
  }

  const topSynergies = [...synergies.entries()]
    .sort((a, b) => {
      const [typeA, valueA] = a
      const [typeB, valueB] = b
      const aTier = SynergyTiersThresholds[typeA].filter(
        (n) => valueA >= n
      ).length
      const bTier = SynergyTiersThresholds[typeB].filter(
        (n) => valueB >= n
      ).length
      return aTier !== bTier ? bTier - aTier : valueB - valueA
    })
    .slice(0, 4)
  return topSynergies
}

function saveFile(data: IGameRecord) {
  // NOTE: positionning is not saved in game record
  const board: IDetailledPokemon[] = data.pokemons.map((p, i) => {
    const { emotion, shiny } = getPokemonCustomFromAvatar(p.avatar)
    return {
      name: p.name,
      x: i % BOARD_WIDTH,
      y: 3 - Math.floor(i / BOARD_WIDTH),
      items: p.items,
      emotion,
      shiny
    }
  })

  // save board to local JSON file
  const blob = new Blob([JSON.stringify(board)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "board.json"
  a.click()
  URL.revokeObjectURL(url)
}
