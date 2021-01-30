
const PriorityQueue = require('./priority-queue.js');
const ORIENTATION = require('../models/enum').ORIENTATION;

class Board {
  constructor(rows, colums) {
    this.rows = rows;
    this.columns = colums;
    this.cell = new Array(this.rows * this.columns);
  }

  getValue(row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
      return this.cell[this.columns * row + col];
    }
  }

  setValue(row, col, value) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
      this.cell[this.columns * row + col] = value;
    }
  }

  moveValue(r0, c0, r1, c1) {
    const value = this.getValue(r0, c0);
    this.setValue(r1, c1, value);
    this.setValue(r0, c0, undefined);
  }

  swapValue(r0, c0, r1, c1) {
    const v0 = this.getValue(r0, c0);
    const v1 = this.getValue(r1, c1);
    this.setValue(r1, c1, v0);
    this.setValue(r0, c0, v1);
  }

  forEach(callback) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        callback(r, c, this.cell[this.columns * r + c]);
      }
    }
  }

  distance(r0, c0, r1, c1) {
    // chebyshev distance
    return Math.max(Math.abs(r0 - r1), Math.abs(c0 - c1));
  }

  distanceM(r0, c0, r1, c1) {
    // Manhattan distance
    return Math.abs(r1 - r0) + Math.abs(c1 - c0);
  }

  orientation(r0, c0, r1, c1) {
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
        return ORIENTATION.DOWNLEFT;
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

  getAdjacentCells(row, col) {
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

  getCellsInRange(row, col, range) {
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

  getCellsInRadius(row, col, radius) {
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

  getCellsBetween(r0, c0, r1, c1) {
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

  findPath(r0, c0, r1, c1) {
    let current = {row: r0, column: c0}; let next = {}; let adjacents = [];
    const border = new PriorityQueue(); const link = {}; const cost = {};
    border.push(current, 0);
    link[current.row<<8|current.column] = null;
    cost[current.row<<8|current.column] = 0;
    while (border.length) {
      current = border.pop();
      if (current.row == r1 && current.column == c1) break;
      adjacents = this.getAdjacentCells(current.row, current.column);
      for (let i = 0; i < adjacents.length; i++) {
        next = adjacents[i];
        if (!!next.value) continue; // skip non-empty cell
        const dist = this.distance(current.row, current.column, next.row, next.column);
        const a = cost[current.row<<8|current.column] + dist;
        const b = cost[next.row<<8|next.column];
        if (b == undefined || a < b) {
          link[next.row<<8|next.column] = current;
          cost[next.row<<8|next.column] = a;
          border.push(next, a + this.distance(next.row, next.column, r1, c1));
        }
      }
    }
    const path = [];
    if (current.row == r1 && current.column == c1) {
      do {
        path.push({row: current.row, column: current.column});
        current = link[current.row<<8|current.column];
      } while (current != null);
    }
    return path.reverse();
  }
}

module.exports = Board;
