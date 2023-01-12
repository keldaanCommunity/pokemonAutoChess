import React, { useState } from "react"
import "nes.css/css/nes.min.css"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { sendMessage } from "../../../stores/NetworkStore"
import ChatHistory from "./chat-history"

export default function Chat(props: { source: string }) {
  const dispatch = useAppDispatch()
  const [currentText, setCurrentText] = useState<string>("")
  const user = useAppSelector((state) => state[props.source].user)

  return (
    <div
      className="nes-container"
      style={{
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundImage: 'url("assets/ui/back1.png")',
        backgroundSize: "cover",
        backgroundPositionX: "right",
        margin: "10px",
        height: "90vh",
        flexBasis: "30%"
      }}
    >
      <h1 className="my-h1">
        {user?.anonymous ? "Chat disabled for anonymous" : "Chat"}
      </h1>
      <ChatHistory source={props.source} />
      <form
        onSubmit={(e) => {
          if (!user?.anonymous) {
            e.preventDefault()
            dispatch(sendMessage(currentText))
            setCurrentText("")
          }
        }}
        style={{
          display: "flex",
          flexFlow: "row nowrap",
          width: "100%",
          marginTop: "15px",
          alignItems: "center"
        }}
      >
        <div className="nes-field" style={{ width: "80%" }}>
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
        </div>
        <button
          style={{ height: "7vh" }}
          className={user?.anonymous ? "bubbly-disabled" : "bubbly-primary"}
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
