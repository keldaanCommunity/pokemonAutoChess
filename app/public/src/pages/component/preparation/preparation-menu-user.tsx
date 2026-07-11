import { useTranslation } from "react-i18next"
import type { IGameUser } from "../../../../../models/colyseus-models/game-user"
import { Role } from "../../../../../types"
import { GameMode } from "../../../../../types/enum/Game"
import { useAppSelector } from "../../../hooks"
import { kick, removeBot, selectPartner } from "../../../network"
import { preference } from "../../../preferences"
import { RemoveButton } from "../buttons/remove-button"
import { EloBadge } from "../profile/elo-badge"
import { InlineAvatar } from "../profile/inline-avatar"
import "./preparation-menu-user.css"

export default function PreparationMenuUser(props: {
  key: string
  user: IGameUser
  isOwner: boolean
  ownerId: string
  colorIndex?: number
}) {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.preparation.user)
  const canKick =
    props.isOwner || (user && [Role.MODERATOR, Role.ADMIN].includes(user.role))

  const removeButton = props.user.isBot ? (
    <RemoveButton
      onClick={() => removeBot(props.user.uid)}
      title={t("remove_bot")}
    />
  ) : canKick && props.user.uid !== user?.uid ? (
    <RemoveButton
      onClick={() => {
        if (confirm(`Kick ${props.user.name} ?`)) {
          kick(props.user.uid)
        }
      }}
      title={t("kick_user")}
    />
  ) : null
  const gameMode = useAppSelector((state) => state.preparation.gameMode)
  const users = useAppSelector((state) => state.preparation.users)
  const myUid = user?.uid
  const isDoubleUp = gameMode === GameMode.DOUBLE_UP
  const isMe = props.user.uid === myUid
  const myPartner = users.find((u) => u.uid === myUid)?.doubleUpPartnerId
  const isPaired = myPartner === props.user.uid
  const DOUBLE_UP_TEAM_COLORS = ["#f9e07f", "#f4a7b9", "#a8e6e6", "#b8e6a0"]
  const teamColor = isDoubleUp
    ? DOUBLE_UP_TEAM_COLORS[
        (props.colorIndex ?? 0) % DOUBLE_UP_TEAM_COLORS.length
      ]
    : undefined
  const myReady = users.find((u) => u.uid === myUid)?.ready

  return (
    <div
      className={`my-container player my-box preparation-menu-user ${
        props.user.ready ? "ready" : "not-ready"
      }`}
      style={
        isDoubleUp
          ? {
              borderColor: teamColor,
              position: "relative"
            }
          : undefined
      }
    >
      <EloBadge elo={props.user?.elo} />
      <InlineAvatar
        avatar={props.user?.avatar}
        name={props.user?.name}
        title={props.user?.title}
        role={props.user?.role}
        twitchLogin={props.user?.twitchLogin || undefined}
        twitchDisplayName={props.user?.twitchDisplayName || undefined}
      />
      {preference("colorblindMode") && props.user.ready && t("ready")}
      {isDoubleUp && props.user.ready && (
        <span
          style={{
            color: "#76c442",
            fontSize: "1.2em",
            textShadow: "0 0 4px black"
          }}
        >
          ✔
        </span>
      )}
      {isDoubleUp && !isMe && !myReady && !isPaired && (
        <button
          className="bubbly orange"
          onClick={() => !props.user.ready && selectPartner(props.user.uid)}
          style={
            props.user.ready
              ? { opacity: 0.5, cursor: "not-allowed" }
              : undefined
          }
        >
          Partner?
        </button>
      )}
      {removeButton}
    </div>
  )
}
