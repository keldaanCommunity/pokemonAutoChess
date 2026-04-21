import { useTranslation } from "react-i18next"
import { Role } from "../../../../../types"
import PokemonPortrait from "../pokemon-portrait"
import { RoleBadge } from "./role-badge"

export function InlineAvatar(props: {
  avatar: string
  name: string
  title?: string
  role?: Role
  twitchLogin?: string
  twitchDisplayName?: string
}) {
  const { t } = useTranslation()
  const twitchUrl = props.twitchLogin
    ? `https://www.twitch.tv/${props.twitchLogin}`
    : null
  return (
    <div
      className="inline-avatar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        gap: "0.25em"
      }}
    >
      <PokemonPortrait
        avatar={props.avatar}
        style={{ width: "40px", height: "40px" }}
      />
      {props.title && (
        <span className="player-title">{t(`title.${props.title}`)}</span>
      )}
      <span className="player-name">
        {props.role === Role.BOT ? t(`pkm.${props.name}`) : props.name}
      </span>
      {props.role && <RoleBadge role={props.role} />}
      {twitchUrl && (
        <a
          className="twitch-badge-link"
          href={twitchUrl}
          target="_blank"
          rel="noreferrer"
          title={`Watch ${props.twitchDisplayName ?? props.twitchLogin} on Twitch`}
          aria-label={`Watch ${props.twitchDisplayName ?? props.twitchLogin} on Twitch`}
        >
          <img
            src="/assets/ui/twitch.png"
            width={16}
            height={16}
            alt=""
            aria-hidden="true"
          />
        </a>
      )}
    </div>
  )
}
