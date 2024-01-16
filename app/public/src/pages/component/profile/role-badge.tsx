import React from "react"
import { Role, RoleColor } from "../../../../../types"
import Badge from "react-bootstrap/Badge"
import { useTranslation } from "react-i18next"

export function RoleBadge(props: { role: Role }) {
  const { t } = useTranslation()
  return props.role && props.role !== Role.BASIC ? (
    <Badge pill bg={RoleColor[props.role]}>
      {t("role." + props.role)}
    </Badge>
  ) : null
}
