import { Schema, type } from "@colyseus/schema"
import { EloRank } from "../../types/enum/EloRank"
import { GameMode } from "../../types/enum/Game"
import { ISpecialGamePlanned } from "../../types/interfaces/Lobby"

export class SpecialGamePlannedSchema
  extends Schema
  implements ISpecialGamePlanned
{
  @type("string") mode: GameMode
  @type("string") date: string
  @type("string") minRank: EloRank | ""

  constructor(mode: GameMode, date: string, minRank?: EloRank) {
    super()
    this.mode = mode
    this.date = date
    this.minRank = minRank ?? ""
  }
}