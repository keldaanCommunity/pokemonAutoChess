import React from "react"
import { useTranslation } from "react-i18next"
import { GameMode } from "../../../../../types/enum/Game"
import { Modal } from "../modal/modal"
import "./room-selection-menu.css"

export function RoomSelectionMenu(props: { show: boolean, onClose: () => void, onSelectMode: (mode: GameMode) => void }) {
    const { t } = useTranslation()
    return <Modal
        show={props.show}
        onClose={props.onClose}
        className="room-selection-menu"
        header={t("new_game")}
        body={<ul>
            <li className="my-box" onClick={() => props.onSelectMode(GameMode.QUICKPLAY)}>
                <img src="assets/ui/game_modes/quickplay.png" alt="Quick Play" draggable="false" />
                <h2>{t("quick_play")}</h2>
                <p>{t("quick_play_description")}</p>
            </li>
            <li className="my-box" onClick={() => props.onSelectMode(GameMode.RANKED)}>
                <img src="assets/ui/game_modes/ranked.png" alt="Ranked match" draggable="false" />
                <h2>{t("ranked_match")}</h2>
                <p>{t("ranked_match_description")}</p>
            </li>
            <li className="my-box" onClick={() => props.onSelectMode(GameMode.SCRIBBLE)}>
                <img src="assets/ui/game_modes/scribble.png" alt="Smeargle's Scribble" draggable="false" />
                <h2>{t("smeargle_scribble")}</h2>
                <p>{t("smeargle_scribble_description")}</p>
            </li>
            <li className="my-box" onClick={() => props.onSelectMode(GameMode.CUSTOM_LOBBY)}>
                <img src="assets/ui/game_modes/custom.png" alt="Custom lobby" draggable="false" />
                <h2>{t("custom_room")}</h2>
                <p>{t("custom_room_description")}</p>
            </li>
        </ul>}
    />
}