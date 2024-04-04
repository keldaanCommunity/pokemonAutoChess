import React from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { formatDate } from "../../utils/date"
import { participateInTournament } from "../../../stores/NetworkStore"
import { getAvatarSrc } from "../../../utils"
import { EloBadge } from "../profile/elo-badge"
import { getTournamentStage } from "../../../../../core/tournament-logic"
import "./tournament-item.css"
import { values } from "../../../../../utils/schemas"
import {
  TournamentPlayerSchema,
  TournamentSchema
} from "../../../../../models/colyseus-models/tournament"
import { average } from "../../../../../utils/number"

export default function TournamentItem(props: {
  tournament: TournamentSchema
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const uid: string = useAppSelector((state) => state.network.uid)
  const participating = props.tournament.players.has(uid)
  const REGISTRATION_TIME = 60 * 60 * 1000 // 1 hour
  const startTime = new Date(props.tournament.startDate).getTime()
  const registrationsOpen = Date.now() > startTime - REGISTRATION_TIME
  const tournamentStarted = Date.now() > startTime
  const players = values(props.tournament.players)
  const brackets = values(props.tournament.brackets)
  const remainingPlayers = players.filter((p) => !p.eliminated)

  return (
    <div className="tournament-item nes-container">
      <span className="tournament-name">{props.tournament.name}</span>
      {tournamentStarted ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            {t("stage")}: {getTournamentStage(props.tournament)}
          </span>
          <span>
            {t("players_remaining")}: {remainingPlayers.length}
          </span>
        </div>
      ) : (
        <p>
          {t("starts_at")}{" "}
          {formatDate(new Date(props.tournament.startDate), {
            dateStyle: "long"
          })}
        </p>
      )}
      {!tournamentStarted && (
        <div className="actions">
          {participating ? (
            <button
              className="participate-btn bubbly green"
              title={t("cancel_tournament_participation")}
              disabled={!registrationsOpen}
              onClick={() => {
                dispatch(
                  participateInTournament({
                    tournamentId: props.tournament.id,
                    participate: false
                  })
                )
              }}
            >
              {t("participating")}
            </button>
          ) : (
            <button
              className="participate-btn bubbly blue"
              title={t("register_tournament_participation")}
              disabled={!registrationsOpen}
              onClick={() => {
                dispatch(
                  participateInTournament({
                    tournamentId: props.tournament.id,
                    participate: true
                  })
                )
              }}
            >
              {t("participate")}
            </button>
          )}
        </div>
      )}
      <Tabs>
        <TabList>
          {tournamentStarted && <Tab>{t("brackets")}</Tab>}
          {tournamentStarted && <Tab>{t("ranking")}</Tab>}
          {registrationsOpen && (
            <Tab>
              {t("participants")} ({players.length})
            </Tab>
          )}
        </TabList>
        {!registrationsOpen && <p>{t("registrations_open_info")}</p>}
        {tournamentStarted && (
          <TabPanel className="brackets">
            <p>Brackets</p>
            {brackets.map((bracket) => (
              <div className="bracket" key={bracket.name}>
                <p>{bracket.name}</p>
                <ul>
                  {values(bracket.playersId)
                    .map((id) => props.tournament.players.get(id)!)
                    .filter((p) => p != null)
                    .map((p, i) => (
                      <TournamentPlayer
                        key={"player" + i}
                        player={p}
                        rank={i + 1}
                        showScore={false}
                      />
                    ))}
                </ul>
              </div>
            ))}
          </TabPanel>
        )}
        {tournamentStarted && (
          <TabPanel className="ranking">
            <ul>
              {[...players]
                .sort(
                  (a, b) =>
                    average(...values(a.ranks)) - average(...values(b.ranks))
                )
                .map((p, i) => (
                  <TournamentPlayer
                    key={"player" + i}
                    player={p}
                    rank={i + 1}
                    showScore={true}
                  />
                ))}
            </ul>
          </TabPanel>
        )}
        {registrationsOpen && (
          <TabPanel className="participants">
            <ul>
              {players.map((p, i) => (
                <TournamentPlayer
                  key={"player" + i}
                  player={p}
                  rank={i + 1}
                  showScore={false}
                />
              ))}
            </ul>
          </TabPanel>
        )}
      </Tabs>
    </div>
  )
}

export function TournamentPlayer(props: {
  player: TournamentPlayerSchema
  rank: number
  showScore: boolean
}) {
  return (
    <li className="player-box">
      {props.showScore && <span className="player-rank">{props.rank}</span>}
      <img
        src={getAvatarSrc(props.player.avatar)}
        className="pokemon-portrait"
      />
      <p>
        <span className="player-name">{props.player.name}</span>
      </p>
      {props.showScore ? (
        <span className="player-ranks">{props.player.ranks.join(", ")}</span>
      ) : (
        <EloBadge elo={props.player.elo} />
      )}
    </li>
  )
}
