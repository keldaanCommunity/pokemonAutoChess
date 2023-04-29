import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { sendMessage } from "../../../stores/NetworkStore"
import ChatHistory from "./chat-history"
import "./chat.css";

export default function Chat(props: { source: string }) {
  const dispatch = useAppDispatch()
  const [currentText, setCurrentText] = useState<string>("")
  const user = useAppSelector((state) => state[props.source].user)

  return (
    <div className="nes-container user-chat">
      <h1>{user?.anonymous ? "Chat disabled for anonymous" : "Chat"}</h1>
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
            user?.anonymous
              ? "Chat disabled for anonymous users"
              : "Type here ..."
          }
          disabled={user?.anonymous}
          id="name_field"
          type="text"
          title={
            user?.anonymous
              ? "Chat disabled for anonymous users"
              : "Type here ..."
          }
          onChange={(e) => {
            setCurrentText(e.target.value)
          }}
          value={currentText}
          className="my-input"
        />
        <button
          className="bubbly blue"
          disabled={user?.anonymous}
          title={
            user?.anonymous
              ? "Chat disabled for anonymous users"
              : "Send message"
          }
        >
          Send
        </button>
      </form>
    </div>
  )
}
