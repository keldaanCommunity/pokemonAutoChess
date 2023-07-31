import React from "react"
import Login from "./component/auth/login"
import Media from "./component/auth/media"
import "./auth.css"
import { useTranslation } from "react-i18next"

export default function Auth() {
  const { t } = useTranslation()
  const isSupposedlyMobile =
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(orientation: portrait)").matches

  return (
    <div className="auth-page">
      {isSupposedlyMobile && (
        <p className="mobile-warning">{t("mobile_warning")}</p>
      )}
      <main>
        <h1>{t("pokemon_auto_chess")}</h1>
        <div className="nintendo">
          <p>{t("nintendo_warning")}</p>
        </div>

        <Login />
      </main>
      <img className="logo" src="assets/ui/pokemon_autochess_final.svg" />
      <Media />
    </div>
  )
}
