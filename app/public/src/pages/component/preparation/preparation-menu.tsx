import React, { Dispatch, SetStateAction, useState } from "react"
import ReactTooltip from "react-tooltip"
import PreparationMenuUser from "./preparation-menu-user"
import { IGameUser } from "../../../../../models/colyseus-models/game-user"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  addBot,
  changeRoomName,
  changeRoomPassword,
  gameStart,
  toggleReady
} from "../../../stores/NetworkStore"
import firebase from "firebase/compat/app"
import { Client, Room } from "colyseus.js"
import GameState from "../../../../../rooms/states/game-state"
import { BotDifficulty } from "../../../../../types/enum/Game"
import { leavePreparation } from "../../../stores/PreparationStore"
import PreparationState from "../../../../../rooms/states/preparation-state"
import "./preparation-menu.css";
import { cc } from "../../utils/jsx"
import { throttle } from "../../../../../utils/function"
import { playSound, SOUNDS } from "../../utils/audio"

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
            data-tip
            data-for={"difficulty-select"}
            className="bubbly blue"
            onClick={() => {
              dispatch(addBot(botDifficulty))
            }}
          >
            <ReactTooltip
              id={"difficulty-select"}
              className="customeTheme"
              effect="solid"
              place="top"
            >
              <p>Easy: &lt;800</p>
              <p>Normal: 800-1099</p>
              <p>Hard: 1100-1400</p>
              <p>Extreme: &gt;1400</p>
            </ReactTooltip>
            Add Bot
          </button>

          <select
            className="my-select"
            defaultValue={botDifficulty}
            onChange={(e) => {
              setBotDifficulty(parseInt(e.target.value))
            }}
          >
            <option value={BotDifficulty.EASY}>Easy</option>
            <option value={BotDifficulty.MEDIUM}>Normal</option>
            <option value={BotDifficulty.HARD}>Hard</option>
            <option value={BotDifficulty.EXTREME}>Extreme</option>
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
    </div>
  )
}
