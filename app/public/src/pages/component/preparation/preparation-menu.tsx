import React, { Dispatch, SetStateAction, useState } from "react"
import PreparationMenuUser from "./preparation-menu-user"
import { IGameUser } from "../../../../../models/colyseus-models/game-user"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  addBot,
  listBots,
  changeRoomName,
  changeRoomPassword,
  gameStart,
  toggleReady
} from "../../../stores/NetworkStore"
import firebase from "firebase/compat/app"
import { Client, Room } from "colyseus.js"
import GameState from "../../../../../rooms/states/game-state"
import { BotDifficulty } from "../../../../../types/enum/Game"
import { leavePreparation, setBotsList } from "../../../stores/PreparationStore"
import PreparationState from "../../../../../rooms/states/preparation-state"
import "./preparation-menu.css";
import { cc } from "../../utils/jsx"
import { throttle } from "../../../../../utils/function"
import { playSound, SOUNDS } from "../../utils/audio"
import Elo from "../elo"
import InlineAvatar from "../inline-avatar"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { RemoveButton } from "../buttons/remove-button"

export default function PreparationMenu(props: {
  setToGame: Dispatch<SetStateAction<boolean>>
}) {
  const dispatch = useAppDispatch()
  const [inputValue, setInputValue] = useState<string>("")
  const users: IGameUser[] = useAppSelector((state) => state.preparation.users)
  const ownerName: string = useAppSelector(
    (state) => state.preparation.ownerName
  )
  const name: string = useAppSelector((state) => state.preparation.name)
  const ownerId: string = useAppSelector((state) => state.preparation.ownerId)
  const password: string | null = useAppSelector((state) => state.preparation.password)
  const botsList: IBot[] | null = useAppSelector((state) => state.preparation.botsList)
  const uid: string = useAppSelector((state) => state.network.uid)
  const isOwner: boolean = useAppSelector(
    (state) => state.preparation.ownerId === state.network.uid
  )
  const client: Client = useAppSelector((state) => state.network.client)
  const room: Room<PreparationState> | undefined = useAppSelector(
    (state) => state.network.preparation
  )
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>(
    BotDifficulty.MEDIUM
  )

  const isReady = users.find(user => user.id === uid)?.ready
  const allUsersReady = users.every(user => user.ready)

  const [sortBots, setSortBots] = useState<string>("name")
  const [queryBot, setQueryBot] = useState<string>("")
  const botsListSorted = botsList ? [...botsList].filter(b => b.name.includes(queryBot)).sort((a,b) => a[sortBots] < b[sortBots] ? -1 : 1) : null

  function makePrivate(){
    if(password === null){
      const newPassword = prompt(`Enter a password for the room`)
      dispatch(changeRoomPassword(newPassword))
    } else {
      dispatch(changeRoomPassword(null))
    }
  }

  const startGame = throttle(async function startGame() {
    if (room && allUsersReady) {
      const token = await firebase.auth().currentUser?.getIdToken()
      if (token) {
        const r: Room<GameState> = await client.create("game", {
          users: users,
          idToken: token,
          name: name,
          preparationId: room.id
        })
        playSound(SOUNDS.START_GAME)
        dispatch(gameStart(r.id))
        localStorage.setItem("lastRoomId", r.id)
        localStorage.setItem("lastSessionId", r.sessionId)
        await room.leave()
        r.connection.close()
        dispatch(leavePreparation())
        props.setToGame(true)
      }
    }
  }, 1000)

  return (
    <div className="preparation-menu nes-container is-centered">
      <h1>{name}: {users.length}/8</h1>
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

      {isOwner && <>
        <div className="actions">
          <label>
            <input type="checkbox" className="nes-checkbox is-dark" checked={password != null} onChange={() => makePrivate()} />
            <span>Private lobby {password && ` (Password: ${password})`}</span>
          </label>
        </div>
        <div className="actions">
          <input
            maxLength={30}
            type="text"
            className="my-input"
            placeholder={name}
            style={{flex:1}}
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
        </div>
        </>
      }

      <div className="actions">
        {isOwner ? <>
          <button
            className="bubbly blue"
            onClick={() => {
              if(botDifficulty === BotDifficulty.CUSTOM){
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
        </> : <p className="room-leader">Room leader: {ownerName} {password && <><br/>Room password: {password}</>}</p>}

        <div className="spacer" />

        <button
          className={cc('bubbly','ready-button', isReady ? 'green' : 'orange')}
          style={{ marginLeft: "4em" }}
          onClick={() => {
            dispatch(toggleReady())
          }}
        >
          Ready {isReady ? '✔' : '?'}
        </button>

        { isOwner && <button
            className={
              ownerId == uid
                ? "bubbly green"
                : "bubbly green is-disabled"
            }
            onClick={ownerId == uid ? startGame : undefined}
            data-tip
            data-for={"start-game"}
          >
            Start Game
          </button>
        }
      </div>

      {isOwner && botsListSorted != null && <dialog open className="nes-container bots-list">
        <header>
          <h2>Pick a bot</h2>
          <div className="spacer"></div>
          <input type="search" 
                 className="my-input"
                 style={{maxWidth: "20ch"}}
                 placeholder="Search by name"
                 value={queryBot}
                 onInput={e => setQueryBot((e.target as HTMLInputElement).value)}
          />
          <button onClick={() => { setSortBots("elo") }} className="bubbly pink">Sort by ELO</button>
          <button onClick={() => { setSortBots("name") }} className="bubbly blue">Sort by name</button>
          <RemoveButton onClick={() => dispatch(setBotsList(null))} title="Cancel" />
        </header>
        <ul>
          {botsListSorted.map(bot => (
            <li className="nes-container player-box preparation-menu-user" 
                onClick={() => {
                  dispatch(addBot(bot))
                  dispatch(setBotsList(null))
                }}
                key={"proposition-bot-"+bot.id}>
              <Elo elo={bot.elo} />
              <InlineAvatar
                avatar={bot.avatar}
                name={bot.name}
              />
            </li>
          ))}
        </ul>
        {botsListSorted.length === 0 && <p>No bots found !</p>}
      </dialog>}
    </div>
  )
}
