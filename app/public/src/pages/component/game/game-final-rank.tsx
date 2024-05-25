import React from "react"
import { useTranslation } from "react-i18next"
import { getRankLabel } from "../../../../../types/strings/Strings"
import "./game-final-rank.css"

export default function GameFinalRank(props: {
  rank: number
  visible: boolean
  hide: () => void
  leave: () => void
}) {
  const { t } = useTranslation()
  return props.visible ? (
    <div className="game-final-rank">
      <div className="my-container">
        {props.rank === 0 && (
          <p className="waiting">{t("waiting_final_rank")}</p>
        )}
        {props.rank > 0 && (
          <>
            <p className="rank">{getRankLabel(props.rank)}</p>
            <div className="actions">
              <button className="bubbly blue" onClick={props.hide}>
                {t("stay_till_the_end")}
              </button>
              <button className="bubbly red" onClick={props.leave}>
                {t("leave_game")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null
}
