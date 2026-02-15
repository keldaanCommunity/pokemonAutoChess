import React from "react"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "../../../hooks"
import { lockShop } from "../../../network"

export default function GameLock() {
  const { t } = useTranslation()
  const shopLocked = useAppSelector((state) => state.game.shopLocked)

  return (
    <button
      className={`bubbly lock-icon ${shopLocked ? "red" : "green"}`}
      onClick={() => lockShop()}
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
