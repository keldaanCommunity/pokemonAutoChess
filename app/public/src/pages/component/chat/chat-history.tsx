import React, { useEffect, useMemo, useRef, useState } from "react"
import { IChatV2 } from "../../../../../types"
import {
  clearTitleNotificationIcon,
  setTitleNotificationIcon
} from "../../../../../utils/window"
import ChatMessage from "./chat-message"

export default function ChatHistory(props: { messages: IChatV2[] }) {
  const [readMessages, setReadMessages] = useState<IChatV2[]>([])
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      props.messages.length > 0 &&
      domRef &&
      domRef.current &&
      (domRef.current.scrollTop === 0 ||
        domRef.current.scrollTop + domRef.current.clientHeight >=
        domRef.current.scrollHeight - 200) // autoscroll only if not already scrolled up by a 200px margin
    ) {
      domRef.current.scrollTop = domRef.current.scrollHeight
    }
  }, [props.messages.length])

  useEffect(() => {
    if (props.messages.length !== readMessages.length) {
      setReadMessages(props.messages)

      if (!document.hasFocus()) {
        setTitleNotificationIcon("💬")
      }
    }
  }, [props.messages, readMessages.length])

  useEffect(() => {
    const clearTitle = () => {
      if (props.messages.length === readMessages.length) {
        clearTitleNotificationIcon()
      }
    }

    window.addEventListener("focus", clearTitle)

    return () => {
      window.removeEventListener("focus", clearTitle)
    }
  }, [props.messages, props.messages.length, readMessages.length])

  const dateSeparatedChat: Record<string, IChatV2[]> = useMemo(() => {
    return props.messages.reduce((allMessages, message) => {
      const date = new Date(message.time)
      const key = date.toDateString()

      return {
        ...allMessages,
        [key]: [...(allMessages[key] ?? []), message]
      }
    }, {})
  }, [props.messages])

  return (
    <div className="chat-history" ref={domRef}>
      {Object.entries(dateSeparatedChat).map(([date, chatMessages]) => {
        return (
          <React.Fragment key={date}>
            <div className="date">{date}</div>
            {chatMessages.map((message, index) => {
              return <ChatMessage key={index} message={message} />
            })}
          </React.Fragment>
        )
      })}
    </div>
  )
}
