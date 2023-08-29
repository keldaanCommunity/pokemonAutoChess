import React, { useEffect, useMemo, useRef } from "react"
import { useAppSelector } from "../../../hooks"
import ChatMessage from "./chat-message"
import { IChatV2 } from "../../../../../types"

export default function ChatHistory(props: { source: string }) {
  const messages: IChatV2[] = useAppSelector(
    (state) => state[props.source].messages
  )
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0 && domRef && domRef.current) {
      domRef.current.scrollTop = domRef.current.scrollHeight
    }
  })

  const dateSeparatedChat: Record<string, IChatV2[]> = useMemo(() => {
    return messages.reduce((allMessages, message) => {
      const date = new Date(message.time)
      const key = date.toDateString()

      return {
        ...allMessages,
        [key]: [...(allMessages[key] ?? []), message]
      }
    }, {})
  }, [messages])

  return (
    <div className="chat-history" ref={domRef}>
      {Object.entries(dateSeparatedChat).map(([date, chatMessages]) => {
        return (
          <>
            <div className="date">{date}</div>
            {chatMessages.map((message, index) => {
              return <ChatMessage key={index} message={message} />
            })}
          </>
        )
      })}
    </div>
  )
}
