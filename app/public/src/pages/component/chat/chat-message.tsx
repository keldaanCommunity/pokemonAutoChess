import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { removeMessage, searchById } from "../../../stores/NetworkStore"
import { IChatV2, Role } from "../../../../../types"
import { getAvatarSrc } from "../../../utils"
import { cc } from "../../utils/jsx"

export default function ChatMessage(props: { message: IChatV2 }) {
  const dispatch = useAppDispatch()
  const lobbyUser = useAppSelector((state) => state.lobby.user)
  const preparationUser = useAppSelector((state) => state.preparation.user)
  const user = lobbyUser ?? preparationUser
  const role = user?.role
  const time = formatDate(props.message.time)

  return (
    <div className="chat">
      <div className="chat-message-container">
        {props.message.author && (
          <div
            className={cc("chat-user", {
              sameUser: props.message.authorId === user?.id
            })}
          >
            <img
              src={getAvatarSrc(props.message.avatar)}
              className="pokemon-portrait"
            />
            <div
              className="author-and-time"
              title="open profile"
              onClick={() => dispatch(searchById(props.message.authorId))}
            >
              <span className="chat-message-author">
                {props.message.author}
              </span>
              <span className="chat-message-time">{time}</span>
            </div>
            {role && (role === Role.MODERATOR || role === Role.ADMIN) && (
              <button
                className="remove-chat bubbly red"
                onClick={() =>
                  dispatch(
                    removeMessage({
                      id: props.message.id
                    })
                  )
                }
              >
                <p style={{ fontSize: "0.5em", margin: "0px" }}>X</p>
              </button>
            )}
          </div>
        )}
        <p className="chat-message">{props.message.payload}</p>
      </div>
    </div>
  )
}

function pad(number: number) {
  if (number < 10) {
    return "0" + number
  }
  return number
}

function formatDate(n: number) {
  const date = new Date(n)
  return (
    pad(date.getMonth() + 1) +
    "/" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  )
}
