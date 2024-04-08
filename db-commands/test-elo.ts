import { EloEngine } from "../app/core/elo-engine"

const elo = new EloEngine()
console.log(elo.updateRating(elo.getExpected(1000, 1468), 1, 1000))
