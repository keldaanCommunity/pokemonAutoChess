import { type Presence } from "@colyseus/core"
import { ALLOWED_GAME_RECONNECTION_TIME } from "../config"
import { isValidDate } from "../utils/date"
import { logger } from "../utils/logger"

interface PendingGame {
  gameId: string
  reconnectionDeadline: Date
  isExpired: boolean
}

const PENDING_GAME = "pending_game"
const USER_TIMEOUT = "user_timeout"
const TIMEOUT_IN_SECONDS = 60 * 5 // 5 minutes

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
    const [pendingGameId, reconnectionDeadlineStr] = pendingGame.split(",")
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
      isExpired:
        !isValidDate(reconnectionDeadline) ||
        reconnectionDeadline.getTime() > Date.now()
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
    [
      gameId,
      new Date(Date.now() + 1000 * ALLOWED_GAME_RECONNECTION_TIME).toISOString()
    ].join(",")
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
  if (pendingGame && pendingGame.split(",")[0] === roomId) {
    // clear pending game if it was set for this room
    clearPendingGame(presence, playerId)
  }
}
