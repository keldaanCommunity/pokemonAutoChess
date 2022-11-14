import React, { useState } from "react"
import "nes.css/css/nes.min.css"
import { useAppDispatch } from "../../../hooks"
import { sendMessage } from "../../../stores/NetworkStore"
import ChatHistory from "./chat-history"

export default function Chat(props: { source: string }) {
  const dispatch = useAppDispatch()
  const [currentText, setCurrentText] = useState<string>("")

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
      <h1 className="my-h1">Chat</h1>
      <ChatHistory source={props.source} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          dispatch(sendMessage(currentText))
          setCurrentText("")
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
            placeholder="Type here ..."
            id="name_field"
            type="text"
            onChange={(e) => {
              setCurrentText(e.target.value)
            }}
            value={currentText}
            className="my-input"
          />
        </div>
        <button style={{ height: "7vh" }} className="bubbly-primary">
          Send
        </button>
      </form>
    </div>
  )
}
