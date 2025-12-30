import React from "react"
import { useTranslation } from "react-i18next"
import { GameMode } from "../../../../../types/enum/Game"
import { Modal } from "../modal/modal"
import "./room-selection-menu.css"

export function RoomSelectionMenu(props: {
  show: boolean
  onClose: () => void
  onSelectMode: (mode: GameMode) => void
}) {
  const { t } = useTranslation()
  return (
    <Modal
      show={props.show}
      onClose={props.onClose}
      className="room-selection-menu"
      header={t("new_game")}
      body={
        <ul>
          <li
            className="my-box"
            onClick={() => props.onSelectMode(GameMode.CLASSIC)}
          >
            <img
              src="assets/ui/game_modes/classic.png"
              alt={t(`game_modes.${GameMode.CLASSIC}`)}
              draggable="false"
            />
            <h2>{t(`game_modes.${GameMode.CLASSIC}`)}</h2>
            <p>{t(`game_modes_descriptions.${GameMode.CLASSIC}`)}</p>
          </li>
          <li
            className="my-box"
            onClick={() => props.onSelectMode(GameMode.RANKED)}
          >
            <img
              src="assets/ui/game_modes/ranked.png"
              alt={t(`game_modes.${GameMode.RANKED}`)}
              draggable="false"
            />
            <h2>{t(`game_modes.${GameMode.RANKED}`)}</h2>
            <p>{t(`game_modes_descriptions.${GameMode.RANKED}`)}</p>
          </li>
          <li
            className="my-box"
            onClick={() => props.onSelectMode(GameMode.SCRIBBLE)}
          >
            <img
              src="assets/ui/game_modes/scribble.png"
              alt={t(`game_modes.${GameMode.SCRIBBLE}`)}
              draggable="false"
            />
            <h2>{t(`game_modes.${GameMode.SCRIBBLE}`)}</h2>
            <p>{t(`game_modes_descriptions.${GameMode.SCRIBBLE}`)}</p>
          </li>
          <li
            className="my-box"
            onClick={() => props.onSelectMode(GameMode.CUSTOM_LOBBY)}
          >
            <img
              src="assets/ui/game_modes/custom_lobby.png"
              alt={t(`game_modes.${GameMode.CUSTOM_LOBBY}`)}
              draggable="false"
            />
            <h2>{t(`game_modes.${GameMode.CUSTOM_LOBBY}`)}</h2>
            <p>{t(`game_modes_descriptions.${GameMode.CUSTOM_LOBBY}`)}</p>
          </li>
        </ul>
      }
    />
  )
}
