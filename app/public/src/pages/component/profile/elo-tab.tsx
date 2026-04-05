import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  CRON_ELO_DECAY_DELAY,
  ELO_DECAY_LOST_PER_DAY,
  ELO_DECAY_NB_GAMES_REQUIRED,
  EloRankThreshold
} from "../../../../../config"
import { IGameRecord } from "../../../../../models/colyseus-models/game-record"
import { EloRank } from "../../../../../types/enum/EloRank"
import { GameMode } from "../../../../../types/enum/Game"
import { getRank } from "../../../../../utils/elo"
import { useAppSelector } from "../../../hooks"

export function EloTab() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.network.profile)

  const rank = user ? getRank(user.elo) : null
  const [gameHistory, setGameHistory] = useState<IGameRecord[]>([])

  const isDecaying = useMemo(() => {
    return (
      gameHistory.length < ELO_DECAY_NB_GAMES_REQUIRED ||
      Date.now() - gameHistory[ELO_DECAY_NB_GAMES_REQUIRED - 1].time >
        CRON_ELO_DECAY_DELAY
    )
  }, [gameHistory])

  const eloDecayTime = useMemo(() => {
    if (gameHistory.length < ELO_DECAY_NB_GAMES_REQUIRED) {
      return 0
    }
    const nextDecayTime =
      gameHistory[ELO_DECAY_NB_GAMES_REQUIRED - 1].time + CRON_ELO_DECAY_DELAY
    const timeLeft = nextDecayTime - Date.now()
    return timeLeft
  }, [gameHistory])

  const loadHistory = async (uid: string, page: number) => {
    try {
      const requiresRanked = user
        ? user.elo >= EloRankThreshold[EloRank.ULTRA_BALL]
        : false

      const response = await fetch(
        `/game-history/${uid}?page=${page}&t=${Date.now()}${requiresRanked ? `&gameMode=${GameMode.RANKED}` : ""}`
      )
      const data: IGameRecord[] = await response.json()
      if (user?.uid !== uid) return // ignore response if uid changed in the meantime

      console.log("Loaded game history page", page, data)
      setGameHistory(data)
    } catch (error) {
      console.error("Failed to load history:", error)
    }
  }

  useEffect(() => {
    // reset history on uid change
    setGameHistory([])
    if (user) {
      loadHistory(user.uid, 1)
    }
  }, [user?.uid])

  return user ? (
    <div className="elo-tab">
      <p>{t("rank")}:</p>
      <img
        style={{
          display: "block",
          margin: "0 auto",
          width: "200px",
          maxWidth: "100%"
        }}
        src={"assets/ranks/" + rank + ".svg"}
        alt={t("elorank." + rank)}
        title={t("elorank." + rank)}
      />
      <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
        {t("elorank." + rank)}
      </p>
      <p>
        {t("profile_menu.elo_tab.current_elo")}: {user.elo}
      </p>
      <p>
        {t("profile_menu.elo_tab.max_elo_reached")}: {user.maxElo}
      </p>
      <p>
        {t("profile_menu.elo_tab.elo_decay_info", {
          eloLoss: ELO_DECAY_LOST_PER_DAY
        })}
      </p>
      <p style={{ whiteSpace: "pre-line" }}>
        {isDecaying
          ? t("profile_menu.elo_tab.elo_decay_active")
          : t("profile_menu.elo_tab.elo_decay_inactive", {
              time: new Date(
                Date.now() + (eloDecayTime ?? 0)
              ).toLocaleDateString()
            })}
      </p>
    </div>
  ) : null
}
