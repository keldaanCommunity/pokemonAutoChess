import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setBoosterContent } from "../../../stores/LobbyStore"
import { openBooster } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { BoosterCard } from "./booster-card"
import "./booster.css"
import { useTranslation } from "react-i18next"

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
      <div className="nes-container">
        <p className="help">
          {numberOfBooster === 0 ? t("boosters_hint") : t("open_boosters_hint")}
        </p>

        <div className="boosters-content">
          {boosterContent.map((pkm, i) => (
            <BoosterCard key={"booster" + i} pkm={pkm} shards={50} />
          ))}
        </div>

        <div className="actions">
          <p>
            <span>{numberOfBooster}</span>
            <img src="/assets/ui/booster.png" alt="booster" />
          </p>
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
        </div>
      </div>
    </div>
  )
}
