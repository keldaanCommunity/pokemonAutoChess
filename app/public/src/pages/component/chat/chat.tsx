import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "../../../hooks"
import { ChatRoom, rooms, sendMessage } from "../../../network"
import ChatHistory from "./chat-history"
import "./chat.css"

const MAX_MESSAGE_LENGTH = 250

export default function Chat(props: { source: ChatRoom; canWrite: boolean }) {
  const { t } = useTranslation()
  const [currentText, setCurrentText] = useState<string>("")
  const anonymous = useAppSelector((state) => !state.network.profile)
  const messages = useAppSelector((state) =>
    props.source === "lobby" ? state.lobby.messages : state.preparation.messages
  )

  return (
    <div className="user-chat">
      <ChatHistory messages={messages} source={props.source} />
      {props.canWrite && (
        <form
          onSubmit={(e) => {
            if (!anonymous) {
              e.preventDefault()
              sendMessage(currentText, props.source)
              setCurrentText("")
            }
          }}
        >
          <input
            placeholder={
              anonymous ? t("chat_disabled_anonymous") : t("type_here")
            }
            disabled={anonymous}
            type="text"
            title={anonymous ? t("chat_disabled_anonymous") : t("type_here")}
            onChange={(e) => {
              setCurrentText(e.target.value)
            }}
            value={currentText}
            maxLength={MAX_MESSAGE_LENGTH}
          />
          <button
            className="bubbly blue"
            disabled={anonymous}
            title={anonymous ? t("chat_disabled_anonymous") : t("send_message")}
          >
            {t("send")}
          </button>
        </form>
      )}
    </div>
  )
}
