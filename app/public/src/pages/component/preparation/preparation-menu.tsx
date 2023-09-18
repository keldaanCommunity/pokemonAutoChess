import React, { useRef, useState } from "react"
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
import PreparationState from "../../../../../rooms/states/preparation-state"
import "./preparation-menu.css"
import { cc } from "../../utils/jsx"
import { throttle } from "../../../../../utils/function"
import { Role } from "../../../../../types"
import { useTranslation } from "react-i18next"
import { Checkbox } from "../checkbox/checkbox"
import { GADGETS } from "../../../../../core/gadgets"
import { BotSelectModal } from "./bot-select-modal"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { MapSelectModal } from "./map-select-modal"

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
  const selectedMap: string = useAppSelector(
    (state) => state.preparation.selectedMap
  )

  const [modal, setModal] = useState<string>()

  const profile = useAppSelector((state) => state.network.profile)
  const profileLevel = profile?.level ?? 0

  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>(
    BotDifficulty.MEDIUM
  )

  const isReady = users.find((user) => user.id === uid)?.ready
  const allUsersReady = users.every((user) => user.ready)

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
    <div className="preparation-menu nes-container is-centered custom-bg">
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
          <p>{t("add_bot_or_wait_hint")}</p>
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
        <div className="actions">
          <Checkbox
            checked={password != null}
            onToggle={makePrivate}
            label={`${t("private_lobby")} ${
              password ? "Password: " + password : ""
            }`}
            isDark
            title="Add a password to this room"
          />
          <Checkbox
            checked={noElo}
            onToggle={toggleElo}
            label={t("just_for_fun")}
            isDark
            title="No ELO gain or loss for this game"
          />
          <div className="spacer"></div>
          <div className="gadgets">
            {profileLevel >= GADGETS.MAP.levelRequired && (
              <div
                onClick={() => {
                  setModal("maps")
                }}
              >
                <span>{t("map." + selectedMap)}</span>
                <img width={48} height={48} src="assets/ui/map.svg" />
              </div>
            )}
          </div>
        </div>
      )}
      {(isOwner ||
        (user?.role && [Role.ADMIN, Role.MODERATOR].includes(user.role))) && (
        <div className="actions">
          {user && !user.anonymous && (
            <>
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
              {deleteRoomButton}
            </>
          )}
        </div>
      )}

      <div className="actions">
        {isOwner ? (
          <>
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
            data-tooltip-id={"start-game"}
          >
            {t("start_game")}
          </button>
        )}
      </div>

      {isOwner && botsList != null && <BotSelectModal bots={botsList} />}
      {isOwner && (
        <MapSelectModal
          show={modal === "maps"}
          handleClose={() => {
            setModal(undefined)
          }}
        />
      )}
    </div>
  )
}
