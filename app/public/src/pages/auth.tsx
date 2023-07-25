import React from "react"
import Login from "./component/auth/login"
import Media from "./component/auth/media"
import "./auth.css"
import { i } from "@inlang/sdk-js"

export default function Auth() {
  const isSupposedlyMobile =
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(orientation: portrait)").matches

  return (
    <div className="auth-page">
      {isSupposedlyMobile && (
        <p className="mobile-warning">{i("mobile_warning")}</p>
      )}
      <main>
        <h1>Pokemon Auto Chess</h1>
        <div className="nintendo">
          <p>{i("nintendo_warning")}</p>
        </div>

        <Login />
      </main>
      <img className="logo" src="assets/ui/pokemon_autochess_final.svg" />
      <Media />
    </div>
  )
}
