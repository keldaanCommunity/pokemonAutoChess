import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
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
  toggleEloRoom
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

export default function PreparationMenu(props: {
  setToGame: Dispatch<SetStateAction<boolean>>
}) {
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
  const isElligibleForELO = users.filter(u => !u.isBot).length >= 2
  const averageElo = Math.round(humans.reduce((acc, u) => acc + u.elo, 0) / humans.length)

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
      const newPassword = prompt(`Enter a password for the room`)
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

  return (
    <div className="preparation-menu nes-container is-centered">
      <h1>
        {name}: {users.length}/8
      </h1>

      <div className="elo-elligibility">
        {noElo === true ? <p><img
          alt="Just for fun"
          title="Just for fun (no ELO gain/loss)"
          className="noelo-icon"
          src="/assets/ui/noelo.png"
          style={{ borderRadius: "50%" }}
        />This game is just for fun, no ELO gain/loss !</p>
        : isElligibleForELO ? <p>✔ This game is elligible for ELO gain/loss. Average ELO: {averageElo} ; GLHF !</p>
        : users.length > 1 ?<p>❌Games with bots only are not elligible for ELO gain/loss.</p>
        : <p>Add bots or wait for more players to join your room</p>
        }
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
                Private lobby {password && ` (Password: ${password})`}
              </span>
            </label>
            <label title="No ELO gain or loss for this game">
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                checked={noElo === true}
                onChange={() => toggleElo()}
              />
              <span>Just for fun</span>
            </label>
            <div className="spacer"></div>
          </div>
          {user && !user.anonymous && (<div className="actions">
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
              Change room name
            </button>
          </div>)}
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
              Add Bot
            </button>

            <select
              className="my-select"
              defaultValue={botDifficulty}
              onChange={(e) => {
                setBotDifficulty(parseInt(e.target.value))
              }}
            >
              <option value={BotDifficulty.EASY}>Easy (&lt;800)</option>
              <option value={BotDifficulty.MEDIUM}>Normal (800-1099)</option>
              <option value={BotDifficulty.HARD}>Hard (1100-1400)</option>
              <option value={BotDifficulty.EXTREME}>Extreme (&gt;1400)</option>
              <option value={BotDifficulty.CUSTOM}>Custom</option>
            </select>
          </>
        ) : (
          <p className="room-leader">
            Room leader: {ownerName}{" "}
            {password && (
              <>
                <br />
                Room password: {password}
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
          Ready {isReady ? "✔" : "?"}
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
            Start Game
          </button>
        )}
      </div>

      {isOwner && botsListSorted != null && (
        <dialog open className="nes-container bots-list">
          <header>
            <h2>Select bots for this game</h2>
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
              Sort by ELO
            </button>
            <button
              onClick={() => {
                sortBy("name")
              }}
              className="bubbly blue"
            >
              Sort by name
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
              Cancel
            </button>
            <button
              className="bubbly blue"
              onClick={() => {
                botsSelection.forEach((bot) => dispatch(addBot(bot)))
                dispatch(setBotsList(null))
              }}
            >
              Add {botsSelection.size} bot{botsSelection.size === 1 ? "" : "s"}
            </button>
          </footer>
        </dialog>
      )}
    </div>
  )
}
