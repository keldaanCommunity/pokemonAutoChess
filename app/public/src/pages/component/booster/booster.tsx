import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { throttle } from "../../../../../utils/function"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { openBooster } from "../../../network"
import { setBoosterContent } from "../../../stores/LobbyStore"
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
  const [loading, setLoading] = useState(false)
  const [isThrottled, setIsThrottled] = useState(false)
  const THROTTLE_DURATION = 2000

  useEffect(() => {
    setFlippedStates(new Array(boosterContent.length).fill(false))
  }, [boosterContent])

  // reset current boosters on close
  useEffect(
    () => () => {
      dispatch(setBoosterContent([]))
      setLoading(false)
    },
    [dispatch]
  )

  useEffect(() => {
    if (boosterContent.length > 0) {
      setLoading(false)
    }
  }, [boosterContent])

  const throttledBoosterOpen = useRef(
    throttle(() => {
      dispatch(setBoosterContent([]))
      openBooster()
      setLoading(true)
    }, THROTTLE_DURATION)
  ).current

  const allCardsFlipped = flippedStates.every((flipped) => flipped)

  function onClickOpenBooster() {
    if (!allCardsFlipped) {
      setFlippedStates(new Array(boosterContent.length).fill(true))
    } else if (numberOfBooster > 0 && !isThrottled) {
      throttledBoosterOpen()
      setIsThrottled(true)
      setTimeout(() => setIsThrottled(false), THROTTLE_DURATION)
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
        {boosterContent.map((card, i) => (
          <BoosterCard
            key={"booster" + i}
            card={card}
            flipped={flippedStates[i]}
            onFlip={() => handleFlip(i)}
          />
        ))}
      </div>

      <div className="actions">
        <button
          onClick={onClickOpenBooster}
          className={cc("bubbly", { blue: numberOfBooster > 0 })}
          disabled={
            numberOfBooster <= 0 || loading || (allCardsFlipped && isThrottled)
          }
        >
          {t("open_booster")}
        </button>
        <span className="booster-count">{numberOfBooster}</span>
        <img src="/assets/ui/booster.png" alt="booster" />
      </div>
    </div>
  )
}
