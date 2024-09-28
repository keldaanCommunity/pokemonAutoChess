import React from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { lockClick } from "../../../stores/NetworkStore"

export default function GameLock() {
  const { t } = useTranslation()
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
