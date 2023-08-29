import React, { useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../utils"
import { getPreferences, savePreferences } from "../../../preferences"
import { useTranslation } from "react-i18next"
import GamePlayerDpsMeter from "./game-player-dps-meter"
import GamePlayerHpsMeter from "./game-player-hps-meter"
import "./game-dps-meter.css"

export default function GameDpsMeter() {
  const { t } = useTranslation()
  const opponentName = useAppSelector(
    (state) => state.game.currentPlayerOpponentName
  )
  const opponentAvatar = useAppSelector(
    (state) => state.game.currentPlayerOpponentAvatar
  )

  const teamIndex = useAppSelector(
    (state) => state.game.currentSimulationTeamIndex
  )
  const blueDpsMeter = useAppSelector((state) => state.game.blueDpsMeter)
  const redDpsMeter = useAppSelector((state) => state.game.redDpsMeter)
  const myDpsMeter = teamIndex === 0 ? blueDpsMeter : redDpsMeter
  const opponentDpsMeter = teamIndex === 0 ? redDpsMeter : blueDpsMeter

  const blueHpsMeter = useAppSelector((state) => state.game.blueHealDpsMeter)
  const redHpsMeter = useAppSelector((state) => state.game.redHealDpsMeter)
  const myHpsMeter = teamIndex === 0 ? blueHpsMeter : redHpsMeter
  const opponentHpsMeter = teamIndex === 0 ? redHpsMeter : blueHpsMeter

  const avatar = useAppSelector((state) => state.game.currentPlayerAvatar)
  const name = useAppSelector((state) => state.game.currentPlayerName)
  const [isOpen, setOpen] = useState(getPreferences().showDpsMeter)

  function toggleOpen() {
    setOpen(!isOpen)
    savePreferences({ showDpsMeter: !isOpen })
  }

  if (opponentAvatar == "") {
    return null
  }

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
            <img src={getAvatarSrc(avatar)} className="pokemon-portrait"></img>
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
            <GamePlayerDpsMeter dpsMeter={myDpsMeter} />
            <GamePlayerDpsMeter dpsMeter={opponentDpsMeter} />
          </TabPanel>

          <TabPanel>
            <GamePlayerHpsMeter hpsMeter={myHpsMeter} />
            <GamePlayerHpsMeter hpsMeter={opponentHpsMeter} />
          </TabPanel>
        </Tabs>
      </div>
    </>
  )
}
