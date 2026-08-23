import Phaser from "phaser"
import type { Dispatch, SetStateAction } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { isThemeUnlocked, THEMES } from "../../../../../config"
import { GADGETS } from "../../../../../config/game/gadgets"
import { Language } from "../../../../../types/enum/Language"
import { LanguageNames } from "../../../../dist/client/locales"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { usePreferences } from "../../../preferences"
import { selectLanguage } from "../../../stores/NetworkStore"
import { getGameScene } from "../../game"
import { Checkbox } from "../checkbox/checkbox"
import type { Page } from "../main-sidebar/main-sidebar"
import { Modal } from "../modal/modal"
import GameFiles from "./game-files"
import KeybindInfo from "./keybind-info"
import "./game-options-modal.css"

export default function GameOptionsModal(props: {
  show: boolean
  hideModal: Dispatch<SetStateAction<void>>
  page: Page
}) {
  const [preferences, setPreferences] = usePreferences()
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const language = useAppSelector(
    (state) => state.network.profile?.language ?? i18n.language
  )
  const profile = useAppSelector((state) => state.network.profile)
  const profileLevel = profile?.level ?? 0

  const renderers = {
    [Phaser.AUTO]: "Auto",
    [Phaser.WEBGL]: "WebGL",
    [Phaser.CANVAS]: "Canvas"
  }

  return (
    <Modal
      show={props.show}
      onClose={props.hideModal}
      header={t("options.title")}
      className="game-options-modal anchor-top"
    >
      <Tabs>
        <TabList>
          <Tab key="sound">{t("options.sound")}</Tab>
          <Tab key="interface">{t("options.interface")}</Tab>
          <Tab key="hotkeys">{t("options.hotkeys")}</Tab>
          <Tab key="files">{t("options.game_files")}</Tab>
        </TabList>

        <TabPanel>
          <fieldset>
            <label style={{ width: "100%" }}>
              {t("jukebox.music_volume")}: {preferences.musicVolume} %
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.musicVolume}
                onInput={(e) =>
                  setPreferences({
                    musicVolume: Number.parseFloat(
                      (e.target as HTMLInputElement).value
                    )
                  })
                }
              ></input>
            </label>
          </fieldset>

          <fieldset>
            <label style={{ width: "100%" }}>
              {t("options.sfx_volume")}: {preferences.sfxVolume} %
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.sfxVolume}
                onInput={(e) =>
                  setPreferences({
                    sfxVolume: Number.parseFloat(
                      (e.target as HTMLInputElement).value
                    )
                  })
                }
              ></input>
            </label>
          </fieldset>

          <p>
            <Checkbox
              isDark
              checked={preferences.playInBackground}
              onToggle={(checked) =>
                setPreferences({ playInBackground: checked })
              }
              label={t("options.play_music_in_background")}
            />
          </p>
        </TabPanel>

        <TabPanel>
          {props.page === "main_lobby" && (
            <fieldset>
              <label>
                {t("options.language")}:&nbsp;
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
                {t("options.community_translations")}{" "}
                <a
                  href="https://discord.com/channels/737230355039387749/1488242758232834282"
                  target="_blank"
                >
                  Discord
                </a>
              </p>
            </fieldset>
          )}

          {profile && profileLevel >= GADGETS.palette.levelRequired && (
            <fieldset>
              <label>
                {t("options.theme")}:&nbsp;
                <select
                  className="is-light"
                  value={preferences.theme}
                  onChange={(e) => setPreferences({ theme: e.target.value })}
                >
                  {THEMES.filter((theme) =>
                    isThemeUnlocked(theme, profile)
                  ).map((theme) => (
                    <option key={theme} value={theme}>
                      {t(`theme.${theme}`)}
                    </option>
                  ))}
                </select>
              </label>
              <p className="info">
                {t("options.theme_info")}
              </p>
            </fieldset>
          )}

          <fieldset
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5em",
              padding: "0.5em 1em"
            }}
          >
            <Checkbox
              isDark
              checked={preferences.showDetailsOnHover}
              onToggle={(checked) =>
                setPreferences({ showDetailsOnHover: checked })
              }
              label={t("options.show_details_on_hover")}
            />
            <Checkbox
              isDark
              checked={preferences.showDamageNumbers}
              onToggle={(checked) =>
                setPreferences({ showDamageNumbers: checked })
              }
              label={t("options.show_damage_numbers")}
            />
            <Checkbox
              isDark
              checked={preferences.disableAnimatedTilemap}
              onToggle={(checked) => {
                setPreferences({ disableAnimatedTilemap: checked })
                const gameScene = getGameScene()
                if (gameScene) {
                  gameScene.toggleTilesetAnimation(checked)
                }
              }}
              label={t("options.disable_animated_tilemap")}
            />
            <Checkbox
              isDark
              checked={preferences.disableCameraShake}
              onToggle={(checked) => {
                setPreferences({ disableCameraShake: checked })
              }}
              label={t("options.disable_camera_shake")}
            />
            <Checkbox
              isDark
              checked={preferences.antialiasing}
              onToggle={(checked) => setPreferences({ antialiasing: checked })}
              label={t("options.antialiasing")}
            />
            <Checkbox
              isDark
              checked={preferences.customCursors}
              onToggle={(checked) => setPreferences({ customCursors: checked })}
              label={t("options.custom_cursors")}
            />
            <Checkbox
              isDark
              checked={preferences.colorblindMode}
              onToggle={(checked) =>
                setPreferences({ colorblindMode: checked })
              }
              label={t("options.colorblind_mode")}
            />
          </fieldset>

          {props.page === "main_lobby" && (
            <fieldset>
              <label>
                {t("options.renderer")}:&nbsp;
                <select
                  className="is-light"
                  value={preferences.renderer}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value)
                    if (!isNaN(parsed)) {
                      setPreferences({ renderer: parsed })
                    }
                  }}
                >
                  {Object.keys(renderers).map((r) => (
                    <option key={r} value={r}>
                      {renderers[r]}
                    </option>
                  ))}
                </select>
                <p className="info">{t("options.renderer_info")}</p>
              </label>
            </fieldset>
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
