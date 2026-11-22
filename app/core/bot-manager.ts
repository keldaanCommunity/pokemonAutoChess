import type Player from "../models/colyseus-models/player"
import type GameRoom from "../rooms/game-room"
import Bot from "./bot"

export default class BotManager {
  bots: Bot[]

  constructor() {
    this.bots = []
  }

  addBot(player: Player, room: GameRoom) {
    this.bots.push(new Bot(player, room))
  }

  updateBots(room: GameRoom) {
    this.bots.forEach((bot) => {
      bot.updateProgress(room)
    })
  }
}
