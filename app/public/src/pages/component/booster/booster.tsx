import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { DUST_PER_BOOSTER, DUST_PER_SHINY } from "../../../../../types/Config"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setBoosterContent } from "../../../stores/LobbyStore"
import { openBooster } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { BoosterCard } from "./booster-card"
import "./booster.css"

export default function Booster() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { user, boosterContent } = useAppSelector((state) => ({
    user: state.lobby.user,
    boosterContent: state.lobby.boosterContent
  }))

  const numberOfBooster = user ? user.booster : 0

  // reset current boosters on close
  useEffect(
    () => () => {
      dispatch(setBoosterContent([]))
    },
    [dispatch]
  )

  return (
    <div id="boosters-page">
      <div className="my-container custom-bg">
        <p className="help">
          {numberOfBooster === 0 ? t("boosters_hint") : t("open_boosters_hint")}
        </p>

        <div className="boosters-content">
          {boosterContent.map((pkm, i) => (
            <BoosterCard
              key={"booster" + i}
              pkm={pkm}
              shards={pkm.shiny ? DUST_PER_SHINY : DUST_PER_BOOSTER}
            />
          ))}
        </div>

        <div className="actions">
          <button
            onClick={() => {
              if (numberOfBooster > 0) {
                dispatch(setBoosterContent([]))
                dispatch(openBooster())
              }
            }}
            className={cc("bubbly", { blue: numberOfBooster > 0 })}
            disabled={numberOfBooster <= 0}
          >
            {t("open_booster")}
          </button>
          <span className="booster-count">{numberOfBooster}</span>
          <img src="/assets/ui/booster.png" alt="booster" />
        </div>
      </div>
    </div>
  )
}
