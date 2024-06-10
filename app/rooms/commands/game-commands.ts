import { Command } from "@colyseus/command"
import { Client, updateLobby } from "colyseus"
import { nanoid } from "nanoid"

import {
  ConditionBasedEvolutionRule,
  CountEvolutionRule,
  HatchEvolutionRule
} from "../../core/evolution-rules"
import { selectMatchups } from "../../core/matchmaking"
import { canSell } from "../../core/pokemon-entity"
import Simulation from "../../core/simulation"
import { getLevelUpCost } from "../../models/colyseus-models/experience-manager"
import Player from "../../models/colyseus-models/player"
import { isOnBench } from "../../models/colyseus-models/pokemon"
import { createRandomEgg } from "../../models/egg-factory"
import PokemonFactory from "../../models/pokemon-factory"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { PVEStages } from "../../models/pve-stages"
import { getBuyPrice, getSellPrice } from "../../models/shop"
import { getAvatarString } from "../../public/src/utils"
import {
  IClient,
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  Title,
  Transfer
} from "../../types"
import {
  AdditionalPicksStages,
  FIGHTING_PHASE_DURATION,
  ITEM_CAROUSEL_BASE_DURATION,
  ItemCarouselStages,
  ItemProposalStages,
  MAX_PLAYERS_PER_GAME,
  PORTAL_CAROUSEL_BASE_DURATION,
  PortalCarouselStages,
  StageDuration,
  SynergyTriggers,
  RarityProbabilityPerLevel
} from "../../types/Config"
import { Effect } from "../../types/enum/Effect"
import { BattleResult, GamePhaseState, Rarity } from "../../types/enum/Game"
import {
  ArtificialItems,
  ItemComponents,
  Berries,
  Item,
  ItemRecipe,
  SynergyGivenByItem,
  SynergyItems,
  ShinyItems,
  WeatherRocks
} from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmFamily, PkmIndex, Unowns } from "../../types/enum/Pokemon"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule"
import { Synergy } from "../../types/enum/Synergy"
import { removeInArray } from "../../utils/array"
import {
  getFirstAvailablePositionInBench,
  getFirstAvailablePositionOnBoard,
  getFreeSpaceOnBench,
  getMaxTeamSize,
  isPositionEmpty
} from "../../utils/board"
import { repeat } from "../../utils/function"
import { logger } from "../../utils/logger"
import { max } from "../../utils/number"
import { chance, pickNRandomIn, pickRandomIn } from "../../utils/random"
import { resetArraySchema, values } from "../../utils/schemas"
import { getWeather } from "../../utils/weather"
import GameRoom from "../game-room"

export class OnShopCommand extends Command<
  GameRoom,
  {
    playerId: string
    index: number
  }
> {
  execute({ playerId, index }) {
    if (
      playerId === undefined ||
      index === undefined ||
      !this.state.players.has(playerId)
    )
      return
    const player = this.state.players.get(playerId)
    if (!player || !player.shop[index] || player.shop[index] === Pkm.DEFAULT)
      return

    const name = player.shop[index]
    const pokemon = PokemonFactory.createPokemonFromName(name, player)
    const isEvolution =
      pokemon.evolutionRule &&
      pokemon.evolutionRule instanceof CountEvolutionRule &&
      pokemon.evolutionRule.canEvolveIfBuyingOne(pokemon, player)

    let cost = getBuyPrice(name, this.state.specialGameRule)
    const freeSpaceOnBench = getFreeSpaceOnBench(player.board)
    const hasSpaceOnBench = freeSpaceOnBench > 0 || isEvolution

    if (
      isEvolution &&
      this.state.specialGameRule === SpecialGameRule.BUYER_FEVER
    ) {
      cost = 0
    }

    const canBuy = player.money >= cost && hasSpaceOnBench
    if (!canBuy) return

    player.money -= cost

    const x = getFirstAvailablePositionInBench(player.board)
    pokemon.positionX = x !== undefined ? x : -1
    pokemon.positionY = 0
    player.board.set(pokemon.id, pokemon)
    pokemon.onAcquired(player)

    if (
      pokemon.passive === Passive.UNOWN &&
      player.effects.has(Effect.EERIE_SPELL) &&
      player.shop.every((p) => Unowns.includes(p))
    ) {
      // reset shop after picking in a unown shop
      this.state.shop.assignShop(player, true, this.state)
    } else {
      player.shop = player.shop.with(index, Pkm.DEFAULT)
    }

    this.room.checkEvolutionsAfterPokemonAcquired(playerId)
  }
}

export class OnRemoveFromShopCommand extends Command<
  GameRoom,
  {
    playerId: string
    index: number
  }
> {
  execute({ playerId, index }) {
    if (
      playerId === undefined ||
      index === undefined ||
      !this.state.players.has(playerId)
    )
      return
    const player = this.state.players.get(playerId)
    if (!player || !player.shop[index] || player.shop[index] === Pkm.DEFAULT)
      return

    const name = player.shop[index]
    const cost = getBuyPrice(name, this.state.specialGameRule)
    if (player.money >= cost) {
      player.shop = player.shop.with(index, Pkm.DEFAULT)
      this.state.shop.releasePokemon(name, player)
    }
  }
}

export class OnPokemonCatchCommand extends Command<
  GameRoom,
  {
    playerId: string
    pkm: Pkm
  }
> {
  execute({ playerId, pkm }) {
    if (
      playerId === undefined ||
      pkm === undefined ||
      !this.state.players.has(playerId)
    )
      return
    const player = this.state.players.get(playerId)
    if (!player) return

    const pokemon = PokemonFactory.createPokemonFromName(pkm, player)
    const freeSpaceOnBench = getFreeSpaceOnBench(player.board)
    const hasSpaceOnBench =
      freeSpaceOnBench > 0 ||
      (pokemon.evolutionRule &&
        pokemon.evolutionRule instanceof CountEvolutionRule &&
        pokemon.evolutionRule.canEvolveIfBuyingOne(pokemon, player))

    if (hasSpaceOnBench) {
      const x = getFirstAvailablePositionInBench(player.board)
      pokemon.positionX = x !== undefined ? x : -1
      pokemon.positionY = 0
      player.board.set(pokemon.id, pokemon)
      pokemon.onAcquired(player)
      this.room.checkEvolutionsAfterPokemonAcquired(playerId)
    }
  }
}

export class OnDragDropCommand extends Command<
  GameRoom,
  {
    client: IClient
    detail: IDragDropMessage
  }
> {
  execute({ client, detail }) {
    const commands = []
    let success = false
    let dittoReplaced = false
    const message = {
      updateBoard: true,
      updateItems: true
    }
    const playerId = client.auth.uid
    const player = this.state.players.get(playerId)

    if (player) {
      message.updateItems = false
      const pokemon = player.board.get(detail.id)
      if (pokemon) {
        const x = parseInt(detail.x)
        const y = parseInt(detail.y)
        const dropOnBench = y == 0
        const dropFromBench = isOnBench(pokemon)

        if (
          pokemon.name === Pkm.DITTO &&
          dropFromBench &&
          !isPositionEmpty(x, y, player.board)
        ) {
          const pokemonToClone = this.room.getPokemonByPosition(player, x, y)
          if (pokemonToClone && pokemonToClone.canBeCloned) {
            dittoReplaced = true
            const replaceDitto = PokemonFactory.createPokemonFromName(
              PokemonFactory.getPokemonBaseEvolution(pokemonToClone.name),
              player
            )
            pokemon.items.forEach((item) => {
              player.items.push(item)
            })
            player.board.delete(detail.id)
            const position = getFirstAvailablePositionInBench(player.board)
            if (position !== undefined) {
              replaceDitto.positionX = position
              replaceDitto.positionY = 0
              player.board.set(replaceDitto.id, replaceDitto)
              success = true
              message.updateBoard = false
            }
          } else if (y === 0) {
            this.room.swap(player, pokemon, x, y)
            success = true
          }
        } else if (dropOnBench && dropFromBench) {
          // Drag and drop pokemons through bench has no limitation

          this.room.swap(player, pokemon, x, y)
          pokemon.onChangePosition(x, y, player)
          success = true
        } else if (this.state.phase == GamePhaseState.PICK) {
          // On pick, allow to drop on / from board
          const teamSize = this.room.getTeamSize(player.board)
          const isBoardFull =
            teamSize >=
            getMaxTeamSize(
              player.experienceManager.level,
              this.room.state.specialGameRule
            )
          const dropToEmptyPlace = isPositionEmpty(x, y, player.board)

          if (dropOnBench) {
            // From board to bench is always allowed (bench to bench is already handled)
            this.room.swap(player, pokemon, x, y)
            pokemon.onChangePosition(x, y, player)
            success = true
          } else if (
            pokemon.canBePlaced &&
            !(dropFromBench && dropToEmptyPlace && isBoardFull)
          ) {
            // Prevents a pokemon to go on the board only if it's adding a pokemon from the bench on a full board
            this.room.swap(player, pokemon, x, y)
            pokemon.onChangePosition(x, y, player)
            success = true
          }
        }
      }

      if (!success && client.send) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
      }
      if (dittoReplaced) {
        this.room.checkEvolutionsAfterPokemonAcquired(playerId)
      }

      player.updateSynergies()
      player.boardSize = this.room.getTeamSize(player.board)
    }
    if (commands.length > 0) {
      return commands
    }
  }
}

export class OnDragDropCombineCommand extends Command<
  GameRoom,
  {
    client: Client
    detail: IDragDropCombineMessage
  }
> {
  execute({ client, detail }) {
    const playerId = client.auth.uid
    const message = {
      updateBoard: true,
      updateItems: true
    }
    const player = this.state.players.get(playerId)

    if (player) {
      message.updateBoard = false
      message.updateItems = true

      const itemA = detail.itemA
      const itemB = detail.itemB

      //verify player has both items
      if (!player.items.includes(itemA) || !player.items.includes(itemB)) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      }
      // check for two if both items are same
      else if (itemA == itemB) {
        let count = 0
        player.items.forEach((item) => {
          if (item == itemA) {
            count++
          }
        })

        if (count < 2) {
          client.send(Transfer.DRAG_DROP_FAILED, message)
          return
        }
      }

      // find recipe result
      let result: Item | undefined = undefined
      for (const [key, value] of Object.entries(ItemRecipe) as [
        Item,
        Item[]
      ][]) {
        if (
          (value[0] == itemA && value[1] == itemB) ||
          (value[0] == itemB && value[1] == itemA)
        ) {
          result = key
          break
        }
      }

      if (!result) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      } else {
        player.items.push(result)
        removeInArray(player.items, itemA)
        removeInArray(player.items, itemB)
      }

      player.updateSynergies()
    }
  }
}
export class OnDragDropItemCommand extends Command<
  GameRoom,
  {
    client: Client
    detail: IDragDropItemMessage
  }
> {
  execute({ client, detail }) {
    const playerId = client.auth.uid
    const message = {
      updateBoard: true,
      updateItems: true
    }
    const player = this.state.players.get(playerId)
    if (!player) return

    message.updateBoard = false
    message.updateItems = true

    const { x, y, id: item } = detail

    if (!player.items.includes(item)) {
      client.send(Transfer.DRAG_DROP_FAILED, message)
      return
    }

    const pokemon = player.getPokemonAt(x, y)

    if (item === Item.METEORITE) {
      if (pokemon?.passive === Passive.ALIEN_DNA) {
        if (pokemon.name === Pkm.DEOXYS) {
          player.transformPokemon(pokemon, Pkm.DEOXYS_ATTACK)
        } else if (pokemon.name === Pkm.DEOXYS_ATTACK) {
          player.transformPokemon(pokemon, Pkm.DEOXYS_DEFENSE)
        } else if (pokemon.name === Pkm.DEOXYS_DEFENSE) {
          player.transformPokemon(pokemon, Pkm.DEOXYS_SPEED)
        } else if (pokemon.name === Pkm.DEOXYS_SPEED) {
          player.transformPokemon(pokemon, Pkm.DEOXYS)
        }
      }
      client.send(Transfer.DRAG_DROP_FAILED, message)
      return
    }

    if (item === Item.SUPER_ROD) {
      let needsRecomputingSynergiesAgain = false
      pokemon?.items.forEach((item) => {
        pokemon.items.delete(item)
        player.items.push(item)
        if (item in SynergyGivenByItem) {
          const type = SynergyGivenByItem[item]
          const nativeTypes = getPokemonData(pokemon.name).types
          if (nativeTypes.includes(type) === false) {
            pokemon.types.delete(type)
            if (!isOnBench(pokemon)) {
              needsRecomputingSynergiesAgain = true
            }
          }
        }
      })
      if (needsRecomputingSynergiesAgain) {
        player.updateSynergies()
      }
      client.send(Transfer.DRAG_DROP_FAILED, message)
      return
    }

    if (item === Item.RARE_CANDY) {
      const evolution = pokemon?.evolution
      if (!evolution || pokemon.items.has(Item.EVIOLITE)) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      }
      player.transformPokemon(pokemon, evolution)
      removeInArray(player.items, item)
      return
    }

    if (item === Item.EVIOLITE && !pokemon?.evolution) {
      client.send(Transfer.DRAG_DROP_FAILED, message)
      return
    }

    if (pokemon === undefined || !pokemon.canHoldItems) {
      client.send(Transfer.DRAG_DROP_FAILED, message)
      return
    }

    const isBasicItem = ItemComponents.includes(item)
    const existingBasicItemToCombine = values(pokemon.items).find((i) =>
      ItemComponents.includes(i)
    )

    // check if full items and nothing to combine
    if (
      pokemon.items.size >= 3 &&
      (!isBasicItem || !existingBasicItemToCombine)
    ) {
      client.send(Transfer.DRAG_DROP_FAILED, message)
      return
    }

    if (
      SynergyItems.includes(item) &&
      pokemon.types.has(SynergyGivenByItem[item]) &&
      pokemon.passive !== Passive.RECYCLE
    ) {
      // prevent adding a synergy stone on a pokemon that already has this synergy
      client.send(Transfer.DRAG_DROP_FAILED, message)
      return
    }

    if (
      WeatherRocks.includes(item) &&
      (!pokemon.types.has(Synergy.ROCK) ||
        pokemon.types.has(SynergyGivenByItem[item]))
    ) {
      if (
        item !== Item.BLACK_AUGURITE || 
        pokemon.passive !== Passive.SCYTHER
      ){
        // prevent adding weather rocks to non-rock pokemon, or to those with the synergy already
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      }
    }

    if (!isBasicItem && pokemon.items.has(item)) {
      // prevent adding twitce the same completed item
      client.send(Transfer.DRAG_DROP_FAILED, message)
      return
    }

    if (isBasicItem && existingBasicItemToCombine) {
      const recipe = Object.entries(ItemRecipe).find(
        ([_result, recipe]) =>
          (recipe[0] === existingBasicItemToCombine && recipe[1] === item) ||
          (recipe[0] === item && recipe[1] === existingBasicItemToCombine)
      )

      if (!recipe) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      }

      const itemCombined = recipe[0] as Item

      if (
        itemCombined in SynergyGivenByItem &&
        pokemon.types.has(SynergyGivenByItem[itemCombined])
      ) {
        // prevent combining into a synergy stone on a pokemon that already has this synergy
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      }

      pokemon.items.delete(existingBasicItemToCombine)
      removeInArray(player.items, item)

      if (pokemon.items.has(itemCombined)) {
        // pokemon already has the combined item so the second one pops off and go to player inventory
        player.items.push(itemCombined)
      } else {
        pokemon.items.add(itemCombined)
      }
    } else {
      pokemon.items.add(item)
      removeInArray(player.items, item)
    }

    this.room.checkEvolutionsAfterItemAcquired(playerId, pokemon)

    player.updateSynergies()
  }
}

export class OnSellDropCommand extends Command<
  GameRoom,
  {
    client: Client
    pokemonId: string
  }
> {
  execute({ client, pokemonId }) {
    const player = this.state.players.get(client.auth.uid)

    if (player) {
      const pokemon = player.board.get(pokemonId)
      if (
        pokemon &&
        !isOnBench(pokemon) &&
        this.state.phase === GamePhaseState.FIGHT
      ) {
        return // can't sell a pokemon currently fighting
      }

      if (
        pokemon &&
        canSell(pokemon.name, this.state.specialGameRule) === false
      ) {
        return
      }

      if (pokemon) {
        this.state.shop.releasePokemon(pokemon.name, player)
        player.money += getSellPrice(
          pokemon.name,
          pokemon.shiny,
          this.state.specialGameRule
        )
        pokemon.items.forEach((it) => {
          player.items.push(it)
        })

        player.board.delete(pokemonId)

        player.updateSynergies()
        player.boardSize = this.room.getTeamSize(player.board)
      }
    }
  }
}

export class OnRefreshCommand extends Command<
  GameRoom,
  {
    id: string
  }
> {
  execute(id) {
    const player = this.state.players.get(id)
    if (player && player.money >= 1 && player.alive) {
      this.state.shop.assignShop(player, true, this.state)
      player.money -= 1
      player.rerollCount++
    }
  }
}

export class OnLockCommand extends Command<
  GameRoom,
  {
    id: string
  }
> {
  execute(id) {
    const player = this.state.players.get(id)
    if (player) {
      player.shopLocked = !player.shopLocked
    }
  }
}

export class OnLevelUpCommand extends Command<
  GameRoom,
  {
    id: string
  }
> {
  execute(id) {
    const player = this.state.players.get(id)
    if (!player) return

    const cost = getLevelUpCost(this.state.specialGameRule)
    if (player.money >= cost && player.experienceManager.canLevel()) {
      player.experienceManager.addExperience(4)
      player.money -= cost
    }
  }
}

export class OnPickBerryCommand extends Command<
  GameRoom,
  {
    playerId: string
    berryIndex: number
  }
> {
  execute({ playerId, berryIndex }) {
    const player = this.state.players.get(playerId)
    if (player && player.berryTreesStage[berryIndex] >= 3) {
      player.berryTreesStage[berryIndex] = 0
      player.items.push(player.berryTreesType[berryIndex])
      player.berryTreesType[berryIndex] = pickRandomIn(Berries)
    }
  }
}

export class OnJoinCommand extends Command<
  GameRoom,
  {
    client: Client
    options: { spectate?: boolean }
    auth
  }
> {
  async execute({ client, options, auth }) {
    try {
      //logger.debug("onJoin", client.auth.uid)
      const players = values(this.state.players)
      if (options.spectate === true) {
        this.state.spectators.add(client.auth.uid)
      } else if (players.some((p) => p.id === auth.uid)) {
        /*logger.info(
          `${client.auth.displayName} (${client.id}) joined game room ${this.room.roomId}`
        )*/
        if (this.state.players.size >= MAX_PLAYERS_PER_GAME) {
          const humanPlayers = players.filter((p) => !p.isBot)
          if (humanPlayers.length === 1) {
            humanPlayers[0].titles.add(Title.LONE_WOLF)
          }
        }
      } else {
        logger.warn(`player not in this game players list tried to join game`, {
          userId: client.auth.uid,
          roomId: this.room.roomId
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnUpdateCommand extends Command<
  GameRoom,
  {
    deltaTime: number
  }
> {
  execute({ deltaTime }) {
    if (deltaTime) {
      this.state.time -= deltaTime
      if (Math.round(this.state.time / 1000) != this.state.roundTime) {
        this.state.roundTime = Math.round(this.state.time / 1000)
      }
      if (this.state.time < 0) {
        this.state.updatePhaseNeeded = true
      } else if (this.state.phase == GamePhaseState.FIGHT) {
        let everySimulationFinished = true

        this.state.simulations.forEach((simulation) => {
          if (!simulation.finished) {
            simulation.update(deltaTime)
            everySimulationFinished = false
          }
        })

        if (everySimulationFinished && !this.state.updatePhaseNeeded) {
          // wait for 3 seconds victory anim before moving to next stage
          this.state.time = 3000
          this.state.updatePhaseNeeded = true
        }
      } else if (this.state.phase === GamePhaseState.MINIGAME) {
        this.room.miniGame.update(deltaTime)
      }
      if (this.state.updatePhaseNeeded && this.state.time < 0) {
        return [new OnUpdatePhaseCommand()]
      }
    }
  }
}

export class OnUpdatePhaseCommand extends Command<GameRoom> {
  execute() {
    this.state.updatePhaseNeeded = false
    if (this.state.phase == GamePhaseState.MINIGAME) {
      this.room.miniGame.stop(this.room)
      this.initializePickingPhase()
    } else if (this.state.phase == GamePhaseState.PICK) {
      this.stopPickingPhase()
      this.checkForLazyTeam()
      this.initializeFightingPhase()
    } else if (this.state.phase == GamePhaseState.FIGHT) {
      this.stopFightingPhase()
      if (
        ItemCarouselStages.includes(this.state.stageLevel) ||
        PortalCarouselStages.includes(this.state.stageLevel)
      ) {
        this.initializeMinigamePhase()
      } else {
        this.initializePickingPhase()
      }
    }
  }

  computeAchievements() {
    this.state.players.forEach((player) => {
      this.checkSuccess(player)
    })
  }

  checkSuccess(player: Player) {
    player.titles.add(Title.NOVICE)
    const effects = this.state.simulations
      .get(player.simulationId)
      ?.getEffects(player.id)
    if (effects) {
      effects.forEach((effect) => {
        switch (effect) {
          case Effect.PURE_POWER:
            player.titles.add(Title.POKEFAN)
            break
          case Effect.SPORE:
            player.titles.add(Title.POKEMON_RANGER)
            break
          case Effect.DESOLATE_LAND:
            player.titles.add(Title.KINDLER)
            break
          case Effect.PRIMORDIAL_SEA:
            player.titles.add(Title.FIREFIGHTER)
            break
          case Effect.OVERDRIVE:
            player.titles.add(Title.ELECTRICIAN)
            break
          case Effect.JUSTIFIED:
            player.titles.add(Title.BLACK_BELT)
            break
          case Effect.EERIE_SPELL:
            player.titles.add(Title.TELEKINESIST)
            break
          case Effect.BEAT_UP:
            player.titles.add(Title.DELINQUENT)
            break
          case Effect.STEEL_SURGE:
            player.titles.add(Title.ENGINEER)
            break
          case Effect.DEEP_MINER:
            player.titles.add(Title.GEOLOGIST)
            break
          case Effect.TOXIC:
            player.titles.add(Title.TEAM_ROCKET_GRUNT)
            break
          case Effect.DRAGON_DANCE:
            player.titles.add(Title.DRAGON_TAMER)
            break
          case Effect.ANGER_POINT:
            player.titles.add(Title.CAMPER)
            break
          case Effect.POWER_TRIP:
            player.titles.add(Title.MYTH_TRAINER)
            break
          case Effect.CALM_MIND:
            player.titles.add(Title.RIVAL)
            break
          case Effect.WATER_VEIL:
            player.titles.add(Title.DIVER)
            break
          case Effect.HEART_OF_THE_SWARM:
            player.titles.add(Title.BUG_MANIAC)
            break
          case Effect.SKYDIVE:
            player.titles.add(Title.BIRD_KEEPER)
            break
          case Effect.SUN_FLOWER:
            player.titles.add(Title.GARDENER)
            break
          case Effect.GOOGLE_SPECS:
            player.titles.add(Title.ALCHEMIST)
            break
          case Effect.DIAMOND_STORM:
            player.titles.add(Title.HIKER)
            break
          case Effect.CURSE_OF_FATE:
            player.titles.add(Title.HEX_MANIAC)
            break
          case Effect.MOON_FORCE:
            player.titles.add(Title.CUTE_MANIAC)
            break
          case Effect.SHEER_COLD:
            player.titles.add(Title.SKIER)
            break
          case Effect.FORGOTTEN_POWER:
            player.titles.add(Title.MUSEUM_DIRECTOR)
            break
          case Effect.PRESTO:
            player.titles.add(Title.MUSICIAN)
            break
          case Effect.GOLDEN_EGGS:
            player.titles.add(Title.BABYSITTER)
            break
          case Effect.MAX_ILLUMINATION:
            player.titles.add(Title.CHOSEN_ONE)
            break
          default:
            break
        }
      })
      if (effects.size >= 5) {
        player.titles.add(Title.HARLEQUIN)
      }
      let shield = 0
      let heal = 0
      const dpsMeter = this.state.simulations
        .get(player.simulationId)
        ?.getHealDpsMeter(player.id)

      if (dpsMeter) {
        dpsMeter.forEach((v) => {
          shield += v.shield
          heal += v.heal
        })
      }

      if (shield > 1000) {
        player.titles.add(Title.GARDIAN)
      }
      if (heal > 1000) {
        player.titles.add(Title.NURSE)
      }

      if (this.state.stageLevel >= 40) {
        player.titles.add(Title.ETERNAL)
      }
    }
  }

  checkEndGame() {
    const playersAlive = values(this.state.players).filter((p) => p.alive)

    if (playersAlive.length <= 1) {
      this.state.gameFinished = true
      const winner = playersAlive[0]
      const client = this.room.clients.find((cli) => cli.auth.uid === winner.id)
      if (client) {
        client.send(Transfer.FINAL_RANK, 1)
      }
      setTimeout(() => {
        // dispose the room automatically after 30 seconds
        this.room.broadcast(Transfer.GAME_END)
        this.room.disconnect()
      }, 30 * 1000)
    }
  }

  computeStreak(isPVE: boolean) {
    if (isPVE) return // PVE rounds do not change the current streak
    this.state.players.forEach((player) => {
      if (!player.alive) {
        return
      }

      const [previousBattleResult, lastBattleResult] = player.history
        .filter(
          (stage) => stage.id !== "pve" && stage.result !== BattleResult.DRAW
        )
        .map((stage) => stage.result)
        .slice(-2)

      if (lastBattleResult === BattleResult.DRAW) {
        // preserve existing streak but lose HP
      } else if (lastBattleResult !== previousBattleResult) {
        // reset streak
        player.streak = 0
      } else {
        player.streak = max(5)(player.streak + 1)
      }
    })
  }

  computeIncome() {
    this.state.players.forEach((player) => {
      let income = 0
      if (player.alive && !player.isBot) {
        player.interest = Math.min(Math.floor(player.money / 10), 5)
        income += player.interest
        income += player.streak
        income += 5
        player.money += income
        if (income > 0) {
          const client = this.room.clients.find(
            (cli) => cli.auth.uid === player.id
          )
          client?.send(Transfer.PLAYER_INCOME, income)
        }
        player.experienceManager.addExperience(2)
      }
    })
  }

  checkDeath() {
    this.state.players.forEach((player: Player) => {
      if (player.life <= 0 && player.alive) {
        if (!player.isBot) {
          player.shop.forEach((pkm) => {
            this.state.shop.releasePokemon(pkm, player)
          })
          player.board.forEach((pokemon) => {
            this.state.shop.releasePokemon(pokemon.name, player)
          })
        }
        player.alive = false
        const client = this.room.clients.find(
          (cli) => cli.auth.uid === player.id
        )
        if (client) {
          client.send(Transfer.FINAL_RANK, player.rank)
        }
      }
    })
  }

  initializePickingPhase() {
    this.state.phase = GamePhaseState.PICK
    this.state.time =
      (StageDuration[this.state.stageLevel] ?? StageDuration.DEFAULT) * 1000

    // Item propositions stages
    if (ItemProposalStages.includes(this.state.stageLevel)) {
      this.state.players.forEach((player: Player) => {
        let itemSet = ItemComponents
        if (this.state.specialGameRule === SpecialGameRule.TECHNOLOGIC) {
          itemSet = ArtificialItems.filter(
            (item) => player.artificialItems.includes(item) === false
          )
        }
        resetArraySchema(player.itemsProposition, pickNRandomIn(itemSet, 3))
      })
    }

    // Additional pick stages
    if (AdditionalPicksStages.includes(this.state.stageLevel)) {
      const pool =
        this.state.stageLevel === AdditionalPicksStages[0]
          ? this.room.additionalUncommonPool
          : this.state.stageLevel === AdditionalPicksStages[1]
            ? this.room.additionalRarePool
            : this.room.additionalEpicPool
      let remainingAddPicks = 8
      this.state.players.forEach((player: Player) => {
        if (!player.isBot) {
          const items = pickNRandomIn(ItemComponents, 3)
          for (let i = 0; i < 3; i++) {
            const p = pool.pop()
            if (p) {
              player.pokemonsProposition.push(p)
              player.itemsProposition.push(items[i])
            }
          }
          remainingAddPicks--
        }
      })

      repeat(remainingAddPicks)(() => {
        const p = pool.pop()
        if (p) {
          this.state.additionalPokemons.push(p)
          this.state.shop.addAdditionalPokemon(p)
        }
      })
    }

    const isAfterPVE = this.state.stageLevel - 1 in PVEStages
    const commands = new Array<Command>()

    this.state.players.forEach((player: Player) => {
      if (
        getFreeSpaceOnBench(player.board) > 0 &&
        !isAfterPVE &&
        (player.effects.has(Effect.RAIN_DANCE) ||
          player.effects.has(Effect.DRIZZLE) ||
          player.effects.has(Effect.PRIMORDIAL_SEA))
      ) {
        const fishingLevel = player.effects.has(Effect.PRIMORDIAL_SEA)
          ? 3
          : player.effects.has(Effect.DRIZZLE)
            ? 2
            : 1
        const fish = this.state.shop.pickFish(player, fishingLevel)
        this.room.fishPokemon(player, fish)
      }

      if (player.items.includes(Item.SUPER_ROD)) {
        const finals = new Set(
          values(player.board)
            .filter((pokemon) => pokemon.final)
            .map((pokemon) => PkmFamily[pokemon.name])
        )

        const probas = RarityProbabilityPerLevel[player.experienceManager.level]
        const rarity_seed = Math.random()
        let i = 0,
          threshold = 0
        while (rarity_seed > threshold) {
          threshold += probas[i]
          i++
        }
        const rarity =
          [
            Rarity.COMMON,
            Rarity.UNCOMMON,
            Rarity.RARE,
            Rarity.EPIC,
            Rarity.ULTRA
          ][i - 1] ?? Rarity.COMMON

        let topSynergies: Synergy[] = []
        let maxSynergyCount = 0
        player.synergies.forEach((count, synergy) => {
          if (count > maxSynergyCount) {
            maxSynergyCount = count
            topSynergies = [synergy]
          } else if (count === maxSynergyCount) {
            topSynergies.push(synergy)
          }
        })

        const pkm = this.state.shop.getRandomPokemonFromPool(
          rarity,
          player,
          finals,
          pickRandomIn(topSynergies)
        )

        this.room.fishPokemon(player, pkm)
      }

      const grassLevel = player.synergies.get(Synergy.GRASS) ?? 0
      const nbTrees = SynergyTriggers[Synergy.GRASS].filter(
        (n) => n <= grassLevel
      ).length
      for (let i = 0; i < nbTrees; i++) {
        player.berryTreesStage[i] = max(3)(player.berryTreesStage[i] + 1)
      }
    })

    this.spawnWanderingPokemons()

    return commands
  }

  checkForLazyTeam() {
    // force move on board some units if room available
    this.state.players.forEach((player, key) => {
      const teamSize = this.room.getTeamSize(player.board)
      const maxTeamSize = getMaxTeamSize(
        player.experienceManager.level,
        this.state.specialGameRule
      )
      if (teamSize < maxTeamSize) {
        const numberOfPokemonsToMove = maxTeamSize - teamSize
        for (let i = 0; i < numberOfPokemonsToMove; i++) {
          const pokemon = values(player.board).find(
            (p) => isOnBench(p) && p.canBePlaced
          )
          const coordinate = getFirstAvailablePositionOnBoard(player.board)
          if (coordinate && pokemon) {
            this.room.swap(player, pokemon, coordinate[0], coordinate[1])
          }
        }
        if (numberOfPokemonsToMove > 0) {
          player.updateSynergies()
        }
      }
    })
  }

  stopPickingPhase() {
    this.state.players.forEach((player) => {
      if (player.pokemonsProposition.length > 0) {
        // auto pick if not chosen
        this.room.pickPokemonProposition(
          player.id,
          pickRandomIn([...player.pokemonsProposition]),
          true
        )
        player.pokemonsProposition.clear()
      } else if (player.itemsProposition.length > 0) {
        // auto pick if not chosen
        this.room.pickItemProposition(
          player.id,
          pickRandomIn([...player.itemsProposition])
        )
        player.itemsProposition.clear()
      }
    })
  }

  stopFightingPhase() {
    const isPVE = this.state.stageLevel in PVEStages

    this.state.simulations.forEach((simulation) => {
      if (!simulation.finished) {
        simulation.onFinish()
      }
      simulation.stop()
    })

    this.computeAchievements()
    this.computeStreak(isPVE)
    this.checkDeath()
    this.computeIncome()

    this.state.players.forEach((player: Player) => {
      if (player.alive) {
        if (player.isBot) {
          player.experienceManager.level = max(9)(
            Math.round(this.state.stageLevel / 2)
          )
        }

        if (isPVE && player.getLastBattleResult() === BattleResult.WIN) {
          while (player.pveRewards.length > 0) {
            const reward = player.pveRewards.pop()!
            player.items.push(reward)
          }

          if (player.pveRewardsPropositions.length > 0) {
            resetArraySchema(
              player.itemsProposition,
              player.pveRewardsPropositions
            )
            player.pveRewardsPropositions.clear()
          }
        }

        let eggChance = 0,
          nbMaxEggs = 0
        if (
          player.getLastBattleResult() == BattleResult.DEFEAT &&
          (player.effects.has(Effect.BREEDER) ||
            player.effects.has(Effect.GOLDEN_EGGS))
        ) {
          eggChance = 1
          nbMaxEggs = 8
        }
        if (
          player.getLastBattleResult() == BattleResult.DEFEAT &&
          player.effects.has(Effect.HATCHER)
        ) {
          eggChance = 0.25 * player.streak
          nbMaxEggs = 1
        }

        if (
          this.state.specialGameRule === SpecialGameRule.OMELETTE_COOK &&
          [1, 2, 3].includes(this.state.stageLevel)
        ) {
          eggChance = 1
          nbMaxEggs = 8
        }

        const nbOfEggs = values(player.board).filter(
          (p) => p.name === Pkm.EGG
        ).length

        if (
          chance(eggChance) &&
          getFreeSpaceOnBench(player.board) > 0 &&
          nbOfEggs < nbMaxEggs
        ) {
          const eggShiny = player.effects.has(Effect.GOLDEN_EGGS)
          const egg = createRandomEgg(eggShiny)
          const x = getFirstAvailablePositionInBench(player.board)
          egg.positionX = x !== undefined ? x : -1
          egg.positionY = 0
          player.board.set(egg.id, egg)
        }

        if (!player.isBot) {
          if (!player.shopLocked) {
            this.state.shop.assignShop(player, false, this.state)
          } else {
            this.state.shop.refillShop(player, this.state)
            player.shopLocked = false
          }
        }

        player.board.forEach((pokemon, key) => {
          if (pokemon.evolutionRule) {
            if (pokemon.evolutionRule instanceof HatchEvolutionRule) {
              pokemon.evolutionRule.updateHatch(
                pokemon,
                player,
                this.state.stageLevel
              )
            }
            if (pokemon.evolutionRule instanceof ConditionBasedEvolutionRule) {
              pokemon.evolutionRule.tryEvolve(
                pokemon,
                player,
                this.state.stageLevel
              )
            }
          }
          if (pokemon.passive === Passive.UNOWN && !isOnBench(pokemon)) {
            // remove after one fight
            player.board.delete(key)
            player.board.delete(pokemon.id)
            player.updateSynergies()
            if (!player.shopLocked) {
              this.state.shop.assignShop(player, false, this.state) // refresh unown shop in case player lost psychic 6
            }
          }
        })
        // Refreshes effects (like tapu Terrains)
        player.updateSynergies()
      }
    })

    this.state.stageLevel += 1
    this.checkEndGame()
  }

  initializeMinigamePhase() {
    this.state.phase = GamePhaseState.MINIGAME
    const nbPlayersAlive = values(this.state.players).filter(
      (p) => p.alive
    ).length

    let minigamePhaseDuration = ITEM_CAROUSEL_BASE_DURATION
    if (PortalCarouselStages.includes(this.state.stageLevel)) {
      minigamePhaseDuration = PORTAL_CAROUSEL_BASE_DURATION
    } else if (this.state.stageLevel !== ItemCarouselStages[0]) {
      minigamePhaseDuration += nbPlayersAlive * 2000
    }
    this.state.time = minigamePhaseDuration
    this.room.miniGame.initialize(this.state, this.room)
  }

  initializeFightingPhase() {
    this.state.simulations.clear()
    this.state.phase = GamePhaseState.FIGHT
    this.state.time = FIGHTING_PHASE_DURATION
    this.room.setMetadata({ stageLevel: this.state.stageLevel })
    updateLobby(this.room)
    this.state.botManager.updateBots()

    const pveStage = PVEStages[this.state.stageLevel]

    if (pveStage) {
      this.state.shinyEncounter = chance(pveStage.shinyChance ?? 0)
      this.state.players.forEach((player: Player) => {
        if (player.alive) {
          player.opponentId = "pve"
          player.opponentName = pveStage.name
          player.opponentAvatar = getAvatarString(
            PkmIndex[pveStage.avatar],
            this.state.shinyEncounter,
            pveStage.emotion
          )
          player.opponentTitle = "WILD"

          const rewards = pveStage.getRewards?.(player) ?? ([] as Item[])
          resetArraySchema(player.pveRewards, rewards)

          const rewardsPropositions = this.state.shinyEncounter
            ? pickNRandomIn(ShinyItems, 3)
            : pveStage.getRewardsPropositions?.(player) ?? ([] as Item[])

          resetArraySchema(player.pveRewardsPropositions, rewardsPropositions)

          const pveBoard = PokemonFactory.makePveBoard(
            pveStage,
            this.state.shinyEncounter
          )
          const weather = getWeather(player.board, pveBoard)
          const simulation = new Simulation(
            nanoid(),
            this.room,
            player.board,
            pveBoard,
            player,
            undefined,
            this.state.stageLevel,
            weather
          )
          player.simulationId = simulation.id
          player.simulationTeamIndex = 0
          this.state.simulations.set(simulation.id, simulation)
        }
      })
    } else {
      const matchups = selectMatchups(this.state)

      matchups.forEach((matchup) => {
        const playerA = matchup.a,
          playerB = matchup.b
        const weather = getWeather(playerA.board, playerB.board)
        const simulationId = nanoid()
        const simulation = new Simulation(
          simulationId,
          this.room,
          playerA.board,
          playerB.board,
          playerA,
          playerB,
          this.state.stageLevel,
          weather
        )
        playerA.simulationId = simulationId
        playerA.simulationTeamIndex = 0
        playerA.opponents.set(
          playerB.id,
          (playerA.opponents.get(playerB.id) ?? 0) + 1
        )
        playerA.opponentId = playerB.id
        playerA.opponentName = playerB.name
        playerA.opponentAvatar = playerB.avatar
        playerA.opponentTitle = playerB.title ?? ""

        if (!matchup.ghost) {
          playerB.simulationId = simulationId
          playerB.simulationTeamIndex = 1
          playerB.opponents.set(
            playerA.id,
            (playerB.opponents.get(playerA.id) ?? 0) + 1
          )
          playerB.opponentId = playerA.id
          playerB.opponentName = playerA.name
          playerB.opponentAvatar = playerA.avatar
          playerB.opponentTitle = playerA.title ?? ""
        }

        this.state.simulations.set(simulation.id, simulation)
      })
    }
  }

  spawnWanderingPokemons() {
    const isPVE = this.state.stageLevel in PVEStages

    this.state.players.forEach((player: Player) => {
      if (player.alive && !player.isBot) {
        const client = this.room.clients.find(
          (cli) => cli.auth.uid === player.id
        )
        if (!client) return

        const UNOWN_ENCOUNTER_CHANCE = 0.037
        if (chance(UNOWN_ENCOUNTER_CHANCE)) {
          setTimeout(
            () => {
              client.send(Transfer.UNOWN_WANDERING)
            },
            Math.round((5 + 15 * Math.random()) * 1000)
          )
        }

        if (
          isPVE &&
          this.state.specialGameRule === SpecialGameRule.GOTTA_CATCH_EM_ALL
        ) {
          const nbPokemonsToSpawn = Math.ceil(this.state.stageLevel / 2)
          for (let i = 0; i < nbPokemonsToSpawn; i++) {
            setTimeout(
              () => {
                client.send(
                  Transfer.POKEMON_WANDERING,
                  this.state.shop.pickPokemon(player, this.state)
                )
              },
              4000 + i * 400
            )
          }
        }
      }
    })
  }
}
