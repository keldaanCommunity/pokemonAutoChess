import React, { useState } from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { preferences, savePreferences } from "../../../preferences"
import { getAvatarSrc } from "../../../utils"
import GamePlayerDpsMeter from "./game-player-dps-meter"
import GamePlayerDpsTakenMeter from "./game-player-dps-taken-meter"
import GamePlayerHpsMeter from "./game-player-hps-meter"
import { Team } from "../../../../../types/enum/Game"
import "./game-dps-meter.css"

export default function GameDpsMeter() {
  const { t } = useTranslation()
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const team = useAppSelector(
    (state) => state.game.currentTeam
  )
  const blueDpsMeter = useAppSelector((state) => state.game.blueDpsMeter)
  const redDpsMeter = useAppSelector((state) => state.game.redDpsMeter)
  const myDpsMeter = team === Team.BLUE_TEAM ? blueDpsMeter : redDpsMeter
  const opponentDpsMeter = team === Team.BLUE_TEAM ? redDpsMeter : blueDpsMeter

  const [isOpen, setOpen] = useState(preferences.showDpsMeter)

  if (!currentPlayer) return null

  const name = currentPlayer.name
  const avatar = currentPlayer.avatar
  const opponentName = currentPlayer.opponentName
  const opponentAvatar = currentPlayer.opponentAvatar

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
        className="my-box clickable"
        title={`${isOpen ? "Hide" : "Show"} battle stats`}
        onClick={toggleOpen}
      >
        <img src="/assets/ui/dpsmeter.svg" />
      </div>
      {isOpen && <div
        className="my-container hidden-scrollable game-dps-meter"
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
            <p>{t(opponentName)}</p>
          </div>
        </header>
        <Tabs>
          <TabList>
            <Tab key="damage_dealt">
              <img
                src="assets/icons/ATK.png"
                title={t("damage_dealt")}
                alt={t("damage_dealt")}
              ></img>
            </Tab>
            <Tab key="damage_blocked">
              <img
                src="assets/icons/SHIELD.png"
                title={t("damage_blocked")}
                alt={t("damage_blocked")}
              ></img>
            </Tab>
            <Tab key="heal">
              <img
                src="assets/icons/HP.png"
                title={t("heal_shield")}
                alt={t("heal_shield")}
              ></img>
            </Tab>
          </TabList>

          <TabPanel>
            <p>{t("damage_dealt")}</p>
            <GamePlayerDpsMeter dpsMeter={myDpsMeter} />
            <GamePlayerDpsMeter dpsMeter={opponentDpsMeter} />
          </TabPanel>

          <TabPanel>
            <p>{t("damage_blocked")}</p>
            <GamePlayerDpsTakenMeter dpsMeter={myDpsMeter} />
            <GamePlayerDpsTakenMeter dpsMeter={opponentDpsMeter} />
          </TabPanel>

          <TabPanel>
            <p>{t("heal_shield")}</p>
            <GamePlayerHpsMeter dpsMeter={myDpsMeter} />
            <GamePlayerHpsMeter dpsMeter={opponentDpsMeter} />
          </TabPanel>
        </Tabs>
      </div>}
    </>
  )
}
