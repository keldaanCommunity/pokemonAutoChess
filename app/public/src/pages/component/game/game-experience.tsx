import React from "react"
import { useTranslation } from "react-i18next"
import { getLevelUpCost } from "../../../../../models/colyseus-models/experience-manager"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { levelClick } from "../../../stores/NetworkStore"
import { getGameScene } from "../../game"
import { Money } from "../icons/money"

export default function GameExperience() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const experienceManager = useAppSelector(
    (state) => state.game.experienceManager
  )
  const isLevelMax = experienceManager.level >= 9
  const specialGameRule = getGameScene()?.room?.state.specialGameRule
  const levelUpCost = getLevelUpCost(specialGameRule)

  return (
    <div className="game-experience">
      <span>
        {t("lvl")} {experienceManager.level}
      </span>
      <button
        className="bubbly orange buy-xp-button"
        title={t("buy_xp_tooltip", { cost: levelUpCost })}
        onClick={() => {
          dispatch(levelClick())
        }}
      >
        <Money value={t("buy_xp", { cost: levelUpCost })} />
      </button>
      <div className="progress-bar">
        <progress
          className="my-progress"
          value={isLevelMax ? 0 : experienceManager.experience}
          max={experienceManager.expNeeded}
        ></progress>
        <span>
          {isLevelMax
            ? "Max Level"
            : experienceManager.experience + "/" + experienceManager.expNeeded}
        </span>
      </div>
    </div>
  )
}
