import { EloRank } from "../enum/EloRank"
import { GameMode } from "../enum/Game"

export interface ISpecialGamePlanned {
  mode: GameMode
  date: string
  minRank: EloRank | ""
}