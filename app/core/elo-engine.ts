import { min } from "../utils/number"

export class EloEngine {
  K = 32

  getExpected(a: number, b: number) {
    return 1 / (1 + Math.pow(10, (b - a) / 400))
  }
  updateRating(
    expected: number,
    actual: number,
    current: number,
    nbGamesPlayed: number
  ) {
    /*
    Adapt the K value based on the number of games played
    The idea is that you can quickly have a good first impression of one player's skill level on their first games.
    */
    const dynamicK =
      actual > expected
        ? min(this.K)(110 - 50 * Math.log(nbGamesPlayed))
        : this.K
    return Math.round(current + dynamicK * (actual - expected))
  }
}
