import React from "react"
import { useTranslation } from "react-i18next"
import { ILobbyUser } from "../../../../../models/colyseus-models/lobby-user"
import { getPokemonData } from "../../../../../models/precomputed"
import { Role } from "../../../../../types"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import { EloBadge } from "./elo-badge"
import { RoleBadge } from "./role-badge"

export default function PlayerBox(props: { user: ILobbyUser }) {
  const { t } = useTranslation()
  const role = useAppSelector((state) => state.lobby.user?.role)

  const pokemons: Pkm[] = []
  props.user.history.forEach((record) =>
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

  return (
    <div className="player-box">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          <img
            src={getAvatarSrc(props.user.avatar)}
            className="pokemon-portrait"
          />
          {props.user.title && (
            <p className="player-title">{t(`title.${props.user.title}`)}</p>
          )}
          <RoleBadge role={props.user.role} />
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}
          >
            {props.user.name}
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
            <img
              key={name}
              src={getAvatarSrc(PkmIndex[name] + "/Normal")}
              className="pokemon-portrait"
            />
          ))}
        </p>
      </div>
      {role === Role.ADMIN && (
        <p style={{ color: "#aaa", fontSize: "60%" }}>
          {t("user_id")}: {props.user.id}
        </p>
      )}
    </div>
  )
}
