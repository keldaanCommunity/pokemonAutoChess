import React from "react"
import { useAppSelector } from "../../../hooks"
import { TitleName } from "../../../../../types/strings/Title"
import {
  WeatherLabel,
  WeatherDescription
} from "../../../../../types/strings/Weather"
import { getAvatarSrc, getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import TimerBar from "./game-timer-bar"
import ReactTooltip from "react-tooltip"
import {
  AdditionalPicksStages,
  CarouselStages,
  MythicalPicksStages,
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

export default function GameStageInfo() {
  const name = useAppSelector((state) => state.game.currentPlayerName)
  const title = useAppSelector((state) => state.game.currentPlayerTitle)
  const avatar = useAppSelector((state) => state.game.currentPlayerAvatar)
  const weather = useAppSelector((state) => state.game.currentPlayerWeather)

  const stageLevel = useAppSelector((state) => state.game.stageLevel)
  const opponentName = useAppSelector(
    (state) => state.game.currentPlayerOpponentName
  )
  const opponentAvatar = useAppSelector(
    (state) => state.game.currentPlayerOpponentAvatar
  )
  const opponentTitle = useAppSelector(
    (state) => state.game.currentPlayerOpponentTitle
  )

  return (
    <>
      <div id="game-stage-info" className="nes-container">
        <div className="stage-information" data-tip data-for="detail-stage">
          <ReactTooltip
            id="detail-stage"
            className="customeTheme"
            effect="solid"
            place="bottom"
          >
            <p>
              <span className="help">PVE Stages:</span>{" "}
              {NeutralStage.map((s) => s.turn).join(", ")}
            </p>
            <p>
              <span className="help">Carousel Stages:</span>{" "}
              {CarouselStages.join(", ")}
            </p>
            <p>
              <span className="help">Additional picks:</span> Stages{" "}
              {AdditionalPicksStages.join(" and ")}
            </p>
            <p>
              <span className="help">Mythical picks:</span> Stages{" "}
              {MythicalPicksStages.join(" and ")}
            </p>
          </ReactTooltip>
          <p>Stage {stageLevel}</p>
        </div>

        {opponentName === "" && <StagePath />}

        <div
          className={cc("players-information", {
            "has-opponent": opponentName != ""
          })}
        >
          <div className="player-information">
            <img src={getAvatarSrc(avatar)} className="pokemon-portrait" />
            {title && <p className="player-title">{TitleName[title]}</p>}
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
          <div
            className="weather-information"
            data-tip
            data-for="detail-weather"
          >
            <ReactTooltip
              id="detail-weather"
              className="customeTheme"
              effect="solid"
              place="bottom"
            >
              <span>
                <SynergyIcon type={SynergyAssociatedToWeather.get(weather)!} />
                {WeatherLabel[weather]}
              </span>
              <p>{addIconsToDescription(WeatherDescription[weather])}</p>
            </ReactTooltip>
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

    if (CarouselStages.includes(level)) {
      path.push({
        level,
        icon: "/assets/ui/carousel.svg",
        title: `Carousel`
      })
      if (level === stageLevel && phase === GamePhaseState.MINIGAME) {
        currentLevelPathIndex = path.length - 1
      }
    }
    if (MythicalPicksStages.includes(level)) {
      path.push({
        level,
        icon: "/assets/ui/mythical.svg",
        title: `Mythical pick`
      })
      if (level === stageLevel && phase === GamePhaseState.PICK) {
        currentLevelPathIndex = path.length - 1
      }
    } else if (AdditionalPicksStages.includes(level)) {
      path.push({
        level,
        icon: "/assets/ui/additional-pick.svg",
        title: `Additional pick`
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
        title: record?.name ?? `Fight`,
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
            data-tip
            data-for={"stage-path-" + i}
          >
            <ReactTooltip
              id={"stage-path-" + i}
              className="customeTheme"
              effect="solid"
              place="bottom"
            >
              {step.title}
            </ReactTooltip>
            <img src={step.icon}></img>
          </div>
          {i < path.length - 1 && <span>―</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
