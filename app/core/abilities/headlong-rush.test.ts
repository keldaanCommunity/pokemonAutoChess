import assert from "node:assert/strict"
import test from "node:test"
import { HeadlongRushStrategy } from "./headlong-rush"

test("Headlong Rush applies the full effect to the main target, path enemies, and the user", () => {
  const strategy = new HeadlongRushStrategy()

  const damageCalls: Array<{ targetId: string; damage: number }> = []
  const moveCalls: Array<{ targetId: string; x: number; y: number }> = []
  const defenseChanges: Array<number> = []
  const specialDefenseChanges: Array<number> = []

  const createEntity = (id: string, positionX: number, positionY: number) => {
    const entity: any = {
      id,
      team: 1,
      stars: 3,
      positionX,
      positionY,
      pp: 100,
      maxPP: 100,
      ap: 0,
      critPower: 1,
      critChance: 0,
      skill: "HEADLONG_RUSH",
      count: { ult: 0 },
      simulation: {
        blueAbilitiesCast: [],
        redAbilitiesCast: []
      },
      defense: 10,
      specialDefense: 10,
      broadcastAbility() {},
      addDefense(amount: number) {
        defenseChanges.push(amount)
        this.defense += amount
      },
      addSpecialDefense(amount: number) {
        specialDefenseChanges.push(amount)
        this.specialDefense += amount
      },
      moveTo(x: number, y: number) {
        moveCalls.push({ targetId: id, x, y })
        this.positionX = x
        this.positionY = y
      },
      cooldown: 0,
      handleSpecialDamage(damage: number) {
        damageCalls.push({ targetId: id, damage })
      }
    }

    return entity
  }

  const pokemon = createEntity("pokemon", 0, 0)
  pokemon.team = 0
  const selectedTarget = createEntity("selectedTarget", 2, 2)
  selectedTarget.team = 1
  const farthestTarget = createEntity("farthestTarget", 3, 3)
  farthestTarget.team = 1
  const pathEnemy = createEntity("pathEnemy", 1, 1)
  pathEnemy.team = 1

  const board = {
    getFarthestTargetCoordinateAvailablePlace() {
      return { x: 3, y: 3, target: farthestTarget }
    },
    getCellsBetween() {
      return [{ x: 1, y: 1, value: pathEnemy }]
    },
    isOnBoard() {
      return true
    },
    getEntityOnCell() {
      return undefined
    }
  }

  strategy.process(pokemon, board as any, selectedTarget as any, false)

  assert.equal(
    damageCalls.filter((call) => call.targetId === "farthestTarget").length,
    1,
    "The farthest target returned by the board helper should take the main damage"
  )
  assert.equal(
    damageCalls.filter((call) => call.targetId === "farthestTarget")[0]?.damage,
    80,
    "The main target should receive the final damage for stars 3"
  )
  assert.equal(
    damageCalls.filter((call) => call.targetId === "selectedTarget").length,
    0,
    "The selected target argument should not receive the main damage"
  )
  assert.equal(
    damageCalls.filter((call) => call.targetId === "pathEnemy").length,
    1,
    "Enemies on the path should still take damage"
  )
  assert.equal(
    damageCalls.filter((call) => call.targetId === "pathEnemy")[0]?.damage,
    30,
    "Enemies on the path should receive the path damage for stars 3"
  )

  assert.deepEqual(
    defenseChanges,
    [-1],
    "The user should lose 1 DEF per enemy hit"
  )
  assert.deepEqual(
    specialDefenseChanges,
    [-1],
    "The user should lose 1 SPE_DEF per enemy hit"
  )
  assert.equal(pokemon.defense, 9, "The user defense should be reduced")
  assert.equal(
    pokemon.specialDefense,
    9,
    "The user special defense should be reduced"
  )

  assert.ok(
    moveCalls.some((call) => call.targetId === "pathEnemy"),
    "Enemies on the path should be pushed to a new position"
  )
  assert.ok(
    moveCalls.some(
      (call) => call.targetId === "pokemon" && call.x === 3 && call.y === 3
    ),
    "The user should rush to the farthest target coordinate"
  )
  assert.equal(
    pathEnemy.cooldown,
    500,
    "Path enemies should be put on cooldown after being pushed"
  )
})
