import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand, SimulationCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

class LeechSeedCommand extends SimulationCommand {
  private durationRemaining = 5000

  constructor(
    private onTick: () => void,
    private readonly onExpire: () => void
  ) {
    super(600)
  }

  refresh(onTick: () => void) {
    this.onTick = onTick
    this.durationRemaining = 5000
  }

  update(dt: number) {
    this.durationRemaining -= dt
    this.delay -= dt

    while (this.delay < 0 && this.durationRemaining > 0) {
      this.onTick()
      this.delay += 1000
    }

    if (this.durationRemaining <= 0) {
      this.executed = true
      this.onExpire()
    }
  }
}

export class LeechSeedStrategy extends AbilityStrategy {
  private activeSeeds = new WeakMap<PokemonEntity, LeechSeedCommand>()
  requiresTarget = true

  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damagePercent = [4, 8, 12, 16][pokemon.stars - 1] ?? 16

    pokemon.broadcastAbility({
      skill: "LEECH_SEED_PROJECTILE",
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })

    const onTick = () => {
      pokemon.broadcastAbility({
        skill: Ability.LEECH_SEED,
        targetX: target.positionX,
        targetY: target.positionY
      })

      const result = target.handleSpecialDamage(
        ((damagePercent * target.maxHP) / 100) * (1 + pokemon.ap / 200),
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        false
      )
      if (result.takenDamage) {
        const lowestHealthAllies = board.cells
          .filter(
            (cell): cell is PokemonEntity =>
              cell != null && cell.team === pokemon.team
          )
          .sort((a, b) => b.maxHP - b.hp - (a.maxHP - a.hp))
        if (lowestHealthAllies.length > 0) {
          const lowestHealthAlly = lowestHealthAllies[0]
          pokemon.broadcastAbility({
            skill: "LEECH_SEED_HEAL",
            positionX: target.positionX,
            positionY: target.positionY,
            targetX: lowestHealthAlly.positionX,
            targetY: lowestHealthAlly.positionY
          })
          lowestHealthAlly.commands.push(
            new DelayedCommand(() => {
              lowestHealthAlly.handleHeal(result.takenDamage, pokemon, 0, crit)
            }, 1000)
          )
        }
      }
    }

    const activeSeed = this.activeSeeds.get(pokemon)
    if (activeSeed) {
      activeSeed.refresh(onTick)
      return
    }

    const command = new LeechSeedCommand(onTick, () =>
      this.activeSeeds.delete(pokemon)
    )
    this.activeSeeds.set(pokemon, command)
    pokemon.commands.push(command)
  }
}
