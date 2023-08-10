import { Schema, type } from "@colyseus/schema"
import { BattleResult } from "../../types/enum/Game"
import { Weather } from "../../types/enum/Weather"

export default class HistoryItem extends Schema {
  @type("string") name: string
  @type("string") result: BattleResult
  @type("string") avatar: string
  @type("boolean") isPVE: boolean
  @type("string") weather: Weather

  constructor(
    name: string,
    result: BattleResult,
    avatar: string,
    isPVE: boolean,
    weather: Weather
  ) {
    super()
    this.name = name
    this.result = result
    this.avatar = avatar
    this.isPVE = isPVE
    this.weather = weather
  }
}
