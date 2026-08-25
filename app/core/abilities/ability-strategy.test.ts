import assert from "node:assert/strict"
import test from "node:test"
import type { AbilityConfigValue } from "../../config/game/abilities"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

class TestAbilityStrategy extends AbilityStrategy {
  compute(value: AbilityConfigValue, pokemon: Partial<PokemonEntity>) {
    return this.computeValue(value, pokemon as PokemonEntity)
  }
}

const strategy = new TestAbilityStrategy()

test("computeValue resolves tiers and AP-scaled expressions", () => {
  const pokemon = { stars: 2, ap: 50, luck: 0 }

  assert.equal(strategy.compute(4, pokemon), 4)
  assert.equal(strategy.compute("[10,20,40,80]", pokemon), 20)
  assert.equal(strategy.compute("[10,20,40,80,SP]", pokemon), 30)
  assert.equal(strategy.compute("[10,SP]", { stars: 3, ap: 50, luck: 0 }), 15)
  assert.equal(
    strategy.compute("[0.5,1.5,2.5,4,ND=1] + [0.5,1.5,2.5,4,SP,ND=1]", pokemon),
    3.75
  )
})

test("computeValue supports Luck and explicit AP factors", () => {
  assert.equal(
    strategy.compute("[50,LK]", { stars: 1, ap: 0, luck: 50 }),
    Math.sqrt(0.5) * 100
  )
  assert.equal(
    strategy.compute("[8,5,3,1,SP=-0.2]", {
      stars: 1,
      ap: 100,
      luck: 0
    }),
    6.4
  )
})
