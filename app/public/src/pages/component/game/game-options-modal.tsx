import React, { Dispatch, FormEvent, SetStateAction, useState } from "react"
import Modal from "react-bootstrap/Modal"
import { loadPreferences, savePreferences } from "../../../preferences"
import { getGameScene } from "../../game"
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "../../../hooks"
import { Language } from "../../../../../types/enum/Language"
import { LanguageNames } from "../../../../dist/client/locales"
import { selectLanguage } from "../../../stores/NetworkStore"

export default function GameOptionsModal(props: {
  show: boolean
  hideModal: Dispatch<SetStateAction<boolean>>
  leave: () => void
  ingame: boolean
}) {
  const initialPreferences = loadPreferences()
  const [musicVolume, setMusicVolume] = useState(initialPreferences.musicVolume)
  const [sfxVolume, setSFXVolume] = useState(initialPreferences.sfxVolume)
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const language = i18n.language

  function changeMusicVolume(e: FormEvent<HTMLInputElement>) {
    const newValue = Number((e.target as HTMLInputElement).value)
    setMusicVolume(newValue)
    const gameScene = getGameScene()
    if (gameScene && gameScene.music) {
      ;(gameScene.music as Phaser.Sound.WebAudioSound).setVolume(newValue / 100)
    }
  }

  function changeSFXVolume(e: FormEvent<HTMLInputElement>) {
    const newValue = Number((e.target as HTMLInputElement).value)
    setSFXVolume(newValue)
  }

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
          <label>
            {t("music_volume")}: {musicVolume} %
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onInput={changeMusicVolume}
            ></input>
          </label>
        </p>
        <p>
          <label>
            {t("sfx_volume")}: {sfxVolume} %
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onInput={changeSFXVolume}
            ></input>
          </label>
        </p>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: "space-between" }}>
        <button className="bubbly red" onClick={props.leave}>
          {t(props.ingame ? "leave_game" : "cancel")}
        </button>
        <button
          className="bubbly green"
          onClick={() => {
            savePreferences({
              musicVolume,
              sfxVolume
            })
            props.hideModal(true)
          }}
        >
          {t("save")}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
