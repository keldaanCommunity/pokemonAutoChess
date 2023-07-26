import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { lockClick } from "../../../stores/NetworkStore"
import { t } from "i18next"

export default function GameLock() {
  const dispatch = useAppDispatch()
  const shopLocked = useAppSelector((state) => state.game.shopLocked)

  return (
    <button
      className={`bubbly lock-icon ${shopLocked ? "red" : "green"}`}
      onClick={() => {
        dispatch(lockClick())
      }}
      title={`${shopLocked ? t("unlock") : t("lock")} ${t(
        "current_shop_for_next_turn"
      )}`}
    >
      <img
        src={`/assets/ui/lock-${shopLocked ? "close" : "open"}.svg`}
        alt={`${shopLocked ? "Locked" : "Unlocked"}`}
      />
    </button>
  )
}
