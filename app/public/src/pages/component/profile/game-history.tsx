import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ArraySchema } from "@colyseus/schema"
import {
  IGameRecord,
  IPokemonRecord
} from "../../../../../models/colyseus-models/game-record"
import { computeSynergies } from "../../../../../models/colyseus-models/synergies"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { SynergyTriggers } from "../../../../../types/Config"
import { Synergy } from "../../../../../types/enum/Synergy"
import { formatDate } from "../../utils/date"
import Team from "../after/team"
import SynergyIcon from "../icons/synergy-icon"
import { EloBadge } from "./elo-badge"
import "./game-history.css"

export default function GameHistory(props: { uid: string, onUpdate?: (history: IGameRecord[]) => void }) {
  const { t } = useTranslation();
  const [gameHistory, setGameHistory] = useState<IGameRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    if (props.onUpdate) {
      props.onUpdate(gameHistory)
    }
  }, [gameHistory, props.onUpdate])

  const pageSize = 10
  const loadHistory = async (uid: string, page: number) => {
    try {
      setLoading(true)

      const response = await fetch(`/game-history/${uid}?page=${page}&t=${Date.now()}`)
      const data: IGameRecord[] = await response.json()
      if (props.uid !== uid) return // ignore response if uid changed in the meantime

      if (data.length < pageSize) {
        setHasMore(false); // No more data to load
      }

      setGameHistory((prevHistory) => [...prevHistory, ...data.filter(h => prevHistory.some(p => p.time == h.time) == false)])
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
  };

  useEffect(() => {
    // reset history on uid change
    setGameHistory([])
    setHasMore(true)
    loadHistory(props.uid, 1) // load last 10 games history
  }, [props.uid])

  return (
    <article className="game-history-list">
      <h2>{t("game_history")}</h2>
      <div>
        {(!gameHistory || gameHistory.length === 0) && (
          <p>{t("no_history_found")}</p>
        )}
        {gameHistory &&
          gameHistory.map((r) => (
            <div key={r.time} className="my-box game-history">
              <span className="top">
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
          ))}
        {hasMore && (
          <button onClick={loadMore} className="bubbly green" disabled={loading}>
            {loading ? t("loading") : t("load_more")}
          </button>
        )}
      </div>
    </article>
  );
}

function getTopSynergies(team: IPokemonRecord[] | ArraySchema<IPokemonRecord>): [Synergy, number][] {
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
      const aReachedTrigger = a[1] >= SynergyTriggers[a[0]][0]
      const bReachedTrigger = b[1] >= SynergyTriggers[b[0]][0]
      return aReachedTrigger && !bReachedTrigger
        ? -1
        : bReachedTrigger && !aReachedTrigger
          ? +1
          : b[1] - a[1]
    })
    .slice(0, 3)
  return topSynergies
}
