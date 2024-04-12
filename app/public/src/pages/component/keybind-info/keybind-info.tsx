import React from "react"
import { useTranslation } from "react-i18next"

import "./keybind-info.css"

export default function KeybindInfo() {
  const { t } = useTranslation()
  return (
    <div className="my-container keybind-container">
      <h2>{t("key_bindings")}</h2>
      <dl>
        <dt>
          <kbd>E</kbd>
        </dt>
        <dd>{t("key_desc_sell")}</dd>

        <dt>
          <kbd>F</kbd>
        </dt>
        <dd>{t("key_desc_buy_xp")}</dd>

        <dt>
          <kbd>D</kbd>
        </dt>
        <dd>{t("key_desc_refresh")}</dd>

        <dt>
          <kbd>A</kbd>
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
