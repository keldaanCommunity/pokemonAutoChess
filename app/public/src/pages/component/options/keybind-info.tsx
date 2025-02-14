import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { usePreferences } from "../../../preferences"
import { getGameScene } from "../../game"
import { cc } from "../../utils/jsx"

import "./keybind-info.css"

export default function KeybindInfo() {
  const { t } = useTranslation()
  const [preferences, setPreferences] = usePreferences()
  const [currentlyRemapping, setCurrentlyRemapping] = useState<string | null>(
    null
  )

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (currentlyRemapping === null) return
      let key = e.key.toUpperCase()
      if (key === "ESCAPE") {
        setCurrentlyRemapping(null)
        return
      }
      if (key === " ") {
        key = "SPACE"
      }
      setPreferences((old) => ({
        keybindings: { ...old.keybindings, [currentlyRemapping]: key }
      }))
      setCurrentlyRemapping(null)

      const gameScene = getGameScene()
      if (gameScene) gameScene.registerKeys() // update key listeners
    }

    window.addEventListener("keydown", onKeydown)
    //clean up event listener when destroyed
    return () => {
      window.removeEventListener("keydown", onKeydown)
    }
  }, [currentlyRemapping])

  const keys = Object.keys(preferences.keybindings)
  const conflictingKeys = keys.filter((key, i) => keys.some((otherKey, otherIndex) => i !== otherIndex && preferences.keybindings[key] === preferences.keybindings[otherKey]))

  const RemappableKey = ({ keyId }: { keyId: string }) => {
    return (
      <kbd
        className={cc("remappable", {
          remapping: currentlyRemapping === keyId,
          conflict: conflictingKeys.includes(keyId)
        })}
        onClick={() => setCurrentlyRemapping(keyId)}
      >
        {currentlyRemapping === keyId ? "?" : preferences.keybindings[keyId]}
      </kbd>
    )
  }

  return (
    <div className="keybind-container">
      <h2>{t("key_bindings")}</h2>
      <dl>
        <dt>
          <RemappableKey keyId="sell" />
        </dt>
        <dd>{t("key_desc_sell")}</dd>

        <dt>
          <RemappableKey keyId="buy_xp" />
        </dt>
        <dd>{t("key_desc_buy_xp")}</dd>

        <dt>
          <RemappableKey keyId="refresh" />
        </dt>
        <dd>{t("key_desc_refresh")}</dd>

        <dt>
          <RemappableKey keyId="lock" />
        </dt>
        <dd>{t("key_desc_lock")}</dd>

        <dt>
          <RemappableKey keyId="switch" />
        </dt>
        <dd>{t("key_desc_switch")}</dd>

        <dt>
          <RemappableKey keyId="emote" />
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
