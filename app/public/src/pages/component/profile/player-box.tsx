import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IGameRecord } from "../../../../../models/colyseus-models/game-record"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Role } from "../../../../../types"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import {
  IUserMetadataClient,
  IUserMetadataUnpacked
} from "../../../../../types/interfaces/UserMetadata"
import { useAppSelector } from "../../../hooks"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
import { EloBadge } from "./elo-badge"
import { RoleBadge } from "./role-badge"

export default function PlayerBox(props: {
  user: IUserMetadataClient | IUserMetadataUnpacked
  history?: IGameRecord[]
}) {
  const { t } = useTranslation()
  const role = useAppSelector((state) => state.network.profile?.role)

  const pokemons: Pkm[] = []
  const [favoritePokemons, setFavoritePokemons] = useState<Pkm[]>([])
  const [favoriteSynergies, setFavoriteSynergies] = useState<Synergy[]>([])
  const twitchUrl = props.user.twitchLogin
    ? `https://www.twitch.tv/${props.user.twitchLogin}`
    : null
  const youtubeUrl = props.user.youtubeHandle
    ? `https://www.youtube.com/${props.user.youtubeHandle}`
    : props.user.youtubeChannelId
      ? `https://www.youtube.com/channel/${props.user.youtubeChannelId}`
      : null

  useEffect(() => {
    if (!props.history) return
    props.history.forEach((record) =>
      pokemons.push(...record.pokemons.map((p) => p.name.toUpperCase() as Pkm))
    )
    const countPokemons = new Map()
    const countSynergies = new Map()
    pokemons.forEach((p) => {
      countPokemons.set(p, (countPokemons.get(p) ?? 0) + 1)
      getPokemonData(p).types.forEach((type) => {
        countSynergies.set(type, (countSynergies.get(type) ?? 0) + 1)
      })
    })
    const favoritePokemons = [...countPokemons.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, v]) => k)
    const favoriteSynergies = [...countSynergies.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, v]) => k)

    setFavoritePokemons(favoritePokemons)
    setFavoriteSynergies(favoriteSynergies)
  }, [props.history])

  return (
    <div className="player my-box">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          <PokemonPortrait avatar={props.user.avatar} />
          {props.user.title && (
            <p className="player-title">{t(`title.${props.user.title}`)}</p>
          )}
          <RoleBadge role={props.user.role} />
          {props.user.banned && (
            <div className="badge banned">{t("banned")}</div>
          )}
          <p
            className="player-display-name"
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}
          >
            {props.user.displayName}
          </p>
          {twitchUrl && (
            <a
              className="twitch-badge-link"
              href={twitchUrl}
              target="_blank"
              rel="noreferrer"
              title={`Watch ${props.user.twitchDisplayName ?? props.user.twitchLogin} on Twitch`}
              aria-label={`Watch ${props.user.twitchDisplayName ?? props.user.twitchLogin} on Twitch`}
            >
              <img src="/assets/ui/twitch.png" alt="" aria-hidden="true" />
            </a>
          )}
          {youtubeUrl && (
            <a
              className="twitch-badge-link"
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              title={`Watch ${props.user.youtubeChannelTitle ?? props.user.displayName} on YouTube`}
              aria-label={`Watch ${props.user.youtubeChannelTitle ?? props.user.displayName} on YouTube`}
            >
              <img src="/assets/ui/youtube.png" alt="" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <EloBadge elo={props.user.elo} />
        </div>
        <p>
          {t("level")} {props.user.level} ({props.user.exp} / 1000)
        </p>
        <p>
          {t("wins")}: {props.user.wins}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <p> {t("favorites")}:</p>
        <p>
          {favoriteSynergies.map((type) => (
            <SynergyIcon type={type} key={"fav_" + type} />
          ))}
        </p>
        <p>
          {favoritePokemons.map((name) => (
            <PokemonPortrait key={name} avatar={PkmIndex[name] + "/Normal"} />
          ))}
        </p>
      </div>
      {(role === Role.ADMIN || role === Role.MODERATOR) && (
        <p style={{ color: "#aaa", fontSize: "60%" }}>
          {t("profile.account.user_id")}: {props.user.uid}
        </p>
      )}
    </div>
  )
}
