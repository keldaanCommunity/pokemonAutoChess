import PokemonFactory from "../models/pokemon-factory"
import { BotV2, IBot } from "../models/mongo-models/bot-v2"
import Player from "../models/colyseus-models/player"
import { BattleResult } from "../types/enum/Game"
import { Emotion } from "../types"
import { logger } from "../utils/logger"

export default class Bot {
  player: Player
  step: number
  progress: number
  scenario: IBot | undefined

  constructor(player: Player) {
    this.player = player
    this.step = 0
    this.progress = 0
    this.initialize()
  }

  async initialize() {
    try {
      const data = await BotV2.findOne({ id: this.player.id }, ["steps"])
      if (data) {
        this.scenario = data
        this.updatePlayerTeam()
      }
    } catch (error) {
      logger.error(error)
    }
  }

  updateProgress() {
    if (this.player.getLastBattleResult() == BattleResult.DEFEAT) {
      this.progress += 1
    } else if (this.player.getLastBattleResult() == BattleResult.DRAW) {
      this.progress += 1
    } else if (this.player.getLastBattleResult() == BattleResult.WIN) {
      this.progress += 1.5
    }

    if (
      this.scenario &&
      this.scenario.steps[this.step + 1] &&
      this.progress >= this.scenario.steps[this.step + 1].roundsRequired
    ) {
      this.step += 1
      this.progress = 0
      this.updatePlayerTeam()
    }
  }

  updatePlayerTeam() {
    this.player.board.forEach((pokemon, key) => {
      this.player.board.delete(key)
    })

    if (this.scenario) {
      const stepTeam = this.scenario.steps[this.step]
      for (let i = 0; i < stepTeam.board.length; i++) {
        const potentialEmotion = stepTeam.board[i].emotion
        const emotion = potentialEmotion ? potentialEmotion : Emotion.NORMAL
        const pkm = PokemonFactory.createPokemonFromName(
          stepTeam.board[i].name,
          {
            selectedEmotion: emotion,
            selectedShiny: !!stepTeam.board[i].shiny
          }
        )
        pkm.positionX = stepTeam.board[i].x
        pkm.positionY = stepTeam.board[i].y
        if (stepTeam.board[i].items) {
          stepTeam.board[i].items.forEach((item) => {
            if (!pkm.items.has(item)) {
              pkm.items.add(item)
            }
          })
        }
        this.player.board.set(pkm.id, pkm)
      }

      this.player.synergies.update(this.player.board)
      this.player.effects.update(this.player.synergies, this.player.board)
    }
  }
}
