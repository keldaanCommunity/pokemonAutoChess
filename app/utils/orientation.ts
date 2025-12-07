import { Board, Cell } from "../core/board"
import { PokemonEntity } from "../core/pokemon-entity"
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

export function effectInLine(
  board: Board,
  pokemon: PokemonEntity,
  target: PokemonEntity | Orientation,
  effect: (cell: Cell) => void
) {
  const orientation: Orientation =
    target instanceof PokemonEntity
      ? board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          target.positionX,
          target.positionY,
          pokemon,
          target
        )
      : target
  // compute a line that includedes the source and target
  if (target instanceof PokemonEntity) {
    effectSourceThroughTarget(board, pokemon, target, effect)
    return
  }

  const targetsHit = new Set()

  const applyEffect = (x: number, y: number) => {
    const value = board.getEntityOnCell(x, y)
    if (value != null) {
      targetsHit.add(value)
    }
    effect({ x, y, value })
  }

  switch (orientation) {
    case Orientation.UP:
      for (let y = pokemon.positionY + 1; y < board.rows; y++) {
        applyEffect(pokemon.positionX, y)
      }
      break

    case Orientation.UPRIGHT:
      for (
        let x = pokemon.positionX + 1, y = pokemon.positionY + 1;
        x < board.columns && y < board.rows;
        x++, y++
      ) {
        applyEffect(x, y)
      }
      break

    case Orientation.RIGHT:
      for (let x = pokemon.positionX + 1; x < board.rows; x++) {
        applyEffect(x, pokemon.positionY)
      }
      break

    case Orientation.DOWNRIGHT:
      for (
        let x = pokemon.positionX + 1, y = pokemon.positionY - 1;
        x < board.columns && y >= 0;
        x++, y--
      ) {
        applyEffect(x, y)
      }
      break

    case Orientation.DOWN:
      for (let y = pokemon.positionY - 1; y >= 0; y--) {
        applyEffect(pokemon.positionX, y)
      }
      break

    case Orientation.DOWNLEFT:
      for (
        let x = pokemon.positionX - 1, y = pokemon.positionY - 1;
        x >= 0 && y >= 0;
        x--, y--
      ) {
        applyEffect(x, y)
      }
      break

    case Orientation.LEFT:
      for (let x = pokemon.positionX - 1; x >= 0; x--) {
        applyEffect(x, pokemon.positionY)
      }
      break

    case Orientation.UPLEFT:
      for (
        let x = pokemon.positionX - 1, y = pokemon.positionY + 1;
        x >= 0 && y < board.rows;
        x--, y++
      ) {
        applyEffect(x, y)
      }
      break
  }

  const isEntity = (obj: PokemonEntity | Orientation): obj is PokemonEntity =>
    obj.hasOwnProperty("positionX")
  if (isEntity(target) && targetsHit.size === 0) {
    // should at least touch the original target
    // this can happen when target has an angle in between 45 degrees modulo, see https://discord.com/channels/737230355039387749/1098262507505848523
    effect({ x: target.positionX, y: target.positionY, value: target })
  }
}

function effectSourceThroughTarget(
  board: Board,
  source: PokemonEntity,
  target: PokemonEntity,
  effect: (cell: Cell) => void
) {
  const sourceX = source.positionX
  const sourceY = source.positionY
  const targetX = target.positionX
  const targetY = target.positionY

  // Calculate direction vector
  const deltaX = targetX - sourceX
  const deltaY = targetY - sourceY

  // If source and target are at the same position, do nothing
  if (deltaX === 0 && deltaY === 0) return

  // calculate the direction and normalize
  const maxDistance = Math.max(board.columns, board.rows) * 2
  const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  const directionX = deltaX / lineLength
  const directionY = deltaY / lineLength

  // step to guarantee endpoint is way past board edge
  const extendedX = Math.round(sourceX + directionX * maxDistance)
  const extendedY = Math.round(sourceY + directionY * maxDistance)

  // Use board's existing getCellsBetween method (Supercover algorithm) from e.g. Snipe Shot Ability
  const cells = board.getCellsBetween(sourceX, sourceY, extendedX, extendedY)

  // Apply effect to all cells except the source, and only cells within board bounds
  for (const cell of cells) {
    // Skip the source cell itself
    if (cell.x === sourceX && cell.y === sourceY) continue

    // Skip cells outside board bounds
    if (cell.x < 0 || cell.x >= board.columns || cell.y < 0 || cell.y >= board.rows) continue

    effect(cell)
  }
}

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
