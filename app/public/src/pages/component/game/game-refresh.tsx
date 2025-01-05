import React from "react"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "../../../hooks"
import { getGameScene } from "../../game"
import { cc } from "../../utils/jsx"
import { Money } from "../icons/money"

export default function GameRefresh() {
  const { t } = useTranslation()
  const shopFreeRolls = useAppSelector((state) => state.game.shopFreeRolls)
  const cost = shopFreeRolls > 0 ? 0 : 1
  return (
    <button
      className={cc("bubbly blue refresh-button", { shimmer: shopFreeRolls > 0 })}
      title={t("refresh_gold_hint")}
      onClick={() => {
        getGameScene()?.refreshShop()
      }}
    >
      <img src={`/assets/ui/refresh.svg`} />
      {cost === 0 ?
        `${t("refresh")} (${shopFreeRolls})`
        : <Money value={`${t("refresh")} ${cost}`} />
      }
    </button>
  )
}
