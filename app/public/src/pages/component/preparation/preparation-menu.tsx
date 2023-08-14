import React, { Dispatch, SetStateAction, useState } from "react"
import PreparationMenuUser from "./preparation-menu-user"
import { IGameUser } from "../../../../../models/colyseus-models/game-user"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  addBot,
  listBots,
  changeRoomName,
  changeRoomPassword,
  gameStartRequest,
  toggleReady,
  toggleEloRoom,
  deleteRoom
} from "../../../stores/NetworkStore"
import firebase from "firebase/compat/app"
import { Room } from "colyseus.js"
import { BotDifficulty } from "../../../../../types/enum/Game"
import { setBotsList } from "../../../stores/PreparationStore"
import PreparationState from "../../../../../rooms/states/preparation-state"
import "./preparation-menu.css"
import { cc } from "../../utils/jsx"
import { throttle } from "../../../../../utils/function"
import Elo from "../elo"
import InlineAvatar from "../inline-avatar"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { Role } from "../../../../../types"
import { useTranslation } from "react-i18next"

export default function PreparationMenu(props: {
  setToGame: Dispatch<SetStateAction<boolean>>
}) {
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
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>(
    BotDifficulty.MEDIUM
  )

  const isReady = users.find((user) => user.id === uid)?.ready
  const allUsersReady = users.every((user) => user.ready)

  const [sortBotsOrder, setSortBotsOrder] = useState<boolean>(false)
  const [sortBotsCriteria, setSortBotsCriteria] = useState<string>("name")
  const [queryBot, setQueryBot] = useState<string>("")
  const [botsSelection, setBotsSelection] = useState<Set<IBot>>(new Set())

  const humans = users.filter((u) => !u.isBot)
  const isElligibleForELO = users.filter((u) => !u.isBot).length >= 2
  const averageElo = Math.round(
    humans.reduce((acc, u) => acc + u.elo, 0) / humans.length
  )

  function sortBy(criteria: string) {
    if (sortBotsCriteria === criteria) {
      setSortBotsOrder(!sortBotsOrder)
    } else {
      setSortBotsCriteria(criteria)
      setSortBotsOrder(false)
    }
  }

  const botsListSorted = botsList
    ? [...botsList]
        .filter((b) => b.name.includes(queryBot))
        .sort(
          (a, b) =>
            (a[sortBotsCriteria] < b[sortBotsCriteria] ? -1 : 1) *
            (sortBotsOrder ? -1 : 1)
        )
    : null

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

  const deleteRoomButton =
    user?.role && [Role.ADMIN, Role.MODERATOR].includes(user.role) ? (
      <button
        className="bubbly red"
        onClick={() => {
          dispatch(deleteRoom())
        }}
      >
        {t("delete_room")}
      </button>
    ) : null

  return (
    <div className="preparation-menu nes-container is-centered">
      <h1>
        {name}: {users.length}/8
      </h1>

      <div className="elo-elligibility">
        {noElo === true ? (
          <p>
            <img
              alt="Just for fun"
              title="Just for fun (no ELO gain/loss)"
              className="noelo-icon"
              src="/assets/ui/noelo.png"
              style={{ borderRadius: "50%" }}
            />
            {t("just_for_fun_hint")}
          </p>
        ) : isElligibleForELO ? (
          <p>
            {t("elligible_elo_hint")} {t("average_elo")}: {averageElo} ;{" "}
            {t("GLHF")} !
          </p>
        ) : users.length > 1 ? (
          <p>{t("not_elligible_elo_hint")}</p>
        ) : (
          <p>A{t("add_bot_or_wait_hint")}</p>
        )}
      </div>

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

      {isOwner && (
        <>
          <div className="actions">
            <label title="Add a password to this room">
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                checked={password != null}
                onChange={() => makePrivate()}
              />
              <span>
                {t("private_lobby")} {password && ` (Password: ${password})`}
              </span>
            </label>
            <label title="No ELO gain or loss for this game">
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                checked={noElo === true}
                onChange={() => toggleElo()}
              />
              <span>{t("just_for_fun")}</span>
            </label>
            <div className="spacer"></div>
          </div>
          {user && !user.anonymous && (
            <div className="actions">
              <input
                maxLength={30}
                type="text"
                className="my-input"
                placeholder={name}
                style={{ flex: 1 }}
                onChange={(e) => {
                  setInputValue(e.target.value)
                }}
              />
              <button
                style={{ marginLeft: "10px" }}
                className="bubbly blue"
                onClick={() => dispatch(changeRoomName(inputValue))}
              >
                {t("change_room_name")}
              </button>
            </div>
          )}
        </>
      )}

      <div className="actions">
        {isOwner ? (
          <>
            <button
              className="bubbly blue"
              onClick={() => {
                if (botDifficulty === BotDifficulty.CUSTOM) {
                  setQueryBot("")
                  dispatch(listBots())
                } else {
                  dispatch(addBot(botDifficulty))
                }
              }}
            >
              {t("add_bot")}
            </button>

            <select
              className="my-select"
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
          </>
        ) : (
          <p className="room-leader">
            {t("room_leader")}: {ownerName}{" "}
            {password && (
              <>
                <br />
                {t("room_password")}: {password}
              </>
            )}
          </p>
        )}

        <div className="spacer" />

        <button
          className={cc("bubbly", "ready-button", isReady ? "green" : "orange")}
          onClick={() => {
            dispatch(toggleReady())
          }}
        >
          {t("ready")} {isReady ? "✔" : "?"}
        </button>

        {isOwner && (
          <button
            className={cc("bubbly", {
              green: allUsersReady,
              orange: !allUsersReady
            })}
            onClick={ownerId == uid ? startGame : undefined}
            data-tip
            data-for={"start-game"}
          >
            {t("start_game")}
          </button>
        )}
      </div>
      {user?.role && [Role.ADMIN, Role.MODERATOR].includes(user.role) ? (
        <div className="actions">{deleteRoomButton}</div>
      ) : null}

      {isOwner && botsListSorted != null && (
        <dialog open className="nes-container bots-list">
          <header>
            <h2>{t("select_bots_for_this_game")}</h2>
            <div className="spacer"></div>
            <input
              type="search"
              className="my-input"
              style={{ maxWidth: "20ch" }}
              placeholder="Search by name"
              value={queryBot}
              onInput={(e) => setQueryBot((e.target as HTMLInputElement).value)}
            />
            <button
              onClick={() => {
                sortBy("elo")
              }}
              className="bubbly pink"
            >
              {t("sort_by_elo")}
            </button>
            <button
              onClick={() => {
                sortBy("name")
              }}
              className="bubbly blue"
            >
              {t("sort_by_name")}
            </button>
          </header>
          <ul>
            {botsListSorted.map((bot) => (
              <li
                className={cc(
                  "nes-container",
                  "player-box",
                  "preparation-menu-user",
                  { selected: botsSelection.has(bot) }
                )}
                onClick={() => {
                  if (botsSelection.has(bot)) {
                    botsSelection.delete(bot)
                  } else {
                    botsSelection.add(bot)
                  }
                  setBotsSelection(new Set([...botsSelection]))
                }}
                key={"proposition-bot-" + bot.id}
              >
                <Elo elo={bot.elo} />
                <InlineAvatar avatar={bot.avatar} name={bot.name} />
              </li>
            ))}
          </ul>
          {botsListSorted.length === 0 && <p>No bots found !</p>}
          <footer className="actions">
            <button
              className="bubbly red"
              onClick={() => {
                dispatch(setBotsList(null))
              }}
            >
              {t("cancel")}
            </button>
            <button
              className="bubbly blue"
              onClick={() => {
                botsSelection.forEach((bot) => dispatch(addBot(bot)))
                dispatch(setBotsList(null))
              }}
            >
              {t("add")} {botsSelection.size} {t("bot")}
              {botsSelection.size === 1 ? "" : "s"}
            </button>
          </footer>
        </dialog>
      )}
    </div>
  )
}
