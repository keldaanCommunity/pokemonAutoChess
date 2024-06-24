import React from "react"
import { useTranslation } from "react-i18next"

export default function GameFiles() {
  const { t } = useTranslation()

  function deleteCache() {
    //TODO
  }

  function preloadFiles() {
    //TODO
  }

  return (
    <div>
      <h2>{t("game_files")}</h2>
      <button className="bubbly blue" onClick={preloadFiles}>
        {t("download_game_files")}
      </button>
      <button className="bubbly red" onClick={deleteCache}>
        {t("delete_cache")}
      </button>
    </div>
  )
}
