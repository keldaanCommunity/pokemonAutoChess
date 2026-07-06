// the ReplayRoom's roomId, and the predicate live and replay code branch on. one definition so the string
// literal isn't spread across game.tsx, the recorder, and the scene components
export const REPLAY_ROOM_ID = "replay"

export const isReplayRoom = (room?: { roomId?: string } | null): boolean =>
  room?.roomId === REPLAY_ROOM_ID
