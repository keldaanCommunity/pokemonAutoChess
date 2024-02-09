import { Schema, type } from "@colyseus/schema"
import { BattleResult } from "../../types/enum/Game"
import { Weather } from "../../types/enum/Weather"

export default class HistoryItem extends Schema {
  @type("string") id: string
  @type("string") name: string
  @type("string") result: BattleResult
  @type("string") avatar: string
  @type("string") weather: Weather

  constructor(
    id: string,
    name: string,
    result: BattleResult,
    avatar: string,
    weather: Weather
  ) {
    super()
    this.id = id
    this.name = name
    this.result = result
    this.avatar = avatar
    this.weather = weather
  }
}
