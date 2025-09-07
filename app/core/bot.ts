import Player from "../models/colyseus-models/player"
import { BotV2, IBot } from "../models/mongo-models/bot-v2"
import PokemonFactory from "../models/pokemon-factory"
import { Emotion } from "../types"
import { PokemonActionState } from "../types/enum/Game"
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
    this.progress += 1

    if (
      this.scenario &&
      this.scenario.steps[this.step + 1] &&
      this.progress >= this.scenario.steps[this.step + 1].roundsRequired
    ) {
      this.step += 1
      this.progress -= this.scenario.steps[this.step].roundsRequired
      this.updatePlayerTeam()
      this.updateFlowerPots()
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
            emotion,
            shiny: !!stepTeam.board[i].shiny
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

      this.player.updateSynergies()
    }
  }

  updateFlowerPots() {
    if (this.step % 3 === 0 && this.step >= 6 && this.step <= 30) {
      const mulchIndex = Math.floor(this.step / 3) - 2
      const potIndex = mulchIndex % 4
      const flowerPot = this.player.flowerPots[potIndex]
      if (flowerPot && flowerPot.evolution) {
        const potEvolution = PokemonFactory.createPokemonFromName(
          flowerPot.evolution,
          this.player
        )
        potEvolution.action = PokemonActionState.SLEEP
        this.player.flowerPots[potIndex] = potEvolution
      }
    }
  }
}
