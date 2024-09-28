import React from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { Role } from "../../../../../types"
import { cc } from "../../utils/jsx"
import "./role-badge.css"

export function RoleBadge(props: { role: Role }) {
  const { t } = useTranslation()
  return props.role && props.role !== Role.BASIC ? (
    <div className={cc("badge", props.role.toLowerCase())}>{t("role." + props.role)}</div>
  ) : null
}
