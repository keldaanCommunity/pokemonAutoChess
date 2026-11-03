import { initializeUI, requireDisplayName } from "@firebase-oss/ui-core"
import {
  FirebaseUIProvider,
  GoogleSignInButton,
  OAuthScreen,
  SignInAuthScreen,
  SignUpAuthScreen,
  TwitterSignInButton,
  useUI
} from "@firebase-oss/ui-react"
import { getApp } from "firebase/app"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { FIREBASE_CONFIG } from "../../../../../config"
import { throttle } from "../../../../../utils/function"
import { joinLobbyRoom } from "../../../game/lobby-logic"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { logIn, logOut } from "../../../stores/NetworkStore"

import "@firebase-oss/ui-styles/dist.min.css"
import "./login.css"

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG)
}

const EmailSignInButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation()
  const { state } = useUI()
  return (
    <div>
      <button
        className="fui-button fui-button--secondary fui-provider__button"
        type="button"
        data-provider="password"
        disabled={state !== "idle"}
        onClick={onClick}
      >
        <MailIcon />
        <span>{t("auth.sign_in_with_email")}</span>
      </button>
    </div>
  )
}

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="fui-provider__icon"
  >
    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5-8-5V6l8 5 8-5z" />
  </svg>
)

// Compat and modular SDKs share the same underlying default app and Auth instance
const firebaseUI = initializeUI({
  app: getApp(),
  behaviors: [requireDisplayName()]
})

export default function Login() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const uid = useAppSelector((state) => state.network.uid)
  const displayName = useAppSelector((state) => state.network.displayName)
  const email = useAppSelector((state) => state.network.email)
  const [prejoining, setPrejoining] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [emailView, setEmailView] = useState<"providers" | "signin" | "signup">(
    "providers"
  )

  const preJoinLobby = throttle(async function prejoin() {
    setPrejoining(true)
    return joinLobbyRoom(dispatch, navigate)
      .then(() => navigate("/lobby"))
      .catch(() => setPrejoining(false))
  }, 1000)

  const backButton = (
    <button
      className="fui-button fui-button--secondary fui-provider__button"
      type="button"
      onClick={() => setEmailView("providers")}
    >
      {t("auth.back")}
    </button>
  )

  useEffect(() => {
    firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        dispatch(logIn(u))
      }
    })
  })

  if (!uid) {
    return (
      <div id="play-panel">
        <FirebaseUIProvider ui={firebaseUI}>
          {emailView === "signin" && (
            <SignInAuthScreen onSignUpClick={() => setEmailView("signup")}>
              {backButton}
            </SignInAuthScreen>
          )}
          {emailView === "signup" && (
            <SignUpAuthScreen onSignInClick={() => setEmailView("signin")}>
              {backButton}
            </SignUpAuthScreen>
          )}
          {emailView === "providers" && (
            <OAuthScreen>
              <GoogleSignInButton />
              <EmailSignInButton onClick={() => setEmailView("signin")} />
              <TwitterSignInButton />
            </OAuthScreen>
          )}
        </FirebaseUIProvider>
      </div>
    )
  } else {
    return (
      <div id="play-panel">
        <p>
          {t("auth.authenticated_as")}:{" "}
          <span title={`${displayName}${email ? ` (${email})` : ""}`}>
            {t("auth.hover_to_reveal")}
          </span>
        </p>
        <ul className="actions">
          <li>
            <button
              className="bubbly green"
              onClick={preJoinLobby}
              disabled={prejoining}
            >
              {prejoining ? t("auth.connecting") : t("auth.join_lobby")}
            </button>
          </li>
          <li>
            <button
              className="bubbly red"
              disabled={prejoining || loggingOut}
              onClick={async () => {
                setLoggingOut(true)
                try {
                  await firebase.auth().signOut()
                  dispatch(logOut())
                } finally {
                  setLoggingOut(false)
                }
              }}
            >
              {loggingOut ? t("auth.signing_out") : t("auth.sign_out")}
            </button>
          </li>
        </ul>
      </div>
    )
  }
}
