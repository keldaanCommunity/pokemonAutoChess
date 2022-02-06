const {ID_TABLE} = require('../models/enum');

class Mask {
  mask8bits(matrix, row, col) {
    let m = 0; const v = matrix[row][col];
    m |= this.eq(matrix, row - 1, col, v) << 0;
    m |= this.eq(matrix, row, col + 1, v) << 1;
    m |= this.eq(matrix, row + 1, col, v) << 2;
    m |= this.eq(matrix, row, col - 1, v) << 3;
    m |= (m & 0b0011) == 0b0011 ? this.eq(matrix, row - 1, col + 1, v) << 4 : 0;
    m |= (m & 0b0110) == 0b0110 ? this.eq(matrix, row + 1, col + 1, v) << 5 : 0;
    m |= (m & 0b1100) == 0b1100 ? this.eq(matrix, row + 1, col - 1, v) << 6 : 0;
    m |= (m & 0b1001) == 0b1001 ? this.eq(matrix, row - 1, col - 1, v) << 7 : 0;
    return ID_TABLE[m];
  }

  eq(m, r, c, v) {
    return (r >= 0 && r < m.length && c >= 0 && c < m[r].length && m[r][c] == v) ? 1 : 0;
  }
}

module.exports = Mask;
