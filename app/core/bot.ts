import { FAIRY_WANDS_BY_SYNERGY_LEVEL } from "../config"
import { TM_MAX_PP } from "../config/game/items"
import type Player from "../models/colyseus-models/player"
import { BotV2 } from "../models/mongo-models/bot-v2"
import PokemonFactory from "../models/pokemon-factory"
import type GameRoom from "../rooms/game-room"
import { AbilityPerTM, Emotion, Item, TMs } from "../types"
import { PokemonActionState } from "../types/enum/Game"
import { Passive } from "../types/enum/Passive"
import { Synergy } from "../types/enum/Synergy"
import type { IBot } from "../types/models/bot-v2"
import { isIn } from "../utils/array"
import { logger } from "../utils/logger"
import { pickRandomIn } from "../utils/random"
import {
  OnChangePositionEffect,
  OnItemDroppedEffect,
  OnSpotlightChangeEffect
} from "./effects/effect"
import { ItemEffects } from "./effects/items"
import { PassiveEffects } from "./effects/passives"

export default class Bot {
  player: Player
  step: number
  progress: number
  scenario: IBot | undefined

  constructor(player: Player, room: GameRoom) {
    this.player = player
    this.step = 0
    this.progress = 0
    this.initialize(room)
  }

  async initialize(room: GameRoom) {
    try {
      const data = await BotV2.findOne({ id: this.player.id }, "steps")
      if (data) {
        this.scenario = data
        //TODO: allow to choose your wands in bot builder
        this.player.fairyWands.push(
          pickRandomIn(FAIRY_WANDS_BY_SYNERGY_LEVEL[0]),
          pickRandomIn(FAIRY_WANDS_BY_SYNERGY_LEVEL[1]),
          pickRandomIn(FAIRY_WANDS_BY_SYNERGY_LEVEL[2]),
          pickRandomIn(FAIRY_WANDS_BY_SYNERGY_LEVEL[3])
        )
        this.updatePlayerTeam(room)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  updateProgress(room: GameRoom) {
    this.progress += 1

    if (
      this.scenario &&
      this.scenario.steps[this.step + 1] &&
      this.progress >= this.scenario.steps[this.step + 1].roundsRequired
    ) {
      this.step += 1
      this.progress -= this.scenario.steps[this.step].roundsRequired
      this.updatePlayerTeam(room)
      this.updateFlowerPots()
    }
  }

  updatePlayerTeam(room: GameRoom) {
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
            if (isIn(TMs, item)) {
              const ability = AbilityPerTM[item]
              if (!ability || pkm.types.has(Synergy.HUMAN) === false)
                return false // prevent equipping TMs on non-human pokemon
              pkm.tm = ability
              pkm.skill = ability
              pkm.maxPP = TM_MAX_PP
            } else if (!pkm.items.has(item)) {
              pkm.items.add(item)

              const onItemDroppedEffects: OnItemDroppedEffect[] = [
                ...(ItemEffects[item]?.filter(
                  (effect) => effect instanceof OnItemDroppedEffect
                ) ?? []),
                ...(PassiveEffects[pkm.passive]?.filter(
                  (effect) => effect instanceof OnItemDroppedEffect
                ) ?? [])
              ]

              for (const onItemDroppedEffect of onItemDroppedEffects) {
                onItemDroppedEffect.apply({
                  pokemon: pkm,
                  player: this.player,
                  item,
                  room
                })
              }
            }
          })
        }
        this.player.board.set(pkm.id, pkm)
      }

      this.player.updateSynergies()

      // apply passives once the whole board is set
      this.player.board.forEach((pkm) => {
        if (pkm.passive !== Passive.NONE) {
          const hasLightActive = this.player.synergies.hasSynergyActive(
            Synergy.LIGHT
          )
          const inSpotlight =
            hasLightActive &&
            ((pkm.positionX === this.player.lightX &&
              pkm.positionY === this.player.lightY) ||
              pkm.items.has(Item.SHINY_STONE))

          PassiveEffects[pkm.passive]?.forEach((effect) => {
            if (effect instanceof OnChangePositionEffect) {
              effect.apply({
                pokemon: pkm,
                player: this.player,
                oldX: pkm.positionX,
                oldY: pkm.positionY,
                newX: pkm.positionX,
                newY: pkm.positionY
              })
            }

            if (effect instanceof OnSpotlightChangeEffect) {
              effect.apply({
                pokemon: pkm,
                player: this.player,
                inSpotlight
              })
            }
          })
        }
      })
    }
  }

  updateFlowerPots() {
    if (this.step % 3 === 0 && this.step >= 6 && this.step < 30) {
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
