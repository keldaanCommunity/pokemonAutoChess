import React from "react"
import { useTranslation } from "react-i18next"

export default function PolicyButton() {
  const { t } = useTranslation()
  return (
    <a
      href="https://github.com/keldaanCommunity/pokemonAutoChess/blob/master/policy.md"
      target="_blank"
    >
      <button type="button" className="bubbly dark">
        <img width={32} height={32} src={`assets/ui/meta.svg`} />
        {t("policy")}
      </button>
    </a>
  )
}
