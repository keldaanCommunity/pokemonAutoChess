import React from "react"
import { ILobbyUser } from "../../../../../models/colyseus-models/lobby-user"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTabIndex } from "../../../stores/LobbyStore"
import { searchName } from "../../../stores/NetworkStore"
import Avatar from "../avatar"
import CSS from "csstype"

const ulStyle = {
  listStyle: "none",
  padding: "0px",
}

const style: CSS.Properties = {
  backgroundColor: "rgba(255, 255, 255, .6)",
  margin: "10px",
  flexBasis: "15%",
  height: "90vh",
  overflowY: "scroll",
  backgroundImage: 'url("assets/ui/back2.png")',
  backgroundSize: "cover",
  backgroundPositionX: "right",
  color: "white",
}

export default function CurrentUsers() {
  const users: ILobbyUser[] = useAppSelector((state) => state.lobby.users)

  return (
    <div className="nes-container hidden-scrollable" style={style}>
      <h1 className="my-h1">Online</h1>
      <ul style={ulStyle}>
        {users.map((v, i) => (
          <User key={i} v={v} />
        ))}
      </ul>
    </div>
  )
}

function User(props: { key: number; v: ILobbyUser }) {
  const dispatch = useAppDispatch()
  const cursorStyle = {
    marginBottom: "10px",
  }
  return (
    <li
      style={cursorStyle}
      onClick={() => {
        dispatch(searchName(props.v.name))
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
