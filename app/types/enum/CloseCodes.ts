// see https://github.com/Luka967/websocket-close-codes#websocket-close-codes
export enum CloseCodes {
  NORMAL_CLOSURE = 1000,
  NO_STATUS_RECEIVED = 1005,
  ABNORMAL_CLOSURE = 1006,
  TIMEOUT = 3008,
  USER_INACTIVE = 4001,
  USER_KICKED = 4002,
  USER_BANNED = 4003,
  USER_NOT_AUTHENTICATED = 4004,
  USER_RANK_TOO_LOW = 4005,
  USER_RANK_TOO_HIGH = 4006,
  USER_TIMEOUT = 4007,
  USER_DELETED = 4008,
  ROOM_FULL = 4010,
  ROOM_EMPTY = 4011,
  ROOM_DELETED = 4012
}

export const CloseCodesMessages: { [code in CloseCodes]?: string } = {
  [CloseCodes.USER_INACTIVE]: "USER_INACTIVE",
  [CloseCodes.USER_KICKED]: "USER_KICKED",
  [CloseCodes.USER_BANNED]: "USER_BANNED",
  [CloseCodes.USER_DELETED]: "USER_DELETED",
  [CloseCodes.USER_RANK_TOO_LOW]: "USER_RANK_TOO_LOW",
  [CloseCodes.USER_NOT_AUTHENTICATED]: "USER_NOT_AUTHENTICATED",
  [CloseCodes.USER_TIMEOUT]: "USER_TIMEOUT",
  [CloseCodes.ROOM_FULL]: "ROOM_FULL",
  [CloseCodes.ROOM_EMPTY]: "ROOM_EMPTY",
  [CloseCodes.ROOM_DELETED]: "ROOM_DELETED"
}
