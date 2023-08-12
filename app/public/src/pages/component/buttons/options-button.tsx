import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import GameOptionsModal from "../game/game-options-modal"

export function OptionsButton() {
  const { t } = useTranslation()
  const [isOpen, setOpen] = useState<boolean>(false)
  return (
    <>
      <button className="bubbly grey" onClick={() => setOpen(true)}>
        <img src="assets/ui/options.svg" alt="" />
        {t("options")}
      </button>
      <GameOptionsModal
        show={isOpen}
        ingame={false}
        hideModal={() => {
          setOpen(false)
        }}
        leave={() => {
          setOpen(false)
        }}
      />
    </>
  )
}
