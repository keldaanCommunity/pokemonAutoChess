export const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

export function transformCoordinate(x: number, y: number) {
  if (y === 0) {
    return [28 * 24 + 96 * x, 808]
  } else {
    return [28 * 24 + 96 * x, 760 - 96 * y]
  }
}

export function transformAttackCoordinate(x: number, y: number, flip: boolean) {
  return [28 * 24 + 96 * x, flip ? 184 + 96 * y : 664 - 96 * y]
}

export function transformMiniGameXCoordinate(x: number) {
  return 28 * 24 + x
}

export function transformMiniGameYCoordinate(y: number) {
  return 664 - y
}
