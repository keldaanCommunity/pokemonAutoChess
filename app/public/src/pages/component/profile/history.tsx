import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
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
import "./history.css"

export default function History(props: { history: IGameRecord[]; uid: string }) {
  const { t } = useTranslation();
  const [gameHistory, setGameHistory] = useState<IGameRecord[]>(props.history);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const uid = props.uid
      const skip = gameHistory.length
      const limit = 10
      const page = Math.floor(skip / limit + 1)

      const response = await fetch(`/game-history/${uid}?page=${page}`)
      const data: IGameRecord[] = await response.json()

      if (data.length < limit) {
        setHasMore(false); // No more data to load
      }

      setGameHistory((prevHistory) => [...prevHistory, ...data])
    } catch (error) {
      console.error("Failed to load more history:", error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    setGameHistory(props.history) // Update game history when props change
  }, [props.history])

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
                {getTopSynergies(r.pokemons.map(p=>p)).map(([type, value]) => (
                  <li key={r.time + type}>
                    <SynergyIcon type={type} />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
              <p className="date">{formatDate(r.time)}</p>
              <Team team={r.pokemons.map(p=>p)}></Team>
            </div>
          ))}
      </div>
      {hasMore && (
        <button onClick={loadMore} className="bubbly green" disabled={loading}>
          {loading ? t("loading") : t("load_more")}
        </button>
      )}
    </article>
  );
}

function getTopSynergies(team: IPokemonRecord[]): [Synergy, number][] {
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
