import { t } from "i18next"
import React, { useEffect, useState } from "react"
import { EloRank } from "../../../../../types/enum/EloRank"
import { GameMode } from "../../../../../types/enum/Game"
import { useAppSelector } from "../../../hooks"
import { formatTimeout } from "../../utils/date"

export function SpecialGameCountdown() {
  const [clock, setClock] = useState<Date>(new Date())
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const nextSpecialGame = useAppSelector((state) => state.lobby.nextSpecialGame)
  if (nextSpecialGame === null) return null

  let specialGameIcon, specialGameName
  if (nextSpecialGame.mode === GameMode.RANKED) {
    specialGameName = `${t("elorank." + EloRank.GREATBALL)} ${t(
      "ranked_match"
    )}`
    specialGameIcon = (
      <img
        alt={t("minimum_rank")}
        title={t("minimum_rank") + ": " + t("elorank." + EloRank.GREATBALL)}
        className="rank icon"
        src={"/assets/ranks/" + EloRank.GREATBALL + ".svg"}
      />
    )
  } else if (nextSpecialGame.mode === GameMode.SCRIBBLE) {
    specialGameName = t("smeargle_scribble")
    specialGameIcon = (
      <img
        alt={t("smeargle_scribble")}
        title={t("smeargle_scribble_hint")}
        className="scribble icon"
        src={"/assets/ui/scribble.png"}
        style={{ borderRadius: "50%" }}
      />
    )
  }

  let timeUntilNext = -1
  if (nextSpecialGame.date) {
    timeUntilNext = Math.floor(
      (new Date(nextSpecialGame.date).getTime() - clock.getTime()) / 1000
    )
  }

  return nextSpecialGame.date && nextSpecialGame.mode && timeUntilNext > 0 ? (
    <p className="special-game-announcement">
      {specialGameIcon} {specialGameName}
      <span>{formatTimeout(timeUntilNext)}</span>
    </p>
  ) : null
}
