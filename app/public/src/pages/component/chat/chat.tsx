import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { sendMessage } from "../../../stores/NetworkStore"
import ChatHistory from "./chat-history"
import "./chat.css"

const MAX_MESSAGE_LENGTH = 250

export default function Chat(props: { source: string }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [currentText, setCurrentText] = useState<string>("")
  const user = useAppSelector((state) => state[props.source].user)

  return (
    <div className="my-container user-chat custom-bg">
      <h1>{user?.anonymous ? t("chat_disabled_anonymous") : t("chat")}</h1>
      <ChatHistory source={props.source} />
      <form
        onSubmit={(e) => {
          if (!user?.anonymous) {
            e.preventDefault()
            dispatch(sendMessage(currentText))
            setCurrentText("")
          }
        }}
      >
        <input
          placeholder={
            props.source === "lobby"
              ? "Chat is temporarily disabled"
              : user?.anonymous
                ? t("chat_disabled_anonymous")
                : t("type_here")
          }
          disabled={props.source === "lobby" || user?.anonymous}
          type="text"
          title={
            props.source === "lobby"
              ? "Chat is temporarily disabled"
              : user?.anonymous
                ? t("chat_disabled_anonymous")
                : t("type_here")
          }
          onChange={(e) => {
            setCurrentText(e.target.value)
          }}
          value={currentText}
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <button
          className="bubbly blue"
          disabled={props.source === "lobby" || user?.anonymous}
          title={
            props.source === "lobby"
              ? "Chat temporarily disabled due to massive influx of new visitors"
              : user?.anonymous
                ? t("chat_disabled_anonymous")
                : t("type_here")
          }
        >
          {t("send")}
        </button>
      </form>
    </div>
  )
}
