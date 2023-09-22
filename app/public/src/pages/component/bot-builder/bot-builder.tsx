import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Navigate, useSearchParams } from "react-router-dom"
import ModalMenu from "./modal-menu"
import {
  IBot,
  IDetailledPokemon
} from "../../../../../models/mongo-models/bot-v2"
import { useAppSelector, useAppDispatch } from "../../../hooks"
import {
  createBot,
  requestBotData,
  requestBotList
} from "../../../stores/NetworkStore"
import { ModalMode, PkmWithConfig } from "../../../../../types"
import {
  DEFAULT_BOT_STATE,
  estimateElo,
  getMaxItemComponents,
  getNbComponentsOnBoard,
  getPowerEvaluation,
  getPowerScore,
  MAX_BOTS_STAGE,
  rewriteBotRoundsRequiredto1,
  validateBoard
} from "./bot-logic"
import TeamBuilder from "./team-builder"
import "./bot-builder.css"
import ScoreIndicator from "./score-indicator"
import { max, min } from "../../../../../utils/number"
import store from "../../../stores"
import { joinLobbyRoom } from "../../lobby"
import DiscordButton from "../buttons/discord-button"
import { getAvatarString } from "../../../utils"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { logger } from "../../../../../utils/logger"

export default function BotBuilder() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [queryParams, setQueryParams] = useSearchParams()
  const [currentStage, setStage] = useState<number>(1)
  const [bot, setBot] = useState<IBot>(DEFAULT_BOT_STATE)
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.IMPORT)
  const [modalBoolean, setModalBoolean] = useState<boolean>(false)
  const [violation, setViolation] = useState<string>()

  const pastebinUrl: string = useAppSelector((state) => state.lobby.pastebinUrl)
  const botData: IBot = useAppSelector((state) => state.lobby.botData)
  const bots = useAppSelector((state) => state.lobby.botList)
  const displayName = useAppSelector((state) => state.lobby.user?.name)
  const lobby = useAppSelector((state) => state.lobby)

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
      joinLobbyRoom(dispatch, client).catch((err) => {
        logger.error(err)
        setToAuth(true)
      })
      lobbyJoined.current = true
    }
  }, [lobbyJoined, dispatch])

  useEffect(() => {
    const botId = queryParams.get("bot")
    if (botId && lobby) {
      if (botData && botData.id === botId) {
        // import by query param
        setBot(rewriteBotRoundsRequiredto1(structuredClone(botData)))
        logger.debug(`bot ${botId} imported`)
      } else if (!botData) {
        logger.debug(`loading bot ${botId}`)
        // query param but no matching bot data, so we request it
        dispatch(requestBotData(botId))
      }
    }
  }, [lobby, queryParams, botData])

  if (toAuth) {
    return <Navigate to={"/"} />
  }

  const prevStep = useCallback(
    () => setStage(min(1)(currentStage - 1)),
    [currentStage]
  )
  const nextStep = useCallback(
    () => setStage(max(MAX_BOTS_STAGE)(currentStage + 1)),
    [currentStage]
  )

  useEffect(() => {
    if (currentStage >= 1 && bot.steps[currentStage].board.length === 0) {
      // automatically copy from last step
      updateStep(structuredClone(bot.steps[currentStage - 1].board))
    }
  }, [currentStage])

  useEffect(() => {
    if (lobby && bots.length === 0) {
      dispatch(requestBotList())
    }
  }, [bots, lobby])

  function importBot(text: string) {
    try {
      const b: IBot = JSON.parse(text)
      setBot(rewriteBotRoundsRequiredto1(b))
      setModalBoolean(false)
      setQueryParams({ bot: b.id })
    } catch (e) {
      alert(e)
    }
  }

  function changeAvatar(pkm: PkmWithConfig) {
    bot.name = pkm.name.toUpperCase()
    bot.avatar = getAvatarString(PkmIndex[pkm.name], pkm.shiny, pkm.emotion)
    completeBotInfo()
  }

  function completeBotInfo() {
    if (bot.id) {
      // fork existing bot
      setQueryParams({})
      bot.id = ""
    }
    setBot({
      ...bot,
      author: displayName ?? "Anonymous",
      elo: estimateElo(bot)
    })
  }

  function create() {
    dispatch(createBot(bot))
  }

  function updateStep(board: IDetailledPokemon[]) {
    bot.steps[currentStage].board = board
    completeBotInfo()
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

  useEffect(() => {
    setViolation(undefined)
    try {
      validateBoard(board, currentStage)
    } catch (err: any) {
      if (err instanceof Error) {
        setViolation(err.message)
      }
    }
  }, [board, currentStage])

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
            completeBotInfo()
            setModalMode(ModalMode.EXPORT)
            setModalBoolean(true)
          }}
          className="bubbly orange"
        >
          {t("export")}
        </button>
        <DiscordButton channel="bot-creation" />
      </header>
      <div className="step-info nes-container">
        <div className="step-control">
          <button onClick={prevStep} disabled={currentStage <= 0}>
            <img src="assets/ui/arrow-left.svg" alt="←" />
          </button>
          <span>
            {t("stage")} {currentStage}
          </span>
          <button onClick={nextStep} disabled={currentStage >= MAX_BOTS_STAGE}>
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
        bot={bot}
        onChangeAvatar={changeAvatar}
        board={board}
        updateBoard={updateStep}
        error={violation}
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
      />
    </div>
  )
}
