import { ArraySchema } from "@colyseus/schema"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { List, useDynamicRowHeight } from "react-window"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { SynergyTriggers } from "../../../../../config"
import {
  IGameRecord,
  IPokemonRecord
} from "../../../../../models/colyseus-models/game-record"
import { computeSynergies } from "../../../../../models/colyseus-models/synergies"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Synergy } from "../../../../../types/enum/Synergy"
import { formatDate } from "../../utils/date"
import Team from "../after/team"
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
      <div style={{ flex: 1, minHeight: 0 }}>
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
                    gameHistory,
                    t
                  }}
                  onRowsRendered={handleRowsRendered}
                />
              )
            }}
          />
        )}
      </div>
    </article>
  )
}

type HistoryRowData = {
  gameHistory: IGameRecord[]
  t: (key: string) => string
}

function GameHistoryRow({
  index,
  style,
  gameHistory,
  t
}: {
  ariaAttributes: object
  index: number
  style: React.CSSProperties
} & HistoryRowData): React.ReactElement | null {
  const r = gameHistory[index]

  return (
    <div style={style}>
      <div className="my-box game-history">
        <span className="top">
          <GameModeIcon gameMode={r.gameMode} />
          {t("top")} {r.rank}
        </span>
        <EloBadge elo={r.elo} />
        <ul className="synergies">
          {getTopSynergies(r.pokemons).map(([type, value]) => (
            <li key={r.time + type}>
              <SynergyIcon type={type} />
              <span>{value}</span>
            </li>
          ))}
        </ul>
        <p className="date">{formatDate(r.time)}</p>
        <Team team={r.pokemons}></Team>
      </div>
    </div>
  )
}

function getTopSynergies(
  team: IPokemonRecord[] | ArraySchema<IPokemonRecord>
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

  const topSynergies = [...synergies.entries()]
    .sort((a, b) => {
      const [typeA, valueA] = a
      const [typeB, valueB] = b
      const aTriggerReached = SynergyTriggers[typeA].filter(
        (n) => valueA >= n
      ).length
      const bTriggerReached = SynergyTriggers[typeB].filter(
        (n) => valueB >= n
      ).length
      return aTriggerReached !== bTriggerReached
        ? bTriggerReached - aTriggerReached
        : valueB - valueA
    })
    .slice(0, 4)
  return topSynergies
}
