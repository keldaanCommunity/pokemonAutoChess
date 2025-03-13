import { ISimulationCommand, Transfer } from "../types"
import { Effect } from "../types/enum/Effect"
import { AttackType } from "../types/enum/Game"
import { Pkm } from "../types/enum/Pokemon"
import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"

export abstract class SimulationCommand implements ISimulationCommand {
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
        this.pokemon.state.attack(this.pokemon, this.board, this.target)
        this.pokemon.state.attack(this.pokemon, this.board, this.target)
        if (isPowerSurge) {
          this.board
            .getAdjacentCells(
              this.target.positionX,
              this.target.positionY,
              true
            )
            .forEach((cell) => {
              if (cell) {
                const enemy = this.board.getValue(cell.x, cell.y)
                if (enemy && this.pokemon.team !== enemy.team) {
                  enemy.handleSpecialDamage(
                    10,
                    this.board,
                    AttackType.SPECIAL,
                    this.pokemon,
                    false,
                    false
                  )
                  if (enemy !== this.target) {
                    this.pokemon.simulation.room.broadcast(Transfer.ABILITY, {
                      id: this.pokemon.simulation.id,
                      skill: "LINK_CABLE_link",
                      positionX: this.target.positionX,
                      positionY: this.target.positionY,
                      targetX: enemy.positionX,
                      targetY: enemy.positionY
                    })
                  }
                }
              }
            })
        }

        if (this.pokemon.name === Pkm.MORPEKO) {
          this.target.status.triggerParalysis(2000, this.target, this.pokemon)
        }

        if (this.pokemon.name === Pkm.MORPEKO_HANGRY) {
          this.target.status.triggerWound(4000, this.target, this.pokemon)
        }
      }
    }
  }
}
