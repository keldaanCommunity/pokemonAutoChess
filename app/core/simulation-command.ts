import { Effect } from "../types/enum/Effect"
import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"

export abstract class SimulationCommand {
  delay: number
  executed = false

  constructor(delay: number) {
    this.delay = delay
  }
  execute() {}
  update(dt: number) {
    this.delay -= dt
    if (this.delay < 0) {
      this.execute()
      this.executed = true
    }
  }
}

export class AbilityCommand extends SimulationCommand {
  delayedFunction: () => void
  constructor(delayedFunction: () => void, delay: number) {
    super(delay)
    this.delayedFunction = delayedFunction
  }
  execute() {
    super.execute()
    this.delayedFunction()
  }
}

export class AttackCommand extends SimulationCommand {
  pokemon: PokemonEntity
  board: Board
  targetCoordinate: { x: number; y: number }

  constructor(
    delay: number,
    pokemon: PokemonEntity,
    board: Board,
    targetCoordinate: { x: number; y: number }
  ) {
    super(delay)
    this.pokemon = pokemon
    this.board = board
    this.targetCoordinate = targetCoordinate
  }

  execute(): void {
    this.pokemon.state.attack(this.pokemon, this.board, this.targetCoordinate)
    if (
      this.pokemon.effects.has(Effect.RISING_VOLTAGE) ||
      this.pokemon.effects.has(Effect.OVERDRIVE)
    ) {
      let isTripleAttack = false
      if (this.pokemon.effects.has(Effect.RISING_VOLTAGE)) {
        isTripleAttack = this.pokemon.count.attackCount % 4 === 0
      } else if (this.pokemon.effects.has(Effect.OVERDRIVE)) {
        isTripleAttack = this.pokemon.count.attackCount % 3 === 0
      }
      if (isTripleAttack) {
        this.pokemon.count.tripleAttackCount++
        this.pokemon.state.attack(
          this.pokemon,
          this.board,
          this.targetCoordinate
        )
        this.pokemon.state.attack(
          this.pokemon,
          this.board,
          this.targetCoordinate
        )
      }
    }
  }
}
