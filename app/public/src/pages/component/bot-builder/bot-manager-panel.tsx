import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { joinLobbyRoom } from "../../../game/lobby-logic"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { addBotDatabase, deleteBotDatabase } from "../../../stores/NetworkStore"
import { getAvatarSrc } from "../../../../../utils/avatar"
import { rewriteBotRoundsRequiredto1, validateBot } from "./bot-logic"
import "./bot-manager-panel.css"
import { usePreference } from "../../../preferences"
import PokemonPortrait from "../pokemon-portrait"

export function BotManagerPanel() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const lobbyJoined = useRef<boolean>(false)
  useEffect(() => {
    if (!lobbyJoined.current) {
      joinLobbyRoom(dispatch, navigate)
      lobbyJoined.current = true
    }
  }, [lobbyJoined])

  return (
    <div id="bot-manager-panel">
      <BotsList />
      <BotLoader />
    </div>
  )
}

function BotsList() {
  const [antialiasing] = usePreference('antialiasing')
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [bots, setBots] = useState<IBot[] | null>(null)

  useEffect(() => {
    fetch("/bots?withSteps=true").then((res) => res.json()).then((data) => {
      setBots(data)
    })
  }, [])

  return (
    <main id="bots-list" className="my-container">
      {bots === null ? (
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
                  <PokemonPortrait avatar={b.avatar} />
                </td>
                <td>{t(`pkm.${b.name}`)}</td>
                <td>{b.author}</td>
                <td>{b.elo}</td>
                <td style={{ color: "#999", fontSize: "80%" }}>{b.id}</td>
                <td>
                  {(() => {
                    const errors = validateBot(rewriteBotRoundsRequiredto1(b))
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
      className="my-container"
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
