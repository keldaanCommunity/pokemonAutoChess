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
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "../../../hooks"
import { Language } from "../../../../../types/enum/Language"
import { LanguageNames } from "../../../../dist/client/locales"
import { selectLanguage } from "../../../stores/NetworkStore"

import "./game-options-modal.css"

export default function GameOptionsModal(props: {
  show: boolean
  hideModal: Dispatch<SetStateAction<boolean>>
  leave: () => void
  ingame: boolean
}) {
  const initialPreferences = loadPreferences()
  const [unsavedPreferences, setUnsavedPreferences] =
    useState(initialPreferences)

  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const language = i18n.language
  
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
        {!props.ingame && (
          <>
            <p>
              <label>
                {t("language")}:&nbsp;
                <select
                  value={language}
                  onChange={(e) => {
                    dispatch(selectLanguage(e.target.value as Language))
                  }}
                >
                  {Object.keys(Language).map((lng) => (
                    <option key={lng} value={lng}>
                      {LanguageNames[lng]}
                    </option>
                  ))}
                </select>
              </label>
            </p>
            <p>
              Translations are managed by the community. If you want to add or
              help improve a translation, head over to&nbsp;
              <a
                href="https://discord.com/channels/737230355039387749/1134014553529790464"
                target="_blank"
              >
                Discord
              </a>
            </p>
          </>
        )}
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
          {t(props.ingame ? "leave_game" : "cancel")}
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
