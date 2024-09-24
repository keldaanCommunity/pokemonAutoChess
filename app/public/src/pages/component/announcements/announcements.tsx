
import React from "react"
import { useTranslation } from "react-i18next"
import { TournamentSchema } from "../../../../../models/colyseus-models/tournament"
import { Role } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import TournamentItem from "../available-room-menu/tournament-item"
import Chat from "../chat/chat"
import "./announcements.css"

export function Announcements() {
    const { t } = useTranslation()
    const user = useAppSelector((state) => state.network.profile)
    const canWrite = user ? (user.role === Role.ADMIN || user.role === Role.MODERATOR) : false

    const tournaments: TournamentSchema[] = useAppSelector(
        (state) => state.lobby.tournaments
    )
    const sortedTournaments = [...tournaments].sort((a, b) =>
        a.finished !== b.finished
            ? a.finished
                ? +1
                : -1
            : new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )

    return <div className="my-container announcements custom-bg">
        <h2>{t("announcements")}</h2>
        <div className="announcements-container hidden-scrollable">
            {sortedTournaments.length > 0 &&
                <ul className="tournaments">
                    {sortedTournaments.map((t) => (
                        <li key={t.id}>
                            <TournamentItem tournament={t} />
                        </li>
                    ))}
                </ul>}
            <Chat source="lobby" canWrite={canWrite} />
        </div>
    </div>
}