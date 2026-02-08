/**
 * HeadlessRoom: A mock GameRoom that satisfies Simulation and game logic
 * without any Colyseus networking. Used for step-mode training.
 */
import { MapSchema } from "@colyseus/schema"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../config"
import { CountEvolutionRule, ItemEvolutionRule } from "../core/evolution-rules"
import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import GameState from "../rooms/states/game-state"
import { IPokemonEntity, Passive } from "../types"

export class HeadlessRoom {
  state: GameState
  clients: any[] = []

  constructor(state: GameState) {
    this.state = state
  }

  broadcast(_type: any, _data?: any): void {
    // no-op: no clients to broadcast to
  }

  setMetadata(_metadata: any): void {
    // no-op
  }

  computeRoundDamage(
    opponentTeam: MapSchema<IPokemonEntity>,
    stageLevel: number
  ): number {
    let damage = Math.ceil(stageLevel / 2)
    if (opponentTeam.size > 0) {
      opponentTeam.forEach((pokemon) => {
        if (!pokemon.isSpawn && pokemon.passive !== Passive.INANIMATE) {
          damage += 1
        }
      })
    }
    return damage
  }

  rankPlayers(): void {
    const rankArray: { id: string; life: number; level: number }[] = []
    this.state.players.forEach((player) => {
      if (!player.alive) return
      rankArray.push({
        id: player.id,
        life: player.life,
        level: player.experienceManager.level
      })
    })

    rankArray.sort((a, b) => {
      let diff = b.life - a.life
      if (diff === 0) diff = b.level - a.level
      return diff
    })

    rankArray.forEach((rankPlayer, index) => {
      const player = this.state.players.get(rankPlayer.id)
      if (player) player.rank = index + 1
    })
  }

  getTeamSize(board: MapSchema<Pokemon>): number {
    let size = 0
    board.forEach((pokemon) => {
      if (pokemon.positionY !== 0 && pokemon.doesCountForTeamSize) {
        size++
      }
    })
    return size
  }

  getNumberOfPlayersAlive(players: MapSchema<Player>): number {
    let count = 0
    players.forEach((player) => {
      if (player.alive) count++
    })
    return count
  }

  checkEvolutionsAfterPokemonAcquired(playerId: string): boolean {
    const player = this.state.players.get(playerId)
    if (!player) return false
    let hasEvolved = false

    player.board.forEach((pokemon) => {
      if (
        pokemon.hasEvolution &&
        pokemon.evolutionRule instanceof CountEvolutionRule
      ) {
        const pokemonEvolved = pokemon.evolutionRule.tryEvolve(
          pokemon,
          player,
          this.state.stageLevel
        )
        if (pokemonEvolved) hasEvolved = true
      }
    })

    player.boardSize = this.getTeamSize(player.board)
    return hasEvolved
  }

  checkEvolutionsAfterItemAcquired(
    playerId: string,
    pokemon: Pokemon
  ): Pokemon | void {
    const player = this.state.players.get(playerId)
    if (!player) return

    if (
      pokemon.evolutionRule &&
      pokemon.evolutionRule instanceof ItemEvolutionRule
    ) {
      return pokemon.evolutionRule.tryEvolve(
        pokemon,
        player,
        this.state.stageLevel
      )
    }
  }

  spawnWanderingPokemon(_params: any): void {
    // no-op in training mode
  }

  spawnOnBench(_player: Player, _pkm: any, _anim?: string): void {
    // no-op in training mode
  }

  pickPokemonProposition(
    _playerId: string,
    _pkm: any,
    _bypassLackOfSpace?: boolean
  ): void {
    // no-op: auto-handled in training loop
  }

  pickItemProposition(_playerId: string, _item: any): void {
    // no-op: auto-handled in training loop
  }

  // Mock clock for setTimeout calls in commands
  clock = {
    setTimeout: (fn: () => void, _delay: number) => {
      // Execute immediately in step mode
      fn()
    }
  }

  // Mock miniGame
  miniGame = {
    create: () => {},
    initialize: () => {},
    update: () => {},
    stop: () => {},
    applyVector: () => {}
  }

  // Mock additional pools (used in phase transitions)
  additionalUncommonPool: any[] = []
  additionalRarePool: any[] = []
  additionalEpicPool: any[] = []

  // Mock dispatcher (we call game logic directly, not through commands)
  dispatcher = {
    dispatch: () => {},
    stop: () => {}
  }
}
