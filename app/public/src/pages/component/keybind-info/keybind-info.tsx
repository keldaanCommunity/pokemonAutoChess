import React from "react"
import { useTranslation } from "react-i18next"

import "./keybind-info.css"

export default function KeybindInfo() {
  const { t } = useTranslation()
  const ALL_KEYBINDS = {
    E: t("key_desc_sell"),
    F: t("key_desc_buy_xp"),
    D: t("key_desc_refresh"),
    A: t("key_desc_avatar_anim"),
    S: t("key_desc_avatar_emotes")
  }

  return (
    <div className="nes-container keybind-container">
      <h2>{t("key_bindings")}</h2>
      <table className="keybind-table">
        <thead>
          <tr className="keybind-table-header">
            <th>{t("key")}</th>
            <th>{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(ALL_KEYBINDS).map(([key, description]) => {
            return (
              <tr key={key}>
                <td><kbd>{key}</kbd></td>
                <td>{description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
