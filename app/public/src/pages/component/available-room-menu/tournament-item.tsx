import React from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import {
  ITournament,
  ITournamentPlayer
} from "../../../../../types/interfaces/Tournament"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { formatDate } from "../../utils/date"
import { participateInTournament } from "../../../stores/NetworkStore"
import { getAvatarSrc } from "../../../utils"
import { EloBadge } from "../profile/elo-badge"
import "./tournament-item.css"

export default function TournamentItem(props: { tournament: ITournament }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const uid: string = useAppSelector((state) => state.network.uid)
  const participating = props.tournament.players.has(uid)
  const REGISTRATION_TIME = 60 * 60 * 1000 // 1 hour
  const startTime = new Date(props.tournament.startDate).getTime()
  const registrationsOpen = Date.now() > startTime - REGISTRATION_TIME
  const tournamentStarted = Date.now() > startTime
  const players = [...props.tournament.players.values()]
  const brackets = [...props.tournament.brackets.values()]
  const remainingPlayers = players.filter((p) => !p.eliminated)

  return (
    <div className="tournament-item nes-container">
      <span className="tournament-name">{props.tournament.name}</span>
      {tournamentStarted ? (
        <p>
          {t("stage")}: Quarter finals
          <br />
          {t("players_remaining")}: {remainingPlayers.length}
        </p>
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
          {tournamentStarted && <Tab>{t("score")}</Tab>}
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
              <>
                <p>{bracket.name}</p>
                <ul>
                  {bracket.playersId
                    .map((id) => props.tournament.players.get(id)!)
                    .filter((p) => p != null)
                    .map((p, i) => (
                      <TournamentPlayer
                        player={p}
                        rank={i + 1}
                        showScore={false}
                      />
                    ))}
                </ul>
              </>
            ))}
          </TabPanel>
        )}
        {tournamentStarted && (
          <TabPanel className="score">
            <ul>
              {[...players]
                .sort((a, b) => b.score - a.score)
                .map((p, i) => (
                  <TournamentPlayer player={p} rank={i + 1} showScore={true} />
                ))}
            </ul>
          </TabPanel>
        )}
        {registrationsOpen && (
          <TabPanel className="participants">
            <ul>
              {players.map((p, i) => (
                <TournamentPlayer player={p} rank={i + 1} showScore={false} />
              ))}
            </ul>
          </TabPanel>
        )}
      </Tabs>
    </div>
  )
}

export function TournamentPlayer(props: {
  player: ITournamentPlayer
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
        {props.showScore && (
          <span className="player-ranks">{props.player.ranks.join(", ")}</span>
        )}
      </p>
      {props.showScore ? (
        <span className="player-score">{props.player.score}</span>
      ) : (
        <EloBadge elo={props.player.elo} />
      )}
    </li>
  )
}
