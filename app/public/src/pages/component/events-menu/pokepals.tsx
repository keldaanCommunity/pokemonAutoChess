import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import type { ILeaderboardEventInfo } from "../../../../../types/interfaces/LeaderboardInfo"
import type { IUserMetadataLean } from "../../../../../types/interfaces/UserMetadata"
import {
  useAppDispatch,
  useAppSelector,
  useGameEventResetCountdown
} from "../../../hooks"
import { setEventLeaderboard } from "../../../stores/LobbyStore"
import { selectPal, setPal } from "../../../stores/NetworkStore"
import { formatDuration } from "../../utils/date"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
import PlayerBox from "../profile/player-box"
import { PlayerSearchBar } from "../search/player-search-bar"
import "./pokepals.css"

export function Pokepals() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.network.profile)
  const pal = useAppSelector((state) => state.network.pal)
  const palConfirmed = pal?.eventData?.pal === profile?.uid

  const eventLeaderboard = useAppSelector(
    (state) => state.lobby.eventLeaderboard
  )

  const pairedLeaderboard = useMemo(
    () => pairLeaderboard(eventLeaderboard),
    [eventLeaderboard]
  )

  useEffect(() => {
    function fetchEventLeaderboard() {
      fetch("/leaderboards/event")
        .then((res) => res.json())
        .then((data) => {
          setEventLeaderboard(data)
        })
    }
    fetchEventLeaderboard()
    const interval = setInterval(fetchEventLeaderboard, 60 * 1000 * 10)
    return () => clearInterval(interval)
  }, [])

  
  useEffect(() => {
    // load pal info
    if (profile?.eventData?.pal) {
      fetch(`/players/${profile?.eventData?.pal}`)
        .then((res) => res.json())
        .then((data: IUserMetadataLean) => {
          dispatch(setPal(data))
        })
    } else {
      dispatch(setPal(null))
    }
  }, [profile?.eventData?.pal])

  const changePal = () => {
    dispatch(setPal(null))
    dispatch(selectPal(null))
  }

  const [showHelp, setShowHelp] = useState(false)

  const resetCountdown = useGameEventResetCountdown()

  if (!profile) return null

  return (
    <div className="my-container hidden-scrollable pokepals">
      <header>
        <div style={{ width: "50px", height: "50px" }}></div>
        <p>
          {t("pokepals.title")}
          <br />
          {t("pokepals.team_score", { points: profile?.eventPoints ?? 0 })}
        </p>
        <div className="help button" onClick={() => setShowHelp(!showHelp)}>
          <img src="/assets/ui/help.svg" alt={t("help")} title={t("help")} />
        </div>
      </header>

      <div className="pokepals-pal-info-container">
        <h3>{t("pokepals.your_pal")}</h3>
        {pal ? (
          <>
            <PlayerBox user={pal} />
            {palConfirmed ? (
              <p className="pal-status">✅ {t("pokepals.confirmed")}</p>
            ) : (
              <p className="pal-status">⌛ {t("pokepals.not_confirmed")}</p>
            )}
            {!palConfirmed && (
              <button className="bubbly blue" onClick={changePal}>
                {t("pokepals.change_pal")}
              </button>
            )}
          </>
        ) : (
          <div>
            <p>{t("pokepals.enter_pal_name")}</p>
            <PlayerSearchBar
              onSelect={(user) => dispatch(selectPal(user.id))}
            />
          </div>
        )}
      </div>

      <div className="pokepals-leaderboard-container">
        <h3>{t("pokepals.leaderboard")}</h3>
        <div className="leaderboard-list">
          {pairedLeaderboard.map((team, index) => (
            <div
              key={team.teamId}
              className={cc("leaderboard-item", {
                me: team.idA === profile?.uid || team.idB === profile?.uid
              })}
            >
              <span className="rank">#{team.rank}</span>
              <PokemonPortrait avatar={team.avatarA} />
              <PokemonPortrait avatar={team.avatarB} />
              <span className="player-name">
                {team.nameA}
                {t("and")}
                {team.nameB}
              </span>
              <span className="event-points">
                {t("pokepals.points", { points: team.points })}
              </span>
            </div>
          ))}
          {eventLeaderboard.length === 0 && (
            <div className="no-data">{t("no_data_available")}</div>
          )}
        </div>
      </div>

      {showHelp && (
        <div className="pokepals-help-container my-container">
          <h3>{t("pokepals.instructions")}</h3>
          <div className="help-content">
            <p>{t("pokepals.help1")}</p>
            <p>{t("pokepals.help2")}</p>
            <p style={{ fontStyle: "italic" }}>
              {t("events_reset_info", {
                resetCountdown: formatDuration(resetCountdown)
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface IPairedLeaderboardEventInfo {
  teamId: string
  rank: number
  points: number
  idA: string
  nameA: string
  avatarA: string
  twitchLoginA?: string
  twitchDisplayNameA?: string
  idB: string
  nameB: string
  avatarB: string
  twitchLoginB?: string
  twitchDisplayNameB?: string
}

function pairLeaderboard(
  leaderboard: ILeaderboardEventInfo[]
): IPairedLeaderboardEventInfo[] {
  const teams = new Map<string, ILeaderboardEventInfo[]>()
  for (const player of leaderboard) {
    if (!player.eventData?.pal) continue
    const teamId = [player.eventData?.pal, player.id].sort().join(";")
    teams.set(teamId, (teams.get(teamId) ?? []).concat(player))
  }

  return [...teams.values()]
    .filter((team) => team.length === 2)
    .sort(
      (a, b) =>
        Math.max(b[0].value, b[1].value) - Math.max(a[0].value, a[1].value)
    )
    .map(([playerA, playerB], index) => ({
      teamId: [playerA.id, playerB.id].sort().join(";"),
      rank: index + 1,
      points: Math.max(playerA.value, playerB.value),
      idA: playerA.id,
      nameA: playerA.name,
      avatarA: playerA.avatar,
      twitchLoginA: playerA.twitchLogin,
      twitchDisplayNameA: playerA.twitchDisplayName,
      idB: playerB.id,
      nameB: playerB.name,
      avatarB: playerB.avatar,
      twitchLoginB: playerB.twitchLogin,
      twitchDisplayNameB: playerB.twitchDisplayName
    }))
}

type PalInfo = {
  name: string
  avatar: string
  confirmed: boolean
}
