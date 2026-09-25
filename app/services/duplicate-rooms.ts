import { matchMaker } from "colyseus"
import type GameRoom from "../rooms/game-room"
import type PreparationRoom from "../rooms/preparation-room"
import { logger } from "../utils/logger"

const ROOM_CREATION = "room_creation"
const ROOM_CREATION_TTL = 6 * 60 * 60 // outlives the windows set in app.config.ts

export async function createRoomWithDuplicateCheck(
  roomName: string,
  options: object
) {
  const creationId = crypto.randomUUID()
  const room = await matchMaker.createRoom(roomName, { ...options, creationId })
  // resolves with the error on redis, returns nothing locally
  const error = await matchMaker.presence.setex(
    `${ROOM_CREATION}:${creationId}`,
    room.roomId,
    ROOM_CREATION_TTL
  )
  if (error) logger.error(error)
  return room
}

export function checkDuplicateRoom(
  room: GameRoom | PreparationRoom,
  { interval, timeout }: { interval: number; timeout: number }
) {
  const { creationId } = room
  if (!creationId) return
  const startedAt = Date.now()
  let reading = false
  const check = room.clock.setInterval(async () => {
    if (reading) return // one read at a time, however slow presence is
    reading = true
    try {
      const createdId = await room.presence.get(
        `${ROOM_CREATION}:${creationId}`
      )
      // we check again on a regular interval until the process creating the room records the room creation in Redis, that is when createdId is defined
      if (createdId) {
        check.clear() // we know which process created the room, no need to check again for duplicates for this proces
        if (createdId !== room.roomId) {
          logger.warn("Disposing duplicate room", room.roomId, "of", createdId)
          room.onRoomDeleted(room.roomId)
        }
        return
      }
    } catch (error) {
      logger.error(error)
    } finally {
      reading = false
    }
    // after a read, so a process that was stalled past the window still looks
    if (Date.now() - startedAt > timeout) {
      check.clear()
      logger.warn("Gave up checking room", room.roomId, "for duplicates")
    }
  }, interval)
}
