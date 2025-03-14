import React from "react"
import { IChatV2, Role } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { removeMessage, searchById } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"

export default function ChatMessage(props: { message: IChatV2 }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const role = user?.role
  const time = new Date(props.message.time).toLocaleTimeString(undefined, {
    timeStyle: "short"
  })
  const isServerMessage = props.message.authorId === "server"

  return (
    <div className="chat-message-container">
      {props.message.author && (
        <div
          className={cc("chat-user", {
            "same-user": props.message.authorId === user?.uid,
            "server-message": isServerMessage
          })}
        >
          <PokemonPortrait avatar={props.message.avatar} />
          <div
            className="author-and-time"
            title="open profile"
            onClick={() => dispatch(searchById(props.message.authorId))}
          >
            <span className="chat-message-author">{props.message.author}</span>
            <span className="chat-message-time">{time}</span>
          </div>
          {role &&
            (role === Role.MODERATOR || role === Role.ADMIN) &&
            !isServerMessage && (
              <button
                className="remove-chat bubbly red"
                title="Remove message"
                onClick={() =>
                  dispatch(
                    removeMessage({
                      id: props.message.id
                    })
                  )
                }
              >
                <p style={{ fontSize: "0.5em", margin: "0" }}>X</p>
              </button>
            )}
        </div>
      )}
      <p className="chat-message">{props.message.payload}</p>
    </div>
  )
}
