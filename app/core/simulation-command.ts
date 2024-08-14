import { Transfer } from "../types"
import { Effect } from "../types/enum/Effect"
import { AttackType } from "../types/enum/Game"
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
      this.pokemon.effects.has(Effect.OVERDRIVE) ||
      this.pokemon.effects.has(Effect.POWER_SURGE)
    ) {
      let isTripleAttack = false,
        isPowerSurge = false
      if (this.pokemon.effects.has(Effect.RISING_VOLTAGE)) {
        isTripleAttack = this.pokemon.count.attackCount % 4 === 0
      } else if (this.pokemon.effects.has(Effect.OVERDRIVE)) {
        isTripleAttack = this.pokemon.count.attackCount % 3 === 0
      } else if (this.pokemon.effects.has(Effect.POWER_SURGE)) {
        isTripleAttack = this.pokemon.count.attackCount % 3 === 0
        isPowerSurge = true
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
        if (isPowerSurge) {
          this.board
            .getAdjacentCells(this.targetCoordinate.x, this.targetCoordinate.y)
            .forEach((cell) => {
              if (cell) {
                const enemy = this.board.getValue(cell.x, cell.y)
                if (enemy && this.pokemon.team !== enemy.team) {
                  enemy.handleSpecialDamage(
                    10,
                    this.board,
                    AttackType.SPECIAL,
                    this.pokemon,
                    false
                  )
                  this.pokemon.simulation.room.broadcast(Transfer.ABILITY, {
                    id: this.pokemon.simulation.id,
                    skill: "LINK_CABLE_link",
                    positionX: this.targetCoordinate.x,
                    positionY: this.targetCoordinate.y,
                    targetX: enemy.positionX,
                    targetY: enemy.positionY
                  })
                }
              }
            })
        }
      }
    }
  }
}
