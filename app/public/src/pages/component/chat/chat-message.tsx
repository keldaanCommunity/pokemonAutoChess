import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { removeMessage, searchById } from "../../../stores/NetworkStore"
import { IChatV2, Role } from "../../../../../types"
import { getAvatarSrc } from "../../../utils"

export default function ChatMessage(props: { message: IChatV2 }) {
  const dispatch = useAppDispatch()
  const role = useAppSelector((state) => state.lobby.user?.role)

  const removeButton =
    role && (role === Role.MODERATOR || role === Role.ADMIN) ? (
      <button
        className="bubbly red"
        title="Remove message"
        onClick={() => {
          dispatch(
            removeMessage({
              id: props.message.id
            })
          )
        }}
      >
        <p style={{ fontSize: "0.5em", margin: "0px" }}>X</p>
      </button>
    ) : null

  return (
    <div
      className="chat"
      style={{
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "top",
        justifyContent: "start"
      }}
    >
      <img
        src={getAvatarSrc(props.message.avatar)}
        style={{ alignSelf: "start" }}
        className="pokemon-portrait"
      />
      <span
        className="chat-message-author"
        title={formatDate(props.message.time)}
        onClick={() => {
          dispatch(searchById(props.message.authorId))
        }}
      >
        {props.message.author}
      </span>
      <p
        style={{
          fontSize: "1vw",
          wordBreak: "break-word",
          flex: "1",
          margin: "0"
        }}
      >
        {props.message.payload}
      </p>
      {removeButton}
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
