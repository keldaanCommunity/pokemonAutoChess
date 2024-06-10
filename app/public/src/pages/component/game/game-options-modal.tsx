import React, { Dispatch, SetStateAction, useState } from "react"
import Modal from "react-bootstrap/Modal"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Language } from "../../../../../types/enum/Language"
import { LanguageNames } from "../../../../dist/client/locales"
import { useAppDispatch } from "../../../hooks"
import {
  IPreferencesState,
  preferences as initialPreferences,
  savePreferences
} from "../../../preferences"
import { selectLanguage } from "../../../stores/NetworkStore"
import { getGameScene } from "../../game"
import { Checkbox } from "../checkbox/checkbox"
import KeybindInfo from "../keybind-info/keybind-info"
import { Page } from "../main-sidebar/main-sidebar"

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

  function changePreference(key: keyof IPreferencesState, value: string | number | boolean) {
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
    <Modal show={props.show} onHide={props.hideModal} dialogClassName="is-dark">
      <Modal.Header>
        <Modal.Title>{t("options")}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="game-options-modal-body">
        <Tabs>
          <TabList>
            <Tab key="sound">{t("sound")}</Tab>
            <Tab key="interface">{t("interface")}</Tab>
            <Tab key="hotkeys">{t("hotkeys")}</Tab>
          </TabList>

          <TabPanel>
            <label style={{ width: "100%" }}>
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
            <label style={{ width: "100%" }}>
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
          </TabPanel>

          <TabPanel>
            {props.page === "main_lobby" && (
              <>
                <label>
                  {t("language")}:&nbsp;
                  <select
                    className="is-light"
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
              <Checkbox
                isDark
                checked={preferences.showDetailsOnHover}
                onToggle={(checked) =>
                  changePreference("showDetailsOnHover", checked)
                }
                label={t("show_details_on_hover")}
              />
            </p>
            <p>
              <Checkbox
                isDark
                checked={preferences.showDamageNumbers}
                onToggle={(checked) =>
                  changePreference("showDamageNumbers", checked)
                }
                label={t("show_damage_numbers")}
              />
            </p>
            <p>
              <Checkbox
                isDark
                checked={preferences.disableAnimatedTilemap}
                onToggle={(checked) => {
                  changePreference("disableAnimatedTilemap", checked)
                  const gameScene = getGameScene()
                  if (gameScene) {
                    // biome-ignore lint/suspicious/noExplicitAny: no types for animatedTiles plugin
                    const animatedTiles = (gameScene?.sys as any).animatedTiles
                    if (checked) animatedTiles.pause()
                    else animatedTiles.resume()
                  }
                }}
                label={t("disable_animated_tilemap")}
              />
            </p>
          </TabPanel>

          <TabPanel>
            <KeybindInfo />
          </TabPanel>
        </Tabs>
      </Modal.Body>
    </Modal>
  )
}
