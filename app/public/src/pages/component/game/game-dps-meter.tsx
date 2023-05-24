import React, { useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import CSS from "csstype"
import GameBlueDpsMeter from "./game-blue-dps-meter"
import GameRedDpsMeter from "./game-red-dps-meter"
import GameBlueHealDpsMeter from "./game-blue-heal-dps-meter"
import GameRedHealDpsMeter from "./game-red-heal-dps-meter"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../utils"
import "./game-dps-meter.css"
import { loadPreferences, savePreferences } from "../../../preferences"

export default function GameDpsMeter() {
  const opponentName = useAppSelector(
    (state) => state.game.currentPlayerOpponentName
  )
  const opponentAvatar = useAppSelector(
    (state) => state.game.currentPlayerOpponentAvatar
  )
  const avatar = useAppSelector((state) => state.game.currentPlayerAvatar)
  const name = useAppSelector((state) => state.game.currentPlayerName)
  const [isOpen, setOpen] = useState(loadPreferences().showDpsMeter)

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
            <img
              src={getAvatarSrc(avatar)}
              className="pokemon-portrait"
              title={name}
            ></img>
            <h2>Vs</h2>
            <img
              src={getAvatarSrc(opponentAvatar)}
              className="pokemon-portrait"
              title={opponentName}
            ></img>
          </header>
          <Tabs>
            <TabList>
              <Tab key="damage">
                <p>Damage</p>
              </Tab>
              <Tab key="heal">
                <p>Heal</p>
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
