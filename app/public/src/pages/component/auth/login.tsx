import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { throttle } from "../../../../../utils/function"
import { joinLobbyRoom } from "../../../game/lobby-logic"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { logIn, logOut } from "../../../stores/NetworkStore"
//import AnonymousButton from "./anonymous-button"
import { StyledFirebaseAuth } from "./styled-firebase-auth"

import "firebaseui/dist/firebaseui.css"
import "./login.css"
import { FIREBASE_CONFIG } from "../../../../../types/Config"

export default function Login() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const uid = useAppSelector((state) => state.network.uid)
  const displayName = useAppSelector((state) => state.network.displayName)
  const [prejoining, setPrejoining] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const preJoinLobby = throttle(async function prejoin() {
    setPrejoining(true)
    return joinLobbyRoom(dispatch, navigate)
      .then(() => navigate("/lobby"))
      .catch(() => setPrejoining(false))
  }, 1000)

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
        {/* <AnonymousButton /> */}
      </div>
    )
  } else {
    return (
      <div id="play-panel">
        <p>
          {t("authenticated_as")}:{" "}
          <span title={displayName}>{t("hover_to_reveal")}</span>
        </p>
        <ul className="actions">
          <li>
            <button
              className="bubbly green"
              onClick={preJoinLobby}
              disabled={prejoining}
            >
              {prejoining ? t("connecting") : t("join_lobby")}
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
              {loggingOut ? t("signing_out") : t("sign_out")}
            </button>
          </li>
        </ul>
      </div>
    )
  }
}
