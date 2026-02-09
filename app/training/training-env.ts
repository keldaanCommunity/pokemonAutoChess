/**
 * TrainingEnv: A Gym-like environment for PPO training.
 *
 * Drives the game synchronously in step mode:
 * - PICK phase: RL agent takes micro-actions (buy/sell/reroll/level/end_turn)
 * - FIGHT phase: runs simulation synchronously until done
 * - TOWN phase: auto-skipped
 *
 * Games complete in milliseconds instead of minutes.
 */
import { MapSchema } from "@colyseus/schema"
import { nanoid } from "nanoid"
import {
  AdditionalPicksStages,
  FIGHTING_PHASE_DURATION,
  ItemCarouselStages,
  PortalCarouselStages,
  StageDuration
} from "../config"
import { selectMatchups } from "../core/matchmaking"
import Simulation from "../core/simulation"
import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../models/precomputed/precomputed-rarity"
import { getBuyPrice, getAdditionalsTier1, getSellPrice } from "../models/shop"
import GameState from "../rooms/states/game-state"
import { Role, Transfer } from "../types"
import {
  BattleResult,
  GameMode,
  GamePhaseState,
  Rarity,
  Team
} from "../types/enum/Game"
import {
  CraftableItemsNoScarves,
  Item,
  ItemComponentsNoFossilOrScarf,
  ItemComponentsNoScarf
} from "../types/enum/Item"
import { Pkm, PkmDuos, PkmIndex } from "../types/enum/Pokemon"
import { SpecialGameRule } from "../types/enum/SpecialGameRule"
import { Synergy, SynergyArray } from "../types/enum/Synergy"
import { Weather } from "../types/enum/Weather"
import { getAvatarString } from "../utils/avatar"
import {
  getFirstAvailablePositionInBench,
  getFirstAvailablePositionOnBoard,
  getFreeSpaceOnBench,
  isOnBench
} from "../utils/board"
import { max } from "../utils/number"
import { pickNRandomIn, pickRandomIn, shuffleArray } from "../utils/random"
import { values } from "../utils/schemas"
import { HeadlessRoom } from "./headless-room"
import {
  MAX_PROPOSITIONS,
  OBS_PROPOSITION_FEATURES,
  OBS_PROPOSITION_SLOTS,
  REWARD_PER_DRAW,
  REWARD_PER_KILL,
  REWARD_PER_LOSS,
  REWARD_PER_WIN,
  REWARD_PLACEMENT_OFFSET,
  REWARD_PLACEMENT_SCALE,
  TOTAL_ACTIONS,
  TOTAL_OBS_SIZE,
  TRAINING_MAX_ACTIONS_PER_TURN,
  TRAINING_MAX_FIGHT_STEPS,
  TRAINING_NUM_OPPONENTS,
  TRAINING_SIMULATION_DT,
  TrainingAction
} from "./training-config"
import { BotV2, IBot } from "../models/mongo-models/bot-v2"
import { CountEvolutionRule } from "../core/evolution-rules"
import { getMaxTeamSize } from "../utils/board"
import { PVEStages } from "../models/pve-stages"
import { getWeather } from "../utils/weather"

export interface StepResult {
  observation: number[]
  reward: number
  done: boolean
  info: {
    stage: number
    phase: string
    rank: number
    life: number
    money: number
    actionsThisTurn: number
    actionMask: number[]
  }
}

export class TrainingEnv {
  state!: GameState
  room!: HeadlessRoom
  agentId!: string
  actionsThisTurn = 0
  totalSteps = 0
  lastBattleResult: BattleResult | null = null
  cachedBots: IBot[] = []
  additionalUncommonPool: Pkm[] = []
  additionalRarePool: Pkm[] = []
  additionalEpicPool: Pkm[] = []

  async initialize() {
    // Pre-fetch bots from DB so we don't need to query every reset
    if (this.cachedBots.length === 0) {
      const bots = await BotV2.find({ approved: true }).lean()
      if (bots.length > 0) {
        this.cachedBots = bots as IBot[]
      }
    }
  }

  reset(): StepResult {
    // Create fresh game state
    this.state = new GameState(
      nanoid(),
      "training",
      true, // noElo
      GameMode.CUSTOM_LOBBY,
      null,
      null,
      null
    )

    this.room = new HeadlessRoom(this.state)

    // Initialize additional pick pools (same as GameRoom.onCreate)
    this.additionalUncommonPool = getAdditionalsTier1(
      PRECOMPUTED_POKEMONS_PER_RARITY.UNCOMMON
    )
    this.additionalRarePool = getAdditionalsTier1(
      PRECOMPUTED_POKEMONS_PER_RARITY.RARE
    )
    this.additionalEpicPool = getAdditionalsTier1(
      PRECOMPUTED_POKEMONS_PER_RARITY.EPIC
    )
    shuffleArray(this.additionalUncommonPool)
    shuffleArray(this.additionalRarePool)
    shuffleArray(this.additionalEpicPool)

    // Create RL agent player
    this.agentId = "rl-agent-" + nanoid(6)
    const agentPlayer = new Player(
      this.agentId,
      "RL-Agent",
      1000, // elo
      0, // games
      getAvatarString(PkmIndex[Pkm.PIKACHU], false),
      false, // isBot
      1, // rank
      new Map(),
      "",
      Role.BASIC,
      this.state
    )
    this.state.players.set(this.agentId, agentPlayer)

    // Create bot opponents
    this.createBotPlayers()

    // Initialize shop for agent
    this.state.shop.assignShop(agentPlayer, false, this.state)

    // Start the game
    this.state.gameLoaded = true
    this.state.stageLevel = 0

    // Stage 0: Portal carousel gives starter pokemon propositions
    // Agent gets propositions to choose from; bots auto-pick
    this.state.players.forEach((player) => {
      if (!player.isBot) {
        this.state.shop.assignUniquePropositions(player, this.state, [])
      }
    })
    // Auto-pick for bots only; agent propositions stay pending
    this.autoPickPropositionsForBots()

    // Stay at stage 0 with propositions — agent picks via PICK_PROPOSITION action
    this.state.phase = GamePhaseState.PICK
    this.state.time =
      (StageDuration[this.state.stageLevel] ?? StageDuration.DEFAULT) * 1000

    this.actionsThisTurn = 0
    this.totalSteps = 0
    this.lastBattleResult = null

    return {
      observation: this.getObservation(),
      reward: 0,
      done: false,
      info: this.getInfo()
    }
  }

  step(action: number): StepResult {
    if (this.state.gameFinished) {
      return {
        observation: this.getObservation(),
        reward: 0,
        done: true,
        info: this.getInfo()
      }
    }

    this.totalSteps++
    let reward = 0

    const agent = this.state.players.get(this.agentId)
    if (!agent || !agent.alive) {
      return {
        observation: this.getObservation(),
        reward: REWARD_PER_KILL,
        done: true,
        info: this.getInfo()
      }
    }

    if (this.state.phase === GamePhaseState.PICK) {
      // Execute the agent's action
      const actionExecuted = this.executeAction(action, agent)
      this.actionsThisTurn++

      // If agent just picked a proposition, check if we need to advance from stage 0
      if (
        actionExecuted &&
        action >= TrainingAction.PICK_PROPOSITION_0 &&
        action <= TrainingAction.PICK_PROPOSITION_5
      ) {
        // After picking, if still at stage 0, advance to stage 1
        if (this.state.stageLevel === 0) {
          this.state.stageLevel = 1
          this.state.botManager.updateBots()
          this.state.shop.assignShop(agent, false, this.state)
          this.actionsThisTurn = 0
        }
        // If at a later stage with propositions (uniques, additionals), just continue the turn
        // The propositions have been cleared so normal PICK actions resume
        return {
          observation: this.getObservation(),
          reward,
          done: false,
          info: this.getInfo()
        }
      }

      // Check if turn should end
      const shouldEndTurn =
        action === TrainingAction.END_TURN ||
        this.actionsThisTurn >= TRAINING_MAX_ACTIONS_PER_TURN

      if (shouldEndTurn) {
        // Safety: if propositions are still pending at turn end, auto-pick randomly
        if (agent.pokemonsProposition.length > 0) {
          this.autoPickForAgent(agent)
        }

        // Auto-place pokemon on board if there's room
        this.autoPlaceTeam(agent)

        // Run the fight phase synchronously
        reward += this.runFightPhase()

        // Check game end
        if (this.state.gameFinished || !agent.alive) {
          const finalReward = this.computeFinalReward(agent)
          return {
            observation: this.getObservation(),
            reward: reward + finalReward,
            done: true,
            info: this.getInfo()
          }
        }

        // Advance to next PICK phase
        this.advanceToNextPickPhase()
        this.actionsThisTurn = 0
      }
    }

    return {
      observation: this.getObservation(),
      reward,
      done: false,
      info: this.getInfo()
    }
  }

  private executeAction(action: number, agent: Player): boolean {
    // If agent has propositions pending, only allow PICK_PROPOSITION actions
    if (agent.pokemonsProposition.length > 0) {
      if (
        action >= TrainingAction.PICK_PROPOSITION_0 &&
        action <= TrainingAction.PICK_PROPOSITION_5
      ) {
        const propositionIndex =
          action - TrainingAction.PICK_PROPOSITION_0
        return this.pickProposition(agent, propositionIndex)
      }
      return false // no other actions allowed during proposition phase
    }

    switch (action) {
      case TrainingAction.END_TURN:
        return true

      case TrainingAction.BUY_0:
      case TrainingAction.BUY_1:
      case TrainingAction.BUY_2:
      case TrainingAction.BUY_3:
      case TrainingAction.BUY_4: {
        const shopIndex = action - TrainingAction.BUY_0
        return this.buyPokemon(agent, shopIndex)
      }

      case TrainingAction.SELL_0:
      case TrainingAction.SELL_1:
      case TrainingAction.SELL_2:
      case TrainingAction.SELL_3:
      case TrainingAction.SELL_4:
      case TrainingAction.SELL_5:
      case TrainingAction.SELL_6:
      case TrainingAction.SELL_7: {
        const benchIndex = action - TrainingAction.SELL_0
        return this.sellPokemonAtBench(agent, benchIndex)
      }

      case TrainingAction.REROLL:
        return this.rerollShop(agent)

      case TrainingAction.LEVEL_UP:
        return this.levelUp(agent)

      case TrainingAction.PICK_PROPOSITION_0:
      case TrainingAction.PICK_PROPOSITION_1:
      case TrainingAction.PICK_PROPOSITION_2:
      case TrainingAction.PICK_PROPOSITION_3:
      case TrainingAction.PICK_PROPOSITION_4:
      case TrainingAction.PICK_PROPOSITION_5: {
        const propositionIndex =
          action - TrainingAction.PICK_PROPOSITION_0
        return this.pickProposition(agent, propositionIndex)
      }

      default:
        return false
    }
  }

  /**
   * Pick a pokemon proposition for the agent.
   * Replicates the logic from GameRoom.pickPokemonProposition().
   */
  private pickProposition(player: Player, propositionIndex: number): boolean {
    if (player.pokemonsProposition.length === 0) return false
    if (propositionIndex >= player.pokemonsProposition.length) return false

    const pkm = player.pokemonsProposition[propositionIndex] as Pkm
    if (!pkm) return false

    // Handle duos (e.g., Latios/Latias)
    const pokemonsObtained: Pokemon[] = (
      pkm in PkmDuos ? PkmDuos[pkm as keyof typeof PkmDuos] : [pkm]
    ).map((p) => PokemonFactory.createPokemonFromName(p as Pkm, player))

    const pokemon = pokemonsObtained[0]
    const isEvolution =
      pokemon.evolutionRule &&
      pokemon.evolutionRule instanceof CountEvolutionRule &&
      pokemon.evolutionRule.canEvolveIfGettingOne(pokemon, player)

    const freeSpace = getFreeSpaceOnBench(player.board)
    if (freeSpace < pokemonsObtained.length && !isEvolution) return false

    const selectedIndex = propositionIndex
    player.pokemonsProposition.clear()

    // Add to additional pool for additional pick stages
    if (AdditionalPicksStages.includes(this.state.stageLevel)) {
      this.state.shop.addAdditionalPokemon(pkm, this.state)
    }

    // Give corresponding item (starters and additional picks)
    if (
      AdditionalPicksStages.includes(this.state.stageLevel) ||
      this.state.stageLevel <= 1
    ) {
      if (player.itemsProposition.length > 0) {
        const selectedItem = player.itemsProposition[selectedIndex]
        if (selectedItem != null) {
          player.items.push(selectedItem)
        }
        player.itemsProposition.clear()
      }
    }

    // Track first partner for stage 0
    if (this.state.stageLevel <= 1) {
      player.firstPartner = pokemonsObtained[0].name
    }

    // Place all obtained pokemon on bench
    pokemonsObtained.forEach((pkmn) => {
      const freeCellX = getFirstAvailablePositionInBench(player.board)
      if (isEvolution) {
        pkmn.positionX = freeCellX ?? -1
        pkmn.positionY = 0
        player.board.set(pkmn.id, pkmn)
        pkmn.onAcquired(player)
        this.room.checkEvolutionsAfterPokemonAcquired(player.id)
      } else if (freeCellX !== null) {
        pkmn.positionX = freeCellX
        pkmn.positionY = 0
        player.board.set(pkmn.id, pkmn)
        pkmn.onAcquired(player)
      } else {
        // No space — sell for money
        const sellPrice = getSellPrice(pkmn, this.state.specialGameRule)
        player.addMoney(sellPrice, true, null)
      }
    })

    return true
  }

  private buyPokemon(player: Player, shopIndex: number): boolean {
    const name = player.shop[shopIndex]
    if (!name || name === Pkm.DEFAULT) return false

    const pokemon = PokemonFactory.createPokemonFromName(name, player)
    const isEvolution =
      pokemon.evolutionRule &&
      pokemon.evolutionRule instanceof CountEvolutionRule &&
      pokemon.evolutionRule.canEvolveIfGettingOne(pokemon, player)

    const cost = getBuyPrice(name, this.state.specialGameRule)
    const freeSpace = getFreeSpaceOnBench(player.board)
    const hasSpace = freeSpace > 0 || isEvolution

    if (player.money < cost || !hasSpace) return false

    player.money -= cost
    const x = getFirstAvailablePositionInBench(player.board)
    pokemon.positionX = x !== null ? x : -1
    pokemon.positionY = 0
    player.board.set(pokemon.id, pokemon)
    pokemon.onAcquired(player)
    player.shop[shopIndex] = Pkm.DEFAULT

    this.room.checkEvolutionsAfterPokemonAcquired(this.agentId)
    return true
  }

  private sellPokemonAtBench(player: Player, benchIndex: number): boolean {
    // Find pokemon at bench position benchIndex
    let targetPokemon: Pokemon | null = null
    let targetId: string | null = null

    player.board.forEach((pokemon, key) => {
      if (pokemon.positionY === 0 && pokemon.positionX === benchIndex) {
        targetPokemon = pokemon
        targetId = key
      }
    })

    if (!targetPokemon || !targetId) return false

    player.board.delete(targetId)
    this.state.shop.releasePokemon(
      (targetPokemon as Pokemon).name,
      player,
      this.state
    )

    const sellPrice = getSellPrice(targetPokemon, this.state.specialGameRule)
    player.addMoney(sellPrice, false, null)
    ;(targetPokemon as Pokemon).items.forEach((it: Item) => {
      player.items.push(it)
    })

    player.updateSynergies()
    player.boardSize = this.room.getTeamSize(player.board)
    return true
  }

  private rerollShop(player: Player): boolean {
    const rollCost = player.shopFreeRolls > 0 ? 0 : 1
    if (player.money < rollCost) return false

    player.rerollCount++
    player.money -= rollCost
    if (player.shopFreeRolls > 0) {
      player.shopFreeRolls--
    }
    this.state.shop.assignShop(player, true, this.state)
    return true
  }

  private levelUp(player: Player): boolean {
    const cost = 4 // standard level up cost
    if (player.money < cost || !player.experienceManager.canLevelUp())
      return false

    player.addExperience(4)
    player.money -= cost
    return true
  }

  private autoPlaceTeam(player: Player): void {
    const teamSize = this.room.getTeamSize(player.board)
    const maxTeamSize = getMaxTeamSize(
      player.experienceManager.level,
      this.state.specialGameRule
    )

    if (teamSize < maxTeamSize) {
      const numToPlace = maxTeamSize - teamSize
      for (let i = 0; i < numToPlace; i++) {
        const pokemon = values(player.board)
          .filter((p) => isOnBench(p) && p.canBePlaced)
          .sort((a, b) => a.positionX - b.positionX)[0]

        if (pokemon) {
          const coords = getFirstAvailablePositionOnBoard(
            player.board,
            pokemon.types.has(Synergy.DARK) && pokemon.range === 1
              ? 3
              : pokemon.range
          )
          if (coords) {
            pokemon.positionX = coords[0]
            pokemon.positionY = coords[1]
            pokemon.onChangePosition(
              coords[0],
              coords[1],
              player,
              this.state
            )
          }
        }
      }
      player.updateSynergies()
      player.boardSize = this.room.getTeamSize(player.board)
    }
  }

  /**
   * Runs the fight phase synchronously:
   * 1. Creates matchups
   * 2. Creates simulations
   * 3. Loops simulation.update(dt) until all finish
   * 4. Processes results
   * Returns reward from the fight
   */
  private runFightPhase(): number {
    this.state.phase = GamePhaseState.FIGHT
    this.state.time = FIGHTING_PHASE_DURATION
    this.state.simulations.clear()

    // Register played pokemons
    this.state.players.forEach((player) => {
      if (player.alive) player.registerPlayedPokemons()
    })

    const isPVE = this.state.stageLevel in PVEStages
    let reward = 0

    if (isPVE) {
      // PVE battle
      const pveStage = PVEStages[this.state.stageLevel]
      if (pveStage) {
        this.state.players.forEach((player) => {
          if (!player.alive) return
          player.opponentId = "pve"
          player.opponentName = pveStage.name
          player.opponentAvatar = getAvatarString(
            PkmIndex[pveStage.avatar],
            false,
            pveStage.emotion
          )
          player.opponentTitle = "WILD"
          player.team = Team.BLUE_TEAM

          const pveBoard = PokemonFactory.makePveBoard(
            pveStage,
            false,
            this.state.townEncounter
          )
          const weather = getWeather(player, null, pveBoard)
          const simulation = new Simulation(
            nanoid(),
            this.room as any,
            player.board,
            pveBoard,
            player,
            undefined,
            this.state.stageLevel,
            weather
          )
          player.simulationId = simulation.id
          this.state.simulations.set(simulation.id, simulation)
          simulation.start()
        })
      }
    } else {
      // PVP battles
      const matchups = selectMatchups(this.state)
      matchups.forEach((matchup) => {
        const { bluePlayer, redPlayer, ghost } = matchup
        const weather = getWeather(
          bluePlayer,
          redPlayer,
          redPlayer.board,
          ghost
        )
        const simulationId = nanoid()

        bluePlayer.simulationId = simulationId
        bluePlayer.team = Team.BLUE_TEAM
        bluePlayer.opponents.set(
          redPlayer.id,
          (bluePlayer.opponents.get(redPlayer.id) ?? 0) + 1
        )
        bluePlayer.opponentId = redPlayer.id
        bluePlayer.opponentName = ghost
          ? `Ghost of ${redPlayer.name}`
          : redPlayer.name
        bluePlayer.opponentAvatar = redPlayer.avatar
        bluePlayer.opponentTitle = redPlayer.title ?? ""

        if (!ghost) {
          redPlayer.simulationId = simulationId
          redPlayer.team = Team.RED_TEAM
          redPlayer.opponents.set(
            bluePlayer.id,
            (redPlayer.opponents.get(bluePlayer.id) ?? 0) + 1
          )
          redPlayer.opponentId = bluePlayer.id
          redPlayer.opponentName = bluePlayer.name
          redPlayer.opponentAvatar = bluePlayer.avatar
          redPlayer.opponentTitle = bluePlayer.title ?? ""
        }

        const simulation = new Simulation(
          simulationId,
          this.room as any,
          bluePlayer.board,
          redPlayer.board,
          bluePlayer,
          redPlayer,
          this.state.stageLevel,
          weather,
          ghost
        )
        this.state.simulations.set(simulation.id, simulation)
        simulation.start()
      })
    }

    // Run all simulations synchronously
    let steps = 0
    let allFinished = false
    while (!allFinished && steps < TRAINING_MAX_FIGHT_STEPS) {
      allFinished = true
      this.state.simulations.forEach((simulation) => {
        if (!simulation.finished) {
          simulation.update(TRAINING_SIMULATION_DT)
          allFinished = false
        }
      })
      steps++
    }

    // Force-finish any remaining simulations
    this.state.simulations.forEach((simulation) => {
      if (!simulation.finished) {
        simulation.onFinish()
      }
      simulation.stop()
    })

    // Compute streak
    if (!isPVE) {
      this.state.players.forEach((player) => {
        if (!player.alive) return
        const [prev, last] = player.history
          .filter(
            (s) => s.id !== "pve" && s.result !== BattleResult.DRAW
          )
          .map((s) => s.result)
          .slice(-2)
        if (last === BattleResult.DRAW) {
          // preserve streak
        } else if (last !== prev) {
          player.streak = 0
        } else {
          player.streak += 1
        }
      })
    }

    // Check death
    this.state.players.forEach((player) => {
      if (player.life <= 0 && player.alive) {
        player.alive = false
        player.spectatedPlayerId = player.id
      }
    })

    // Check end game
    const playersAlive = values(this.state.players).filter((p) => p.alive)
    if (playersAlive.length <= 1) {
      this.state.gameFinished = true
    }

    // Get agent battle result for reward
    const agent = this.state.players.get(this.agentId)
    if (agent) {
      const lastHistory = agent.history.at(-1)
      if (lastHistory) {
        this.lastBattleResult = lastHistory.result as BattleResult
        if (this.lastBattleResult === BattleResult.WIN) {
          reward += REWARD_PER_WIN
        } else if (this.lastBattleResult === BattleResult.DEFEAT) {
          reward += REWARD_PER_LOSS
        } else {
          reward += REWARD_PER_DRAW
        }
      }
    }

    if (!this.state.gameFinished) {
      this.state.stageLevel += 1

      // Compute income
      this.state.players.forEach((player) => {
        if (!player.alive) return
        let income = 0
        player.interest = max(player.maxInterest)(
          Math.floor(player.money / 10)
        )
        income += player.interest
        if (!isPVE) income += max(5)(player.streak)
        income += 5
        player.addMoney(income, true, null)
        player.addExperience(2)
      })

      // Update bot levels
      this.state.players.forEach((player) => {
        if (player.isBot && player.alive) {
          player.experienceManager.level = max(9)(
            Math.round(this.state.stageLevel / 2)
          )
        }
      })

      // Update bots
      this.state.botManager.updateBots()
    }

    // Rank players
    this.room.rankPlayers()

    return reward
  }

  /**
   * After fight, advance to the next PICK phase.
   * Handles all skipped TOWN-phase events:
   *   - Portal carousel stages (0, 10, 20): unique/legendary pokemon propositions
   *   - Item carousel stages (4, 12, 17, 22, 27, 34): random item components
   *   - Additional pick stages (5, 8, 11): uncommon/rare/epic pokemon propositions
   */
  private advanceToNextPickPhase(): void {
    // Handle portal carousel stages (10 = uniques, 20 = legendaries)
    // Stage 0 is handled in reset() separately
    if (
      PortalCarouselStages.includes(this.state.stageLevel) &&
      this.state.stageLevel > 0
    ) {
      // Agent gets propositions to choose from via PICK_PROPOSITION actions
      this.state.players.forEach((player) => {
        if (!player.isBot) {
          this.state.shop.assignUniquePropositions(player, this.state, [])
        }
      })
      // Only auto-pick for bots; agent propositions stay pending
      this.autoPickPropositionsForBots()
    }

    // Handle item carousel stages — give each alive player a random item
    if (ItemCarouselStages.includes(this.state.stageLevel)) {
      this.state.players.forEach((player) => {
        if (!player.isBot && player.alive) {
          const itemPool =
            this.state.stageLevel >= 20
              ? CraftableItemsNoScarves
              : ItemComponentsNoFossilOrScarf
          player.items.push(pickRandomIn(itemPool))
        }
      })
    }

    // Refresh shop for agent (only if no pending propositions)
    const agent = this.state.players.get(this.agentId)
    if (agent && agent.alive && agent.pokemonsProposition.length === 0) {
      if (!agent.shopLocked) {
        this.state.shop.assignShop(agent, false, this.state)
        agent.shopLocked = false
      }
    }

    // Set up PICK phase
    this.state.phase = GamePhaseState.PICK
    this.state.time =
      (StageDuration[this.state.stageLevel] ?? StageDuration.DEFAULT) * 1000

    // Populate additional pick propositions at stages 5, 8, 11
    if (AdditionalPicksStages.includes(this.state.stageLevel)) {
      const pool =
        this.state.stageLevel === AdditionalPicksStages[0]
          ? this.additionalUncommonPool
          : this.state.stageLevel === AdditionalPicksStages[1]
            ? this.additionalRarePool
            : this.additionalEpicPool

      // Agent gets propositions to choose from
      this.state.players.forEach((player) => {
        if (!player.isBot) {
          const items = pickNRandomIn(ItemComponentsNoScarf, 3)
          for (let i = 0; i < 3; i++) {
            const p = pool.pop()
            if (p) {
              player.pokemonsProposition.push(p)
              player.itemsProposition.push(items[i])
            }
          }
        }
      })

      // Remaining picks go into shared pool
      const remainingPicks = 8 - values(this.state.players).filter(
        (p) => !p.isBot
      ).length
      for (let i = 0; i < remainingPicks; i++) {
        const p = pool.pop()
        if (p) {
          this.state.shop.addAdditionalPokemon(p, this.state)
        }
      }
    }

    // Auto-pick for bots only; agent propositions stay pending for PICK_PROPOSITION actions
    this.autoPickPropositionsForBots()
  }

  /**
   * Auto-pick pokemon and item propositions for bot players only.
   * The RL agent picks via PICK_PROPOSITION actions instead.
   * Bots pick randomly, creates the pokemon, places on bench, gives item.
   */
  private autoPickPropositionsForBots(): void {
    this.state.players.forEach((player) => {
      // Skip agent — agent picks via PICK_PROPOSITION actions
      if (player.id === this.agentId) return
      if (player.pokemonsProposition.length > 0) {
        const propositions = values(player.pokemonsProposition)
        const pick = pickRandomIn(propositions) as Pkm
        const selectedIndex = player.pokemonsProposition.indexOf(pick)

        // Create the pokemon and place on bench
        const pokemon = PokemonFactory.createPokemonFromName(pick, player)
        const freeCellX = getFirstAvailablePositionInBench(player.board)
        if (freeCellX !== null) {
          pokemon.positionX = freeCellX
          pokemon.positionY = 0
          player.board.set(pokemon.id, pokemon)
          pokemon.onAcquired(player)
        }

        // Add to shared pool for additional pick stages
        if (AdditionalPicksStages.includes(this.state.stageLevel)) {
          this.state.shop.addAdditionalPokemon(pick, this.state)
        }

        // Give corresponding item
        if (player.itemsProposition.length > 0) {
          const selectedItem = player.itemsProposition[selectedIndex]
          if (selectedItem != null) {
            player.items.push(selectedItem)
          }
        }

        player.pokemonsProposition.clear()
        player.itemsProposition.clear()
        this.room.checkEvolutionsAfterPokemonAcquired(player.id)
      } else if (player.itemsProposition.length > 0) {
        // Item-only propositions (PVE rewards, etc.)
        const pick = pickRandomIn(values(player.itemsProposition))
        player.items.push(pick)
        player.itemsProposition.clear()
      }
    })
  }

  /**
   * Fallback: auto-pick a random proposition for the agent.
   * Used when turn ends but propositions are still pending (safety cap hit).
   */
  private autoPickForAgent(agent: Player): void {
    if (agent.pokemonsProposition.length > 0) {
      const propositions = values(agent.pokemonsProposition)
      const pick = pickRandomIn(propositions) as Pkm
      const selectedIndex = agent.pokemonsProposition.indexOf(pick)
      this.pickProposition(agent, selectedIndex)
    }
    // If propositions still there (pickProposition failed due to no space), force clear
    if (agent.pokemonsProposition.length > 0) {
      agent.pokemonsProposition.clear()
      agent.itemsProposition.clear()
    }
  }

  /**
   * Create bot players from cached bot definitions.
   * Bots use the existing BotV2 system with pre-scripted team progressions.
   */
  private createBotPlayers(): void {
    const numBots = Math.min(TRAINING_NUM_OPPONENTS, this.cachedBots.length)
    const selectedBots = shuffleArray([...this.cachedBots]).slice(0, numBots)

    selectedBots.forEach((bot, i) => {
      const botPlayer = new Player(
        bot.id,
        bot.name,
        bot.elo,
        0,
        bot.avatar,
        true, // isBot
        this.state.players.size + 1,
        new Map(),
        "",
        Role.BOT,
        this.state
      )
      this.state.players.set(bot.id, botPlayer)
      this.state.botManager.addBot(botPlayer)
    })
  }

  /**
   * Extract observation vector for the RL agent.
   */
  getObservation(): number[] {
    const obs: number[] = []
    const agent = this.state.players.get(this.agentId)

    if (!agent) {
      return new Array(TOTAL_OBS_SIZE).fill(0)
    }

    // Player stats (8)
    obs.push(agent.life / 100) // normalized
    obs.push(agent.money / 100)
    obs.push(agent.experienceManager.level / 9)
    obs.push(agent.streak / 10)
    obs.push(agent.interest / 5)
    obs.push(agent.alive ? 1 : 0)
    obs.push(agent.rank / 8)
    obs.push(agent.boardSize / 9)

    // Shop (5 slots, encoded as pokemon rarity 0-1)
    for (let i = 0; i < 5; i++) {
      const pkm = agent.shop[i]
      if (pkm && pkm !== Pkm.DEFAULT) {
        const data = getPokemonData(pkm)
        const rarityMap: Record<string, number> = {
          [Rarity.COMMON]: 0.1,
          [Rarity.UNCOMMON]: 0.2,
          [Rarity.RARE]: 0.4,
          [Rarity.EPIC]: 0.6,
          [Rarity.ULTRA]: 0.8,
          [Rarity.UNIQUE]: 0.9,
          [Rarity.LEGENDARY]: 1.0,
          [Rarity.HATCH]: 0.3,
          [Rarity.SPECIAL]: 0.5
        }
        obs.push(rarityMap[data.rarity] ?? 0)
      } else {
        obs.push(0)
      }
    }

    // Board/bench (40 slots * 3 features = 120)
    // Bench: 8 positions (y=0, x=0..7)
    for (let x = 0; x < 8; x++) {
      const pokemon = this.findPokemonAt(agent, x, 0)
      if (pokemon) {
        const data = getPokemonData(pokemon.name)
        const rarityMap: Record<string, number> = {
          [Rarity.COMMON]: 0.1,
          [Rarity.UNCOMMON]: 0.2,
          [Rarity.RARE]: 0.4,
          [Rarity.EPIC]: 0.6,
          [Rarity.ULTRA]: 0.8,
          [Rarity.UNIQUE]: 0.9,
          [Rarity.LEGENDARY]: 1.0,
          [Rarity.HATCH]: 0.3,
          [Rarity.SPECIAL]: 0.5
        }
        obs.push(1) // has pokemon
        obs.push(pokemon.stars / 3)
        obs.push(rarityMap[data.rarity] ?? 0)
      } else {
        obs.push(0, 0, 0)
      }
    }

    // Board: 4x8 = 32 positions (y=1..4, x=0..7)
    for (let y = 1; y <= 4; y++) {
      for (let x = 0; x < 8; x++) {
        const pokemon = this.findPokemonAt(agent, x, y)
        if (pokemon) {
          const data = getPokemonData(pokemon.name)
          const rarityMap: Record<string, number> = {
            [Rarity.COMMON]: 0.1,
            [Rarity.UNCOMMON]: 0.2,
            [Rarity.RARE]: 0.4,
            [Rarity.EPIC]: 0.6,
            [Rarity.ULTRA]: 0.8,
            [Rarity.UNIQUE]: 0.9,
            [Rarity.LEGENDARY]: 1.0,
            [Rarity.HATCH]: 0.3,
            [Rarity.SPECIAL]: 0.5
          }
          obs.push(1)
          obs.push(pokemon.stars / 3)
          obs.push(rarityMap[data.rarity] ?? 0)
        } else {
          obs.push(0, 0, 0)
        }
      }
    }

    // Synergies (32 values, normalized)
    for (const synergy of SynergyArray) {
      const val = agent.synergies.get(synergy) ?? 0
      obs.push(val / 10) // normalize
    }

    // Game info (4)
    obs.push(this.state.stageLevel / 50)
    obs.push(this.state.phase / 2)
    const playersAlive = values(this.state.players).filter(
      (p) => p.alive
    ).length
    obs.push(playersAlive / 8)
    obs.push(agent.pokemonsProposition.length > 0 ? 1 : 0) // hasPropositions

    // Opponent stats (16 = 8 opponents * 2 features)
    const opponents = values(this.state.players).filter(
      (p) => p.id !== this.agentId
    )
    for (let i = 0; i < 8; i++) {
      if (i < opponents.length) {
        obs.push(opponents[i].life / 100)
        obs.push(opponents[i].rank / 8)
      } else {
        obs.push(0, 0)
      }
    }

    // Proposition slots (6 slots × 3 features = 18)
    // Each slot: rarity, numTypes, hasItem
    const propositions = values(agent.pokemonsProposition) as Pkm[]
    const rarityMap: Record<string, number> = {
      [Rarity.COMMON]: 0.1,
      [Rarity.UNCOMMON]: 0.2,
      [Rarity.RARE]: 0.4,
      [Rarity.EPIC]: 0.6,
      [Rarity.ULTRA]: 0.8,
      [Rarity.UNIQUE]: 0.9,
      [Rarity.LEGENDARY]: 1.0,
      [Rarity.HATCH]: 0.3,
      [Rarity.SPECIAL]: 0.5
    }
    for (let i = 0; i < MAX_PROPOSITIONS; i++) {
      if (i < propositions.length && propositions[i]) {
        const data = getPokemonData(propositions[i])
        obs.push(rarityMap[data.rarity] ?? 0) // rarity
        obs.push((data.types?.length ?? 0) / 5) // numTypes normalized
        obs.push(
          agent.itemsProposition.length > i &&
            agent.itemsProposition[i] != null
            ? 1
            : 0
        ) // hasItem
      } else {
        obs.push(0, 0, 0)
      }
    }

    // Pad to exact size if needed
    while (obs.length < TOTAL_OBS_SIZE) obs.push(0)

    return obs.slice(0, TOTAL_OBS_SIZE)
  }

  /**
   * Compute valid action mask (1 = valid, 0 = invalid).
   */
  getActionMask(): number[] {
    const mask = new Array(TOTAL_ACTIONS).fill(0)
    const agent = this.state.players.get(this.agentId)

    if (!agent || !agent.alive || this.state.phase !== GamePhaseState.PICK) {
      mask[TrainingAction.END_TURN] = 1
      return mask
    }

    // If agent has propositions pending, only PICK_PROPOSITION actions are valid
    if (agent.pokemonsProposition.length > 0) {
      const freeSpace = getFreeSpaceOnBench(agent.board)
      for (let i = 0; i < agent.pokemonsProposition.length; i++) {
        const pkm = agent.pokemonsProposition[i] as Pkm
        if (!pkm) continue
        // Check if agent has bench space (or if it could evolve)
        const pokemon = PokemonFactory.createPokemonFromName(pkm, agent)
        const isEvolution =
          pokemon.evolutionRule &&
          pokemon.evolutionRule instanceof CountEvolutionRule &&
          pokemon.evolutionRule.canEvolveIfGettingOne(pokemon, agent)
        const numNeeded =
          pkm in PkmDuos
            ? PkmDuos[pkm as keyof typeof PkmDuos].length
            : 1
        if (freeSpace >= numNeeded || isEvolution) {
          mask[TrainingAction.PICK_PROPOSITION_0 + i] = 1
        }
      }
      // If no proposition is valid (bench full, no evolution), allow END_TURN as fallback
      if (mask.every((m) => m === 0)) {
        mask[TrainingAction.END_TURN] = 1
      }
      return mask
    }

    // Normal PICK phase: economy actions
    // END_TURN is always valid
    mask[TrainingAction.END_TURN] = 1

    // BUY actions
    for (let i = 0; i < 5; i++) {
      const pkm = agent.shop[i]
      if (pkm && pkm !== Pkm.DEFAULT) {
        const cost = getBuyPrice(pkm, this.state.specialGameRule)
        const freeSpace = getFreeSpaceOnBench(agent.board)
        if (agent.money >= cost && freeSpace > 0) {
          mask[TrainingAction.BUY_0 + i] = 1
        }
      }
    }

    // SELL actions (bench positions 0-7)
    for (let x = 0; x < 8; x++) {
      const pokemon = this.findPokemonAt(agent, x, 0)
      if (pokemon) {
        mask[TrainingAction.SELL_0 + x] = 1
      }
    }

    // REROLL
    const rollCost = agent.shopFreeRolls > 0 ? 0 : 1
    if (agent.money >= rollCost) {
      mask[TrainingAction.REROLL] = 1
    }

    // LEVEL_UP
    if (agent.money >= 4 && agent.experienceManager.canLevelUp()) {
      mask[TrainingAction.LEVEL_UP] = 1
    }

    return mask
  }

  private findPokemonAt(
    player: Player,
    x: number,
    y: number
  ): Pokemon | null {
    let found: Pokemon | null = null
    player.board.forEach((pokemon) => {
      if (pokemon.positionX === x && pokemon.positionY === y) {
        found = pokemon
      }
    })
    return found
  }

  private computeFinalReward(agent: Player): number {
    // Reward based on final placement: rank 1 = best, rank 8 = worst
    return (9 - agent.rank) * REWARD_PLACEMENT_SCALE - REWARD_PLACEMENT_OFFSET
  }

  private getInfo(): StepResult["info"] {
    const agent = this.state.players.get(this.agentId)
    return {
      stage: this.state.stageLevel,
      phase:
        this.state.phase === GamePhaseState.PICK
          ? "PICK"
          : this.state.phase === GamePhaseState.FIGHT
            ? "FIGHT"
            : "TOWN",
      rank: agent?.rank ?? 8,
      life: agent?.life ?? 0,
      money: agent?.money ?? 0,
      actionsThisTurn: this.actionsThisTurn,
      actionMask: this.getActionMask()
    }
  }
}
