import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useSearchParams } from "react-router-dom"
import {
  IBot,
  IDetailledPokemon
} from "../../../../../models/mongo-models/bot-v2"
import { PkmWithCustom, Role } from "../../../../../types"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { logger } from "../../../../../utils/logger"
import { max, min } from "../../../../../utils/number"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { getAvatarString } from "../../../../../utils/avatar"
import DiscordButton from "../buttons/discord-button"
import {
  DEFAULT_BOT_STATE,
  MAX_BOTS_STAGE,
  estimateElo,
  getMaxItemComponents,
  getNbComponentsOnBoard,
  getPowerEvaluation,
  getPowerScore,
  rewriteBotRoundsRequiredto1,
  validateBoard
} from "./bot-logic"
import ImportBotModal from "./import-bot-modal"
import ExportBotModal from "./export-bot-modal"
import ScoreIndicator from "./score-indicator"
import TeamBuilder from "./team-builder"
import { joinLobbyRoom } from "../../../game/lobby-logic"
import "./bot-builder.css"

export default function BotBuilder() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [queryParams, setQueryParams] = useSearchParams()
  const [currentStage, setStage] = useState<number>(1)
  const [bot, setBot] = useState<IBot>(DEFAULT_BOT_STATE)
  const [currentModal, setCurrentModal] = useState<"import" | "export" | null>(null)
  const [violation, setViolation] = useState<string>()
  const user = useAppSelector((state) => state.network.profile)
  const isBotManager = user?.role === Role.BOT_MANAGER || user?.role === Role.ADMIN

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

  const lobbyJoined = useRef<boolean>(false)
  useEffect(() => {
    if (!lobbyJoined.current) {
      joinLobbyRoom(dispatch, navigate)
      lobbyJoined.current = true
    }
  }, [lobbyJoined])

  useEffect(() => {
    const botId = queryParams.get("bot")
    if (botId && (!bot || bot.id !== botId)) {
      logger.debug(`loading bot ${botId}`)
      // query param but no matching bot data, so we request it
      fetch(`/bots/${botId}`).then(r => r.json()).then(botData => {
        setBot(rewriteBotRoundsRequiredto1(structuredClone(botData)))
        logger.debug(`bot ${botId} imported`)
      })
    }
  }, [queryParams])

  const prevStep = useCallback(
    () => setStage(min(1)(currentStage - 1)),
    [currentStage]
  )
  const nextStep = useCallback(
    () => setStage(max(MAX_BOTS_STAGE)(currentStage + 1)),
    [currentStage]
  )

  useEffect(() => {
    if (
      currentStage >= 1 &&
      currentStage in bot.steps &&
      bot.steps[currentStage].board.length === 0
    ) {
      // automatically copy from last step
      updateStep(structuredClone(bot.steps[currentStage - 1].board))
    }
  }, [currentStage, bot.steps])

  function importBot(text: string) {
    try {
      const b: IBot = JSON.parse(text)
      setBot(rewriteBotRoundsRequiredto1(b))
      setCurrentModal(null)
      setQueryParams({ bot: b.id })
    } catch (e) {
      alert(e)
    }
  }

  function changeAvatar(pkm: PkmWithCustom) {
    bot.name = pkm.name.toUpperCase()
    bot.avatar = getAvatarString(PkmIndex[pkm.name], pkm.shiny, pkm.emotion)
    completeBotInfo()
  }

  function completeBotInfo() {
    if (bot.id && !isBotManager) {
      // fork existing bot
      setQueryParams({})
      bot.id = ""
    }
    setBot({
      ...bot,
      author: user?.displayName ?? "Anonymous",
      elo: estimateElo(bot)
    })
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
    [powerScore, currentStage]
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
        {isBotManager && (
          <button onClick={() => navigate("/bot-admin")} className="bubbly red">
            {t("bot_admin")}
          </button>
        )}
        <button
          onClick={() => { setCurrentModal("import") }}
          className="bubbly orange"
        >
          {t("import")}
        </button>
        <button
          onClick={() => {
            completeBotInfo()
            setCurrentModal("export")
          }}
          className="bubbly orange"
        >
          {t("export")}
        </button>
        <DiscordButton url={"https://discord.com/channels/737230355039387749/914503292875325461"} />
      </header>
      <div className="step-info my-container">
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

      <ImportBotModal
        visible={currentModal === "import"}
        bot={bot}
        hideModal={() => { setCurrentModal(null) }}
        importBot={importBot}
      />

      <ExportBotModal
        visible={currentModal === "export"}
        bot={bot}
        hideModal={() => { setCurrentModal(null) }}
      />
    </div>
  )
}
