import React from "react"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc, getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import TimerBar from "./game-timer-bar"
import { Tooltip } from "react-tooltip"
import {
  AdditionalPicksStages,
  ItemCarouselStages,
  PortalCarouselStages,
  NeutralStage
} from "../../../../../types/Config"
import "./game-stage-info.css"
import { min } from "../../../../../utils/number"
import { BattleResult, GamePhaseState } from "../../../../../types/enum/Game"
import { SynergyAssociatedToWeather } from "../../../../../types/enum/Weather"
import SynergyIcon from "../icons/synergy-icon"
import { addIconsToDescription } from "../../utils/descriptions"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { Emotion } from "../../../../../types"
import { useTranslation } from "react-i18next"

export default function GameStageInfo() {
  const { t } = useTranslation()
  const phase = useAppSelector((state) => state.game.phase)
  const name = useAppSelector((state) => state.game.currentPlayerName)
  const title = useAppSelector((state) => state.game.currentPlayerTitle)
  const avatar = useAppSelector((state) => state.game.currentPlayerAvatar)
  const weather = useAppSelector((state) => state.game.weather)

  const stageLevel = useAppSelector((state) => state.game.stageLevel)
  const currentPlayerOpponentName = useAppSelector(
    (state) => state.game.currentPlayerOpponentName
  )
  const currentPlayerOpponentAvatar = useAppSelector(
    (state) => state.game.currentPlayerOpponentAvatar
  )
  const currentPlayerOpponentTitle = useAppSelector(
    (state) => state.game.currentPlayerOpponentTitle
  )

  const opponentName =
    phase === GamePhaseState.FIGHT ? currentPlayerOpponentName : ""
  const opponentAvatar =
    phase === GamePhaseState.FIGHT ? currentPlayerOpponentAvatar : ""
  const opponentTitle =
    phase === GamePhaseState.FIGHT ? currentPlayerOpponentTitle : ""

  return (
    <>
      <div id="game-stage-info" className="nes-container">
        <div className="stage-information" data-tooltip-id="detail-stage">
          <Tooltip id="detail-stage" className="customeTheme" place="bottom">
            <p>
              <span className="help">{t("pve_stages")}:</span>{" "}
              {NeutralStage.map((s) => s.turn).join(", ")}
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
          </Tooltip>
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
            <img src={getAvatarSrc(avatar)} className="pokemon-portrait" />
            {title && <p className="player-title">{t(`title.${title}`)}</p>}
            <p className="player-name">{name}</p>
          </div>
          {opponentName && (
            <>
              <span>vs</span>
              <div className="player-information">
                <img
                  src={getAvatarSrc(opponentAvatar)}
                  className="pokemon-portrait"
                />
                {opponentTitle && (
                  <p className="player-title">{opponentTitle}</p>
                )}
                <p className="player-name">{opponentName}</p>
              </div>
            </>
          )}
        </div>

        {opponentName != "" && (
          <div className="weather-information" data-tooltip-id="detail-weather">
            <Tooltip
              id="detail-weather"
              className="customeTheme"
              place="bottom"
            >
              <span>
                <SynergyIcon type={SynergyAssociatedToWeather.get(weather)!} />
                {t(`weather.${weather}`)}
              </span>
              <p>
                {addIconsToDescription(t(`weather_description.${weather}`))}
              </p>
            </Tooltip>
            <img src={`/assets/icons/weather/${weather.toLowerCase()}.svg`} />
          </div>
        )}
      </div>
      <TimerBar />
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
  const currentPlayer = useAppSelector((state) =>
    state.game.players.find((p) => p.id === state.game.currentPlayerId)
  )
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
      if (level === stageLevel && phase === GamePhaseState.MINIGAME) {
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

    const neutralStage = NeutralStage.find((s) => s.turn === level)
    if (neutralStage) {
      path.push({
        level,
        icon: getPortraitSrc(
          PkmIndex[neutralStage.avatar],
          false,
          Emotion.NORMAL
        ),
        title: record?.name ?? neutralStage.name,
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
            <Tooltip
              id={"stage-path-" + i}
              className="customeTheme"
              place="bottom"
            >
              {step.title}
            </Tooltip>
            <img src={step.icon}></img>
          </div>
          {i < path.length - 1 && <span>―</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
