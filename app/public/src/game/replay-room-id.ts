// the ReplayRoom's roomId, and the predicate live and replay code branch on. one definition so the string
// literal isn't spread across game.tsx, the recorder, and the scene components
// type-only, erased at build; keeps this leaf dependency-free at runtime
import type { ReplayRoom } from "./replay-room"

export const REPLAY_ROOM_ID = "replay"

export const isReplayRoom = (
  room?: { roomId?: string } | null
): room is ReplayRoom => room?.roomId === REPLAY_ROOM_ID
