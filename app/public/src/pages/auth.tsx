import React from "react"
import { useTranslation } from "react-i18next"
import pkg from "../../../../package.json"
import Wiki from "./component/wiki/wiki"
import { Modal } from "./component/modal/modal"
import DiscordButton from "./component/buttons/discord-button"
import GithubButton from "./component/buttons/github-button"
import PolicyButton from "./component/buttons/policy-button"
import { useAppDispatch, useAppSelector } from "../hooks"
import { setErrorAlertMessage } from "../stores/NetworkStore"
import Login from "./component/auth/login"
import ServersList from "./component/servers/servers-list"
import "./auth.css"

export default function Auth() {
  const { t } = useTranslation()
  const isSupposedlyMobile =
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(orientation: portrait)").matches
  const [modal, setModal] = React.useState<string | null>(null)
  const dispatch = useAppDispatch()
  const networkError = useAppSelector(state => state.network.error)
  const discordUrl = process.env.DISCORD_SERVER

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
      <div className="media">
        <DiscordButton url={discordUrl} />
        <GithubButton />
        <PolicyButton />
        <button className="bubbly blue" onClick={() => setModal("wiki")}>
          <img width={32} height={32} src={`assets/ui/wiki.svg`} />
          {t("wiki_label")}
        </button>
        <button className="bubbly pink" onClick={() => setModal("servers")}>
          <img width={32} height={32} src={`assets/ui/players.svg`} />
          {t("community_servers")}
        </button>
        <span>V{pkg.version}</span>
        <p>
          {t("made_for_fans")}
          <br />
          {t("non_profit")} / {t("open_source")}
          <br />
          {t("copyright")}
        </p>
      </div>
      <Modal
        onClose={() => setModal(null)}
        show={modal === "wiki"}
        className="wiki-modal"
        header={t("wiki_label")}>
        <Wiki inGame={false} />
      </Modal>
      <Modal
        onClose={() => setModal(null)}
        show={modal === "servers"}
        className="servers-modal"
        header={t("community_servers")}>
        <ServersList />
      </Modal>
      <Modal
        show={networkError != null}
        onClose={() => dispatch(setErrorAlertMessage(null))}
        className="is-dark basic-modal-body"
        body={<p style={{ padding: "1em" }}>{networkError}</p>}
      />
    </div>
  )
}
