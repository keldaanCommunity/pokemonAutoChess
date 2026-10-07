import { AttackType, Team } from "../../types/enum/Game"
import { pickNRandomIn, pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ShatteredPsycheStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Spawns 3 mirrors around the enemy team, each one reflecting one random enemy.
    // Then throws a psychic energy wave that bounces between the mirrors and shatter them.
    // Enemies traversed by the wave take [10,20,40,80,150,SP] SPECIAL.
    // Enemies reflected in the shattered mirrors take [20,40,80,150,300,SP] additional SPECIAL and get CONFUSION for 5 seconds.
    const damageWave = [10, 20, 40, 80, 150][pokemon.stars - 1] ?? 150
    const damageShatter = [20, 40, 80, 150, 300][pokemon.stars - 1] ?? 300
    const nbMirrors = 3
    const confusionDuration = 5 * 1000 // 5 seconds

    const enemies = board.cells.filter(
      (cell): cell is PokemonEntity =>
        cell != null && cell.team !== pokemon.team
    )

    if (enemies.length === 0) return

    const flip = pokemon.team === Team.BLUE_TEAM ? 1 : -1
    const leftestEnemy = enemies.reduce((leftmost, enemy) =>
      enemy.positionX < leftmost.positionX ? enemy : leftmost
    )
    const rightestEnemy = enemies.reduce((rightmost, enemy) =>
      enemy.positionX > rightmost.positionX ? enemy : rightmost
    )
    const topestEnemy = enemies.reduce((topmost, enemy) =>
      enemy.positionY * flip > topmost.positionY * flip ? enemy : topmost
    )

    const mirrorPositions = [
      board.getClosestAvailablePlace(
        topestEnemy.positionX,
        topestEnemy.positionY + flip
      ) ?? { x: topestEnemy.positionX, y: topestEnemy.positionY }
    ]
    mirrorPositions.push(
      board.getClosestAvailablePlace(
        leftestEnemy.positionX - 1,
        leftestEnemy.positionY,
        mirrorPositions
      ) ?? { x: leftestEnemy.positionX, y: leftestEnemy.positionY }
    )
    mirrorPositions.push(
      board.getClosestAvailablePlace(
        rightestEnemy.positionX + 1,
        rightestEnemy.positionY,
        mirrorPositions
      ) ?? { x: rightestEnemy.positionX, y: rightestEnemy.positionY }
    )

    const mirroredEnemies = pickNRandomIn(enemies, nbMirrors)
    while (mirroredEnemies.length < nbMirrors) {
      mirroredEnemies.push(pickRandomIn(enemies))
    }

    const mirrors = mirroredEnemies.map((enemy, i) => {
      return {
        x: mirrorPositions[i]?.x ?? enemy.positionX,
        y: mirrorPositions[i]?.y ?? enemy.positionY,
        reflectedPokemon: enemy
      }
    })

    pokemon.broadcastAbility({
      data: {
        mirrors: mirrors.map((mirror) => ({
          x: mirror.x,
          y: mirror.y,
          reflectedPokemonId: mirror.reflectedPokemon.id
        }))
      }
    })

    // Throw the psychic energy wave that bounces between the mirrors and shatter them.
    for (let i = 0; i < mirrors.length; i++) {
      const startingPoint =
        i === 0
          ? { x: pokemon.positionX, y: pokemon.positionY }
          : mirrors[i - 1]
      const endingPoint = mirrors[i]
      pokemon.commands.push(
        new DelayedCommand(
          () => {
            board
              .getCellsBetween(
                startingPoint.x,
                startingPoint.y,
                endingPoint.x,
                endingPoint.y
              )
              .forEach((cell) => {
                if (cell.value && cell.value.team !== pokemon.team) {
                  cell.value.handleSpecialDamage(
                    damageWave,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              })
          },
          250 + 500 * i // trigger damage mid-path
        )
      )

      pokemon.commands.push(
        new DelayedCommand(
          () => {
            // Shatter the mirror and deal additional damage to the reflected pokemon
            endingPoint.reflectedPokemon.handleSpecialDamage(
              damageShatter,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            endingPoint.reflectedPokemon.status.triggerConfusion(
              confusionDuration,
              endingPoint.reflectedPokemon,
              pokemon
            )
          },
          500 * (i + 1)
        )
      )
    }
  }
}
