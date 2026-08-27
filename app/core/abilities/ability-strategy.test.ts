import assert from "node:assert/strict"
import test from "node:test"
import type { BalanceParameter } from "../../config/game/balance"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

class TestAbilityStrategy extends AbilityStrategy {
  readonly config = {
    damage: {
      valuePerTier: [10, 20, 40, 80],
      apScaling: 1
    },
    chance: {
      valuePerTier: [50],
      luckScaling: true
    },
    radius: 4
  } as const

  compute(parameter: BalanceParameter, pokemon: Partial<PokemonEntity>) {
    return this.computeValue(parameter, pokemon as PokemonEntity)
  }

  computeConfig(pokemon: Partial<PokemonEntity>) {
    return this.computeConfigWithScaling(pokemon as PokemonEntity)
  }
}

const strategy = new TestAbilityStrategy()

test("computeValue resolves tiers and AP-scaled expressions", () => {
  const pokemon = { stars: 2, ap: 50, luck: 0 }

  assert.equal(strategy.compute(4, pokemon), 4)
  assert.equal(
    strategy.compute({ valuePerTier: [10, 20, 40, 80] }, pokemon),
    20
  )
  assert.equal(
    strategy.compute({ valuePerTier: [10, 20, 40, 80], apScaling: 1 }, pokemon),
    30
  )
  assert.equal(
    strategy.compute(
      { valuePerTier: [10], apScaling: 1 },
      { stars: 3, ap: 50, luck: 0 }
    ),
    15
  )
  assert.equal(
    strategy.compute(
      [
        { valuePerTier: [0.5, 1.5, 2.5, 4], nbDecimals: 1 },
        {
          valuePerTier: [0.5, 1.5, 2.5, 4],
          apScaling: 1,
          nbDecimals: 1
        }
      ],
      pokemon
    ),
    3.75
  )
})

test("computeValue supports Luck and explicit AP factors", () => {
  assert.equal(
    strategy.compute(
      { valuePerTier: [50], luckScaling: true },
      { stars: 1, ap: 0, luck: 50 }
    ),
    Math.sqrt(0.5) * 100
  )
  assert.equal(
    strategy.compute(
      { valuePerTier: [0], luckScaling: true },
      { stars: 1, ap: 0, luck: 100 }
    ),
    0
  )
  assert.equal(
    strategy.compute(
      { valuePerTier: [8, 5, 3, 1], apScaling: -0.2 },
      {
        stars: 1,
        ap: 100,
        luck: 0
      }
    ),
    6.4
  )
})

test("computeConfigWithScaling resolves every config field", () => {
  const config = strategy.computeConfig({ stars: 2, ap: 50, luck: 50 })

  assert.deepEqual(config, {
    damage: 30,
    chance: Math.sqrt(0.5) * 100,
    radius: 4
  })
})
