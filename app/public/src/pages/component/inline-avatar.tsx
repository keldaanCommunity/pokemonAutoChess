import React from "react"
import { Role, TitleName } from "../../../../types"
import { getAvatarSrc } from "../../utils"
import { RoleBadge } from "./RoleBadge"

export default function InlineAvatar(props: {
  avatar: string
  name: string
  title: string
  role: Role
}) {
  return (
    <div className="inline-avatar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start"
      }}
    >
      <img
        style={{ width: "40px", height: "40px" }}
        src={getAvatarSrc(props.avatar)}
      />
      <span style={{ color: "#ffc107" }}>{TitleName[props.title]}</span>
      <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", padding: "0 0.5em" }}>
        {props.name}
      </span>
      <RoleBadge role={props.role} />
    </div>
  )
}
