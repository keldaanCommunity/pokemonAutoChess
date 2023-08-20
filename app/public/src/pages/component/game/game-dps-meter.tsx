import React, { useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import GameBlueDpsMeter from "./game-blue-dps-meter"
import GameRedDpsMeter from "./game-red-dps-meter"
import GameBlueHealDpsMeter from "./game-blue-heal-dps-meter"
import GameRedHealDpsMeter from "./game-red-heal-dps-meter"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../utils"
import { getPreferences, savePreferences } from "../../../preferences"
import "./game-dps-meter.css"
import { useTranslation } from "react-i18next"

export default function GameDpsMeter() {
  const { t } = useTranslation()
  const opponentName = useAppSelector(
    (state) => state.game.currentPlayerOpponentName
  )
  const opponentAvatar = useAppSelector(
    (state) => state.game.currentPlayerOpponentAvatar
  )

  const avatar = useAppSelector((state) => state.game.currentPlayerAvatar)
  const name = useAppSelector((state) => state.game.currentPlayerName)
  const [isOpen, setOpen] = useState(getPreferences().showDpsMeter)

  function toggleOpen() {
    setOpen(!isOpen)
    savePreferences({ showDpsMeter: !isOpen })
  }

  if (opponentAvatar == "") {
    return null
  } else {
    return (
      <>
        <div
          id="game-dps-icon"
          className="nes-container clickable"
          title={`${isOpen ? "Hide" : "Show"} battle stats`}
          onClick={toggleOpen}
        >
          <img src="/assets/ui/dpsmeter.svg" />
        </div>
        <div
          className="nes-container hidden-scrollable game-dps-meter"
          hidden={!isOpen}
        >
          <header>
            <div>
              <img
                src={getAvatarSrc(avatar)}
                className="pokemon-portrait"
              ></img>
              <p>{name}</p>
            </div>
            <h2>Vs</h2>
            <div>
              <img
                src={getAvatarSrc(opponentAvatar)}
                className="pokemon-portrait"
              ></img>
              <p>{opponentName}</p>
            </div>
          </header>
          <Tabs>
            <TabList>
              <Tab key="damage_label">
                <p>{t("damage_label")}</p>
              </Tab>
              <Tab key="heal">
                <p>{t("heal")}</p>
              </Tab>
            </TabList>

            <TabPanel>
              <GameBlueDpsMeter />
              <GameRedDpsMeter />
            </TabPanel>

            <TabPanel>
              <GameBlueHealDpsMeter />
              <GameRedHealDpsMeter />
            </TabPanel>
          </Tabs>
        </div>
      </>
    )
  }
}
