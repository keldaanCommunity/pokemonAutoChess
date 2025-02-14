import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IGameRecord } from "../../../../../models/colyseus-models/game-record"
import { IUserMetadata } from "../../../../../models/mongo-models/user-metadata"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Role } from "../../../../../types"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../../../utils/avatar"
import SynergyIcon from "../icons/synergy-icon"
import { EloBadge } from "./elo-badge"
import { RoleBadge } from "./role-badge"
import PokemonPortrait from "../pokemon-portrait"

export default function PlayerBox(props: { user: IUserMetadata, history?: IGameRecord[] }) {
  const { t } = useTranslation()
  const role = useAppSelector((state) => state.network.profile?.role)

  const pokemons: Pkm[] = []
  const [favoritePokemons, setFavoritePokemons] = useState<Pkm[]>([])
  const [favoriteSynergies, setFavoriteSynergies] = useState<Synergy[]>([])

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
          {props.user.banned && <div className="badge banned">{t("banned")}</div>}
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}
          >
            {props.user.displayName}
          </p>
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
            <PokemonPortrait
              key={name}
              avatar={PkmIndex[name] + "/Normal"}
            />
          ))}
        </p>
      </div>
      {(role === Role.ADMIN || role === Role.MODERATOR) && (
        <p style={{ color: "#aaa", fontSize: "60%" }}>
          {t("user_id")}: {props.user.uid}
        </p>
      )}
    </div>
  )
}
