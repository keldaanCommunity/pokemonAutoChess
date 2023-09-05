import React from "react"
import {
  IGameRecord,
  IPokemonRecord
} from "../../../../../models/colyseus-models/game-record"
import Elo from "../elo"
import Team from "../after/team"
import SynergyIcon from "../icons/synergy-icon"
import { formatDate } from "../../utils/date"
import { Synergy } from "../../../../../types/enum/Synergy"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import {
  addSynergiesFromStones,
  computeSynergies
} from "../../../../../models/colyseus-models/synergies"
import "./history.css"
import { useTranslation } from "react-i18next"

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
              <Elo elo={r.elo} />
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
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
  return topSynergies
}
