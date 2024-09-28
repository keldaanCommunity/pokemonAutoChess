import React, { Dispatch, SetStateAction, useState } from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
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
import KeybindInfo from "./keybind-info"
import GameFiles from "./game-files"
import { Page } from "../main-sidebar/main-sidebar"

import "./game-options-modal.css"
import { Modal } from "../modal/modal"

export default function GameOptionsModal(props: {
  show: boolean
  hideModal: Dispatch<SetStateAction<void>>
  page: Page
}) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const language = i18n.language

  const renderers = {
    [Phaser.AUTO]: "Auto",
    [Phaser.WEBGL]: "WebGL",
    [Phaser.CANVAS]: "Canvas"
  }

  function changePreference(
    key: keyof IPreferencesState,
    value: string | number | boolean
  ) {
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
    <Modal
      show={props.show}
      onClose={props.hideModal}
      header={t("options")}
      className="game-options-modal anchor-top">
      <Tabs>
        <TabList>
          <Tab key="sound">{t("sound")}</Tab>
          <Tab key="interface">{t("interface")}</Tab>
          <Tab key="hotkeys">{t("hotkeys")}</Tab>
          <Tab key="files">{t("game_files")}</Tab>
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
                    i18n.changeLanguage(e.target.value as Language)
                  }}
                >
                  {Object.keys(Language).map((lng) => (
                    <option key={lng} value={lng}>
                      {LanguageNames[lng]}
                    </option>
                  ))}
                </select>
              </label>
              <p className="info">
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
              checked={preferences.fullscreen}
              onToggle={(checked) =>
                changePreference("fullscreen", checked)
              }
              label={t("enter_fullscreen_on_game_start")}
            />
          </p>
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
                  const animatedTiles = (gameScene?.sys as any).animatedTiles
                  if (checked) animatedTiles.pause()
                  else animatedTiles.resume()
                }
              }}
              label={t("disable_animated_tilemap")}
            />
          </p>
          {props.page === "main_lobby" && (
            <>
              <label>
                {t("renderer")}:&nbsp;
                <select
                  className="is-light"
                  value={preferences.renderer}
                  onChange={(e) => {
                    changePreference("renderer", e.target.value)
                  }}
                >
                  {Object.keys(renderers).map((r) => (
                    <option key={r} value={r}>
                      {renderers[r]}
                    </option>
                  ))}
                </select>
                <p className="info">{t("renderer_info")}</p>
              </label>
            </>
          )}
        </TabPanel>

        <TabPanel>
          <KeybindInfo />
        </TabPanel>

        <TabPanel>
          <GameFiles />
        </TabPanel>
      </Tabs>
    </Modal>
  )
}
