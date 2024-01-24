import React from "react"
import Badge from "react-bootstrap/Badge"
import { useTranslation } from "react-i18next"
import { Role, RoleColor } from "../../../../../types"

export function RoleBadge(props: { role: Role }) {
  const { t } = useTranslation()
  return props.role && props.role !== Role.BASIC ? (
    <Badge pill bg={RoleColor[props.role]}>
      {t("role." + props.role)}
    </Badge>
  ) : null
}
