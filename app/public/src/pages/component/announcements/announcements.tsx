
import React from "react"
import { useTranslation } from "react-i18next"
import { Role } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { SpecialGameCountdown } from "../available-room-menu/special-game-countdown"
import Chat from "../chat/chat"
import "./announcements.css"

export function Announcements() {
    const { t } = useTranslation()
    const user = useAppSelector((state) => state.lobby.user)
    const canWrite = user ? (user.role === Role.ADMIN || user.role === Role.MODERATOR) : false
    return <div className="my-container announcements custom-bg">
        <h2>{t("announcements")}</h2>
        <SpecialGameCountdown />
        <Chat source="lobby" canWrite={canWrite} />
    </div>
}