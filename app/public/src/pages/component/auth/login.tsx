import React, { useEffect } from "react"
import StyledFirebaseAuth from "../StyledFirebaseAuth"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import { Link } from "react-router-dom"
import "firebaseui/dist/firebaseui.css"
import { useAppSelector, useAppDispatch } from "../../../hooks"
import { logIn, logOut } from "../../../stores/NetworkStore"
import { FIREBASE_CONFIG } from "../../utils/utils"
import AnonymousButton from "./anonymous-button"
import "./login.css"
import { useTranslation } from "react-i18next"

export default function Login() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const uid = useAppSelector((state) => state.network.uid)
  const displayName = useAppSelector((state) => state.network.displayName)

  const uiConfig = {
    // Popup signin flow rather than Navigate flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInSuccessUrl: window.location.href + "lobby",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true
      },
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid Navigates after sign-in.
      signInSuccessWithAuthResult: () => true
    }
  }

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG)
  }

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
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
        <AnonymousButton />
      </div>
    )
  } else {
    return (
      <div id="play-panel">
        <p className="welcome-text">
          {t("welcome")} {displayName}
        </p>
        <ul className="actions">
          <li>
            <Link className="bubbly green" to={"/lobby"}>
              {t("join_lobby")}
            </Link>
          </li>
          <li>
            <button
              className="bubbly red"
              onClick={() => {
                firebase.auth().signOut()
                dispatch(logOut())
              }}
            >
              {t("sign_out")}
            </button>
          </li>
        </ul>
      </div>
    )
  }
}
