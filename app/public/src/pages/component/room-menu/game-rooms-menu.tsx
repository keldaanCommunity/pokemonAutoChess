import { Client, Room, RoomAvailable } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import GameState from "../../../../../rooms/states/game-state"
import {
  ICustomLobbyState,
  IGameMetadata,
  Role,
  Transfer
} from "../../../../../types"
import { GameMode } from "../../../../../types/enum/Game"
import { throttle } from "../../../../../utils/function"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { resetLobby } from "../../../stores/LobbyStore"
import { LocalStoreKeys, localStore } from "../../utils/store"
import GameRoomItem from "./game-room-item"

export function IngameRoomsList({ gameMode }: { gameMode?: GameMode }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const gameRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.gameRooms
  ).filter((r) => !gameMode || r.metadata.gameMode === gameMode)
  const navigate = useNavigate()
  const client: Client = useAppSelector((state) => state.network.client)
  const [isJoining, setJoining] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<"stage" | "elo" | "name">("stage")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const lobby: Room<ICustomLobbyState> | undefined = useAppSelector(
    (state) => state.network.lobby
  )
  const user = useAppSelector((state) => state.network.profile)

  // Function to extract elo from playersInfo strings like "PlayerName [1450]"
  const extractEloFromPlayerInfo = (playerInfo: string): number => {
    const match = playerInfo.match(/\[(\d+)\]$/)
    return match ? parseInt(match[1], 10) : 0
  }

  // Function to calculate average elo for a room
  const calculateAverageElo = (room: RoomAvailable<IGameMetadata>): number => {
    const playersInfo = room.metadata?.playersInfo || []
    if (playersInfo.length === 0) return 0

    const eloValues = playersInfo.map(extractEloFromPlayerInfo)
    const totalElo = eloValues.reduce((sum, elo) => sum + elo, 0)
    return totalElo / eloValues.length
  }

  // Function to sort rooms
  const sortRooms = (
    rooms: RoomAvailable<IGameMetadata>[]
  ): RoomAvailable<IGameMetadata>[] => {
    return [...rooms].sort((a, b) => {
      if (sortBy === "stage") {
        const stageA = a.metadata?.stageLevel || 0
        const stageB = b.metadata?.stageLevel || 0
        return stageB - stageA // Sort by stage descending
      } else if (sortBy === "elo") {
        const eloA = calculateAverageElo(a)
        const eloB = calculateAverageElo(b)
        return eloB - eloA // Sort by average elo descending
      } else {
        const nameA = a.metadata?.name?.toLowerCase() || ""
        const nameB = b.metadata?.name?.toLowerCase() || ""
        return nameA.localeCompare(nameB) // Sort by name ascending
      }
    })
  }

  // Function to filter rooms by player search
  const filterRooms = (
    rooms: RoomAvailable<IGameMetadata>[]
  ): RoomAvailable<IGameMetadata>[] => {
    if (!searchQuery.trim()) return rooms

    const searchTerm = searchQuery.toLowerCase().trim()
    return rooms.filter((room) => {
      const playersInfo = room.metadata?.playersInfo || []

      // Search in players info
      return playersInfo.some((playerInfo) =>
        playerInfo.toLowerCase().includes(searchTerm)
      )
    })
  }

  // Apply filtering and sorting to game rooms
  const filteredGameRooms = sortRooms(filterRooms(gameRooms))

  const joinGame = throttle(async function joinGame(
    selectedRoom: RoomAvailable<IGameMetadata>
  ) {
    const token = await firebase.auth().currentUser?.getIdToken()
    if (lobby && !isJoining && token) {
      setJoining(true)
      const game: Room<GameState> = await client.joinById(selectedRoom.roomId, {
        idToken: token
      })
      localStore.set(
        LocalStoreKeys.RECONNECTION_GAME,
        { reconnectionToken: game.reconnectionToken, roomId: game.roomId },
        30
      )
      await Promise.allSettled([
        lobby.connection.isOpen && lobby.leave(false),
        game.connection.isOpen && game.leave(false)
      ])
      dispatch(resetLobby())
      navigate("/game")
    }
  }, 1000)

  const onRoomAction = (room: RoomAvailable<IGameMetadata>, action: string) => {
    if (action === "join" || action === "spectate") {
      joinGame(room)
    } else if (action === "delete" && user?.role === Role.ADMIN) {
      confirm("Delete room ?") && lobby?.send(Transfer.DELETE_ROOM, room.roomId)
    }
  }

  return (
    <div>
      <div
        className="controls"
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "10px"
        }}
      >
        <p>{t("games_in_progress", { count: filteredGameRooms.length })}</p>
        <div className="spacer"></div>
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "stage" | "elo")}
          style={{ padding: "4px 8px" }}
        >
          <option value="stage">{t("stage")}</option>
          <option value="elo">{t("average_elo")}</option>
          <option value="name">{t("name")}</option>
        </select>
        <label htmlFor="search-player">{t("search")}:</label>
        <input
          id="search-player"
          type="text"
          placeholder={t("search_player")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "4px 8px", minWidth: "150px", maxWidth: "300px" }}
        />
      </div>
      <ul className="hidden-scrollable room-list">
        {filteredGameRooms.map((r) => (
          <li key={r.roomId}>
            <GameRoomItem
              room={r}
              click={(action) => onRoomAction(r, action)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
