import { IPokemonEntity } from "../types"
import { Orientation } from "../types/enum/Game"
import { logger } from "../utils/logger"
import { pickRandomIn } from "../utils/random"
import PokemonEntity from "./pokemon-entity"

export type Cell = {
  x: number
  y: number
  value: PokemonEntity | undefined
}
export default class Board {
  rows: number
  columns: number
  cells: Array<PokemonEntity | undefined>

  constructor(rows: number, colums: number) {
    this.rows = rows
    this.columns = colums
    this.cells = new Array<PokemonEntity | undefined>(this.rows * this.columns)
  }

  getValue(x: number, y: number): PokemonEntity | undefined {
    if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
      return this.cells[this.columns * y + x]
    }
  }

  setValue(x: number, y: number, value: PokemonEntity | undefined) {
    if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
      this.cells[this.columns * y + x] = value
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

  distance(x0: number, y0: number, x1: number, y1: number) {
    // chebyshev distance
    return Math.max(Math.abs(y0 - y1), Math.abs(x0 - x1))
  }

  distanceC(x0: number, y0: number, x1: number, y1: number) {
    // Manhattan distance
    return Math.abs(x1 - x0) + Math.abs(y1 - y0)
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
        if(pokemon.status.confusion){
          return pickRandomIn(Orientation)
        }
        logger.error("failed to get pokemon orientation", {
          x0, y0, x1, y1, 
          pokemon: pokemon.name,
          pokemonPosX: pokemon.positionX,
          pokemonPosY: pokemon.positionY,
          target: target?.name,
          targetPosX: target?.positionX,
          targetPosY: target?.positionY
        })
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

  getAdjacentCells(cellX: number, cellY: number) {
    const cells = new Array<Cell>()
    for (let y = cellY - 1; y < cellY + 2; y++) {
      for (let x = cellX - 1; x < cellX + 2; x++) {
        if (x == cellX && y == cellY) continue
        if (y >= 0 && y < this.rows && x >= 0 && x < this.columns) {
          cells.push({ x, y, value: this.cells[this.columns * y + x] })
        }
      }
    }
    return cells
  }

  getCellsInRange(cellX: number, cellY: number, range: number) {
    const cells = new Array<Cell>()
    range = Math.floor(Math.abs(range))
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        if (x == cellX && y == cellY) continue
        const distance = this.distance(cellX, cellY, x, y)
        if (y >= 0 && y < this.rows && x >= 0 && x < this.columns && distance <= range) {
          cells.push({ x, y, value: this.cells[this.columns * y + x] })
        }
      }
    }
    return cells
  }

  getCellsInRadius(cellX: number, cellY: number, radius: number) {
    const cells = new Array<Cell>()
    radius = Math.floor(Math.abs(radius)) + 0.5
    const radiusSquared = radius * radius
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        if (x == cellX && y == cellY) continue
        const dy = cellY - y
        const dx = cellX - x
        const distanceSquared = dy * dy + dx * dx
        if (y >= 0 && y < this.rows && x >= 0 && x < this.columns && distanceSquared < radiusSquared) {
          cells.push({ x, y, value: this.cells[this.columns * y + x] })
        }
      }
    }
    return cells
  }

  getCellsBetween(x0: number, y0: number, x1: number, y1: number) {
    /* Supercover line algorithm from https://www.redblobgames.com/grids/line-drawing.html */
    const cells: Cell[] = [{
      x: x0,
      y: y0,
      value: this.cells[this.columns * y0 + x0]
    }]
    const dx = x1 - x0, dy = y1 - y0
    const nx = Math.abs(dx), ny = Math.abs(dy);
    const sign_x = Math.sign(dx), sign_y = Math.sign(dy);

    let x=x0, y=y0
    for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
      let decision = (1 + 2*ix) * ny - (1 + 2*iy) * nx;
      if (decision === 0) {
          // next step is diagonal
          x += sign_x;
          y += sign_y;
          ix++;
          iy++;
      } else if (decision < 0) {
          // next step is horizontal
          x += sign_x;
          ix++;
      } else {
          // next step is vertical
          y += sign_y;
          iy++;
      }
      cells.push({ x, y, value: this.cells[this.columns * y + x] });
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
        (a, b) =>
          this.distance(x, y, b.x, b.y) -
          this.distance(x, y, a.x, a.y)
      )
      return candidates[0]
    } else {
      return undefined
    }
  }
}