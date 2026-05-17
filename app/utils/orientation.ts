import { Orientation } from "../types/enum/Game"

export const OrientationVector: Record<Orientation, [number, number]> = {
  [Orientation.UP]: [0, 1],
  [Orientation.UPRIGHT]: [1, 1],
  [Orientation.RIGHT]: [1, 0],
  [Orientation.DOWNRIGHT]: [1, -1],
  [Orientation.DOWN]: [0, -1],
  [Orientation.DOWNLEFT]: [-1, -1],
  [Orientation.LEFT]: [-1, 0],
  [Orientation.UPLEFT]: [-1, 1]
}

export const OrientationAngle: Record<Orientation, number> = {
  [Orientation.UP]: Math.PI / 2,
  [Orientation.UPRIGHT]: Math.PI / 4,
  [Orientation.RIGHT]: 0,
  [Orientation.DOWNRIGHT]: -Math.PI / 4,
  [Orientation.DOWN]: -Math.PI / 2,
  [Orientation.DOWNLEFT]: (-3 * Math.PI) / 4,
  [Orientation.LEFT]: Math.PI,
  [Orientation.UPLEFT]: (3 * Math.PI) / 4
}

export const OrientationArray: Orientation[] = [
  Orientation.DOWN,
  Orientation.DOWNRIGHT,
  Orientation.RIGHT,
  Orientation.UPRIGHT,
  Orientation.UP,
  Orientation.UPLEFT,
  Orientation.LEFT,
  Orientation.DOWNLEFT
]

export function getOrientation(x1: number, y1: number, x2: number, y2: number) {
  let angle = Math.atan2(y2 - y1, x2 - x1)
  if (angle < 0) {
    angle += 2 * Math.PI
  }
  const quarterPi = Math.PI / 4
  // logger.debug(angle);
  if (angle < quarterPi) {
    return Orientation.RIGHT
  } else if (angle < 2 * quarterPi) {
    return Orientation.DOWNRIGHT
  } else if (angle < 3 * quarterPi) {
    return Orientation.DOWN
  } else if (angle < 4 * quarterPi) {
    return Orientation.DOWNLEFT
  } else if (angle < 5 * quarterPi) {
    return Orientation.LEFT
  } else if (angle < 6 * quarterPi) {
    return Orientation.UPLEFT
  } else if (angle < 7 * quarterPi) {
    return Orientation.UP
  } else if (angle < 8 * quarterPi) {
    return Orientation.UPRIGHT
  } else {
    return Orientation.RIGHT
  }
}
