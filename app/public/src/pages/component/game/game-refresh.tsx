import React from "react"
import { useTranslation } from "react-i18next"
import { getGameScene } from "../../game"
import { Money } from "../icons/money"

export default function GameRefresh() {
  const { t } = useTranslation()
  return (
    <button
      className="bubbly blue refresh-button"
      title={t("refresh_gold_hint")}
      onClick={() => {
        getGameScene()?.refreshShop()
      }}
    >
      <img src={`/assets/ui/refresh.svg`} />
      <Money value={t("refresh") + " 1"} />
    </button>
  )
}
