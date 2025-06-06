import { BOARD_X_START, BOARD_Y_START, CELL_HEIGHT, CELL_WIDTH } from "../../../../types/Config"

export const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

export function transformBoardCoordinates(x: number, y: number) {
  if (y === 0) {
    return [
      BOARD_X_START + CELL_WIDTH * x,
      BOARD_Y_START
    ]
  } else {
    return [
      BOARD_X_START + CELL_WIDTH * x,
      BOARD_Y_START - CELL_HEIGHT * (y + 1) + CELL_HEIGHT / 2
    ]
  }
}

export function transformEntityCoordinates(
  x: number,
  y: number,
  flip: boolean
) {
  return [
    BOARD_X_START + CELL_WIDTH * x,
    CELL_HEIGHT / 2 + (flip ?
      BOARD_Y_START + CELL_HEIGHT * (y - 7) :
      BOARD_Y_START - CELL_HEIGHT * (y + 2)
    )
  ]
}

export function transformMiniGameXCoordinate(x: number) {
  return BOARD_X_START + x
}

export function transformMiniGameYCoordinate(y: number) {
  return BOARD_Y_START - y - CELL_HEIGHT * 1.5
}
