import assert from "node:assert/strict"
import test from "node:test"
import { Board } from "./board"

test("getBestLine selects the line with the most matching cells", () => {
  const board = new Board(5, 5)
  const matching = new Set(["2,1", "3,2", "4,3", "0,2"])
  const line = board.getBestLine(1, 0, ({ x, y }) => matching.has(`${x},${y}`))
  assert.deepEqual(
    line.map(({ x, y }) => [x, y]),
    [[1, 0], [2, 1], [3, 2], [4, 3]]
  )
})

test("getBestLine uses the preferred matching cell to break ties", () => {
  const board = new Board(5, 5)
  const matching = new Set(["2,0", "0,2"])
  const line = board.getBestLine(
    0,
    0,
    ({ x, y }) => matching.has(`${x},${y}`),
    ({ x, y }) => x === 0 && y === 2
  )
  assert.deepEqual(line.at(-1), { x: 0, y: 4, value: undefined })
  assert.ok(line.some(({ x, y }) => x === 0 && y === 2))
})

test("getBestLine returns no line when no cells match", () => {
  const board = new Board(5, 5)
  assert.deepEqual(board.getBestLine(2, 2, () => false), [])
})
