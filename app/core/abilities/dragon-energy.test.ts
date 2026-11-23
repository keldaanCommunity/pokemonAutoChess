import assert from "node:assert/strict"
import test from "node:test"
import type Player from "../../models/colyseus-models/player"
import PokemonFactory from "../../models/pokemon-factory"
import { Transfer } from "../../types"
import { Team } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { Weather } from "../../types/enum/Weather"
import { Board } from "../board"
import MovingState from "../moving-state"
import { PokemonEntity } from "../pokemon-entity"
import type Simulation from "../simulation"
import { DragonEnergyStrategy } from "./dragon-energy"

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
  const caster = create(Pkm.REGIDRAGO, 0, 0, Team.BLUE_TEAM)
  caster.pp = caster.maxPP
  return { board, broadcasts, caster, create }
}

test("Dragon Energy targetlessly hits the closest enemy, even outside range", () => {
  const { board, broadcasts, caster, create } = setup()
  const closest = create(Pkm.SNORLAX, 3, 1, Team.RED_TEAM)
  const farther = create(Pkm.SNORLAX, 6, 1, Team.RED_TEAM)
  const closestInitialHp = closest.hp
  const fartherInitialHp = farther.hp
  caster.cooldown = 0
  caster.oneSecondCooldown = 1000

  new MovingState().update(caster, 0, board, {} as Player)

  assert.ok(closest.hp < closestInitialHp)
  assert.equal(farther.hp, fartherInitialHp)
  assert.equal(caster.pp, 0)
  assert.deepEqual(
    broadcasts
      .filter(({ type }) => type === Transfer.ABILITY)
      .map(({ data }) => [data.targetX, data.targetY]),
    [[3, 1]]
  )
})

test("Dragon Energy preserves PP when there is no targetable enemy", () => {
  const { board, broadcasts, caster } = setup()

  new DragonEnergyStrategy().process(caster, board, null, false)

  assert.equal(caster.pp, caster.maxPP)
  assert.equal(caster.count.ult, 0)
  assert.equal(broadcasts.length, 0)
})
