import React from "react"
import { useAppDispatch } from "../../../hooks"
import { refreshClick } from "../../../stores/NetworkStore"
import { Money } from "../icons/money"
import { useTranslation } from "react-i18next"

export default function GameRefresh() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  return (
    <button
      className="bubbly blue refresh-button"
      title={t("refresh_gold_hint")}
      onClick={() => {
        dispatch(refreshClick())
      }}
    >
      <img src={`/assets/ui/refresh.svg`} />
      <Money value={t("refresh") + " 1"} />
    </button>
  )
}
