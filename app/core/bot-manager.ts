import Player from "../models/colyseus-models/player"
import Bot from "./bot"

export default class BotManager {
  bots: Bot[]

  constructor() {
    this.bots = []
  }

  addBot(player: Player) {
    this.bots.push(new Bot(player))
  }

  updateBots() {
    this.bots.forEach((bot) => {
      bot.updateProgress()
    })
  }
}