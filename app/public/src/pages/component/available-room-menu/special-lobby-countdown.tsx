import { t } from "i18next"
import React, { useState, useEffect } from "react"
import { EloRank } from "../../../../../types/Config"
import { formatTimeout } from "../../utils/date"
import { useAppSelector } from "../../../hooks"

export function SpecialLobbyCountdown() {
  const [clock, setClock] = useState<Date>(new Date())
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const nextSpecialLobbyDate = useAppSelector(
    (state) => state.lobby.nextSpecialLobbyDate
  )
  const nextSpecialLobbyType = useAppSelector(
    (state) => state.lobby.nextSpecialLobbyType
  )

  let specialLobbyIcon, specialLobbyName
  if (nextSpecialLobbyType === "GREATBALL_RANKED") {
    specialLobbyName = `${t("elorank." + EloRank.GREATBALL)} ${t(
      "ranked_match"
    )}`
    specialLobbyIcon = (
      <img
        alt={t("minimum_rank")}
        title={t("minimum_rank") + ": " + t("elorank." + EloRank.GREATBALL)}
        className="rank icon"
        src={"/assets/ranks/" + EloRank.GREATBALL + ".svg"}
      />
    )
  } else if (nextSpecialLobbyType === "ULTRABALL_RANKED") {
    specialLobbyName = `${t("elorank." + EloRank.ULTRABALL)} ${t(
      "ranked_match"
    )}`
    specialLobbyIcon = (
      <img
        alt={t("minimum_rank")}
        title={t("minimum_rank") + ": " + t("elorank." + EloRank.ULTRABALL)}
        className="rank icon"
        src={"/assets/ranks/" + EloRank.ULTRABALL + ".svg"}
      />
    )
  }

  const timeUntilNext =
    nextSpecialLobbyDate - Math.floor(clock.getTime() / 1000)

  return nextSpecialLobbyDate && nextSpecialLobbyType && timeUntilNext > 0 ? (
    <p className="special-lobby-announcement">
      {specialLobbyIcon} {specialLobbyName}
      <span>{formatTimeout(timeUntilNext)}</span>
    </p>
  ) : null
}
