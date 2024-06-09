/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { MapSchema, Schema, SetSchema, type } from "@colyseus/schema"
import { nanoid } from "nanoid"
import {
  ConditionBasedEvolutionRule,
  CountEvolutionRule,
  EvolutionRule,
  HatchEvolutionRule,
  ItemEvolutionRule
} from "../../core/evolution-rules"
import Simulation from "../../core/simulation"
import GameState from "../../rooms/states/game-state"
import {
  AttackSprite,
  Emotion,
  IPlayer,
  IPokemon,
  IPokemonEntity,
  Title
} from "../../types"
import {
  DEFAULT_ATK_SPEED,
  DEFAULT_CRIT_CHANCE,
  DEFAULT_CRIT_POWER,
  EvolutionTime,
  ItemStats,
  SynergyTriggers
} from "../../types/Config"
import { Ability } from "../../types/enum/Ability"
import { DungeonDetails, DungeonPMDO } from "../../types/enum/Dungeon"
import {
  AttackType,
  PokemonActionState,
  Rarity,
  Stat
} from "../../types/enum/Game"
import {
  AllItems,
  ArtificialItems,
  Berries,
  Item,
  ItemComponents,
  ItemRecipe,
  SynergyGivenByItem,
  SynergyItems
} from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { Weather } from "../../types/enum/Weather"
import { sum } from "../../utils/array"
import { getFirstAvailablePositionInBench } from "../../utils/board"
import { distanceM } from "../../utils/distance"
import { pickRandomIn } from "../../utils/random"
import { values } from "../../utils/schemas"
import PokemonFactory from "../pokemon-factory"
import Player from "./player"

export class Pokemon extends Schema implements IPokemon {
  @type("string") id: string
  @type("string") name: Pkm
  @type({ set: "string" }) types = new SetSchema<Synergy>()
  @type("string") rarity: Rarity = Rarity.SPECIAL
  @type("string") index: string
  @type("string") evolution: Pkm = Pkm.DEFAULT
  @type("int8") positionX = -1
  @type("int8") positionY = -1
  @type("string") attackSprite: AttackSprite = AttackSprite.NORMAL_MELEE
  @type("float32") atkSpeed = DEFAULT_ATK_SPEED
  @type("uint8") def: number = 1
  @type("uint8") speDef: number = 1
  @type("uint8") attackType: AttackType = AttackType.PHYSICAL
  @type("uint16") atk: number = 1
  @type("uint16") hp: number = 10
  @type("uint8") range: number = 1
  @type("uint8") stars: number = 1
  @type("uint8") maxPP: number = 100
  @type("string") skill: Ability = Ability.DEFAULT
  @type("string") passive: Passive = Passive.NONE
  @type({ set: "string" }) items = new SetSchema<Item>()
  @type("boolean") shiny: boolean
  @type("string") emotion: Emotion
  @type("string") action: PokemonActionState = PokemonActionState.IDLE
  evolutionRule: EvolutionRule = new CountEvolutionRule(3)
  additional = false
  regional = false
  canHoldItems = true
  stages?: number

  constructor(shiny = false, emotion = Emotion.NORMAL) {
    super()
    const name = Object.entries(PokemonClasses).find(
      ([name, pokemonClass]) => pokemonClass === this.constructor
    )?.[0] as Pkm
    this.id = nanoid()
    this.name = name
    this.index = PkmIndex[name]
    this.shiny = shiny
    this.emotion = emotion
  }

  get final(): boolean {
    /* true if should be excluded from shops when obtained */
    return (
      this.evolution === Pkm.DEFAULT ||
      (this.evolutionRule instanceof CountEvolutionRule === false &&
        this.passive !== Passive.CORSOLA)
    )
  }

  get canBePlaced(): boolean {
    return ![Pkm.EGG].includes(this.name)
  }

  get canBeCloned(): boolean {
    return (
      this.rarity !== Rarity.UNIQUE &&
      this.rarity !== Rarity.LEGENDARY &&
      this.rarity !== Rarity.HATCH &&
      ![Pkm.DITTO, Pkm.EGG].includes(this.name)
    )
  }

  onChangePosition(x: number, y: number, player: Player) {
    // called after manually changing position of the pokemon on board
  }

  onAcquired(player: Player) {
    // called after buying or picking the mon
  }

  onEvolve(params: {
    pokemonEvolved: Pokemon
    pokemonsBeforeEvolution: Pokemon[]
    player: Player
  }) {
    if (params.pokemonEvolved instanceof Garbodor) {
      const garbodor: Garbodor = params.pokemonEvolved as Garbodor
    }
    // called after evolving
  }

  beforeSimulationStart(params: {
    weather: Weather
    player: Player
  }) {
    // called at simulation start before entities are generated
  }

  afterSimulationStart(params: {
    player: IPlayer
    simulation: Simulation
    team: MapSchema<IPokemonEntity>
    entity: IPokemonEntity
  }) {
    // called at simulation start after entities are generated
  }

  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.some((s) => new PokemonClasses[pkm]().types.has(s))
  }
}

export function isOnBench(pokemon: Pokemon): boolean {
  return pokemon.positionY === 0
}

export class Ditto extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AMORPHOUS])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 50
  atk = 5
  def = 1
  speDef = 1
  maxPP = 50
  range = 1
  skill = Ability.TRANSFORM
  passive = Passive.DITTO
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Substitute extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 80
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Egg extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 30
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  passive = Passive.EGG
  attackSprite = AttackSprite.NORMAL_MELEE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EGG_HATCH)
  canHoldItems = false
}

export class Electrike extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.MANECTRIC
  hp = 120
  atk = 15
  def = 5
  speDef = 5
  maxPP = 60
  range = 1
  skill = Ability.VOLT_SWITCH
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Manectric extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_MANECTRIC
  hp = 210
  atk = 30
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.VOLT_SWITCH
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class MegaManectric extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 48
  def = 7
  speDef = 7
  maxPP = 60
  range = 1
  skill = Ability.VOLT_SWITCH
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Shuppet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.BANETTE
  hp = 120
  atk = 10
  def = 3
  speDef = 4
  maxPP = 125
  range = 1
  skill = Ability.SHADOW_CLONE
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Banette extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_BANETTE
  hp = 200
  atk = 20
  def = 4
  speDef = 5
  maxPP = 125
  range = 1
  skill = Ability.SHADOW_CLONE
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class MegaBanette extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 6
  maxPP = 125
  range = 1
  skill = Ability.SHADOW_CLONE
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Riolu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIGHTING,
    Synergy.STEEL,
    Synergy.BABY
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LUCARIO
  hp = 65
  atk = 7
  def = 2
  speDef = 2
  maxPP = 80
  range = 2
  skill = Ability.AURASPHERE
  attackSprite = AttackSprite.FIGHTING_RANGE
  additional = true
}

export class Lucario extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.STEEL])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 20
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.AURASPHERE
  attackSprite = AttackSprite.FIGHTING_RANGE
  additional = true
}

export class Crabrawler extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.FIGHTING,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CRABOMINABLE
  hp = 90
  atk = 9
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ICE_HAMMER
  attackSprite = AttackSprite.FIGHTING_MELEE
  additional = true
  passive = Passive.BERRY_EATER
}

export class Crabominable extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.FIGHTING,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 220
  atk = 22
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.ICE_HAMMER
  attackSprite = AttackSprite.FIGHTING_MELEE
  additional = true
  passive = Passive.BERRY_EATER
}

export class Cutiefly extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.RIBOMBEE
  hp = 75
  atk = 6
  def = 1
  speDef = 1
  maxPP = 40
  range = 2
  skill = Ability.POLLEN_PUFF
  attackSprite = AttackSprite.BUG_RANGE
  regional = true
}

export class Ribombee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 12
  def = 2
  speDef = 2
  maxPP = 40
  range = 2
  skill = Ability.POLLEN_PUFF
  attackSprite = AttackSprite.BUG_RANGE
  regional = true
}

export class Nickit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIELD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.THIEVUL
  hp = 75
  atk = 8
  def = 1
  speDef = 1
  maxPP = 50
  range = 2
  skill = Ability.THIEF
  attackSprite = AttackSprite.NORMAL_MELEE
  additional = true
}

export class Thievul extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIELD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 19
  def = 2
  speDef = 2
  maxPP = 50
  range = 2
  skill = Ability.THIEF
  attackSprite = AttackSprite.NORMAL_MELEE
  additional = true
}

export class Swablu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.ALTARIA
  hp = 120
  atk = 12
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.HYPER_VOICE
  attackSprite = AttackSprite.DRAGON_RANGE
}

export class Altaria extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_ALTARIA
  hp = 190
  atk = 25
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.HYPER_VOICE
  attackSprite = AttackSprite.DRAGON_RANGE
}

export class MegaAltaria extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 42
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.HYPER_VOICE
  attackSprite = AttackSprite.DRAGON_RANGE
}

export class Scyther extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  stars = 3
  evolution = Pkm.SCIZOR
  evolutionRule = new ItemEvolutionRule([Item.METAL_COAT])
  hp = 190
  atk = 19
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.X_SCISSOR
  attackSprite = AttackSprite.NORMAL_MELEE
  passive = Passive.SCYTHER
}

export class Scizor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 190
  atk = 25
  def = 7
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.X_SCISSOR
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class MegaScizor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 48
  def = 7
  speDef = 7
  maxPP = 80
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Bounsweet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.STEENEE
  hp = 100
  atk = 10
  def = 4
  speDef = 4
  maxPP = 120
  range = 1
  skill = Ability.HIGH_JUMP_KICK
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Steenee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.TSAREENA
  hp = 180
  atk = 20
  def = 5
  speDef = 5
  maxPP = 120
  range = 1
  skill = Ability.HIGH_JUMP_KICK
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Tsareena extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 3
  hp = 360
  atk = 34
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.HIGH_JUMP_KICK
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Buneary extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIGHTING])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.LOPUNNY
  hp = 130
  atk = 15
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.HIGH_JUMP_KICK
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Lopunny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIGHTING])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_LOPUNNY
  hp = 250
  atk = 28
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.HIGH_JUMP_KICK
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class MegaLopunny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIGHTING])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 350
  atk = 50
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.HIGH_JUMP_KICK
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Onix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.STEELIX
  hp = 200
  atk = 9
  def = 10
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.SPIKE_ARMOR
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Steelix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_STEELIX
  hp = 250
  atk = 14
  def = 20
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.SPIKE_ARMOR
  attackSprite = AttackSprite.ROCK_MELEE
}

export class MegaSteelix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 350
  atk = 20
  def = 30
  speDef = 15
  maxPP = 100
  range = 1
  skill = Ability.SPIKE_ARMOR
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Numel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.CAMERUPT
  hp = 130
  atk = 9
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.ERUPTION
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Camerupt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_CAMERUPT
  hp = 220
  atk = 14
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.ERUPTION
  attackSprite = AttackSprite.FIRE_MELEE
}

export class MegaCamerupt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 330
  atk = 22
  def = 15
  speDef = 15
  maxPP = 100
  range = 1
  skill = Ability.ERUPTION
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Meditite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.MEDICHAM
  hp = 80
  atk = 9
  def = 4
  speDef = 4
  maxPP = 60
  range = 2
  skill = Ability.CONFUSION
  attackSprite = AttackSprite.PSYCHIC_RANGE
  additional = true
  stages = 2
}

export class Medicham extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 160
  atk = 17
  def = 6
  speDef = 6
  maxPP = 60
  range = 2
  skill = Ability.CONFUSION
  attackSprite = AttackSprite.PSYCHIC_RANGE
  additional = true
  stages = 2
}

export class MegaMedicham extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 35
  def = 7
  speDef = 7
  maxPP = 60
  range = 2
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Elekid extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ARTIFICIAL,
    Synergy.BABY
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.ELECTABUZZ
  hp = 110
  atk = 5
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.DISCHARGE
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Electabuzz extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ARTIFICIAL,
    Synergy.LIGHT
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.ELECTIVIRE
  hp = 180
  atk = 16
  def = 5
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.DISCHARGE
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Electivire extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ARTIFICIAL,
    Synergy.LIGHT
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 380
  atk = 28
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.DISCHARGE
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Gible extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GABITE
  hp = 100
  atk = 6
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_BREATH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Gabite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.GARCHOMP
  hp = 160
  atk = 14
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_BREATH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Garchomp extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 240
  atk = 32
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_BREATH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Beldum extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.METANG
  hp = 110
  atk = 5
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.METEOR_MASH
  attackSprite = AttackSprite.PSYCHIC_MELEE
}

export class Metang extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.METAGROSS
  hp = 190
  atk = 9
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.METEOR_MASH
  attackSprite = AttackSprite.PSYCHIC_MELEE
}

export class Metagross extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 320
  atk = 20
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.METEOR_MASH
  attackSprite = AttackSprite.PSYCHIC_MELEE
}

export class Tympole extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.GROUND,
    Synergy.SOUND
  ])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.PALPITOAD
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 80
  atk = 7
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.SLUDGE_WAVE
  passive = Passive.HATCH
  attackSprite = AttackSprite.WATER_MELEE
}

export class Palpitoad extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.GROUND,
    Synergy.SOUND
  ])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.SEISMITOAD
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 130
  atk = 17
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.SLUDGE_WAVE
  passive = Passive.HATCH
  attackSprite = AttackSprite.WATER_MELEE
}

export class Seismitoad extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.GROUND,
    Synergy.SOUND
  ])
  rarity = Rarity.HATCH
  stars = 3
  hp = 210
  atk = 22
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.SLUDGE_WAVE
  attackSprite = AttackSprite.WATER_MELEE
}

export class Bagon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SHELGON
  hp = 70
  atk = 6
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Shelgon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.SALAMENCE
  hp = 130
  atk = 12
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Salamence extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.MONSTER,
    Synergy.FLYING
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 22
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_DARTS
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Ralts extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.HUMAN
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.KIRLIA
  hp = 90
  atk = 5
  def = 2
  speDef = 4
  maxPP = 110
  range = 3
  skill = Ability.FUTURE_SIGHT
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Kirlia extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.HUMAN
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.GARDEVOIR
  hp = 130
  atk = 13
  def = 3
  speDef = 5
  maxPP = 110
  range = 3
  skill = Ability.FUTURE_SIGHT
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Gardevoir extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.HUMAN
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 230
  atk = 28
  def = 4
  speDef = 8
  maxPP = 110
  range = 3
  skill = Ability.FUTURE_SIGHT
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Fuecoco extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.SOUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.CROCALOR
  hp = 110
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.TORCH_SONG
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Crocalor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.SOUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.SKELEDIRGE
  hp = 170
  atk = 13
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.TORCH_SONG
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Skeledirge extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.SOUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 3
  hp = 350
  atk = 24
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.TORCH_SONG
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Budew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.BABY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.ROSELIA
  hp = 90
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 3
  skill = Ability.PETAL_DANCE
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Roselia extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.ROSERADE
  hp = 130
  atk = 16
  def = 1
  speDef = 1
  maxPP = 100
  range = 3
  skill = Ability.PETAL_DANCE
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Roserade extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 3
  hp = 230
  atk = 18
  def = 1
  speDef = 1
  maxPP = 100
  range = 3
  skill = Ability.PETAL_DANCE
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Slakoth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.VIGOROTH
  hp = 130
  atk = 6
  def = 5
  speDef = 4
  maxPP = 120
  range = 1
  skill = Ability.SLACK_OFF
  attackSprite = AttackSprite.NORMAL_MELEE
  regional = true
}

export class Vigoroth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.SLAKING
  hp = 220
  atk = 18
  def = 5
  speDef = 4
  maxPP = 120
  range = 1
  skill = Ability.SLACK_OFF
  attackSprite = AttackSprite.NORMAL_MELEE
  regional = true
}

export class Slaking extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 3
  hp = 380
  atk = 34
  def = 7
  speDef = 5
  maxPP = 120
  range = 1
  skill = Ability.SLACK_OFF
  attackSprite = AttackSprite.NORMAL_MELEE
  regional = true
}

export class Honedge extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.DOUBLADE
  hp = 85
  atk = 6
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.KING_SHIELD
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Doublade extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.AEGISLASH
  hp = 130
  atk = 13
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.KING_SHIELD
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Aegislash extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 23
  def = 7
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.KING_SHIELD
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Oshawott extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.FIELD,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DEWOTT
  hp = 90
  atk = 8
  def = 4
  speDef = 4
  maxPP = 120
  range = 1
  skill = Ability.AQUA_TAIL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Dewott extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.FIELD,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.SAMUROTT
  hp = 150
  atk = 15
  def = 6
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.AQUA_TAIL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Samurott extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.FIELD,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 260
  atk = 32
  def = 8
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.AQUA_TAIL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Larvitar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.PUPITAR
  hp = 75
  atk = 7
  def = 4
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.BITE
  attackSprite = AttackSprite.DARK_MELEE
}

export class Pupitar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.TYRANITAR
  hp = 130
  atk = 14
  def = 6
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.BITE
  attackSprite = AttackSprite.DARK_MELEE
}

export class Tyranitar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.RARE
  stars = 3
  hp = 210
  atk = 28
  def = 8
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.BITE
  attackSprite = AttackSprite.DARK_MELEE
}

export class JangmoO extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FIGHTING,
    Synergy.SOUND
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HAKAMO_O
  hp = 100
  atk = 6
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  attackSprite = AttackSprite.DRAGON_MELEE
  regional = true
}

export class HakamoO extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FIGHTING,
    Synergy.SOUND
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.KOMMO_O
  hp = 160
  atk = 13
  def = 5
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  attackSprite = AttackSprite.DRAGON_MELEE
  regional = true
}

export class KommoO extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FIGHTING,
    Synergy.SOUND
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 280
  atk = 25
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  attackSprite = AttackSprite.DRAGON_MELEE
  regional = true
}

export class Gastly extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.POISON,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.HAUNTER
  hp = 90
  atk = 14
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.NIGHTMARE
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Haunter extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.POISON,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.GENGAR
  hp = 180
  atk = 25
  def = 4
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.NIGHTMARE
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Gengar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.POISON,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 350
  atk = 40
  def = 5
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.NIGHTMARE
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Abra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.KADABRA
  hp = 90
  atk = 5
  def = 2
  speDef = 4
  maxPP = 50
  range = 4
  skill = Ability.TELEPORT
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Kadabra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.ALAKAZAM
  hp = 130
  atk = 10
  def = 3
  speDef = 5
  maxPP = 50
  range = 4
  skill = Ability.TELEPORT
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Alakazam extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 22
  def = 4
  speDef = 8
  maxPP = 50
  range = 4
  skill = Ability.TELEPORT
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Litwick extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.LAMPENT
  hp = 50
  atk = 4
  def = 1
  speDef = 1
  maxPP = 100
  range = 3
  skill = Ability.HEX
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Lampent extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.CHANDELURE
  hp = 90
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 3
  skill = Ability.HEX
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Chandelure extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.COMMON
  stars = 3
  hp = 160
  atk = 15
  def = 1
  speDef = 1
  maxPP = 100
  range = 3
  skill = Ability.HEX
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Porygon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.PSYCHIC,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.PORYGON_2
  hp = 100
  atk = 7
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.TRI_ATTACK
  passive = Passive.PORYGON
  additional = true
  attackSprite = AttackSprite.FIGHTING_RANGE
}

export class Porygon2 extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.PSYCHIC,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.PORYGON_Z
  hp = 185
  atk = 14
  evolutionRule = new ItemEvolutionRule([Item.UPGRADE])
  def = 5
  speDef = 5
  maxPP = 90
  range = 2
  skill = Ability.TRI_ATTACK
  passive = Passive.PORYGON
  additional = true
  attackSprite = AttackSprite.FIGHTING_RANGE
}

export class PorygonZ extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.PSYCHIC,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 185
  atk = 24
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.TRI_ATTACK
  additional = true
  attackSprite = AttackSprite.FIGHTING_RANGE
}

export class Sewaddle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.SWADLOON
  hp = 140
  atk = 14
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.MANTIS_BLADES
  attackSprite = AttackSprite.BUG_MELEE
}

export class Swadloon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.LEAVANNY
  hp = 280
  atk = 24
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.MANTIS_BLADES
  attackSprite = AttackSprite.BUG_MELEE
}

export class Leavanny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 400
  atk = 44
  def = 8
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.MANTIS_BLADES
  attackSprite = AttackSprite.BUG_MELEE
}

export class Turtwig extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.GROUND, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.GROTLE
  hp = 80
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.GROWTH
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Grotle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.GROUND, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.TORTERRA
  hp = 150
  atk = 9
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.GROWTH
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Torterra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.GROUND, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 3
  hp = 280
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.GROWTH
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Deino extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.ZWEILOUS
  hp = 80
  atk = 6
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.DARK_HARVEST
  attackSprite = AttackSprite.DARK_RANGE
  regional = true
}

export class Zweilous extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.HYDREIGON
  hp = 130
  atk = 12
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.DARK_HARVEST
  attackSprite = AttackSprite.DARK_RANGE
  regional = true
}

export class Hydreigon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 22
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.DARK_HARVEST
  attackSprite = AttackSprite.DARK_RANGE
  regional = true
}

export class Poliwag extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIGHTING
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.POLIWHIRL
  hp = 65
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.SOAK
  attackSprite = AttackSprite.WATER_RANGE
}

export class Poliwhirl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIGHTING
  ])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.POLITOED
  hp = 120
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.SOAK
  passive = Passive.TADPOLE
  attackSprite = AttackSprite.WATER_RANGE

  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: Player) => {
      if (
        Math.max(
          ...values(player.board)
            .filter((pkm) => pkm.index === this.index)
            .map((v) => v.positionY)
        ) === 3
      ) {
        return Pkm.POLIWRATH
      } else {
        return Pkm.POLITOED
      }
    }
  )
}

export class Politoed extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.SOUND
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 18
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.SOAK
  attackSprite = AttackSprite.WATER_RANGE
}

export class Poliwrath extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIGHTING
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 18
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.CRABHAMMER
  attackSprite = AttackSprite.WATER_MELEE
}

export class Magby extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.HUMAN, Synergy.BABY])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MAGMAR
  hp = 80
  atk = 5
  def = 1
  speDef = 1
  maxPP = 80
  range = 2
  skill = Ability.HEAT_WAVE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Magmar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.MAGMORTAR
  hp = 140
  atk = 14
  def = 2
  speDef = 2
  maxPP = 80
  range = 2
  skill = Ability.HEAT_WAVE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Magmortar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 3
  hp = 280
  atk = 26
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.HEAT_WAVE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Solosis extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.DUOSION
  hp = 100
  atk = 5
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.PSYCHIC
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Duosion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.REUNICLUS
  hp = 200
  atk = 9
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.PSYCHIC
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Reuniclus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 18
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.PSYCHIC
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Shinx extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LUXIO
  hp = 80
  atk = 6
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.THUNDER_FANG
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Luxio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.LUXRAY
  hp = 130
  atk = 14
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.THUNDER_FANG
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Luxray extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 3
  hp = 220
  atk = 32
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.THUNDER_FANG
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Cubone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.MAROWAK
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: Player) => {
      if (player.regionalPokemons.includes(Pkm.ALOLAN_MAROWAK))
        return Pkm.ALOLAN_MAROWAK
      else return Pkm.MAROWAK
    }
  )
  hp = 110
  atk = 10
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.BONEMERANG
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Marowak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 20
  def = 6
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.BONEMERANG
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class AlolanMarowak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.FIRE, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 3
  hp = 250
  atk = 26
  def = 8
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.BONEMERANG
  regional = true
  attackSprite = AttackSprite.FIRE_MELEE
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.CUBONE)) &&
      regionSynergies.includes(Synergy.FIRE)
    )
  }
}

export class Axew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON])
  rarity = Rarity.HATCH
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  stars = 1
  evolution = Pkm.FRAXURE
  hp = 80
  atk = 10
  def = 1
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.OUTRAGE
  passive = Passive.HATCH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Fraxure extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON])
  rarity = Rarity.HATCH
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  stars = 2
  evolution = Pkm.HAXORUS
  hp = 130
  atk = 20
  def = 2
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.OUTRAGE
  passive = Passive.HATCH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Haxorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON])
  rarity = Rarity.HATCH
  stars = 3
  hp = 200
  atk = 30
  def = 4
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.OUTRAGE
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Dratini extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.DRAGONAIR
  hp = 80
  atk = 5
  def = 4
  speDef = 4
  maxPP = 110
  range = 1
  skill = Ability.DRAGON_BREATH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Dragonair extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.DRAGONITE
  hp = 120
  atk = 13
  def = 5
  speDef = 5
  maxPP = 110
  range = 1
  skill = Ability.DRAGON_BREATH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Dragonite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 250
  atk = 23
  def = 6
  speDef = 6
  maxPP = 110
  range = 1
  skill = Ability.DRAGON_BREATH
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Goomy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SLIGOO
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: Player) => {
      if (player.regionalPokemons.includes(Pkm.HISUI_SLIGGOO))
        return Pkm.HISUI_SLIGGOO
      else return Pkm.SLIGOO
    }
  )
  hp = 90
  atk = 6
  def = 4
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.LIQUIDATION
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Sligoo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.GOODRA
  hp = 160
  atk = 12
  def = 5
  speDef = 7
  maxPP = 80
  range = 1
  skill = Ability.LIQUIDATION
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Goodra extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 26
  def = 6
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.LIQUIDATION
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class HisuiSliggoo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.STEEL,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.GOODRA
  hp = 160
  atk = 12
  def = 7
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.SHELTER
  attackSprite = AttackSprite.STEEL_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.STEEL)
  }
}

export class HisuiGoodra extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.STEEL,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 26
  def = 10
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.SHELTER
  attackSprite = AttackSprite.STEEL_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.STEEL)
  }
}

export class Lotad extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LOMBRE
  hp = 60
  atk = 6
  def = 1
  speDef = 1
  maxPP = 120
  range = 3
  skill = Ability.TORMENT
  attackSprite = AttackSprite.GRASS_RANGE
  regional = true
}

export class Lombre extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.LUDICOLO
  hp = 110
  atk = 12
  def = 2
  speDef = 2
  maxPP = 120
  range = 3
  skill = Ability.TORMENT
  attackSprite = AttackSprite.GRASS_RANGE
  regional = true
}

export class Ludicolo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 220
  atk = 22
  def = 3
  speDef = 3
  maxPP = 120
  range = 3
  skill = Ability.TORMENT
  attackSprite = AttackSprite.GRASS_RANGE
  regional = true
}

export class Togepi extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.NORMAL, Synergy.BABY])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.TOGETIC
  hp = 80
  atk = 5
  def = 1
  speDef = 1
  maxPP = 70
  range = 2
  skill = Ability.WISH
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Togetic extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.NORMAL,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.TOGEKISS
  hp = 150
  atk = 11
  def = 1
  speDef = 1
  maxPP = 70
  range = 2
  skill = Ability.WISH
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Togekiss extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.NORMAL,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 260
  atk = 25
  def = 1
  speDef = 1
  maxPP = 70
  range = 2
  skill = Ability.WISH
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Rhyhorn extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.MONSTER,
    Synergy.ROCK
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.RHYDON
  hp = 80
  atk = 5
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.STOMP
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Rhydon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.MONSTER,
    Synergy.ROCK
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.RHYPERIOR
  hp = 130
  atk = 9
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.STOMP
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Rhyperior extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.MONSTER,
    Synergy.ROCK
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 220
  atk = 20
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.STOMP
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Aron extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.LAIRON
  hp = 60
  atk = 4
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HEAVY_SLAM
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Lairon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.AGGRON
  hp = 100
  atk = 9
  def = 4
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.HEAVY_SLAM
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Aggron extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 170
  atk = 19
  def = 6
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.HEAVY_SLAM
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Whismur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LOUDRED
  hp = 90
  atk = 6
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.ECHO
  attackSprite = AttackSprite.SOUND_RANGE
}
export class Loudred extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.EXPLOUD
  hp = 150
  atk = 14
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.ECHO
  attackSprite = AttackSprite.SOUND_RANGE
}

export class Exploud extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 3
  hp = 300
  atk = 24
  def = 3
  speDef = 3
  maxPP = 90
  range = 2
  skill = Ability.ECHO
  attackSprite = AttackSprite.SOUND_RANGE
}

export class Swinub extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.PILOSWINE
  hp = 65
  atk = 4
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
  attackSprite = AttackSprite.ICE_MELEE
}

export class Piloswine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.MAMOSWINE
  hp = 120
  atk = 8
  def = 5
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
  attackSprite = AttackSprite.ICE_MELEE
}

export class Mamoswine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 14
  def = 8
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
  attackSprite = AttackSprite.ICE_MELEE
}

export class Snover extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ICE, Synergy.MONSTER])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.ABOMASNOW
  hp = 130
  atk = 12
  def = 6
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.SHEER_COLD
  attackSprite = AttackSprite.ICE_MELEE
}

export class Abomasnow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ICE, Synergy.MONSTER])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_ABOMASNOW
  hp = 260
  atk = 24
  def = 8
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.SHEER_COLD
  attackSprite = AttackSprite.ICE_MELEE
}

export class MegaAbomasnow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ICE, Synergy.MONSTER])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 400
  atk = 35
  def = 10
  speDef = 10
  maxPP = 120
  range = 1
  skill = Ability.SHEER_COLD
  attackSprite = AttackSprite.ICE_MELEE
}

export class Snorunt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GLALIE
  hp = 90
  atk = 8
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.ICY_WIND
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Glalie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.FROSLASS
  hp = 170
  atk = 17
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.ICY_WIND
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Froslass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 3
  hp = 350
  atk = 28
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.ICY_WIND
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Vanillite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.ICE,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.VANILLISH
  hp = 70
  atk = 5
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.SLEEP
  attackSprite = AttackSprite.ICE_RANGE
}

export class Vanillish extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.ICE,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.VANILLUXE
  hp = 130
  atk = 9
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.SLEEP
  attackSprite = AttackSprite.ICE_RANGE
}

export class Vanilluxe extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.ICE,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 21
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.SLEEP
  attackSprite = AttackSprite.ICE_RANGE
}

export class Trapinch extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.VIBRAVA
  hp = 80
  atk = 8
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_TAIL
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Vibrava extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.FLYGON
  hp = 120
  atk = 13
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_TAIL
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Flygon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 3
  hp = 180
  atk = 26
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_TAIL
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Pichu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FAIRY,
    Synergy.BABY
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.PIKACHU
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.NUZZLE
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Pikachu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.RAICHU
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: Player) => {
      if (player.regionalPokemons.includes(Pkm.ALOLAN_RAICHU))
        return Pkm.ALOLAN_RAICHU
      else return Pkm.RAICHU
    }
  )
  hp = 120
  atk = 9
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.NUZZLE
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Raichu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.NUZZLE
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class AlolanRaichu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FAIRY,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.COMMON
  stars = 4
  hp = 230
  atk = 20
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.NUZZLE
  passive = Passive.SURGE_SURFER
  attackSprite = AttackSprite.ELECTRIC_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.PSYCHIC)
  }
}

export class Bulbasaur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.IVYSAUR
  hp = 80
  atk = 5
  def = 2
  speDef = 2
  maxPP = 65
  range = 2
  skill = Ability.MAGICAL_LEAF
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Ivysaur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.VENUSAUR
  hp = 130
  atk = 10
  def = 4
  speDef = 4
  maxPP = 65
  range = 2
  skill = Ability.MAGICAL_LEAF
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Venusaur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 3
  hp = 240
  atk = 18
  def = 6
  speDef = 6
  maxPP = 65
  range = 2
  skill = Ability.MAGICAL_LEAF
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Igglybuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BABY, Synergy.SOUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.JIGGLYPUFF
  hp = 65
  atk = 5
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.SLEEP
  attackSprite = AttackSprite.SOUND_RANGE
}

export class Jigglypuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.SOUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.WIGGLYTUFF
  hp = 120
  atk = 9
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.SLEEP
  attackSprite = AttackSprite.SOUND_RANGE
}

export class Wigglytuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.SOUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 18
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.SLEEP
  attackSprite = AttackSprite.SOUND_RANGE
}

export class Duskull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.DUSCLOPS
  hp = 70
  atk = 6
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.SHADOW_BALL
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Dusclops extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.DUSKNOIR
  hp = 150
  atk = 11
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.SHADOW_BALL
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Dusknoir extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 240
  atk = 24
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.SHADOW_BALL
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Magnemite extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MAGNETON
  hp = 80
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_BOMB
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Magneton extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.MAGNEZONE
  hp = 150
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_BOMB
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Magnezone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 20
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_BOMB
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Horsea extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SEADRA
  hp = 70
  atk = 6
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.WHIRLPOOL
  attackSprite = AttackSprite.WATER_RANGE
}

export class Seadra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.KINGDRA
  hp = 140
  atk = 12
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.WHIRLPOOL
  attackSprite = AttackSprite.WATER_RANGE
}

export class Kingdra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 22
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.WHIRLPOOL
  attackSprite = AttackSprite.WATER_RANGE
}

export class Flabebe extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.FLOETTE
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 90
  range = 3
  skill = Ability.FAIRY_WIND
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class Floette extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.FLORGES
  hp = 120
  atk = 9
  def = 1
  speDef = 1
  maxPP = 90
  range = 3
  skill = Ability.FAIRY_WIND
  attackSprite = AttackSprite.FAIRY_RANGE
}
export class Florges extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 20
  def = 2
  speDef = 2
  maxPP = 90
  range = 3
  skill = Ability.FAIRY_WIND
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class Chikorita extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.BAYLEEF
  hp = 70
  atk = 6
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.STUN_SPORE
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Bayleef extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.MEGANIUM
  hp = 140
  atk = 12
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.STUN_SPORE
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Meganium extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 27
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.STUN_SPORE
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Sandile extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.KROKOROK
  hp = 70
  atk = 5
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Krookorok extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.KROOKODILE
  hp = 120
  atk = 9
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Krookodile extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Venipede extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.WHIRLIPEDE
  hp = 70
  atk = 5
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Whirlipede extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.SCOLIPEDE
  hp = 120
  atk = 9
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Scolipede extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Spheal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.ICE])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SEALEO
  hp = 70
  atk = 6
  def = 3
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.ICE_FANG
  attackSprite = AttackSprite.ICE_MELEE
}

export class Sealeo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.ICE])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.WALREIN
  hp = 140
  atk = 12
  def = 3
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.ICE_FANG
  attackSprite = AttackSprite.ICE_MELEE
}

export class Walrein extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.ICE])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 260
  atk = 24
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.ICE_FANG
  attackSprite = AttackSprite.ICE_MELEE
}

export class NidoranF extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.NIDORINA
  hp = 70
  atk = 5
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  attackSprite = AttackSprite.POISON_MELEE
}

export class Nidorina extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.NIDOQUEEN
  hp = 130
  atk = 10
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  attackSprite = AttackSprite.POISON_MELEE
}

export class Nidoqueen extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 230
  atk = 21
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  attackSprite = AttackSprite.POISON_MELEE
}

export class NidoranM extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.NIDORINO
  hp = 70
  atk = 5
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.POISON
  attackSprite = AttackSprite.POISON_MELEE
  regional = true
}

export class Nidorino extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.NIDOKING
  hp = 140
  atk = 10
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.POISON
  attackSprite = AttackSprite.POISON_MELEE
  regional = true
}

export class Nidoking extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 21
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.POISON
  attackSprite = AttackSprite.POISON_MELEE
  regional = true
}

export class Machop extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MACHOKE
  hp = 70
  atk = 6
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.GUILLOTINE
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Machoke extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.MACHAMP
  hp = 130
  atk = 12
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.GUILLOTINE
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Machamp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 220
  atk = 22
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.GUILLOTINE
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Piplup extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.PRINPLUP
  hp = 60
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Prinplup extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.EMPOLEON
  hp = 130
  atk = 9
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Empoleon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 240
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Chimchar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.MONFERNO
  hp = 60
  atk = 5
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.TORMENT
  attackSprite = AttackSprite.FIRE_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.HUMAN)
  }
}

export class Monferno extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.INFERNAPE
  hp = 100
  atk = 11
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.TORMENT
  attackSprite = AttackSprite.FIRE_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.HUMAN)
  }
}

export class Infernape extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 180
  atk = 22
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.TORMENT
  attackSprite = AttackSprite.FIRE_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.HUMAN)
  }
}

export class Mudkip extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.MARSHTOMP
  hp = 65
  atk = 5
  def = 2
  speDef = 2
  maxPP = 50
  range = 1
  skill = Ability.MUD_BUBBLE
  passive = Passive.WATER_SPRING
  attackSprite = AttackSprite.WATER_MELEE
}

export class Marshtomp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.SWAMPERT
  hp = 130
  atk = 9
  def = 3
  speDef = 3
  maxPP = 50
  range = 1
  skill = Ability.MUD_BUBBLE
  passive = Passive.WATER_SPRING
  attackSprite = AttackSprite.WATER_MELEE
}

export class Swampert extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 50
  range = 1
  skill = Ability.MUD_BUBBLE
  passive = Passive.WATER_SPRING
  attackSprite = AttackSprite.WATER_MELEE
}

export class Torchic extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.COMBUSKEN
  hp = 80
  atk = 6
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Combusken extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.BLAZIKEN
  hp = 150
  atk = 12
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Blaziken extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 240
  atk = 24
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Treecko extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.GROVYLE
  hp = 70
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.LEAF_BLADE
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Grovyle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.SCEPTILE
  hp = 120
  atk = 14
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.LEAF_BLADE
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Sceptile extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 27
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.LEAF_BLADE
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Cyndaquil extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.QUILAVA
  hp = 70
  atk = 7
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.WHEEL_OF_FIRE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Quilava extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.TYPHLOSION
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: Player) => {
      if (player.regionalPokemons.includes(Pkm.HISUIAN_TYPHLOSION))
        return Pkm.HISUIAN_TYPHLOSION
      else return Pkm.TYPHLOSION
    }
  )
  hp = 120
  atk = 13
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.WHEEL_OF_FIRE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Typhlosion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 230
  atk = 25
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.WHEEL_OF_FIRE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class HisuianTyphlosion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 4
  hp = 230
  atk = 27
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.INFERNAL_PARADE
  attackSprite = AttackSprite.FIRE_RANGE
  passive = Passive.HISUIAN_TYPHLOSION
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.GHOST)
  }
}

export class Slowpoke extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SLOWBRO
  hp = 85
  atk = 6
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.SOAK
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
}

export class Slowbro extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.SLOWKING
  hp = 180
  atk = 13
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.SOAK
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
}

export class Slowking extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 260
  atk = 24
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SOAK
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
}

export class Psyduck extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.GOLDUCK
  hp = 75
  atk = 7
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.PSYSHOCK
  passive = Passive.PSYDUCK
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Golduck extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 15
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.PSYSHOCK
  passive = Passive.PSYDUCK
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Squirtle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.WARTORTLE
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.HYDRO_PUMP
  attackSprite = AttackSprite.WATER_RANGE
}

export class Wartortle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.BLASTOISE
  hp = 120
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.HYDRO_PUMP
  attackSprite = AttackSprite.WATER_RANGE
}

export class Blastoise extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 3
  hp = 210
  atk = 20
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.HYDRO_PUMP
  attackSprite = AttackSprite.WATER_RANGE
}

export class Bellsprout extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.WEEPINBELL
  hp = 70
  atk = 5
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ROOT
  passive = Passive.BELLSPROUT
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Weepinbell extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.VICTREEBEL
  evolutionRule = new ItemEvolutionRule(Berries)
  hp = 160
  atk = 12
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ROOT
  passive = Passive.BELLSPROUT
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Victreebel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 240
  atk = 20
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ROOT
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Pikipek extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.TRUMBEAK
  hp = 70
  atk = 5
  def = 2
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Trumbeak extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.TOUCANNON
  hp = 120
  atk = 9
  def = 3
  speDef = 3
  maxPP = 70
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Toucannon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 20
  def = 4
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Geodude extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.GRAVELER
  hp = 70
  atk = 4
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ROCK_SLIDE
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Graveler extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.GOLEM
  hp = 120
  atk = 9
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ROCK_SLIDE
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Golem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 16
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.ROCK_SLIDE
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Totodile extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.MONSTER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CROCONAW
  hp = 75
  atk = 7
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.WATERFALL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Croconaw extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.MONSTER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.FERALIGATR
  hp = 130
  atk = 15
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.WATERFALL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Feraligatr extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.MONSTER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 240
  atk = 28
  def = 5
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.WATERFALL
  attackSprite = AttackSprite.WATER_MELEE
}

export class Azurill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY, Synergy.BABY])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.MARILL
  hp = 50
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.PLAY_ROUGH
  attackSprite = AttackSprite.WATER_RANGE
}

export class Marill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.AZUMARILL
  hp = 110
  atk = 9
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.PLAY_ROUGH
  attackSprite = AttackSprite.WATER_RANGE
}

export class Azumarill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.PLAY_ROUGH
  attackSprite = AttackSprite.WATER_RANGE
}

export class Zubat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.GOLBAT
  hp = 50
  atk = 5
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.LEECH_LIFE
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Golbat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.CROBAT
  hp = 100
  atk = 9
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.LEECH_LIFE
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Crobat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 18
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.LEECH_LIFE
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Mareep extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.FLAFFY
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 110
  range = 2
  skill = Ability.THUNDER
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Flaffy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.AMPHAROS
  hp = 110
  atk = 9
  def = 1
  speDef = 1
  maxPP = 110
  range = 2
  skill = Ability.THUNDER
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Ampharos extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 18
  def = 1
  speDef = 1
  maxPP = 110
  range = 2
  skill = Ability.THUNDER
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Cleffa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.NORMAL, Synergy.BABY])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CLEFAIRY
  hp = 70
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.METRONOME
  passive = Passive.CLEFAIRY
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Clefairy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.NORMAL, Synergy.LIGHT])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.CLEFABLE
  evolutionRule = new ItemEvolutionRule([Item.POKE_DOLL])
  hp = 150
  atk = 11
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.METRONOME
  passive = Passive.CLEFAIRY
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Clefable extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.NORMAL, Synergy.LIGHT])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 220
  atk = 18
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.METRONOME
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Caterpie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.METAPOD
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.STRING_SHOT
  attackSprite = AttackSprite.BUG_RANGE
}

export class Metapod extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.BUTTERFREE
  hp = 110
  atk = 9
  def = 3
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.STRING_SHOT
  attackSprite = AttackSprite.BUG_RANGE
}

export class Butterfree extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 16
  def = 2
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.STRING_SHOT
  attackSprite = AttackSprite.BUG_RANGE
}

export class Weedle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.BUG])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.KAKUNA
  hp = 60
  atk = 5
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.BUG_BUZZ
  attackSprite = AttackSprite.BUG_MELEE
}

export class Kakuna extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.BUG])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.BEEDRILL
  hp = 110
  atk = 10
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.BUG_BUZZ
  attackSprite = AttackSprite.BUG_MELEE
}

export class Beedrill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 18
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.BUG_BUZZ
  attackSprite = AttackSprite.BUG_MELEE
}

export class Pidgey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.PIDGEOTTO
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.HURRICANE
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Pidgeotto extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.PIDGEOT
  hp = 110
  atk = 9
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.HURRICANE
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Pidgeot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 18
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.HURRICANE
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Hoppip extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FLORA, Synergy.GRASS])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.SKIPLOOM
  hp = 50
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.ACROBATICS
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Skiploom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FLORA, Synergy.GRASS])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.JUMPLUFF
  hp = 110
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.ACROBATICS
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Jumpluff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FLORA, Synergy.GRASS])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 18
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.ACROBATICS
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Seedot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.NUZLEAF
  hp = 60
  atk = 6
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.PAYBACK
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Nuzleaf extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.SHIFTRY
  hp = 120
  atk = 10
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.PAYBACK
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Shiftry extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 22
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.PAYBACK
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Charmander extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.CHARMELEON
  hp = 60
  atk = 5
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.BLAST_BURN
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Charmeleon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.CHARIZARD
  hp = 120
  atk = 9
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.BLAST_BURN
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Charizard extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 20
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.BLAST_BURN
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Magikarp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.GYARADOS
  hp = 30
  atk = 1
  def = 1
  speDef = 1
  maxPP = 50
  range = 1
  skill = Ability.SPLASH
  passive = Passive.MAGIKARP
  attackSprite = AttackSprite.WATER_MELEE
  evolutionRule = new CountEvolutionRule(8)
}

export class Gyarados extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.WATER,
    Synergy.FLYING
  ])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.HYDRO_PUMP
  attackSprite = AttackSprite.WATER_MELEE
  onAcquired(player: Player) {
    player.titles.add(Title.FISHERMAN)
  }
}

export class Rattata extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.RATICATE
  hp = 50
  atk = 4
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.AGILITY
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Raticate extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.COMMON
  stars = 2
  hp = 110
  atk = 10
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.AGILITY
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class AlolanRattata extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.ALOLAN_RATICATE
  hp = 60
  atk = 4
  def = 1
  speDef = 1
  maxPP = 90
  range = 1
  skill = Ability.TAIL_WHIP
  attackSprite = AttackSprite.DARK_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.DARK)
  }
}

export class AlolanRaticate extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 2
  hp = 120
  atk = 10
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.TAIL_WHIP
  attackSprite = AttackSprite.DARK_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.DARK)
  }
}

export class Spearow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.FEAROW
  hp = 50
  atk = 4
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.PECK
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Fearow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 2
  hp = 120
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.PECK
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Meloetta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 25
  def = 5
  speDef = 5
  maxPP = 60
  range = 4
  skill = Ability.RELIC_SONG
  attackSprite = AttackSprite.SOUND_RANGE
}

export class PirouetteMeloetta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 120
  range = 4
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.SOUND_RANGE
}

export class Lugia extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.FLYING,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.SKY_ATTACK
  passive = Passive.WINDY
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Giratina extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 35
  def = 6
  speDef = 6
  maxPP = 40
  range = 1
  skill = Ability.SHADOW_SNEAK
  passive = Passive.GIRATINA
  attackSprite = AttackSprite.DRAGON_MELEE

  onChangePosition(x: number, y: number, player: Player) {
    if (y !== 3) {
      player.transformPokemon(this, Pkm.ORIGIN_GIRATINA)
    }
  }
}

export class OriginGiratina extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GHOST,
    Synergy.FLYING
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 35
  def = 2
  speDef = 2
  maxPP = 40
  range = 2
  skill = Ability.SHADOW_SNEAK
  passive = Passive.GIRATINA
  attackSprite = AttackSprite.GHOST_RANGE

  onChangePosition(x: number, y: number, player: Player) {
    if (y === 3) {
      player.transformPokemon(this, Pkm.GIRATINA)
    }
  }
}

export class Zapdos extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.CHARGE
  passive = Passive.STORM
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Zeraora extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIGHTING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.PLASMA_FIST
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Stantler extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.PSYSHIELD_BASH
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Miltank extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 15
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.ROLLOUT
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Yveltal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DEATH_WING
  attackSprite = AttackSprite.DARK_MELEE
}

export class Moltres extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.OVERHEAT
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Pinsir extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.BUG])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 21
  def = 3
  speDef = 3
  maxPP = 85
  range = 1
  skill = Ability.GUILLOTINE
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Articuno extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 3
  speDef = 3
  maxPP = 120
  range = 2
  skill = Ability.BLIZZARD
  passive = Passive.SNOW
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Dialga extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  def = 5
  speDef = 5
  maxPP = 120
  range = 1
  skill = Ability.ROAR_OF_TIME
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Palkia extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.WATER])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  def = 5
  speDef = 5
  maxPP = 120
  range = 1
  skill = Ability.SPACIAL_REND
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Melmetal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 150
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Suicune extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 130
  range = 1
  skill = Ability.AQUA_JET
  attackSprite = AttackSprite.WATER_MELEE
}

export class Raikou extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ELECTRIC,
    Synergy.FIELD
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 130
  range = 1
  skill = Ability.VOLT_SWITCH
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Entei extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 130
  range = 1
  skill = Ability.FLAME_CHARGE
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Regice extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 6
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
  attackSprite = AttackSprite.ICE_MELEE
}

export class Seviper extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.MONSTER])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 22
  def = 4
  speDef = 2
  maxPP = 75
  range = 1
  skill = Ability.VENOSHOCK
  attackSprite = AttackSprite.POISON_MELEE
}

export class Lunatone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.PSYCHIC, Synergy.DARK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.COSMIC_POWER
  passive = Passive.NIGHT
  attackSprite = AttackSprite.DARK_RANGE
}

export class Solrock extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.COSMIC_POWER
  passive = Passive.SUN
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Regirock extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.STEALTH_ROCKS
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Tauros extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 7
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Heracross extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FIGHTING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 22
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.CLOSE_COMBAT
  passive = Passive.GUTS
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Zangoose extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 20
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.FACADE
  passive = Passive.TOXIC_BOOST
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Registeel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 25
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DEFENSE_CURL
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Regigigas extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.MONSTER,
    Synergy.HUMAN
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.CRUSH_GRIP
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Kyogre extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.MONSTER])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.PRIMAL_KYOGRE
  evolutionRule = new ItemEvolutionRule([Item.BLUE_ORB])
  hp = 300
  atk = 20
  def = 3
  speDef = 3
  maxPP = 120
  range = 3
  skill = Ability.ORIGIN_PULSE
  passive = Passive.PRIMAL
  attackSprite = AttackSprite.WATER_RANGE
}

export class Groudon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.FIRE])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.PRIMAL_GROUDON
  evolutionRule = new ItemEvolutionRule([Item.RED_ORB])
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.EARTHQUAKE
  passive = Passive.PRIMAL
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Rayquaza extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.MEGA_RAYQUAZA
  evolutionRule = new ItemEvolutionRule([Item.GREEN_ORB])
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.DRACO_METEOR
  passive = Passive.PRIMAL
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Eevee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  hp = 90
  atk = 5
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
  passive = Passive.EEVEE
  attackSprite = AttackSprite.NORMAL_MELEE

  evolutionRule = new ItemEvolutionRule(
    [
      Item.WATER_STONE,
      Item.FIRE_STONE,
      Item.THUNDER_STONE,
      Item.DUSK_STONE,
      Item.MOON_STONE,
      Item.LEAF_STONE,
      Item.DAWN_STONE,
      Item.ICE_STONE
    ],
    (pokemon, player, item) => {
      switch (item) {
        case Item.WATER_STONE:
          return Pkm.VAPOREON
        case Item.FIRE_STONE:
          return Pkm.FLAREON
        case Item.THUNDER_STONE:
          return Pkm.JOLTEON
        case Item.DUSK_STONE:
          return Pkm.UMBREON
        case Item.MOON_STONE:
          return Pkm.SYLVEON
        case Item.LEAF_STONE:
          return Pkm.LEAFEON
        case Item.DAWN_STONE:
          return Pkm.ESPEON
        case Item.ICE_STONE:
        default:
          return Pkm.GLACEON
      }
    }
  )
}

export class Vaporeon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AMORPHOUS,
    Synergy.FIELD
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
  attackSprite = AttackSprite.WATER_MELEE
}

export class Jolteon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Flareon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.LIGHT])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Espeon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.HAPPY_HOUR
  attackSprite = AttackSprite.PSYCHIC_MELEE
}

export class Umbreon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.HAPPY_HOUR
  attackSprite = AttackSprite.DARK_MELEE
}

export class Leafeon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.HAPPY_HOUR
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Sylveon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FIELD, Synergy.SOUND])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.HAPPY_HOUR
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Glaceon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.HAPPY_HOUR
  attackSprite = AttackSprite.ICE_MELEE
}

export class Volcanion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 20
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.STEAM_ERUPTION
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Darkrai extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.GHOST,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 2
  speDef = 2
  maxPP = 120
  range = 2
  skill = Ability.DARK_VOID
  attackSprite = AttackSprite.DARK_RANGE
}

export class Larvesta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.BUG])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.VOLCARONA
  hp = 100
  atk = 10
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.FIRE_BLAST
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Volcarona extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.BUG])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 20
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.FIRE_BLAST
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Chatot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.SOUND])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 2
  speDef = 2
  maxPP = 80
  range = 3
  skill = Ability.CHATTER
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Farfetchd extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 4
  speDef = 4
  maxPP = 60
  range = 1
  skill = Ability.RAZOR_WIND
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Kecleon extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.ILLUSION
  passive = Passive.PROTEAN2
  attackSprite = AttackSprite.NORMAL_MELEE
}

function updateCastform(pokemon: Pokemon, weather: Weather, player: Player) {
  let weatherForm: Pkm = Pkm.CASTFORM
  if (weather === Weather.SNOW) {
    weatherForm = Pkm.CASTFORM_HAIL
  } else if (weather === Weather.RAIN) {
    weatherForm = Pkm.CASTFORM_RAIN
  } else if (weather === Weather.SUN) {
    weatherForm = Pkm.CASTFORM_SUN
  }

  if (pokemon.name === weatherForm) return
  if (!player) return

  const newPokemon = PokemonFactory.createPokemonFromName(weatherForm, player)
  pokemon.items.forEach((item) => {
    newPokemon.items.add(item)
  })
  newPokemon.positionX = pokemon.positionX
  newPokemon.positionY = pokemon.positionY
  player.board.delete(pokemon.id)
  player.board.set(newPokemon.id, newPokemon)
  player.updateSynergies()
}

export class Castform extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ARTIFICIAL, Synergy.AMORPHOUS])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 18
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.FORECAST
  passive = Passive.CASTFORM
  attackSprite = AttackSprite.PSYCHIC_RANGE

  beforeSimulationStart({
    weather,
    player
  }: { weather: Weather; player: Player }) {
    updateCastform(this, weather, player)
  }
}

export class CastformSun extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ARTIFICIAL,
    Synergy.FIRE,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 18
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.FORECAST
  passive = Passive.CASTFORM
  attackSprite = AttackSprite.DRAGON_RANGE

  beforeSimulationStart({
    weather,
    player
  }: { weather: Weather; player: Player }) {
    updateCastform(this, weather, player)
  }
}

export class CastformRain extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ARTIFICIAL,
    Synergy.WATER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 18
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.FORECAST
  passive = Passive.CASTFORM
  attackSprite = AttackSprite.WATER_RANGE

  beforeSimulationStart({
    weather,
    player
  }: { weather: Weather; player: Player }) {
    updateCastform(this, weather, player)
  }
}

export class CastformHail extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ARTIFICIAL,
    Synergy.ICE,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 18
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.FORECAST
  passive = Passive.CASTFORM
  attackSprite = AttackSprite.ICE_RANGE

  beforeSimulationStart({
    weather,
    player
  }: { weather: Weather; player: Player }) {
    updateCastform(this, weather, player)
  }
}

export class Landorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.GROUND])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 30
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.SANDSEAR_STORM
  passive = Passive.SANDSTORM
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Thundurus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ELECTRIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 30
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.WILDBOLT_STORM
  passive = Passive.STORM
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Tornadus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ICE])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 30
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.BLEAKWIND_STORM
  passive = Passive.WINDY
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Enamorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FAIRY])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 30
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.SPRINGTIDE_STORM
  passive = Passive.MISTY
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Keldeo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIGHTING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.AQUA_JET
  attackSprite = AttackSprite.WATER_RANGE
}

export class Terrakion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FIGHTING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Virizion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 6
  speDef = 6
  maxPP = 140
  range = 1
  skill = Ability.SACRED_SWORD
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Cobalion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FIGHTING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.SEISMIC_TOSS
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Mawile extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.FAIRY,
    Synergy.MONSTER
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 15
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.PLAY_ROUGH
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Phione extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  evolution = Pkm.MANAPHY
  evolutionRule = new ItemEvolutionRule([Item.AQUA_EGG])
  hp = 190
  atk = 15
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.NASTY_PLOT
  passive = Passive.PHIONE
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Manaphy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 240
  atk = 17
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.NASTY_PLOT
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Rotom extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.GHOST,
    Synergy.LIGHT
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.CALM_MIND
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Spiritomb extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.GHOST,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 2
  speDef = 2
  maxPP = 80
  range = 2
  skill = Ability.SHADOW_BALL
  attackSprite = AttackSprite.DARK_RANGE
}

export class Absol extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.THIEF
  attackSprite = AttackSprite.DARK_MELEE
}

export class Delibird extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FLYING, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.PRESENT
  attackSprite = AttackSprite.ICE_MELEE
}

export class IronBundle extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.WATER,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  def = 5
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.AURORA_BEAM
  attackSprite = AttackSprite.ICE_MELEE
}

export class Lapras extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 12
  def = 5
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DIVE
  attackSprite = AttackSprite.WATER_MELEE
}

export class Latias extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 120
  atk = 10
  def = 2
  speDef = 2
  maxPP = 90
  range = 3
  skill = Ability.MIST_BALL
  passive = Passive.SHARED_VISION
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Latios extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 120
  atk = 10
  def = 2
  speDef = 2
  maxPP = 90
  range = 3
  skill = Ability.LUSTER_PURGE
  passive = Passive.SHARED_VISION
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Uxie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  def = 3
  speDef = 3
  maxPP = 90
  range = 3
  skill = Ability.KNOWLEDGE_THIEF
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Mesprit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  def = 3
  speDef = 3
  maxPP = 90
  range = 3
  skill = Ability.SONG_OF_DESIRE
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Azelf extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  def = 3
  speDef = 3
  maxPP = 90
  range = 3
  skill = Ability.CONFUSING_MIND
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Mew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  def = 2
  speDef = 2
  maxPP = 80
  range = 4
  skill = Ability.TELEPORT
  passive = Passive.SYNCHRO
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Mewtwo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.MONSTER,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 30
  def = 2
  speDef = 5
  maxPP = 110
  range = 3
  skill = Ability.PSYSTRIKE
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Marshadow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIGHTING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 28
  def = 5
  speDef = 5
  maxPP = 120
  range = 1
  skill = Ability.SPECTRAL_THIEF
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Kyurem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ICE])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.DEFAULT //Ability.BLIZZARD
  passive = Passive.NONE // Passive.SNOW
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Reshiram extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 30
  def = 3
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.BLUE_FLARE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Zekrom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ELECTRIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 30
  def = 3
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.FUSION_BOLT
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Celebi extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.PSYCHIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.TIME_TRAVEL
  passive = Passive.CELEBI
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Victini extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.SEARING_SHOT
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Jirachi extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.PSYCHIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.DOOM_DESIRE
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Arceus extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.JUDGEMENT
  passive = Passive.PROTEAN3
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Deoxys extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.AMORPHOUS,
    Synergy.HUMAN
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 240
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.PSYCHO_BOOST
  attackSprite = AttackSprite.PSYCHIC_MELEE
  passive = Passive.ALIEN_DNA
  onAcquired(player: Player) {
    if (player.items.includes(Item.METEORITE) === false) {
      player.items.push(Item.METEORITE)
    }
  }
}

export class DeoxysDefense extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 240
  atk = 20
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.PROTECT
  attackSprite = AttackSprite.PSYCHIC_MELEE
  passive = Passive.ALIEN_DNA
  onAcquired(player: Player) {
    if (player.items.includes(Item.METEORITE) === false) {
      player.items.push(Item.METEORITE)
    }
  }
}

export class DeoxysAttack extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 240
  atk = 30
  def = 2
  speDef = 2
  maxPP = 90
  range = 3
  skill = Ability.ZAP_CANNON
  attackSprite = AttackSprite.PSYCHIC_RANGE
  passive = Passive.ALIEN_DNA
  onAcquired(player: Player) {
    if (player.items.includes(Item.METEORITE) === false) {
      player.items.push(Item.METEORITE)
    }
  }
}

export class DeoxysSpeed extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 240
  atk = 25
  def = 3
  speDef = 3
  maxPP = 50
  range = 2
  skill = Ability.EXTREME_SPEED
  attackSprite = AttackSprite.PSYCHIC_RANGE
  passive = Passive.ALIEN_DNA
  onAcquired(player: Player) {
    if (player.items.includes(Item.METEORITE) === false) {
      player.items.push(Item.METEORITE)
    }
  }
}

export class Shaymin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.SHAYMIN_SKY
  evolutionRule = new ItemEvolutionRule([Item.GRACIDEA_FLOWER])
  hp = 200
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.SEED_FLARE
  passive = Passive.SHAYMIN
  attackSprite = AttackSprite.GRASS_RANGE
}

export class ShayminSky extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.SEED_FLARE
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Cresselia extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.LIGHT
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 15
  def = 5
  speDef = 5
  maxPP = 60
  range = 3
  skill = Ability.WISH
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Heatran extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 280
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.MAGMA_STORM
  attackSprite = AttackSprite.FIRE_RANGE
}

export class HooH extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FLYING, Synergy.LIGHT])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.FIRE_SPIN
  passive = Passive.SUN
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Torkoal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.GROUND])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 10
  def = 8
  speDef = 2
  maxPP = 110
  range = 1
  skill = Ability.SMOKE_SCREEN
  attackSprite = AttackSprite.FIRE_MELEE
}

export class PrimalGroudon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.FIRE])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 400
  atk = 30
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.EARTHQUAKE
  passive = Passive.SANDSTORM
  attackSprite = AttackSprite.FIRE_MELEE
}

export class PrimalKyogre extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.ELECTRIC,
    Synergy.MONSTER
  ])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 400
  atk = 20
  def = 3
  speDef = 3
  maxPP = 120
  range = 3
  skill = Ability.ORIGIN_PULSE
  passive = Passive.RAIN
  attackSprite = AttackSprite.WATER_RANGE
}

export class MegaRayquaza extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 400
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.DRACO_METEOR
  passive = Passive.AIRLOCK
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Oddish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.GLOOM
  hp = 90
  atk = 9
  def = 2
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.STUN_SPORE
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Gloom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 2
  evolution = Pkm.VILEPLUME
  hp = 160
  atk = 18
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.STUN_SPORE
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Vileplume extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 3
  evolution = Pkm.BELLOSSOM
  hp = 260
  atk = 24
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.STUN_SPORE
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Bellossom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 4
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 10
  range = 1
  skill = Ability.PETAL_BLIZZARD
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Amaura extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.AURORUS
  hp = 130
  atk = 7
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.HAIL
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Aurorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 2
  hp = 280
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.HAIL
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Carbink extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ROCK, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DIANCIE
  hp = 125
  atk = 7
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DIAMOND_STORM
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Diancie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ROCK, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 2
  hp = 300
  atk = 10
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DIAMOND_STORM
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Sunkern extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIRE, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SUNFLORA
  hp = 80
  atk = 8
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.SOLAR_BEAM
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Sunflora extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIRE, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 2
  hp = 160
  atk = 18
  def = 5
  speDef = 5
  maxPP = 80
  range = 2
  skill = Ability.SOLAR_BEAM
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Mankey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.PRIMEAPE
  hp = 120
  atk = 8
  def = 3
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.THRASH
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Primeape extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 2
  hp = 240
  atk = 21
  def = 6
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.THRASH
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Anorith extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.BUG, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARMALDO
  hp = 60
  atk = 6
  def = 2
  speDef = 1
  maxPP = 80
  range = 1
  skill = Ability.ROCK_SMASH
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Armaldo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.BUG, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 15
  def = 3
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.ROCK_SMASH
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Wynaut extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.BABY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WOBBUFFET
  hp = 110
  atk = 7
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.COUNTER
  passive = Passive.WOBBUFFET
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Wobbuffet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.RARE
  stars = 2
  hp = 280
  atk = 18
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.COUNTER
  passive = Passive.WOBBUFFET
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Munna extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FIELD,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MUSHARNA
  hp = 80
  atk = 8
  def = 2
  speDef = 2
  maxPP = 80
  range = 3
  skill = Ability.MOON_DREAM
  passive = Passive.DREAM_CATCHER
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Musharna extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FIELD,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 240
  atk = 16
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.MOON_DREAM
  passive = Passive.DREAM_CATCHER
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Archen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ROCK, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.ARCHEOPS
  hp = 80
  atk = 6
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.ROCK_SMASH
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Archeops extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ROCK, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 14
  def = 5
  speDef = 5
  maxPP = 90
  range = 2
  skill = Ability.ROCK_SMASH
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Gligar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.POISON,
    Synergy.FLYING
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  evolution = Pkm.GLISCOR
  evolutionRule = new ItemEvolutionRule([Item.RAZOR_FANG])
  hp = 150
  atk = 16
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.POISON_JAB
  passive = Passive.GLIGAR
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Gliscor extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.POISON,
    Synergy.FLYING
  ])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 170
  atk = 18
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.POISON_JAB
  passive = Passive.POISON_HEAL
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Shieldon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.STEEL])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.BASTIODON
  hp = 90
  atk = 6
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.IRON_DEFENSE
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Bastiodon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.STEEL])
  rarity = Rarity.RARE
  stars = 2
  hp = 250
  atk = 10
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.IRON_DEFENSE
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Tirtouga extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CARRACOSTA
  hp = 120
  atk = 7
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Carracosta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.RARE
  stars = 2
  hp = 240
  atk = 14
  def = 7
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Lileep extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CRADILY
  hp = 70
  atk = 7
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.LEECH_SEED
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Cradily extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 2
  hp = 150
  atk = 21
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.LEECH_SEED
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Cranidos extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.RAMPARDOS
  hp = 60
  atk = 7
  def = 2
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Rampardos extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 15
  def = 3
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Kabuto extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.KABUTOPS
  hp = 80
  atk = 8
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.PROTECT
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Kabutops extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 22
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.SLASHING_CLAW
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Omanyte extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.OMASTAR
  hp = 70
  atk = 6
  def = 2
  speDef = 3
  maxPP = 90
  range = 2
  skill = Ability.ROCK_TOMB
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Omastar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  def = 3
  speDef = 4
  maxPP = 90
  range = 2
  skill = Ability.ROCK_TOMB
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}
export class Clamperl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HUNTAIL
  hp = 100
  atk = 7
  def = 4
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.ROCK_TOMB
  passive = Passive.BIVALVE
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: Player) => {
      if (
        Math.max(
          ...values(player.board)
            .filter((pkm) => pkm.index === this.index)
            .map((v) => v.positionY)
        ) === 3
      ) {
        return Pkm.HUNTAIL
      } else {
        return Pkm.GOREBYSS
      }
    }
  )
}

export class Gorebyss extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 16
  def = 5
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.HYDRO_PUMP
  passive = Passive.BIVALVE
  additional = true
  attackSprite = AttackSprite.WATER_RANGE
}
export class Huntail extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 140
  atk = 27
  def = 5
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.ROCK_TOMB
  passive = Passive.BIVALVE
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}
export class Relicanth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.WATER, Synergy.FOSSIL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 13
  def = 7
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.ROCK_TOMB
  attackSprite = AttackSprite.WATER_MELEE
}

export class Tyrunt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.DRAGON])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.TYRANTRUM
  hp = 135
  atk = 10
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Tyrantrum extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.DRAGON])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 290
  atk = 22
  def = 7
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Aerodactyl extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FLYING, Synergy.FOSSIL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.ROCK_SLIDE
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Genesect extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.BUG,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 22
  def = 6
  speDef = 3
  maxPP = 80
  range = 4
  skill = Ability.LOCK_ON
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Hatenna extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.HATTREM
  hp = 75
  atk = 6
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.MAGIC_POWDER
  attackSprite = AttackSprite.PSYCHIC_MELEE
}

export class Hattrem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.HATTERENE
  hp = 130
  atk = 11
  def = 4
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.MAGIC_POWDER
  attackSprite = AttackSprite.PSYCHIC_MELEE
}

export class Hatterene extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 240
  atk = 22
  def = 5
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.MAGIC_POWDER
  attackSprite = AttackSprite.PSYCHIC_MELEE
}
export class Fennekin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.BRAIXEN
  hp = 50
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.FIRE_TRICK
  attackSprite = AttackSprite.FIRE_RANGE
}
export class Braixen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.DELPHOX
  hp = 100
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.FIRE_TRICK
  attackSprite = AttackSprite.FIRE_RANGE
}
export class Delphox extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 18
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.FIRE_TRICK
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Regieleki extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.VOLT_SWITCH
  attackSprite = AttackSprite.ELECTRIC_RANGE
}
export class Regidrago extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.DRACO_ENERGY
  attackSprite = AttackSprite.FIRE_RANGE
}
export class Guzzlord extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.DARK,
    Synergy.MONSTER
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 22
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.CRUNCH
  passive = Passive.GUZZLORD
  attackSprite = AttackSprite.DARK_MELEE
}
export class Eternatus extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.POISON,
    Synergy.FOSSIL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 22
  def = 8
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.DYNAMAX_CANNON
  attackSprite = AttackSprite.POISON_MELEE
}

export class Nincada extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.NINJASK
  hp = 100
  atk = 10
  def = 5
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.WONDER_GUARD
  passive = Passive.NINCADA
  attackSprite = AttackSprite.BUG_MELEE
  additional = true
}

export class Ninjask extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 2
  hp = 160
  atk = 18
  def = 5
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.AERIAL_ACE
  attackSprite = AttackSprite.BUG_MELEE
  additional = true
  onAcquired(player: Player) {
    // also gain sheninja if free space on bench
    const x = getFirstAvailablePositionInBench(player.board)
    if (x !== undefined) {
      const pokemon = PokemonFactory.createPokemonFromName(Pkm.SHEDINJA, player)
      pokemon.positionX = x
      pokemon.positionY = 0
      player.board.set(pokemon.id, pokemon)
    }
  }
}

export class Shedinja extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  hp = 100
  atk = 18
  def = 0
  speDef = 0
  maxPP = 100
  range = 1
  skill = Ability.WONDER_GUARD
  passive = Passive.WONDER_GUARD
  attackSprite = AttackSprite.BUG_MELEE
  additional = true
}

export class Happiny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.HUMAN, Synergy.BABY])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.CHANSEY
  hp = 150
  atk = 8
  def = 5
  speDef = 5
  maxPP = 130
  range = 1
  skill = Ability.SOFT_BOILED
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Chansey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.HUMAN])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.BLISSEY
  hp = 300
  atk = 20
  def = 6
  speDef = 10
  maxPP = 130
  range = 1
  skill = Ability.SOFT_BOILED
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Blissey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.HUMAN])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 480
  atk = 25
  def = 10
  speDef = 15
  maxPP = 130
  range = 1
  skill = Ability.SOFT_BOILED
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class TapuKoko extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.ELECTRIC_SURGE
  passive = Passive.ELECTRIC_TERRAIN
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class TapuLele extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.PSYCHIC_SURGE
  passive = Passive.PSYCHIC_TERRAIN
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Xerneas extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.LIGHT])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.GEOMANCY
  passive = Passive.MISTY
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class TapuFini extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.MISTY_SURGE
  passive = Passive.MISTY_TERRAIN
  attackSprite = AttackSprite.WATER_RANGE
}

export class TapuBulu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.GRASSY_SURGE
  passive = Passive.GRASSY_TERRAIN
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Stakataka extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 5
  def = 15
  speDef = 15
  maxPP = 100
  range = 1
  skill = Ability.IRON_DEFENSE
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Blacephalon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.MIND_BLOWN
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Houndour extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HOUNDOOM
  hp = 85
  atk = 8
  def = 4
  speDef = 4
  maxPP = 125
  range = 1
  skill = Ability.BEAT_UP
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Houndoom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.MEGA_HOUNDOOM
  hp = 150
  atk = 20
  def = 6
  speDef = 6
  maxPP = 125
  range = 1
  skill = Ability.BEAT_UP
  attackSprite = AttackSprite.FIRE_MELEE
}

export class MegaHoundoom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 3
  hp = 280
  atk = 38
  def = 8
  speDef = 8
  maxPP = 125
  range = 1
  skill = Ability.BEAT_UP
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Cacnea extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CACTURNE
  hp = 85
  atk = 7
  def = 3
  speDef = 1
  maxPP = 70
  range = 1
  skill = Ability.HEAL_BLOCK
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Cacturne extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 20
  def = 6
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.HEAL_BLOCK
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Pumpkaboo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.GRASS,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GOURGEIST
  hp = 90
  atk = 14
  def = 6
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.CORRUPTED_NATURE
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}
export class Gourgeist extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.GRASS,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 28
  def = 10
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.CORRUPTED_NATURE
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Natu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FLYING])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.XATU
  hp = 90
  atk = 5
  def = 2
  speDef = 2
  maxPP = 70
  range = 2
  skill = Ability.MAGIC_BOUNCE
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}
export class Xatu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FLYING])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 3
  speDef = 3
  maxPP = 70
  range = 2
  skill = Ability.MAGIC_BOUNCE
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Noibat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.SOUND,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.NOIVERN
  hp = 65
  atk = 7
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.RAZOR_WIND
  additional = true
  attackSprite = AttackSprite.FLYING_RANGE
}
export class Noivern extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.SOUND,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 150
  atk = 17
  def = 3
  speDef = 3
  maxPP = 90
  range = 2
  skill = Ability.RAZOR_WIND
  additional = true
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Shellder extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE, Synergy.ROCK])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CLOYSTER
  hp = 70
  atk = 5
  def = 5
  speDef = 2
  maxPP = 110
  range = 1
  skill = Ability.SHELL_SMASH
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Cloyster extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE, Synergy.ROCK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 11
  def = 8
  speDef = 2
  maxPP = 110
  range = 1
  skill = Ability.SHELL_SMASH
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Buizel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIELD
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.FLOATZEL
  hp = 90
  atk = 9
  def = 3
  speDef = 3
  maxPP = 50
  range = 1
  skill = Ability.AQUA_JET
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}
export class Floatzel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIELD
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 180
  atk = 24
  def = 5
  speDef = 5
  maxPP = 50
  range = 1
  skill = Ability.AQUA_JET
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Ponyta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.RAPIDASH
  hp = 90
  atk = 12
  def = 3
  speDef = 3
  maxPP = 55
  range = 1
  skill = Ability.FLAME_CHARGE
  additional = true
  attackSprite = AttackSprite.FIRE_MELEE
}
export class Rapidash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 2
  hp = 220
  atk = 24
  def = 5
  speDef = 5
  maxPP = 55
  range = 1
  skill = Ability.FLAME_CHARGE
  additional = true
  attackSprite = AttackSprite.FIRE_MELEE
}
export class Makuhita extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.MONSTER])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.HARIYAMA
  hp = 80
  atk = 8
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.DYNAMIC_PUNCH
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}
export class Hariyama extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.MONSTER])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 22
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.DYNAMIC_PUNCH
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Sentret extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.NORMAL,
    Synergy.FIELD
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.FURRET
  hp = 80
  atk = 7
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.HELPING_HAND
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}
export class Furret extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.NORMAL,
    Synergy.FIELD
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 16
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.HELPING_HAND
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Joltik extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.GALVANTULA
  hp = 80
  atk = 8
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ELECTRO_WEB
  additional = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
}
export class Galvantula extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 20
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.ELECTRO_WEB
  additional = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Paras extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.PARASECT
  hp = 90
  atk = 6
  def = 2
  speDef = 2
  maxPP = 110
  range = 1
  skill = Ability.ABSORB
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Parasect extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 16
  def = 3
  speDef = 3
  maxPP = 110
  range = 1
  skill = Ability.ABSORB
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Corphish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CRAWDAUNT
  hp = 85
  atk = 6
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.CRABHAMMER
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Crawdaunt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 16
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.CRABHAMMER
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}
export class Meowth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.PERSIAN
  hp = 80
  atk = 8
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.PAYDAY
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Persian extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.PAYDAY
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Hoothoot extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.NOCTOWL
  hp = 75
  atk = 5
  def = 2
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.HYPNOSIS
  additional = true
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Noctowl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 10
  def = 3
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.HYPNOSIS
  additional = true
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Munchlax extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.HUMAN, Synergy.BABY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SNORLAX
  hp = 120
  atk = 8
  def = 2
  speDef = 2
  maxPP = 120
  range = 1
  skill = Ability.BODY_SLAM
  passive = Passive.GLUTTON
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE

  onEvolve({
    pokemonEvolved: snorlax,
    pokemonsBeforeEvolution: munchlaxs
  }: {
    pokemonEvolved: Pokemon
    pokemonsBeforeEvolution: Pokemon[]
  }) {
    // carry over the hp gained with passive
    const hpStacked = sum(munchlaxs.map((m) => m.hp - 120))
    snorlax.hp += hpStacked
  }
}

export class Snorlax extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.HUMAN,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 260
  atk = 19
  def = 3
  speDef = 3
  maxPP = 120
  range = 1
  skill = Ability.BODY_SLAM
  passive = Passive.GLUTTON
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Growlithe extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARCANINE
  hp = 75
  atk = 6
  def = 2
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.FIRE_FANG
  attackSprite = AttackSprite.FIRE_MELEE
  additional = true
}

export class Arcanine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 14
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.FIRE_FANG
  attackSprite = AttackSprite.FIRE_MELEE
  additional = true
}

export class HisuiGrowlithe extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.ROCK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.HISUI_ARCANINE
  hp = 75
  atk = 5
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DOUBLE_EDGE
  attackSprite = AttackSprite.FIRE_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.GROWLITHE)) &&
      regionSynergies.includes(Synergy.ROCK)
    )
  }
}

export class HisuiArcanine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.ROCK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 12
  def = 6
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.DOUBLE_EDGE
  attackSprite = AttackSprite.FIRE_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.GROWLITHE)) &&
      regionSynergies.includes(Synergy.ROCK)
    )
  }
}

export class Smoochum extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.PSYCHIC, Synergy.BABY])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.JYNX
  hp = 60
  atk = 6
  def = 1
  speDef = 1
  maxPP = 80
  range = 2
  skill = Ability.LOVELY_KISS
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Jynx extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 12
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.LOVELY_KISS
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class MimeJr extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.PSYCHIC, Synergy.BABY])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MR_MIME
  hp = 70
  atk = 6
  def = 2
  speDef = 2
  maxPP = 80
  range = 2
  skill = Ability.MIMIC
  additional = true
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class MrMime extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.PSYCHIC,
    Synergy.HUMAN
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 15
  def = 2
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.MIMIC
  additional = true
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class Salandit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.POISON])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SALAZZLE
  hp = 70
  atk = 7
  def = 2
  speDef = 2
  maxPP = 60
  range = 2
  skill = Ability.POISON
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Salazzle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.POISON])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 17
  def = 4
  speDef = 4
  maxPP = 60
  range = 2
  skill = Ability.POISON
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Venonat extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.VENOMOTH
  hp = 50
  atk = 6
  def = 2
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.BUG_BUZZ
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Venomoth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 11
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.BUG_BUZZ
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Voltorb extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ELECTRODE
  hp = 60
  atk = 9
  def = 1
  speDef = 1
  maxPP = 80
  range = 1
  skill = Ability.EXPLOSION
  additional = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Electrode extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 18
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.EXPLOSION
  additional = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Slugma extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MAGCARGO
  hp = 70
  atk = 7
  def = 3
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.FIRE_BLAST
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Magcargo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 16
  def = 6
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.FIRE_BLAST
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Sneasel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.DARK, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.WEAVILE
  hp = 85
  atk = 9
  def = 1
  speDef = 3
  maxPP = 40
  range = 1
  skill = Ability.SLASHING_CLAW
  additional = true
  attackSprite = AttackSprite.ICE_MELEE
}

export class Weavile extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.DARK, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 22
  def = 2
  speDef = 3
  maxPP = 40
  range = 1
  skill = Ability.SLASHING_CLAW
  additional = true
  attackSprite = AttackSprite.ICE_MELEE
}

export class Seel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.DEWGONG
  hp = 80
  atk = 7
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.AURORA_BEAM
  additional = true
  attackSprite = AttackSprite.ICE_MELEE
}

export class Dewgong extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 16
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.AURORA_BEAM
  additional = true
  attackSprite = AttackSprite.ICE_MELEE
}

export class Croagunk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIGHTING,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.TOXICROAK
  hp = 75
  atk = 6
  def = 2
  speDef = 2
  maxPP = 85
  range = 1
  skill = Ability.CROSS_POISON
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Toxicroak extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIGHTING,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 14
  def = 4
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.CROSS_POISON
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}
export class Chinchou extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.ELECTRIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.LANTURN
  hp = 60
  atk = 7
  def = 2
  speDef = 3
  maxPP = 90
  range = 2
  skill = Ability.THUNDER
  additional = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Lanturn extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.ELECTRIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 16
  def = 3
  speDef = 5
  maxPP = 90
  range = 2
  skill = Ability.THUNDER
  additional = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
}
export class Poochyena extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MIGHTYENA
  hp = 70
  atk = 9
  def = 2
  speDef = 2
  maxPP = 75
  range = 1
  skill = Ability.GROWL
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Mightyena extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  hp = 160
  atk = 19
  def = 4
  speDef = 4
  maxPP = 75
  range = 1
  skill = Ability.GROWL
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Bronzor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.BRONZONG
  hp = 100
  atk = 5
  def = 6
  speDef = 3
  maxPP = 85
  range = 1
  skill = Ability.DEFENSE_CURL
  additional = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Bronzong extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.PSYCHIC,
    Synergy.SOUND
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 11
  def = 9
  speDef = 7
  maxPP = 85
  range = 1
  skill = Ability.DEFENSE_CURL
  additional = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Drifloon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FLYING,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.DRIFBLIM
  hp = 120
  atk = 5
  def = 2
  speDef = 2
  maxPP = 85
  range = 2
  skill = Ability.CALM_MIND
  additional = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Drifblim extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FLYING,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 250
  atk = 10
  def = 3
  speDef = 3
  maxPP = 85
  range = 2
  skill = Ability.CALM_MIND
  additional = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Shroomish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.BRELOOM
  hp = 70
  atk = 7
  def = 2
  speDef = 2
  maxPP = 85
  range = 1
  skill = Ability.LEECH_SEED
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Breloom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 18
  def = 3
  speDef = 3
  maxPP = 85
  range = 1
  skill = Ability.LEECH_SEED
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}
export class Tentacool extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.POISON
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.TENTACRUEL
  hp = 65
  atk = 5
  def = 2
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.POISON
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Tentacruel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.POISON
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 10
  def = 3
  speDef = 7
  maxPP = 85
  range = 1
  skill = Ability.POISON
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Snubull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GRANBULL
  hp = 115
  atk = 10
  def = 3
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.BITE
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Granbull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 2
  hp = 265
  atk = 24
  def = 6
  speDef = 3
  maxPP = 70
  range = 1
  skill = Ability.BITE
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

const rksSystemEvolutionRule = new ItemEvolutionRule(
  [...SynergyItems],
  (pokemon, player, item) => {
    const type = SynergyGivenByItem[item as Item] as Synergy
    switch (type) {
      case Synergy.FOSSIL:
        return Pkm.SILVALLY_FOSSIL
      case Synergy.PSYCHIC:
        return Pkm.SILVALLY_PSYCHIC
      case Synergy.WATER:
        return Pkm.SILVALLY_WATER
      case Synergy.ELECTRIC:
        return Pkm.SILVALLY_ELECTRIC
      case Synergy.FIRE:
        return Pkm.SILVALLY_FIRE
      case Synergy.FAIRY:
        return Pkm.SILVALLY_FAIRY
      case Synergy.DARK:
        return Pkm.SILVALLY_DARK
      case Synergy.GRASS:
        return Pkm.SILVALLY_GRASS
      case Synergy.ICE:
        return Pkm.SILVALLY_ICE
      case Synergy.FIGHTING:
        return Pkm.SILVALLY_FIGHTING
      case Synergy.LIGHT:
        return Pkm.SILVALLY_LIGHT
      case Synergy.POISON:
        return Pkm.SILVALLY_POISON
      case Synergy.SOUND:
        return Pkm.SILVALLY_SOUND
      case Synergy.STEEL:
        return Pkm.SILVALLY_STEEL
      case Synergy.FLYING:
        return Pkm.SILVALLY_FLYING
      case Synergy.ROCK:
        return Pkm.SILVALLY_ROCK
      case Synergy.GROUND:
        return Pkm.SILVALLY_GROUND
      case Synergy.FLORA:
        return Pkm.SILVALLY_FLORA
      default:
        return pokemon.name
    }
  }
)

const rksSystemOnChangePosition = function (
  this: Pokemon,
  x: number,
  y: number,
  player: Player
) {
  if (y === 0) {
    SynergyItems.forEach((synergyItem) => {
      if (this.items.has(synergyItem)) {
        this.items.delete(synergyItem)
        player.items.push(synergyItem)
      }
    })
    player.transformPokemon(this, Pkm.TYPE_NULL)
  }
}

export class TypeNull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ARTIFICIAL])
  rarity = Rarity.UNIQUE
  stars = 2
  evolution = Pkm.SILVALLY_FIRE
  evolutionRule = rksSystemEvolutionRule
  hp = 200
  atk = 14
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  passive = Passive.TYPE_NULL
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class SilvallyFire extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.FIRE
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyFossil extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyPsychic extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyWater extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.WATER
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyElectric extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.ELECTRIC
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyFairy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.FAIRY
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyDark extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.DARK
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyGrass extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.GRASS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyIce extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.ICE
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyFighting extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.FIGHTING
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyLight extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.LIGHT
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyPoison extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.POISON
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallySound extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.SOUND
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallySteel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.STEEL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyFlying extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.FLYING
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyRock extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.ROCK
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyGround extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.GROUND
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class SilvallyFlora extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ARTIFICIAL,
    Synergy.FLORA
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  evolutionRule = rksSystemEvolutionRule
  attackSprite = AttackSprite.NORMAL_MELEE
  onChangePosition = rksSystemOnChangePosition
}

export class Applin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.APPLETUN
  hp = 130
  atk = 8
  def = 5
  speDef = 2
  maxPP = 85
  range = 1
  skill = Ability.APPLE_ACID
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Appletun extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 22
  def = 8
  speDef = 6
  maxPP = 85
  range = 1
  skill = Ability.APPLE_ACID
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Staryu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.STARMIE
  hp = 80
  atk = 7
  def = 2
  speDef = 3
  maxPP = 90
  range = 2
  skill = Ability.PSYBEAM
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Starmie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 20
  def = 4
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.PSYBEAM
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Vulpix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.NINETALES
  hp = 75
  atk = 7
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.FIRE_SPIN
  attackSprite = AttackSprite.FIRE_RANGE
  additional = true
}

export class Ninetales extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 20
  def = 3
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.FIRE_SPIN
  attackSprite = AttackSprite.FIRE_RANGE
  additional = true
}

export class AlolanVulpix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FAIRY])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.ALOLAN_NINETALES
  hp = 75
  atk = 7
  def = 2
  speDef = 2
  maxPP = 85
  range = 2
  skill = Ability.AURORA_VEIL
  regional = true
  attackSprite = AttackSprite.ICE_RANGE
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.VULPIX)) &&
      (regionSynergies.includes(Synergy.ICE) ||
        regionSynergies.includes(Synergy.FAIRY))
    )
  }
}

export class AlolanNinetales extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FAIRY])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 20
  def = 5
  speDef = 5
  maxPP = 85
  range = 2
  skill = Ability.AURORA_VEIL
  regional = true
  attackSprite = AttackSprite.ICE_RANGE
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.VULPIX)) &&
      (regionSynergies.includes(Synergy.ICE) ||
        regionSynergies.includes(Synergy.FAIRY))
    )
  }
}

export class Snom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ICE])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.FROSMOTH
  hp = 70
  atk = 8
  def = 2
  speDef = 2
  maxPP = 80
  range = 2
  skill = Ability.BUG_BUZZ
  additional = true
  attackSprite = AttackSprite.ICE_RANGE
}

export class Frosmoth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ICE])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 20
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.BUG_BUZZ
  additional = true
  attackSprite = AttackSprite.ICE_RANGE
}

export class Wailmer extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.WAILORD
  hp = 180
  atk = 6
  def = 2
  speDef = 2
  maxPP = 110
  range = 1
  skill = Ability.DIVE
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Wailord extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 2
  hp = 400
  atk = 11
  def = 3
  speDef = 3
  maxPP = 110
  range = 1
  skill = Ability.DIVE
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Dreepy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GHOST,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.DRAKLOAK
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 90
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.DRAGON_DARTS
  passive = Passive.HATCH
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Drakloak extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GHOST,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.DRAGAPULT
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 140
  atk = 12
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.DRAGON_DARTS
  passive = Passive.HATCH
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Dragapult extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 22
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.DRAGON_DARTS
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Snivy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIELD])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.SERVINE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 90
  atk = 5
  def = 1
  speDef = 1
  maxPP = 70
  range = 3
  skill = Ability.MAGICAL_LEAF
  passive = Passive.HATCH
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Servine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIELD])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.SERPERIOR
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 160
  atk = 13
  def = 1
  speDef = 1
  maxPP = 70
  range = 3
  skill = Ability.MAGICAL_LEAF
  passive = Passive.HATCH
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Serperior extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIELD])
  rarity = Rarity.HATCH
  stars = 3
  hp = 240
  atk = 24
  def = 1
  speDef = 1
  maxPP = 70
  range = 3
  skill = Ability.MAGICAL_LEAF
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Starly extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.STARAVIA
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 75
  atk = 9
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.BRAVE_BIRD
  passive = Passive.HATCH
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Staravia extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.STARAPTOR
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 130
  atk = 18
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.BRAVE_BIRD
  passive = Passive.HATCH
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Staraptor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.HATCH
  stars = 3
  hp = 200
  atk = 28
  def = 7
  speDef = 7
  maxPP = 80
  range = 1
  skill = Ability.BRAVE_BIRD
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Scorbunny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.RABOOT
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 75
  atk = 6
  def = 3
  speDef = 3
  maxPP = 50
  range = 1
  skill = Ability.PYRO_BALL
  passive = Passive.HATCH
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Raboot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.CINDERACE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 130
  atk = 12
  def = 5
  speDef = 5
  maxPP = 50
  range = 1
  skill = Ability.PYRO_BALL
  passive = Passive.HATCH
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Cinderace extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 3
  hp = 180
  atk = 20
  def = 7
  speDef = 7
  maxPP = 50
  range = 1
  skill = Ability.PYRO_BALL
  attackSprite = AttackSprite.FIRE_MELEE
}

export class AlolanGeodude extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.ALOLAN_GRAVELER
  hp = 70
  atk = 4
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  attackSprite = AttackSprite.ROCK_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.ELECTRIC)
  }
}

export class AlolanGraveler extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.ALOLAN_GOLEM
  hp = 120
  atk = 9
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  attackSprite = AttackSprite.ROCK_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.ELECTRIC)
  }
}

export class AlolanGolem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 16
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  attackSprite = AttackSprite.ROCK_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.ELECTRIC)
  }
}

export class Popplio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.BRIONNE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 65
  atk = 5
  def = 2
  speDef = 2
  maxPP = 80
  range = 3
  skill = Ability.SPARKLING_ARIA
  passive = Passive.HATCH
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Brionne extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.PRIMARINA
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 130
  atk = 10
  def = 2
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.SPARKLING_ARIA
  passive = Passive.HATCH
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Primarina extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 20
  def = 2
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.SPARKLING_ARIA
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Gothita extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.DARK, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.GOTHORITA
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 70
  atk = 5
  def = 1
  speDef = 2
  maxPP = 80
  range = 3
  skill = Ability.FAKE_TEARS
  passive = Passive.HATCH
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Gothorita extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.DARK, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.GOTHITELLE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 120
  atk = 12
  def = 1
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.FAKE_TEARS
  passive = Passive.HATCH
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Gothitelle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.DARK, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 20
  def = 1
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.FAKE_TEARS
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Sandshrew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SANDSLASH
  hp = 90
  atk = 5
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.SPIKE_ARMOR
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Sandslash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 13
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.SPIKE_ARMOR
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Nosepass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.PROBOPASS
  hp = 70
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_RISE
  additional = true
  attackSprite = AttackSprite.ROCK_RANGE
}

export class Probopass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 10
  def = 8
  speDef = 8
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_RISE
  additional = true
  attackSprite = AttackSprite.ROCK_RANGE
}

export class Woobat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLYING,
    Synergy.SOUND,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SWOOBAT
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 80
  range = 3
  skill = Ability.ATTRACT
  additional = true
  attackSprite = AttackSprite.SOUND_RANGE
}

export class Swoobat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLYING,
    Synergy.SOUND,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 12
  def = 2
  speDef = 2
  maxPP = 80
  range = 3
  skill = Ability.ATTRACT
  additional = true
  attackSprite = AttackSprite.SOUND_RANGE
}

export class Pineco extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.FORRETRESS
  hp = 75
  atk = 5
  def = 5
  speDef = 3
  maxPP = 120
  range = 1
  skill = Ability.EXPLOSION
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Forretress extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 200
  atk = 8
  def = 7
  speDef = 3
  maxPP = 120
  range = 1
  skill = Ability.EXPLOSION
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class UnownA extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_A
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}
export class UnownB extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 60
  range = 9
  skill = Ability.HIDDEN_POWER_B
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownC extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 60
  range = 9
  skill = Ability.HIDDEN_POWER_C
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownD extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 150
  range = 9
  skill = Ability.HIDDEN_POWER_D
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownE extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_E
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownF extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_F
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownG extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_G
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownH extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 80
  range = 9
  skill = Ability.HIDDEN_POWER_H
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownI extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_I
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownJ extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_J
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownK extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_K
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownL extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_L
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownM extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 50
  range = 9
  skill = Ability.HIDDEN_POWER_M
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownN extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_N
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownO extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_O
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownP extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_P
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownQ extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 200
  range = 9
  skill = Ability.HIDDEN_POWER_Q
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownR extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_R
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownS extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_S
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownT extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 80
  range = 9
  skill = Ability.HIDDEN_POWER_T
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownU extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 80
  range = 9
  skill = Ability.HIDDEN_POWER_U
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownV extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_V
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownW extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_W
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownX extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_X
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownY extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 50
  range = 9
  skill = Ability.HIDDEN_POWER_Y
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownZ extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_Z
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
  canHoldItems = false
}

export class UnownQuestion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_QM
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class UnownExclamation extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_EM
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Diglett extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.DUGTRIO
  hp = 75
  atk = 6
  def = 3
  speDef = 2
  maxPP = 50
  range = 1
  skill = Ability.DIG
  attackSprite = AttackSprite.ROCK_MELEE
  additional = true
}

export class Dugtrio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 14
  def = 5
  speDef = 4
  maxPP = 50
  range = 1
  skill = Ability.DIG
  attackSprite = AttackSprite.ROCK_MELEE
  additional = true
}

export class AlolanDiglett extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ALOLAN_DUGTRIO
  hp = 70
  atk = 8
  def = 2
  speDef = 1
  maxPP = 50
  range = 1
  skill = Ability.DIG
  attackSprite = AttackSprite.ROCK_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.DIGLETT)) &&
      regionSynergies.includes(Synergy.STEEL)
    )
  }
}

export class AlolanDugtrio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 18
  def = 3
  speDef = 2
  maxPP = 50
  range = 1
  skill = Ability.DIG
  attackSprite = AttackSprite.ROCK_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.DIGLETT)) &&
      regionSynergies.includes(Synergy.STEEL)
    )
  }
}

export class Rowlet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLYING, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.DARTIX
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 70
  atk = 5
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.SPIRIT_SHACKLE
  passive = Passive.HATCH
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Dartix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLYING, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.DECIDUEYE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 130
  atk = 9
  def = 2
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.SPIRIT_SHACKLE
  passive = Passive.HATCH
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Decidueye extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLYING, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 18
  def = 2
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.SPIRIT_SHACKLE
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Zorua extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ZOROARK
  hp = 70
  atk = 8
  def = 2
  speDef = 2
  maxPP = 85
  range = 1
  skill = Ability.ILLUSION
  additional = true
  attackSprite = AttackSprite.DARK_MELEE
}

export class Zoroark extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 18
  def = 4
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.ILLUSION
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class HisuiZorua extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.HISUI_ZOROARK
  hp = 70
  atk = 8
  def = 2
  speDef = 2
  maxPP = 85
  range = 1
  skill = Ability.ILLUSION
  attackSprite = AttackSprite.NORMAL_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.ZORUA)) &&
      (regionSynergies.includes(Synergy.NORMAL) ||
        regionSynergies.includes(Synergy.GHOST))
    )
  }
}

export class HisuiZoroark extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 18
  def = 4
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.ILLUSION
  attackSprite = AttackSprite.NORMAL_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.ZORUA)) &&
      (regionSynergies.includes(Synergy.NORMAL) ||
        regionSynergies.includes(Synergy.GHOST))
    )
  }
}

export class Grimer extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.MONSTER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MUK
  hp = 90
  atk = 5
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  attackSprite = AttackSprite.POISON_MELEE
  additional = true
}

export class Muk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.MONSTER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 190
  atk = 10
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  attackSprite = AttackSprite.POISON_MELEE
  additional = true
}

export class AlolanGrimer extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.DARK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ALOLAN_MUK
  hp = 80
  atk = 7
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  attackSprite = AttackSprite.POISON_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.GRIMER)) &&
      regionSynergies.includes(Synergy.DARK)
    )
  }
}

export class AlolanMuk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.DARK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 15
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  attackSprite = AttackSprite.POISON_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.GRIMER)) &&
      regionSynergies.includes(Synergy.DARK)
    )
  }
}

export class Ekans extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARBOK
  hp = 60
  atk = 8
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Arbok extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 18
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Carvanha extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SHARPEDO
  hp = 85
  atk = 12
  def = 1
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.BITE
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Sharpedo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 24
  def = 2
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.BITE
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Froakie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.FROGADIER
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 80
  atk = 7
  def = 2
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.WATER_SHURIKEN
  passive = Passive.HATCH
  attackSprite = AttackSprite.WATER_MELEE
}

export class Frogadier extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.GRENINJA
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 140
  atk = 14
  def = 3
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.WATER_SHURIKEN
  passive = Passive.HATCH
  attackSprite = AttackSprite.WATER_RANGE
}

export class Greninja extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.HATCH
  stars = 3
  hp = 200
  atk = 23
  def = 4
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.WATER_SHURIKEN
  attackSprite = AttackSprite.WATER_RANGE
}

export class Chingling extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.PSYCHIC, Synergy.BABY])
  rarity = Rarity.UNIQUE
  stars = 2
  evolution = Pkm.CHIMECHO
  evolutionRule = new ItemEvolutionRule([Item.STAR_DUST])
  hp = 150
  atk = 8
  def = 2
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.ECHO
  passive = Passive.CHINGLING
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Chimecho extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  def = 3
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.ECHO
  passive = Passive.CHIMECHO
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Tyrogue extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.BABY])
  rarity = Rarity.UNIQUE
  stars = 2
  evolution = Pkm.HITMONTOP
  hp = 150
  atk = 10
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.MACH_PUNCH
  passive = Passive.TYROGUE
  attackSprite = AttackSprite.FIGHTING_MELEE

  evolutionRule = new ItemEvolutionRule(AllItems, (pokemon, player, item_) => {
    const item = item_ as Item
    if (
      item === Item.CHARCOAL ||
      item === Item.MAGNET ||
      (item in ItemRecipe && ItemRecipe[item]!.includes(Item.CHARCOAL)) ||
      (item in ItemRecipe && ItemRecipe[item]!.includes(Item.MAGNET))
    ) {
      return Pkm.HITMONLEE
    }

    if (
      item === Item.HEART_SCALE ||
      item === Item.NEVER_MELT_ICE ||
      (item in ItemRecipe && ItemRecipe[item]!.includes(Item.HEART_SCALE)) ||
      (item in ItemRecipe && ItemRecipe[item]!.includes(Item.NEVER_MELT_ICE))
    ) {
      return Pkm.HITMONCHAN
    }

    return Pkm.HITMONTOP
  })
}

export class Hitmontop extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.TRIPLE_KICK
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Hitmonlee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 30
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.MAWASHI_GERI
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Hitmonchan extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 20
  def = 7
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.UPPERCUT
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Mimikyu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FAIRY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 6
  maxPP = 40
  range = 1
  skill = Ability.SHADOW_SNEAK
  passive = Passive.MIMIKYU
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class MimikyuBusted extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 6
  maxPP = 40
  range = 1
  skill = Ability.SHADOW_SNEAK
  passive = Passive.MIMIKYU_BUSTED
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Bonsley extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FLORA, Synergy.BABY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SUDOWOODO
  hp = 125
  atk = 8
  def = 5
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.MIMIC
  passive = Passive.SUDOWOODO
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Sudowoodo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FLORA, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 20
  def = 6
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.MIMIC
  passive = Passive.SUDOWOODO
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Combee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.VESPIQUEEN
  hp = 120
  atk = 9
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.HEAL_ORDER
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Vespiqueen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 2
  hp = 280
  atk = 20
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.HEAL_ORDER
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Shuckle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 4
  def = 15
  speDef = 15
  maxPP = 100
  range = 1
  skill = Ability.SHELL_TRAP
  passive = Passive.SHUCKLE
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Tepig extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.FIGHTING])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.PIGNITE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 70
  atk = 7
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  passive = Passive.HATCH
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Pignite extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.FIGHTING])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.EMBOAR
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 140
  atk = 12
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  passive = Passive.HATCH
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Emboar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.FIGHTING])
  rarity = Rarity.HATCH
  stars = 3
  hp = 210
  atk = 20
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Wurmple extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SILCOON
  hp = 110
  atk = 10
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.ENTANGLING_THREAD
  attackSprite = AttackSprite.BUG_MELEE
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: Player) => {
      if (player.regionalPokemons.includes(Pkm.CASCOON)) return Pkm.CASCOON
      else return Pkm.SILCOON
    }
  )
}

export class Silcoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.BEAUTIFLY
  hp = 180
  atk = 20
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.SPIKE_ARMOR
  attackSprite = AttackSprite.BUG_MELEE
}

export class Beautifly extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 3
  hp = 250
  atk = 30
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.SILVER_WIND
  attackSprite = AttackSprite.BUG_MELEE
}

export class Cascoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.DUSTOX
  hp = 180
  atk = 20
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.SPIKE_ARMOR
  attackSprite = AttackSprite.BUG_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.POISON)
  }
}

export class Dustox extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 3
  hp = 250
  atk = 30
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.POISON_POWDER
  attackSprite = AttackSprite.BUG_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.POISON)
  }
}

export class Tinkatink extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.TINKATUFF
  hp = 100
  atk = 11
  def = 3
  speDef = 3
  maxPP = 120
  range = 1
  skill = Ability.GIGATON_HAMMER
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Tinkatuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.TINKATON
  hp = 200
  atk = 22
  def = 4
  speDef = 4
  maxPP = 120
  range = 1
  skill = Ability.GIGATON_HAMMER
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Tinkaton extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 44
  def = 8
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.GIGATON_HAMMER
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Maractus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.GROUND, Synergy.FLORA])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  def = 6
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.SPIKE_ARMOR
  passive = Passive.HYDRATATION
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Plusle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 140
  atk = 13
  def = 3
  speDef = 3
  maxPP = 60
  range = 1
  skill = Ability.LINK_CABLE
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Minun extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 140
  atk = 13
  def = 3
  speDef = 3
  maxPP = 60
  range = 1
  skill = Ability.LINK_CABLE
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Spectrier extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIELD])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 280
  atk = 30
  def = 5
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.ASTRAL_BARRAGE
  passive = Passive.GRIM_NEIGH
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Kartana extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.GRASS])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 230
  atk = 40
  def = 10
  speDef = 2
  maxPP = 65
  range = 1
  skill = Ability.LEAF_BLADE
  passive = Passive.BEAST_BOOST_ATK
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Dhelmise extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.GHOST, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 18
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.ANCHOR_SHOT
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Tropius extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.AIR_SLASH
  attackSprite = AttackSprite.GRASS_MELEE
  passive = Passive.HARVEST

  afterSimulationStart({
    player,
    entity
  }: {
    player: IPlayer
    entity: IPokemonEntity
  }) {
    const berry = pickRandomIn(Berries)
    if (entity.items.size < 3) {
      entity.items.add(berry)
      entity.refToBoardPokemon.items.add(berry)
    } else {
      player.items.push(berry)
    }
  }
}

export class Carnivine extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.MONSTER,
    Synergy.GRASS,
    Synergy.FLORA
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.VINE_WHIP
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Sableye extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.ROCK, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 12
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.KNOCK_OFF
  attackSprite = AttackSprite.DARK_MELEE
}

export class Koffing extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.ARTIFICIAL,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.WEEZING
  hp = 85
  atk = 5
  def = 3
  speDef = 3
  maxPP = 40
  range = 1
  skill = Ability.SMOG
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Weezing extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.ARTIFICIAL,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 190
  atk = 10
  def = 5
  speDef = 5
  maxPP = 40
  range = 1
  skill = Ability.SMOG
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Clauncher extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CLAWITZER
  hp = 80
  atk = 7
  def = 1
  speDef = 1
  maxPP = 200
  range = 4
  skill = Ability.WATER_PULSE
  passive = Passive.MEGA_LAUNCHER
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Clawitzer extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 2
  hp = 150
  atk = 19
  def = 3
  speDef = 2
  maxPP = 200
  range = 4
  skill = Ability.WATER_PULSE
  passive = Passive.MEGA_LAUNCHER
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Yanma extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FOSSIL, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.YANMEGA
  hp = 70
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.AERIAL_ACE
  passive = Passive.CLEAR_WING
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Yanmega extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FOSSIL, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  hp = 160
  atk = 16
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.AERIAL_ACE
  passive = Passive.CLEAR_WING
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Helioptile extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.ELECTRIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HELIOLISK
  hp = 75
  atk = 9
  def = 2
  speDef = 2
  maxPP = 80
  range = 3
  skill = Ability.PARABOLIC_CHARGE
  passive = Passive.DRY_SKIN
  additional = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Heliolisk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.ELECTRIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 170
  atk = 22
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.PARABOLIC_CHARGE
  passive = Passive.DRY_SKIN
  additional = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Exeggcute extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.PSYCHIC])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.EXEGGUTOR
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: Player) => {
      if (player.regionalPokemons.includes(Pkm.ALOLAN_EXEGGUTOR))
        return Pkm.ALOLAN_EXEGGUTOR
      else return Pkm.EXEGGUTOR
    }
  )
  hp = 110
  atk = 8
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.EGGSPLOSION
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Exeggutor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.PSYCHIC])
  rarity = Rarity.EPIC
  stars = 2
  hp = 300
  atk = 20
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.EGGSPLOSION
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class AlolanExeggutor extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FLORA,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 350
  atk = 24
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.EGGSPLOSION
  regional = true
  attackSprite = AttackSprite.GRASS_MELEE
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.EXEGGCUTE)) &&
      regionSynergies.includes(Synergy.DRAGON)
    )
  }
}

export class Bidoof extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.NORMAL,
    Synergy.AQUATIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.BIBAREL
  hp = 60
  atk = 6
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.SUPER_FANG
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Bibarel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.NORMAL,
    Synergy.AQUATIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 135
  atk = 15
  def = 2
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.SUPER_FANG
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Spinda extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.TEETER_DANCE
  passive = Passive.SPOT_PANDA
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Baltoy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.PSYCHIC,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.CLAYDOL
  hp = 80
  atk = 8
  def = 4
  speDef = 4
  maxPP = 70
  range = 2
  skill = Ability.CONFUSION
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Claydol extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.PSYCHIC,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 180
  atk = 16
  def = 6
  speDef = 6
  maxPP = 70
  range = 2
  skill = Ability.CONFUSION
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Purrloin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LIEPARD
  hp = 80
  atk = 9
  def = 1
  speDef = 1
  maxPP = 90
  range = 1
  skill = Ability.ASSIST
  additional = true
  attackSprite = AttackSprite.DARK_MELEE
}

export class Liepard extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 175
  atk = 25
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.ASSIST
  additional = true
  attackSprite = AttackSprite.DARK_MELEE
}

export class Barboach extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.WHISCASH
  hp = 120
  atk = 9
  def = 3
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.FISSURE
  passive = Passive.AQUA_VEIL
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Whiscash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 22
  def = 4
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.FISSURE
  passive = Passive.AQUA_VEIL
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Scraggy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SCRAFTY
  hp = 70
  atk = 8
  def = 2
  speDef = 2
  maxPP = 85
  range = 1
  skill = Ability.ASSURANCE
  passive = Passive.MOXIE
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Scrafty extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 18
  def = 4
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.ASSURANCE
  passive = Passive.MOXIE
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Finneon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LUMINEON
  hp = 80
  atk = 7
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.AQUA_RING
  additional = true
  attackSprite = AttackSprite.WATER_RANGE
}

export class Lumineon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 19
  def = 4
  speDef = 4
  maxPP = 85
  range = 2
  skill = Ability.AQUA_RING
  additional = true
  attackSprite = AttackSprite.WATER_RANGE
}

export class Stunky extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.POISON])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SKUNTANK
  hp = 125
  atk = 10
  def = 2
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.POISON_GAS
  passive = Passive.STENCH
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Skuntank extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.POISON])
  rarity = Rarity.EPIC
  stars = 2
  hp = 280
  atk = 22
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.POISON_GAS
  passive = Passive.STENCH
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Illumise extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.BUG, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 130
  atk = 13
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.STRUGGLE_BUG
  passive = Passive.ILLUMISE_VOLBEAT
  attackSprite = AttackSprite.BUG_MELEE
}

export class Volbeat extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.BUG, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 130
  atk = 13
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.TAIL_GLOW
  passive = Passive.ILLUMISE_VOLBEAT
  attackSprite = AttackSprite.BUG_MELEE
}

export class Necrozma extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.LIGHT, Synergy.PSYCHIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.PRISMATIC_LASER
  passive = Passive.PRISM
  attackSprite = AttackSprite.DRAGON_MELEE

  onChangePosition(x: number, y: number, player: Player) {
    const hasLight =
      (player.synergies.get(Synergy.LIGHT) ?? 0) >=
      SynergyTriggers[Synergy.LIGHT][0]
    if (x === player.lightX && y === player.lightY && hasLight) {
      player.transformPokemon(this, Pkm.ULTRA_NECROZMA)
    }
  }
}

export class UltraNecrozma extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.LIGHT,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.PRISMATIC_LASER
  passive = Passive.PRISM
  attackSprite = AttackSprite.GHOST_RANGE

  onChangePosition(x: number, y: number, player: Player) {
    const hasLight =
      (player.synergies.get(Synergy.LIGHT) ?? 0) >=
      SynergyTriggers[Synergy.LIGHT][0]
    if (x !== player.lightX || y !== player.lightY || !hasLight) {
      player.transformPokemon(this, Pkm.NECROZMA)
    }
  }
}

export class Cherrubi extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.LIGHT, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.CHERRIM
  hp = 90
  atk = 6
  def = 1
  speDef = 1
  maxPP = 65
  range = 3
  skill = Ability.NATURAL_GIFT
  regional = true
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Cherrim extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.LIGHT, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 2
  hp = 180
  atk = 16
  def = 2
  speDef = 2
  maxPP = 65
  range = 3
  skill = Ability.NATURAL_GIFT
  passive = Passive.BLOSSOM
  regional = true
  attackSprite = AttackSprite.GRASS_RANGE
  onChangePosition(x: number, y: number, player: Player) {
    const hasLight =
      (player.synergies.get(Synergy.LIGHT) ?? 0) >=
      SynergyTriggers[Synergy.LIGHT][0]
    if (x === player.lightX && y === player.lightY && hasLight) {
      player.transformPokemon(this, Pkm.CHERRIM_SUNLIGHT)
    }
  }
}

export class CherrimSunlight extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.LIGHT, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 2
  hp = 210
  atk = 18
  def = 3
  speDef = 3
  maxPP = 60
  range = 3
  skill = Ability.NATURAL_GIFT
  passive = Passive.BLOSSOM
  regional = true
  attackSprite = AttackSprite.GRASS_RANGE
  onChangePosition(x: number, y: number, player: Player) {
    const hasLight =
      (player.synergies.get(Synergy.LIGHT) ?? 0) >=
      SynergyTriggers[Synergy.LIGHT][0]
    if (x !== player.lightX || y !== player.lightY || !hasLight) {
      player.transformPokemon(this, Pkm.CHERRIM)
    }
  }
}

export class Misdreavus extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FAIRY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.MISMAGIUS
  hp = 90
  atk = 9
  def = 2
  speDef = 3
  maxPP = 95
  range = 3
  skill = Ability.NIGHT_SHADE
  additional = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Mismagius extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FAIRY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 180
  atk = 26
  def = 2
  speDef = 4
  maxPP = 95
  range = 3
  skill = Ability.NIGHT_SHADE
  additional = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Doduo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DODRIO
  hp = 90
  atk = 12
  def = 3
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.AGILITY
  attackSprite = AttackSprite.FLYING_MELEE
  regional = true
}

export class Dodrio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 185
  atk = 28
  def = 5
  speDef = 3
  maxPP = 70
  range = 1
  skill = Ability.AGILITY
  attackSprite = AttackSprite.FLYING_MELEE
  regional = true
}

export class Kricketot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.KRICKETUNE
  hp = 80
  atk = 7
  def = 2
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.SCREECH
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Kricketune extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 18
  def = 4
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.SCREECH
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Hippopotas extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ROCK])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HIPPODOWN
  hp = 120
  atk = 10
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.SAND_TOMB
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
  passive = Passive.SAND_STREAM
}

export class Hippodown extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ROCK])
  rarity = Rarity.EPIC
  stars = 2
  hp = 270
  atk = 22
  def = 7
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.SAND_TOMB
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
  passive = Passive.SAND_STREAM
}

export class Wingull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.PELIPPER
  hp = 90
  atk = 8
  def = 5
  speDef = 3
  maxPP = 75
  range = 2
  skill = Ability.WHIRLWIND
  additional = true
  attackSprite = AttackSprite.FLYING_RANGE
  passive = Passive.DRIZZLE
}

export class Pelipper extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 20
  def = 7
  speDef = 4
  maxPP = 75
  range = 2
  skill = Ability.WHIRLWIND
  additional = true
  attackSprite = AttackSprite.FLYING_RANGE
  passive = Passive.DRIZZLE
}

export class Zigzagoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LINOONE
  hp = 80
  atk = 8
  def = 4
  speDef = 2
  maxPP = 50
  range = 1
  skill = Ability.SLASH
  attackSprite = AttackSprite.NORMAL_MELEE
  passive = Passive.PICKUP
}

export class Linoone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 21
  def = 6
  speDef = 4
  maxPP = 50
  range = 1
  skill = Ability.SLASH
  attackSprite = AttackSprite.NORMAL_MELEE
  passive = Passive.PICKUP
}

export class Phantump extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.GRASS,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.TREVENANT
  hp = 90
  atk = 8
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.POLTERGEIST
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Trevenant extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.GRASS,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 18
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.POLTERGEIST
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class HisuianQwilfish extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.POISON,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.OVERQWIL
  hp = 95
  atk = 8
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.BARB_BARRAGE
  regional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Overqwil extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.POISON,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 230
  atk = 19
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.BARB_BARRAGE
  regional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Xurkitree extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ARTIFICIAL,
    Synergy.HUMAN
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 16
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.CHARGE_BEAM
  passive = Passive.SPECIAL_ATTACK
  attackSprite = AttackSprite.ELECTRIC_RANGE
  attackType = AttackType.SPECIAL
}

export class Nihilego extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 25
  def = 1
  speDef = 5
  maxPP = 80
  range = 3
  skill = Ability.EMPTY_LIGHT
  passive = Passive.BEAST_BOOST_AP
  attackSprite = AttackSprite.POISON_RANGE
}

export class Tandemaus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 2
  hp = 160
  atk = 16
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
  attackSprite = AttackSprite.NORMAL_MELEE
  evolution = Pkm.MAUSHOLD_THREE
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon, player, stageLevel) => stageLevel >= 14
  )
  passive = Passive.FAMILY
}

export class MausholdThree extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
  attackSprite = AttackSprite.NORMAL_MELEE
  evolution = Pkm.MAUSHOLD_FOUR
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon, player, stageLevel) => stageLevel >= 20
  )
  passive = Passive.FAMILY
}

export class MausholdFour extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 240
  atk = 24
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Morpeko extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.ELECTRIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 50
  range = 1
  skill = Ability.AURA_WHEEL
  attackSprite = AttackSprite.ELECTRIC_MELEE
  passive = Passive.HUNGER_SWITCH
}

export class MorpekoHangry extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.ELECTRIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 50
  range = 1
  skill = Ability.AURA_WHEEL
  attackSprite = AttackSprite.ELECTRIC_MELEE
  passive = Passive.HUNGER_SWITCH
}

export class Minior extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 5
  speDef = 5
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_DOWN
  attackSprite = AttackSprite.ROCK_RANGE
  passive = Passive.METEOR
}

export class MiniorKernelBlue extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 5
  speDef = 5
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_UP
  attackSprite = AttackSprite.ROCK_RANGE
  passive = Passive.METEOR
}

export class MiniorKernelRed extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 5
  speDef = 5
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_UP
  attackSprite = AttackSprite.ROCK_RANGE
  passive = Passive.METEOR
}

export class MiniorKernelOrange extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 5
  speDef = 5
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_UP
  attackSprite = AttackSprite.ROCK_RANGE
  passive = Passive.METEOR
}

export class MiniorKernelGreen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 5
  speDef = 5
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_UP
  attackSprite = AttackSprite.ROCK_RANGE
  passive = Passive.METEOR
}

export class Hoopa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 15
  def = 3
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.UNBOUND
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class HoopaUnbound extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 250
  atk = 25
  def = 3
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.HYPERSPACE_FURY
  attackSprite = AttackSprite.DARK_MELEE
}

export class Gimmighoul extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 2
  hp = 200
  atk = 10
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.GOLD_RUSH
  attackSprite = AttackSprite.DRAGON_MELEE
  evolution = Pkm.GHOLDENGO
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon, player) => player.money >= 99
  )
  passive = Passive.GIMMIGHOUL
}

export class Gholdengo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 230
  atk = 21
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.MAKE_IT_RAIN
  attackSprite = AttackSprite.DRAGON_MELEE
  passive = Passive.GHOLDENGO
}

export class Sobble extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.ULTRA
  evolution = Pkm.DRIZZILE
  stars = 1
  hp = 120
  atk = 14
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.SNIPE_SHOT
  attackSprite = AttackSprite.WATER_RANGE
}

export class Drizzile extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.ULTRA
  evolution = Pkm.INTELEON
  stars = 2
  hp = 200
  atk = 23
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.SNIPE_SHOT
  attackSprite = AttackSprite.WATER_RANGE
}

export class Inteleon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 360
  atk = 40
  def = 6
  speDef = 6
  maxPP = 70
  range = 3
  skill = Ability.SNIPE_SHOT
  attackSprite = AttackSprite.WATER_RANGE
}

export class Comfey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 15
  def = 4
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.FLORAL_HEALING
  passive = Passive.COMFEY
  attackSprite = AttackSprite.FAIRY_RANGE
  canHoldItems = false
  afterSimulationStart({
    simulation,
    team,
    entity
  }: {
    simulation: Simulation
    team: MapSchema<IPokemonEntity>
    entity: IPokemonEntity
  }) {
    const alliesWithFreeSlots = values(team).filter(
      (p) =>
        p.name !== Pkm.COMFEY &&
        p.items.size < 3 &&
        p.refToBoardPokemon.canHoldItems
    )

    if (alliesWithFreeSlots.length > 0) {
      alliesWithFreeSlots.sort(
        (a, b) =>
          distanceM(
            a.positionX,
            a.positionY,
            entity.positionX,
            entity.positionY
          ) -
          distanceM(
            b.positionX,
            b.positionY,
            entity.positionX,
            entity.positionY
          )
      )
      const nearestAllyWithFreeItemSlot = alliesWithFreeSlots[0]

      // delete comfey
      team.delete(entity.id)
      simulation.board.setValue(entity.positionX, entity.positionY, undefined)
      if (simulation.blueDpsMeter.has(entity.id)) {
        simulation.blueDpsMeter.delete(entity.id)
        simulation.blueHealDpsMeter.delete(entity.id)
      }
      if (simulation.redDpsMeter.has(entity.id)) {
        simulation.redDpsMeter.delete(entity.id)
        simulation.redHealDpsMeter.delete(entity.id)
      }

      nearestAllyWithFreeItemSlot.items.add(Item.COMFEY)

      // apply comfey stats
      nearestAllyWithFreeItemSlot.addAbilityPower(entity.ap, entity, 0, false)
      nearestAllyWithFreeItemSlot.addAttack(entity.atk, entity, 0, false)
      nearestAllyWithFreeItemSlot.addAttackSpeed(
        entity.atkSpeed - DEFAULT_ATK_SPEED,
        entity,
        0,
        false
      )
      nearestAllyWithFreeItemSlot.addShield(entity.shield, entity, 0, false)
      nearestAllyWithFreeItemSlot.addMaxHP(entity.hp)
      nearestAllyWithFreeItemSlot.addDefense(entity.def, entity, 0, false)
      nearestAllyWithFreeItemSlot.addSpecialDefense(
        entity.speDef,
        entity,
        0,
        false
      )
      nearestAllyWithFreeItemSlot.addCritChance(
        entity.critChance - DEFAULT_CRIT_CHANCE,
        entity,
        0,
        false
      )
      nearestAllyWithFreeItemSlot.addCritPower(
        entity.critPower - DEFAULT_CRIT_POWER,
        entity,
        0,
        false
      )
    }
  }
}

export class Lillipup extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.COMMON
  evolution = Pkm.HERDIER
  stars = 1
  hp = 60
  atk = 6
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.RETALIATE
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Herdier extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.COMMON
  evolution = Pkm.STOUTLAND
  stars = 2
  hp = 120
  atk = 12
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.RETALIATE
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Stoutland extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 22
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.RETALIATE
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Pheromosa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FIGHTING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 35
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.LUNGE
  attackSprite = AttackSprite.BUG_MELEE
}

export class Dracovish extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FOSSIL,
    Synergy.AQUATIC
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 21
  def = 3
  speDef = 3
  maxPP = 110
  range = 1
  skill = Ability.FISHIOUS_REND
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Bruxish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.PSYCHIC_FANGS
  attackSprite = AttackSprite.WATER_MELEE
}

export class Corsola extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ROCK])
  rarity = Rarity.EPIC
  stars = 1
  hp = 125
  atk = 8
  def = 1
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.RECOVER
  attackSprite = AttackSprite.WATER_MELEE
  passive = Passive.CORSOLA
  evolution = Pkm.GALAR_CORSOLA
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon, player, stageLevel) => stageLevel >= 99 // natural death
  )
  regional = true
}

export class GalarCorsola extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ROCK, Synergy.GHOST])
  evolution = Pkm.CURSOLA
  rarity = Rarity.EPIC
  stars = 2
  hp = 150
  atk = 15
  def = 2
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.CURSE
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
}

export class Cursola extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ROCK, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 25
  def = 3
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.CURSE
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
}

export class Smeargle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.SKETCH
  attackSprite = AttackSprite.NORMAL_MELEE

  afterSimulationStart({ player, entity }) {
    const allyOnTheLeft = player.getPokemonAt(
      this.positionX - 1,
      this.positionY
    )
    if (allyOnTheLeft) {
      entity.maxPP = allyOnTheLeft.maxPP
      entity.skill = allyOnTheLeft.skill
      entity.stars = allyOnTheLeft.stars
    }
  }
}

export class Toxel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.POISON,
    Synergy.BABY
  ])
  rarity = Rarity.RARE
  evolution = Pkm.TOXTRICITY
  stars = 1
  hp = 80
  atk = 8
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.OVERDRIVE
  attackSprite = AttackSprite.ELECTRIC_MELEE
  additional = true
}

export class Toxtricity extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.POISON,
    Synergy.SOUND
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 160
  atk = 21
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.OVERDRIVE
  attackSprite = AttackSprite.ELECTRIC_MELEE
  additional = true
}

export class Cyclizar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.NORMAL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 20
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SHED_TAIL
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Pawniard extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.BISHARP
  hp = 130
  atk = 14
  def = 5
  speDef = 3
  maxPP = 60
  range = 1
  skill = Ability.KOWTOW_CLEAVE
  attackSprite = AttackSprite.STEEL_MELEE
}

export class Bisharp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.KINGAMBIT
  hp = 250
  atk = 26
  def = 8
  speDef = 4
  maxPP = 60
  range = 1
  skill = Ability.KOWTOW_CLEAVE
  attackSprite = AttackSprite.STEEL_MELEE
}

export class Kingambit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 400
  atk = 42
  def = 12
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.KOWTOW_CLEAVE
  attackSprite = AttackSprite.STEEL_MELEE
}

export class Feebas extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER])
  rarity = Rarity.SPECIAL
  evolution = Pkm.MILOTIC
  stars = 1
  hp = 60
  atk = 5
  def = 2
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SPLASH
  passive = Passive.FEEBAS
  attackSprite = AttackSprite.WATER_MELEE
  evolutionRule = new CountEvolutionRule(6)
}

export class Milotic extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FAIRY, Synergy.WATER])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 300
  atk = 16
  def = 4
  speDef = 7
  maxPP = 80
  range = 2
  skill = Ability.ATTRACT
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class Dewpider extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.BUG,
    Synergy.AMORPHOUS
  ])
  additional = true
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARAQUANID
  hp = 60
  atk = 7
  def = 2
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.STICKY_WEB
  attackSprite = AttackSprite.BUG_MELEE
  passive = Passive.WATER_BUBBLE
}

export class Araquanid extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.BUG,
    Synergy.AMORPHOUS
  ])
  additional = true
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 16
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.STICKY_WEB
  attackSprite = AttackSprite.BUG_MELEE
  passive = Passive.WATER_BUBBLE
}

export class Lickitung extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.LICKILICKY
  hp = 70
  atk = 6
  def = 2
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.LICK
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Lickilicky extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 11
  def = 4
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.LICK
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Kangaskhan extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.FIGHTING,
    Synergy.NORMAL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.UPPERCUT
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Teddiursa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.URSARING
  hp = 150
  atk = 12
  def = 4
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.FURY_SWIPES
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Ursaring extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.URSALUNA
  hp = 280
  atk = 23
  def = 6
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.FURY_SWIPES
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Ursaluna extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 450
  atk = 28
  def = 12
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.FURY_SWIPES
  passive = Passive.BLOODMOON
  attackSprite = AttackSprite.NORMAL_MELEE
  beforeSimulationStart({
    weather,
    player
  }: { weather: Weather; player: Player }) {
    if (weather === Weather.BLOODMOON) {
      player.transformPokemon(this, Pkm.URSALUNA_BLOODMOON)
    }
  }
}

export class UrsalunaBloodmoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 380
  atk = 36
  def = 14
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.BLOOD_MOON
  attackSprite = AttackSprite.NORMAL_MELEE
  beforeSimulationStart({
    weather,
    player
  }: { weather: Weather; player: Player }) {
    if (weather !== Weather.BLOODMOON) {
      player.transformPokemon(this, Pkm.URSALUNA)
    }
  }
  onAcquired(player: Player) {
    player.titles.add(Title.BLOODY)
  }
}

export class Aipom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.AMBIPOM
  hp = 70
  atk = 7
  def = 2
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.TICKLE
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Ambipom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 14
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.TICKLE
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Deerling extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SAWSBUCK
  hp = 80
  atk = 8
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.AROMATHERAPY
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Sawsbuck extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 14
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.AROMATHERAPY
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Patrat extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WATCHOG
  hp = 80
  atk = 8
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.DETECT
  attackSprite = AttackSprite.ROCK_RANGE
}

export class Watchog extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 18
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.DETECT
  attackSprite = AttackSprite.ROCK_RANGE
}

export class Spinarak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.BUG, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARIADOS
  hp = 60
  atk = 6
  def = 1
  speDef = 1
  maxPP = 70
  range = 2
  skill = Ability.STRING_SHOT
  attackSprite = AttackSprite.POISON_RANGE
}

export class Ariados extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.BUG, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  def = 2
  speDef = 2
  maxPP = 70
  range = 2
  skill = Ability.STRING_SHOT
  attackSprite = AttackSprite.POISON_RANGE
}

export class Rockruff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ROCK])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.LYCANROC_DUSK
  hp = 90
  atk = 14
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.ACCELEROCK
  attackSprite = AttackSprite.NORMAL_MELEE
}

function updateLycanroc(pokemon: Pokemon, weather: Weather, player: Player) {
  let weatherForm
  if (weather === Weather.NIGHT) {
    weatherForm = Pkm.LYCANROC_NIGHT
  } else if (weather === Weather.SUN) {
    weatherForm = Pkm.LYCANROC_DAY
  }

  if (!weatherForm || pokemon.name === weatherForm) return

  const newPokemon = PokemonFactory.createPokemonFromName(weatherForm, player)
  pokemon.items.forEach((item) => {
    newPokemon.items.add(item)
  })
  newPokemon.positionX = pokemon.positionX
  newPokemon.positionY = pokemon.positionY
  player.board.delete(pokemon.id)
  player.board.set(newPokemon.id, newPokemon)
  player.updateSynergies()
}

export class LycanrocDusk extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ROCK])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 26
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ACCELEROCK
  passive = Passive.LYCANROC
  attackSprite = AttackSprite.NORMAL_MELEE

  beforeSimulationStart({ weather, player }) {
    updateLycanroc(this, weather, player)
  }
}

export class LycanrocNight extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ROCK, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 26
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ACCELEROCK
  passive = Passive.LYCANROC
  attackSprite = AttackSprite.NORMAL_MELEE

  beforeSimulationStart({ weather, player }) {
    updateLycanroc(this, weather, player)
  }
}

export class LycanrocDay extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ROCK, Synergy.LIGHT])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 26
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ACCELEROCK
  passive = Passive.LYCANROC
  attackSprite = AttackSprite.NORMAL_MELEE

  beforeSimulationStart({ weather, player }) {
    updateLycanroc(this, weather, player)
  }
}

export class Druddigon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.WILD,
    Synergy.MONSTER
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 170
  atk = 18
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.OUTRAGE
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Cosmog extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  evolution = Pkm.COSMOEM
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon) => pokemon.hp >= 200
  )
  stars = 1
  hp = 100
  atk = 5
  def = 4
  speDef = 4
  maxPP = 100
  range = 4
  skill = Ability.TELEPORT
  passive = Passive.COSMOG
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Cosmoem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  evolution = Pkm.LUNALA
  stars = 2
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon) => pokemon.hp >= 300,
    (pokemon, player) => {
      if (
        pokemon.positionX === player.lightX &&
        pokemon.positionY === player.lightY
      )
        return Pkm.SOLGALEO
      else return Pkm.LUNALA
    }
  )
  hp = 200
  atk = 5
  def = 8
  speDef = 8
  maxPP = 100
  range = 4
  skill = Ability.COSMIC_POWER
  passive = Passive.COSMOEM
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Solgaleo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.LIGHT,
    Synergy.STEEL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  def = 8
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.SUNSTEEL_STRIKE
  attackSprite = AttackSprite.STEEL_MELEE
  onAcquired(player: Player) {
    player.titles.add(Title.STARGAZER)
  }
}

export class Lunala extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.LIGHT,
    Synergy.GHOST
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  def = 8
  speDef = 8
  maxPP = 100
  range = 4
  skill = Ability.MOONGEIST_BEAM
  attackSprite = AttackSprite.STEEL_MELEE
  onAcquired(player: Player) {
    player.titles.add(Title.STARGAZER)
  }
}

export class Magearna extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.FAIRY,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  def = 4
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.FLEUR_CANNON
  attackSprite = AttackSprite.FAIRY_MELEE
  passive = Passive.SOUL_HEART
}

export class Impidimp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FAIRY, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MORGREM
  hp = 60
  atk = 6
  def = 1
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.SPIRIT_BREAK
  attackSprite = AttackSprite.DARK_MELEE
  regional = true
}

export class Morgrem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FAIRY, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.GRIMMSNARL
  hp = 110
  atk = 11
  def = 2
  speDef = 3
  maxPP = 70
  range = 1
  skill = Ability.SPIRIT_BREAK
  attackSprite = AttackSprite.DARK_MELEE
  regional = true
}

export class Grimmsnarl extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FAIRY, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.SPIRIT_BREAK
  attackSprite = AttackSprite.DARK_MELEE
  regional = true
}

export class Drowzee extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.HUMAN,
    Synergy.PSYCHIC,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HYPNO
  hp = 100
  atk = 7
  def = 2
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.DREAM_EATER
  attackSprite = AttackSprite.PSYCHIC_RANGE
  regional = true
}

export class Hypno extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.HUMAN,
    Synergy.PSYCHIC,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 14
  def = 4
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.DREAM_EATER
  attackSprite = AttackSprite.PSYCHIC_RANGE
  regional = true
}

export class Wattrel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ELECTRIC])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.KILOWATTREL
  hp = 90
  atk = 9
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.SPARK
  attackSprite = AttackSprite.ELECTRIC_RANGE
  additional = true
  passive = Passive.WIND_POWER
}

export class Kilowattrel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ELECTRIC])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 19
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.SPARK
  attackSprite = AttackSprite.ELECTRIC_RANGE
  additional = true
  passive = Passive.WIND_POWER
}

export class BurmyPlant extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WORMADAM_PLANT
  hp = 70
  atk = 7
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  attackSprite = AttackSprite.GRASS_RANGE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.GRASS)
  }
}

export class BurmySandy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WORMADAM_SANDY
  hp = 70
  atk = 7
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  attackSprite = AttackSprite.ROCK_RANGE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.GROUND) &&
      !regionSynergies.includes(Synergy.GRASS)
    )
  }
}

export class BurmyTrash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ARTIFICIAL])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WORMADAM_TRASH
  hp = 70
  atk = 7
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  attackSprite = AttackSprite.POISON_RANGE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.ARTIFICIAL) &&
      !regionSynergies.includes(Synergy.GROUND) &&
      !regionSynergies.includes(Synergy.GRASS)
    )
  }
}

export class WormadamPlant extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.MOTHIM
  hp = 150
  atk = 13
  def = 3
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  attackSprite = AttackSprite.GRASS_RANGE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.GRASS)
  }
}

export class WormadamSandy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.MOTHIM
  hp = 150
  atk = 13
  def = 3
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  attackSprite = AttackSprite.ROCK_RANGE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.GROUND) &&
      !regionSynergies.includes(Synergy.GRASS)
    )
  }
}

export class WormadamTrash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ARTIFICIAL])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.MOTHIM
  hp = 150
  atk = 13
  def = 3
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  attackSprite = AttackSprite.POISON_RANGE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.ARTIFICIAL) &&
      !regionSynergies.includes(Synergy.GRASS)
    )
  }
}

export class Mothim extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.QUIVER_DANCE
  attackSprite = AttackSprite.POISON_RANGE
  passive = Passive.MOTHIM
  stages = 3
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state?: GameState) {
    // always hide mothim to avoid showing duplicated with other burmy forms
    // this does not impact the evolution of wormadam
    return false
  }
  onAcquired(player: Player) {
    if (player.regionalPokemons.includes(Pkm.BURMY_PLANT)) {
      this.types.add(Synergy.GRASS)
    }
    if (player.regionalPokemons.includes(Pkm.BURMY_SANDY)) {
      this.types.add(Synergy.GROUND)
    }
    if (player.regionalPokemons.includes(Pkm.BURMY_TRASH)) {
      this.types.add(Synergy.ARTIFICIAL)
    }
  }
}

export class PaldeaWooper extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.GROUND,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  evolution = Pkm.CLODSIRE
  stars = 1
  hp = 80
  atk = 5
  def = 3
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.RECOVER
  attackSprite = AttackSprite.POISON_MELEE
  regional = true
}

export class Clodsire extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.GROUND,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 230
  atk = 10
  def = 5
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.RECOVER
  attackSprite = AttackSprite.POISON_MELEE
  regional = true
}

export class Tangela extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.MONSTER,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNCOMMON
  evolution = Pkm.TANGROWTH
  stars = 1
  hp = 100
  atk = 3
  def = 4
  speDef = 2
  maxPP = 120
  range = 1
  skill = Ability.POWER_WHIP
  attackSprite = AttackSprite.GRASS_MELEE
  regional = true
}

export class Tangrowth extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.MONSTER,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 190
  atk = 13
  def = 6
  speDef = 2
  maxPP = 120
  range = 1
  skill = Ability.POWER_WHIP
  attackSprite = AttackSprite.GRASS_MELEE
  regional = true
}

export class Phanpy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.WILD, Synergy.BABY])
  rarity = Rarity.RARE
  evolution = Pkm.DONPHAN
  stars = 1
  hp = 80
  atk = 5
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.RAPID_SPIN
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Donphan extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.WILD])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 10
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.RAPID_SPIN
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Spoink extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.RARE
  evolution = Pkm.GRUMPIG
  stars = 1
  hp = 100
  atk = 5
  def = 4
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.BOUNCE
  attackSprite = AttackSprite.PSYCHIC_MELEE
  regional = true
}

export class Grumpig extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 240
  atk = 10
  def = 6
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.BOUNCE
  attackSprite = AttackSprite.PSYCHIC_MELEE
  regional = true
}

export class Sinistea extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.POLTEAGEIST
  hp = 80
  atk = 4
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.TEA_TIME
  attackSprite = AttackSprite.GHOST_RANGE
  additional = true
}

export class Polteageist extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 9
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.TEA_TIME
  attackSprite = AttackSprite.GHOST_RANGE
  additional = true
}

export class Ferroseed extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.STEEL])
  rarity = Rarity.EPIC
  evolution = Pkm.FERROTHORN
  stars = 1
  hp = 100
  atk = 7
  def = 7
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.SPIKES
  attackSprite = AttackSprite.GRASS_MELEE
  additional = true
}

export class Ferrothorn extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.STEEL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 220
  atk = 14
  def = 14
  speDef = 14
  maxPP = 100
  range = 1
  skill = Ability.SPIKES
  attackSprite = AttackSprite.GRASS_MELEE
  additional = true
}

export class Golett extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.ARTIFICIAL,
    Synergy.GHOST
  ])
  rarity = Rarity.RARE
  evolution = Pkm.GOLURK
  stars = 1
  hp = 80
  atk = 7
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.SHADOW_PUNCH
  attackSprite = AttackSprite.NORMAL_MELEE
  additional = true
}

export class Golurk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.ARTIFICIAL,
    Synergy.GHOST
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 20
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SHADOW_PUNCH
  attackSprite = AttackSprite.NORMAL_MELEE
  additional = true
}

export class Trubbish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.ARTIFICIAL])
  rarity = Rarity.EPIC
  evolution = Pkm.GARBODOR
  stars = 1
  hp = 110
  atk = 8
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.GUNK_SHOT
  passive = Passive.RECYCLE
  attackSprite = AttackSprite.POISON_MELEE
  additional = true

  defaultValues = {
    [Stat.HP]: this.hp,
    [Stat.ATK]: this.atk,
    [Stat.DEF]: this.def,
    [Stat.SPE_DEF]: this.speDef
  }

  statIncreases = {
    [Stat.HP]: 0,
    [Stat.ATK]: 0,
    [Stat.ATK_SPEED]: 0,
    [Stat.AP]: 0,
    [Stat.DEF]: 0,
    [Stat.SPE_DEF]: 0,
    [Stat.CRIT_CHANCE]: 0,
    [Stat.PP]: 0,
    [Stat.SHIELD]: 0
  }

  beforeSimulationStart({ player }: { player: Player }) {
    values(this.items).forEach((item) => {
      if (Berries.includes(item)) {
        this.statIncreases[Stat.HP] += 10
        this.items.delete(item)
      }
      if (ItemComponents.includes(item)) {
        this.statIncreases[Stat.HP] += 25
        if (ItemStats[item]) {
          Object.entries(ItemStats[item]).forEach(
            ([stat, value]) => (this.statIncreases[stat as Stat] += value)
          )
        }
        this.items.delete(item)
      }
      if (ArtificialItems.includes(item)) {
        this.statIncreases[Stat.HP] += 50
        this.items.delete(item)

        const itemIndex = player.artificialItems.indexOf(item)
        player.artificialItems[itemIndex] = Item.TRASH
        player.items.push(player.artificialItems[itemIndex])
      }
    })

    // Update permanent stats
    this.hp = this.defaultValues[Stat.HP] + this.statIncreases[Stat.HP]
    this.atk = this.defaultValues[Stat.ATK] + this.statIncreases[Stat.ATK]
    this.def = this.defaultValues[Stat.DEF] + this.statIncreases[Stat.DEF]
    this.speDef =
      this.defaultValues[Stat.SPE_DEF] + this.statIncreases[Stat.SPE_DEF]
  }

  afterSimulationStart({ entity }: { entity: IPokemonEntity }) {
    // Add non-permanent stats to Trubbish
    entity.addAbilityPower(this.statIncreases[Stat.AP], entity, 0, false)
    entity.addShield(this.statIncreases[Stat.SHIELD], entity, 0, false)
    entity.addCritChance(this.statIncreases[Stat.CRIT_CHANCE], entity, 0, false)
    entity.addPP(this.statIncreases[Stat.PP], entity, 0, false)
    entity.addAttackSpeed(this.statIncreases[Stat.ATK_SPEED], entity, 0, false)
  }

  onEvolve({
    pokemonEvolved: garbodorObj,
    pokemonsBeforeEvolution: trubbishes
  }: {
    pokemonEvolved: Pokemon
    pokemonsBeforeEvolution: Pokemon[]
  }) {
    // Carry over the stats gained with passive
    const garbodor = garbodorObj as Garbodor
    garbodor.statIncreases = {
      [Stat.HP]: 0,
      [Stat.ATK]: 0,
      [Stat.ATK_SPEED]: 0,
      [Stat.AP]: 0,
      [Stat.DEF]: 0,
      [Stat.SPE_DEF]: 0,
      [Stat.CRIT_CHANCE]: 0,
      [Stat.PP]: 0,
      [Stat.SHIELD]: 0
    }

    trubbishes.forEach((trubbishObj) => {
      const trubbish = trubbishObj as Trubbish
      for (const key in garbodor.statIncreases) {
        garbodor.statIncreases[key] += trubbish.statIncreases[key]
      }
    })

    garbodor.hp += garbodor.statIncreases[Stat.HP]
    garbodor.atk += garbodor.statIncreases[Stat.ATK]
    garbodor.def += garbodor.statIncreases[Stat.DEF]
    garbodor.speDef += garbodor.statIncreases[Stat.SPE_DEF]
  }
}

export class Garbodor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.ARTIFICIAL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 230
  atk = 15
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.GUNK_SHOT
  passive = Passive.RECYCLE
  attackSprite = AttackSprite.POISON_MELEE
  additional = true

  statIncreases = {
    [Stat.HP]: 0,
    [Stat.ATK]: 0,
    [Stat.ATK_SPEED]: 0,
    [Stat.AP]: 0,
    [Stat.DEF]: 0,
    [Stat.SPE_DEF]: 0,
    [Stat.CRIT_CHANCE]: 0,
    [Stat.PP]: 0,
    [Stat.SHIELD]: 0
  }

  defaultValues = {
    [Stat.HP]: this.hp,
    [Stat.ATK]: this.atk,
    [Stat.DEF]: this.def,
    [Stat.SPE_DEF]: this.speDef
  }

  beforeSimulationStart = Trubbish.prototype.beforeSimulationStart
  afterSimulationStart = Trubbish.prototype.afterSimulationStart
}

export class Grubbin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.CHARJABUG
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 80
  atk = 6
  def = 2
  speDef = 2
  maxPP = 80
  range = 3
  skill = Ability.ZAP_CANNON
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Charjabug extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.VIKAVOLT
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 140
  atk = 13
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.ZAP_CANNON
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Vikavolt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 25
  def = 4
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.ZAP_CANNON
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class ShellosWestSea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.GROUND,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GASTRODON_WEST_SEA
  hp = 120
  atk = 8
  def = 3
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.MUDDY_WATER
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.WATER) ||
      regionSynergies.includes(Synergy.GROUND)
    )
  }
}

export class GastrodonWestSea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.GROUND,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 270
  atk = 18
  def = 5
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.MUDDY_WATER
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.WATER) ||
      regionSynergies.includes(Synergy.GROUND)
    )
  }
}

export class ShellosEastSea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GASTRODON_EAST_SEA
  hp = 120
  atk = 8
  def = 3
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.ANCIENT_POWER
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (regionSynergies.includes(Synergy.AQUATIC) ||
        regionSynergies.includes(Synergy.ROCK)) &&
      !(
        regionSynergies.includes(Synergy.GROUND) ||
        regionSynergies.includes(Synergy.WATER)
      )
    )
  }
}

export class GastrodonEastSea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 270
  atk = 18
  def = 5
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.ANCIENT_POWER
  attackSprite = AttackSprite.WATER_MELEE
  regional = true
  isInRegion(pkm: Pkm, map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (regionSynergies.includes(Synergy.AQUATIC) ||
        regionSynergies.includes(Synergy.ROCK)) &&
      !(
        regionSynergies.includes(Synergy.GROUND) ||
        regionSynergies.includes(Synergy.WATER)
      )
    )
  }
}

export const PokemonClasses: Record<
  Pkm,
  new (
    shiny?: boolean,
    emotion?: Emotion
  ) => Pokemon
> = {
  [Pkm.DEFAULT]: Pokemon,
  [Pkm.DITTO]: Ditto,
  [Pkm.BULBASAUR]: Bulbasaur,
  [Pkm.IVYSAUR]: Ivysaur,
  [Pkm.VENUSAUR]: Venusaur,
  [Pkm.CHARMANDER]: Charmander,
  [Pkm.CHARMELEON]: Charmeleon,
  [Pkm.CHARIZARD]: Charizard,
  [Pkm.SQUIRTLE]: Squirtle,
  [Pkm.WARTORTLE]: Wartortle,
  [Pkm.BLASTOISE]: Blastoise,
  [Pkm.SLOWPOKE]: Slowpoke,
  [Pkm.SLOWBRO]: Slowbro,
  [Pkm.SLOWKING]: Slowking,
  [Pkm.GEODUDE]: Geodude,
  [Pkm.GRAVELER]: Graveler,
  [Pkm.GOLEM]: Golem,
  [Pkm.AZURILL]: Azurill,
  [Pkm.MARILL]: Marill,
  [Pkm.AZUMARILL]: Azumarill,
  [Pkm.ZUBAT]: Zubat,
  [Pkm.GOLBAT]: Golbat,
  [Pkm.CROBAT]: Crobat,
  [Pkm.AMPHAROS]: Ampharos,
  [Pkm.MAREEP]: Mareep,
  [Pkm.FLAFFY]: Flaffy,
  [Pkm.CLEFFA]: Cleffa,
  [Pkm.CLEFAIRY]: Clefairy,
  [Pkm.CLEFABLE]: Clefable,
  [Pkm.IGGLYBUFF]: Igglybuff,
  [Pkm.JIGGLYPUFF]: Jigglypuff,
  [Pkm.WIGGLYTUFF]: Wigglytuff,
  [Pkm.CATERPIE]: Caterpie,
  [Pkm.METAPOD]: Metapod,
  [Pkm.BUTTERFREE]: Butterfree,
  [Pkm.WEEDLE]: Weedle,
  [Pkm.KAKUNA]: Kakuna,
  [Pkm.BEEDRILL]: Beedrill,
  [Pkm.PIDGEY]: Pidgey,
  [Pkm.PIDGEOTTO]: Pidgeotto,
  [Pkm.PIDGEOT]: Pidgeot,
  [Pkm.HOPPIP]: Hoppip,
  [Pkm.SKIPLOOM]: Skiploom,
  [Pkm.JUMPLUFF]: Jumpluff,
  [Pkm.SEEDOT]: Seedot,
  [Pkm.NUZLEAF]: Nuzleaf,
  [Pkm.SHIFTRY]: Shiftry,
  [Pkm.STARLY]: Starly,
  [Pkm.STARAVIA]: Staravia,
  [Pkm.STARAPTOR]: Staraptor,
  [Pkm.CHIKORITA]: Chikorita,
  [Pkm.BAYLEEF]: Bayleef,
  [Pkm.MEGANIUM]: Meganium,
  [Pkm.CYNDAQUIL]: Cyndaquil,
  [Pkm.QUILAVA]: Quilava,
  [Pkm.TYPHLOSION]: Typhlosion,
  [Pkm.TOTODILE]: Totodile,
  [Pkm.CROCONAW]: Croconaw,
  [Pkm.FERALIGATR]: Feraligatr,
  [Pkm.TREECKO]: Treecko,
  [Pkm.GROVYLE]: Grovyle,
  [Pkm.SCEPTILE]: Sceptile,
  [Pkm.TORCHIC]: Torchic,
  [Pkm.COMBUSKEN]: Combusken,
  [Pkm.BLAZIKEN]: Blaziken,
  [Pkm.MUDKIP]: Mudkip,
  [Pkm.MARSHTOMP]: Marshtomp,
  [Pkm.SWAMPERT]: Swampert,
  [Pkm.TURTWIG]: Turtwig,
  [Pkm.GROTLE]: Grotle,
  [Pkm.TORTERRA]: Torterra,
  [Pkm.CHIMCHAR]: Chimchar,
  [Pkm.MONFERNO]: Monferno,
  [Pkm.INFERNAPE]: Infernape,
  [Pkm.PIPLUP]: Piplup,
  [Pkm.PRINPLUP]: Prinplup,
  [Pkm.EMPOLEON]: Empoleon,
  [Pkm.NIDORANF]: NidoranF,
  [Pkm.NIDORINA]: Nidorina,
  [Pkm.NIDOQUEEN]: Nidoqueen,
  [Pkm.NIDORANM]: NidoranM,
  [Pkm.NIDORINO]: Nidorino,
  [Pkm.NIDOKING]: Nidoking,
  [Pkm.PICHU]: Pichu,
  [Pkm.PIKACHU]: Pikachu,
  [Pkm.RAICHU]: Raichu,
  [Pkm.MACHOP]: Machop,
  [Pkm.MACHOKE]: Machoke,
  [Pkm.MACHAMP]: Machamp,
  [Pkm.HORSEA]: Horsea,
  [Pkm.SEADRA]: Seadra,
  [Pkm.KINGDRA]: Kingdra,
  [Pkm.TRAPINCH]: Trapinch,
  [Pkm.VIBRAVA]: Vibrava,
  [Pkm.FLYGON]: Flygon,
  [Pkm.SPHEAL]: Spheal,
  [Pkm.SEALEO]: Sealeo,
  [Pkm.WALREIN]: Walrein,
  [Pkm.ARON]: Aron,
  [Pkm.LAIRON]: Lairon,
  [Pkm.AGGRON]: Aggron,
  [Pkm.MAGNEMITE]: Magnemite,
  [Pkm.MAGNETON]: Magneton,
  [Pkm.MAGNEZONE]: Magnezone,
  [Pkm.RHYHORN]: Rhyhorn,
  [Pkm.RHYDON]: Rhydon,
  [Pkm.RHYPERIOR]: Rhyperior,
  [Pkm.TOGEPI]: Togepi,
  [Pkm.TOGETIC]: Togetic,
  [Pkm.TOGEKISS]: Togekiss,
  [Pkm.DUSKULL]: Duskull,
  [Pkm.DUSCLOPS]: Dusclops,
  [Pkm.DUSKNOIR]: Dusknoir,
  [Pkm.LOTAD]: Lotad,
  [Pkm.LOMBRE]: Lombre,
  [Pkm.LUDICOLO]: Ludicolo,
  [Pkm.SHINX]: Shinx,
  [Pkm.LUXIO]: Luxio,
  [Pkm.LUXRAY]: Luxray,
  [Pkm.POLIWAG]: Poliwag,
  [Pkm.POLIWHIRL]: Poliwhirl,
  [Pkm.POLITOED]: Politoed,
  [Pkm.ABRA]: Abra,
  [Pkm.KADABRA]: Kadabra,
  [Pkm.ALAKAZAM]: Alakazam,
  [Pkm.GASTLY]: Gastly,
  [Pkm.HAUNTER]: Haunter,
  [Pkm.GENGAR]: Gengar,
  [Pkm.DRATINI]: Dratini,
  [Pkm.DRAGONAIR]: Dragonair,
  [Pkm.DRAGONITE]: Dragonite,
  [Pkm.LARVITAR]: Larvitar,
  [Pkm.PUPITAR]: Pupitar,
  [Pkm.TYRANITAR]: Tyranitar,
  [Pkm.SLAKOTH]: Slakoth,
  [Pkm.VIGOROTH]: Vigoroth,
  [Pkm.SLAKING]: Slaking,
  [Pkm.RALTS]: Ralts,
  [Pkm.KIRLIA]: Kirlia,
  [Pkm.GARDEVOIR]: Gardevoir,
  [Pkm.BAGON]: Bagon,
  [Pkm.SHELGON]: Shelgon,
  [Pkm.SALAMENCE]: Salamence,
  [Pkm.BELDUM]: Beldum,
  [Pkm.METANG]: Metang,
  [Pkm.METAGROSS]: Metagross,
  [Pkm.GIBLE]: Gible,
  [Pkm.GABITE]: Gabite,
  [Pkm.GARCHOMP]: Garchomp,
  [Pkm.ELEKID]: Elekid,
  [Pkm.ELECTABUZZ]: Electabuzz,
  [Pkm.ELECTIVIRE]: Electivire,
  [Pkm.MAGBY]: Magby,
  [Pkm.MAGMAR]: Magmar,
  [Pkm.MAGMORTAR]: Magmortar,
  [Pkm.MUNCHLAX]: Munchlax,
  [Pkm.SNORLAX]: Snorlax,
  [Pkm.GROWLITHE]: Growlithe,
  [Pkm.ARCANINE]: Arcanine,
  [Pkm.HISUI_GROWLITHE]: HisuiGrowlithe,
  [Pkm.HISUI_ARCANINE]: HisuiArcanine,
  [Pkm.ONIX]: Onix,
  [Pkm.STEELIX]: Steelix,
  [Pkm.MEGA_STEELIX]: MegaSteelix,
  [Pkm.SCYTHER]: Scyther,
  [Pkm.SCIZOR]: Scizor,
  [Pkm.MEGA_SCIZOR]: MegaScizor,
  [Pkm.RIOLU]: Riolu,
  [Pkm.LUCARIO]: Lucario,
  [Pkm.MAGIKARP]: Magikarp,
  [Pkm.RATTATA]: Rattata,
  [Pkm.ALOLAN_RATTATA]: AlolanRattata,
  [Pkm.RATICATE]: Raticate,
  [Pkm.ALOLAN_RATICATE]: AlolanRaticate,
  [Pkm.SPEAROW]: Spearow,
  [Pkm.FEAROW]: Fearow,
  [Pkm.GYARADOS]: Gyarados,
  [Pkm.LUGIA]: Lugia,
  [Pkm.ZAPDOS]: Zapdos,
  [Pkm.MOLTRES]: Moltres,
  [Pkm.ARTICUNO]: Articuno,
  [Pkm.DIALGA]: Dialga,
  [Pkm.PALKIA]: Palkia,
  [Pkm.SUICUNE]: Suicune,
  [Pkm.RAIKOU]: Raikou,
  [Pkm.ENTEI]: Entei,
  [Pkm.KYOGRE]: Kyogre,
  [Pkm.GROUDON]: Groudon,
  [Pkm.RAYQUAZA]: Rayquaza,
  [Pkm.MEGA_RAYQUAZA]: MegaRayquaza,
  [Pkm.REGICE]: Regice,
  [Pkm.REGIROCK]: Regirock,
  [Pkm.REGISTEEL]: Registeel,
  [Pkm.REGIGIGAS]: Regigigas,
  [Pkm.GIRATINA]: Giratina,
  [Pkm.EEVEE]: Eevee,
  [Pkm.VAPOREON]: Vaporeon,
  [Pkm.JOLTEON]: Jolteon,
  [Pkm.FLAREON]: Flareon,
  [Pkm.ESPEON]: Espeon,
  [Pkm.UMBREON]: Umbreon,
  [Pkm.LEAFEON]: Leafeon,
  [Pkm.SYLVEON]: Sylveon,
  [Pkm.GLACEON]: Glaceon,
  [Pkm.MEDITITE]: Meditite,
  [Pkm.MEDICHAM]: Medicham,
  [Pkm.MEGA_MEDICHAM]: MegaMedicham,
  [Pkm.NUMEL]: Numel,
  [Pkm.CAMERUPT]: Camerupt,
  [Pkm.MEGA_CAMERUPT]: MegaCamerupt,
  [Pkm.DARKRAI]: Darkrai,
  [Pkm.LITWICK]: Litwick,
  [Pkm.LAMPENT]: Lampent,
  [Pkm.CHANDELURE]: Chandelure,
  [Pkm.BELLSPROUT]: Bellsprout,
  [Pkm.WEEPINBELL]: Weepinbell,
  [Pkm.VICTREEBEL]: Victreebel,
  [Pkm.SWINUB]: Swinub,
  [Pkm.PILOSWINE]: Piloswine,
  [Pkm.MAMOSWINE]: Mamoswine,
  [Pkm.SNORUNT]: Snorunt,
  [Pkm.GLALIE]: Glalie,
  [Pkm.FROSLASS]: Froslass,
  [Pkm.SNOVER]: Snover,
  [Pkm.ABOMASNOW]: Abomasnow,
  [Pkm.MEGA_ABOMASNOW]: MegaAbomasnow,
  [Pkm.VANILLITE]: Vanillite,
  [Pkm.VANILLISH]: Vanillish,
  [Pkm.VANILLUXE]: Vanilluxe,
  [Pkm.LARVESTA]: Larvesta,
  [Pkm.VOLCARONA]: Volcarona,
  [Pkm.LANDORUS]: Landorus,
  [Pkm.THUNDURUS]: Thundurus,
  [Pkm.TORNADUS]: Tornadus,
  [Pkm.ENAMORUS]: Enamorus,
  [Pkm.KELDEO]: Keldeo,
  [Pkm.TERRAKION]: Terrakion,
  [Pkm.VIRIZION]: Virizion,
  [Pkm.COBALION]: Cobalion,
  [Pkm.MANAPHY]: Manaphy,
  [Pkm.PHIONE]: Phione,
  [Pkm.SPIRITOMB]: Spiritomb,
  [Pkm.ABSOL]: Absol,
  [Pkm.LAPRAS]: Lapras,
  [Pkm.LATIAS]: Latias,
  [Pkm.LATIOS]: Latios,
  [Pkm.MESPRIT]: Mesprit,
  [Pkm.AZELF]: Azelf,
  [Pkm.UXIE]: Uxie,
  [Pkm.MEWTWO]: Mewtwo,
  [Pkm.KYUREM]: Kyurem,
  [Pkm.RESHIRAM]: Reshiram,
  [Pkm.ZEKROM]: Zekrom,
  [Pkm.CELEBI]: Celebi,
  [Pkm.VICTINI]: Victini,
  [Pkm.JIRACHI]: Jirachi,
  [Pkm.ARCEUS]: Arceus,
  [Pkm.SHAYMIN]: Shaymin,
  [Pkm.SHAYMIN_SKY]: ShayminSky,
  [Pkm.CRESSELIA]: Cresselia,
  [Pkm.HEATRAN]: Heatran,
  [Pkm.HO_OH]: HooH,
  [Pkm.ROTOM]: Rotom,
  [Pkm.AERODACTYL]: Aerodactyl,
  [Pkm.SWABLU]: Swablu,
  [Pkm.CARVANHA]: Carvanha,
  [Pkm.PRIMAL_KYOGRE]: PrimalKyogre,
  [Pkm.PRIMAL_GROUDON]: PrimalGroudon,
  [Pkm.MEOWTH]: Meowth,
  [Pkm.PERSIAN]: Persian,
  [Pkm.DEINO]: Deino,
  [Pkm.ZWEILOUS]: Zweilous,
  [Pkm.HYDREIGON]: Hydreigon,
  [Pkm.SANDILE]: Sandile,
  [Pkm.KROKOROK]: Krookorok,
  [Pkm.KROOKODILE]: Krookodile,
  [Pkm.SOLOSIS]: Solosis,
  [Pkm.DUOSION]: Duosion,
  [Pkm.REUNICLUS]: Reuniclus,
  [Pkm.ODDISH]: Oddish,
  [Pkm.GLOOM]: Gloom,
  [Pkm.VILEPLUME]: Vileplume,
  [Pkm.BELLOSSOM]: Bellossom,
  [Pkm.AMAURA]: Amaura,
  [Pkm.AURORUS]: Aurorus,
  [Pkm.ANORITH]: Anorith,
  [Pkm.ARMALDO]: Armaldo,
  [Pkm.ARCHEN]: Archen,
  [Pkm.ARCHEOPS]: Archeops,
  [Pkm.SHIELDON]: Shieldon,
  [Pkm.BASTIODON]: Bastiodon,
  [Pkm.TIRTOUGA]: Tirtouga,
  [Pkm.CARRACOSTA]: Carracosta,
  [Pkm.LILEEP]: Lileep,
  [Pkm.CRADILY]: Cradily,
  [Pkm.OMANYTE]: Omanyte,
  [Pkm.OMASTAR]: Omastar,
  [Pkm.CRANIDOS]: Cranidos,
  [Pkm.RAMPARDOS]: Rampardos,
  [Pkm.TYRUNT]: Tyrunt,
  [Pkm.TYRANTRUM]: Tyrantrum,
  [Pkm.KABUTO]: Kabuto,
  [Pkm.KABUTOPS]: Kabutops,
  [Pkm.BUDEW]: Budew,
  [Pkm.ROSELIA]: Roselia,
  [Pkm.ROSERADE]: Roserade,
  [Pkm.BUNEARY]: Buneary,
  [Pkm.LOPUNNY]: Lopunny,
  [Pkm.MEGA_LOPUNNY]: MegaLopunny,
  [Pkm.AXEW]: Axew,
  [Pkm.FRAXURE]: Fraxure,
  [Pkm.HAXORUS]: Haxorus,
  [Pkm.VENIPEDE]: Venipede,
  [Pkm.WHIRLIPEDE]: Whirlipede,
  [Pkm.SCOLIPEDE]: Scolipede,
  [Pkm.PORYGON]: Porygon,
  [Pkm.PORYGON_2]: Porygon2,
  [Pkm.PORYGON_Z]: PorygonZ,
  [Pkm.ELECTRIKE]: Electrike,
  [Pkm.MANECTRIC]: Manectric,
  [Pkm.MEGA_MANECTRIC]: MegaManectric,
  [Pkm.SHUPPET]: Shuppet,
  [Pkm.BANETTE]: Banette,
  [Pkm.MEGA_BANETTE]: MegaBanette,
  [Pkm.HONEDGE]: Honedge,
  [Pkm.DOUBLADE]: Doublade,
  [Pkm.AEGISLASH]: Aegislash,
  [Pkm.CUBONE]: Cubone,
  [Pkm.MAROWAK]: Marowak,
  [Pkm.ALOLAN_MAROWAK]: AlolanMarowak,
  [Pkm.WHISMUR]: Whismur,
  [Pkm.LOUDRED]: Loudred,
  [Pkm.EXPLOUD]: Exploud,
  [Pkm.TYMPOLE]: Tympole,
  [Pkm.PALPITOAD]: Palpitoad,
  [Pkm.SEISMITOAD]: Seismitoad,
  [Pkm.SEWADDLE]: Sewaddle,
  [Pkm.SWADLOON]: Swadloon,
  [Pkm.LEAVANNY]: Leavanny,
  [Pkm.PIKIPEK]: Pikipek,
  [Pkm.TRUMBEAK]: Trumbeak,
  [Pkm.TOUCANNON]: Toucannon,
  [Pkm.FLABEBE]: Flabebe,
  [Pkm.FLOETTE]: Floette,
  [Pkm.FLORGES]: Florges,
  [Pkm.JANGMO_O]: JangmoO,
  [Pkm.HAKAMO_O]: HakamoO,
  [Pkm.KOMMO_O]: KommoO,
  [Pkm.MELOETTA]: Meloetta,
  [Pkm.ALTARIA]: Altaria,
  [Pkm.MEGA_ALTARIA]: MegaAltaria,
  [Pkm.CASTFORM]: Castform,
  [Pkm.CASTFORM_SUN]: CastformSun,
  [Pkm.CASTFORM_RAIN]: CastformRain,
  [Pkm.CASTFORM_HAIL]: CastformHail,
  [Pkm.CORPHISH]: Corphish,
  [Pkm.CRAWDAUNT]: Crawdaunt,
  [Pkm.JOLTIK]: Joltik,
  [Pkm.GALVANTULA]: Galvantula,
  [Pkm.GENESECT]: Genesect,
  [Pkm.DIANCIE]: Diancie,
  [Pkm.HATENNA]: Hatenna,
  [Pkm.HATTREM]: Hattrem,
  [Pkm.HATTERENE]: Hatterene,
  [Pkm.FENNEKIN]: Fennekin,
  [Pkm.BRAIXEN]: Braixen,
  [Pkm.DELPHOX]: Delphox,
  [Pkm.MAKUHITA]: Makuhita,
  [Pkm.HARIYAMA]: Hariyama,
  [Pkm.REGIELEKI]: Regieleki,
  [Pkm.REGIDRAGO]: Regidrago,
  [Pkm.GUZZLORD]: Guzzlord,
  [Pkm.ETERNATUS]: Eternatus,
  [Pkm.PONYTA]: Ponyta,
  [Pkm.RAPIDASH]: Rapidash,
  [Pkm.NINCADA]: Nincada,
  [Pkm.NINJASK]: Ninjask,
  [Pkm.SHEDINJA]: Shedinja,
  [Pkm.NOIBAT]: Noibat,
  [Pkm.NOIVERN]: Noivern,
  [Pkm.PUMPKABOO]: Pumpkaboo,
  [Pkm.GOURGEIST]: Gourgeist,
  [Pkm.CACNEA]: Cacnea,
  [Pkm.CACTURNE]: Cacturne,
  [Pkm.RELICANTH]: Relicanth,
  [Pkm.TAUROS]: Tauros,
  [Pkm.HAPPINY]: Happiny,
  [Pkm.CHANSEY]: Chansey,
  [Pkm.BLISSEY]: Blissey,
  [Pkm.TAPU_KOKO]: TapuKoko,
  [Pkm.TAPU_LELE]: TapuLele,
  [Pkm.STAKATAKA]: Stakataka,
  [Pkm.BLACEPHALON]: Blacephalon,
  [Pkm.HOUNDOUR]: Houndour,
  [Pkm.HOUNDOOM]: Houndoom,
  [Pkm.MEGA_HOUNDOOM]: MegaHoundoom,
  [Pkm.CLAMPERL]: Clamperl,
  [Pkm.HUNTAIL]: Huntail,
  [Pkm.GOREBYSS]: Gorebyss,
  [Pkm.SMOOCHUM]: Smoochum,
  [Pkm.JYNX]: Jynx,
  [Pkm.SALANDIT]: Salandit,
  [Pkm.SALAZZLE]: Salazzle,
  [Pkm.VENONAT]: Venonat,
  [Pkm.VENOMOTH]: Venomoth,
  [Pkm.VOLTORB]: Voltorb,
  [Pkm.ELECTRODE]: Electrode,
  [Pkm.SLUGMA]: Slugma,
  [Pkm.MAGCARGO]: Magcargo,
  [Pkm.SNEASEL]: Sneasel,
  [Pkm.WEAVILE]: Weavile,
  [Pkm.CROAGUNK]: Croagunk,
  [Pkm.TOXICROAK]: Toxicroak,
  [Pkm.CHINCHOU]: Chinchou,
  [Pkm.LANTURN]: Lanturn,
  [Pkm.POOCHYENA]: Poochyena,
  [Pkm.MIGHTYENA]: Mightyena,
  [Pkm.BRONZOR]: Bronzor,
  [Pkm.BRONZONG]: Bronzong,
  [Pkm.DRIFLOON]: Drifloon,
  [Pkm.DRIFBLIM]: Drifblim,
  [Pkm.SHROOMISH]: Shroomish,
  [Pkm.BRELOOM]: Breloom,
  [Pkm.TENTACOOL]: Tentacool,
  [Pkm.TENTACRUEL]: Tentacruel,
  [Pkm.SNUBULL]: Snubull,
  [Pkm.GRANBULL]: Granbull,
  [Pkm.SEVIPER]: Seviper,
  [Pkm.VULPIX]: Vulpix,
  [Pkm.NINETALES]: Ninetales,
  [Pkm.ALOLAN_VULPIX]: AlolanVulpix,
  [Pkm.ALOLAN_NINETALES]: AlolanNinetales,
  [Pkm.MAWILE]: Mawile,
  [Pkm.BUIZEL]: Buizel,
  [Pkm.FLOATZEL]: Floatzel,
  [Pkm.KECLEON]: Kecleon,
  [Pkm.CARBINK]: Carbink,
  [Pkm.CHATOT]: Chatot,
  [Pkm.GOOMY]: Goomy,
  [Pkm.SLIGOO]: Sligoo,
  [Pkm.GOODRA]: Goodra,
  [Pkm.HISUI_SLIGGOO]: HisuiSliggoo,
  [Pkm.HISUI_GOODRA]: HisuiGoodra,
  [Pkm.MEW]: Mew,
  [Pkm.BOUNSWEET]: Bounsweet,
  [Pkm.STEENEE]: Steenee,
  [Pkm.TSAREENA]: Tsareena,
  [Pkm.VOLCANION]: Volcanion,
  [Pkm.APPLIN]: Applin,
  [Pkm.APPLETUN]: Appletun,
  [Pkm.OSHAWOTT]: Oshawott,
  [Pkm.DEWOTT]: Dewott,
  [Pkm.SAMUROTT]: Samurott,
  [Pkm.SNOM]: Snom,
  [Pkm.FROSMOTH]: Frosmoth,
  [Pkm.WAILMER]: Wailmer,
  [Pkm.WAILORD]: Wailord,
  [Pkm.DREEPY]: Dreepy,
  [Pkm.DRAKLOAK]: Drakloak,
  [Pkm.DRAGAPULT]: Dragapult,
  [Pkm.SNIVY]: Snivy,
  [Pkm.SERVINE]: Servine,
  [Pkm.SERPERIOR]: Serperior,
  [Pkm.POPPLIO]: Popplio,
  [Pkm.BRIONNE]: Brionne,
  [Pkm.PRIMARINA]: Primarina,
  [Pkm.GOTHITA]: Gothita,
  [Pkm.GOTHORITA]: Gothorita,
  [Pkm.GOTHITELLE]: Gothitelle,
  [Pkm.SCORBUNNY]: Scorbunny,
  [Pkm.RABOOT]: Raboot,
  [Pkm.CINDERACE]: Cinderace,
  [Pkm.SANDSHREW]: Sandshrew,
  [Pkm.SANDSLASH]: Sandslash,
  [Pkm.FARFETCH_D]: Farfetchd,
  [Pkm.UNOWN_A]: UnownA,
  [Pkm.UNOWN_B]: UnownB,
  [Pkm.UNOWN_C]: UnownC,
  [Pkm.UNOWN_D]: UnownD,
  [Pkm.UNOWN_E]: UnownE,
  [Pkm.UNOWN_F]: UnownF,
  [Pkm.UNOWN_G]: UnownG,
  [Pkm.UNOWN_H]: UnownH,
  [Pkm.UNOWN_I]: UnownI,
  [Pkm.UNOWN_J]: UnownJ,
  [Pkm.UNOWN_K]: UnownK,
  [Pkm.UNOWN_L]: UnownL,
  [Pkm.UNOWN_M]: UnownM,
  [Pkm.UNOWN_N]: UnownN,
  [Pkm.UNOWN_O]: UnownO,
  [Pkm.UNOWN_P]: UnownP,
  [Pkm.UNOWN_Q]: UnownQ,
  [Pkm.UNOWN_R]: UnownR,
  [Pkm.UNOWN_S]: UnownS,
  [Pkm.UNOWN_T]: UnownT,
  [Pkm.UNOWN_U]: UnownU,
  [Pkm.UNOWN_V]: UnownV,
  [Pkm.UNOWN_W]: UnownW,
  [Pkm.UNOWN_X]: UnownX,
  [Pkm.UNOWN_Y]: UnownY,
  [Pkm.UNOWN_Z]: UnownZ,
  [Pkm.UNOWN_QUESTION]: UnownQuestion,
  [Pkm.UNOWN_EXCLAMATION]: UnownExclamation,
  [Pkm.EGG]: Egg,
  [Pkm.TAPU_FINI]: TapuFini,
  [Pkm.TAPU_BULU]: TapuBulu,
  [Pkm.DIGLETT]: Diglett,
  [Pkm.ALOLAN_DIGLETT]: AlolanDiglett,
  [Pkm.DUGTRIO]: Dugtrio,
  [Pkm.ALOLAN_DUGTRIO]: AlolanDugtrio,
  [Pkm.ROWLET]: Rowlet,
  [Pkm.DARTIX]: Dartix,
  [Pkm.DECIDUEYE]: Decidueye,
  [Pkm.ZORUA]: Zorua,
  [Pkm.ZOROARK]: Zoroark,
  [Pkm.HISUI_ZORUA]: HisuiZorua,
  [Pkm.HISUI_ZOROARK]: HisuiZoroark,
  [Pkm.FROAKIE]: Froakie,
  [Pkm.FROGADIER]: Frogadier,
  [Pkm.GRENINJA]: Greninja,
  [Pkm.TYROGUE]: Tyrogue,
  [Pkm.HITMONLEE]: Hitmonlee,
  [Pkm.HITMONCHAN]: Hitmonchan,
  [Pkm.HITMONTOP]: Hitmontop,
  [Pkm.MIMIKYU]: Mimikyu,
  [Pkm.MIMIKYU_BUSTED]: MimikyuBusted,
  [Pkm.GRIMER]: Grimer,
  [Pkm.MUK]: Muk,
  [Pkm.ALOLAN_GRIMER]: AlolanGrimer,
  [Pkm.ALOLAN_MUK]: AlolanMuk,
  [Pkm.SHARPEDO]: Sharpedo,
  [Pkm.PINECO]: Pineco,
  [Pkm.FORRETRESS]: Forretress,
  [Pkm.SEEL]: Seel,
  [Pkm.DEWGONG]: Dewgong,
  [Pkm.ALOLAN_GEODUDE]: AlolanGeodude,
  [Pkm.ALOLAN_GRAVELER]: AlolanGraveler,
  [Pkm.ALOLAN_GOLEM]: AlolanGolem,
  [Pkm.EKANS]: Ekans,
  [Pkm.ARBOK]: Arbok,
  [Pkm.MIME_JR]: MimeJr,
  [Pkm.MR_MIME]: MrMime,
  [Pkm.ORIGIN_GIRATINA]: OriginGiratina,
  [Pkm.PIROUETTE_MELOETTA]: PirouetteMeloetta,
  [Pkm.MELMETAL]: Melmetal,
  [Pkm.HOOPA]: Hoopa,
  [Pkm.HOOPA_UNBOUND]: HoopaUnbound,
  [Pkm.ZERAORA]: Zeraora,
  [Pkm.XERNEAS]: Xerneas,
  [Pkm.YVELTAL]: Yveltal,
  [Pkm.MARSHADOW]: Marshadow,
  [Pkm.HOOTHOOT]: Hoothoot,
  [Pkm.NOCTOWL]: Noctowl,
  [Pkm.BONSLEY]: Bonsley,
  [Pkm.SUDOWOODO]: Sudowoodo,
  [Pkm.COMBEE]: Combee,
  [Pkm.VESPIQUEEN]: Vespiqueen,
  [Pkm.SHUCKLE]: Shuckle,
  [Pkm.TEPIG]: Tepig,
  [Pkm.PIGNITE]: Pignite,
  [Pkm.EMBOAR]: Emboar,
  [Pkm.WYNAUT]: Wynaut,
  [Pkm.WOBBUFFET]: Wobbuffet,
  [Pkm.LUNATONE]: Lunatone,
  [Pkm.SOLROCK]: Solrock,
  [Pkm.POLIWRATH]: Poliwrath,
  [Pkm.WURMPLE]: Wurmple,
  [Pkm.SILCOON]: Silcoon,
  [Pkm.BEAUTIFLY]: Beautifly,
  [Pkm.CASCOON]: Cascoon,
  [Pkm.DUSTOX]: Dustox,
  [Pkm.TINKATINK]: Tinkatink,
  [Pkm.TINKATUFF]: Tinkatuff,
  [Pkm.TINKATON]: Tinkaton,
  [Pkm.PARAS]: Paras,
  [Pkm.PARASECT]: Parasect,
  [Pkm.MILTANK]: Miltank,
  [Pkm.MANKEY]: Mankey,
  [Pkm.PRIMEAPE]: Primeape,
  [Pkm.SUNKERN]: Sunkern,
  [Pkm.SUNFLORA]: Sunflora,
  [Pkm.MARACTUS]: Maractus,
  [Pkm.PLUSLE]: Plusle,
  [Pkm.MINUN]: Minun,
  [Pkm.PINSIR]: Pinsir,
  [Pkm.NATU]: Natu,
  [Pkm.XATU]: Xatu,
  [Pkm.GLIGAR]: Gligar,
  [Pkm.GLISCOR]: Gliscor,
  [Pkm.SHELLDER]: Shellder,
  [Pkm.CLOYSTER]: Cloyster,
  [Pkm.SENTRET]: Sentret,
  [Pkm.FURRET]: Furret,
  [Pkm.SPECTRIER]: Spectrier,
  [Pkm.TORKOAL]: Torkoal,
  [Pkm.DELIBIRD]: Delibird,
  [Pkm.IRON_BUNDLE]: IronBundle,
  [Pkm.KARTANA]: Kartana,
  [Pkm.CHINGLING]: Chingling,
  [Pkm.CHIMECHO]: Chimecho,
  [Pkm.ALOLAN_RAICHU]: AlolanRaichu,
  [Pkm.DHELMISE]: Dhelmise,
  [Pkm.KOFFING]: Koffing,
  [Pkm.WEEZING]: Weezing,
  [Pkm.STARYU]: Staryu,
  [Pkm.STARMIE]: Starmie,
  [Pkm.NOSEPASS]: Nosepass,
  [Pkm.PROBOPASS]: Probopass,
  [Pkm.WOOBAT]: Woobat,
  [Pkm.SWOOBAT]: Swoobat,
  [Pkm.CLAUNCHER]: Clauncher,
  [Pkm.CLAWITZER]: Clawitzer,
  [Pkm.YANMA]: Yanma,
  [Pkm.YANMEGA]: Yanmega,
  [Pkm.HELIOPTILE]: Helioptile,
  [Pkm.HELIOLISK]: Heliolisk,
  [Pkm.BIDOOF]: Bidoof,
  [Pkm.BIBAREL]: Bibarel,
  [Pkm.SPINDA]: Spinda,
  [Pkm.BALTOY]: Baltoy,
  [Pkm.CLAYDOL]: Claydol,
  [Pkm.HERACROSS]: Heracross,
  [Pkm.PURRLOIN]: Purrloin,
  [Pkm.LIEPARD]: Liepard,
  [Pkm.BARBOACH]: Barboach,
  [Pkm.WHISCASH]: Whiscash,
  [Pkm.SCRAGGY]: Scraggy,
  [Pkm.SCRAFTY]: Scrafty,
  [Pkm.FINNEON]: Finneon,
  [Pkm.LUMINEON]: Lumineon,
  [Pkm.STUNKY]: Stunky,
  [Pkm.SKUNTANK]: Skuntank,
  [Pkm.ILLUMISE]: Illumise,
  [Pkm.VOLBEAT]: Volbeat,
  [Pkm.NECROZMA]: Necrozma,
  [Pkm.ULTRA_NECROZMA]: UltraNecrozma,
  [Pkm.CHERRUBI]: Cherrubi,
  [Pkm.CHERRIM]: Cherrim,
  [Pkm.CHERRIM_SUNLIGHT]: CherrimSunlight,
  [Pkm.MISDREAVUS]: Misdreavus,
  [Pkm.MISMAGIUS]: Mismagius,
  [Pkm.DODUO]: Doduo,
  [Pkm.DODRIO]: Dodrio,
  [Pkm.XURKITREE]: Xurkitree,
  [Pkm.TANDEMAUS]: Tandemaus,
  [Pkm.MAUSHOLD_THREE]: MausholdThree,
  [Pkm.MAUSHOLD_FOUR]: MausholdFour,
  [Pkm.KRICKETOT]: Kricketot,
  [Pkm.KRICKETUNE]: Kricketune,
  [Pkm.HIPPOPOTAS]: Hippopotas,
  [Pkm.HIPPODOWN]: Hippodown,
  [Pkm.WINGULL]: Wingull,
  [Pkm.PELIPPER]: Pelipper,
  [Pkm.NIHILEGO]: Nihilego,
  [Pkm.SOBBLE]: Sobble,
  [Pkm.DRIZZILE]: Drizzile,
  [Pkm.INTELEON]: Inteleon,
  [Pkm.TROPIUS]: Tropius,
  [Pkm.EXEGGCUTE]: Exeggcute,
  [Pkm.EXEGGUTOR]: Exeggutor,
  [Pkm.ALOLAN_EXEGGUTOR]: AlolanExeggutor,
  [Pkm.COMFEY]: Comfey,
  [Pkm.CARNIVINE]: Carnivine,
  [Pkm.HISUIAN_QWILFISH]: HisuianQwilfish,
  [Pkm.OVERQWIL]: Overqwil,
  [Pkm.HISUIAN_TYPHLOSION]: HisuianTyphlosion,
  [Pkm.LILLIPUP]: Lillipup,
  [Pkm.HERDIER]: Herdier,
  [Pkm.STOUTLAND]: Stoutland,
  [Pkm.ZIGZAGOON]: Zigzagoon,
  [Pkm.LINOONE]: Linoone,
  [Pkm.PHEROMOSA]: Pheromosa,
  [Pkm.SABLEYE]: Sableye,
  [Pkm.DRACOVISH]: Dracovish,
  [Pkm.CORSOLA]: Corsola,
  [Pkm.GALAR_CORSOLA]: GalarCorsola,
  [Pkm.CURSOLA]: Cursola,
  [Pkm.GIMMIGHOUL]: Gimmighoul,
  [Pkm.GHOLDENGO]: Gholdengo,
  [Pkm.PHANTUMP]: Phantump,
  [Pkm.TREVENANT]: Trevenant,
  [Pkm.SMEARGLE]: Smeargle,
  [Pkm.TOXEL]: Toxel,
  [Pkm.TOXTRICITY]: Toxtricity,
  [Pkm.BRUXISH]: Bruxish,
  [Pkm.SUBSTITUTE]: Substitute,
  [Pkm.CYCLIZAR]: Cyclizar,
  [Pkm.PAWNIARD]: Pawniard,
  [Pkm.BISHARP]: Bisharp,
  [Pkm.KINGAMBIT]: Kingambit,
  [Pkm.MINIOR]: Minior,
  [Pkm.MINIOR_KERNEL_RED]: MiniorKernelRed,
  [Pkm.MINIOR_KERNEL_BLUE]: MiniorKernelBlue,
  [Pkm.MINIOR_KERNEL_ORANGE]: MiniorKernelOrange,
  [Pkm.MINIOR_KERNEL_GREEN]: MiniorKernelGreen,
  [Pkm.FEEBAS]: Feebas,
  [Pkm.MILOTIC]: Milotic,
  [Pkm.MORPEKO]: Morpeko,
  [Pkm.MORPEKO_HANGRY]: MorpekoHangry,
  [Pkm.KANGASKHAN]: Kangaskhan,
  [Pkm.TEDDIURSA]: Teddiursa,
  [Pkm.URSARING]: Ursaring,
  [Pkm.URSALUNA]: Ursaluna,
  [Pkm.URSALUNA_BLOODMOON]: UrsalunaBloodmoon,
  [Pkm.AIPOM]: Aipom,
  [Pkm.AMBIPOM]: Ambipom,
  [Pkm.DEERLING]: Deerling,
  [Pkm.SAWSBUCK]: Sawsbuck,
  [Pkm.LICKITUNG]: Lickitung,
  [Pkm.LICKILICKY]: Lickilicky,
  [Pkm.PATRAT]: Patrat,
  [Pkm.WATCHOG]: Watchog,
  [Pkm.SPINARAK]: Spinarak,
  [Pkm.ARIADOS]: Ariados,
  [Pkm.TYPE_NULL]: TypeNull,
  [Pkm.SILVALLY_FIRE]: SilvallyFire,
  [Pkm.SILVALLY_FOSSIL]: SilvallyFossil,
  [Pkm.SILVALLY_PSYCHIC]: SilvallyPsychic,
  [Pkm.SILVALLY_WATER]: SilvallyWater,
  [Pkm.SILVALLY_ELECTRIC]: SilvallyElectric,
  [Pkm.SILVALLY_FAIRY]: SilvallyFairy,
  [Pkm.SILVALLY_DARK]: SilvallyDark,
  [Pkm.SILVALLY_GRASS]: SilvallyGrass,
  [Pkm.SILVALLY_ICE]: SilvallyIce,
  [Pkm.SILVALLY_FIGHTING]: SilvallyFighting,
  [Pkm.SILVALLY_LIGHT]: SilvallyLight,
  [Pkm.SILVALLY_POISON]: SilvallyPoison,
  [Pkm.SILVALLY_SOUND]: SilvallySound,
  [Pkm.SILVALLY_STEEL]: SilvallySteel,
  [Pkm.SILVALLY_FLYING]: SilvallyFlying,
  [Pkm.SILVALLY_ROCK]: SilvallyRock,
  [Pkm.SILVALLY_GROUND]: SilvallyGround,
  [Pkm.SILVALLY_FLORA]: SilvallyFlora,
  [Pkm.DEWPIDER]: Dewpider,
  [Pkm.ARAQUANID]: Araquanid,
  [Pkm.ROCKRUFF]: Rockruff,
  [Pkm.LYCANROC_DAY]: LycanrocDay,
  [Pkm.LYCANROC_DUSK]: LycanrocDusk,
  [Pkm.LYCANROC_NIGHT]: LycanrocNight,
  [Pkm.DRUDDIGON]: Druddigon,
  [Pkm.COSMOG]: Cosmog,
  [Pkm.COSMOEM]: Cosmoem,
  [Pkm.SOLGALEO]: Solgaleo,
  [Pkm.LUNALA]: Lunala,
  [Pkm.MAGEARNA]: Magearna,
  [Pkm.IMPIDIMP]: Impidimp,
  [Pkm.MORGREM]: Morgrem,
  [Pkm.GRIMMSNARL]: Grimmsnarl,
  [Pkm.DEOXYS]: Deoxys,
  [Pkm.DEOXYS_DEFENSE]: DeoxysDefense,
  [Pkm.DEOXYS_ATTACK]: DeoxysAttack,
  [Pkm.DEOXYS_SPEED]: DeoxysSpeed,
  [Pkm.CRABRAWLER]: Crabrawler,
  [Pkm.CRABOMINABLE]: Crabominable,
  [Pkm.CUTIEFLY]: Cutiefly,
  [Pkm.RIBOMBEE]: Ribombee,
  [Pkm.ZANGOOSE]: Zangoose,
  [Pkm.NICKIT]: Nickit,
  [Pkm.THIEVUL]: Thievul,
  [Pkm.DROWZEE]: Drowzee,
  [Pkm.HYPNO]: Hypno,
  [Pkm.WATTREL]: Wattrel,
  [Pkm.KILOWATTREL]: Kilowattrel,
  [Pkm.STANTLER]: Stantler,
  [Pkm.BURMY_PLANT]: BurmyPlant,
  [Pkm.BURMY_SANDY]: BurmySandy,
  [Pkm.BURMY_TRASH]: BurmyTrash,
  [Pkm.WORMADAM_PLANT]: WormadamPlant,
  [Pkm.WORMADAM_SANDY]: WormadamSandy,
  [Pkm.WORMADAM_TRASH]: WormadamTrash,
  [Pkm.MOTHIM]: Mothim,
  [Pkm.PALDEA_WOOPER]: PaldeaWooper,
  [Pkm.CLODSIRE]: Clodsire,
  [Pkm.FUECOCO]: Fuecoco,
  [Pkm.CROCALOR]: Crocalor,
  [Pkm.SKELEDIRGE]: Skeledirge,
  [Pkm.TANGELA]: Tangela,
  [Pkm.TANGROWTH]: Tangrowth,
  [Pkm.PSYDUCK]: Psyduck,
  [Pkm.GOLDUCK]: Golduck,
  [Pkm.PHANPY]: Phanpy,
  [Pkm.DONPHAN]: Donphan,
  [Pkm.SPOINK]: Spoink,
  [Pkm.GRUMPIG]: Grumpig,
  [Pkm.SINISTEA]: Sinistea,
  [Pkm.POLTEAGEIST]: Polteageist,
  [Pkm.FERROSEED]: Ferroseed,
  [Pkm.FERROTHORN]: Ferrothorn,
  [Pkm.GOLETT]: Golett,
  [Pkm.GOLURK]: Golurk,
  [Pkm.TRUBBISH]: Trubbish,
  [Pkm.GARBODOR]: Garbodor,
  [Pkm.GRUBBIN]: Grubbin,
  [Pkm.CHARJABUG]: Charjabug,
  [Pkm.VIKAVOLT]: Vikavolt,
  [Pkm.SHELLOS_WEST_SEA]: ShellosWestSea,
  [Pkm.GASTRODON_WEST_SEA]: GastrodonWestSea,
  [Pkm.SHELLOS_EAST_SEA]: ShellosEastSea,
  [Pkm.GASTRODON_EAST_SEA]: GastrodonEastSea,
  [Pkm.MUNNA]: Munna,
  [Pkm.MUSHARNA]: Musharna
}
