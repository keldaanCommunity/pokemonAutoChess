import React from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { PVEStages } from "../../../../../models/pve-stages"
import { Emotion } from "../../../../../types"
import {
  AdditionalPicksStages,
  ItemCarouselStages,
  PortalCarouselStages
} from "../../../../../types/Config"
import { DungeonDetails } from "../../../../../types/enum/Dungeon"
import { BattleResult, GamePhaseState } from "../../../../../types/enum/Game"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { SynergyAssociatedToWeather } from "../../../../../types/enum/Weather"
import { getAvatarSrc, getPortraitSrc } from "../../../../../utils/avatar"
import { min } from "../../../../../utils/number"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import SynergyIcon from "../icons/synergy-icon"
import TimerBar from "./game-timer-bar"
import "./game-stage-info.css"
import PokemonPortrait from "../pokemon-portrait"

export default function GameStageInfo() {
  const { t } = useTranslation()
  const phase = useAppSelector((state) => state.game.phase)
  const weather = useAppSelector((state) => state.game.weather)

  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const stageLevel = useAppSelector((state) => state.game.stageLevel)

  if (!currentPlayer) return null

  const isPVE = stageLevel in PVEStages
  const name = currentPlayer.name
  const title = currentPlayer.title
  const avatar = currentPlayer.avatar
  const opponentName =
    phase === GamePhaseState.FIGHT ? currentPlayer.opponentName : ""
  const opponentAvatar =
    phase === GamePhaseState.FIGHT ? currentPlayer.opponentAvatar : ""
  const opponentTitle =
    phase === GamePhaseState.FIGHT ? currentPlayer.opponentTitle : ""

  return (
    <>
      <div id="game-stage-info" className="my-container">
        <div className="stage-information" data-tooltip-id="detail-stage">
          {ReactDOM.createPortal(
            <Tooltip
              id="detail-stage"
              className="custom-theme-tooltip"
              place="bottom"
            >
              <p>
                <span className="help">{t("pve_stages")}:</span>{" "}
                {Object.keys(PVEStages).join(", ")}
              </p>
              <p>
                <span className="help">{t("carousel_stages")}:</span>{" "}
                {ItemCarouselStages.join(", ")}
              </p>
              <p>
                <span className="help">{t("additional_picks")}:</span>{" "}
                {t("stages")} {AdditionalPicksStages.join(t("and"))}
              </p>
              <p>
                <span className="help">{t("unique_picks")}:</span> {t("stages")}{" "}
                {PortalCarouselStages.join(t("and"))}
              </p>
            </Tooltip>,
            document.body
          )}
          <p>
            {t("stage")} {stageLevel}
          </p>
        </div>

        {opponentName === "" && <StagePath />}

        <div
          className={cc("players-information", {
            "has-opponent": opponentName != ""
          })}
        >
          <div className="player-information">
            <PokemonPortrait avatar={avatar} />
            {title && <p className="player-title">{t(`title.${title}`)}</p>}
            <p className="player-name">{name}</p>
          </div>
          {opponentName && (
            <>
              <span>vs</span>
              <div className="player-information">
                <PokemonPortrait avatar={opponentAvatar} />
                {opponentTitle && (
                  <p className="player-title">{t(`title.${opponentTitle}`)}</p>
                )}
                <p className="player-name">
                  {isPVE ? t(opponentName) : opponentName}
                </p>
              </div>
            </>
          )}
        </div>

        {currentPlayer.map && (
          <div className="map-information" data-tooltip-id="detail-map">
            {ReactDOM.createPortal(
              <Tooltip
                id="detail-map"
                className="custom-theme-tooltip"
                place="bottom"
              >
                <div style={{ display: "flex", alignContent: "center" }}>
                  {DungeonDetails[currentPlayer.map].synergies.map(
                    (synergy) => (
                      <SynergyIcon type={synergy} key={"map_type_" + synergy} />
                    )
                  )}
                  <p>{t(`map.${currentPlayer.map}`)}</p>
                </div>
              </Tooltip>,
              document.body
            )}
            <img src={`/assets/ui/map.svg`} />
          </div>
        )}

        {opponentName != "" && (
          <div className="weather-information" data-tooltip-id="detail-weather">
            {ReactDOM.createPortal(
              <Tooltip
                id="detail-weather"
                className="custom-theme-tooltip"
                place="bottom"
              >
                <span style={{ verticalAlign: "middle" }}>
                  <SynergyIcon
                    type={SynergyAssociatedToWeather.get(weather)!}
                  />
                  {t(`weather.${weather}`)}
                </span>
                <p>
                  {addIconsToDescription(t(`weather_description.${weather}`))}
                </p>
              </Tooltip>,
              document.body
            )}
            <img src={`/assets/icons/weather/${weather.toLowerCase()}.svg`} />
          </div>
        )}

        <TimerBar />
      </div>
    </>
  )
}

type PathStep = {
  level: number
  icon: string
  title: string
  result?: BattleResult
}

export function StagePath() {
  const { t } = useTranslation()
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const history = [...(currentPlayer?.history ?? [])]
  const phase = useAppSelector((state) => state.game.phase)
  const stageLevel = useAppSelector((state) => state.game.stageLevel)
  const startStage = min(1)(stageLevel - 3)
  let level = startStage
  let path: PathStep[] = []
  let currentLevelPathIndex

  while (level < stageLevel + 5) {
    let record
    if (level < stageLevel && history) {
      const historyIndex = level < 5 ? level - 1 : 5 + level - stageLevel
      if (historyIndex in history) {
        record = history.at(level < 5 ? level - 1 : level - stageLevel)
      }
    }

    if (ItemCarouselStages.includes(level)) {
      path.push({
        level,
        icon: "/assets/ui/carousel.svg",
        title: t("carousel")
      })
      if (level === stageLevel && phase === GamePhaseState.TOWN) {
        currentLevelPathIndex = path.length - 1
      }
    }
    if (PortalCarouselStages.includes(level)) {
      path.push({
        level,
        icon: "/assets/ui/mythical.svg",
        title: t("unique_pick")
      })
      if (level === stageLevel && phase === GamePhaseState.PICK) {
        currentLevelPathIndex = path.length - 1
      }
    } else if (AdditionalPicksStages.includes(level)) {
      path.push({
        level,
        icon: "/assets/ui/additional-pick.svg",
        title: t("additional_pick")
      })
      if (level === stageLevel && phase === GamePhaseState.PICK) {
        currentLevelPathIndex = path.length - 1
      }
    }

    const pveStage = PVEStages[level]
    if (pveStage) {
      path.push({
        level,
        icon: getPortraitSrc(PkmIndex[pveStage.avatar], false, Emotion.NORMAL),
        title: t(record?.name ?? pveStage.name),
        result: record?.result
      })
      if (level === stageLevel && currentLevelPathIndex === undefined) {
        currentLevelPathIndex = path.length - 1
      }
    } else {
      path.push({
        level,
        icon: record?.avatar
          ? getAvatarSrc(record.avatar)
          : "/assets/ui/battle.svg",
        title: record?.name ?? t("fight"),
        result: record?.result
      })
      if (level === stageLevel && currentLevelPathIndex === undefined) {
        currentLevelPathIndex = path.length - 1
      }
    }

    level++
  }

  const startIndex = min(0)(currentLevelPathIndex - 3)
  path = path.slice(startIndex, startIndex + 7)
  currentLevelPathIndex -= startIndex

  return (
    <div className="game-stage-path">
      {path.map((step, i) => (
        <React.Fragment key={"stage-path-" + i}>
          <div
            className={cc("stage-path", {
              current: currentLevelPathIndex === i,
              defeat: step.result === BattleResult.DEFEAT,
              victory: step.result === BattleResult.WIN,
              draw: step.result === BattleResult.DRAW
            })}
            data-tooltip-id={"stage-path-" + i}
          >
            {ReactDOM.createPortal(
              <Tooltip
                id={"stage-path-" + i}
                className="custom-theme-tooltip"
                place="bottom"
              >
                {step.title}
              </Tooltip>,
              document.body
            )}
            <img src={step.icon}></img>
          </div>
          {i < path.length - 1 && <span>―</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
