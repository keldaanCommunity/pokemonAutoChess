import { type Presence } from "@colyseus/core"
import { ALLOWED_GAME_RECONNECTION_TIME } from "../config"
import { isValidDate } from "../utils/date"

interface PendingGame {
  gameId: string
  reconnectionDeadline: Date
  isExpired: boolean
}

interface PendingGameStoredData {
  gameId: string
  reconnectionDeadline: string
}

const PENDING_GAME = "pending_game"
const USER_TIMEOUT = "user_timeout"
const SECONDS_PER_MINUTE = 60
const TIMEOUT_IN_MINUTES = 5
const TIMEOUT_IN_SECONDS = SECONDS_PER_MINUTE * TIMEOUT_IN_MINUTES

function parsePendingGameData(
  pendingGame: string
): PendingGameStoredData | null {
  try {
    const parsed: unknown = JSON.parse(pendingGame)
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "gameId" in parsed &&
      "reconnectionDeadline" in parsed &&
      typeof parsed.gameId === "string" &&
      typeof parsed.reconnectionDeadline === "string"
    ) {
      return {
        gameId: parsed.gameId,
        reconnectionDeadline: parsed.reconnectionDeadline
      }
    }
  } catch {
    // Fallback to legacy comma-separated format
  }

  const [gameId, reconnectionDeadline] = pendingGame.split(",")
  if (!gameId || !reconnectionDeadline) {
    return null
  }

  return { gameId, reconnectionDeadline }
}

export async function isPlayerTimeout(
  presence: Presence,
  playerId: string
): Promise<boolean> {
  const timeoutDateStr = await presence.hget(playerId, USER_TIMEOUT)
  if (timeoutDateStr) {
    const timeout = new Date(timeoutDateStr).getTime()
    //logger.debug(`Checking timeout for player ${playerId}: ${timeoutDateStr}`);
    return isValidDate(timeout) && Date.now() < timeout
  }
  return false
}

export async function givePlayerTimeout(
  presence: Presence,
  playerId: string
): Promise<boolean> {
  //logger.debug(`Setting timeout for player ${playerId}: ${new Date(Date.now() + 1000 * TIMEOUT_IN_SECONDS).toISOString()}`);
  return presence.hset(
    playerId,
    USER_TIMEOUT,
    new Date(Date.now() + 1000 * TIMEOUT_IN_SECONDS).toISOString()
  )
}

export async function getPendingGame(
  presence: Presence,
  playerId: string
): Promise<PendingGame | null> {
  const pendingGame = await presence.hget(playerId, PENDING_GAME)
  if (pendingGame) {
    const parsedPendingGame = parsePendingGameData(pendingGame)
    if (!parsedPendingGame) {
      return null
    }

    const {
      gameId: pendingGameId,
      reconnectionDeadline: reconnectionDeadlineStr
    } = parsedPendingGame
    const reconnectionDeadline = new Date(reconnectionDeadlineStr)
    // check if date is valid
    if (!isValidDate(reconnectionDeadline)) {
      //logger.error("Invalid reconnection deadline date", pendingGameId, reconnectionDeadlineStr);
      return null
    }

    //logger.debug(`Pending game found for player ${playerId}: ${pendingGameId}, deadline: ${reconnectionDeadline.toISOString()}`);
    return {
      gameId: pendingGameId,
      reconnectionDeadline,
      isExpired: reconnectionDeadline.getTime() < Date.now()
    }
  }
  //logger.debug(`No pending game found for player ${playerId}`);
  return null
}

export async function setPendingGame(
  presence: Presence,
  playerId: string,
  gameId: string
): Promise<boolean> {
  //logger.debug(`Setting pending game for player ${playerId}: ${gameId}, deadline: ${new Date(Date.now() + 1000 * ALLOWED_GAME_RECONNECTION_TIME).toISOString()}`);
  return presence.hset(
    playerId,
    PENDING_GAME,
    JSON.stringify({
      gameId,
      reconnectionDeadline: new Date(
        Date.now() + 1000 * ALLOWED_GAME_RECONNECTION_TIME
      ).toISOString()
    })
  )
}

export async function clearPendingGame(
  presence: Presence,
  playerId: string
): Promise<boolean> {
  //logger.debug(`Clearing pending game for player ${playerId}`);
  return presence.hdel(playerId, PENDING_GAME)
}

export async function clearPendingGamesOnRoomDispose(
  presence: Presence,
  playerId: string,
  roomId: string
): Promise<void> {
  const pendingGame = await presence.hget(playerId, PENDING_GAME)
  if (pendingGame) {
    const parsedPendingGame = parsePendingGameData(pendingGame)
    if (parsedPendingGame?.gameId === roomId) {
      // clear pending game if it was set for this room
      await clearPendingGame(presence, playerId)
    }
  }
}
