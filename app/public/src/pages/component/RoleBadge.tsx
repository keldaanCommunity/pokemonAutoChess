import React from "react"
import { Role, RoleName, RoleColor } from "../../../../types"
import Badge from "react-bootstrap/Badge"

export function RoleBadge(props: { role: Role }) {
  return props.role && props.role !== Role.BASIC ? (
    <Badge pill bg={RoleColor[props.role]}>
      {RoleName[props.role]}
    </Badge>
  ) : null
}
