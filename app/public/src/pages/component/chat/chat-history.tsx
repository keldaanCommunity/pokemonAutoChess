import React, { useEffect, useRef } from "react"
import { useAppSelector } from "../../../hooks"
import ChatMessage from "./chat-message"

export default function ChatHistory(props: { source: string }) {
  const messages = useAppSelector((state) => state[props.source].messages)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0 && domRef && domRef.current) {
      domRef.current.scrollTop = domRef.current.scrollHeight
    }
  })

  return (
    <div className="chat-history" ref={domRef}>
      {messages.map((message, index) => {
        return <ChatMessage key={index} message={message} />
      })}
    </div>
  )
}