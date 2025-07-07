import React from "react"
import { useTranslation } from "react-i18next"
import { Role } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import Chat from "../chat/chat"
import "./announcements.css"

export function Announcements() {
    const { t } = useTranslation()
    const user = useAppSelector((state) => state.network.profile)
    const canWrite = user
        ? user.role === Role.ADMIN || user.role === Role.MODERATOR
        : false

    return (
        <div className="announcements-container hidden-scrollable">
            <Chat source="lobby" canWrite={canWrite} />
        </div>
    )
}
