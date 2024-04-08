export class EloEngine {
  k = 32

  getExpected(a: number, b: number) {
    return 1 / (1 + Math.pow(10, (b - a) / 400))
  }
  updateRating(expected: number, actual: number, current: number) {
    return Math.round(current + this.k * (actual - expected))
  }
}
