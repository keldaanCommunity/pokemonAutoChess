import React, {
  Dispatch,
  SetStateAction,
  useState
} from "react"
import Modal from "react-bootstrap/Modal"
import {
  IPreferencesState,
  preferences as initialPreferences,
  savePreferences
} from "../../../preferences"
import { getGameScene } from "../../game"
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "../../../hooks"
import { Language } from "../../../../../types/enum/Language"
import { LanguageNames } from "../../../../dist/client/locales"
import { selectLanguage } from "../../../stores/NetworkStore"
import { Page } from "../main-sidebar"
import { Checkbox } from "../checkbox/checkbox"

import "./game-options-modal.css"

export default function GameOptionsModal(props: {
  show: boolean
  hideModal: Dispatch<SetStateAction<void>>
  page: Page
}) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const language = i18n.language

  function changePreference(key: keyof IPreferencesState, value: any) {
    setPreferences({ ...preferences, [key]: value })
    savePreferences({ [key]: value })

    if (key === "musicVolume" && typeof value === "number") {
      const gameScene = getGameScene()
      if (gameScene && gameScene.music) {
        gameScene.music.setVolume(value / 100)
      }
    }
  }

  return (
    <Modal show={props.show} onHide={props.hideModal}>
      <Modal.Header>
        <Modal.Title>{t("options")}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="game-options-modal-body">
        {props.page === "main_lobby" && (
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
              {t("community_translations")}{" "}
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
            {t("music_volume")}: {preferences.musicVolume} %
            <input
              type="range"
              min="0"
              max="100"
              value={preferences.musicVolume}
              onInput={(e) =>
                changePreference(
                  "musicVolume",
                  Number.parseFloat((e.target as HTMLInputElement).value)
                )
              }
            ></input>
          </label>
        </p>
        <p>
          <label className="full-width">
            {t("sfx_volume")}: {preferences.sfxVolume} %
            <input
              type="range"
              min="0"
              max="100"
              value={preferences.sfxVolume}
              onInput={(e) =>
                changePreference(
                  "sfxVolume",
                  Number.parseFloat((e.target as HTMLInputElement).value)
                )
              }
            ></input>
          </label>
        </p>
        <p>
          <Checkbox
            checked={preferences.showDetailsOnHover}
            onToggle={(checked) =>
              changePreference("showDetailsOnHover", checked)
            }
            label={t("show_details_on_hover")}
          />
        </p>
      </Modal.Body>
    </Modal>
  )
}
