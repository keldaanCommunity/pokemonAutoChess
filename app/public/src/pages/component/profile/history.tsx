import React from "react"
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

export default function History(props: { history: IGameRecord[] }) {
  const { t } = useTranslation()
  return (
    <article className="game-history-list">
      <h2>{t("game_history")}</h2>
      <div>
        {(!props.history || props.history.length === 0) && (
          <p>{t("no_history_found")}</p>
        )}
        {props.history &&
          props.history.map((r) => (
            <div key={r.time} className="nes-container game-history">
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
      </div>
    </article>
  )
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
