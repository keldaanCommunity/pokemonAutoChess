
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
        var value = this.getValue(r0, c0);
        this.setValue(r1, c1, value);
        this.setValue(r0, c0, undefined);
    }

    swapValue(r0, c0, r1, c1) {
      var v0 = this.getValue(r0, c0);
      var v1 = this.getValue(r1, c1);
      this.setValue(r1, c1, v0);
      this.setValue(r0, c0, v1);
    }

    forEach(callback) {
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.columns; c++) {
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

    orientation(r0, c0, r1, c1){
        let vx = r1 - r0;
        let vy = c1 - c0;
        let angle = Math.atan2(vy, vx);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        let angleSeparation = Math.PI / 8;
        let orientation;
    
        if (angle < angleSeparation) {
            orientation = ORIENTATION.RIGHT;
        }
        else if (angle < angleSeparation * 3) {
            orientation = ORIENTATION.UPRIGHT;
        }
        else if (angle < angleSeparation * 5) {
            orientation = ORIENTATION.UP;
        }
        else if (angle < angleSeparation * 7) {
            orientation = ORIENTATION.UPLEFT;
        }
        else if (angle < angleSeparation * 9) {
            orientation = ORIENTATION.LEFT;
        }
        else if (angle < angleSeparation * 11) {
            orientation = ORIENTATION.DOWNLEFT;
        }
        else if (angle < angleSeparation * 13) {
            orientation = ORIENTATION.DOWN;
        }
        else if (angle < angleSeparation * 15) {
            orientation = ORIENTATION.DOWNRIGHT;
        }
        else {
            orientation = ORIENTATION.RIGHT;
        }
        return orientation;
    }

    getAdjacentCells(row, col) {
        var cells = [];
        for (var r = row - 1; r < row + 2; r++) {
            for (var c = col - 1; c < col + 2; c++) {
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
        var cells = [];
        var n = Math.floor(Math.abs(range));
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.columns; c++) {
                if (r == row && c == col) continue;
                var d = this.distance(row, col, r, c);
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
        var cells = [];
        var n = Math.floor(Math.abs(radius)) + 0.5, n2 = n * n;
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.columns; c++) {
                if (r == row && c == col) continue;
                var dr = row - r, dc = col - c, d2 = dr * dr + dc * dc
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
        var cells = [];
        var dr = r1 - r0, dc = c1 - c0;
        var n = Math.max(Math.abs(dr), Math.abs(dc)), m = n == 0 ? 0 : 1 / n;
        var rs = dr * m, cs = dc * m;
        for (var fr = r0, cf = c0, i = 0; i <= n; i++, fr += rs, cf += cs) {
            var r = Math.round(fr), c = Math.round(cf);
            cells.push({
                row: r,
                column: c,
                value: this.cell[this.columns * r + c]
            });
        }
        return cells;
    }

    findPath(r0, c0, r1, c1) {
        var current = { row: r0, column: c0 }, next = {}, adjacents = [];
        var border = new PriorityQueue(), link = {}, cost = {};
        border.push(current, 0);
        link[current.row<<8|current.column] = null;
        cost[current.row<<8|current.column] = 0;
        while (border.length) {
            current = border.pop();
            if (current.row == r1 && current.column == c1) break;
            adjacents = this.getAdjacentCells(current.row, current.column);
            for (var i = 0; i < adjacents.length; i++) {
                next = adjacents[i];
                if (!!next.value) continue; // skip non-empty cell
                var dist = this.distanceM(current.row,current.column,next.row,next.column);
                var a = cost[current.row<<8|current.column] + dist;
                var b = cost[next.row<<8|next.column];
                if (b == undefined || a < b) {
                    link[next.row<<8|next.column] = current;
                    cost[next.row<<8|next.column] = a;
                    border.push(next, a + this.distance(next.row, next.column, r1, c1));
                }
            }
        }    
        var path = [];
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