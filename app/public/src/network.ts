import { Client, Room } from "@colyseus/sdk"
import { User } from "@firebase/auth-types"
import firebase from "firebase/compat/app"
import type { server } from "../../app.config.ts"
import { FIREBASE_CONFIG } from "../../config"
import AfterGameState from "../../rooms/states/after-game-state"
import GameState from "../../rooms/states/game-state"
import LobbyState from "../../rooms/states/lobby-state"
import PreparationState from "../../rooms/states/preparation-state"
import { Transfer } from "../../types"
import { CloseCodes } from "../../types/enum/CloseCodes"
import { IUserMetadataJSON } from "../../types/interfaces/UserMetadata"
import { logger } from "../../utils/logger"
import store from "./stores"
import { logIn, setProfile } from "./stores/NetworkStore"

const endpoint = `${window.location.protocol.replace("http", "ws")}//${
  window.location.host
}`
logger.info(`Colyseus endpoint: ${endpoint}`)

export const client = new Client<typeof server>(endpoint)

export function authenticateUser() {
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG)
  }

  return new Promise<User>((resolve, reject) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) return reject(CloseCodes.USER_NOT_AUTHENTICATED)
      store.dispatch(logIn(user))
      fetchProfile()
      resolve(user)
    })
  })
}

export async function fetchProfile(forceRefresh: boolean = false) {
  const profile = store.getState().network.profile
  const token = await firebase.auth().currentUser?.getIdToken()
  if (!forceRefresh && profile) {
    return Promise.resolve(profile)
  }
  return fetch(`/profile?t=${Date.now()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => res.json())
    .then((profile: IUserMetadataJSON) => {
      store.dispatch(setProfile(profile))
    })
}

export const rooms: {
  lobby: Room<{ state: LobbyState }> | undefined
  preparation: Room<PreparationState> | undefined
  game: Room<GameState> | undefined
  after: Room<AfterGameState> | undefined
} = {
  lobby: undefined,
  preparation: undefined,
  game: undefined,
  after: undefined
}

export async function leaveRoom(
  roomName: keyof typeof rooms,
  allowReconnect = false
): Promise<number> {
  const room = rooms[roomName]
  if (room) {
    rooms[roomName] = undefined
    if (room.connection.isOpen) {
      return await room.leave(!allowReconnect)
    }
  }
  return Promise.resolve(-1)
}

export async function leaveAllRooms() {
  return await Promise.allSettled([
    leaveRoom("lobby"),
    leaveRoom("preparation"),
    leaveRoom("game"),
    leaveRoom("after")
  ])
}

export function joinLobby(room: Room<{ state: LobbyState }>) {
  leaveAllRooms()
  rooms.lobby = room
}

export function joinPreparation(room: Room<PreparationState>) {
  leaveAllRooms()
  rooms.preparation = room
}

export function joinGame(room: Room<GameState>) {
  leaveAllRooms()
  rooms.game = room
}

export function joinAfter(room: Room<AfterGameState>) {
  leaveRoom("lobby")
  leaveRoom("preparation")
  leaveRoom("game", true)
  leaveRoom("after")
  rooms.after = room
}

export type ChatRoom = "lobby" | "preparation"

export function sendMessage(message: string, source: ChatRoom) {
  if (source === "lobby" && rooms.lobby) {
    rooms.lobby.send(Transfer.NEW_MESSAGE, message)
  } else if (source === "preparation" && rooms.preparation) {
    rooms.preparation.send(Transfer.NEW_MESSAGE, message)
  }
}

export function removeMessage(message: { id: string }, source: ChatRoom) {
  if (source === "lobby" && rooms.lobby) {
    rooms.lobby.send(Transfer.REMOVE_MESSAGE, message)
  } else if (source === "preparation" && rooms.preparation) {
    rooms.preparation.send(Transfer.REMOVE_MESSAGE, message)
  }
}
