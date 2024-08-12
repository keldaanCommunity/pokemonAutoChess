import React from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../hooks"
import { setNetworkError } from "../stores/NetworkStore"
import Login from "./component/auth/login"
import Media from "./component/auth/media"
import { Modal } from "react-bootstrap"
import "./auth.css"

export default function Auth() {
  const { t } = useTranslation()
  const isSupposedlyMobile =
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(orientation: portrait)").matches
  const dispatch = useAppDispatch()
  const networkError = useAppSelector(state => state.network.error)

  return (
    <div className="auth-page">
      {isSupposedlyMobile && (
        <p className="mobile-warning">{t("mobile_warning")}</p>
      )}
      <img className="logo" src="assets/ui/pokemon_autochess_final.svg" />
      <header>
        <h1>{t("pokemon_auto_chess")}</h1>
        <div className="disclaimer">
          <p>{t("nintendo_warning")}</p>
        </div>
      </header>
      <main>
        <Login />
      </main>
      <Media />
      <Modal
        show={networkError != null}
        onHide={() => dispatch(setNetworkError(null))}
        centered={true}
        dialogClassName="is-dark"
      >
        <Modal.Body className="basic-modal-body">
          <p style={{ padding: "1em" }}>{networkError}</p>
        </Modal.Body>
      </Modal>
    </div>
  )
}
