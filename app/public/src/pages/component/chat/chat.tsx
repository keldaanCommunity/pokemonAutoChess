import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { sendMessage } from "../../../stores/NetworkStore"
import ChatHistory from "./chat-history"
import { IChatV2 } from "../../../../../types"
import "./chat.css"

const MAX_MESSAGE_LENGTH = 250

export default function Chat(props: { source: string, canWrite: boolean }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [currentText, setCurrentText] = useState<string>("")
  const user = useAppSelector((state) => state[props.source].user)
  const messages: IChatV2[] = useAppSelector((state) => state[props.source].messages)

  return (
    <div className="user-chat">
      <ChatHistory messages={messages} />
      {props.canWrite && <form
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
            user?.anonymous ? t("chat_disabled_anonymous") : t("type_here")
          }
          disabled={user?.anonymous}
          type="text"
          title={
            user?.anonymous ? t("chat_disabled_anonymous") : t("type_here")
          }
          onChange={(e) => {
            setCurrentText(e.target.value)
          }}
          value={currentText}
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <button
          className="bubbly blue"
          disabled={user?.anonymous}
          title={
            user?.anonymous ? t("chat_disabled_anonymous") : t("send_message")
          }
        >
          {t("send")}
        </button>
      </form>}
    </div>
  )
}
