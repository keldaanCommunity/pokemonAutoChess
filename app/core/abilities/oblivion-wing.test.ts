import assert from "node:assert/strict"
import test from "node:test"
import { ARMOR_FACTOR } from "../../config"
import PokemonFactory from "../../models/pokemon-factory"
import { Transfer } from "../../types"
import { Team } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { Weather } from "../../types/enum/Weather"
import { Board } from "../board"
import { PokemonEntity } from "../pokemon-entity"
import type Simulation from "../simulation"
import { OblivionWingStrategy } from "./oblivion-wing"

function setup() {
  const board = new Board(8, 8)
  const broadcasts: Array<{ type: Transfer; data: { targetX?: number; targetY?: number; ap?: number } }> = []
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
    broadcastToSpectators(type: Transfer, data: { targetX?: number; targetY?: number; ap?: number }) {
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
  const caster = create(Pkm.YVELTAL, 0, 3, Team.BLUE_TEAM)
  return { board, broadcasts, caster, create }
}

test("Oblivion Wing selects the line with the most enemies and heals from actual damage", () => {
  const { board, broadcasts, caster, create } = setup()
  caster.hp = 100
  caster.pp = caster.maxPP
  const selectedTarget = create(Pkm.SNORLAX, 1, 0, Team.RED_TEAM)
  const enemies = [2, 4, 6].map((x) =>
    create(Pkm.MAGIKARP, x, 3, Team.RED_TEAM)
  )
  enemies.forEach((enemy, index) => {
    enemy.hp = 10 + index * 10
  })
  const ally = create(Pkm.SNORLAX, 3, 3, Team.BLUE_TEAM)
  const allyHP = ally.hp
  const targetHP = selectedTarget.hp
  new OblivionWingStrategy().process(caster, board, selectedTarget, false)

  assert.deepEqual(enemies.map((enemy) => enemy.hp), [0, 0, 0])
  assert.equal(ally.hp, allyHP)
  assert.equal(selectedTarget.hp, targetHP)
  assert.equal(caster.hp, 130)
  assert.equal(caster.pp, 0)
  assert.equal(caster.count.ult, 1)
  const animation = broadcasts.find((event) => event.type === Transfer.ABILITY)
  assert.equal(animation?.data.targetX, 7)
  assert.equal(animation?.data.targetY, 3)
})

test("Oblivion Wing favors the selected target on ties and applies AP and critical damage", () => {
  const { board, broadcasts, caster, create } = setup()
  caster.hp = 100
  caster.ap = 50
  caster.critPower = 2
  const target = create(Pkm.SNORLAX, 0, 6, Team.RED_TEAM)
  const other = create(Pkm.SNORLAX, 6, 3, Team.RED_TEAM)
  const initialHP = target.hp
  const otherHP = other.hp
  new OblivionWingStrategy().process(caster, board, target, true)

  const expectedDamage = Math.min(
    initialHP,
    Math.ceil((70 * 1.5 * 2) / (1 + ARMOR_FACTOR * target.speDef))
  )
  assert.equal(initialHP - target.hp, expectedDamage)
  assert.equal(other.hp, otherHP)
  assert.equal(caster.hp, 100 + Math.round(expectedDamage * 0.5))
  const animation = broadcasts.find((event) => event.type === Transfer.ABILITY)
  assert.equal(animation?.data.ap, 100)
  assert.equal(animation?.data.targetX, 0)
  assert.equal(animation?.data.targetY, 7)
})
