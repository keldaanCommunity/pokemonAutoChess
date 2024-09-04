import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { logIn, logOut, setErrorAlertMessage } from "../../../stores/NetworkStore"
import { CloseCodesMessages } from "../../../../../types/enum/CloseCodes"
import { FIREBASE_CONFIG } from "../../utils/utils"
//import AnonymousButton from "./anonymous-button"
import { StyledFirebaseAuth } from "./styled-firebase-auth"
import { logger } from "../../../../../utils/logger"
import store from "../../../stores"
import { throttle } from "../../../../../utils/function"
import { LocalStoreKeys, localStore } from "../../utils/store"

import "firebaseui/dist/firebaseui.css"
import "./login.css"

export default function Login() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const uid = useAppSelector((state) => state.network.uid)
  const displayName = useAppSelector((state) => state.network.displayName)
  const [prejoining, setPrejoining] = useState(false)

  const preJoinLobby = throttle(async function prejoin() {
    setPrejoining(true)
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const client = store.getState().network.client
        try {
          const token = await user.getIdToken()
          const room = await client.join("lobby", {
            idToken: token
          })
          localStore.set(LocalStoreKeys.RECONNECTION_LOBBY, { reconnectionToken: room.reconnectionToken, roomId: room.roomId }, 30)
          if (room.connection.isOpen) {
            room.connection.close()
          }
          navigate("/lobby")
        } catch (err) {
          logger.error(err)
          const errorMessage = CloseCodesMessages[err] ?? "UNKNOWN_ERROR"
          if (errorMessage) {
            dispatch(setErrorAlertMessage(t(`errors.${errorMessage}`, { error: err })))
          }
          setPrejoining(false)
        }
      }
    })
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
