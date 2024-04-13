import { Room } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IGameUser } from "../../../../../models/colyseus-models/game-user"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import PreparationState from "../../../../../rooms/states/preparation-state"
import { Role } from "../../../../../types"
import { BotDifficulty, GameMode } from "../../../../../types/enum/Game"
import { throttle } from "../../../../../utils/function"
import { setTitleNotificationIcon } from "../../../../../utils/window"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  addBot,
  changeRoomName,
  changeRoomPassword,
  deleteRoom,
  gameStartRequest,
  listBots,
  toggleEloRoom,
  toggleReady
} from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { BotSelectModal } from "./bot-select-modal"
import PreparationMenuUser from "./preparation-menu-user"
import "./preparation-menu.css"

export default function PreparationMenu() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [inputValue, setInputValue] = useState<string>("")
  const users: IGameUser[] = useAppSelector((state) => state.preparation.users)
  const user = useAppSelector((state) => state.preparation.user)
  const ownerName: string = useAppSelector(
    (state) => state.preparation.ownerName
  )
  const name: string = useAppSelector((state) => state.preparation.name)
  const ownerId: string = useAppSelector((state) => state.preparation.ownerId)
  const password: string | null = useAppSelector(
    (state) => state.preparation.password
  )
  const noElo: boolean = useAppSelector((state) => state.preparation.noElo)
  const botsList: IBot[] | null = useAppSelector(
    (state) => state.preparation.botsList
  )
  const uid: string = useAppSelector((state) => state.network.uid)
  const isOwner: boolean = useAppSelector(
    (state) => state.preparation.ownerId === state.network.uid
  )
  const room: Room<PreparationState> | undefined = useAppSelector(
    (state) => state.network.preparation
  )

  const gameMode = useAppSelector((state) => state.preparation.gameMode)
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>(
    BotDifficulty.MEDIUM
  )

  const isReady = users.find((user) => user.id === uid)?.ready
  const nbUsersReady = users.filter((user) => user.ready).length
  const allUsersReady = users.every((user) => user.ready) && nbUsersReady > 1

  const isAdmin = user?.role === Role.ADMIN
  const isModerator = user?.role === Role.MODERATOR

  useEffect(() => {
    if (allUsersReady) {
      setTitleNotificationIcon("🟢")
    } else if (nbUsersReady === 0) {
      setTitleNotificationIcon("🔴")
    } else if (nbUsersReady === users.length - 1) {
      setTitleNotificationIcon("🟡")
    } else {
      setTitleNotificationIcon("🟠")
    }
  }, [nbUsersReady, users.length])

  const humans = users.filter((u) => !u.isBot)
  const isElligibleForELO = users.filter((u) => !u.isBot).length >= 2
  const averageElo = Math.round(
    humans.reduce((acc, u) => acc + u.elo, 0) / humans.length
  )

  function makePrivate() {
    if (password === null) {
      const newPassword = prompt(t("enter_password"))
      dispatch(changeRoomPassword(newPassword))
    } else {
      dispatch(changeRoomPassword(null))
    }
  }

  function toggleElo() {
    dispatch(toggleEloRoom(!noElo))
  }

  const startGame = throttle(async function startGame() {
    if (room) {
      const token = await firebase.auth().currentUser?.getIdToken()
      if (token) {
        dispatch(gameStartRequest(token))
      }
    }
  }, 1000)

  const deleteRoomButton = (isModerator || isAdmin) && (
    <button
      className="bubbly red"
      onClick={() => {
        dispatch(deleteRoom())
      }}
    >
      {t("delete_room")}
    </button>
  )

  const headerMessage = (
    <>
      {gameMode === GameMode.RANKED && <p>{t("ranked_game_hint")}</p>}

      {gameMode === GameMode.SCRIBBLE && (
        <p>
          <img
            alt={t("smeargle_scribble")}
            title={t("smeargle_scribble_hint")}
            className="scribble icon"
            src={"/assets/ui/scribble.png"}
            style={{ borderRadius: "50%" }}
          />
          {t("smeargle_scribble_hint")}
        </p>
      )}

      {noElo === true ? (
        <p>
          <img
            alt={t("no_elo")}
            title={t("no_elo_hint")}
            className="noelo-icon"
            src="/assets/ui/noelo.png"
            style={{ borderRadius: "50%" }}
          />
          {t("no_elo_hint")}
        </p>
      ) : isElligibleForELO ? (
        <p>
          {t("elligible_elo_hint")} {t("average_elo")}: {averageElo} ;{" "}
          {t("GLHF")}
          {" !"}
        </p>
      ) : users.length > 1 ? (
        <p>{t("not_elligible_elo_hint")}</p>
      ) : null}

      {users.length === 1 && <p>{t("add_bot_or_wait_hint")}</p>}
    </>
  )

  const roomPrivateButton = gameMode === GameMode.NORMAL &&
    (isOwner || isAdmin) && (
      <button
        className="bubbly blue"
        onClick={makePrivate}
        title={
          password ? t("make_room_public_hint") : t("make_room_private_hint")
        }
      >
        {password ? t("make_room_public") : t("make_room_private")}
      </button>
    )

  const roomEloButton = gameMode === GameMode.NORMAL &&
    (isOwner || isAdmin) && (
      <button
        className="bubbly blue"
        onClick={toggleElo}
        title={noElo ? t("enable_elo_hint") : t("disable_elo_hint")}
      >
        {noElo ? t("enable_elo") : t("disable_elo")}
      </button>
    )

  const roomNameInput = (isOwner || isModerator || isAdmin) &&
    user &&
    !user.anonymous && (
      <div className="my-input-group">
        <input
          maxLength={30}
          type="text"
          placeholder={name}
          style={{ flex: 1 }}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          className="with-button"
        />
        <button
          className="bubbly blue"
          onClick={() => dispatch(changeRoomName(inputValue))}
        >
          {t("change_room_name")}
        </button>
      </div>
    )

  const botControls = (isOwner || isAdmin) && (
    <div className="my-input-group">
      <button
        className="bubbly blue"
        onClick={() => {
          if (botDifficulty === BotDifficulty.CUSTOM) {
            dispatch(listBots())
          } else {
            dispatch(addBot(botDifficulty))
          }
        }}
      >
        {t("add_bot")}
      </button>

      <select
        defaultValue={botDifficulty}
        onChange={(e) => {
          setBotDifficulty(parseInt(e.target.value))
        }}
      >
        <option value={BotDifficulty.EASY}>{t("easy_bot")}</option>
        <option value={BotDifficulty.MEDIUM}>{t("normal_bot")}</option>
        <option value={BotDifficulty.HARD}>{t("hard_bot")}</option>
        <option value={BotDifficulty.EXTREME}>{t("extreme_bot")}</option>
        <option value={BotDifficulty.CUSTOM}>{t("custom_bot")}</option>
      </select>
    </div>
  )

  const roomInfo = (
    <p className="room-info">
      {t("room_leader")}: {ownerName}{" "}
      {password && (
        <>
          {" - "}
          {t("room_password")}: {password}
        </>
      )}
    </p>
  )

  const readyButton = (
    <button
      className={cc("bubbly", "ready-button", isReady ? "green" : "orange")}
      onClick={() => {
        dispatch(toggleReady())
      }}
    >
      {t("ready")} {isReady ? "✔" : "?"}
    </button>
  )

  const startGameButton = (isOwner || isAdmin) && (
    <button
      className={cc("bubbly", {
        green: allUsersReady,
        orange: !allUsersReady
      })}
      onClick={startGame}
      data-tooltip-id={"start-game"}
    >
      {t("start_game")}
    </button>
  )

  return (
    <div className="preparation-menu my-container is-centered custom-bg">
      <header>
        <h1>
          {name}: {users.length}/8
        </h1>
        {headerMessage}
      </header>

      <div className="preparation-menu-users">
        {users.map((u) => {
          return (
            <PreparationMenuUser
              key={u.id}
              user={u}
              isOwner={isOwner}
              ownerId={ownerId}
            />
          )
        })}
      </div>

      <div className="actions">
        {botControls}
        <div className="spacer"></div>
        {deleteRoomButton}
      </div>

      <div className="actions">
        {roomNameInput}
        <div className="spacer"></div>
        {roomPrivateButton}
        {roomEloButton}
      </div>

      <div className="actions">
        {roomInfo}
        <div className="spacer" />
        {readyButton}
        {startGameButton}
      </div>

      {isOwner && botsList != null && <BotSelectModal bots={botsList} />}
    </div>
  )
}
