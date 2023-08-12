import { t } from "i18next"
import React from "react"

export default function PolicyButton() {
  return (
    <a
      href="https://github.com/keldaanCommunity/pokemonAutoChess/blob/master/policy.md"
      target="_blank"
    >
      <button type="button" className="bubbly">
        {t("policy")}
      </button>
    </a>
  )
}
