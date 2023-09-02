import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Navigate } from "react-router-dom"
import { produce } from "immer"
import ModalMenu from "./modal-menu"
import {
  IBot,
  IDetailledPokemon
} from "../../../../../models/mongo-models/bot-v2"
import { useAppSelector, useAppDispatch } from "../../../hooks"
import { createBot, requestBotList } from "../../../stores/NetworkStore"
import { BotGuideButton } from "../buttons/bot-guide-button"
import { Emotion, ModalMode } from "../../../../../types"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import {
  DEFAULT_BOT_STATE,
  getMaxItemComponents,
  getNbComponentsOnBoard,
  getPowerEvaluation,
  getPowerScore,
  POWER_AVERAGES,
  rewriteBotRoundsRequiredto1
} from "./bot-logic"
import TeamBuilder from "./team-builder"
import "./bot-builder.css"
import ScoreIndicator from "./score-indicator"
import { max, min } from "../../../../../utils/number"
import store from "../../../stores"
import { join } from "../../lobby"

const MAX_STAGE = 30

export default function BotBuilder() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [currentStage, setStage] = useState<number>(0)
  const [bot, setBot] = useState<IBot>(DEFAULT_BOT_STATE)
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.IMPORT)
  const [modalBoolean, setModalBoolean] = useState<boolean>(false)

  const pastebinUrl: string = useAppSelector((state) => state.lobby.pastebinUrl)
  const botData: IBot = useAppSelector((state) => state.lobby.botData)
  const bots = useAppSelector((state) => state.lobby.botList)

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowRight") nextStep()
      if (ev.key === "ArrowLeft") prevStep()
    }
    window.addEventListener("keydown", onKey, false)
    return () => {
      window.removeEventListener("keydown", onKey, false)
    }
  })

  const [toAuth, setToAuth] = useState<boolean>(false)
  const lobbyJoined = useRef<boolean>(false)
  useEffect(() => {
    const client = store.getState().network.client
    if (!lobbyJoined.current) {
      join(dispatch, client, setToAuth)
      lobbyJoined.current = true
    }
  }, [lobbyJoined, dispatch])

  if (toAuth) {
    return <Navigate to={"/"} />
  }

  const prevStep = useCallback(
    () => setStage(min(0)(currentStage - 1)),
    [currentStage]
  )
  const nextStep = useCallback(
    () => setStage(max(MAX_STAGE)(currentStage + 1)),
    [currentStage]
  )

  if (bots.length === 0) {
    dispatch(requestBotList())
  }

  function importBot(text: string) {
    try {
      const b: IBot = JSON.parse(text)
      setBot(rewriteBotRoundsRequiredto1(b))
      setModalBoolean(false)
    } catch (e) {
      alert(e)
    }
  }

  function create() {
    dispatch(createBot(bot))
  }

  function updateStep(board: IDetailledPokemon[]) {
    bot.steps[currentStage].board = board
    setBot({ ...bot })
  }

  const board = useMemo(
    () => bot.steps[currentStage]?.board ?? [],
    [bot, currentStage]
  )
  const nbComponentsOnBoard = useMemo(
    () => getNbComponentsOnBoard(board),
    [board]
  )
  const nbMaxComponentsOnBoard = useMemo(
    () => getMaxItemComponents(currentStage),
    [currentStage]
  )
  const powerScore = useMemo(() => getPowerScore(board), [board])
  const powerEvaluation = useMemo(
    () => getPowerEvaluation(powerScore, currentStage),
    [board, currentStage]
  )

  return (
    <div id="bot-builder">
      <header>
        <button onClick={() => navigate("/lobby")} className="bubbly blue">
          {t("back_to_lobby")}
        </button>
        <div className="spacer"></div>
        <button
          onClick={() => {
            setModalMode(ModalMode.IMPORT)
            setModalBoolean(true)
          }}
          className="bubbly orange"
        >
          {t("import")}/{t("load")}
        </button>
        <button
          onClick={() => {
            setModalMode(ModalMode.EXPORT)
            setModalBoolean(true)
          }}
          className="bubbly orange"
        >
          {t("export")}
        </button>
        <BotGuideButton />
      </header>
      <div className="step-info nes-container">
        <div className="step-control">
          <button onClick={prevStep} disabled={currentStage <= 0}>
            <img src="assets/ui/arrow-left.svg" alt="←" />
          </button>
          <span>
            {t("stage")} {currentStage}
          </span>
          <button onClick={nextStep} disabled={currentStage >= MAX_STAGE}>
            <img src="assets/ui/arrow-right.svg" alt="→" />
          </button>
        </div>
        <span
          className={
            nbComponentsOnBoard > nbMaxComponentsOnBoard ? "invalid" : "valid"
          }
        >
          {t("item_components")}: {nbComponentsOnBoard} /{" "}
          {nbMaxComponentsOnBoard}
        </span>
        <span>
          {t("board_power")}: {powerScore}
        </span>
        <div>
          <ScoreIndicator value={powerEvaluation} />
        </div>
      </div>
      <TeamBuilder
        avatar={bot.avatar}
        author={bot.author}
        board={board}
        updateBoard={updateStep}
        name={bot.name}
        elo={bot.elo}        
      />

      <ModalMenu
        modalBoolean={modalBoolean}
        showModal={(mode: ModalMode) => {
          setModalMode(mode)
          setModalBoolean(true)
        }}
        bot={bot}
        hideModal={() => {
          setModalBoolean(false)
        }}
        modalMode={modalMode}
        importBot={importBot}
        pasteBinUrl={pastebinUrl}
        createBot={create}
        botData={botData}
      />
    </div>
  )
}
