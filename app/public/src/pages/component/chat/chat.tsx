import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { IChatV2 } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import ChatHistory from "./chat-history"
import { ChatRoom, rooms, sendMessage } from "../../../network"
import { Callbacks } from "@colyseus/sdk"
import "./chat.css"

const MAX_MESSAGE_LENGTH = 250

export default function Chat(props: { source: ChatRoom; canWrite: boolean }) {
  const { t } = useTranslation()
  const [currentText, setCurrentText] = useState<string>("")
  const anonymous = useAppSelector((state) => !state.network.profile)
  const [messages, setMessages] = useState<IChatV2[]>([])
  if (props.source === "lobby" && rooms.lobby) {
    Callbacks.get(rooms.lobby).listen("messages", (newMessages) => {
      setMessages([...newMessages])
    })
  } else if (props.source === "preparation" && rooms.preparation) {
    Callbacks.get(rooms.preparation).listen("messages", (newMessages) => {
      setMessages([...newMessages])
    })
  }

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
