
import {ORIENTATION} from '../models/enum';
import {Pokemon} from '../models/colyseus-models/pokemon';

export default class Board {
  rows: number;
  columns: number;
  cell: Pokemon[];
  
  constructor(rows: number, colums: number) {
    this.rows = rows;
    this.columns = colums;
    this.cell = new Array(this.rows * this.columns);
  }

  getValue(row: number, col: number) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
      return this.cell[this.columns * row + col];
    }
  }

  setValue(row: number, col: number, value: Pokemon) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
      this.cell[this.columns * row + col] = value;
    }
  }

  moveValue(r0: number, c0: number, r1: number, c1: number) {
    const value = this.getValue(r0, c0);
    this.setValue(r1, c1, value);
    this.setValue(r0, c0, undefined);
  }

  swapValue(r0: number, c0: number, r1: number, c1:number) {
    const v0 = this.getValue(r0, c0);
    const v1 = this.getValue(r1, c1);
    this.setValue(r1, c1, v0);
    this.setValue(r0, c0, v1);
  }

  forEach(callback: Function) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        callback(r, c, this.cell[this.columns * r + c]);
      }
    }
  }

  distance(r0: number, c0: number, r1: number, c1: number) {
    // chebyshev distance
    return Math.max(Math.abs(r0 - r1), Math.abs(c0 - c1));
  }

  distanceC(r0: number, c0: number, r1: number, c1: number) {
    // Manhattan distance
    return Math.abs(r1 - r0) + Math.abs(c1 - c0);
  }

  orientation(r0: number, c0: number, r1: number, c1: number) {
    const vx = r1 - r0;
    const vy = c1 - c0;
    if (vx > 0) {
      if (vy == 0) {
        return ORIENTATION.RIGHT;
      } else if (vy < 0) {
        return ORIENTATION.DOWNRIGHT;
      } else {
        return ORIENTATION.UPRIGHT;
      }
    } else if (vx == 0) {
      if (vy == 0) {
        console.log('error orientation', r0, c0, r1, c1);
        return ORIENTATION.UNCLEAR;
      } else if (vy < 0) {
        return ORIENTATION.DOWN;
      } else {
        return ORIENTATION.UP;
      }
    } else {
      if (vy == 0) {
        return ORIENTATION.LEFT;
      } else if (vy < 0) {
        return ORIENTATION.DOWNLEFT;
      } else {
        return ORIENTATION.UPLEFT;
      }
    }
  }

  getAdjacentCells(row: number, col: number) {
    const cells = [];
    for (let r = row - 1; r < row + 2; r++) {
      for (let c = col - 1; c < col + 2; c++) {
        if (r == row && c == col) continue;
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns) {
          cells.push({
            row: r,
            column: c,
            value: this.cell[this.columns * r + c]
          });
        }
      }
    }
    return cells;
  }

  getCellsInRange(row: number, col: number, range: number) {
    const cells = [];
    const n = Math.floor(Math.abs(range));
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (r == row && c == col) continue;
        const d = this.distance(row, col, r, c);
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns && d <= n) {
          cells.push({
            row: r,
            column: c,
            value: this.cell[this.columns * r + c]
          });
        }
      }
    }
    return cells;
  }

  getCellsInRadius(row: number, col: number, radius: number) {
    const cells = [];
    const n = Math.floor(Math.abs(radius)) + 0.5; const n2 = n * n;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (r == row && c == col) continue;
        const dr = row - r; const dc = col - c; const d2 = dr * dr + dc * dc;
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns && d2 < n2) {
          cells.push({
            row: r,
            column: c,
            value: this.cell[this.columns * r + c]
          });
        }
      }
    }
    return cells;
  }

  getCellsBetween(r0: number, c0: number, r1: number, c1: number) {
    const cells = [];
    const dr = r1 - r0; const dc = c1 - c0;
    const n = Math.max(Math.abs(dr), Math.abs(dc)); const m = n == 0 ? 0 : 1 / n;
    const rs = dr * m; const cs = dc * m;
    for (let fr = r0, cf = c0, i = 0; i <= n; i++, fr += rs, cf += cs) {
      const r = Math.round(fr); const c = Math.round(cf);
      cells.push({
        row: r,
        column: c,
        value: this.cell[this.columns * r + c]
      });
    }
    return cells;
  }
}

module.exports = Board;
