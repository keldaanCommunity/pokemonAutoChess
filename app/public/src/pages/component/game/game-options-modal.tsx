import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState
} from "react"
import Modal from "react-bootstrap/Modal"
import {
  IPreferencesState,
  loadPreferences,
  savePreferences
} from "../../../preferences"
import { getGameScene } from "../../game"
import { t } from "i18next"

import "./game-options-modal.css"

export default function GameOptionsModal(props: {
  show: boolean
  hideModal: Dispatch<SetStateAction<boolean>>
  leave: () => void
}) {
  const initialPreferences = loadPreferences()
  const [unsavedPreferences, setUnsavedPreferences] =
    useState(initialPreferences)

  const getValue = useCallback(
    (
      target: HTMLInputElement,
      key: keyof IPreferencesState
    ): number | boolean => {
      switch (key) {
        case "pokemonDetailsOnHover":
        case "showDpsMeter":
          return target.checked
        default:
          return Number.parseFloat(target.value)
      }
    },
    []
  )

  const changePreferences = useCallback(
    (e: ChangeEvent<HTMLInputElement>, key: keyof IPreferencesState) => {
      const newValue = getValue(e.target, key)
      setUnsavedPreferences((prevPrefs) => {
        return {
          ...prevPrefs,
          [key]: newValue
        }
      })

      if (key === "musicVolume" && typeof newValue === "number") {
        const gameScene = getGameScene()
        if (gameScene && gameScene.music) {
          gameScene.music.setVolume(newValue / 100)
        }
      }
    },
    [getValue]
  )

  return (
    <Modal show={props.show}>
      <Modal.Header>
        <Modal.Title>{t("options")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <label className="full-width">
            {t("music_volume")}: {unsavedPreferences.musicVolume} %
            <input
              type="range"
              min="0"
              max="100"
              value={unsavedPreferences.musicVolume}
              onInput={useCallback(
                (e) => changePreferences(e, "musicVolume"),
                [changePreferences]
              )}
            ></input>
          </label>
        </p>
        <p>
          <label className="full-width">
            {t("sfx_volume")}: {unsavedPreferences.sfxVolume} %
            <input
              type="range"
              min="0"
              max="100"
              value={unsavedPreferences.sfxVolume}
              onInput={useCallback(
                (e) => changePreferences(e, "sfxVolume"),
                [changePreferences]
              )}
            ></input>
          </label>
        </p>
        <p>
          <label>
            <input
              type="checkbox"
              className="nes-checkbox"
              checked={unsavedPreferences.pokemonDetailsOnHover}
              onChange={useCallback(
                (e) => changePreferences(e, "pokemonDetailsOnHover"),
                [changePreferences]
              )}
            />
            <span>Show pokemon details on hover</span>
          </label>
        </p>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: "space-between" }}>
        <button className="bubbly red" onClick={props.leave}>
          {t("leave_game")}
        </button>
        <button
          className="bubbly green"
          onClick={useCallback(() => {
            savePreferences(unsavedPreferences)
            props.hideModal(true)
          }, [props, unsavedPreferences])}
        >
          {t("save")}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
