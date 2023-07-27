import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setBoosterContent } from "../../../stores/LobbyStore"
import { openBooster } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { BoosterCard } from "./booster-card"
import "./booster.css"
import { t } from "i18next"

export default function Booster(props: { toggle: () => void }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.lobby.user)
  const numberOfBooster = user ? user.booster : 0
  const boosterContent = useAppSelector((state) => state.lobby.boosterContent)

  return (
    <div id="boosters-page">
      <button
        onClick={() => {
          dispatch(setBoosterContent([]))
          props.toggle()
        }}
        className="bubbly blue"
      >
        {t("back_to_lobby")}
      </button>
      <div className="nes-container">
        <p className="help">
          {numberOfBooster === 0 ? t("boosters_hint") : t("open_boosters_hint")}
        </p>
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
        <div className="boosters-content">
          {boosterContent.map((pkm, i) => (
            <BoosterCard key={"booster" + i} pkm={pkm} shards={50} />
          ))}
        </div>
      </div>
    </div>
  )
}
