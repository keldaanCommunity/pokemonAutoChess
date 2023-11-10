import React, { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../utils"
import {
  addBotDatabase,
  deleteBotDatabase,
  requestBotList
} from "../../../stores/NetworkStore"
import { useTranslation } from "react-i18next"
import store from "../../../stores"
import { joinLobbyRoom } from "../../lobby"
import { Navigate, useNavigate } from "react-router-dom"
import { rewriteBotRoundsRequiredto1, validateBot } from "./bot-logic"
import { logger } from "../../../../../utils/logger"
import "./bot-manager-panel.css"

export function BotManagerPanel() {
  const dispatch = useAppDispatch()

  const [toAuth, setToAuth] = useState<boolean>(false)
  const lobbyJoined = useRef<boolean>(false)
  useEffect(() => {
    const client = store.getState().network.client
    if (!lobbyJoined.current) {
      joinLobbyRoom(dispatch, client).catch((err) => {
        logger.error(err)
        setToAuth(true)
      })
      lobbyJoined.current = true
    }
  }, [lobbyJoined, dispatch])

  if (toAuth) {
    return <Navigate to={"/"} />
  }

  return (
    <div id="bot-manager-panel">
      <BotsList />
      <BotLoader />
    </div>
  )
}

function BotsList() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const bots = useAppSelector((state) => state.lobby.botList)

  if (bots.length === 0) {
    dispatch(requestBotList({ withSteps: true }))
  }

  return (
    <main id="bots-list" className="nes-container">
      {bots.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Author</th>
              <th>Elo</th>
              <th>UID</th>
              <th>Validity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((b) => (
              <tr key={b.id}>
                <td>
                  <img
                    src={getAvatarSrc(b.avatar)}
                    className="pokemon-portrait"
                  />
                </td>
                <td>{t(`pkm.${b.name}`)}</td>
                <td>{b.author}</td>
                <td>{b.elo}</td>
                <td style={{ color: "#999", fontSize: "80%" }}>{b.id}</td>
                <td>
                  {(() => {
                    let errors = validateBot(rewriteBotRoundsRequiredto1(b))
                    if (!errors || errors.length === 0)
                      return <span style={{ color: "lime" }}>{t("valid")}</span>
                    else
                      return (
                        <span
                          style={{ color: "red" }}
                          title={errors.join("\n")}
                        >
                          {t("invalid")}
                        </span>
                      )
                  })()}
                </td>
                <td style={{ display: "flex", gap: "0.5em" }}>
                  <button
                    onClick={() => navigate(`/bot-builder?bot=${b.id}`)}
                    className="bubbly blue"
                    style={{ fontSize: "80%" }}
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => {
                      dispatch(deleteBotDatabase(b.id))
                    }}
                    className="bubbly red"
                    style={{ fontSize: "80%" }}
                  >
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

function BotLoader() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const logs = useAppSelector((state) => state.lobby.botLogDatabase)
  const [url, setUrl] = useState<string>("")

  return (
    <aside
      style={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "space-between",
        alignItems: "center"
      }}
      className="nes-container"
    >
      <h3>{t("load_bot_with_url")}</h3>
      <input
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
        }}
      ></input>
      <button
        disabled={url === ""}
        className="bubbly blue"
        onClick={() => {
          dispatch(addBotDatabase(url))
        }}
      >
        {t("load")}
      </button>
      <div style={{ height: "60%", overflow: "scroll", width: "90%" }}>
        {logs.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </aside>
  )
}
