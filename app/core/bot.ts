import { Item } from "../types/enum/Item"
import PokemonFactory from "../models/pokemon-factory"
import BOT, { IBot } from "../models/mongo-models/bot-v2"
import Player from "../models/colyseus-models/player"
import { BattleResult } from "../types/enum/Game"
import { Synergy } from "../types/enum/Synergy"
import { Emotion } from "../types"

export default class Bot {
  player: Player
  step: number
  progress: number
  scenario: IBot | undefined

  constructor(player: Player) {
    this.player = player
    this.step = 0
    this.progress = 0

    BOT.findOne({ avatar: player.avatar }, ["steps"], null, (err, bot) => {
      if (bot) {
        this.scenario = bot
        this.updatePlayerTeam()
      } else {
        console.log("error, bot not found")
      }
    })
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
    // console.log(this.scenario);
    this.player.board.forEach((pokemon, key) => {
      this.player.board.delete(key)
    })

    if (this.scenario) {
      const stepTeam = this.scenario.steps[this.step]
      for (let i = 0; i < stepTeam.board.length; i++) {
        const  potentialEmotion = stepTeam.board[i].emotion
        const emotion = potentialEmotion? potentialEmotion: Emotion.NORMAL
        const pkm = PokemonFactory.createPokemonFromName(stepTeam.board[i].name,
          {
            dust:0,
            emotions:new Array<Emotion>(),
            shinyEmotions:new Array<Emotion>(),
            id: "",
            selectedEmotion:emotion,
            selectedShiny: !!stepTeam.board[i].shiny
          })
        pkm.positionX = stepTeam.board[i].x
        pkm.positionY = stepTeam.board[i].y
        if (stepTeam.board[i].items) {
          stepTeam.board[i].items.forEach((item) => {
            if (!pkm.items.has(item)) {
              switch (item) {
                case Item.WATER_STONE:
                  if (!pkm.types.includes(Synergy.WATER)) {
                    pkm.types.push(Synergy.WATER)
                  }
                  break
                case Item.FIRE_STONE:
                  if (!pkm.types.includes(Synergy.FIRE)) {
                    pkm.types.push(Synergy.FIRE)
                  }
                  break
                case Item.THUNDER_STONE:
                  if (!pkm.types.includes(Synergy.ELECTRIC)) {
                    pkm.types.push(Synergy.ELECTRIC)
                  }
                  break
                case Item.DUSK_STONE:
                  if (!pkm.types.includes(Synergy.DARK)) {
                    pkm.types.push(Synergy.DARK)
                  }
                  break
                case Item.MOON_STONE:
                  if (!pkm.types.includes(Synergy.FAIRY)) {
                    pkm.types.push(Synergy.FAIRY)
                  }
                  break
                case Item.LEAF_STONE:
                  if (!pkm.types.includes(Synergy.GRASS)) {
                    pkm.types.push(Synergy.GRASS)
                  }
                  break
                case Item.DAWN_STONE:
                  if (!pkm.types.includes(Synergy.PSYCHIC)) {
                    pkm.types.push(Synergy.PSYCHIC)
                  }
                  break
                case Item.ICY_ROCK:
                  if (!pkm.types.includes(Synergy.ICE)) {
                    pkm.types.push(Synergy.ICE)
                  }
                  break
                case Item.OLD_AMBER:
                  if (!pkm.types.includes(Synergy.FOSSIL)) {
                    pkm.types.push(Synergy.FOSSIL)
                  }
                  break
                default:
                  break
              }
              pkm.items.add(item)
            }
          })
        }
        this.player.board.set(pkm.id, pkm)
      }

      this.player.synergies.update(this.player.board)
      this.player.effects.update(this.player.synergies)
    }
  }
}
