import { IPokemonEntity } from "../types"
import { Orientation } from "../types/enum/Game"
import { pickRandomIn } from "../utils/random"
import PokemonEntity from "./pokemon-entity"

export type Cell = {
  row: number
  column: number
  value: PokemonEntity | undefined
}
export default class Board {
  rows: number
  columns: number
  cell: Array<PokemonEntity | undefined>

  constructor(rows: number, colums: number) {
    this.rows = rows
    this.columns = colums
    this.cell = new Array<PokemonEntity | undefined>(this.rows * this.columns)
  }

  getValue(row: number, col: number): PokemonEntity | undefined {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
      return this.cell[this.columns * row + col]
    }
  }

  setValue(row: number, col: number, value: PokemonEntity | undefined) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
      this.cell[this.columns * row + col] = value
    }
  }

  moveValue(r0: number, c0: number, r1: number, c1: number) {
    const value = this.getValue(r0, c0)
    this.setValue(r1, c1, value)
    this.setValue(r0, c0, undefined)
  }

  swapValue(r0: number, c0: number, r1: number, c1: number) {
    const v0 = this.getValue(r0, c0)
    const v1 = this.getValue(r1, c1)
    this.setValue(r1, c1, v0)
    this.setValue(r0, c0, v1)
  }

  forEach(
    callback: (x: number, y: number, tg: PokemonEntity | undefined) => void
  ) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        callback(r, c, this.cell[this.columns * r + c])
      }
    }
  }

  distance(r0: number, c0: number, r1: number, c1: number) {
    // chebyshev distance
    return Math.max(Math.abs(r0 - r1), Math.abs(c0 - c1))
  }

  distanceC(r0: number, c0: number, r1: number, c1: number) {
    // Manhattan distance
    return Math.abs(r1 - r0) + Math.abs(c1 - c0)
  }

  orientation(
    r0: number,
    c0: number,
    r1: number,
    c1: number,
    pokemon: IPokemonEntity,
    target: IPokemonEntity | undefined
  ) {
    const vx = r1 - r0
    const vy = c1 - c0
    if (vx > 0) {
      if (vy == 0) {
        return Orientation.RIGHT
      } else if (vy < 0) {
        return Orientation.DOWNRIGHT
      } else {
        return Orientation.UPRIGHT
      }
    } else if (vx == 0) {
      if (vy == 0) {
        if(pokemon.status.confusion){
          return pickRandomIn(Orientation)
        }
        console.log("error orientation", r0, c0, r1, c1)
        console.log(
          "error pokemon",
          pokemon.positionX,
          pokemon.positionY,
          pokemon.name
        )
        console.log(
          "error target",
          target?.positionX,
          target?.positionY,
          target?.name
        )
        return Orientation.DOWNRIGHT
      } else if (vy < 0) {
        return Orientation.DOWN
      } else {
        return Orientation.UP
      }
    } else {
      if (vy == 0) {
        return Orientation.LEFT
      } else if (vy < 0) {
        return Orientation.DOWNLEFT
      } else {
        return Orientation.UPLEFT
      }
    }
  }

  getAdjacentCells(row: number, col: number) {
    const cells = new Array<Cell>()
    for (let r = row - 1; r < row + 2; r++) {
      for (let c = col - 1; c < col + 2; c++) {
        if (r == row && c == col) continue
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns) {
          cells.push({
            row: r,
            column: c,
            value: this.cell[this.columns * r + c]
          })
        }
      }
    }
    return cells
  }

  getCellsInRange(row: number, col: number, range: number) {
    const cells = new Array<Cell>()
    const n = Math.floor(Math.abs(range))
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (r == row && c == col) continue
        const d = this.distance(row, col, r, c)
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns && d <= n) {
          cells.push({
            row: r,
            column: c,
            value: this.cell[this.columns * r + c]
          })
        }
      }
    }
    return cells
  }

  getCellsInRadius(row: number, col: number, radius: number) {
    const cells = new Array<Cell>()
    const n = Math.floor(Math.abs(radius)) + 0.5
    const n2 = n * n
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (r == row && c == col) continue
        const dr = row - r
        const dc = col - c
        const d2 = dr * dr + dc * dc
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns && d2 < n2) {
          cells.push({
            row: r,
            column: c,
            value: this.cell[this.columns * r + c]
          })
        }
      }
    }
    return cells
  }

  getCellsBetween(r0: number, c0: number, r1: number, c1: number) {
    const cells = new Array<Cell>()
    const dr = r1 - r0
    const dc = c1 - c0
    const n = Math.max(Math.abs(dr), Math.abs(dc))
    const m = n == 0 ? 0 : 1 / n
    const rs = dr * m
    const cs = dc * m
    for (let fr = r0, cf = c0, i = 0; i <= n; i++, fr += rs, cf += cs) {
      const r = Math.round(fr)
      const c = Math.round(cf)
      cells.push({
        row: r,
        column: c,
        value: this.cell[this.columns * r + c]
      })
    }
    return cells
  }

  getTeleportationCell(r: number, c: number) {
    const candidates = new Array<Cell>()
    ;[
      { r: 0, c: 0 },
      { r: this.rows - 1, c: 0 },
      { r: this.rows - 1, c: this.columns - 1 },
      { r: 0, c: this.columns - 1 }
    ].forEach((coord) => {
      const cells = this.getCellsBetween(r, c, coord.r, coord.c)
      cells.forEach((cell) => {
        if (cell.value === undefined) {
          candidates.push(cell)
        }
      })
    })
    if (candidates.length > 0) {
      candidates.sort(
        (a, b) =>
          this.distance(r, c, b.row, b.column) -
          this.distance(r, c, a.row, a.column)
      )
      return candidates[0]
    } else {
      return undefined
    }
  }
}

module.exports = Board
