import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../utils"
import { addBotDatabase, deleteBotDatabase } from "../../../stores/NetworkStore"
import { useTranslation } from "react-i18next"

export function BotManagerPanel() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const logs = useAppSelector((state) => state.lobby.botLogDatabase)
  const bots = useAppSelector((state) => state.lobby.botList)
  const [url, setUrl] = useState<string>("")
  return (
    <div style={{ display: "flex" }}>
      <div
        className="nes-container"
        style={{
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
          overflow: "scroll",
          height: "85vh",
          position: "inherit",
          margin: "10px",
          color: "white",
          fontSize: "1.1em",
          width: "60%"
        }}
      >
        {bots.map((b) => (
          <div
            key={b.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "5px"
            }}
          >
            <img src={getAvatarSrc(b.avatar)} className="pokemon-portrait" />
            <p>{t(`pkm.${b.name}`)}</p>
            <p>{b.author}</p>
            <p>{b.id}</p>
            <button
              onClick={() => {
                dispatch(deleteBotDatabase(b.id))
              }}
              className="bubbly red"
            >
              {t("delete")}
            </button>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          height: "85vh",
          margin: "10px",
          color: "white",
          width: "30%",
          fontSize: "1.2em",
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
      </div>
    </div>
  )
}
