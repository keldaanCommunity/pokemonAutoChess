import assert from "node:assert/strict"
import test from "node:test"
import PokemonFactory from "../../models/pokemon-factory"
import { Transfer } from "../../types"
import { Team } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { Weather } from "../../types/enum/Weather"
import { Board } from "../board"
import { PokemonEntity } from "../pokemon-entity"
import type Simulation from "../simulation"
import { FutureSightStrategy } from "./future-sight"

function setup() {
  const board = new Board(8, 8)
  const broadcasts: Array<{
    type: Transfer
    data: { skill: string; targetX: number; targetY: number }
  }> = []
  const simulation = {
    board,
    weather: Weather.NEUTRAL,
    room: { state: { time: 0 } },
    blueAbilitiesCast: [],
    redAbilitiesCast: [],
    blueTeam: new Map(),
    redTeam: new Map(),
    blueEffects: new Set(),
    redEffects: new Set(),
    broadcastToSpectators(
      type: Transfer,
      data: { skill: string; targetX: number; targetY: number }
    ) {
      broadcasts.push({ type, data })
    }
  } as unknown as Simulation
  const create = (name: Pkm, x: number, y: number, team: Team) => {
    const entity = new PokemonEntity(
      PokemonFactory.createPokemonFromName(name),
      x,
      y,
      team,
      simulation
    )
    board.setEntityOnCell(x, y, entity)
    return entity
  }
  const caster = create(Pkm.ESPEON, 0, 0, Team.BLUE_TEAM)
  return { board, broadcasts, caster, create }
}

test("Future Sight casts once and hits each target at its current position after the delay", () => {
  const { board, broadcasts, caster, create } = setup()
  const first = create(Pkm.SNORLAX, 3, 3, Team.RED_TEAM)
  const second = create(Pkm.SNORLAX, 6, 6, Team.RED_TEAM)
  const initialHealth = [first.hp, second.hp]

  new FutureSightStrategy().process(caster, board, null, false)

  assert.deepEqual(
    broadcasts
      .filter((event) => event.type === Transfer.ABILITY)
      .map((event) => event.data.skill),
    ["FUTURE_SIGHT"]
  )
  assert.equal(caster.commands.length, 1)
  board.swapCells(3, 3, 3, 4)
  caster.commands[0].update(2000)
  assert.deepEqual([first.hp, second.hp], initialHealth)
  caster.commands[0].update(1)

  const hits = broadcasts.filter(
    (event) => event.data.skill === "FUTURE_SIGHT_HIT"
  )
  assert.deepEqual(
    hits.map(({ data }) => [data.targetX, data.targetY]),
    [
      [3, 4],
      [6, 6]
    ]
  )
  assert.ok(first.hp < initialHealth[0])
  assert.ok(second.hp < initialHealth[1])
})

test("Future Sight does not broadcast a cast when there are no targets", () => {
  const { board, broadcasts, caster } = setup()
  new FutureSightStrategy().process(caster, board, null, false)
  assert.equal(
    broadcasts.filter((event) => event.type === Transfer.ABILITY).length,
    0
  )
})

test("Future Sight shows splash effects only where adjacent enemies take damage", () => {
  const { board, broadcasts, caster, create } = setup()
  create(Pkm.SNORLAX, 3, 3, Team.RED_TEAM)
  new FutureSightStrategy().process(caster, board, null, false)

  const adjacent = create(Pkm.SNORLAX, 4, 4, Team.RED_TEAM)
  const shielded = create(Pkm.SNORLAX, 2, 3, Team.RED_TEAM)
  shielded.shield = 100
  const protectedEnemy = create(Pkm.SNORLAX, 3, 2, Team.RED_TEAM)
  protectedEnemy.status.protect = true
  const ally = create(Pkm.SNORLAX, 2, 2, Team.BLUE_TEAM)
  const distant = create(Pkm.SNORLAX, 6, 6, Team.RED_TEAM)
  const initialHP = adjacent.hp
  const allyHP = ally.hp
  const distantHP = distant.hp

  caster.commands[0].update(2001)

  const splashes = broadcasts.filter(
    ({ data }) => data.skill === "FUTURE_SIGHT_SPLASH"
  )
  assert.deepEqual(
    splashes.map(({ data }) => [data.targetX, data.targetY]),
    [
      [2, 3],
      [4, 4]
    ]
  )
  assert.ok(adjacent.hp < initialHP)
  assert.ok(shielded.shield < 100)
  assert.equal(ally.hp, allyHP)
  assert.equal(distant.hp, distantHP)
})

test("Future Sight broadcasts each overlapping splash impact", () => {
  const { board, broadcasts, caster, create } = setup()
  create(Pkm.SNORLAX, 3, 3, Team.RED_TEAM)
  create(Pkm.SNORLAX, 4, 3, Team.RED_TEAM)
  new FutureSightStrategy().process(caster, board, null, false)
  const adjacent = create(Pkm.SNORLAX, 3, 4, Team.RED_TEAM)
  const initialHP = adjacent.hp

  caster.commands[0].update(2001)

  const hitsOnAdjacent = broadcasts.filter(
    ({ data }) =>
      data.skill === "FUTURE_SIGHT_SPLASH" &&
      data.targetX === 3 &&
      data.targetY === 4
  )
  assert.equal(hitsOnAdjacent.length, 2)
  assert.ok(adjacent.hp < initialHP)
})
