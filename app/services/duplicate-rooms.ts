import { matchMaker } from "colyseus"
import type GameRoom from "../rooms/game-room"
import type PreparationRoom from "../rooms/preparation-room"
import { logger } from "../utils/logger"

const ROOM_CREATION = "room_creation"
const ROOM_CREATION_TTL = 6 * 60 * 60 // a stall longer than this goes unchecked
const DUPLICATE_CHECK_INTERVAL = 3000 // under CheckAutoStartRoom's 5 s
const DUPLICATE_CHECK_TIMEOUT = 3 * 60 * 1000

export async function createRoomWithDuplicateCheck(
  roomName: string,
  options: object
) {
  const creationId = crypto.randomUUID()
  const room = await matchMaker.createRoom(roomName, { ...options, creationId })
  await matchMaker.presence.setex(
    `${ROOM_CREATION}:${creationId}`,
    room.roomId,
    ROOM_CREATION_TTL
  )
  return room
}

export function checkDuplicateRoom(room: GameRoom | PreparationRoom) {
  const { creationId } = room
  if (!creationId) return
  const startedAt = Date.now()
  const check = room.clock.setInterval(async () => {
    if (Date.now() - startedAt > DUPLICATE_CHECK_TIMEOUT) {
      check.clear() // this last tick still reads
    }
    try {
      const createdId = await room.presence.get(
        `${ROOM_CREATION}:${creationId}`
      )
      if (!createdId) return // the creator may record the room after this copy exists
      check.clear()
      if (createdId !== room.roomId) {
        logger.warn("Disposing duplicate room", room.roomId, "of", createdId)
        room.onRoomDeleted(room.roomId)
      }
    } catch (error) {
      logger.error(error)
    }
  }, DUPLICATE_CHECK_INTERVAL)
}
