import { Client, Room } from "@colyseus/sdk"
import { User } from "@firebase/auth-types"
import firebase from "firebase/compat/app"
import type { server } from "../../app.config.ts"
import { FIREBASE_CONFIG } from "../../config"
import { IBot } from "../../models/mongo-models/bot-v2.js"
import AfterGameState from "../../rooms/states/after-game-state"
import GameState from "../../rooms/states/game-state"
import LobbyState from "../../rooms/states/lobby-state"
import PreparationState from "../../rooms/states/preparation-state"
import { Emotion, Item, Role, Title, Transfer } from "../../types"
import { CloseCodes } from "../../types/enum/CloseCodes"
import { EloRank } from "../../types/enum/EloRank.js"
import { BotDifficulty } from "../../types/enum/Game.js"
import { PkmProposition } from "../../types/enum/Pokemon.js"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule.js"
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

export function searchName(name: string) {
  rooms.lobby?.send(Transfer.SEARCH, { name })
}

export function addBot(bot: BotDifficulty | IBot) {
  rooms.preparation?.send(Transfer.ADD_BOT, bot)
}

export function removeBot(id: string) {
  rooms.preparation?.send(Transfer.REMOVE_BOT, id)
}

export function toggleReady(ready: boolean) {
  rooms.preparation?.send(Transfer.TOGGLE_READY, ready)
}

export function setNoElo(noElo: boolean) {
  rooms.preparation?.send(Transfer.CHANGE_NO_ELO, noElo)
}

export function lockShop() {
  rooms.game?.send(Transfer.LOCK)
}

export function levelClick() {
  rooms.game?.send(Transfer.LEVEL_UP)
}

export function buyInShop(id: number) {
  rooms.game?.send(Transfer.SHOP, { id })
}

export function pickPokemonProposition(proposition: PkmProposition) {
  rooms.game?.send(Transfer.POKEMON_PROPOSITION, proposition)
}

export function pickItem(item: Item) {
  rooms.game?.send(Transfer.ITEM, item)
}

export function gameStartRequest(token: string) {
  rooms.preparation?.send(Transfer.GAME_START_REQUEST, { token })
}

export function changeRoomName(name: string) {
  rooms.preparation?.send(Transfer.CHANGE_ROOM_NAME, name)
}

export function changeRoomPassword(password: string | null) {
  rooms.preparation?.send(Transfer.CHANGE_ROOM_PASSWORD, password)
}

export function changeRoomMinMaxRanks(params: {
  minRank: EloRank | null
  maxRank: EloRank | null
}) {
  rooms.preparation?.send(Transfer.CHANGE_ROOM_RANKS, params)
}

export function setSpecialRule(rule: SpecialGameRule | null) {
  rooms.preparation?.send(Transfer.CHANGE_SPECIAL_RULE, rule)
}

export function buyEmotion(params: {
  index: string
  emotion: Emotion
  shiny: boolean
}) {
  rooms.lobby?.send(Transfer.BUY_EMOTION, params)
}

export function buyBooster(params: { index: string }) {
  rooms.lobby?.send(Transfer.BUY_BOOSTER, params)
}

export function openBooster() {
  rooms.lobby?.send(Transfer.OPEN_BOOSTER)
}

export function showEmote(emote?: string) {
  rooms.game?.send(Transfer.SHOW_EMOTE, emote)
}

export function searchById(id: string) {
  rooms.lobby?.send(Transfer.SEARCH_BY_ID, id)
}

export function deleteTournament(params: { id: string }) {
  rooms.lobby?.send(Transfer.DELETE_TOURNAMENT, params)
}

export function remakeTournamentLobby(params: {
  tournamentId: string
  bracketId: string
}) {
  rooms.lobby?.send(Transfer.REMAKE_TOURNAMENT_LOBBY, params)
}

export function participateInTournament(params: {
  tournamentId: string
  participate: boolean
}) {
  rooms.lobby?.send(Transfer.PARTICIPATE_TOURNAMENT, params)
}

export function giveBooster(params: { uid: string; numberOfBoosters: number }) {
  rooms.lobby?.send(Transfer.GIVE_BOOSTER, params)
}

export function heapSnapshot() {
  rooms.lobby?.send(Transfer.HEAP_SNAPSHOT)
}

export function deleteAccount() {
  rooms.lobby?.send(Transfer.DELETE_ACCOUNT)
}

export function giveRole(params: { uid: string; role: Role }) {
  rooms.lobby?.send(Transfer.SET_ROLE, params)
}

export function giveTitle(params: { uid: string; title: Title }) {
  rooms.lobby?.send(Transfer.GIVE_TITLE, params)
}

export function kick(playerId: string) {
  rooms.preparation?.send(Transfer.KICK, playerId)
}

export function ban(params: { uid: string; reason: string }) {
  rooms.lobby?.send(Transfer.BAN, params)
}

export function unban(params: { uid: string; name: string }) {
  rooms.lobby?.send(Transfer.UNBAN, params)
}

export function createTournament(params: { name: string; startDate: string }) {
  rooms.lobby?.send(Transfer.NEW_TOURNAMENT, params)
}
