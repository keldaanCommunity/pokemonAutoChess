import React, { useEffect, useState } from "react"
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
  const user = useAppSelector((state) => state.network.profile)
  const boosterContent = useAppSelector((state) => state.lobby.boosterContent)
  const numberOfBooster = user ? user.booster : 0

  const [flippedStates, setFlippedStates] = useState<boolean[]>([])

  useEffect(() => {
    setFlippedStates(new Array(boosterContent.length).fill(false))
  }, [boosterContent])

  // reset current boosters on close
  useEffect(
    () => () => {
      dispatch(setBoosterContent([]))
    },
    [dispatch]
  )

  function onClickOpenBooster() {
    if (flippedStates.some((flipped) => !flipped)) {
      setFlippedStates(new Array(boosterContent.length).fill(true))
    }
    else if (numberOfBooster > 0) {
      dispatch(setBoosterContent([]))
      dispatch(openBooster())
    }
  }

  const handleFlip = (index: number) => {
    setFlippedStates((prev) => prev.with(index, !prev[index]))
  }

  return (
    <div id="boosters-page">
      <p className="help">
        {numberOfBooster === 0 ? t("boosters_hint") : t("open_boosters_hint")}
      </p>

      <div className="boosters-content">
        {boosterContent.map((pkm, i) => (
          <BoosterCard
            key={"booster" + i}
            pkm={pkm}
            shards={pkm.shiny ? DUST_PER_SHINY : DUST_PER_BOOSTER}
            flipped={flippedStates[i]}
            onFlip={() => handleFlip(i)}
          />
        ))}
      </div>

      <div className="actions">
        <button
          onClick={onClickOpenBooster}
          className={cc("bubbly", { blue: numberOfBooster > 0 })}
          disabled={numberOfBooster <= 0}
        >
          {t("open_booster")}
        </button>
        <span className="booster-count">{numberOfBooster}</span>
        <img src="/assets/ui/booster.png" alt="booster" />
      </div>
    </div>
  )
}
