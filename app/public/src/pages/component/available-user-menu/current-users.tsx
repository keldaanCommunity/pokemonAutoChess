import React from "react"
import { ILobbyUser } from "../../../../../models/colyseus-models/lobby-user"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTabIndex } from "../../../stores/LobbyStore"
import { searchById, searchName } from "../../../stores/NetworkStore"
import Avatar from "../avatar"
import "./current-users.css"

export default function CurrentUsers() {
  const users: ILobbyUser[] = useAppSelector((state) => state.lobby.users)

  return (
    <div className="nes-container hidden-scrollable current-users-menu">
      <h1>Online: {users.length}</h1>
      <ul>
        {users.map((v, i) => (
          <User key={i} v={v} />
        ))}
      </ul>
    </div>
  )
}

function User(props: { key: number; v: ILobbyUser }) {
  const dispatch = useAppDispatch()
  return (
    <li
      className="clickable"
      onClick={() => {
        dispatch(searchById(props.v.id))
        dispatch(setTabIndex(4))
      }}
    >
      <Avatar
        avatar={props.v.avatar}
        name={props.v.name}
        elo={props.v.elo}
        title={props.v.title}
        role={props.v.role}
      />
    </li>
  )
}
