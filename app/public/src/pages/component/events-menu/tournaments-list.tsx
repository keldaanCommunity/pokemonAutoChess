import React from "react"

import { TournamentSchema } from "../../../../../models/colyseus-models/tournament"
import { useAppSelector } from "../../../hooks"
import TournamentItem from "../room-menu/tournament-item"
import "./tournaments-list.css"

export function TournamentsList() {
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

    return (sortedTournaments.length > 0 ? (
        <ul className="tournaments">
            {sortedTournaments.map((t) => (
                <li key={t.id}>
                    <TournamentItem tournament={t} />
                </li>
            ))}
        </ul>
    ) : <p>No tournaments planned at the moment</p>
    )
}
