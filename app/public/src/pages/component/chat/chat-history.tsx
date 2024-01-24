import React, { useEffect, useMemo, useRef, useState } from "react"
import { IChatV2 } from "../../../../../types"
import {
  clearTitleNotificationIcon,
  setTitleNotificationIcon
} from "../../../../../utils/window"
import { useAppSelector } from "../../../hooks"
import ChatMessage from "./chat-message"

export default function ChatHistory(props: { source: string }) {
  const messages: IChatV2[] = useAppSelector(
    (state) => state[props.source].messages
  )
  const [readMessages, setReadMessages] = useState<IChatV2[]>([])
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0 && domRef && domRef.current) {
      domRef.current.scrollTop = domRef.current.scrollHeight
    }
  }, [messages.length])

  useEffect(() => {
    if (messages.length !== readMessages.length) {
      setReadMessages(messages)

      if (!document.hasFocus()) {
        setTitleNotificationIcon("💬")
      }
    }
  }, [messages, readMessages.length])

  useEffect(() => {
    const clearTitle = () => {
      if (messages.length === readMessages.length) {
        clearTitleNotificationIcon()
      }
    }

    window.addEventListener("focus", clearTitle)

    return () => {
      window.removeEventListener("focus", clearTitle)
    }
  }, [messages, messages.length, readMessages.length])

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
          <div key={date}>
            <div className="date">{date}</div>
            {chatMessages.map((message, index) => {
              return <ChatMessage key={index} message={message} />
            })}
          </div>
        )
      })}
    </div>
  )
}
