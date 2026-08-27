import assert from "node:assert/strict"
import test from "node:test"
import { renderBalance } from "./balance-display"
import jsxTextContent from "./jsx"

const stats = { stars: 2, stages: 3, ap: 50, luck: 50 }

test("renders tier, AP, Luck, constant, and composed values", () => {
  assert.equal(
    jsxTextContent(
      renderBalance({ valuePerTier: [10, 20, 40, 80], apScaling: 1 }, stats)
    ),
    "30"
  )
  assert.equal(
    jsxTextContent(
      renderBalance({ valuePerTier: [50], luckScaling: true }, stats)
    ),
    "71"
  )
  assert.equal(jsxTextContent(renderBalance(4, stats)), "4")
  assert.equal(
    jsxTextContent(
      renderBalance(
        [
          { valuePerTier: [0.5, 1.5, 2.5, 4], nbDecimals: 1 },
          {
            valuePerTier: [0.5, 1.5, 2.5, 4],
            apScaling: 1,
            nbDecimals: 1
          }
        ],
        stats
      )
    ),
    "1.5 + 2.3"
  )
})
