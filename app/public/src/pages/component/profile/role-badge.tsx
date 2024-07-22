import React from "react"
import { useTranslation } from "react-i18next"
import { Role } from "../../../../../types"
import { cc } from "../../utils/jsx"

/*
TODO
port old classnames
export const RoleColor: { [key in Role]: string } = {
  [Role.ADMIN]: "success",
  [Role.MODERATOR]: "primary",
  [Role.BASIC]: "",
  [Role.BOT]: "secondary",
  [Role.BOT_MANAGER]: "danger"
}
*/

export function RoleBadge(props: { role: Role }) {
  const { t } = useTranslation()
  return props.role && props.role !== Role.BASIC ? (
    <div className={cc("badge", props.role)}>{t("role." + props.role)}</div>
  ) : null
}
