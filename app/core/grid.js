class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._data = new Array(width * height);
    for (var i = 0; i < this._data.length; i++) this._data[i] = null;
  }

  setValue(x, y, value) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this._data[this.width * y + x] = value;
    }
  }

  getValue(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this._data[this.width * y + x];
    }
    return null;
  }

  moveValue(originX, originY, targetX, targetY) {
    if (originX >= 0 && originX < this.width && targetX >= 0 && targetX < this.height) {
      if (targetX >= 0 && targetX < this.width && targetY >= 0 && targetY < this.height) {
        this._data[this.width * targetY + targetX] = this._data[this.width * originY + originX];
        this._data[this.width * originY + originX] = null;
      }
    }
    return null;
  }

  getAdjacentCells(x, y) {
    var cells = [];
    for (var i = x - 1; i < x + 1; i++) {
      for (var j = y - 1; j < y + 1; j++) {
        if (i == x && j == y) continue;
        if (i >= 0 && i < this.width && j >= 0 && j < this.height) {
          cells.push({ x: i, y: j, value: this._data[this.width * j + i] });
        }
      }
    }
    return cells;
  }

  getCellsInRange(x, y, range) {
    var cells = [];
    range = Math.floor(Math.abs(range));
    var left = Math.max(x - range, 0), right = Math.min(x + range, this.width - 1);
    var top = Math.max(y - range, 0), bottom = Math.min(y + range, this.height - 1);
    for (var i = left; i <= right; i++) {
      for (var j = top; j <= bottom; j++) {
        if (this.distance(x, y, i, j) <= range) {
          cells.push({ x: i, y: j, value: this._data[this.width * j + i] });
        }
      }
    }
    return cells;
  }

  getCellsInRadius(x, y, radius) {
    var cells = [];
    radius = Math.floor(Math.abs(radius)) + 0.5;
    var radius2 = radius * radius;
    var left = Math.max(x - range, 0), right = Math.min(x + range, this.width - 1);
    var top = Math.max(y - range, 0), bottom = Math.min(y + range, this.height - 1);
    for (var i = left; i <= right; i++) {
      for (var j = top; j <= bottom; j++) {
        var dx = x - i, dy = y - j;
        if ((dx * dx + dy * dy) < radius2) {
          cells.push({ x: i, y: j, value: this._data[this.width * j + i] });
        }
      }
    }
    return cells;
  }

  getNearestCell(x, y, cells) {
    var cell = null;
    var dx = 0, dy = 0, distance = 0, min = 99999;
    for (var i = 0; i < cells.length; i++) {
      dx = x - cells[i].x;
      dy = y - cells[i].y;
      distance = dx * dx + dy * dy;
      if (distance < min) {
        min = distance;
        cell = cells[i];
      }
    }
    return cell;
  }

  getCellsBetween(x1, y1, x2, y2) {
    // https://www.redblobgames.com/grids/line-drawing.html
  }

  distance(x1, y1, x2, y2) {
    // chebyshev distance
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
  }

  forEach(f) {
    for (var i = 0; i < this._data.length; i++) {
      f(this._data[i]);
    }
  }

}

module.exports = Grid;