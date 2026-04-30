import { useTranslation } from "react-i18next"
import {
  ILeaderboardBotInfo,
  ILeaderboardInfo
} from "../../../../../types/interfaces/LeaderboardInfo"
import { searchById } from "../../../network"
import PokemonPortrait from "../pokemon-portrait"
import { EloBadge } from "../profile/elo-badge"

export default function LeaderboardItem(props: {
  item: ILeaderboardInfo | ILeaderboardBotInfo
  isBot: boolean
  noElo: boolean | undefined
}) {
  const { t } = useTranslation()
  const player = props.item as ILeaderboardInfo
  const twitchUrl = player.twitchLogin
    ? `https://www.twitch.tv/${player.twitchLogin}`
    : null

  return (
    <div
      className="player my-box clickable"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
      onClick={() => {
        if (!props.isBot && "id" in props.item) {
          searchById(props.item.id)
        }
      }}
    >
      <div style={{ display: "flex", gap: "5px" }}>
        <span className="player-rank">{props.item.rank}</span>
        <PokemonPortrait avatar={props.item.avatar} />
      </div>
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          padding: "0 0.5em"
        }}
      >
        {props.isBot ? (
          <>
            {t(`pkm.${props.item.name}`)} {t("by")} @
            {(props.item as ILeaderboardBotInfo).author}
          </>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4em"
            }}
          >
            <span>{props.item.name}</span>
            {twitchUrl && (
              <a
                className="twitch-badge-link"
                href={twitchUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  event.stopPropagation()
                }}
                title={`Watch ${player.twitchDisplayName ?? player.twitchLogin} on Twitch`}
                aria-label={`Watch ${player.twitchDisplayName ?? player.twitchLogin} on Twitch`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "var(--cursor-hover)"
                }}
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
          </span>
        )}
      </span>
      <div style={{ width: "8ch", textAlign: "end" }}>
        {props.noElo ? props.item.value : <EloBadge elo={props.item.value} />}
      </div>
    </div>
  )
}
