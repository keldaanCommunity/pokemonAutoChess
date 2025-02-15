import { IPokemonEntity, Transfer } from "../types"
import { BoardEffect, Effect } from "../types/enum/Effect"
import { Orientation } from "../types/enum/Game"
import { Passive } from "../types/enum/Passive"
import { distanceC, distanceM } from "../utils/distance"
import { logger } from "../utils/logger"
import { OrientationArray, OrientationVector } from "../utils/orientation"
import { pickRandomIn } from "../utils/random"
import { PokemonEntity } from "./pokemon-entity"
import Simulation from "./simulation"

export type Cell = {
  x: number
  y: number
  value: PokemonEntity | undefined
}
export default class Board {
  rows: number
  columns: number
  cells: Array<PokemonEntity | undefined>
  effects: Array<Effect | undefined>

  constructor(rows: number, colums: number) {
    this.rows = rows
    this.columns = colums
    this.cells = new Array<PokemonEntity | undefined>(this.rows * this.columns)
    this.effects = new Array<Effect | undefined>(this.rows * this.columns)
  }

  getValue(x: number, y: number): PokemonEntity | undefined {
    if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
      return this.cells[this.columns * y + x]
    }
  }

  setValue(x: number, y: number, value: PokemonEntity | undefined) {
    if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
      const index = this.columns * y + x
      this.cells[index] = value
      if (value && !(value.positionX === x && value.positionY === y)) {
        const effectOnPreviousCell =
          this.effects[value.positionY * this.columns + value.positionX]
        if (effectOnPreviousCell != null) {
          //logger.debug(`${value.name} lost effect ${effectOnPreviousCell} by moving out of board effect`)
          value.effects.delete(effectOnPreviousCell)
        }

        if (value.passive === Passive.STENCH) {
          this.effects[value.positionY * this.columns + value.positionX] =
            Effect.POISON_GAS
        }

        value.positionX = x
        value.positionY = y

        const effectOnNewCell = this.effects[index]
        if (effectOnNewCell != null) {
          //logger.debug(`${value.name} gained effect ${effectOnNewCell} by moving into board effect`)
          value.effects.add(effectOnNewCell)
        }
      }
    }
  }

  moveValue(x0: number, y0: number, x1: number, y1: number) {
    const value = this.getValue(x0, y0)
    this.setValue(x1, y1, value)
    this.setValue(x0, y0, undefined)
  }

  swapValue(x0: number, y0: number, x1: number, y1: number) {
    const v0 = this.getValue(x0, y0)
    const v1 = this.getValue(x1, y1)
    this.setValue(x1, y1, v0)
    this.setValue(x0, y0, v1)
  }

  forEach(
    callback: (x: number, y: number, tg: PokemonEntity | undefined) => void
  ) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        callback(x, y, this.cells[this.columns * y + x])
      }
    }
  }

  find(
    predicate: (x: number, y: number, entity: PokemonEntity) => boolean
  ): PokemonEntity | null {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const cell = this.cells[this.columns * y + x]
        if (cell && predicate(x, y, cell)) {
          return cell
        }
      }
    }
    return null
  }

  orientation(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    pokemon: IPokemonEntity,
    target: IPokemonEntity | undefined
  ) {
    const dx = x1 - x0
    const dy = y1 - y0
    if (dx > 0) {
      if (dy == 0) {
        return Orientation.RIGHT
      } else if (dy < 0) {
        return Orientation.DOWNRIGHT
      } else {
        return Orientation.UPRIGHT
      }
    } else if (dx == 0) {
      if (dy == 0) {
        if (pokemon.status.confusion) {
          return pickRandomIn(Orientation)
        }
        logger.error("failed to get pokemon orientation", {
          x0,
          y0,
          x1,
          y1,
          pokemon: pokemon.name,
          pokemonPosX: pokemon.positionX,
          pokemonPosY: pokemon.positionY,
          target: target?.name,
          targetPosX: target?.positionX,
          targetPosY: target?.positionY
        })
        logger.trace("orientation error")
        return Orientation.DOWNRIGHT
      } else if (dy < 0) {
        return Orientation.DOWN
      } else {
        return Orientation.UP
      }
    } else {
      if (dy == 0) {
        return Orientation.LEFT
      } else if (dy < 0) {
        return Orientation.DOWNLEFT
      } else {
        return Orientation.UPLEFT
      }
    }
  }

  getAdjacentCells(cellX: number, cellY: number, includesCenter = false) {
    const cells = new Array<Cell>()
    for (let y = cellY - 1; y < cellY + 2; y++) {
      for (let x = cellX - 1; x < cellX + 2; x++) {
        if (x == cellX && y == cellY && !includesCenter) continue
        if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
          cells.push({ x, y, value: this.cells[this.columns * y + x] })
        }
      }
    }
    return cells
  }

  getOuterRangeCells(
    cellX: number,
    cellY: number,
    range = 1,
    includesCenter = false
  ) {
    const cells = new Array<Cell>()

    // Loop through all cells in the range
    for (let y = cellY - range; y <= cellY + range; y++) {
      for (let x = cellX - range; x <= cellX + range; x++) {
        // Skip the center if not included
        if (x == cellX && y == cellY && !includesCenter) continue
        // Ensure coordinates are within grid bounds
        if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
          cells.push({ x, y, value: this.cells[this.columns * y + x] })
        }
      }
    }

    return cells
  }

  getCellsInFront(
    pokemon: PokemonEntity,
    target: PokemonEntity,
    range: number = 1
  ) {
    const cells = new Array<Cell>()

    pokemon.orientation = this.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )

    const orientations = [
      pokemon.orientation,
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 7) % 8]
    ]

    for (let r = 1; r <= range; r++) {
      orientations.forEach((orientation) => {
        const x = pokemon.positionX + OrientationVector[orientation][0] * r
        const y = pokemon.positionY + OrientationVector[orientation][1] * r
        if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
          cells.push({ x, y, value: this.cells[this.columns * y + x] })
        }
      })
    }

    return cells
  }

  getCellsInRange(cellX: number, cellY: number, range: number) {
    const cells = new Array<Cell>()
    range = Math.floor(Math.abs(range))
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        if (x == cellX && y == cellY) continue
        const distance = distanceC(cellX, cellY, x, y)
        if (
          y >= 0 &&
          y < this.rows &&
          x >= 0 &&
          x < this.columns &&
          distance <= range
        ) {
          cells.push({ x, y, value: this.cells[this.columns * y + x] })
        }
      }
    }
    return cells
  }

  getCellsInRadius(cellX: number, cellY: number, radius: number) {
    // see https://i.imgur.com/jPzf35e.png
    const cells = new Array<Cell>()
    radius = Math.floor(Math.abs(radius)) + 0.5
    const radiusSquared = radius * radius
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        if (x == cellX && y == cellY) continue
        const dy = cellY - y
        const dx = cellX - x
        const distanceSquared = dy * dy + dx * dx
        if (
          y >= 0 &&
          y < this.rows &&
          x >= 0 &&
          x < this.columns &&
          distanceSquared < radiusSquared
        ) {
          cells.push({ x, y, value: this.cells[this.columns * y + x] })
        }
      }
    }
    return cells
  }

  getAllPokemonCoordinates(): { x: number; y: number }[] {
    const pokemonCoordinates: { x: number; y: number }[] = []

    this.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value !== undefined) {
        // Add coordinates of all Pokémon to the list
        pokemonCoordinates.push({ x, y })
      }
    })

    return pokemonCoordinates
  }

  getCellsBetween(x0: number, y0: number, x1: number, y1: number) {
    /* Supercover line algorithm from https://www.redblobgames.com/grids/line-drawing.html */
    const cells: Cell[] = [
      {
        x: x0,
        y: y0,
        value: this.cells[this.columns * y0 + x0]
      }
    ]
    const dx = x1 - x0,
      dy = y1 - y0
    const nx = Math.abs(dx),
      ny = Math.abs(dy)
    const sign_x = Math.sign(dx),
      sign_y = Math.sign(dy)

    let x = x0,
      y = y0
    for (let ix = 0, iy = 0; ix < nx || iy < ny; ) {
      const decision = (1 + 2 * ix) * ny - (1 + 2 * iy) * nx
      if (decision === 0) {
        // next step is diagonal
        x += sign_x
        y += sign_y
        ix++
        iy++
      } else if (decision < 0) {
        // next step is horizontal
        x += sign_x
        ix++
      } else {
        // next step is vertical
        y += sign_y
        iy++
      }
      cells.push({ x, y, value: this.cells[this.columns * y + x] })
    }

    return cells
  }

  getTeleportationCell(x: number, y: number) {
    const candidates = new Array<Cell>()
    ;[
      { x: 0, y: 0 },
      { x: 0, y: this.rows - 1 },
      { x: this.columns - 1, y: this.rows - 1 },
      { x: this.columns - 1, y: 0 }
    ].forEach((coord) => {
      const cells = this.getCellsBetween(x, y, coord.x, coord.y)
      cells.forEach((cell) => {
        if (cell.value === undefined) {
          candidates.push(cell)
        }
      })
    })
    if (candidates.length > 0) {
      candidates.sort(
        (a, b) => distanceC(x, y, b.x, b.y) - distanceC(x, y, a.x, a.y)
      )
      return candidates[0]
    } else {
      return undefined
    }
  }

  getFlyAwayCell(x: number, y: number): Cell | null {
    const cx = Math.round((x + this.columns * 0.5) % this.columns)
    const cy = Math.round((y + this.rows * 0.5) % this.rows)
    let radius = 1
    const candidates: Cell[] = [{ x: cx, y: cy, value: this.getValue(cx, cy) }]
    while (candidates[0].value !== undefined && radius < 5) {
      candidates.shift()
      if (candidates.length === 0) {
        candidates.push(...this.getCellsInRadius(cx, cy, radius))
        radius++
      }
    }

    return candidates[0].value === undefined ? candidates[0] : null
  }

  getEffectOnCell(x: number, y: number): Effect | undefined {
    if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
      return this.effects[this.columns * y + x]
    }
  }

  getClosestAvailablePlace(
    targetX: number,
    targetY: number
  ): { x: number; y: number; distance: number } | null {
    const candidateCells = new Array<{
      distance: number
      x: number
      y: number
    }>()

    this.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value === undefined) {
        candidateCells.push({
          x,
          y,
          distance: distanceM(x, y, targetX, targetY)
        })
      }
    })

    candidateCells.sort((a, b) => a.distance - b.distance)
    return candidateCells[0] ?? null
  }

  getFarthestTargetCoordinateAvailablePlace(
    pokemon: IPokemonEntity,
    targetAlly: boolean = false
  ):
    | { x: number; y: number; distance: number; target: PokemonEntity }
    | undefined {
    let maxTargetDistance = 0
    let maxCellDistance = 0
    let selectedCell:
      | { x: number; y: number; distance: number; target: PokemonEntity }
      | undefined

    this.forEach((x: number, y: number, entity: PokemonEntity | undefined) => {
      if (entity && entity.isTargettableBy(pokemon, !targetAlly, targetAlly)) {
        const targetDistance = distanceM(
          pokemon.positionX,
          pokemon.positionY,
          entity.positionX,
          entity.positionY
        )
        if (targetDistance > maxTargetDistance) {
          maxCellDistance = 0
          const freeCells = this.getAdjacentCells(x, y).filter(
            (cell) => this.getValue(cell.x, cell.y) === undefined
          )
          for (const cell of freeCells) {
            const cellDistance = distanceM(
              pokemon.positionX,
              pokemon.positionY,
              cell.x,
              cell.y
            )
            if (cellDistance > maxCellDistance) {
              maxCellDistance = cellDistance
              selectedCell = {
                x: cell.x,
                y: cell.y,
                distance: cellDistance,
                target: entity
              }
            }
          }
          if (selectedCell?.target === entity){
            maxTargetDistance = targetDistance
          }
        }
      }
    })
    return selectedCell
  }

  addBoardEffect(
    x: number,
    y: number,
    effect: BoardEffect,
    simulation: Simulation
  ) {
    const previousEffect = this.effects[y * this.columns + x]
    const entityOnCell = this.getValue(x, y)
    if (entityOnCell) {
      entityOnCell.effects.add(effect)
    }
    this.effects[y * this.columns + x] = effect

    if (previousEffect !== effect) {
      // show anim effect client side
      simulation.room.broadcast(Transfer.BOARD_EVENT, {
        simulationId: simulation.id,
        effect,
        x,
        y
      })
    }
  }

  clearBoardEffect(x: number, y: number, simulation: Simulation) {
    const effect = this.effects[y * this.columns + x]
    const entityOnCell = this.getValue(x, y)
    if (effect && entityOnCell) {
      entityOnCell.effects.delete(effect)
    }
    if (effect) {
      // clean effect anim client side
      simulation.room.broadcast(Transfer.BOARD_EVENT, {
        simulationId: simulation.id,
        effect: null,
        x,
        y
      })
    }
    this.effects[y * this.columns + x] = undefined
  }
}
