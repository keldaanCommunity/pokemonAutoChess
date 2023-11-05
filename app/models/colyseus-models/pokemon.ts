/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { Schema, type, SetSchema } from "@colyseus/schema"
import { nanoid } from "nanoid"
import { Emotion, IPokemon, AttackSprite, Title } from "../../types"
import {
  DEFAULT_ATK_SPEED,
  EvolutionTime,
  ItemRecipe,
  MausholdEvolutionTurn,
  TandemausEvolutionTurn
} from "../../types/Config"
import { AllItems, Item, SynergyStones } from "../../types/enum/Item"
import { Pkm, PkmIndex, Unowns } from "../../types/enum/Pokemon"
import { Rarity, AttackType, PokemonActionState } from "../../types/enum/Game"
import { Ability } from "../../types/enum/Ability"
import { Synergy } from "../../types/enum/Synergy"
import { Passive } from "../../types/enum/Passive"
import Player from "./player"
import { values } from "../../utils/schemas"
import { Weather } from "../../types/enum/Weather"
import { coinflip } from "../../utils/random"
import {
  CountEvolutionRule,
  EvolutionRule,
  HatchEvolutionRule,
  ItemEvolutionRule,
  TurnEvolutionRule
} from "../../core/evolution-rules"
import PokemonFactory from "../pokemon-factory"

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
  final = false
  additional = false

  constructor(shiny: boolean, emotion: Emotion) {
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

  get canBePlaced(): boolean {
    return ![Pkm.DITTO, Pkm.EGG].includes(this.name)
  }

  get canBeCloned(): boolean {
    return (
      this.rarity !== Rarity.UNIQUE &&
      this.rarity !== Rarity.LEGENDARY &&
      this.rarity !== Rarity.MYTHICAL &&
      this.rarity !== Rarity.HATCH &&
      ![Pkm.DITTO, Pkm.EGG].includes(this.name)
    )
  }

  get canHoldItems(): boolean {
    return ![Pkm.DITTO, Pkm.EGG, ...Unowns].includes(this.name)
  }

  get isOnBench(): boolean {
    return this.positionY === 0
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChangePosition(
    x: number,
    y: number,
    player: Player,
    lightX: number,
    lightY: number
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAcquired(player: Player) {}
}

export class Ditto extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 30
  atk = 1
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  passive = Passive.DITTO
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
  final = true
  attackSprite = AttackSprite.NORMAL_MELEE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EGG_HATCH)
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
  final = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Shuppet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.BANETTE
  hp = 120
  atk = 7
  def = 3
  speDef = 4
  maxPP = 125
  range = 1
  skill = Ability.SHADOW_CLONE
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Banette extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_BANETTE
  hp = 200
  atk = 15
  def = 4
  speDef = 5
  maxPP = 125
  range = 1
  skill = Ability.SHADOW_CLONE
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class MegaBanette extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.SHADOW_CLONE
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Riolu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIGHTING,
    Synergy.STEEL,
    Synergy.BABY
  ])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.LUCARIO
  hp = 120
  atk = 10
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.SILENCE
  attackSprite = AttackSprite.FIGHTING_RANGE
}

export class Lucario extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_LUCARIO
  hp = 240
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.SILENCE
  attackSprite = AttackSprite.FIGHTING_RANGE
}

export class MegaLucario extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 360
  atk = 42
  def = 7
  speDef = 7
  maxPP = 100
  range = 2
  skill = Ability.SILENCE
  final = true
  attackSprite = AttackSprite.FIGHTING_RANGE
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
  hp = 200
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
  final = true
  attackSprite = AttackSprite.DRAGON_RANGE
}

export class Scyther extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.SCIZOR
  hp = 130
  atk = 18
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.X_SCISSOR
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Scizor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_SCIZOR
  hp = 180
  atk = 28
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.X_SCISSOR
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class MegaScizor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 250
  atk = 48
  def = 7
  speDef = 7
  maxPP = 80
  range = 1
  skill = Ability.X_SCISSOR
  final = true
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
  final = true
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
  final = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Onix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.STEELIX
  hp = 150
  atk = 9
  def = 10
  speDef = 5
  maxPP = 70
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
  maxPP = 70
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
  maxPP = 70
  range = 1
  skill = Ability.SPIKE_ARMOR
  final = true
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
  final = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Meditite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.FIGHTING
  ])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.MEDICHAM
  hp = 120
  atk = 10
  def = 5
  speDef = 5
  maxPP = 60
  range = 2
  skill = Ability.CONFUSION
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Medicham extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.FIGHTING
  ])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.MEGA_MEDICHAM
  hp = 200
  atk = 20
  def = 6
  speDef = 6
  maxPP = 60
  range = 2
  skill = Ability.CONFUSION
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class MegaMedicham extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.FIGHTING
  ])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 35
  def = 7
  speDef = 7
  maxPP = 60
  range = 2
  skill = Ability.CONFUSION
  final = true
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
  final = true
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
  final = true
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
  attackSprite = AttackSprite.DRAGON_MELEE
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
  attackSprite = AttackSprite.DRAGON_MELEE
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
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Tympole extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.PALPITOAD
  hp = 90
  atk = 5
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.WATER_MELEE
}

export class Palpitoad extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.SEISMITOAD
  hp = 130
  atk = 9
  def = 5
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.WATER_MELEE
}

export class Seismitoad extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 3
  hp = 230
  atk = 20
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.DEFAULT
  final = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Bagon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.MONSTER])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SHELGON
  hp = 90
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
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.SALAMENCE
  hp = 150
  atk = 15
  def = 3
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
  rarity = Rarity.RARE
  stars = 3
  hp = 240
  atk = 24
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_DARTS
  final = true
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
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
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
  final = true
  attackSprite = AttackSprite.NORMAL_MELEE
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
  final = true
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
  skill = Ability.CRABHAMMER
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
  skill = Ability.CRABHAMMER
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
  skill = Ability.CRABHAMMER
  final = true
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
  attackSprite = AttackSprite.ROCK_MELEE
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
  attackSprite = AttackSprite.ROCK_MELEE
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
  final = true
  attackSprite = AttackSprite.ROCK_MELEE
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
  maxPP = 110
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  attackSprite = AttackSprite.DRAGON_MELEE
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
  maxPP = 110
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  attackSprite = AttackSprite.DRAGON_MELEE
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
  maxPP = 110
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Gastly extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.MONSTER,
    Synergy.POISON,
    Synergy.GHOST
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
    Synergy.MONSTER,
    Synergy.POISON,
    Synergy.GHOST
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
    Synergy.MONSTER,
    Synergy.POISON,
    Synergy.GHOST
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
  final = true
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
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Litwick extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.LAMPENT
  hp = 50
  atk = 5
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
  final = true
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
  hp = 120
  atk = 6
  def = 1
  speDef = 1
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
  hp = 200
  atk = 22
  evolutionRule = new ItemEvolutionRule([Item.UPGRADE])
  def = 1
  speDef = 3
  maxPP = 90
  range = 2
  skill = Ability.TRI_ATTACK
  passive = Passive.PORYGON
  final = true
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
  stars = 3
  hp = 200
  atk = 33
  def = 1
  speDef = 5
  maxPP = 90
  range = 2
  skill = Ability.TRI_ATTACK
  final = true
  additional = true
  attackSprite = AttackSprite.FIGHTING_RANGE
}

export class Sewaddle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SWADLOON
  hp = 80
  atk = 5
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Swadloon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.LEAVANNY
  hp = 120
  atk = 9
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Leavanny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 3
  hp = 220
  atk = 20
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.DEFAULT
  final = true
  attackSprite = AttackSprite.GRASS_MELEE
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
  final = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Deino extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.DRAGON])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.ZWEILOUS
  hp = 80
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Zweilous extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.DRAGON])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.HYDREIGON
  hp = 120
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Hydreigon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.DRAGON])
  rarity = Rarity.RARE
  stars = 3
  hp = 220
  atk = 18
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.DEFAULT
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
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
  passive = Passive.TADPOLE
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

  getEvolution(player: Player) {
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
}

export class Politoed extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIGHTING
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
  passive = Passive.TADPOLE
  final = true
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
  passive = Passive.TADPOLE
  final = true
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
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Solosis extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.DUOSION
  hp = 100
  atk = 5
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.SHADOW_BALL
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Duosion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.REUNICLUS
  hp = 200
  atk = 9
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.SHADOW_BALL
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Reuniclus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 18
  def = 1
  speDef = 1
  maxPP = 90
  range = 2
  skill = Ability.SHADOW_BALL
  final = true
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
  skill = Ability.DISCHARGE
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
  skill = Ability.DISCHARGE
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
  skill = Ability.DISCHARGE
  final = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Cubone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.MAROWAK
  hp = 110
  atk = 10
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.BONEMERANG
  passive = Passive.CUBONE
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Marowak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.ALOLAN_MAROWAK
  evolutionRule = new ItemEvolutionRule([Item.FIRE_STONE])
  hp = 250
  atk = 20
  def = 6
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.BONEMERANG
  passive = Passive.CUBONE
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Axew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.MONSTER])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.FRAXURE
  hp = 80
  atk = 5
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Fraxure extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.MONSTER])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.HAXORUS
  hp = 120
  atk = 9
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Haxorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.MONSTER])
  rarity = Rarity.RARE
  stars = 3
  hp = 220
  atk = 20
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  final = true
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
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Goomy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SLIGOO
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
    Synergy.MONSTER
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
    Synergy.MONSTER
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
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
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
  hp = 80
  atk = 6
  def = 2
  speDef = 2
  maxPP = 120
  range = 3
  skill = Ability.TORMENT
  attackSprite = AttackSprite.GRASS_RANGE
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
  hp = 150
  atk = 12
  def = 3
  speDef = 3
  maxPP = 120
  range = 3
  skill = Ability.TORMENT
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Ludicolo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 260
  atk = 22
  def = 4
  speDef = 4
  maxPP = 120
  range = 3
  skill = Ability.TORMENT
  final = true
  attackSprite = AttackSprite.GRASS_RANGE
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
  final = true
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
  final = true
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
  skill = Ability.STOMP
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Lairon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.AGGRON
  hp = 100
  atk = 8
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.STOMP
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Aggron extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 170
  atk = 16
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.STOMP
  final = true
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
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Swinub extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.PILOSWINE
  hp = 60
  atk = 4
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
  attackSprite = AttackSprite.ICE_MELEE
}

export class Piloswine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.MAMOSWINE
  hp = 110
  atk = 8
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
  attackSprite = AttackSprite.ICE_MELEE
}

export class Mamoswine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 3
  hp = 180
  atk = 14
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
  final = true
  attackSprite = AttackSprite.ICE_MELEE
}

export class Snover extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ICE])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.ABOMASNOW
  hp = 130
  atk = 12
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.BLIZZARD
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
  maxPP = 100
  range = 1
  skill = Ability.BLIZZARD
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
  maxPP = 100
  range = 1
  skill = Ability.BLIZZARD
  final = true
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
  final = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Vanillite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.ICE,
    Synergy.ARTIFICIAL
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
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class Vanillish extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.ICE,
    Synergy.ARTIFICIAL
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
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class Vanilluxe extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.ICE,
    Synergy.ARTIFICIAL
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
  final = true
  attackSprite = AttackSprite.FAIRY_RANGE
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
  hp = 220
  atk = 26
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_TAIL
  final = true
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
  evolution = Pkm.ALOLAN_RAICHU
  evolutionRule = new ItemEvolutionRule([Item.DAWN_STONE])
  hp = 220
  atk = 18
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.NUZZLE
  passive = Passive.RAICHU
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
  final = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
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
  final = true
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
  attackSprite = AttackSprite.FAIRY_RANGE
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
  attackSprite = AttackSprite.FAIRY_RANGE
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
  final = true
  attackSprite = AttackSprite.FAIRY_RANGE
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
  skill = Ability.NIGHT_SLASH
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
  skill = Ability.NIGHT_SLASH
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
  skill = Ability.NIGHT_SLASH
  final = true
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
  skill = Ability.TORMENT
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
  skill = Ability.TORMENT
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
  skill = Ability.TORMENT
  final = true
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
  final = true
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
  skill = Ability.DISARMING_VOICE
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  skill = Ability.DISARMING_VOICE
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  skill = Ability.DISARMING_VOICE
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
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
  final = true
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
  final = true
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
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
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
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
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
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
  final = true
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
  final = true
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
  final = true
  attackSprite = AttackSprite.POISON_MELEE
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
  final = true
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
  def = 3
  speDef = 3
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
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  final = true
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
  final = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Mudkip extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.MARSHTOMP
  hp = 65
  atk = 4
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
  atk = 8
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
  atk = 18
  def = 5
  speDef = 5
  maxPP = 50
  range = 1
  skill = Ability.MUD_BUBBLE
  passive = Passive.WATER_SPRING
  final = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Torchic extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.COMBUSKEN
  hp = 60
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Combusken extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.BLAZIKEN
  hp = 120
  atk = 9
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Blaziken extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
  final = true
  attackSprite = AttackSprite.FIRE_MELEE
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
  skill = Ability.THIEF
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
  skill = Ability.THIEF
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
  skill = Ability.THIEF
  final = true
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
  maxPP = 80
  range = 2
  skill = Ability.WHEEL_OF_FIRE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Quilava extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.TYPHLOSION
  hp = 130
  atk = 13
  def = 2
  speDef = 2
  maxPP = 80
  range = 2
  skill = Ability.WHEEL_OF_FIRE
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Typhlosion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 25
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.WHEEL_OF_FIRE
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Slowpoke extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SLOWBRO
  hp = 75
  atk = 6
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.SOAK
  passive = Passive.SLOWBRO
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Slowbro extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.SLOWKING
  evolutionRule = new ItemEvolutionRule([Item.KINGS_ROCK])
  hp = 180
  atk = 13
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.SOAK
  passive = Passive.SLOWBRO
  final = true
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Slowking extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 260
  atk = 24
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SOAK
  final = true
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
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
  final = true
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
  evolutionRule = new ItemEvolutionRule([Item.LEAF_STONE])
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
  final = true
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
  final = true
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
  final = true
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
  final = true
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
  def = 1
  speDef = 1
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
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.PLAY_ROUGH
  final = true
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
  final = true
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
  final = true
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
  evolutionRule = new ItemEvolutionRule([Item.MOON_STONE])
  hp = 150
  atk = 11
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.METRONOME
  passive = Passive.CLEFAIRY
  final = true
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
  final = true
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
  attackSprite = AttackSprite.POISON_RANGE
}

export class Metapod extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.BUTTERFREE
  hp = 110
  atk = 9
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.STRING_SHOT
  attackSprite = AttackSprite.POISON_RANGE
}

export class Butterfree extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 16
  def = 1
  speDef = 1
  maxPP = 100
  range = 2
  skill = Ability.STRING_SHOT
  final = true
  attackSprite = AttackSprite.POISON_RANGE
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
  final = true
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
  final = true
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
  final = true
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Seedot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.NUZLEAF
  hp = 60
  atk = 5
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
  atk = 9
  def = 2
  speDef = 2
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
  atk = 20
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.PAYBACK
  final = true
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
  final = true
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
  onAcquired(player: Player) {
    player.titles.add(Title.FISHERMAN)
  }
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
  final = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Rattata extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.RATICATE
  hp = 30
  atk = 3
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.AGILITY
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Raticate extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL])
  rarity = Rarity.SPECIAL
  stars = 2
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.AGILITY
  final = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Spearow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.FEAROW
  hp = 30
  atk = 3
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.PECK
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Fearow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.SPECIAL
  stars = 2
  hp = 60
  atk = 5
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.PECK
  final = true
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
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Hoopa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.DEFAULT
  final = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class HoopaUnbound extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.DEFAULT
  final = true
  attackSprite = AttackSprite.GHOST_RANGE
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
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE

  onChangePosition(
    x: number,
    y: number,
    player: Player,
    lightX: number,
    lightY: number
  ) {
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
  final = true
  attackSprite = AttackSprite.GHOST_RANGE

  onChangePosition(
    x: number,
    y: number,
    player: Player,
    lightX: number,
    lightY: number
  ) {
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
  final = true
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
  final = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
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
  final = true
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
  final = true
  attackSprite = AttackSprite.FLYING_MELEE
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
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Pinsir extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 25
  def = 3
  speDef = 3
  maxPP = 85
  range = 1
  skill = Ability.GUILLOTINE
  final = true
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
  final = true
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
  final = true
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
  skill = Ability.ROAR_OF_TIME
  final = true
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
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Suicune extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE, Synergy.FIELD])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.AQUA_JET
  final = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Raikou extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 130
  range = 1
  skill = Ability.VOLT_SWITCH
  final = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Entei extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
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
  final = true
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
  final = true
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
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
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
  final = true
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
  final = true
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
  final = true
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
  final = true
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
  skill = Ability.IRON_TAIL
  final = true
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
  maxPP = 100
  range = 3
  skill = Ability.ORIGIN_PULSE
  passive = Passive.PRIMAL
  final = true
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
  final = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Rayquaza extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.MEGA_RAYQUAZA
  evolutionRule = new ItemEvolutionRule([Item.DELTA_ORB])
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.DRACO_METEOR
  passive = Passive.PRIMAL
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Eevee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  hp = 90
  atk = 5
  def = 2
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
    (pokemon: Pokemon, player: Player, item?: Item) => {
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
    Synergy.FIELD,
    Synergy.AQUATIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
  final = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Jolteon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
  final = true
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
  maxPP = 80
  range = 1
  skill = Ability.HAPPY_HOUR
  final = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Espeon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 1
  speDef = 1
  maxPP = 80
  range = 2
  skill = Ability.HAPPY_HOUR
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
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
  final = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Sylveon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FIELD, Synergy.SOUND])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 1
  speDef = 1
  maxPP = 80
  range = 2
  skill = Ability.HAPPY_HOUR
  final = true
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class Glaceon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  def = 1
  speDef = 1
  maxPP = 80
  range = 2
  skill = Ability.HAPPY_HOUR
  final = true
  attackSprite = AttackSprite.ICE_RANGE
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
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Darkrai extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 2
  speDef = 2
  maxPP = 120
  range = 2
  skill = Ability.DARK_VOID
  final = true
  attackSprite = AttackSprite.GHOST_RANGE
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
  final = true
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
  maxPP = 100
  range = 3
  skill = Ability.CHATTER
  final = true
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
  final = true
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

export class Castform extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.ARTIFICIAL])
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
}

export class CastformSun extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.ARTIFICIAL,
    Synergy.FIRE
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
  final = true
  attackSprite = AttackSprite.DRAGON_RANGE
}

export class CastformRain extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.ARTIFICIAL,
    Synergy.WATER
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
  final = true
  attackSprite = AttackSprite.WATER_RANGE
}

export class CastformHail extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.ARTIFICIAL,
    Synergy.ICE
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
  final = true
  attackSprite = AttackSprite.ICE_RANGE
}

export class Landorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.DEFAULT //Ability.ROCK_SLIDE
  passive = Passive.NONE //Passive.SANDSTORM
  final = true
  attackSprite = AttackSprite.FLYING_RANGE
}

export class Thundurus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.DEFAULT //Ability.THUNDER
  passive = Passive.NONE //Passive.STORM
  final = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Tornadus extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLYING,
    Synergy.HUMAN,
    Synergy.MONSTER
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 2
  speDef = 2
  maxPP = 70
  range = 3
  skill = Ability.TRI_ATTACK
  passive = Passive.WINDY
  final = true
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
  final = true
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
  final = true
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
  maxPP = 150
  range = 1
  skill = Ability.SACRED_SWORD
  final = true
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
  final = true
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
  skill = Ability.IRON_TAIL
  final = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Phione extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.BUG, Synergy.AQUATIC])
  rarity = Rarity.UNIQUE
  stars = 3
  evolution = Pkm.MANAPHY
  evolutionRule = new ItemEvolutionRule([Item.AQUA_EGG])
  hp = 160
  atk = 14
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.NASTY_PLOT
  passive = Passive.PHIONE
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Manaphy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.BUG, Synergy.AQUATIC])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 240
  atk = 16
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.NASTY_PLOT
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Rotom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.CALM_MIND
  final = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Spiritomb extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 2
  speDef = 2
  maxPP = 80
  range = 2
  skill = Ability.NIGHT_SLASH
  final = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Absol extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.THIEF
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
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
  final = true
  attackSprite = AttackSprite.ICE_MELEE
}

export class IronBundle extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.FLYING,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.AURORA_BEAM
  final = true
  attackSprite = AttackSprite.ICE_MELEE
}

export class Lapras extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 12
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DIVE
  final = true
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
  final = true
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
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Uxie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.KNOWLEDGE_THIEF
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Mesprit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 3
  speDef = 3
  maxPP = 90
  range = 3
  skill = Ability.SONG_OF_DESIRE
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Azelf extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 3
  speDef = 3
  maxPP = 90
  range = 3
  skill = Ability.CONFUSING_MIND
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Mew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FIELD])
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
  final = true
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
  skill = Ability.DYNAMAX_CANNON
  final = true
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
  final = true
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
  final = true
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
  final = true
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
  final = true
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
  skill = Ability.AURORA_VEIL
  final = true
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
  final = true
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
  maxPP = 60
  range = 3
  skill = Ability.WISH
  final = true
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
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Deoxys extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.PROTECT
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
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
  final = true
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
  passive = Passive.MISTY
  final = true
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
  range = 3
  skill = Ability.MAGMA_STORM
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class HooH extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FLYING, Synergy.LIGHT])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.FIRE_SPIN
  passive = Passive.SUN
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Torkoal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.GROUND])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 240
  atk = 10
  def = 10
  speDef = 2
  maxPP = 105
  range = 1
  skill = Ability.SMOKE_SCREEN
  passive = Passive.SUN
  final = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class PrimalGroudon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.FIRE])
  rarity = Rarity.MYTHICAL
  stars = 4
  hp = 400
  atk = 30
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.EARTHQUAKE
  passive = Passive.SANDSTORM
  final = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class PrimalKyogre extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.ELECTRIC,
    Synergy.MONSTER
  ])
  rarity = Rarity.MYTHICAL
  stars = 4
  hp = 400
  atk = 20
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.ORIGIN_PULSE
  passive = Passive.RAIN
  final = true
  attackSprite = AttackSprite.WATER_RANGE
}

export class MegaRayquaza extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FLYING])
  rarity = Rarity.MYTHICAL
  stars = 4
  hp = 400
  atk = 30
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.DRACO_METEOR
  passive = Passive.AIRLOCK
  final = true
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
  maxPP = 100
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
  maxPP = 100
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
  atk = 20
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.STUN_SPORE
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Bellossom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 4
  hp = 360
  atk = 27
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.STUN_SPORE
  final = true
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
  skill = Ability.ICICLE_CRASH
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
  skill = Ability.ICICLE_CRASH
  final = true
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
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Mankey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.FIELD])
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
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Primeape extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 2
  hp = 240
  atk = 21
  def = 6
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.THRASH
  final = true
  additional = true
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
  maxPP = 100
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
  maxPP = 100
  range = 1
  skill = Ability.ROCK_SMASH
  final = true
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Wynaut extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.BABY])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WOBBUFFET
  hp = 110
  atk = 7
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.COUNTER
  passive = Passive.WOBBUFFET
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Wobbuffet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 2
  hp = 280
  atk = 18
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.COUNTER
  passive = Passive.WOBBUFFET
  final = true
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
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
  final = true
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
  hp = 160
  atk = 16
  def = 3
  speDef = 3
  maxPP = 90
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
  hp = 200
  atk = 20
  def = 4
  speDef = 4
  maxPP = 90
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
  final = true
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
  final = true
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
  final = true
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
  final = true
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
  maxPP = 90
  range = 1
  skill = Ability.HEAL_BLOCK
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
  maxPP = 90
  range = 1
  skill = Ability.HEAL_BLOCK
  final = true
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Omanyte extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
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
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  def = 3
  speDef = 4
  maxPP = 90
  range = 2
  skill = Ability.ROCK_TOMB
  final = true
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

  getEvolution(player: Player) {
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
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}
export class Relicanth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.WATER, Synergy.FOSSIL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 13
  def = 6
  speDef = 3
  maxPP = 70
  range = 1
  skill = Ability.ROCK_TOMB
  final = true
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
  final = true
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
  final = true
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
  passive = Passive.GENESECT
  final = true
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
  skill = Ability.PSYCH_UP
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  skill = Ability.PSYCH_UP
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  skill = Ability.PSYCH_UP
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
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
  maxPP = 80
  range = 2
  skill = Ability.VOLT_SWITCH
  final = true
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
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
}
export class Guzzlord extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.DARK])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 22
  def = 3
  speDef = 3
  maxPP = 120
  range = 3
  skill = Ability.TWISTING_NETHER
  final = true
  attackSprite = AttackSprite.FIRE_RANGE
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
  final = true
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
  final = true
  onAcquired(player: Player) {
    // also gain sheninja if free space on bench
    const x = player.getFirstAvailablePositionInBench()
    if (x !== undefined) {
      const pokemon = PokemonFactory.createPokemonFromName(Pkm.SHEDINJA, player)
      pokemon.positionX = x
      pokemon.positionY = 0
      player.board.set(pokemon.id, pokemon)
    }
  }
}

export class Shedinja extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GHOST, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 2
  hp = 10
  atk = 18
  def = 0
  speDef = 0
  maxPP = 100
  range = 1
  skill = Ability.WONDER_GUARD
  passive = Passive.WONDER_GUARD
  attackSprite = AttackSprite.BUG_MELEE
  additional = true
  final = true
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
  speDef = 4
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
  speDef = 8
  maxPP = 130
  range = 1
  skill = Ability.SOFT_BOILED
  final = true
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
  passive = Passive.ELECTRIC_SURGE
  final = true
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
  passive = Passive.PSYCHIC_SURGE
  final = true
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
  final = true
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
  passive = Passive.MISTY_SURGE
  final = true
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
  passive = Passive.GRASSY_SURGE
  final = true
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
  final = true
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
  final = true
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
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Pumpkaboo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.GRASS])
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
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 28
  def = 10
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.CORRUPTED_NATURE
  final = true
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
  final = true
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
  final = true
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
  final = true
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
  maxPP = 55
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
  atk = 22
  def = 5
  speDef = 5
  maxPP = 55
  range = 1
  skill = Ability.AQUA_JET
  final = true
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
  final = true
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
  hp = 170
  atk = 22
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.DYNAMIC_PUNCH
  final = true
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
  final = true
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
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Corphish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.DARK])
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
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 16
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.CRABHAMMER
  final = true
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
  final = true
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
  attackSprite = AttackSprite.NORMAL_MELEE
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
  final = true
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
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
  skill = Ability.SLACK_OFF
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Snorlax extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.HUMAN,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 300
  atk = 19
  def = 3
  speDef = 3
  maxPP = 120
  range = 1
  skill = Ability.SLACK_OFF
  final = true
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}
export class Growlithe extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARCANINE
  hp = 70
  atk = 6
  def = 2
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.GROWL
  additional = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class Arcanine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 14
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.GROWL
  final = true
  additional = true
  attackSprite = AttackSprite.FIRE_MELEE
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
  skill = Ability.CONFUSION
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
  skill = Ability.CONFUSION
  final = true
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
  maxPP = 85
  range = 2
  skill = Ability.MIMIC
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  maxPP = 85
  range = 2
  skill = Ability.MIMIC
  final = true
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  final = true
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
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.ELECTRIC_MELEE
}

export class Slugma extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.ROCK])
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
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.ROCK])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 16
  def = 6
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.FIRE_BLAST
  final = true
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
  final = true
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
  final = true
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
  skill = Ability.GUILLOTINE
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
  skill = Ability.GUILLOTINE
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
}
export class Poochyena extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.DARK, Synergy.FIELD])
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
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Mightyena extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 160
  atk = 19
  def = 4
  speDef = 4
  maxPP = 75
  range = 1
  skill = Ability.GROWL
  final = true
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Bronzor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.BRONZONG
  hp = 90
  atk = 5
  def = 5
  speDef = 3
  maxPP = 95
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
  maxPP = 95
  range = 1
  skill = Ability.DEFENSE_CURL
  final = true
  additional = true
  attackSprite = AttackSprite.DRAGON_MELEE
}

export class Drifloon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FLYING])
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
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  hp = 250
  atk = 10
  def = 3
  speDef = 3
  maxPP = 85
  range = 2
  skill = Ability.CALM_MIND
  final = true
  additional = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Shroomish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.BRELOOM
  hp = 60
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
  hp = 150
  atk = 15
  def = 3
  speDef = 3
  maxPP = 85
  range = 1
  skill = Ability.LEECH_SEED
  final = true
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
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class TypeNull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GRANBULL
  hp = 65
  atk = 6
  def = 3
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.DEFAULT
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Sylvally extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 130
  atk = 11
  def = 6
  speDef = 3
  maxPP = 70
  range = 1
  skill = Ability.DEFAULT
  final = true
  additional = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Applin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.APPLETUN
  hp = 130
  atk = 6
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
  atk = 16
  def = 8
  speDef = 6
  maxPP = 85
  range = 1
  skill = Ability.APPLE_ACID
  final = true
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
  maxPP = 100
  range = 2
  skill = Ability.PSYCHIC
  additional = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Starmie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 20
  def = 2
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.PSYCHIC
  final = true
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
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
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
  final = true
  additional = true
  attackSprite = AttackSprite.FIRE_RANGE
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
  additional = true
  attackSprite = AttackSprite.ICE_RANGE
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
  final = true
  additional = true
  attackSprite = AttackSprite.ICE_RANGE
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
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.WATER_MELEE
}

export class Dreepy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.DRAKLOAK
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 90
  atk = 5
  def = 3
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.DRAGON_DARTS
  passive = Passive.HATCH
  attackSprite = AttackSprite.FIRE_RANGE
}

export class Drakloak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.DRAGAPULT
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 140
  atk = 12
  def = 3
  speDef = 3
  maxPP = 80
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
  maxPP = 80
  range = 2
  skill = Ability.DRAGON_DARTS
  final = true
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
  atk = 11
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
  final = true
  attackSprite = AttackSprite.GRASS_RANGE
}

export class Starly extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.STARAVIA
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 75
  atk = 8
  def = 3
  speDef = 3
  maxPP = 100
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
  atk = 16
  def = 5
  speDef = 5
  maxPP = 100
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
  atk = 24
  def = 7
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.BRAVE_BIRD
  final = true
  attackSprite = AttackSprite.FLYING_MELEE
}

export class Scorbunny extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
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
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
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
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity = Rarity.HATCH
  stars = 3
  hp = 180
  atk = 20
  def = 7
  speDef = 7
  maxPP = 50
  range = 1
  skill = Ability.PYRO_BALL
  final = true
  attackSprite = AttackSprite.FIRE_MELEE
}

export class AlolanGeodude extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.ALOLAN_GRAVELER
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 100
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  passive = Passive.HATCH
  attackSprite = AttackSprite.ROCK_MELEE
}

export class AlolanGraveler extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.ALOLAN_GOLEM
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 180
  atk = 10
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  passive = Passive.HATCH
  attackSprite = AttackSprite.ROCK_MELEE
}

export class AlolanGolem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.HATCH
  stars = 3
  hp = 250
  atk = 20
  def = 7
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  final = true
  attackSprite = AttackSprite.ROCK_MELEE
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
  maxPP = 100
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
  atk = 9
  def = 2
  speDef = 3
  maxPP = 100
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
  maxPP = 100
  range = 3
  skill = Ability.SPARKLING_ARIA
  final = true
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
  final = true
  attackSprite = AttackSprite.PSYCHIC_RANGE
}

export class Sandshrew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SANDSLASH
  hp = 90
  atk = 4
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
  atk = 10
  def = 5
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.SPIKE_ARMOR
  final = true
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Nosepass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.PROBOPASS
  hp = 60
  atk = 5
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_RISE
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Probopass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 120
  atk = 10
  def = 8
  speDef = 8
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_RISE
  final = true
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
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
  maxPP = 90
  range = 3
  skill = Ability.ATTRACT
  additional = true
  attackSprite = AttackSprite.FAIRY_RANGE
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
  maxPP = 90
  range = 3
  skill = Ability.ATTRACT
  final = true
  additional = true
  attackSprite = AttackSprite.FAIRY_RANGE
}

export class Pineco extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.FORRETRESS
  hp = 75
  atk = 5
  def = 3
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
  atk = 5
  def = 5
  speDef = 3
  maxPP = 120
  range = 1
  skill = Ability.EXPLOSION
  final = true
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
}
export class UnownB extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  def = 1
  speDef = 1
  maxPP = 30
  range = 9
  skill = Ability.HIDDEN_POWER_B
  passive = Passive.UNOWN
  attackSprite = AttackSprite.PSYCHIC_RANGE
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
  def = 2
  speDef = 2
  maxPP = 50
  range = 1
  skill = Ability.DIG
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Dugtrio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 14
  def = 4
  speDef = 4
  maxPP = 50
  range = 1
  skill = Ability.DIG
  final = true
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
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
  maxPP = 80
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
  maxPP = 80
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
  maxPP = 80
  range = 3
  skill = Ability.SPIRIT_SHACKLE
  final = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Zorua extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ZOROARK
  hp = 70
  atk = 6
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ILLUSION
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Zoroark extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 15
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ILLUSION
  final = true
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class HisuiZorua extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.HISUI_ZOROARK
  hp = 70
  atk = 6
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ILLUSION
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class HisuiZoroark extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 15
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ILLUSION
  final = true
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Grimer extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.MONSTER])
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
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Muk extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 190
  atk = 10
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  final = true
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class AlolanGrimer extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.DARK])
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
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class AlolanMuk extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 15
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  final = true
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
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
  final = true
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Carvanha extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SHARPEDO
  hp = 75
  atk = 10
  def = 1
  speDef = 2
  maxPP = 40
  range = 1
  skill = Ability.AGILITY
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Sharpedo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 21
  def = 2
  speDef = 3
  maxPP = 40
  range = 1
  skill = Ability.AGILITY
  final = true
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
  final = true
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
  final = true
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

  evolutionRule = new ItemEvolutionRule(AllItems, (pokemon, player, item) => {
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
  atk = 22
  def = 5
  speDef = 5
  maxPP = 75
  range = 1
  skill = Ability.TRIPLE_KICK
  final = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Hitmonlee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 25
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.MAWASHI_GERI
  final = true
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
  final = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Mimikyu extends Pokemon {
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
  final = true
  attackSprite = AttackSprite.FAIRY_MELEE
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
  atk = 16
  def = 6
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.MIMIC
  passive = Passive.SUDOWOODO
  final = true
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Combee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.VESPIQUEEN
  hp = 120
  atk = 8
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
  hp = 210
  atk = 20
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.HEAL_ORDER
  final = true
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
  maxPP = 70
  range = 1
  skill = Ability.SHELL_TRAP
  final = true
  attackSprite = AttackSprite.ROCK_MELEE
}

export class Tepig extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FIELD
  ])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.PIGNITE
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 80
  atk = 5
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  passive = Passive.HATCH
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Pignite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FIELD
  ])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.EMBOAR
  evolutionRule = new HatchEvolutionRule(EvolutionTime.EVOLVE_HATCH)
  hp = 140
  atk = 12
  def = 5
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  passive = Passive.HATCH
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Emboar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FIELD
  ])
  rarity = Rarity.HATCH
  stars = 3
  hp = 220
  atk = 18
  def = 6
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  final = true
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
  skill = Ability.STICKY_WEB
  passive = Passive.WURMPLE
  attackSprite = AttackSprite.BUG_MELEE

  getEvolution(player: Player) {
    const lastWeather = player.getLastBattle()?.weather ?? Weather.NEUTRAL
    let existingSecondTier: Pkm | null = null
    player.board.forEach((pkm) => {
      if (pkm.name === Pkm.CASCOON) existingSecondTier = Pkm.CASCOON
      else if (pkm.name === Pkm.SILCOON) existingSecondTier = Pkm.SILCOON
    })
    if (existingSecondTier !== null) {
      return existingSecondTier
    } else if (
      [Weather.NIGHT, Weather.STORM, Weather.SANDSTORM, Weather.SNOW].includes(
        lastWeather
      )
    ) {
      return Pkm.CASCOON
    } else if (
      [Weather.SUN, Weather.RAIN, Weather.MISTY, Weather.WINDY].includes(
        lastWeather
      )
    ) {
      return Pkm.SILCOON
    } else {
      return coinflip() ? Pkm.CASCOON : Pkm.SILCOON
    }
  }
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
  final = true
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
  maxPP = 150
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
  maxPP = 150
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
  maxPP = 150
  range = 1
  skill = Ability.GIGATON_HAMMER
  final = true
  attackSprite = AttackSprite.FAIRY_MELEE
}

export class Maractus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.GROUND, Synergy.FLORA])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 12
  def = 6
  speDef = 3
  maxPP = 100
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
  atk = 25
  def = 5
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.ASTRAL_BARRAGE
  passive = Passive.GRIM_NEIGH
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Kartana extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 40
  def = 10
  speDef = 1
  maxPP = 95
  range = 1
  skill = Ability.LEAF_BLADE
  passive = Passive.BEAST_BOOST
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
  final = true
  attackSprite = AttackSprite.GRASS_MELEE
}

export class Koffing extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.ARTIFICIAL])
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
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 190
  atk = 10
  def = 5
  speDef = 5
  maxPP = 40
  range = 1
  skill = Ability.SMOG
  final = true
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
  hp = 140
  atk = 15
  def = 3
  speDef = 2
  maxPP = 200
  range = 4
  skill = Ability.WATER_PULSE
  passive = Passive.MEGA_LAUNCHER
  final = true
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
  final = true
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
  hp = 90
  atk = 9
  def = 3
  speDef = 3
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
  hp = 220
  atk = 22
  def = 4
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.PARABOLIC_CHARGE
  passive = Passive.DRY_SKIN
  final = true
  additional = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
}

export class Bidoof extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FIELD,
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
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Bibarel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FIELD,
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
  final = true
  additional = true
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
  final = true
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
  hp = 150
  atk = 16
  def = 6
  speDef = 6
  maxPP = 70
  range = 2
  skill = Ability.CONFUSION
  final = true
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
  attackSprite = AttackSprite.NORMAL_MELEE
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
  final = true
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
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
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.FIGHTING_MELEE
}

export class Finneon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LUMINEON
  hp = 75
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
  atk = 16
  def = 4
  speDef = 4
  maxPP = 85
  range = 2
  skill = Ability.AQUA_RING
  final = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.POISON_MELEE
}

export class Illumise extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.BUG, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 13
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.STRUGGLE_BUG
  passive = Passive.ILLUMISE_VOLBEAT
  final = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Volbeat extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.BUG, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 13
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.TAIL_GLOW
  passive = Passive.ILLUMISE_VOLBEAT
  final = true
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
  final = true
  attackSprite = AttackSprite.DRAGON_MELEE

  onChangePosition(
    x: number,
    y: number,
    player: Player,
    lightX: number,
    lightY: number
  ) {
    if (x === lightX && y === lightY) {
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
  final = true
  attackSprite = AttackSprite.GHOST_RANGE

  onChangePosition(
    x: number,
    y: number,
    player: Player,
    lightX: number,
    lightY: number
  ) {
    if (x !== lightX || y !== lightY) {
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
  additional = true
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
  final = true
  additional = true
  attackSprite = AttackSprite.GRASS_RANGE
  onChangePosition(
    x: number,
    y: number,
    player: Player,
    lightX: number,
    lightY: number
  ) {
    if (x === lightX || y === lightY) {
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
  final = true
  additional = true
  attackSprite = AttackSprite.GRASS_RANGE
  onChangePosition(
    x: number,
    y: number,
    player: Player,
    lightX: number,
    lightY: number
  ) {
    if (x !== lightX || y !== lightY) {
      player.transformPokemon(this, Pkm.CHERRIM)
    }
  }
}

export class Misdreavus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FAIRY])
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
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 2
  hp = 180
  atk = 18
  def = 2
  speDef = 4
  maxPP = 95
  range = 3
  skill = Ability.NIGHT_SHADE
  final = true
  additional = true
  attackSprite = AttackSprite.GHOST_RANGE
}

export class Doduo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DODRIO
  hp = 90
  atk = 12
  def = 3
  speDef = 2
  maxPP = 40
  range = 1
  skill = Ability.AGILITY
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export class Dodrio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 185
  atk = 28
  def = 5
  speDef = 3
  maxPP = 40
  range = 1
  skill = Ability.AGILITY
  final = true
  additional = true
  attackSprite = AttackSprite.NORMAL_MELEE
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
  final = true
  additional = true
  attackSprite = AttackSprite.BUG_MELEE
}

export class Hippopotas extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND])
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
  types = new SetSchema<Synergy>([Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 2
  hp = 270
  atk = 19
  def = 7
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.SAND_TOMB
  final = true
  additional = true
  attackSprite = AttackSprite.ROCK_MELEE
  passive = Passive.SAND_STREAM
}

export class Wingull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.PELIPPER
  hp = 80
  atk = 8
  def = 3
  speDef = 3
  maxPP = 85
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
  hp = 180
  atk = 20
  def = 4
  speDef = 4
  maxPP = 85
  range = 2
  skill = Ability.WHIRLWIND
  final = true
  additional = true
  attackSprite = AttackSprite.FLYING_RANGE
  passive = Passive.DRIZZLE
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
  atk = 20
  def = 3
  speDef = 3
  maxPP = 80
  range = 3
  skill = Ability.CHARGE_BEAM
  passive = Passive.SPECIAL_ATTACK
  final = true
  attackSprite = AttackSprite.ELECTRIC_RANGE
  attackType = AttackType.SPECIAL
}

export class Tandemaus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
  attackSprite = AttackSprite.NORMAL_MELEE
  evolution = Pkm.MAUSHOLD_THREE
  evolutionRule = new TurnEvolutionRule(TandemausEvolutionTurn)
  passive = Passive.FAMILY
}

export class MausholdThree extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 19
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
  attackSprite = AttackSprite.NORMAL_MELEE
  evolution = Pkm.MAUSHOLD_FOUR
  evolutionRule = new TurnEvolutionRule(MausholdEvolutionTurn)
  passive = Passive.FAMILY
}

export class MausholdFour extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 230
  atk = 23
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
  final = true
  attackSprite = AttackSprite.NORMAL_MELEE
}

export const PokemonClasses: Record<
  Pkm,
  new (shiny: boolean, emotion: Emotion) => Pokemon
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
  [Pkm.ONIX]: Onix,
  [Pkm.STEELIX]: Steelix,
  [Pkm.MEGA_STEELIX]: MegaSteelix,
  [Pkm.SCYTHER]: Scyther,
  [Pkm.SCIZOR]: Scizor,
  [Pkm.MEGA_SCIZOR]: MegaScizor,
  [Pkm.RIOLU]: Riolu,
  [Pkm.LUCARIO]: Lucario,
  [Pkm.MEGA_LUCARIO]: MegaLucario,
  [Pkm.MAGIKARP]: Magikarp,
  [Pkm.RATTATA]: Rattata,
  [Pkm.RATICATE]: Raticate,
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
  [Pkm.DEOXYS]: Deoxys,
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
  [Pkm.DUGTRIO]: Dugtrio,
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
  [Pkm.TYPE_NULL]: TypeNull,
  [Pkm.SILVALLY]: Sylvally,
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
  [Pkm.PELIPPER]: Pelipper
}
