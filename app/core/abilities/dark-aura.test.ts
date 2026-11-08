import assert from "node:assert/strict"
import test from "node:test"
import { MapSchema } from "@colyseus/schema"
import { ARMOR_FACTOR } from "../../config"
import PokemonFactory from "../../models/pokemon-factory"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, Team } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Weather } from "../../types/enum/Weather"
import { Board } from "../board"
import {
  OnAbilityCastEffect,
  OnDamageDealtEffect,
  OnSimulationStartEffect
} from "../effects/effect"
import { FlyingProtectionEffect } from "../effects/synergies"
import { PokemonEntity } from "../pokemon-entity"
import type Simulation from "../simulation"
import { SkillSwapStrategy } from "./abilities"
import { CamouflageStrategy } from "./camouflage"
import { DarkAuraStrategy } from "./dark-aura"
import { EntrainmentStrategy } from "./entrainment"
import { RoarStrategy } from "./roar"
import { TransformStrategy } from "./transform"
import { TrickOrTreatStrategy } from "./trick-or-treat"

function setup() {
  const board = new Board(8, 8)
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
    applySynergyEffects() {},
    applyItemsEffects() {},
    broadcastToSpectators() {}
  } as unknown as Simulation
  const create = (name: Pkm, x: number, y: number, team: Team) => {
    const pokemon = PokemonFactory.createPokemonFromName(name)
    const entity = new PokemonEntity(pokemon, x, y, team, simulation)
    board.setEntityOnCell(x, y, entity)
    return entity
  }
  const yveltal = create(Pkm.YVELTAL, 3, 3, Team.BLUE_TEAM)
  const damage = (amount: number) =>
    yveltal.handleDamage({
      damage: amount,
      attackType: AttackType.TRUE,
      attacker: null,
      board,
      shouldTargetGainMana: false
    })
  return { board, create, damage, yveltal }
}

test("Yveltal and the cocoon have matching base stats", () => {
  const yveltal = PokemonFactory.createPokemonFromName(Pkm.YVELTAL)
  const cocoon = PokemonFactory.createPokemonFromName(Pkm.YVELTAL_COCOON)
  for (const stat of [
    "hp",
    "atk",
    "speed",
    "def",
    "speDef",
    "range"
  ] as const) {
    assert.equal(cocoon[stat], yveltal[stat], stat)
  }
  assert.equal(cocoon.maxPP, 10)
  assert.equal(cocoon.skill, Ability.DARK_AURA)
  assert.equal(yveltal.maxPP, 100)
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
})

test("Destruction transforms below 20%, restores at 50%, and can repeat", () => {
  const { yveltal, damage } = setup()
  yveltal.addMaxHP(100, yveltal, 0, false)
  yveltal.addAttack(5, yveltal, 0, false)
  damage(320)
  assert.equal(yveltal.hp, 80)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  damage(1)
  assert.equal(yveltal.hp, 79)
  assert.equal(yveltal.passive, Passive.COCOON_OF_DESTRUCTION)
  assert.equal(yveltal.status.tree, true)
  assert.deepEqual(
    [yveltal.maxHP, yveltal.atk, yveltal.def, yveltal.speDef, yveltal.maxPP],
    [400, 27, 12, 12, 10]
  )
  yveltal.handleHeal(120, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
  yveltal.handleHeal(1, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  assert.equal(yveltal.status.tree, false)
  assert.equal(yveltal.canMove, true)
  assert.deepEqual(
    [yveltal.hp, yveltal.atk, yveltal.def, yveltal.speDef, yveltal.maxPP],
    [200, 27, 12, 12, 100]
  )
  damage(121)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
  assert.equal(yveltal.status.tree, true)
})

test("Transformation preserves combat stats and restores Oblivion Wing and 100 max PP", () => {
  const { yveltal, damage } = setup()
  yveltal.maxPP = 85
  yveltal.skill = Ability.HEADBUTT
  yveltal.addDefense(-11, yveltal, 0, false)
  yveltal.addSpecialDefense(-12, yveltal, 0, false)
  const before = [yveltal.atk, yveltal.def, yveltal.speDef, yveltal.speed]
  damage(260)
  assert.deepEqual(
    [yveltal.atk, yveltal.def, yveltal.speDef, yveltal.speed],
    before
  )
  assert.equal(yveltal.maxPP, 10)
  assert.equal(yveltal.skill, Ability.DARK_AURA)
  yveltal.addAttack(5, yveltal, 0, false)
  yveltal.addDefense(3, yveltal, 0, false)
  const cocoonStats = [yveltal.atk, yveltal.def, yveltal.speDef, yveltal.speed]
  yveltal.handleHeal(120, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  assert.deepEqual(
    [yveltal.atk, yveltal.def, yveltal.speDef, yveltal.speed],
    cocoonStats
  )
  assert.equal(yveltal.maxPP, 100)
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
  yveltal.maxPP = 70
  yveltal.skill = Ability.OBLIVION_WING
  damage(121)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
  yveltal.handleHeal(120, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  assert.equal(yveltal.maxPP, 100)
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
})

test("Cocoon transformation removes the Efficient Bandanna max PP reduction", () => {
  const { yveltal, damage, create } = setup()
  const ally = create(Pkm.MAGIKARP, 2, 3, Team.BLUE_TEAM)
  ally.addItem(Item.EFFICIENT_BANDANNA)
  ally.getEffects(OnSimulationStartEffect).forEach((effect) => {
    effect.apply({
      simulation: ally.simulation,
      team: new MapSchema<PokemonEntity>(),
      entity: ally
    })
  })
  assert.equal(yveltal.maxPP, 85)
  damage(260)
  assert.equal(yveltal.maxPP, 10)
  yveltal.handleHeal(110, yveltal, 0, false)
  assert.equal(yveltal.maxPP, 100)
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
})

test("A lethal hit kills Yveltal without transforming into a cocoon", () => {
  for (const amount of [300, 999]) {
    const { yveltal, damage, board } = setup()
    const hit = damage(amount)
    assert.equal(hit.death, true)
    assert.equal(hit.takenDamage, 300)
    assert.equal(yveltal.hp, 0)
    assert.equal(yveltal.name, Pkm.YVELTAL)
    assert.equal(board.getEntityOnCell(3, 3), undefined)
  }
})

test("A nonlethal hit can leave the cocoon at 1 HP, then it can die", () => {
  const { yveltal, damage, board } = setup()
  const firstHit = damage(299)
  assert.equal(firstHit.death, false)
  assert.equal(firstHit.takenDamage, 299)
  assert.equal(yveltal.hp, 1)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
  assert.equal(damage(1).death, true)
  assert.equal(board.getEntityOnCell(3, 3), undefined)
})

test("A resurrection effect still triggers normally after a lethal hit", () => {
  const { yveltal, damage, board } = setup()
  yveltal.status.addResurrection(yveltal)
  assert.equal(damage(300).death, false)
  assert.equal(yveltal.hp, 0)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  assert.equal(yveltal.status.resurrecting, true)
  assert.equal(board.getEntityOnCell(3, 3), yveltal)
})

test("Resurrection from cocoon restores Yveltal and removes tree", () => {
  const { yveltal, damage } = setup()
  yveltal.maxPP = 85
  yveltal.skill = Ability.HEADBUTT
  damage(260)
  yveltal.status.addResurrection(yveltal)
  damage(40)
  assert.equal(yveltal.status.resurrecting, true)
  yveltal.status.updateResurrecting(10000, yveltal)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  assert.equal(yveltal.maxPP, 100)
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
  assert.deepEqual([yveltal.atk, yveltal.def, yveltal.speDef], [22, 12, 12])
  assert.equal(yveltal.status.tree, false)
  assert.equal(yveltal.canMove, true)
  assert.equal(yveltal.state.name, "moving")
})

test("Dark Aura scales with attack and ability power, then respects special defense", () => {
  const { yveltal, damage, board, create } = setup()
  damage(260)
  const enemy = create(Pkm.SNORLAX, 4, 3, Team.RED_TEAM)
  yveltal.ap = 100
  const expectedDamage = Math.ceil(
    ((10 + 0.5 * yveltal.atk) * 2) / (1 + ARMOR_FACTOR * enemy.speDef)
  )
  const initialHP = enemy.hp
  new DarkAuraStrategy().process(yveltal, board, null, false)
  assert.equal(initialHP - enemy.hp, expectedDamage)
})

test("The cocoon uses tree to prevent normal movement and attacks", () => {
  const { yveltal, damage } = setup()
  damage(260)
  assert.equal(yveltal.status.tree, true)
  assert.equal(yveltal.canMove, false)
  assert.equal(yveltal.canAttack, false)
  yveltal.toMovingState()
  yveltal.toAttackingState()
  assert.equal(yveltal.state.name, "idle")
})

test("Flying protection cannot trigger in cocoon form, but remains available after healing", () => {
  for (const tier of [EffectEnum.TAILWIND, EffectEnum.FEATHER_DANCE]) {
    const { yveltal, damage, create } = setup()
    create(Pkm.MAGIKARP, 7, 7, Team.RED_TEAM)
    const flying = new FlyingProtectionEffect(tier)
    yveltal.effects.add(tier)
    yveltal.effectsSet.add(flying)

    assert.equal(damage(210).takenDamage, 210)
    assert.equal(yveltal.hp, 90)
    assert.equal(yveltal.name, Pkm.YVELTAL)
    assert.equal(damage(46).takenDamage, 46)
    assert.equal(yveltal.hp, 44)
    assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
    const position = [yveltal.positionX, yveltal.positionY]
    assert.equal(damage(1).takenDamage, 1)
    assert.equal(yveltal.hp, 43)
    assert.equal(flying.flyingProtection, 1)
    assert.deepEqual([yveltal.positionX, yveltal.positionY], position)

    yveltal.handleHeal(107, yveltal, 0, false)
    assert.equal(yveltal.name, Pkm.YVELTAL)
    assert.equal(flying.flyingProtection, 1)
    assert.equal(damage(107).takenDamage, 107)
    assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
    assert.equal(flying.flyingProtection, 1)
  }
})

test("Higher Flying tiers can escape at 50%, but cocooning prevents the 20% escape", () => {
  for (const tier of [EffectEnum.MAX_AIRSTREAM, EffectEnum.SKYDIVE]) {
    const { yveltal, damage, board, create } = setup()
    yveltal.status.enrageDelay = 10000
    create(Pkm.MAGIKARP, 7, 7, Team.RED_TEAM)
    const flying = new FlyingProtectionEffect(tier)
    yveltal.effects.add(tier)
    yveltal.effectsSet.add(flying)

    assert.equal(damage(150).takenDamage, 150)
    assert.equal(damage(1).takenDamage, 1)
    assert.equal(yveltal.hp, 149)
    assert.equal(flying.flyingProtection, 2)
    assert.equal(damage(200).takenDamage, 0)
    assert.equal(yveltal.hp, 149)
    assert.equal(yveltal.name, Pkm.YVELTAL)
    assert.equal(flying.flyingProtection, 1)
    assert.equal(yveltal.status.protect, true)
    assert.notDeepEqual([yveltal.positionX, yveltal.positionY], [3, 3])
    assert.equal(yveltal.status.skydiving, tier === EffectEnum.SKYDIVE)

    yveltal.status.updateProtect(2000)
    if (tier === EffectEnum.SKYDIVE) {
      yveltal.update(1000, board, undefined)
      assert.equal(yveltal.status.skydiving, false)
    }
    assert.equal(damage(89).takenDamage, 89)
    assert.equal(yveltal.hp, 60)
    assert.equal(yveltal.name, Pkm.YVELTAL)
    assert.equal(damage(1).takenDamage, 1)
    assert.equal(yveltal.hp, 59)
    assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
    assert.equal(damage(1).takenDamage, 1)
    assert.equal(yveltal.hp, 58, tier)
    assert.equal(flying.flyingProtection, 1)
    yveltal.handleHeal(300, yveltal, 0, false)
    assert.equal(yveltal.name, Pkm.YVELTAL)
    assert.equal(flying.flyingProtection, 1)
  }
})

test("Crossing below 20% transforms Yveltal before Flying can escape", () => {
  for (const tier of [EffectEnum.TAILWIND, EffectEnum.FEATHER_DANCE]) {
    const { yveltal, damage, create } = setup()
    create(Pkm.MAGIKARP, 7, 7, Team.RED_TEAM)
    const flying = new FlyingProtectionEffect(tier)
    yveltal.effects.add(tier)
    yveltal.effectsSet.add(flying)

    assert.equal(damage(240).takenDamage, 240)
    assert.equal(damage(1).takenDamage, 1)
    assert.equal(yveltal.hp, 59)
    assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
    assert.equal(damage(20).takenDamage, 20)
    assert.equal(yveltal.hp, 39)
    assert.equal(flying.flyingProtection, 1)
    assert.deepEqual([yveltal.positionX, yveltal.positionY], [3, 3])
  }
})

test("A lethal hit from above the Flying threshold bypasses both Flying and cocoon", () => {
  for (const tier of [EffectEnum.TAILWIND, EffectEnum.MAX_AIRSTREAM]) {
    const { yveltal, damage } = setup()
    const flying = new FlyingProtectionEffect(tier)
    yveltal.effects.add(tier)
    yveltal.effectsSet.add(flying)
    const charges = flying.flyingProtection
    assert.equal(damage(300).death, true)
    assert.equal(yveltal.name, Pkm.YVELTAL)
    assert.equal(flying.flyingProtection, charges)
  }
})

test("The cocoon can be forcibly displaced like other tree entities", () => {
  const { yveltal, damage, board, create } = setup()
  damage(260)
  const caster = create(Pkm.MAGIKARP, 0, 3, Team.RED_TEAM)
  new RoarStrategy().process(caster, board, yveltal, false)
  assert.notEqual(yveltal.positionX, 3)
  assert.equal(
    board.getEntityOnCell(yveltal.positionX, yveltal.positionY),
    yveltal
  )
  assert.equal(yveltal.status.tree, true)
})

test("Dark Aura hits enemies within two tiles and heals from total damage", () => {
  const { yveltal, damage, board, create } = setup()
  damage(260)
  const near = create(Pkm.MAGIKARP, 5, 3, Team.RED_TEAM)
  const diagonal = create(Pkm.MAGIKARP, 4, 4, Team.RED_TEAM)
  const distant = create(Pkm.MAGIKARP, 6, 3, Team.RED_TEAM)
  const ally = create(Pkm.MAGIKARP, 2, 3, Team.BLUE_TEAM)
  const initial = [near.hp, diagonal.hp, distant.hp, ally.hp]
  const initialHP = yveltal.hp
  yveltal.pp = yveltal.maxPP
  new DarkAuraStrategy().process(yveltal, board, null, false)
  const dealt = initial[0] - near.hp + initial[1] - diagonal.hp
  assert.ok(dealt > 0)
  assert.equal(yveltal.hp, initialHP + 15 + Math.round(dealt * 0.75))
  assert.equal(distant.hp, initial[2])
  assert.equal(ally.hp, initial[3])
  assert.equal(yveltal.pp, 0)
})

test("Dark Aura heals without enemies and Wound prevents the healing", () => {
  const { yveltal, damage, board } = setup()
  damage(260)
  yveltal.status.wound = true
  new DarkAuraStrategy().process(yveltal, board, null, false)
  assert.equal(yveltal.hp, 40)
  yveltal.status.wound = false
  new DarkAuraStrategy().process(yveltal, board, null, false)
  assert.equal(yveltal.hp, 55)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
})

test("Dark Aura can restore Yveltal without enemies", () => {
  const { yveltal, damage, board } = setup()
  damage(260)
  yveltal.status.enrageDelay = 10000
  for (let i = 0; i < 7; i++) {
    yveltal.pp = yveltal.maxPP
    yveltal.update(i === 0 ? 0 : 500, board, undefined)
  }
  assert.equal(yveltal.hp, 145)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
  yveltal.pp = yveltal.maxPP
  yveltal.update(500, board, undefined)
  assert.equal(yveltal.hp, 160)
  assert.equal(yveltal.name, Pkm.YVELTAL)
})

test("Wound prevents healing and max HP buffs can trigger the return", () => {
  const { yveltal, damage } = setup()
  damage(260)
  yveltal.status.wound = true
  yveltal.handleHeal(200, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
  yveltal.status.wound = false
  yveltal.addMaxHP(200, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
  yveltal.addMaxHP(50, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL)
})

test("A heal during Dark Aura triggers an immediate return without interrupting the damage", () => {
  const { yveltal, damage, board, create } = setup()
  damage(260)
  const first = create(Pkm.MAGIKARP, 2, 3, Team.RED_TEAM)
  const second = create(Pkm.MAGIKARP, 4, 3, Team.RED_TEAM)
  const forms: Pkm[] = []
  yveltal.effectsSet.add(
    new OnDamageDealtEffect(({ pokemon }) => {
      forms.push(pokemon.name)
      pokemon.handleHeal(110, pokemon, 0, false)
    })
  )
  yveltal.pp = yveltal.maxPP
  new DarkAuraStrategy().process(yveltal, board, null, false)
  assert.deepEqual(forms, [Pkm.YVELTAL_COCOON, Pkm.YVELTAL])
  assert.ok(first.hp < first.maxHP && second.hp < second.maxHP)
  assert.equal(yveltal.name, Pkm.YVELTAL)
})

test("Dark Aura's own healing triggers the return after its area damage", () => {
  const { yveltal, damage, board, create } = setup()
  damage(260)
  const enemies = [
    [2, 2],
    [3, 2],
    [4, 2],
    [2, 3],
    [4, 3],
    [2, 4],
    [3, 4],
    [4, 4]
  ].map(([x, y]) => create(Pkm.MAGIKARP, x, y, Team.RED_TEAM))
  const initialHP = enemies.map((enemy) => enemy.hp)
  const cocoonHP = yveltal.hp
  new DarkAuraStrategy().process(yveltal, board, null, false)
  const dealt = enemies.reduce(
    (total, enemy, index) => total + initialHP[index] - enemy.hp,
    0
  )
  assert.equal(yveltal.hp, cocoonHP + 15 + Math.round(dealt * 0.75))
  assert.ok(yveltal.hp >= 0.5 * yveltal.maxHP)
  assert.equal(yveltal.name, Pkm.YVELTAL)
})

test("The idle cocoon casts at full PP but not while silenced or frozen", () => {
  const { yveltal, damage, board, create } = setup()
  damage(260)
  create(Pkm.MAGIKARP, 4, 3, Team.RED_TEAM)
  yveltal.pp = yveltal.maxPP
  yveltal.status.silence = true
  yveltal.status.silenceCooldown = 1000
  yveltal.update(0, board, undefined)
  assert.equal(yveltal.count.ult, 0)
  assert.equal(yveltal.status.tree, true)
  yveltal.status.silence = false
  yveltal.status.freeze = true
  yveltal.status.freezeCooldown = 1000
  yveltal.update(0, board, undefined)
  assert.equal(yveltal.count.ult, 0)
  assert.equal(yveltal.status.tree, true)
  yveltal.status.freeze = false
  yveltal.update(0, board, undefined)
  assert.equal(yveltal.count.ult, 1)
  assert.equal(yveltal.pp, 0)
  assert.equal(yveltal.status.tree, true)
  assert.equal(yveltal.state.name, "idle")
})

test("Dark Aura waits 500ms between casts even when each cast refills its PP", () => {
  const { yveltal, damage, board } = setup()
  damage(260)
  yveltal.speed = 1000
  yveltal.pp = yveltal.maxPP
  yveltal.effectsSet.add(
    new OnAbilityCastEffect((pokemon) => {
      pokemon.addPP(pokemon.maxPP, pokemon, 0, false)
    })
  )

  yveltal.update(0, board, undefined)
  assert.equal(yveltal.count.ult, 1)
  assert.equal(yveltal.pp, yveltal.maxPP)
  yveltal.update(499, board, undefined)
  assert.equal(yveltal.count.ult, 1)
  assert.equal(yveltal.pp, yveltal.maxPP)
  yveltal.toIdleState()
  yveltal.update(1, board, undefined)
  assert.equal(yveltal.count.ult, 2)
  assert.equal(yveltal.pp, yveltal.maxPP)
  yveltal.update(0, board, undefined)
  assert.equal(yveltal.count.ult, 2)
})

test("Dark Aura's cooldown continues through Yveltal's restoration and a new cocoon", () => {
  const { yveltal, damage, board } = setup()
  damage(260)
  yveltal.pp = yveltal.maxPP
  yveltal.update(0, board, undefined)
  assert.equal(yveltal.count.ult, 1)

  yveltal.handleHeal(300, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  yveltal.update(200, board, undefined)
  damage(yveltal.hp - 40)
  assert.equal(yveltal.name, Pkm.YVELTAL_COCOON)
  yveltal.pp = yveltal.maxPP
  yveltal.update(299, board, undefined)
  assert.equal(yveltal.count.ult, 1)
  yveltal.update(1, board, undefined)
  assert.equal(yveltal.count.ult, 2)
})

test("Other tree forms still leave tree when reaching full PP", () => {
  const { board, create } = setup()
  const zen = create(Pkm.GALARIAN_DARMANITAN_ZEN, 0, 0, Team.BLUE_TEAM)
  zen.status.tree = true
  zen.toIdleState()
  zen.pp = zen.maxPP
  zen.update(0, board, undefined)
  assert.equal(zen.status.tree, false)
  assert.equal(zen.state.name, "moving")
})

test("Both Yveltal forms resist Entrainment, including redirected targets", () => {
  for (const cocoon of [false, true]) {
    const { yveltal, damage, board, create } = setup()
    if (cocoon) damage(260)
    const originalSkill = yveltal.skill
    const enemy = create(Pkm.ORICORIO_BAILE, 4, 3, Team.RED_TEAM)
    new EntrainmentStrategy().process(enemy, board, yveltal, false)
    assert.equal(yveltal.skill, originalSkill)
    const alreadyEntrained = create(Pkm.MAGIKARP, 5, 3, Team.BLUE_TEAM)
    alreadyEntrained.skill = Ability.ENTRAINMENT
    const other = create(Pkm.MAGIKARP, 7, 3, Team.BLUE_TEAM)
    new EntrainmentStrategy().process(enemy, board, alreadyEntrained, false)
    assert.equal(yveltal.skill, originalSkill)
    assert.equal(other.skill, Ability.ENTRAINMENT)
  }
})

test("Dark Aura cannot be copied by Skill Swap", () => {
  const { yveltal, damage, board, create } = setup()
  damage(260)
  const caster = create(Pkm.SMEARGLE, 4, 3, Team.RED_TEAM)
  const previousSkill = caster.skill
  const previousMaxPP = caster.maxPP
  new SkillSwapStrategy().process(caster, board, yveltal, false)
  assert.equal(caster.skill, previousSkill)
  assert.equal(caster.maxPP, previousMaxPP)
  assert.equal(yveltal.skill, Ability.DARK_AURA)
})

test("Existing silence persists on entering the cocoon; tree prevents new silence", () => {
  const { yveltal, damage, board, create } = setup()
  const enemy = create(Pkm.MAGIKARP, 4, 3, Team.RED_TEAM)
  yveltal.status.triggerSilence(5000, yveltal, enemy)
  assert.equal(yveltal.status.silence, true)
  damage(260)
  assert.equal(yveltal.status.silence, true)
  yveltal.pp = yveltal.maxPP
  yveltal.update(0, board, undefined)
  assert.equal(yveltal.count.ult, 0)
  yveltal.status.updateSilence(5000)
  yveltal.status.triggerSilence(5000, yveltal, enemy)
  assert.equal(yveltal.status.silence, false)
  yveltal.update(0, board, undefined)
  assert.equal(yveltal.count.ult, 1)
})

test("Transform and Camouflage cannot copy either Yveltal form", () => {
  for (const cocoon of [false, true]) {
    const { yveltal, damage, board, create } = setup()
    if (cocoon) damage(260)
    assert.equal(yveltal.canBeCopied, false)
    const ditto = create(Pkm.DITTO, 2, 3, Team.RED_TEAM)
    const initialPassive = ditto.passive
    const initialSkill = ditto.skill
    new TransformStrategy().process(ditto, board, yveltal, false)
    assert.equal(ditto.index, PkmIndex[Pkm.DITTO])
    assert.equal(ditto.passive, initialPassive)
    assert.equal(ditto.skill, initialSkill)
    new CamouflageStrategy().process(ditto, board, yveltal, false)
    assert.equal(ditto.index, PkmIndex[Pkm.DITTO])
  }
})

test("Both Yveltal forms resist the transformation from Trick or Treat", () => {
  for (const cocoon of [false, true]) {
    const { yveltal, damage, board, create } = setup()
    const caster = create(Pkm.GOURGEIST, 4, 3, Team.RED_TEAM)
    if (cocoon) damage(260)
    const originalIndex = yveltal.index
    const originalSkill = yveltal.skill
    const stats = [yveltal.atk, yveltal.def, yveltal.speDef]
    new TrickOrTreatStrategy().process(caster, board, yveltal, false)
    assert.equal(yveltal.skill, originalSkill)
    assert.equal(yveltal.index, originalIndex)
    assert.deepEqual([yveltal.atk, yveltal.def, yveltal.speDef], stats)
    assert.equal(yveltal.commands.length, 0)
    if (!cocoon) damage(260)
    yveltal.update(11000, board, undefined)
    assert.equal(yveltal.index, PkmIndex[Pkm.YVELTAL_COCOON])
    assert.equal(yveltal.skill, Ability.DARK_AURA)
    yveltal.handleHeal(300, yveltal, 0, false)
    assert.equal(yveltal.name, Pkm.YVELTAL)
    assert.equal(yveltal.skill, Ability.OBLIVION_WING)
  }
})

test("The cocoon is immune to the transformation from Trick or Treat", () => {
  const { yveltal, damage, board, create } = setup()
  const caster = create(Pkm.GOURGEIST, 4, 3, Team.RED_TEAM)
  damage(260)
  new TrickOrTreatStrategy().process(caster, board, yveltal, false)
  assert.equal(yveltal.skill, Ability.DARK_AURA)
  assert.equal(yveltal.index, PkmIndex[Pkm.YVELTAL_COCOON])
  assert.deepEqual([yveltal.atk, yveltal.def, yveltal.speDef], [22, 12, 12])
  yveltal.handleHeal(110, yveltal, 0, false)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
  assert.deepEqual([yveltal.atk, yveltal.def, yveltal.speDef], [22, 12, 12])
  yveltal.update(11000, board, undefined)
  assert.equal(yveltal.index, PkmIndex[Pkm.YVELTAL])
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
})

test("Trick or Treat can still steal an item from either Yveltal form", () => {
  for (const cocoon of [false, true]) {
    const { yveltal, damage, board, create } = setup()
    const caster = create(Pkm.GOURGEIST, 4, 3, Team.RED_TEAM)
    if (cocoon) damage(260)
    yveltal.addItem(Item.AGUAV_BERRY)
    new TrickOrTreatStrategy().process(caster, board, yveltal, false)
    assert.equal(yveltal.items.has(Item.AGUAV_BERRY), false)
    assert.equal(caster.items.has(Item.AGUAV_BERRY), true)
  }
})

test("Trick or Treat still transforms and restores other Pokemon", () => {
  const { board, create } = setup()
  const caster = create(Pkm.GOURGEIST, 4, 3, Team.RED_TEAM)
  const target = create(Pkm.SNORLAX, 3, 3, Team.BLUE_TEAM)
  const originalSkill = target.skill
  const stats = [target.atk, target.def, target.speDef]
  new TrickOrTreatStrategy().process(caster, board, target, false)
  assert.equal(target.index, PkmIndex[Pkm.MAGIKARP])
  assert.equal(target.skill, Ability.SPLASH)
  target.update(3001, board, undefined)
  assert.equal(target.index, PkmIndex[Pkm.SNORLAX])
  assert.equal(target.skill, originalSkill)
  assert.deepEqual([target.atk, target.def, target.speDef], stats)
})

test("Resurrection restores Yveltal after the cocoon resists Trick or Treat", () => {
  const { yveltal, damage, board, create } = setup()
  const caster = create(Pkm.GOURGEIST, 4, 3, Team.RED_TEAM)
  damage(260)
  new TrickOrTreatStrategy().process(caster, board, yveltal, false)
  yveltal.status.addResurrection(yveltal)
  damage(40)
  yveltal.status.updateResurrecting(10000, yveltal)
  assert.equal(yveltal.name, Pkm.YVELTAL)
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
  yveltal.update(11000, board, undefined)
  assert.equal(yveltal.index, PkmIndex[Pkm.YVELTAL])
  assert.equal(yveltal.skill, Ability.OBLIVION_WING)
})
