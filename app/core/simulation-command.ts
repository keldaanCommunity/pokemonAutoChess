import { ISimulationCommand } from "../types"
import type { Board } from "./board"
import { PokemonEntity } from "./pokemon-entity"

export abstract class SimulationCommand implements ISimulationCommand {
  delay: number
  executed = false

  constructor(delay: number) {
    this.delay = delay
  }
  execute() { }
  update(dt: number) {
    this.delay -= dt
    if (this.delay < 0) {
      this.execute()
      this.executed = true
    }
  }
}

export class DelayedCommand extends SimulationCommand {
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
  target: PokemonEntity
  board: Board

  constructor(
    delay: number,
    pokemon: PokemonEntity,
    target: PokemonEntity,
    board: Board
  ) {
    super(delay)
    this.pokemon = pokemon
    this.board = board
    this.target = target
  }

  execute(): void {
    this.pokemon.state.attack(this.pokemon, this.board, this.target)
  }
}
