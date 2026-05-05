import React from "react"
import { useTranslation } from "react-i18next"
import pkg from "../../../../package.json"
import { useAppDispatch, useAppSelector } from "../hooks"
import { fetchProfile } from "../network"
import { setErrorAlertMessage } from "../stores/NetworkStore"
import Login from "./component/auth/login"
import DiscordButton from "./component/buttons/discord-button"
import GithubButton from "./component/buttons/github-button"
import PolicyButton from "./component/buttons/policy-button"
import TermsButton from "./component/buttons/terms-button"
import { Modal } from "./component/modal/modal"
import ServersList from "./component/servers/servers-list"
import Wiki from "./component/wiki/wiki"
import "./auth.css"

export default function Auth() {
  const { t } = useTranslation()
  const isSupposedlyMobile =
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(orientation: portrait)").matches
  const [modal, setModal] = React.useState<string | null>(null)
  const [oauthCallbackMessage, setOauthCallbackMessage] = React.useState<{
    platform: "Twitch" | "YouTube"
    kind: "success" | "error"
    body: string
  } | null>(null)
  const [shouldRefreshProfile, setShouldRefreshProfile] = React.useState(false)
  const dispatch = useAppDispatch()
  const networkError = useAppSelector((state) => state.network.error)
  const uid = useAppSelector((state) => state.network.uid)
  const discordUrl = process.env.DISCORD_SERVER

  React.useEffect(() => {
    const url = new URL(window.location.href)
    const twitchVerify = url.searchParams.get("twitchVerify")
    const youtubeVerify = url.searchParams.get("youtubeVerify")

    if (twitchVerify === "success") {
      setOauthCallbackMessage({
        platform: "Twitch",
        kind: "success",
        body: "Your Twitch account has been linked successfully."
      })
      setShouldRefreshProfile(true)
    } else if (twitchVerify) {
      setOauthCallbackMessage({
        platform: "Twitch",
        kind: "error",
        body: twitchVerify.replace(/\+/g, " ")
      })
    }

    if (youtubeVerify === "success") {
      setOauthCallbackMessage({
        platform: "YouTube",
        kind: "success",
        body: "Your YouTube account has been linked successfully."
      })
      setShouldRefreshProfile(true)
    } else if (youtubeVerify) {
      setOauthCallbackMessage({
        platform: "YouTube",
        kind: "error",
        body: youtubeVerify.replace(/\+/g, " ")
      })
    }

    if (!twitchVerify && !youtubeVerify) {
      return
    }

    url.searchParams.delete("twitchVerify")
    url.searchParams.delete("youtubeVerify")
    window.history.replaceState({}, "", url.toString())
  }, [])

  React.useEffect(() => {
    if (!shouldRefreshProfile || !uid) {
      return
    }

    fetchProfile(true)
      .catch((error) => {
        dispatch(
          setErrorAlertMessage(
            error instanceof Error ? error.message : "Unable to refresh profile"
          )
        )
      })
      .finally(() => {
        setShouldRefreshProfile(false)
      })
  }, [dispatch, shouldRefreshProfile, uid])

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
        <TermsButton />
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
        header={t("wiki_label")}
      >
        <Wiki inGame={false} />
      </Modal>
      <Modal
        onClose={() => setModal(null)}
        show={modal === "servers"}
        className="servers-modal"
        header={t("community_servers")}
      >
        <ServersList />
      </Modal>
      <Modal
        show={networkError != null}
        onClose={() => {
          dispatch(setErrorAlertMessage(null))
        }}
        className="is-dark basic-modal-body"
        body={<p style={{ padding: "1em" }}>{networkError}</p>}
      />
      <Modal
        show={oauthCallbackMessage != null}
        onClose={() => {
          setOauthCallbackMessage(null)
        }}
        className="is-dark basic-modal-body"
        header={
          oauthCallbackMessage?.kind === "success"
            ? `${oauthCallbackMessage?.platform} Linked`
            : `${oauthCallbackMessage?.platform} Verification Error`
        }
        body={<p style={{ padding: "1em" }}>{oauthCallbackMessage?.body}</p>}
      />
    </div>
  )
}
