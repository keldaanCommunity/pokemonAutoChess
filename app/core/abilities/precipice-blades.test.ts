import assert from "node:assert/strict"
import test from "node:test"
import { Orientation } from "../../types/enum/Game"
import { PrecipiceBladesStrategy } from "./precipice-blades"

const run = (orientation: Orientation) => {
  const hit: string[] = []
  let broadcast: any
  const createEntity = (id: string, team: number, x: number, y: number) =>
    ({
      id,
      team,
      stars: 1,
      positionX: x,
      positionY: y,
      pp: 0,
      maxPP: 100,
      ap: 0,
      critPower: 1,
      critChance: 0,
      orientation,
      skill: "PRECIPICE_BLADES",
      count: { ult: 0 },
      simulation: { blueAbilitiesCast: [], redAbilitiesCast: [] },
      broadcastAbility(args: any) {
        broadcast = args
      },
      handleSpecialDamage() {
        hit.push(id)
      }
    }) as any

  const caster = createEntity("caster", 0, 3, 3)
  const entities = [
    createEntity("row", 1, 6, 3),
    createEntity("column", 1, 3, 0),
    createEntity("diagonal", 1, 5, 5),
    createEntity("antiDiagonal", 1, 4, 2),
    createEntity("offLine", 1, 5, 4),
    createEntity("ally", 0, 3, 5),
    createEntity("allyDiagonal", 0, 1, 1)
  ]
  const board = {
    forEach(cb: (x: number, y: number, e: any) => void) {
      for (const e of entities) cb(e.positionX, e.positionY, e)
    }
  }
  new PrecipiceBladesStrategy().process(
    caster,
    board as any,
    entities[0],
    false
  )
  return { hit, broadcast }
}

test("Precipice Blades hits the row and column when not facing diagonally", () => {
  const { hit, broadcast } = run(Orientation.RIGHT)
  assert.deepEqual(hit.sort(), ["column", "row"])
  assert.equal(broadcast.data.diagonal, false)
})

test("Precipice Blades hits both diagonals when facing diagonally", () => {
  const { hit, broadcast } = run(Orientation.UPRIGHT)
  assert.deepEqual(hit.sort(), ["antiDiagonal", "diagonal"])
  assert.equal(broadcast.data.diagonal, true)
})
