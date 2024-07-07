import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { loadPreferences, savePreferences } from "../../../preferences"
import { getGameScene } from "../../game"
import { cc } from "../../utils/jsx"

import "./keybind-info.css"

export default function KeybindInfo() {
  const { t } = useTranslation()
  const preferences = loadPreferences()
  const [keyRemapped, setKeyRemapped] = useState<string | null>(null)

  function onKeydown(e: KeyboardEvent) {
    if (keyRemapped === null) return
    const key = e.key.toUpperCase()
    if (key === "ESCAPE") {
      setKeyRemapped(null)
      return
    }
    preferences.keybindings[keyRemapped] = key
    savePreferences({ keybindings: preferences.keybindings })
    setKeyRemapped(null)

    const gameScene = getGameScene()
    if (gameScene) gameScene.registerKeys() // update key listeners
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeydown)
    //clean up event listener when destroyed
    return () => {
      window.removeEventListener("keydown", onKeydown)
    }
  }, [onKeydown])

  return (
    <div className="keybind-container">
      <h2>{t("key_bindings")}</h2>
      <dl>
        <dt>
          <kbd
            className={cc("remappable", { remapping: keyRemapped === "sell" })}
            onClick={() => setKeyRemapped("sell")}
          >
            {keyRemapped === "sell" ? "?" : preferences.keybindings.sell}
          </kbd>
        </dt>
        <dd>{t("key_desc_sell")}</dd>

        <dt>
          <kbd
            className={cc("remappable", {
              remapping: keyRemapped === "buy_xp"
            })}
            onClick={() => setKeyRemapped("buy_xp")}
          >
            {keyRemapped === "buy_xp" ? "?" : preferences.keybindings.buy_xp}
          </kbd>
        </dt>
        <dd>{t("key_desc_buy_xp")}</dd>

        <dt>
          <kbd
            className={cc("remappable", {
              remapping: keyRemapped === "refresh"
            })}
            onClick={() => setKeyRemapped("refresh")}
          >
            {keyRemapped === "refresh" ? "?" : preferences.keybindings.refresh}
          </kbd>
        </dt>
        <dd>{t("key_desc_refresh")}</dd>

        <dt>
          <kbd
            className={cc("remappable", { remapping: keyRemapped === "emote" })}
            onClick={() => setKeyRemapped("emote")}
          >
            {keyRemapped === "emote" ? "?" : preferences.keybindings.emote}
          </kbd>
        </dt>
        <dd>{t("key_desc_avatar_anim")}</dd>

        <dt>
          <kbd>Ctrl</kbd>
        </dt>
        <dd>{t("key_desc_avatar_emotes")}</dd>

        <dt>
          <kbd>Ctrl</kbd>+<kbd>1</kbd>..<kbd>9</kbd>
        </dt>
        <dd>{t("key_desc_avatar_show_emote")} 1..9</dd>
      </dl>
    </div>
  )
}
