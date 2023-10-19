/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { Schema, type, SetSchema } from "@colyseus/schema"
import { nanoid } from "nanoid"
import { Emotion, IPokemon, AttackSprite } from "../../types"
import { DEFAULT_ATK_SPEED, EvolutionTime } from "../../types/Config"
import { Item } from "../../types/enum/Item"
import { Pkm, PkmIndex, Unowns } from "../../types/enum/Pokemon"
import { Rarity, AttackType, PokemonActionState } from "../../types/enum/Game"
import { Ability } from "../../types/enum/Ability"
import { Synergy } from "../../types/enum/Synergy"
import { Passive } from "../../types/enum/Passive"
import Player from "./player"

export class Pokemon extends Schema implements IPokemon {
  @type("string") id: string
  @type("string") name: Pkm
  @type({ set: "string" }) types = new SetSchema<Synergy>()
  @type("string") rarity: Rarity
  @type("string") index: string
  @type("string") evolution: Pkm
  @type("int8") positionX = -1
  @type("int8") positionY = -1
  @type("string") attackSprite: AttackSprite
  @type("float32") atkSpeed = DEFAULT_ATK_SPEED
  @type("uint8") def: number
  @type("uint8") speDef: number
  @type("uint8") attackType: AttackType
  @type("uint16") atk: number
  @type("uint16") hp: number
  @type("uint8") range: number
  @type("uint8") stars: number
  @type("uint8") maxPP: number
  @type("string") skill: Ability
  @type("string") passive: Passive = Passive.NONE
  @type({ set: "string" }) items = new SetSchema<Item>()
  @type("boolean") shiny: boolean
  @type("string") emotion: Emotion
  @type("string") action: PokemonActionState = PokemonActionState.IDLE
  evolutionTimer: number | undefined
  final: boolean
  additional = false

  constructor(
    name: Pkm,
    types: Synergy[],
    rarity: Rarity,
    evolution: Pkm,
    hp: number,
    atk: number,
    def: number,
    speDef: number,
    range: number,
    attackSprite: AttackSprite,
    stars: number,
    maxPP: number,
    skill: Ability,
    shiny: boolean,
    emotion: Emotion,
    final: boolean,
    additional?: boolean,
    passive?: Passive
  ) {
    super()
    this.id = nanoid()
    this.name = name
    this.rarity = rarity
    this.index = PkmIndex[name]
    this.evolution = evolution
    this.hp = hp
    this.atk = atk
    this.def = def
    this.speDef = speDef
    this.range = range
    this.attackSprite = attackSprite
    this.attackType = AttackType.PHYSICAL
    this.stars = stars
    this.maxPP = maxPP
    this.skill = skill
    this.passive = passive ?? Passive.NONE
    this.shiny = shiny
    this.emotion = emotion
    this.final = final
    this.additional = !!additional
    types.forEach((type) => {
      this.types.add(type)
    })

    if (this.rarity === Rarity.HATCH && this.evolution != Pkm.DEFAULT) {
      this.evolutionTimer = EvolutionTime.EVOLVE_HATCH
    }
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
}

export class Ditto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DITTO,
      [Synergy.NORMAL],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      30,
      1,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true,
      false,
      Passive.DITTO
    )
  }
}

export class Egg extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.EGG,
      [],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      30,
      1,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true,
      false,
      Passive.EGG
    )
  }
}

export class Electrike extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ELECTRIKE,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.ULTRA,
      Pkm.MANECTRIC,
      120,
      15,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      1,
      60,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      false
    )
  }
}

export class Manectric extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MANECTRIC,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.ULTRA,
      Pkm.MEGA_MANECTRIC,
      210,
      30,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      2,
      60,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaManectric extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_MANECTRIC,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      300,
      48,
      7,
      7,
      1,
      AttackSprite.ELECTRIC_MELEE,
      3,
      60,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      true
    )
  }
}

export class Shuppet extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHUPPET,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.ULTRA,
      Pkm.BANETTE,
      120,
      7,
      3,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      125,
      Ability.SHADOW_CLONE,
      shiny,
      emotion,
      false
    )
  }
}

export class Banette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BANETTE,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.ULTRA,
      Pkm.MEGA_BANETTE,
      200,
      15,
      4,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      125,
      Ability.SHADOW_CLONE,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaBanette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_BANETTE,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      300,
      30,
      5,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.SHADOW_CLONE,
      shiny,
      emotion,
      true
    )
  }
}

export class Riolu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RIOLU,
      [Synergy.FIGHTING, Synergy.STEEL, Synergy.BABY],
      Rarity.ULTRA,
      Pkm.LUCARIO,
      120,
      10,
      3,
      3,
      2,
      AttackSprite.FIGHTING_RANGE,
      1,
      100,
      Ability.SILENCE,
      shiny,
      emotion,
      false
    )
  }
}

export class Lucario extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LUCARIO,
      [Synergy.FIGHTING, Synergy.STEEL],
      Rarity.ULTRA,
      Pkm.MEGA_LUCARIO,
      240,
      20,
      5,
      5,
      2,
      AttackSprite.FIGHTING_RANGE,
      2,
      100,
      Ability.SILENCE,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaLucario extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_LUCARIO,
      [Synergy.FIGHTING, Synergy.STEEL],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      360,
      42,
      7,
      7,
      2,
      AttackSprite.FIGHTING_RANGE,
      3,
      100,
      Ability.SILENCE,
      shiny,
      emotion,
      true
    )
  }
}

export class Swablu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SWABLU,
      [Synergy.FAIRY, Synergy.SOUND],
      Rarity.ULTRA,
      Pkm.ALTARIA,
      120,
      12,
      3,
      3,
      2,
      AttackSprite.DRAGON_RANGE,
      1,
      100,
      Ability.HYPER_VOICE,
      shiny,
      emotion,
      false
    )
  }
}

export class Altaria extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALTARIA,
      [Synergy.DRAGON, Synergy.FAIRY, Synergy.SOUND],
      Rarity.ULTRA,
      Pkm.MEGA_ALTARIA,
      200,
      25,
      4,
      4,
      2,
      AttackSprite.DRAGON_RANGE,
      2,
      100,
      Ability.HYPER_VOICE,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaAltaria extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_ALTARIA,
      [Synergy.DRAGON, Synergy.FAIRY, Synergy.SOUND],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      300,
      42,
      5,
      5,
      2,
      AttackSprite.DRAGON_RANGE,
      3,
      100,
      Ability.HYPER_VOICE,
      shiny,
      emotion,
      true
    )
  }
}

export class Scyther extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SCYTHER,
      [Synergy.BUG, Synergy.FLYING],
      Rarity.ULTRA,
      Pkm.SCIZOR,
      130,
      18,
      5,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      80,
      Ability.X_SCISSOR,
      shiny,
      emotion,
      false
    )
  }
}

export class Scizor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SCIZOR,
      [Synergy.BUG, Synergy.FLYING, Synergy.STEEL],
      Rarity.ULTRA,
      Pkm.MEGA_SCIZOR,
      180,
      28,
      6,
      6,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      80,
      Ability.X_SCISSOR,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaScizor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_SCIZOR,
      [Synergy.BUG, Synergy.FLYING, Synergy.STEEL],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      250,
      48,
      7,
      7,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      80,
      Ability.X_SCISSOR,
      shiny,
      emotion,
      true
    )
  }
}

export class Bounsweet extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BOUNSWEET,
      [Synergy.GRASS, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.STEENEE,
      100,
      8,
      4,
      4,
      1,
      AttackSprite.FIGHTING_MELEE,
      1,
      100,
      Ability.HIGH_JUMP_KICK,
      shiny,
      emotion,
      false
    )
  }
}

export class Steenee extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STEENEE,
      [Synergy.GRASS, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.TSAREENA,
      180,
      16,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      2,
      100,
      Ability.HIGH_JUMP_KICK,
      shiny,
      emotion,
      false
    )
  }
}

export class Tsareena extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TSAREENA,
      [Synergy.GRASS, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.DEFAULT,
      360,
      34,
      6,
      6,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      90,
      Ability.HIGH_JUMP_KICK,
      shiny,
      emotion,
      true
    )
  }
}

export class Buneary extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BUNEARY,
      [Synergy.NORMAL, Synergy.FIGHTING],
      Rarity.ULTRA,
      Pkm.LOPUNNY,
      130,
      15,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      1,
      80,
      Ability.HIGH_JUMP_KICK,
      shiny,
      emotion,
      false
    )
  }
}

export class Lopunny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LOPUNNY,
      [Synergy.NORMAL, Synergy.FIGHTING],
      Rarity.ULTRA,
      Pkm.MEGA_LOPUNNY,
      250,
      28,
      6,
      6,
      1,
      AttackSprite.FIGHTING_MELEE,
      2,
      80,
      Ability.HIGH_JUMP_KICK,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaLopunny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_LOPUNNY,
      [Synergy.NORMAL, Synergy.FIGHTING],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      350,
      50,
      8,
      8,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      80,
      Ability.HIGH_JUMP_KICK,
      shiny,
      emotion,
      true
    )
  }
}

export class Onix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ONIX,
      [Synergy.ROCK, Synergy.GROUND, Synergy.STEEL],
      Rarity.ULTRA,
      Pkm.STEELIX,
      150,
      9,
      10,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      70,
      Ability.SPIKE_ARMOR,
      shiny,
      emotion,
      false
    )
  }
}

export class Steelix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STEELIX,
      [Synergy.ROCK, Synergy.GROUND, Synergy.STEEL],
      Rarity.ULTRA,
      Pkm.MEGA_STEELIX,
      250,
      14,
      20,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      70,
      Ability.SPIKE_ARMOR,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaSteelix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_STEELIX,
      [Synergy.ROCK, Synergy.GROUND, Synergy.STEEL],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      350,
      20,
      30,
      15,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      70,
      Ability.SPIKE_ARMOR,
      shiny,
      emotion,
      true
    )
  }
}

export class Numel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NUMEL,
      [Synergy.FIRE, Synergy.FIELD, Synergy.GROUND],
      Rarity.ULTRA,
      Pkm.CAMERUPT,
      130,
      9,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      1,
      100,
      Ability.ERUPTION,
      shiny,
      emotion,
      false
    )
  }
}

export class Camerupt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CAMERUPT,
      [Synergy.FIRE, Synergy.FIELD, Synergy.GROUND],
      Rarity.ULTRA,
      Pkm.MEGA_CAMERUPT,
      220,
      14,
      10,
      10,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      100,
      Ability.ERUPTION,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaCamerupt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_CAMERUPT,
      [Synergy.FIRE, Synergy.FIELD, Synergy.GROUND],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      330,
      22,
      15,
      15,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      100,
      Ability.ERUPTION,
      shiny,
      emotion,
      true
    )
  }
}

export class Meditite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEDITITE,
      [Synergy.PSYCHIC, Synergy.HUMAN, Synergy.FIGHTING],
      Rarity.ULTRA,
      Pkm.MEDICHAM,
      120,
      10,
      5,
      5,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      60,
      Ability.CONFUSION,
      shiny,
      emotion,
      false
    )
  }
}

export class Medicham extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEDICHAM,
      [Synergy.PSYCHIC, Synergy.HUMAN, Synergy.FIGHTING],
      Rarity.ULTRA,
      Pkm.MEGA_MEDICHAM,
      200,
      20,
      6,
      6,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      60,
      Ability.CONFUSION,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaMedicham extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_MEDICHAM,
      [Synergy.PSYCHIC, Synergy.HUMAN, Synergy.FIGHTING],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      300,
      35,
      7,
      7,
      2,
      AttackSprite.PSYCHIC_RANGE,
      3,
      60,
      Ability.CONFUSION,
      shiny,
      emotion,
      true
    )
  }
}

export class Elekid extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ELEKID,
      [Synergy.ELECTRIC, Synergy.ARTIFICIAL, Synergy.BABY],
      Rarity.EPIC,
      Pkm.ELECTABUZZ,
      110,
      5,
      4,
      4,
      1,
      AttackSprite.ELECTRIC_MELEE,
      1,
      90,
      Ability.DISCHARGE,
      shiny,
      emotion,
      false
    )
  }
}

export class Electabuzz extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ELECTABUZZ,
      [Synergy.ELECTRIC, Synergy.ARTIFICIAL, Synergy.LIGHT],
      Rarity.EPIC,
      Pkm.ELECTIVIRE,
      180,
      16,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      2,
      90,
      Ability.DISCHARGE,
      shiny,
      emotion,
      false
    )
  }
}

export class Electivire extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ELECTIVIRE,
      [Synergy.ELECTRIC, Synergy.ARTIFICIAL, Synergy.LIGHT],
      Rarity.EPIC,
      Pkm.DEFAULT,
      380,
      28,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      3,
      90,
      Ability.DISCHARGE,
      shiny,
      emotion,
      true
    )
  }
}

export class Gible extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GIBLE,
      [Synergy.DRAGON, Synergy.GROUND, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.GABITE,
      100,
      6,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      100,
      Ability.DRAGON_BREATH,
      shiny,
      emotion,
      false
    )
  }
}

export class Gabite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GABITE,
      [Synergy.DRAGON, Synergy.GROUND, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.GARCHOMP,
      160,
      14,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      100,
      Ability.DRAGON_BREATH,
      shiny,
      emotion,
      false
    )
  }
}

export class Garchomp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GARCHOMP,
      [Synergy.DRAGON, Synergy.GROUND, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.DEFAULT,
      240,
      32,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.DRAGON_BREATH,
      shiny,
      emotion,
      true
    )
  }
}

export class Beldum extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BELDUM,
      [Synergy.PSYCHIC, Synergy.STEEL, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.METANG,
      110,
      5,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      100,
      Ability.METEOR_MASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Metang extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.METANG,
      [Synergy.PSYCHIC, Synergy.STEEL, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.METAGROSS,
      190,
      9,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      100,
      Ability.METEOR_MASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Metagross extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.METAGROSS,
      [Synergy.PSYCHIC, Synergy.STEEL, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.DEFAULT,
      320,
      20,
      8,
      8,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.METEOR_MASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Tympole extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TYMPOLE,
      [Synergy.WATER, Synergy.GROUND, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.PALPITOAD,
      90,
      5,
      4,
      4,
      1,
      AttackSprite.WATER_MELEE,
      1,
      90,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Palpitoad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PALPITOAD,
      [Synergy.WATER, Synergy.GROUND, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.SEISMITOAD,
      130,
      9,
      5,
      5,
      1,
      AttackSprite.WATER_MELEE,
      2,
      90,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Seismitoad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SEISMITOAD,
      [Synergy.WATER, Synergy.GROUND, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      20,
      6,
      6,
      1,
      AttackSprite.WATER_MELEE,
      3,
      90,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Bagon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BAGON,
      [Synergy.DRAGON, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.SHELGON,
      90,
      6,
      3,
      3,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      100,
      Ability.HEAD_SMASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Shelgon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHELGON,
      [Synergy.DRAGON, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.SALAMENCE,
      150,
      15,
      3,
      3,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      100,
      Ability.HEAD_SMASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Salamence extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SALAMENCE,
      [Synergy.DRAGON, Synergy.MONSTER, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      240,
      24,
      3,
      3,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.DRAGON_DARTS,
      shiny,
      emotion,
      true
    )
  }
}

export class Ralts extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RALTS,
      [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.HUMAN],
      Rarity.EPIC,
      Pkm.KIRLIA,
      90,
      5,
      2,
      4,
      3,
      AttackSprite.PSYCHIC_RANGE,
      1,
      110,
      Ability.FUTURE_SIGHT,
      shiny,
      emotion,
      false
    )
  }
}

export class Kirlia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KIRLIA,
      [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.HUMAN],
      Rarity.EPIC,
      Pkm.GARDEVOIR,
      130,
      13,
      3,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      2,
      110,
      Ability.FUTURE_SIGHT,
      shiny,
      emotion,
      false
    )
  }
}

export class Gardevoir extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GARDEVOIR,
      [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.HUMAN],
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      28,
      4,
      8,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      110,
      Ability.FUTURE_SIGHT,
      shiny,
      emotion,
      true
    )
  }
}

export class Budew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BUDEW,
      [Synergy.GRASS, Synergy.POISON, Synergy.BABY],
      Rarity.EPIC,
      Pkm.ROSELIA,
      90,
      5,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      1,
      100,
      Ability.PETAL_DANCE,
      shiny,
      emotion,
      false
    )
  }
}

export class Roselia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ROSELIA,
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.EPIC,
      Pkm.ROSERADE,
      130,
      16,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      2,
      100,
      Ability.PETAL_DANCE,
      shiny,
      emotion,
      false
    )
  }
}

export class Roserade extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ROSERADE,
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      18,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      3,
      100,
      Ability.PETAL_DANCE,
      shiny,
      emotion,
      true
    )
  }
}

export class Slakoth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SLAKOTH,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.VIGOROTH,
      130,
      6,
      5,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      120,
      Ability.SLACK_OFF,
      shiny,
      emotion,
      false
    )
  }
}

export class Vigoroth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VIGOROTH,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.SLAKING,
      220,
      18,
      5,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      120,
      Ability.SLACK_OFF,
      shiny,
      emotion,
      false
    )
  }
}

export class Slaking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SLAKING,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.DEFAULT,
      380,
      34,
      7,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      120,
      Ability.SLACK_OFF,
      shiny,
      emotion,
      true
    )
  }
}

export class Honedge extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HONEDGE,
      [Synergy.GHOST, Synergy.STEEL, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.DOUBLADE,
      85,
      6,
      3,
      3,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      100,
      Ability.KING_SHIELD,
      shiny,
      emotion,
      false
    )
  }
}

export class Doublade extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DOUBLADE,
      [Synergy.GHOST, Synergy.STEEL, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.AEGISLASH,
      130,
      13,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      100,
      Ability.KING_SHIELD,
      shiny,
      emotion,
      false
    )
  }
}

export class Aegislash extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AEGISLASH,
      [Synergy.GHOST, Synergy.STEEL, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.DEFAULT,
      230,
      23,
      7,
      7,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.KING_SHIELD,
      shiny,
      emotion,
      true
    )
  }
}

export class Oshawott extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.OSHAWOTT,
      [Synergy.WATER, Synergy.FIELD, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.DEWOTT,
      90,
      8,
      4,
      4,
      1,
      AttackSprite.WATER_MELEE,
      1,
      120,
      Ability.CRABHAMMER,
      shiny,
      emotion,
      false
    )
  }
}

export class Dewott extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DEWOTT,
      [Synergy.WATER, Synergy.FIELD, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.SAMUROTT,
      150,
      15,
      6,
      6,
      1,
      AttackSprite.WATER_MELEE,
      2,
      120,
      Ability.CRABHAMMER,
      shiny,
      emotion,
      false
    )
  }
}

export class Samurott extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SAMUROTT,
      [Synergy.WATER, Synergy.FIELD, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.DEFAULT,
      260,
      32,
      8,
      8,
      1,
      AttackSprite.WATER_MELEE,
      3,
      120,
      Ability.CRABHAMMER,
      shiny,
      emotion,
      true
    )
  }
}

export class Larvitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LARVITAR,
      [Synergy.DARK, Synergy.MONSTER, Synergy.ROCK],
      Rarity.RARE,
      Pkm.PUPITAR,
      75,
      7,
      4,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      90,
      Ability.BITE,
      shiny,
      emotion,
      false
    )
  }
}

export class Pupitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PUPITAR,
      [Synergy.DARK, Synergy.MONSTER, Synergy.ROCK],
      Rarity.RARE,
      Pkm.TYRANITAR,
      130,
      14,
      6,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      90,
      Ability.BITE,
      shiny,
      emotion,
      false
    )
  }
}

export class Tyranitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TYRANITAR,
      [Synergy.DARK, Synergy.MONSTER, Synergy.ROCK],
      Rarity.RARE,
      Pkm.DEFAULT,
      210,
      28,
      8,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      90,
      Ability.BITE,
      shiny,
      emotion,
      true
    )
  }
}

export class JangmoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.JANGMO_O,
      [Synergy.DRAGON, Synergy.FIGHTING, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.HAKAMO_O,
      100,
      6,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      110,
      Ability.CLANGOROUS_SOUL,
      shiny,
      emotion,
      false
    )
  }
}

export class HakamoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HAKAMO_O,
      [Synergy.DRAGON, Synergy.FIGHTING, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.KOMMO_O,
      160,
      13,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      110,
      Ability.CLANGOROUS_SOUL,
      shiny,
      emotion,
      false
    )
  }
}

export class KommoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KOMMO_O,
      [Synergy.DRAGON, Synergy.FIGHTING, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.DEFAULT,
      280,
      25,
      8,
      8,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      110,
      Ability.CLANGOROUS_SOUL,
      shiny,
      emotion,
      true
    )
  }
}

export class Gastly extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GASTLY,
      [Synergy.MONSTER, Synergy.POISON, Synergy.GHOST],
      Rarity.ULTRA,
      Pkm.HAUNTER,
      90,
      14,
      3,
      3,
      2,
      AttackSprite.GHOST_RANGE,
      1,
      100,
      Ability.NIGHTMARE,
      shiny,
      emotion,
      false
    )
  }
}

export class Haunter extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HAUNTER,
      [Synergy.MONSTER, Synergy.POISON, Synergy.GHOST],
      Rarity.ULTRA,
      Pkm.GENGAR,
      180,
      25,
      4,
      3,
      2,
      AttackSprite.GHOST_RANGE,
      2,
      100,
      Ability.NIGHTMARE,
      shiny,
      emotion,
      false
    )
  }
}

export class Gengar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GENGAR,
      [Synergy.MONSTER, Synergy.POISON, Synergy.GHOST],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      350,
      40,
      5,
      3,
      2,
      AttackSprite.GHOST_RANGE,
      3,
      100,
      Ability.NIGHTMARE,
      shiny,
      emotion,
      true
    )
  }
}

export class Abra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ABRA,
      [Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.KADABRA,
      90,
      5,
      2,
      4,
      4,
      AttackSprite.PSYCHIC_RANGE,
      1,
      50,
      Ability.TELEPORT,
      shiny,
      emotion,
      false
    )
  }
}

export class Kadabra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KADABRA,
      [Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.ALAKAZAM,
      130,
      10,
      3,
      5,
      4,
      AttackSprite.PSYCHIC_RANGE,
      2,
      50,
      Ability.TELEPORT,
      shiny,
      emotion,
      false
    )
  }
}

export class Alakazam extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALAKAZAM,
      [Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.DEFAULT,
      230,
      22,
      4,
      8,
      4,
      AttackSprite.PSYCHIC_RANGE,
      3,
      50,
      Ability.TELEPORT,
      shiny,
      emotion,
      true
    )
  }
}

export class Litwick extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LITWICK,
      [Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT],
      Rarity.COMMON,
      Pkm.LAMPENT,
      50,
      5,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      1,
      100,
      Ability.HEX,
      shiny,
      emotion,
      false
    )
  }
}

export class Lampent extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LAMPENT,
      [Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT],
      Rarity.COMMON,
      Pkm.CHANDELURE,
      90,
      9,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      2,
      100,
      Ability.HEX,
      shiny,
      emotion,
      false
    )
  }
}

export class Chandelure extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHANDELURE,
      [Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT],
      Rarity.COMMON,
      Pkm.DEFAULT,
      160,
      15,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      3,
      100,
      Ability.HEX,
      shiny,
      emotion,
      true
    )
  }
}

export class Porygon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PORYGON,
      [Synergy.NORMAL, Synergy.PSYCHIC, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.PORYGON_2,
      120,
      6,
      1,
      1,
      2,
      AttackSprite.FIGHTING_RANGE,
      1,
      90,
      Ability.TRI_ATTACK,
      shiny,
      emotion,
      false,
      true,
      Passive.PORYGON
    )
  }
}

export class Porygon2 extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PORYGON_2,
      [Synergy.NORMAL, Synergy.PSYCHIC, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.PORYGON_Z,
      180,
      14,
      1,
      3,
      2,
      AttackSprite.FIGHTING_RANGE,
      2,
      90,
      Ability.TRI_ATTACK,
      shiny,
      emotion,
      true,
      true,
      Passive.PORYGON
    )
  }
}

export class PorygonZ extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PORYGON_Z,
      [Synergy.NORMAL, Synergy.PSYCHIC, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.DEFAULT,
      333,
      33,
      1,
      5,
      2,
      AttackSprite.FIGHTING_RANGE,
      3,
      90,
      Ability.TRI_ATTACK,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Sewaddle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SEWADDLE,
      [Synergy.GRASS, Synergy.BUG, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.SWADLOON,
      80,
      5,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      80,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Swadloon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SWADLOON,
      [Synergy.GRASS, Synergy.BUG, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.LEAVANNY,
      120,
      9,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      80,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Leavanny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LEAVANNY,
      [Synergy.GRASS, Synergy.BUG, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.DEFAULT,
      220,
      20,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      80,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Turtwig extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TURTWIG,
      [Synergy.GRASS, Synergy.GROUND, Synergy.FLORA],
      Rarity.RARE,
      Pkm.GROTLE,
      80,
      5,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      100,
      Ability.GROWTH,
      shiny,
      emotion,
      false
    )
  }
}

export class Grotle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GROTLE,
      [Synergy.GRASS, Synergy.GROUND, Synergy.FLORA],
      Rarity.RARE,
      Pkm.TORTERRA,
      150,
      9,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      100,
      Ability.GROWTH,
      shiny,
      emotion,
      false
    )
  }
}

export class Torterra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TORTERRA,
      [Synergy.GRASS, Synergy.GROUND, Synergy.FLORA],
      Rarity.RARE,
      Pkm.DEFAULT,
      280,
      20,
      5,
      5,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.GROWTH,
      shiny,
      emotion,
      true
    )
  }
}

export class Deino extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DEINO,
      [Synergy.DARK, Synergy.DRAGON],
      Rarity.RARE,
      Pkm.ZWEILOUS,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Zweilous extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZWEILOUS,
      [Synergy.DARK, Synergy.DRAGON],
      Rarity.RARE,
      Pkm.HYDREIGON,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Hydreigon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HYDREIGON,
      [Synergy.DARK, Synergy.DRAGON],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      3,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Poliwag extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.POLIWAG,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.FIGHTING],
      Rarity.COMMON,
      Pkm.POLIWHIRL,
      65,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      1,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false,
      false,
      Passive.TADPOLE
    )
  }
}

export class Poliwhirl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.POLIWHIRL,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.FIGHTING],
      Rarity.COMMON,
      Pkm.POLITOED,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      2,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false,
      false,
      Passive.TADPOLE
    )
  }
}

export class Politoed extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.POLITOED,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.FIGHTING],
      Rarity.COMMON,
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      3,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      true,
      false,
      Passive.TADPOLE
    )
  }
}

export class Poliwrath extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.POLIWRATH,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.FIGHTING],
      Rarity.COMMON,
      Pkm.DEFAULT,
      220,
      18,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      3,
      100,
      Ability.CRABHAMMER,
      shiny,
      emotion,
      true,
      false,
      Passive.TADPOLE
    )
  }
}

export class Magby extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGBY,
      [Synergy.FIRE, Synergy.HUMAN, Synergy.BABY],
      Rarity.RARE,
      Pkm.MAGMAR,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      80,
      Ability.HEAT_WAVE,
      shiny,
      emotion,
      false
    )
  }
}

export class Magmar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGMAR,
      [Synergy.FIRE, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.MAGMORTAR,
      140,
      14,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      80,
      Ability.HEAT_WAVE,
      shiny,
      emotion,
      false
    )
  }
}

export class Magmortar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGMORTAR,
      [Synergy.FIRE, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.DEFAULT,
      280,
      26,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      3,
      80,
      Ability.HEAT_WAVE,
      shiny,
      emotion,
      true
    )
  }
}

export class Solosis extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SOLOSIS,
      [Synergy.PSYCHIC],
      Rarity.ULTRA,
      Pkm.DUOSION,
      100,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      90,
      Ability.SHADOW_BALL,
      shiny,
      emotion,
      false
    )
  }
}

export class Duosion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DUOSION,
      [Synergy.PSYCHIC],
      Rarity.ULTRA,
      Pkm.REUNICLUS,
      200,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      90,
      Ability.SHADOW_BALL,
      shiny,
      emotion,
      false
    )
  }
}

export class Reuniclus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REUNICLUS,
      [Synergy.PSYCHIC],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      300,
      18,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      3,
      90,
      Ability.SHADOW_BALL,
      shiny,
      emotion,
      true
    )
  }
}

export class Shinx extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHINX,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.RARE,
      Pkm.LUXIO,
      80,
      6,
      4,
      4,
      1,
      AttackSprite.ELECTRIC_MELEE,
      1,
      100,
      Ability.DISCHARGE,
      shiny,
      emotion,
      false
    )
  }
}

export class Luxio extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LUXIO,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.RARE,
      Pkm.LUXRAY,
      130,
      14,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      2,
      100,
      Ability.DISCHARGE,
      shiny,
      emotion,
      false
    )
  }
}

export class Luxray extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LUXRAY,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      32,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      3,
      100,
      Ability.DISCHARGE,
      shiny,
      emotion,
      true
    )
  }
}

export class Cubone extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CUBONE,
      [Synergy.GROUND, Synergy.GHOST],
      Rarity.EPIC,
      Pkm.MAROWAK,
      110,
      10,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      80,
      Ability.BONEMERANG,
      shiny,
      emotion,
      false,
      true,
      Passive.CUBONE
    )
  }
}

export class Marowak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAROWAK,
      [Synergy.GROUND, Synergy.GHOST],
      Rarity.EPIC,
      Pkm.ALOLAN_MAROWAK,
      220,
      20,
      6,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      80,
      Ability.BONEMERANG,
      shiny,
      emotion,
      true,
      true,
      Passive.CUBONE
    )
  }
}

export class AlolanMarowak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_MAROWAK,
      [Synergy.GROUND, Synergy.FIRE, Synergy.GHOST],
      Rarity.EPIC,
      Pkm.DEFAULT,
      250,
      26,
      8,
      6,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      80,
      Ability.BONEMERANG,
      shiny,
      emotion,
      true
    )
  }
}

export class Axew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AXEW,
      [Synergy.DRAGON, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.FRAXURE,
      80,
      5,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Fraxure extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FRAXURE,
      [Synergy.DRAGON, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.HAXORUS,
      120,
      9,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Haxorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HAXORUS,
      [Synergy.DRAGON, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      20,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Dratini extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DRATINI,
      [Synergy.DRAGON, Synergy.AQUATIC, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DRAGONAIR,
      80,
      5,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      110,
      Ability.DRAGON_BREATH,
      shiny,
      emotion,
      false
    )
  }
}

export class Dragonair extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DRAGONAIR,
      [Synergy.DRAGON, Synergy.AQUATIC, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DRAGONITE,
      120,
      13,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      110,
      Ability.DRAGON_BREATH,
      shiny,
      emotion,
      false
    )
  }
}

export class Dragonite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DRAGONITE,
      [Synergy.DRAGON, Synergy.AQUATIC, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      250,
      23,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      110,
      Ability.DRAGON_BREATH,
      shiny,
      emotion,
      true
    )
  }
}

export class Goomy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOOMY,
      [Synergy.DRAGON, Synergy.AQUATIC, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.SLIGOO,
      90,
      6,
      4,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      80,
      Ability.LIQUIDATION,
      shiny,
      emotion,
      false
    )
  }
}

export class Sligoo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SLIGOO,
      [Synergy.DRAGON, Synergy.AQUATIC, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.GOODRA,
      160,
      12,
      5,
      7,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      80,
      Ability.LIQUIDATION,
      shiny,
      emotion,
      false
    )
  }
}

export class Goodra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOODRA,
      [Synergy.DRAGON, Synergy.AQUATIC, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.DEFAULT,
      300,
      22,
      6,
      10,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      80,
      Ability.LIQUIDATION,
      shiny,
      emotion,
      true
    )
  }
}

export class Lotad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LOTAD,
      [Synergy.GRASS, Synergy.WATER, Synergy.AQUATIC],
      Rarity.RARE,
      Pkm.LOMBRE,
      80,
      6,
      2,
      2,
      3,
      AttackSprite.GRASS_RANGE,
      1,
      120,
      Ability.TORMENT,
      shiny,
      emotion,
      false
    )
  }
}

export class Lombre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LOMBRE,
      [Synergy.GRASS, Synergy.WATER, Synergy.AQUATIC],
      Rarity.RARE,
      Pkm.LUDICOLO,
      150,
      12,
      3,
      3,
      3,
      AttackSprite.GRASS_RANGE,
      2,
      120,
      Ability.TORMENT,
      shiny,
      emotion,
      false
    )
  }
}

export class Ludicolo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LUDICOLO,
      [Synergy.GRASS, Synergy.WATER, Synergy.AQUATIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      260,
      22,
      4,
      4,
      3,
      AttackSprite.GRASS_RANGE,
      3,
      120,
      Ability.TORMENT,
      shiny,
      emotion,
      true
    )
  }
}

export class Togepi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TOGEPI,
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.BABY],
      Rarity.RARE,
      Pkm.TOGETIC,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      1,
      70,
      Ability.WISH,
      shiny,
      emotion,
      false
    )
  }
}

export class Togetic extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TOGETIC,
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.FLYING],
      Rarity.RARE,
      Pkm.TOGEKISS,
      150,
      11,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      2,
      70,
      Ability.WISH,
      shiny,
      emotion,
      false
    )
  }
}

export class Togekiss extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TOGEKISS,
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      260,
      25,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      3,
      70,
      Ability.WISH,
      shiny,
      emotion,
      true
    )
  }
}

export class Rhyhorn extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RHYHORN,
      [Synergy.GROUND, Synergy.MONSTER, Synergy.ROCK],
      Rarity.RARE,
      Pkm.RHYDON,
      80,
      5,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.STOMP,
      shiny,
      emotion,
      false
    )
  }
}

export class Rhydon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RHYDON,
      [Synergy.GROUND, Synergy.MONSTER, Synergy.ROCK],
      Rarity.RARE,
      Pkm.RHYPERIOR,
      130,
      9,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.STOMP,
      shiny,
      emotion,
      false
    )
  }
}

export class Rhyperior extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RHYPERIOR,
      [Synergy.GROUND, Synergy.MONSTER, Synergy.ROCK],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      20,
      8,
      8,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      100,
      Ability.STOMP,
      shiny,
      emotion,
      true
    )
  }
}

export class Aron extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARON,
      [Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK],
      Rarity.COMMON,
      Pkm.LAIRON,
      60,
      4,
      2,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.STOMP,
      shiny,
      emotion,
      false
    )
  }
}

export class Lairon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LAIRON,
      [Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK],
      Rarity.COMMON,
      Pkm.AGGRON,
      100,
      8,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.STOMP,
      shiny,
      emotion,
      false
    )
  }
}

export class Aggron extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AGGRON,
      [Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK],
      Rarity.COMMON,
      Pkm.DEFAULT,
      170,
      16,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      100,
      Ability.STOMP,
      shiny,
      emotion,
      true
    )
  }
}

export class Whismur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WHISMUR,
      [Synergy.NORMAL, Synergy.SOUND],
      Rarity.RARE,
      Pkm.LOUDRED,
      90,
      6,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      90,
      Ability.ECHO,
      shiny,
      emotion,
      false
    )
  }
}
export class Loudred extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LOUDRED,
      [Synergy.NORMAL, Synergy.SOUND],
      Rarity.RARE,
      Pkm.EXPLOUD,
      150,
      14,
      2,
      2,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      90,
      Ability.ECHO,
      shiny,
      emotion,
      false
    )
  }
}

export class Exploud extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.EXPLOUD,
      [Synergy.NORMAL, Synergy.SOUND],
      Rarity.RARE,
      Pkm.DEFAULT,
      300,
      24,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      3,
      90,
      Ability.ECHO,
      shiny,
      emotion,
      true
    )
  }
}

export class Swinub extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SWINUB,
      [Synergy.GROUND, Synergy.ICE, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.PILOSWINE,
      60,
      4,
      2,
      2,
      1,
      AttackSprite.ICE_MELEE,
      1,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Piloswine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PILOSWINE,
      [Synergy.GROUND, Synergy.ICE, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.MAMOSWINE,
      110,
      8,
      4,
      4,
      1,
      AttackSprite.ICE_MELEE,
      2,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Mamoswine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAMOSWINE,
      [Synergy.GROUND, Synergy.ICE, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.DEFAULT,
      180,
      14,
      6,
      6,
      1,
      AttackSprite.ICE_MELEE,
      3,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Snover extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SNOVER,
      [Synergy.GRASS, Synergy.ICE],
      Rarity.ULTRA,
      Pkm.ABOMASNOW,
      130,
      12,
      6,
      6,
      1,
      AttackSprite.ICE_MELEE,
      1,
      100,
      Ability.BLIZZARD,
      shiny,
      emotion,
      false
    )
  }
}

export class Abomasnow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ABOMASNOW,
      [Synergy.GRASS, Synergy.ICE, Synergy.MONSTER],
      Rarity.ULTRA,
      Pkm.MEGA_ABOMASNOW,
      260,
      24,
      8,
      8,
      1,
      AttackSprite.ICE_MELEE,
      2,
      100,
      Ability.BLIZZARD,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaAbomasnow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_ABOMASNOW,
      [Synergy.GRASS, Synergy.ICE, Synergy.MONSTER],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      400,
      35,
      10,
      10,
      1,
      AttackSprite.ICE_MELEE,
      3,
      100,
      Ability.BLIZZARD,
      shiny,
      emotion,
      true
    )
  }
}

export class Snorunt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SNORUNT,
      [Synergy.GHOST, Synergy.ICE],
      Rarity.EPIC,
      Pkm.GLALIE,
      90,
      8,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      1,
      100,
      Ability.ICY_WIND,
      shiny,
      emotion,
      false
    )
  }
}

export class Glalie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GLALIE,
      [Synergy.GHOST, Synergy.ICE],
      Rarity.EPIC,
      Pkm.FROSLASS,
      170,
      17,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      2,
      100,
      Ability.ICY_WIND,
      shiny,
      emotion,
      false
    )
  }
}

export class Froslass extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FROSLASS,
      [Synergy.GHOST, Synergy.ICE],
      Rarity.EPIC,
      Pkm.DEFAULT,
      350,
      28,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      3,
      100,
      Ability.ICY_WIND,
      shiny,
      emotion,
      true
    )
  }
}

export class Vanillite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VANILLITE,
      [Synergy.FAIRY, Synergy.ICE, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.VANILLISH,
      70,
      5,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      1,
      100,
      Ability.SLEEP,
      shiny,
      emotion,
      false
    )
  }
}

export class Vanillish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VANILLISH,
      [Synergy.FAIRY, Synergy.ICE, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.VANILLUXE,
      130,
      9,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      2,
      100,
      Ability.SLEEP,
      shiny,
      emotion,
      false
    )
  }
}

export class Vanilluxe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VANILLUXE,
      [Synergy.FAIRY, Synergy.ICE, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.DEFAULT,
      230,
      21,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      3,
      100,
      Ability.SLEEP,
      shiny,
      emotion,
      true
    )
  }
}

export class Trapinch extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TRAPINCH,
      [Synergy.BUG, Synergy.GROUND],
      Rarity.RARE,
      Pkm.VIBRAVA,
      80,
      8,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      100,
      Ability.DRAGON_TAIL,
      shiny,
      emotion,
      false
    )
  }
}

export class Vibrava extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VIBRAVA,
      [Synergy.DRAGON, Synergy.BUG, Synergy.GROUND],
      Rarity.RARE,
      Pkm.FLYGON,
      120,
      13,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      100,
      Ability.DRAGON_TAIL,
      shiny,
      emotion,
      false
    )
  }
}

export class Flygon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FLYGON,
      [Synergy.DRAGON, Synergy.BUG, Synergy.GROUND],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      26,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.DRAGON_TAIL,
      shiny,
      emotion,
      true
    )
  }
}

export class Pichu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PICHU,
      [Synergy.ELECTRIC, Synergy.FAIRY, Synergy.BABY],
      Rarity.COMMON,
      Pkm.PIKACHU,
      60,
      5,
      1,
      1,
      1,
      AttackSprite.ELECTRIC_MELEE,
      1,
      140,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      false
    )
  }
}

export class Pikachu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PIKACHU,
      [Synergy.ELECTRIC, Synergy.FAIRY],
      Rarity.COMMON,
      Pkm.RAICHU,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.ELECTRIC_MELEE,
      2,
      140,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      false
    )
  }
}

export class Raichu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RAICHU,
      [Synergy.ELECTRIC, Synergy.FAIRY],
      Rarity.COMMON,
      Pkm.ALOLAN_RAICHU,
      220,
      18,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      3,
      140,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      false,
      false,
      Passive.RAICHU
    )
  }
}

export class AlolanRaichu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_RAICHU,
      [Synergy.ELECTRIC, Synergy.FAIRY, Synergy.PSYCHIC],
      Rarity.COMMON,
      Pkm.DEFAULT,
      230,
      20,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      4,
      100,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      true,
      false,
      Passive.SURGE_SURFER
    )
  }
}

export class Bulbasaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BULBASAUR,
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.RARE,
      Pkm.IVYSAUR,
      80,
      5,
      2,
      2,
      2,
      AttackSprite.GRASS_RANGE,
      1,
      65,
      Ability.MAGICAL_LEAF,
      shiny,
      emotion,
      false
    )
  }
}

export class Ivysaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.IVYSAUR,
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.RARE,
      Pkm.VENUSAUR,
      130,
      10,
      4,
      4,
      2,
      AttackSprite.GRASS_RANGE,
      2,
      65,
      Ability.MAGICAL_LEAF,
      shiny,
      emotion,
      false
    )
  }
}

export class Venusaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VENUSAUR,
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.RARE,
      Pkm.DEFAULT,
      240,
      18,
      6,
      6,
      2,
      AttackSprite.GRASS_RANGE,
      3,
      65,
      Ability.MAGICAL_LEAF,
      shiny,
      emotion,
      true
    )
  }
}

export class Igglybuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.IGGLYBUFF,
      [Synergy.BABY, Synergy.SOUND, Synergy.NORMAL],
      Rarity.UNCOMMON,
      Pkm.JIGGLYPUFF,
      65,
      5,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      1,
      90,
      Ability.SLEEP,
      shiny,
      emotion,
      false
    )
  }
}

export class Jigglypuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.JIGGLYPUFF,
      [Synergy.FAIRY, Synergy.SOUND, Synergy.NORMAL],
      Rarity.UNCOMMON,
      Pkm.WIGGLYTUFF,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      2,
      90,
      Ability.SLEEP,
      shiny,
      emotion,
      false
    )
  }
}

export class Wigglytuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WIGGLYTUFF,
      [Synergy.FAIRY, Synergy.SOUND, Synergy.NORMAL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      18,
      2,
      2,
      2,
      AttackSprite.FAIRY_RANGE,
      3,
      90,
      Ability.SLEEP,
      shiny,
      emotion,
      true
    )
  }
}

export class Duskull extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DUSKULL,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.UNCOMMON,
      Pkm.DUSCLOPS,
      70,
      6,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      1,
      100,
      Ability.NIGHT_SLASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Dusclops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DUSCLOPS,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.UNCOMMON,
      Pkm.DUSKNOIR,
      150,
      11,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      2,
      100,
      Ability.NIGHT_SLASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Dusknoir extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DUSKNOIR,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      240,
      24,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      3,
      100,
      Ability.NIGHT_SLASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Magnemite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGNEMITE,
      [Synergy.ELECTRIC, Synergy.STEEL],
      Rarity.UNCOMMON,
      Pkm.MAGNETON,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      1,
      100,
      Ability.TORMENT,
      shiny,
      emotion,
      false
    )
  }
}

export class Magneton extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGNETON,
      [Synergy.ELECTRIC, Synergy.STEEL],
      Rarity.UNCOMMON,
      Pkm.MAGNEZONE,
      150,
      9,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      2,
      100,
      Ability.TORMENT,
      shiny,
      emotion,
      false
    )
  }
}

export class Magnezone extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGNEZONE,
      [Synergy.ELECTRIC, Synergy.STEEL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      250,
      20,
      2,
      2,
      2,
      AttackSprite.ELECTRIC_RANGE,
      3,
      100,
      Ability.TORMENT,
      shiny,
      emotion,
      true
    )
  }
}

export class Horsea extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HORSEA,
      [Synergy.DRAGON, Synergy.WATER],
      Rarity.UNCOMMON,
      Pkm.SEADRA,
      70,
      6,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      1,
      100,
      Ability.WHIRLPOOL,
      shiny,
      emotion,
      false
    )
  }
}

export class Seadra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SEADRA,
      [Synergy.DRAGON, Synergy.WATER],
      Rarity.UNCOMMON,
      Pkm.KINGDRA,
      140,
      12,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      2,
      100,
      Ability.WHIRLPOOL,
      shiny,
      emotion,
      false
    )
  }
}

export class Kingdra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KINGDRA,
      [Synergy.DRAGON, Synergy.WATER],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      250,
      22,
      2,
      2,
      2,
      AttackSprite.WATER_RANGE,
      3,
      100,
      Ability.WHIRLPOOL,
      shiny,
      emotion,
      true
    )
  }
}

export class Flabebe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FLABEBE,
      [Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.FLOETTE,
      60,
      5,
      1,
      1,
      3,
      AttackSprite.PSYCHIC_RANGE,
      1,
      90,
      Ability.DISARMING_VOICE,
      shiny,
      emotion,
      false
    )
  }
}

export class Floette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FLOETTE,
      [Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.FLORGES,
      120,
      9,
      1,
      1,
      3,
      AttackSprite.PSYCHIC_RANGE,
      2,
      90,
      Ability.DISARMING_VOICE,
      shiny,
      emotion,
      false
    )
  }
}
export class Florges extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FLORGES,
      [Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      90,
      Ability.DISARMING_VOICE,
      shiny,
      emotion,
      true
    )
  }
}

export class Chikorita extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHIKORITA,
      [Synergy.GRASS, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.BAYLEEF,
      70,
      6,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      1,
      90,
      Ability.STUN_SPORE,
      shiny,
      emotion,
      false
    )
  }
}

export class Bayleef extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BAYLEEF,
      [Synergy.GRASS, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.MEGANIUM,
      140,
      12,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      2,
      90,
      Ability.STUN_SPORE,
      shiny,
      emotion,
      false
    )
  }
}

export class Meganium extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGANIUM,
      [Synergy.GRASS, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      250,
      27,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      3,
      90,
      Ability.STUN_SPORE,
      shiny,
      emotion,
      true
    )
  }
}

export class Sandile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SANDILE,
      [Synergy.GROUND, Synergy.DARK, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.KROKOROK,
      70,
      5,
      3,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Krookorok extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KROKOROK,
      [Synergy.GROUND, Synergy.DARK, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.KROOKODILE,
      120,
      9,
      3,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Krookodile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KROOKODILE,
      [Synergy.GROUND, Synergy.DARK, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      3,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Venipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VENIPEDE,
      [Synergy.BUG, Synergy.POISON],
      Rarity.UNCOMMON,
      Pkm.WHIRLIPEDE,
      70,
      5,
      3,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Whirlipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WHIRLIPEDE,
      [Synergy.BUG, Synergy.POISON],
      Rarity.UNCOMMON,
      Pkm.SCOLIPEDE,
      120,
      9,
      3,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Scolipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SCOLIPEDE,
      [Synergy.BUG, Synergy.POISON],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Spheal extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SPHEAL,
      [Synergy.AQUATIC, Synergy.ICE],
      Rarity.UNCOMMON,
      Pkm.SEALEO,
      70,
      6,
      3,
      2,
      1,
      AttackSprite.ICE_MELEE,
      1,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Sealeo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SEALEO,
      [Synergy.AQUATIC, Synergy.ICE],
      Rarity.UNCOMMON,
      Pkm.WALREIN,
      140,
      12,
      3,
      2,
      1,
      AttackSprite.ICE_MELEE,
      2,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Walrein extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WALREIN,
      [Synergy.AQUATIC, Synergy.ICE],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      260,
      24,
      3,
      3,
      1,
      AttackSprite.ICE_MELEE,
      3,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      true
    )
  }
}

export class NidoranF extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NIDORANF,
      [Synergy.POISON, Synergy.FIELD, Synergy.GROUND],
      Rarity.UNCOMMON,
      Pkm.NIDORINA,
      70,
      5,
      2,
      2,
      1,
      AttackSprite.POISON_MELEE,
      1,
      90,
      Ability.VENOSHOCK,
      shiny,
      emotion,
      false
    )
  }
}

export class Nidorina extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NIDORINA,
      [Synergy.POISON, Synergy.FIELD, Synergy.GROUND],
      Rarity.UNCOMMON,
      Pkm.NIDOQUEEN,
      130,
      10,
      3,
      3,
      1,
      AttackSprite.POISON_MELEE,
      2,
      90,
      Ability.VENOSHOCK,
      shiny,
      emotion,
      false
    )
  }
}

export class Nidoqueen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NIDOQUEEN,
      [Synergy.POISON, Synergy.FIELD, Synergy.GROUND],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      230,
      21,
      4,
      4,
      1,
      AttackSprite.POISON_MELEE,
      3,
      90,
      Ability.VENOSHOCK,
      shiny,
      emotion,
      true
    )
  }
}

export class NidoranM extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NIDORANM,
      [Synergy.POISON, Synergy.FIELD, Synergy.GROUND],
      Rarity.UNCOMMON,
      Pkm.NIDORINO,
      70,
      5,
      2,
      2,
      1,
      AttackSprite.POISON_MELEE,
      1,
      90,
      Ability.POISON,
      shiny,
      emotion,
      false
    )
  }
}

export class Nidorino extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NIDORINO,
      [Synergy.POISON, Synergy.FIELD, Synergy.GROUND],
      Rarity.UNCOMMON,
      Pkm.NIDOKING,
      140,
      10,
      2,
      2,
      1,
      AttackSprite.POISON_MELEE,
      2,
      90,
      Ability.POISON,
      shiny,
      emotion,
      false
    )
  }
}

export class Nidoking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NIDOKING,
      [Synergy.POISON, Synergy.FIELD, Synergy.GROUND],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      250,
      21,
      3,
      3,
      1,
      AttackSprite.POISON_MELEE,
      3,
      90,
      Ability.POISON,
      shiny,
      emotion,
      true
    )
  }
}

export class Machop extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MACHOP,
      [Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.UNCOMMON,
      Pkm.MACHOKE,
      70,
      6,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      1,
      100,
      Ability.GUILLOTINE,
      shiny,
      emotion,
      false
    )
  }
}

export class Machoke extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MACHOKE,
      [Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.UNCOMMON,
      Pkm.MACHAMP,
      130,
      12,
      4,
      4,
      1,
      AttackSprite.FIGHTING_MELEE,
      2,
      100,
      Ability.GUILLOTINE,
      shiny,
      emotion,
      false
    )
  }
}

export class Machamp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MACHAMP,
      [Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      220,
      22,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      100,
      Ability.GUILLOTINE,
      shiny,
      emotion,
      true
    )
  }
}

export class Piplup extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PIPLUP,
      [Synergy.WATER, Synergy.FLYING, Synergy.STEEL],
      Rarity.UNCOMMON,
      Pkm.PRINPLUP,
      60,
      5,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      1,
      100,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      false
    )
  }
}

export class Prinplup extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PRINPLUP,
      [Synergy.WATER, Synergy.FLYING, Synergy.STEEL],
      Rarity.UNCOMMON,
      Pkm.EMPOLEON,
      130,
      9,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      2,
      100,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      false
    )
  }
}

export class Empoleon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.EMPOLEON,
      [Synergy.WATER, Synergy.FLYING, Synergy.STEEL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      240,
      20,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      3,
      100,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      true
    )
  }
}

export class Chimchar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHIMCHAR,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.COMMON,
      Pkm.MONFERNO,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      1,
      100,
      Ability.TORMENT,
      shiny,
      emotion,
      false
    )
  }
}

export class Monferno extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MONFERNO,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.COMMON,
      Pkm.INFERNAPE,
      100,
      11,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      100,
      Ability.TORMENT,
      shiny,
      emotion,
      false
    )
  }
}

export class Infernape extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.INFERNAPE,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.COMMON,
      Pkm.DEFAULT,
      180,
      22,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      100,
      Ability.TORMENT,
      shiny,
      emotion,
      true
    )
  }
}

export class Mudkip extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MUDKIP,
      [Synergy.WATER, Synergy.GROUND],
      Rarity.COMMON,
      Pkm.MARSHTOMP,
      65,
      4,
      2,
      2,
      1,
      AttackSprite.WATER_MELEE,
      1,
      50,
      Ability.MUD_BUBBLE,
      shiny,
      emotion,
      false,
      false,
      Passive.WATER_SPRING
    )
  }
}

export class Marshtomp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MARSHTOMP,
      [Synergy.WATER, Synergy.GROUND],
      Rarity.COMMON,
      Pkm.SWAMPERT,
      130,
      8,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      2,
      50,
      Ability.MUD_BUBBLE,
      shiny,
      emotion,
      false,
      false,
      Passive.WATER_SPRING
    )
  }
}

export class Swampert extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SWAMPERT,
      [Synergy.WATER, Synergy.GROUND],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      18,
      5,
      5,
      1,
      AttackSprite.WATER_MELEE,
      3,
      50,
      Ability.MUD_BUBBLE,
      shiny,
      emotion,
      true,
      false,
      Passive.WATER_SPRING
    )
  }
}

export class Torchic extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TORCHIC,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.FLYING],
      Rarity.UNCOMMON,
      Pkm.COMBUSKEN,
      60,
      5,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      1,
      100,
      Ability.BLAZE_KICK,
      shiny,
      emotion,
      false
    )
  }
}

export class Combusken extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.COMBUSKEN,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.FLYING],
      Rarity.UNCOMMON,
      Pkm.BLAZIKEN,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      100,
      Ability.BLAZE_KICK,
      shiny,
      emotion,
      false
    )
  }
}

export class Blaziken extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BLAZIKEN,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.FLYING],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      100,
      Ability.BLAZE_KICK,
      shiny,
      emotion,
      true
    )
  }
}

export class Treecko extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TREECKO,
      [Synergy.GRASS, Synergy.MONSTER],
      Rarity.UNCOMMON,
      Pkm.GROVYLE,
      70,
      5,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      100,
      Ability.THIEF,
      shiny,
      emotion,
      false
    )
  }
}

export class Grovyle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GROVYLE,
      [Synergy.GRASS, Synergy.MONSTER],
      Rarity.UNCOMMON,
      Pkm.SCEPTILE,
      120,
      14,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      100,
      Ability.THIEF,
      shiny,
      emotion,
      false
    )
  }
}

export class Sceptile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SCEPTILE,
      [Synergy.GRASS, Synergy.MONSTER],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      27,
      5,
      5,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.THIEF,
      shiny,
      emotion,
      true
    )
  }
}

export class Cyndaquil extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CYNDAQUIL,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.QUILAVA,
      70,
      7,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      80,
      Ability.WHEEL_OF_FIRE,
      shiny,
      emotion,
      false
    )
  }
}

export class Quilava extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.QUILAVA,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.TYPHLOSION,
      130,
      13,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      80,
      Ability.WHEEL_OF_FIRE,
      shiny,
      emotion,
      false
    )
  }
}

export class Typhlosion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TYPHLOSION,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      250,
      25,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      3,
      80,
      Ability.WHEEL_OF_FIRE,
      shiny,
      emotion,
      true
    )
  }
}

export class Slowpoke extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SLOWPOKE,
      [Synergy.AQUATIC, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.SLOWBRO,
      75,
      6,
      2,
      2,
      1,
      AttackSprite.WATER_MELEE,
      1,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false,
      true,
      Passive.SLOWBRO
    )
  }
}

export class Slowbro extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SLOWBRO,
      [Synergy.AQUATIC, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.SLOWKING,
      130,
      13,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      2,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      true,
      true,
      Passive.SLOWBRO
    )
  }
}

export class Slowking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SLOWKING,
      [Synergy.AQUATIC, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      260,
      24,
      4,
      4,
      1,
      AttackSprite.WATER_MELEE,
      3,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Squirtle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SQUIRTLE,
      [Synergy.WATER, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.WARTORTLE,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      1,
      100,
      Ability.HYDRO_PUMP,
      shiny,
      emotion,
      false
    )
  }
}

export class Wartortle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WARTORTLE,
      [Synergy.WATER, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.BLASTOISE,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      2,
      100,
      Ability.HYDRO_PUMP,
      shiny,
      emotion,
      false
    )
  }
}

export class Blastoise extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BLASTOISE,
      [Synergy.WATER, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.DEFAULT,
      210,
      20,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      3,
      100,
      Ability.HYDRO_PUMP,
      shiny,
      emotion,
      true
    )
  }
}

export class Bellsprout extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BELLSPROUT,
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.WEEPINBELL,
      70,
      5,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      100,
      Ability.ROOT,
      shiny,
      emotion,
      false,
      true,
      Passive.BELLSPROUT
    )
  }
}

export class Weepinbell extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WEEPINBELL,
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.VICTREEBEL,
      140,
      9,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      100,
      Ability.ROOT,
      shiny,
      emotion,
      false,
      true,
      Passive.BELLSPROUT
    )
  }
}

export class Victreebel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VICTREEBEL,
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      240,
      20,
      4,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.ROOT,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Pikipek extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PIKIPEK,
      [Synergy.NORMAL, Synergy.FLYING, Synergy.SOUND],
      Rarity.UNCOMMON,
      Pkm.TRUMBEAK,
      70,
      5,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      70,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Trumbeak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TRUMBEAK,
      [Synergy.NORMAL, Synergy.FLYING, Synergy.SOUND],
      Rarity.UNCOMMON,
      Pkm.TOUCANNON,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      70,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Toucannon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TOUCANNON,
      [Synergy.NORMAL, Synergy.FLYING, Synergy.SOUND],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      70,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Geodude extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GEODUDE,
      [Synergy.GROUND, Synergy.ROCK],
      Rarity.COMMON,
      Pkm.GRAVELER,
      70,
      4,
      2,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.ROCK_SLIDE,
      shiny,
      emotion,
      false
    )
  }
}

export class Graveler extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GRAVELER,
      [Synergy.GROUND, Synergy.ROCK],
      Rarity.COMMON,
      Pkm.GOLEM,
      120,
      9,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.ROCK_SLIDE,
      shiny,
      emotion,
      false
    )
  }
}

export class Golem extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOLEM,
      [Synergy.GROUND, Synergy.ROCK],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      16,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      100,
      Ability.ROCK_SLIDE,
      shiny,
      emotion,
      true
    )
  }
}

export class Totodile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TOTODILE,
      [Synergy.WATER, Synergy.MONSTER, Synergy.AQUATIC],
      Rarity.RARE,
      Pkm.CROCONAW,
      75,
      7,
      2,
      2,
      1,
      AttackSprite.WATER_MELEE,
      1,
      90,
      Ability.WATERFALL,
      shiny,
      emotion,
      false
    )
  }
}

export class Croconaw extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CROCONAW,
      [Synergy.WATER, Synergy.MONSTER, Synergy.AQUATIC],
      Rarity.RARE,
      Pkm.FERALIGATR,
      130,
      15,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      2,
      90,
      Ability.WATERFALL,
      shiny,
      emotion,
      false
    )
  }
}

export class Feraligatr extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FERALIGATR,
      [Synergy.WATER, Synergy.MONSTER, Synergy.AQUATIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      240,
      28,
      5,
      5,
      1,
      AttackSprite.WATER_MELEE,
      3,
      90,
      Ability.WATERFALL,
      shiny,
      emotion,
      true
    )
  }
}

export class Azurill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AZURILL,
      [Synergy.WATER, Synergy.FAIRY, Synergy.BABY],
      Rarity.COMMON,
      Pkm.MARILL,
      50,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      1,
      100,
      Ability.PLAY_ROUGH,
      shiny,
      emotion,
      false
    )
  }
}

export class Marill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MARILL,
      [Synergy.WATER, Synergy.FAIRY],
      Rarity.COMMON,
      Pkm.AZUMARILL,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      2,
      100,
      Ability.PLAY_ROUGH,
      shiny,
      emotion,
      false
    )
  }
}

export class Azumarill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AZUMARILL,
      [Synergy.WATER, Synergy.FAIRY],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      20,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      3,
      100,
      Ability.PLAY_ROUGH,
      shiny,
      emotion,
      true
    )
  }
}

export class Zubat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZUBAT,
      [Synergy.POISON, Synergy.FLYING, Synergy.SOUND],
      Rarity.COMMON,
      Pkm.GOLBAT,
      50,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      90,
      Ability.LEECH_LIFE,
      shiny,
      emotion,
      false
    )
  }
}

export class Golbat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOLBAT,
      [Synergy.POISON, Synergy.FLYING, Synergy.SOUND],
      Rarity.COMMON,
      Pkm.CROBAT,
      100,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      90,
      Ability.LEECH_LIFE,
      shiny,
      emotion,
      false
    )
  }
}

export class Crobat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CROBAT,
      [Synergy.POISON, Synergy.FLYING, Synergy.SOUND],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      18,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      3,
      90,
      Ability.LEECH_LIFE,
      shiny,
      emotion,
      true
    )
  }
}

export class Mareep extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAREEP,
      [Synergy.ELECTRIC, Synergy.FIELD, Synergy.LIGHT],
      Rarity.COMMON,
      Pkm.FLAFFY,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      1,
      110,
      Ability.THUNDER,
      shiny,
      emotion,
      false
    )
  }
}

export class Flaffy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FLAFFY,
      [Synergy.ELECTRIC, Synergy.FIELD, Synergy.LIGHT],
      Rarity.COMMON,
      Pkm.AMPHAROS,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      2,
      110,
      Ability.THUNDER,
      shiny,
      emotion,
      false
    )
  }
}

export class Ampharos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AMPHAROS,
      [Synergy.ELECTRIC, Synergy.FIELD, Synergy.LIGHT],
      Rarity.COMMON,
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      3,
      110,
      Ability.THUNDER,
      shiny,
      emotion,
      true
    )
  }
}

export class Cleffa extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLEFFA,
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.BABY],
      Rarity.UNCOMMON,
      Pkm.CLEFAIRY,
      70,
      5,
      1,
      1,
      1,
      AttackSprite.FAIRY_MELEE,
      1,
      100,
      Ability.METRONOME,
      shiny,
      emotion,
      false,
      true,
      Passive.CLEFAIRY
    )
  }
}

export class Clefairy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLEFAIRY,
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.LIGHT],
      Rarity.UNCOMMON,
      Pkm.CLEFABLE,
      150,
      11,
      3,
      3,
      1,
      AttackSprite.FAIRY_MELEE,
      2,
      100,
      Ability.METRONOME,
      shiny,
      emotion,
      true,
      true,
      Passive.CLEFAIRY
    )
  }
}

export class Clefable extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLEFABLE,
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.LIGHT],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      220,
      18,
      4,
      4,
      1,
      AttackSprite.FAIRY_MELEE,
      3,
      100,
      Ability.METRONOME,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Caterpie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CATERPIE,
      [Synergy.GRASS, Synergy.BUG],
      Rarity.COMMON,
      Pkm.METAPOD,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.POISON_RANGE,
      1,
      100,
      Ability.STRING_SHOT,
      shiny,
      emotion,
      false
    )
  }
}

export class Metapod extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.METAPOD,
      [Synergy.GRASS, Synergy.BUG],
      Rarity.COMMON,
      Pkm.BUTTERFREE,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.POISON_RANGE,
      2,
      100,
      Ability.STRING_SHOT,
      shiny,
      emotion,
      false
    )
  }
}

export class Butterfree extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BUTTERFREE,
      [Synergy.GRASS, Synergy.BUG, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      16,
      1,
      1,
      2,
      AttackSprite.POISON_RANGE,
      3,
      100,
      Ability.STRING_SHOT,
      shiny,
      emotion,
      true
    )
  }
}

export class Weedle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WEEDLE,
      [Synergy.POISON, Synergy.BUG],
      Rarity.COMMON,
      Pkm.KAKUNA,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.BUG_MELEE,
      1,
      100,
      Ability.BUG_BUZZ,
      shiny,
      emotion,
      false
    )
  }
}

export class Kakuna extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KAKUNA,
      [Synergy.POISON, Synergy.BUG],
      Rarity.COMMON,
      Pkm.BEEDRILL,
      110,
      10,
      2,
      2,
      1,
      AttackSprite.BUG_MELEE,
      2,
      100,
      Ability.BUG_BUZZ,
      shiny,
      emotion,
      false
    )
  }
}

export class Beedrill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BEEDRILL,
      [Synergy.POISON, Synergy.BUG, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      18,
      2,
      2,
      1,
      AttackSprite.BUG_MELEE,
      3,
      100,
      Ability.BUG_BUZZ,
      shiny,
      emotion,
      true
    )
  }
}

export class Pidgey extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PIDGEY,
      [Synergy.NORMAL, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.PIDGEOTTO,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      1,
      100,
      Ability.HURRICANE,
      shiny,
      emotion,
      false
    )
  }
}

export class Pidgeotto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PIDGEOTTO,
      [Synergy.NORMAL, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.PIDGEOT,
      110,
      9,
      2,
      2,
      2,
      AttackSprite.FLYING_RANGE,
      2,
      100,
      Ability.HURRICANE,
      shiny,
      emotion,
      false
    )
  }
}

export class Pidgeot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PIDGEOT,
      [Synergy.NORMAL, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      18,
      3,
      3,
      2,
      AttackSprite.FLYING_RANGE,
      3,
      100,
      Ability.HURRICANE,
      shiny,
      emotion,
      true
    )
  }
}

export class Hoppip extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HOPPIP,
      [Synergy.FLYING, Synergy.FLORA, Synergy.GRASS],
      Rarity.COMMON,
      Pkm.SKIPLOOM,
      50,
      5,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      1,
      100,
      Ability.ACROBATICS,
      shiny,
      emotion,
      false
    )
  }
}

export class Skiploom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SKIPLOOM,
      [Synergy.FLYING, Synergy.FLORA, Synergy.GRASS],
      Rarity.COMMON,
      Pkm.JUMPLUFF,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      2,
      100,
      Ability.ACROBATICS,
      shiny,
      emotion,
      false
    )
  }
}

export class Jumpluff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.JUMPLUFF,
      [Synergy.FLYING, Synergy.FLORA, Synergy.GRASS],
      Rarity.COMMON,
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      3,
      100,
      Ability.ACROBATICS,
      shiny,
      emotion,
      true
    )
  }
}

export class Seedot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SEEDOT,
      [Synergy.GRASS, Synergy.DARK],
      Rarity.COMMON,
      Pkm.NUZLEAF,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      100,
      Ability.PAYBACK,
      shiny,
      emotion,
      false
    )
  }
}

export class Nuzleaf extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NUZLEAF,
      [Synergy.GRASS, Synergy.DARK],
      Rarity.COMMON,
      Pkm.SHIFTRY,
      120,
      9,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      100,
      Ability.PAYBACK,
      shiny,
      emotion,
      false
    )
  }
}

export class Shiftry extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHIFTRY,
      [Synergy.GRASS, Synergy.DARK],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.PAYBACK,
      shiny,
      emotion,
      true
    )
  }
}

export class Charmander extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHARMANDER,
      [Synergy.DRAGON, Synergy.FIRE],
      Rarity.COMMON,
      Pkm.CHARMELEON,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      1,
      100,
      Ability.BLAST_BURN,
      shiny,
      emotion,
      false
    )
  }
}

export class Charmeleon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHARMELEON,
      [Synergy.DRAGON, Synergy.FIRE],
      Rarity.COMMON,
      Pkm.CHARIZARD,
      120,
      9,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      100,
      Ability.BLAST_BURN,
      shiny,
      emotion,
      false
    )
  }
}

export class Charizard extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHARIZARD,
      [Synergy.DRAGON, Synergy.FIRE, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.DEFAULT,
      220,
      20,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      100,
      Ability.BLAST_BURN,
      shiny,
      emotion,
      true
    )
  }
}

export class Magikarp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGIKARP,
      [Synergy.WATER],
      Rarity.SPECIAL,
      Pkm.GYARADOS,
      30,
      1,
      1,
      1,
      1,
      AttackSprite.WATER_MELEE,
      1,
      50,
      Ability.SPLASH,
      shiny,
      emotion,
      false,
      false,
      Passive.MAGIKARP
    )
  }
}

export class Gyarados extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GYARADOS,
      [Synergy.DRAGON, Synergy.WATER, Synergy.FLYING],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      1,
      1,
      AttackSprite.WATER_MELEE,
      3,
      100,
      Ability.HYDRO_PUMP,
      shiny,
      emotion,
      true
    )
  }
}

export class Rattata extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RATTATA,
      [Synergy.NORMAL],
      Rarity.SPECIAL,
      Pkm.RATICATE,
      30,
      4,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.AGILITY,
      shiny,
      emotion,
      false
    )
  }
}

export class Raticate extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RATICATE,
      [Synergy.NORMAL],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      60,
      6,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      100,
      Ability.AGILITY,
      shiny,
      emotion,
      true
    )
  }
}

export class Spearow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SPEAROW,
      [Synergy.FLYING, Synergy.NORMAL],
      Rarity.SPECIAL,
      Pkm.FEAROW,
      30,
      4,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.PECK,
      shiny,
      emotion,
      false
    )
  }
}

export class Fearow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FEAROW,
      [Synergy.FLYING, Synergy.NORMAL],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      60,
      6,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      100,
      Ability.PECK,
      shiny,
      emotion,
      true
    )
  }
}

export class Meloetta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MELOETTA,
      [Synergy.NORMAL, Synergy.SOUND],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      250,
      25,
      5,
      5,
      4,
      AttackSprite.PSYCHIC_RANGE,
      3,
      60,
      Ability.RELIC_SONG,
      shiny,
      emotion,
      true
    )
  }
}

export class PirouetteMeloetta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PIROUETTE_MELOETTA,
      [Synergy.NORMAL, Synergy.SOUND],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      4,
      AttackSprite.PSYCHIC_RANGE,
      3,
      120,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Lugia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LUGIA,
      [Synergy.AQUATIC, Synergy.FLYING, Synergy.PSYCHIC],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      6,
      6,
      1,
      AttackSprite.FLYING_MELEE,
      3,
      60,
      Ability.SKY_ATTACK,
      shiny,
      emotion,
      true,
      false,
      Passive.WINDY
    )
  }
}

export class Hoopa extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HOOPA,
      [Synergy.DRAGON, Synergy.GHOST],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      2,
      AttackSprite.GHOST_RANGE,
      3,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class HoopaUnbound extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HOOPA_UNBOUND,
      [Synergy.DRAGON, Synergy.GHOST],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      2,
      AttackSprite.GHOST_RANGE,
      3,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Giratina extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GIRATINA,
      [Synergy.DRAGON, Synergy.GHOST],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      250,
      35,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      40,
      Ability.SHADOW_SNEAK,
      shiny,
      emotion,
      true,
      false,
      Passive.GIRATINA
    )
  }

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
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ORIGIN_GIRATINA,
      [Synergy.DRAGON, Synergy.GHOST, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      200,
      35,
      2,
      2,
      2,
      AttackSprite.GHOST_RANGE,
      3,
      40,
      Ability.SHADOW_SNEAK,
      shiny,
      emotion,
      true,
      false,
      Passive.GIRATINA
    )
  }

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
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZAPDOS,
      [Synergy.ELECTRIC, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      3,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      3,
      80,
      Ability.CHARGE,
      shiny,
      emotion,
      true,
      false,
      Passive.STORM
    )
  }
}

export class Zeraora extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZERAORA,
      [Synergy.ELECTRIC, Synergy.FIGHTING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      3,
      90,
      Ability.PLASMA_FIST,
      shiny,
      emotion,
      true
    )
  }
}

export class Miltank extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MILTANK,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      250,
      15,
      5,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      100,
      Ability.ROLLOUT,
      shiny,
      emotion,
      true
    )
  }
}

export class Yveltal extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.YVELTAL,
      [Synergy.DARK, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      25,
      6,
      6,
      1,
      AttackSprite.FLYING_MELEE,
      3,
      100,
      Ability.DEATH_WING,
      shiny,
      emotion,
      true
    )
  }
}

export class Moltres extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MOLTRES,
      [Synergy.FIRE, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      3,
      100,
      Ability.OVERHEAT,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Pinsir extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PINSIR,
      [Synergy.BUG, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      190,
      25,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      85,
      Ability.GUILLOTINE,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Articuno extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARTICUNO,
      [Synergy.ICE, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      3,
      3,
      2,
      AttackSprite.FLYING_RANGE,
      3,
      120,
      Ability.BLIZZARD,
      shiny,
      emotion,
      true,
      false,
      Passive.SNOW
    )
  }
}

export class Dialga extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DIALGA,
      [Synergy.DRAGON, Synergy.STEEL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      25,
      5,
      5,
      1,
      AttackSprite.FIRE_RANGE,
      3,
      150,
      Ability.ROAR_OF_TIME,
      shiny,
      emotion,
      true
    )
  }
}

export class Palkia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PALKIA,
      [Synergy.DRAGON, Synergy.WATER],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      25,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      150,
      Ability.ROAR_OF_TIME,
      shiny,
      emotion,
      true
    )
  }
}

export class Melmetal extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MELMETAL,
      [Synergy.STEEL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      150,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Suicune extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SUICUNE,
      [Synergy.WATER, Synergy.ICE, Synergy.FIELD],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.WATER_MELEE,
      3,
      100,
      Ability.AQUA_JET,
      shiny,
      emotion,
      true
    )
  }
}

export class Raikou extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RAIKOU,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      3,
      130,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      true
    )
  }
}

export class Entei extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ENTEI,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      130,
      Ability.FLAME_CHARGE,
      shiny,
      emotion,
      false
    )
  }
}

export class Regice extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REGICE,
      [Synergy.ICE, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      6,
      10,
      1,
      AttackSprite.ICE_MELEE,
      3,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Seviper extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SEVIPER,
      [Synergy.POISON, Synergy.MONSTER],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      180,
      22,
      4,
      2,
      1,
      AttackSprite.POISON_MELEE,
      3,
      75,
      Ability.VENOSHOCK,
      shiny,
      emotion,
      true
    )
  }
}

export class Lunatone extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LUNATONE,
      [Synergy.ROCK, Synergy.PSYCHIC, Synergy.DARK],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      2,
      AttackSprite.PSYCHIC_RANGE,
      3,
      90,
      Ability.COSMIC_POWER,
      shiny,
      emotion,
      true,
      false,
      Passive.NIGHT
    )
  }
}

export class Solrock extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SOLROCK,
      [Synergy.ROCK, Synergy.FIRE, Synergy.LIGHT],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      2,
      AttackSprite.PSYCHIC_RANGE,
      3,
      90,
      Ability.COSMIC_POWER,
      shiny,
      emotion,
      true,
      false,
      Passive.SUN
    )
  }
}

export class Regirock extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REGIROCK,
      [Synergy.ROCK, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      10,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      100,
      Ability.STEALTH_ROCKS,
      shiny,
      emotion,
      true
    )
  }
}

export class Tauros extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TAUROS,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      7,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      100,
      Ability.HEAD_SMASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Heracross extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HERACROSS,
      [Synergy.BUG, Synergy.FIGHTING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      190,
      22,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      100,
      Ability.CLOSE_COMBAT,
      shiny,
      emotion,
      true,
      false,
      Passive.GUTS
    )
  }
}

export class Registeel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REGISTEEL,
      [Synergy.STEEL, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      25,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.IRON_DEFENSE,
      shiny,
      emotion,
      true
    )
  }
}

export class Regigigas extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REGIGIGAS,
      [Synergy.NORMAL, Synergy.MONSTER, Synergy.HUMAN],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      true
    )
  }
}

export class Kyogre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KYOGRE,
      [Synergy.WATER, Synergy.MONSTER],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      20,
      3,
      3,
      3,
      AttackSprite.WATER_RANGE,
      3,
      100,
      Ability.ORIGIN_PULSE,
      shiny,
      emotion,
      true,
      false,
      Passive.PRIMAL
    )
  }
}

export class Groudon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GROUDON,
      [Synergy.GROUND, Synergy.FIRE],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      100,
      Ability.EARTHQUAKE,
      shiny,
      emotion,
      true,
      false,
      Passive.PRIMAL
    )
  }
}

export class Rayquaza extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RAYQUAZA,
      [Synergy.DRAGON, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.DRACO_METEOR,
      shiny,
      emotion,
      true,
      false,
      Passive.PRIMAL
    )
  }
}

export class Eevee extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.EEVEE,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      90,
      5,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      false,
      false,
      Passive.EEVEE
    )
  }
}

export class Vaporeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VAPOREON,
      [Synergy.WATER, Synergy.FIELD, Synergy.AQUATIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      1,
      1,
      1,
      AttackSprite.WATER_MELEE,
      2,
      100,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      true
    )
  }
}

export class Jolteon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.JOLTEON,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      1,
      1,
      1,
      AttackSprite.ELECTRIC_MELEE,
      2,
      100,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      true
    )
  }
}

export class Flareon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FLAREON,
      [Synergy.FIRE, Synergy.FIELD, Synergy.LIGHT],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      3,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      80,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      true
    )
  }
}

export class Espeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ESPEON,
      [Synergy.PSYCHIC, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      80,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      true
    )
  }
}

export class Umbreon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UMBREON,
      [Synergy.DARK, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      3,
      2,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      80,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      true
    )
  }
}

export class Leafeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LEAFEON,
      [Synergy.GRASS, Synergy.FLORA, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      3,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      80,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      true
    )
  }
}

export class Sylveon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SYLVEON,
      [Synergy.FAIRY, Synergy.FIELD, Synergy.SOUND],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      2,
      80,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      true
    )
  }
}

export class Glaceon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GLACEON,
      [Synergy.ICE, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      1,
      1,
      2,
      AttackSprite.ICE_RANGE,
      2,
      80,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      true
    )
  }
}

export class Volcanion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VOLCANION,
      [Synergy.FIRE, Synergy.WATER, Synergy.AQUATIC],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      20,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      3,
      90,
      Ability.STEAM_ERUPTION,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Darkrai extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DARKRAI,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      2,
      2,
      2,
      AttackSprite.GHOST_RANGE,
      3,
      120,
      Ability.DARK_VOID,
      shiny,
      emotion,
      true
    )
  }
}

export class Larvesta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LARVESTA,
      [Synergy.FIRE, Synergy.BUG],
      Rarity.EPIC,
      Pkm.VOLCARONA,
      100,
      10,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.FIRE_BLAST,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Volcarona extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VOLCARONA,
      [Synergy.FIRE, Synergy.BUG],
      Rarity.EPIC,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      2,
      100,
      Ability.FIRE_BLAST,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Chatot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHATOT,
      [Synergy.FLYING, Synergy.SOUND],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      100,
      Ability.CHATTER,
      shiny,
      emotion,
      true
    )
  }
}

export class Farfetchd extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FARFETCH_D,
      [Synergy.FLYING, Synergy.NORMAL],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      60,
      Ability.RAZOR_WIND,
      shiny,
      emotion,
      true
    )
  }
}

export class Kecleon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KECLEON,
      [],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      80,
      Ability.ILLUSION,
      shiny,
      emotion,
      false,
      false,
      Passive.PROTEAN2
    )
  }
}

export class Castform extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASTFORM,
      [Synergy.NORMAL, Synergy.ARTIFICIAL],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      180,
      18,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      3,
      80,
      Ability.FORECAST,
      shiny,
      emotion,
      false,
      false,
      Passive.CASTFORM
    )
  }
}

export class CastformSun extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASTFORM_SUN,
      [Synergy.NORMAL, Synergy.ARTIFICIAL, Synergy.FIRE],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      180,
      18,
      3,
      3,
      2,
      AttackSprite.DRAGON_RANGE,
      3,
      80,
      Ability.FORECAST,
      shiny,
      emotion,
      true,
      false,
      Passive.CASTFORM
    )
  }
}

export class CastformRain extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASTFORM_RAIN,
      [Synergy.NORMAL, Synergy.ARTIFICIAL, Synergy.WATER],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      180,
      18,
      3,
      3,
      2,
      AttackSprite.WATER_RANGE,
      3,
      80,
      Ability.FORECAST,
      shiny,
      emotion,
      true,
      false,
      Passive.CASTFORM
    )
  }
}

export class CastformHail extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASTFORM_HAIL,
      [Synergy.NORMAL, Synergy.ARTIFICIAL, Synergy.ICE],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      180,
      18,
      3,
      3,
      2,
      AttackSprite.ICE_RANGE,
      3,
      80,
      Ability.FORECAST,
      shiny,
      emotion,
      true,
      false,
      Passive.CASTFORM
    )
  }
}

export class Landorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LANDORUS,
      [Synergy.GROUND, Synergy.FLYING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.FLYING_RANGE,
      3,
      100,
      Ability.DEFAULT, //Ability.ROCK_SLIDE,
      shiny,
      emotion,
      true,
      false,
      Passive.NONE //Passive.SANDSTORM
    )
  }
}

export class Thundurus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.THUNDURUS,
      [Synergy.ELECTRIC, Synergy.FLYING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      3,
      80,
      Ability.DEFAULT, //Ability.THUNDER,
      shiny,
      emotion,
      true,
      false,
      Passive.NONE //Passive.STORM
    )
  }
}

export class Tornadus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TORNADUS,
      [Synergy.FLYING, Synergy.HUMAN, Synergy.MONSTER],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      15,
      2,
      2,
      3,
      AttackSprite.FLYING_RANGE,
      3,
      100,
      Ability.TRI_ATTACK,
      shiny,
      emotion,
      true,
      false,
      Passive.WINDY
    )
  }
}

export class Keldeo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KELDEO,
      [Synergy.WATER, Synergy.FIGHTING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.WATER_RANGE,
      3,
      100,
      Ability.AQUA_JET,
      shiny,
      emotion,
      true
    )
  }
}

export class Terrakion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TERRAKION,
      [Synergy.ROCK, Synergy.FIGHTING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Virizion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VIRIZION,
      [Synergy.GRASS, Synergy.FIGHTING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      150,
      Ability.SACRED_SWORD,
      shiny,
      emotion,
      true
    )
  }
}

export class Cobalion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.COBALION,
      [Synergy.STEEL, Synergy.FIGHTING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      100,
      Ability.SEISMIC_TOSS,
      shiny,
      emotion,
      true
    )
  }
}

export class Mawile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAWILE,
      [Synergy.STEEL, Synergy.FAIRY, Synergy.MONSTER],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      180,
      15,
      6,
      6,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      80,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      true
    )
  }
}

export class Phione extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PHIONE,
      [Synergy.WATER, Synergy.BUG, Synergy.AQUATIC],
      Rarity.UNIQUE,
      Pkm.MANAPHY,
      160,
      14,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      100,
      Ability.NASTY_PLOT,
      shiny,
      emotion,
      true,
      false,
      Passive.PHIONE
    )
  }
}

export class Manaphy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MANAPHY,
      [Synergy.WATER, Synergy.BUG, Synergy.AQUATIC],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      240,
      16,
      4,
      4,
      3,
      AttackSprite.PSYCHIC_RANGE,
      4,
      100,
      Ability.NASTY_PLOT,
      shiny,
      emotion,
      true
    )
  }
}

export class Rotom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ROTOM,
      [Synergy.ELECTRIC, Synergy.GHOST],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      3,
      100,
      Ability.CALM_MIND,
      shiny,
      emotion,
      true
    )
  }
}

export class Spiritomb extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SPIRITOMB,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      2,
      AttackSprite.GHOST_RANGE,
      3,
      80,
      Ability.NIGHT_SLASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Absol extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ABSOL,
      [Synergy.DARK, Synergy.FIELD],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.THIEF,
      shiny,
      emotion,
      true
    )
  }
}

export class Delibird extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DELIBIRD,
      [Synergy.ICE, Synergy.FLYING, Synergy.FIELD],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      5,
      5,
      1,
      AttackSprite.ICE_MELEE,
      3,
      100,
      Ability.PRESENT,
      shiny,
      emotion,
      true
    )
  }
}

export class IronBundle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.IRON_BUNDLE,
      [Synergy.ICE, Synergy.FLYING, Synergy.ARTIFICIAL],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      16,
      4,
      4,
      1,
      AttackSprite.ICE_MELEE,
      3,
      100,
      Ability.AURORA_BEAM,
      shiny,
      emotion,
      true
    )
  }
}

export class Lapras extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LAPRAS,
      [Synergy.WATER, Synergy.ICE],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      250,
      12,
      6,
      6,
      1,
      AttackSprite.WATER_MELEE,
      3,
      100,
      Ability.DIVE,
      shiny,
      emotion,
      true
    )
  }
}

export class Latias extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LATIAS,
      [Synergy.DRAGON, Synergy.PSYCHIC],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      120,
      10,
      2,
      2,
      3,
      AttackSprite.FIRE_RANGE,
      3,
      90,
      Ability.MIST_BALL,
      shiny,
      emotion,
      true,
      false,
      Passive.SHARED_VISION
    )
  }
}

export class Latios extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LATIOS,
      [Synergy.DRAGON, Synergy.PSYCHIC],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      120,
      10,
      2,
      2,
      3,
      AttackSprite.FIRE_RANGE,
      3,
      90,
      Ability.LUSTER_PURGE,
      shiny,
      emotion,
      true,
      false,
      Passive.SHARED_VISION
    )
  }
}

export class Uxie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UXIE,
      [Synergy.PSYCHIC, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      65,
      Ability.KNOWLEDGE_THIEF,
      shiny,
      emotion,
      true
    )
  }
}

export class Mesprit extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MESPRIT,
      [Synergy.PSYCHIC, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      90,
      Ability.SONG_OF_DESIRE,
      shiny,
      emotion,
      true
    )
  }
}

export class Azelf extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AZELF,
      [Synergy.PSYCHIC, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      90,
      Ability.CONFUSING_MIND,
      shiny,
      emotion,
      true
    )
  }
}

export class Mew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEW,
      [Synergy.PSYCHIC, Synergy.FIELD],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      18,
      2,
      2,
      4,
      AttackSprite.PSYCHIC_RANGE,
      3,
      80,
      Ability.TELEPORT,
      shiny,
      emotion,
      true,
      false,
      Passive.SYNCHRO
    )
  }
}

export class Mewtwo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEWTWO,
      [Synergy.PSYCHIC, Synergy.MONSTER, Synergy.ARTIFICIAL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      200,
      30,
      2,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      110,
      Ability.DYNAMAX_CANNON,
      shiny,
      emotion,
      true
    )
  }
}

export class Marshadow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MARSHADOW,
      [Synergy.GHOST, Synergy.FIGHTING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      250,
      28,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      120,
      Ability.SPECTRAL_THIEF,
      shiny,
      emotion,
      true
    )
  }
}

export class Kyurem extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KYUREM,
      [Synergy.DRAGON, Synergy.ICE],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      3,
      100,
      Ability.DEFAULT, //Ability.BLIZZARD,
      shiny,
      emotion,
      true,
      false,
      Passive.NONE // Passive.SNOW
    )
  }
}

export class Reshiram extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RESHIRAM,
      [Synergy.DRAGON, Synergy.FIRE],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      200,
      30,
      3,
      6,
      3,
      AttackSprite.FIRE_RANGE,
      3,
      100,
      Ability.BLUE_FLARE,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Zekrom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZEKROM,
      [Synergy.DRAGON, Synergy.ELECTRIC],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      200,
      30,
      3,
      6,
      3,
      AttackSprite.ELECTRIC_RANGE,
      3,
      100,
      Ability.FUSION_BOLT,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Celebi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CELEBI,
      [Synergy.GRASS, Synergy.PSYCHIC],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.GRASS_RANGE,
      3,
      100,
      Ability.AURORA_VEIL,
      shiny,
      emotion,
      true
    )
  }
}

export class Victini extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VICTINI,
      [Synergy.FIRE, Synergy.PSYCHIC],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      100,
      Ability.SEARING_SHOT,
      shiny,
      emotion,
      true
    )
  }
}

export class Jirachi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.JIRACHI,
      [Synergy.STEEL, Synergy.PSYCHIC],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      220,
      30,
      5,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      60,
      Ability.WISH,
      shiny,
      emotion,
      true
    )
  }
}

export class Arceus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARCEUS,
      [],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      25,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.JUDGEMENT,
      shiny,
      emotion,
      true,
      false,
      Passive.PROTEAN3
    )
  }
}

export class Deoxys extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DEOXYS,
      [Synergy.PSYCHIC, Synergy.HUMAN, Synergy.ARTIFICIAL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      220,
      30,
      5,
      5,
      1,
      AttackSprite.PSYCHIC_RANGE,
      3,
      100,
      Ability.PROTECT,
      shiny,
      emotion,
      true
    )
  }
}

export class Shaymin extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHAYMIN,
      [Synergy.GRASS, Synergy.FLORA],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      200,
      30,
      5,
      5,
      3,
      AttackSprite.GRASS_RANGE,
      3,
      100,
      Ability.SEED_FLARE,
      shiny,
      emotion,
      true,
      false,
      Passive.SHAYMIN
    )
  }
}

export class ShayminSky extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHAYMIN_SKY,
      [Synergy.GRASS, Synergy.FLORA, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.GRASS_RANGE,
      4,
      100,
      Ability.SEED_FLARE,
      shiny,
      emotion,
      true
    )
  }
}

export class Cresselia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CRESSELIA,
      [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.LIGHT],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      60,
      Ability.WISH,
      shiny,
      emotion,
      true,
      false,
      Passive.MISTY
    )
  }
}

export class Heatran extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HEATRAN,
      [Synergy.FIRE, Synergy.STEEL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      280,
      20,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      3,
      100,
      Ability.MAGMA_STORM,
      shiny,
      emotion,
      true
    )
  }
}

export class HooH extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HO_OH,
      [Synergy.FIRE, Synergy.FLYING, Synergy.LIGHT],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      3,
      100,
      Ability.FIRE_SPIN,
      shiny,
      emotion,
      true,
      false,
      Passive.SUN
    )
  }
}

export class Torkoal extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TORKOAL,
      [Synergy.FIRE, Synergy.GROUND],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      240,
      10,
      10,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      105,
      Ability.SMOKE_SCREEN,
      shiny,
      emotion,
      true,
      false,
      Passive.SUN
    )
  }
}

export class PrimalGroudon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PRIMAL_GROUDON,
      [Synergy.GROUND, Synergy.FIRE],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      400,
      30,
      10,
      10,
      1,
      AttackSprite.FIRE_MELEE,
      4,
      100,
      Ability.EARTHQUAKE,
      shiny,
      emotion,
      true,
      false,
      Passive.SANDSTORM
    )
  }
}

export class PrimalKyogre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PRIMAL_KYOGRE,
      [Synergy.WATER, Synergy.ELECTRIC, Synergy.MONSTER],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      400,
      20,
      3,
      3,
      3,
      AttackSprite.WATER_RANGE,
      4,
      100,
      Ability.ORIGIN_PULSE,
      shiny,
      emotion,
      true,
      false,
      Passive.RAIN
    )
  }
}

export class MegaRayquaza extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_RAYQUAZA,
      [Synergy.DRAGON, Synergy.FLYING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      400,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      4,
      100,
      Ability.DRACO_METEOR,
      shiny,
      emotion,
      true,
      false,
      Passive.AIRLOCK
    )
  }
}

export class Oddish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ODDISH,
      [Synergy.POISON, Synergy.GRASS],
      Rarity.SPECIAL,
      Pkm.GLOOM,
      90,
      9,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      100,
      Ability.STUN_SPORE,
      shiny,
      emotion,
      false
    )
  }
}

export class Gloom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GLOOM,
      [Synergy.POISON, Synergy.GRASS],
      Rarity.SPECIAL,
      Pkm.VILEPLUME,
      160,
      18,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      100,
      Ability.STUN_SPORE,
      shiny,
      emotion,
      false
    )
  }
}

export class Vileplume extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VILEPLUME,
      [Synergy.POISON, Synergy.GRASS],
      Rarity.SPECIAL,
      Pkm.BELLOSSOM,
      260,
      20,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.STUN_SPORE,
      shiny,
      emotion,
      false
    )
  }
}

export class Bellossom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BELLOSSOM,
      [Synergy.POISON, Synergy.GRASS],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      360,
      27,
      5,
      5,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.STUN_SPORE,
      shiny,
      emotion,
      true
    )
  }
}

export class Amaura extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AMAURA,
      [Synergy.FOSSIL, Synergy.ICE],
      Rarity.EPIC,
      Pkm.AURORUS,
      130,
      7,
      3,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Aurorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AURORUS,
      [Synergy.FOSSIL, Synergy.ICE],
      Rarity.EPIC,
      Pkm.DEFAULT,
      280,
      18,
      5,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Carbink extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CARBINK,
      [Synergy.FOSSIL, Synergy.ROCK, Synergy.FAIRY],
      Rarity.EPIC,
      Pkm.DIANCIE,
      125,
      7,
      4,
      2,
      1,
      AttackSprite.FAIRY_MELEE,
      1,
      100,
      Ability.DIAMOND_STORM,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Diancie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DIANCIE,
      [Synergy.FOSSIL, Synergy.ROCK, Synergy.FAIRY],
      Rarity.EPIC,
      Pkm.DEFAULT,
      300,
      10,
      8,
      4,
      1,
      AttackSprite.FAIRY_MELEE,
      2,
      100,
      Ability.DIAMOND_STORM,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Sunkern extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SUNKERN,
      [Synergy.GRASS, Synergy.FIRE, Synergy.FLORA],
      Rarity.EPIC,
      Pkm.SUNFLORA,
      80,
      8,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      100,
      Ability.SOLAR_BEAM,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Sunflora extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SUNFLORA,
      [Synergy.GRASS, Synergy.FIRE, Synergy.FLORA],
      Rarity.EPIC,
      Pkm.DEFAULT,
      160,
      18,
      5,
      5,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      80,
      Ability.SOLAR_BEAM,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Mankey extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MANKEY,
      [Synergy.FIGHTING, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.PRIMEAPE,
      120,
      8,
      3,
      2,
      1,
      AttackSprite.FIGHTING_MELEE,
      1,
      90,
      Ability.THRASH,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Primeape extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PRIMEAPE,
      [Synergy.FIGHTING, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.DEFAULT,
      240,
      21,
      6,
      2,
      1,
      AttackSprite.FIGHTING_MELEE,
      2,
      90,
      Ability.THRASH,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Anorith extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ANORITH,
      [Synergy.FOSSIL, Synergy.BUG, Synergy.AQUATIC],
      Rarity.UNCOMMON,
      Pkm.ARMALDO,
      60,
      6,
      2,
      1,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.ROCK_SMASH,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Armaldo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARMALDO,
      [Synergy.FOSSIL, Synergy.BUG, Synergy.AQUATIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      15,
      3,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.ROCK_SMASH,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Wynaut extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WYNAUT,
      [Synergy.PSYCHIC, Synergy.BABY],
      Rarity.RARE,
      Pkm.WOBBUFFET,
      110,
      7,
      1,
      1,
      1,
      AttackSprite.FIGHTING_MELEE,
      1,
      100,
      Ability.COUNTER,
      shiny,
      emotion,
      false,
      true,
      Passive.WOBBUFFET
    )
  }
}

export class Wobbuffet extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WOBBUFFET,
      [Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      280,
      18,
      2,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.COUNTER,
      shiny,
      emotion,
      true,
      true,
      Passive.WOBBUFFET
    )
  }
}

export class Archen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARCHEN,
      [Synergy.FOSSIL, Synergy.ROCK, Synergy.FLYING],
      Rarity.RARE,
      Pkm.ARCHEOPS,
      80,
      6,
      3,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      90,
      Ability.ROCK_SMASH,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Archeops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARCHEOPS,
      [Synergy.FOSSIL, Synergy.ROCK, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      14,
      5,
      5,
      2,
      AttackSprite.ROCK_MELEE,
      2,
      90,
      Ability.ROCK_SMASH,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Gligar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GLIGAR,
      [Synergy.GROUND, Synergy.POISON, Synergy.FLYING],
      Rarity.UNIQUE,
      Pkm.GLISCOR,
      160,
      16,
      3,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      90,
      Ability.POISON_JAB,
      shiny,
      emotion,
      false,
      false,
      Passive.GLIGAR
    )
  }
}

export class Gliscor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GLISCOR,
      [Synergy.GROUND, Synergy.POISON, Synergy.FLYING],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      4,
      90,
      Ability.POISON_JAB,
      shiny,
      emotion,
      false,
      true,
      Passive.POISON_HEAL
    )
  }
}

export class Shieldon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHIELDON,
      [Synergy.FOSSIL, Synergy.STEEL],
      Rarity.RARE,
      Pkm.BASTIODON,
      90,
      6,
      5,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.IRON_DEFENSE,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Bastiodon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BASTIODON,
      [Synergy.FOSSIL, Synergy.STEEL],
      Rarity.RARE,
      Pkm.DEFAULT,
      250,
      10,
      8,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.IRON_DEFENSE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Tirtouga extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TIRTOUGA,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.UNCOMMON,
      Pkm.CARRACOSTA,
      120,
      7,
      4,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Carracosta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CARRACOSTA,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.RARE,
      Pkm.DEFAULT,
      240,
      14,
      7,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Lileep extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LILEEP,
      [Synergy.FOSSIL, Synergy.GRASS, Synergy.FLORA],
      Rarity.RARE,
      Pkm.CRADILY,
      70,
      7,
      2,
      2,
      2,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.LEECH_SEED,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Cradily extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CRADILY,
      [Synergy.FOSSIL, Synergy.GRASS, Synergy.FLORA],
      Rarity.RARE,
      Pkm.DEFAULT,
      150,
      21,
      3,
      3,
      2,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.LEECH_SEED,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Cranidos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CRANIDOS,
      [Synergy.FOSSIL, Synergy.MONSTER],
      Rarity.UNCOMMON,
      Pkm.RAMPARDOS,
      60,
      7,
      2,
      1,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.HEAD_SMASH,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Rampardos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RAMPARDOS,
      [Synergy.FOSSIL, Synergy.MONSTER],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      160,
      15,
      3,
      1,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.HEAD_SMASH,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Kabuto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KABUTO,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.RARE,
      Pkm.KABUTOPS,
      80,
      8,
      3,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      90,
      Ability.HEAL_BLOCK,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Kabutops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KABUTOPS,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.RARE,
      Pkm.DEFAULT,
      190,
      22,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      90,
      Ability.HEAL_BLOCK,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Omanyte extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.OMANYTE,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.UNCOMMON,
      Pkm.OMASTAR,
      70,
      6,
      2,
      3,
      2,
      AttackSprite.ROCK_MELEE,
      1,
      90,
      Ability.ROCK_TOMB,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Omastar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.OMASTAR,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      150,
      14,
      3,
      4,
      2,
      AttackSprite.ROCK_MELEE,
      2,
      90,
      Ability.ROCK_TOMB,
      shiny,
      emotion,
      true,
      true
    )
  }
}
export class Clamperl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLAMPERL,
      [Synergy.FOSSIL, Synergy.WATER, Synergy.AQUATIC],
      Rarity.EPIC,
      Pkm.HUNTAIL,
      100,
      7,
      4,
      2,
      1,
      AttackSprite.WATER_MELEE,
      1,
      80,
      Ability.ROCK_TOMB,
      shiny,
      emotion,
      false,
      true,
      Passive.BIVALVE
    )
  }
}

export class Gorebyss extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOREBYSS,
      [Synergy.FOSSIL, Synergy.WATER, Synergy.PSYCHIC],
      Rarity.EPIC,
      Pkm.DEFAULT,
      200,
      16,
      2,
      2,
      2,
      AttackSprite.WATER_RANGE,
      2,
      80,
      Ability.HYDRO_PUMP,
      shiny,
      emotion,
      true,
      true,
      Passive.BIVALVE
    )
  }
}
export class Huntail extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HUNTAIL,
      [Synergy.FOSSIL, Synergy.WATER, Synergy.AQUATIC],
      Rarity.EPIC,
      Pkm.DEFAULT,
      140,
      27,
      5,
      3,
      1,
      AttackSprite.WATER_MELEE,
      2,
      80,
      Ability.ROCK_TOMB,
      shiny,
      emotion,
      true,
      true,
      Passive.BIVALVE
    )
  }
}
export class Relicanth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RELICANTH,
      [Synergy.ROCK, Synergy.WATER, Synergy.FOSSIL],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      220,
      13,
      6,
      3,
      1,
      AttackSprite.WATER_MELEE,
      3,
      70,
      Ability.ROCK_TOMB,
      shiny,
      emotion,
      true
    )
  }
}

export class Tyrunt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TYRUNT,
      [Synergy.FOSSIL, Synergy.DRAGON],
      Rarity.UNCOMMON,
      Pkm.TYRANTRUM,
      135,
      10,
      4,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Tyrantrum extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TYRANTRUM,
      [Synergy.FOSSIL, Synergy.DRAGON],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      290,
      22,
      7,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Aerodactyl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AERODACTYL,
      [Synergy.ROCK, Synergy.FLYING, Synergy.FOSSIL],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      17,
      3,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      80,
      Ability.ROCK_SLIDE,
      shiny,
      emotion,
      true
    )
  }
}

export class Genesect extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GENESECT,
      [Synergy.BUG, Synergy.STEEL, Synergy.ARTIFICIAL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      200,
      22,
      6,
      3,
      4,
      AttackSprite.FIRE_RANGE,
      3,
      80,
      Ability.LOCK_ON,
      shiny,
      emotion,
      true
    )
  }
}

export class Hatenna extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HATENNA,
      [Synergy.FAIRY, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.HATTREM,
      75,
      6,
      2,
      2,
      1,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.PSYCH_UP,
      shiny,
      emotion,
      false
    )
  }
}

export class Hattrem extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HATTREM,
      [Synergy.FAIRY, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.HATTERENE,
      130,
      11,
      4,
      6,
      1,
      AttackSprite.PSYCHIC_RANGE,
      2,
      100,
      Ability.PSYCH_UP,
      shiny,
      emotion,
      false
    )
  }
}

export class Hatterene extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HATTERENE,
      [Synergy.FAIRY, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      240,
      22,
      5,
      8,
      1,
      AttackSprite.PSYCHIC_RANGE,
      3,
      100,
      Ability.PSYCH_UP,
      shiny,
      emotion,
      true
    )
  }
}
export class Fennekin extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FENNEKIN,
      [Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.COMMON,
      Pkm.BRAIXEN,
      50,
      5,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      100,
      Ability.FIRE_TRICK,
      shiny,
      emotion,
      false
    )
  }
}
export class Braixen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BRAIXEN,
      [Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.COMMON,
      Pkm.DELPHOX,
      100,
      9,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      100,
      Ability.FIRE_TRICK,
      shiny,
      emotion,
      false
    )
  }
}
export class Delphox extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DELPHOX,
      [Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      3,
      100,
      Ability.FIRE_TRICK,
      shiny,
      emotion,
      true
    )
  }
}

export class Regieleki extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REGIELEKI,
      [Synergy.ELECTRIC, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      3,
      80,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      true
    )
  }
}
export class Regidrago extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REGIDRAGO,
      [Synergy.DRAGON, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      3,
      100,
      Ability.DRACO_ENERGY,
      shiny,
      emotion,
      true
    )
  }
}
export class Guzzlord extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GUZZLORD,
      [Synergy.DRAGON, Synergy.DARK],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      250,
      22,
      3,
      3,
      3,
      AttackSprite.FIRE_RANGE,
      3,
      120,
      Ability.TWISTING_NETHER,
      shiny,
      emotion,
      true
    )
  }
}
export class Eternatus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ETERNATUS,
      [Synergy.DRAGON, Synergy.POISON, Synergy.FOSSIL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      22,
      8,
      8,
      1,
      AttackSprite.POISON_MELEE,
      3,
      120,
      Ability.DYNAMAX_CANNON,
      shiny,
      emotion,
      true
    )
  }
}

export class Nincada extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NINCADA,
      [Synergy.BUG, Synergy.FLYING],
      Rarity.ULTRA,
      Pkm.NINJASK,
      10,
      7,
      0,
      0,
      1,
      AttackSprite.BUG_MELEE,
      1,
      100,
      Ability.WONDER_GUARD,
      shiny,
      emotion,
      false,
      false,
      Passive.WONDER_GUARD
    )
  }
}
export class Ninjask extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NINJASK,
      [Synergy.BUG, Synergy.FLYING],
      Rarity.ULTRA,
      Pkm.SHEDNINJA,
      20,
      14,
      0,
      0,
      1,
      AttackSprite.BUG_MELEE,
      2,
      100,
      Ability.WONDER_GUARD,
      shiny,
      emotion,
      false,
      false,
      Passive.WONDER_GUARD
    )
  }
}
export class Shedninja extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHEDNINJA,
      [Synergy.BUG, Synergy.GHOST, Synergy.FLYING],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      50,
      21,
      0,
      0,
      1,
      AttackSprite.BUG_MELEE,
      3,
      100,
      Ability.WONDER_GUARD,
      shiny,
      emotion,
      true,
      false,
      Passive.WONDER_GUARD
    )
  }
}

export class Happiny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HAPPINY,
      [Synergy.NORMAL, Synergy.HUMAN, Synergy.BABY],
      Rarity.ULTRA,
      Pkm.CHANSEY,
      150,
      8,
      5,
      5,
      1,
      AttackSprite.FAIRY_MELEE,
      1,
      130,
      Ability.SOFT_BOILED,
      shiny,
      emotion,
      false
    )
  }
}

export class Chansey extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHANSEY,
      [Synergy.NORMAL, Synergy.HUMAN],
      Rarity.ULTRA,
      Pkm.BLISSEY,
      300,
      20,
      6,
      4,
      1,
      AttackSprite.FAIRY_MELEE,
      2,
      130,
      Ability.SOFT_BOILED,
      shiny,
      emotion,
      false
    )
  }
}

export class Blissey extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BLISSEY,
      [Synergy.NORMAL, Synergy.HUMAN],
      Rarity.ULTRA,
      Pkm.DEFAULT,
      480,
      25,
      10,
      8,
      1,
      AttackSprite.FAIRY_MELEE,
      3,
      130,
      Ability.SOFT_BOILED,
      shiny,
      emotion,
      true
    )
  }
}

export class TapuKoko extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TAPU_KOKO,
      [Synergy.ELECTRIC, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      17,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      3,
      100,
      Ability.ELECTRIC_SURGE,
      shiny,
      emotion,
      true,
      false,
      Passive.ELECTRIC_SURGE
    )
  }
}

export class TapuLele extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TAPU_LELE,
      [Synergy.PSYCHIC, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      17,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      100,
      Ability.PSYCHIC_SURGE,
      shiny,
      emotion,
      true,
      false,
      Passive.PSYCHIC_SURGE
    )
  }
}

export class Xerneas extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.XERNEAS,
      [Synergy.FAIRY, Synergy.LIGHT],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      25,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      100,
      Ability.GEOMANCY,
      shiny,
      emotion,
      true,
      false,
      Passive.MISTY
    )
  }
}

export class TapuFini extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TAPU_FINI,
      [Synergy.WATER, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      17,
      3,
      3,
      3,
      AttackSprite.WATER_RANGE,
      3,
      100,
      Ability.MISTY_SURGE,
      shiny,
      emotion,
      true,
      false,
      Passive.MISTY_SURGE
    )
  }
}

export class TapuBulu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TAPU_BULU,
      [Synergy.GRASS, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      17,
      5,
      5,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.GRASSY_SURGE,
      shiny,
      emotion,
      true,
      false,
      Passive.GRASSY_SURGE
    )
  }
}

export class Stakataka extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STAKATAKA,
      [Synergy.ROCK, Synergy.STEEL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      5,
      15,
      15,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      100,
      Ability.IRON_DEFENSE,
      shiny,
      emotion,
      true
    )
  }
}

export class Blacephalon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BLACEPHALON,
      [Synergy.FIRE, Synergy.GHOST],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      15,
      3,
      3,
      3,
      AttackSprite.GHOST_RANGE,
      3,
      80,
      Ability.MIND_BLOWN,
      shiny,
      emotion,
      true
    )
  }
}

export class Houndour extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HOUNDOUR,
      [Synergy.FIRE, Synergy.DARK],
      Rarity.EPIC,
      Pkm.HOUNDOOM,
      85,
      8,
      4,
      4,
      1,
      AttackSprite.FIRE_MELEE,
      1,
      125,
      Ability.BEAT_UP,
      shiny,
      emotion,
      false
    )
  }
}

export class Houndoom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HOUNDOOM,
      [Synergy.FIRE, Synergy.DARK],
      Rarity.EPIC,
      Pkm.MEGA_HOUNDOOM,
      150,
      20,
      6,
      6,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      125,
      Ability.BEAT_UP,
      shiny,
      emotion,
      false
    )
  }
}

export class MegaHoundoom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEGA_HOUNDOOM,
      [Synergy.FIRE, Synergy.DARK],
      Rarity.EPIC,
      Pkm.DEFAULT,
      280,
      38,
      8,
      8,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      125,
      Ability.BEAT_UP,
      shiny,
      emotion,
      true
    )
  }
}

export class Cacnea extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CACNEA,
      [Synergy.GRASS, Synergy.DARK, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.CACTURNE,
      85,
      7,
      3,
      1,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      70,
      Ability.HEAL_BLOCK,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Cacturne extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CACTURNE,
      [Synergy.GRASS, Synergy.DARK, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      20,
      6,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      70,
      Ability.HEAL_BLOCK,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Pumpkaboo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PUMPKABOO,
      [Synergy.GHOST, Synergy.GRASS],
      Rarity.EPIC,
      Pkm.GOURGEIST,
      90,
      14,
      6,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      80,
      Ability.CORRUPTED_NATURE,
      shiny,
      emotion,
      false,
      true
    )
  }
}
export class Gourgeist extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOURGEIST,
      [Synergy.GHOST, Synergy.GRASS],
      Rarity.EPIC,
      Pkm.DEFAULT,
      190,
      28,
      10,
      5,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      80,
      Ability.CORRUPTED_NATURE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Natu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NATU,
      [Synergy.PSYCHIC, Synergy.FLYING],
      Rarity.UNCOMMON,
      Pkm.XATU,
      90,
      5,
      2,
      2,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      70,
      Ability.MAGIC_BOUNCE,
      shiny,
      emotion,
      false,
      true
    )
  }
}
export class Xatu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.XATU,
      [Synergy.PSYCHIC, Synergy.FLYING],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      12,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      70,
      Ability.MAGIC_BOUNCE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Noibat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NOIBAT,
      [Synergy.DRAGON, Synergy.SOUND, Synergy.FLYING],
      Rarity.RARE,
      Pkm.NOIVERN,
      65,
      7,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      1,
      90,
      Ability.RAZOR_WIND,
      shiny,
      emotion,
      false,
      true
    )
  }
}
export class Noivern extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NOIVERN,
      [Synergy.DRAGON, Synergy.SOUND, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      150,
      17,
      3,
      3,
      2,
      AttackSprite.FLYING_RANGE,
      2,
      90,
      Ability.RAZOR_WIND,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Shellder extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHELLDER,
      [Synergy.WATER, Synergy.ICE, Synergy.ROCK],
      Rarity.UNCOMMON,
      Pkm.CLOYSTER,
      70,
      5,
      5,
      2,
      1,
      AttackSprite.WATER_MELEE,
      1,
      110,
      Ability.SHELL_SMASH,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Cloyster extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLOYSTER,
      [Synergy.WATER, Synergy.ICE, Synergy.ROCK],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      150,
      11,
      8,
      2,
      1,
      AttackSprite.WATER_MELEE,
      2,
      110,
      Ability.SHELL_SMASH,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Buizel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BUIZEL,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.FLOATZEL,
      90,
      9,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      1,
      55,
      Ability.AQUA_JET,
      shiny,
      emotion,
      false,
      true
    )
  }
}
export class Floatzel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FLOATZEL,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.DEFAULT,
      180,
      22,
      5,
      5,
      1,
      AttackSprite.WATER_MELEE,
      2,
      55,
      Ability.AQUA_JET,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Ponyta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PONYTA,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.RAPIDASH,
      90,
      12,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      1,
      55,
      Ability.FLAME_CHARGE,
      shiny,
      emotion,
      false,
      true
    )
  }
}
export class Rapidash extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RAPIDASH,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.DEFAULT,
      220,
      24,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      55,
      Ability.FLAME_CHARGE,
      shiny,
      emotion,
      true,
      true
    )
  }
}
export class Makuhita extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAKUHITA,
      [Synergy.FIGHTING, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.HARIYAMA,
      80,
      8,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      1,
      100,
      Ability.DYNAMIC_PUNCH,
      shiny,
      emotion,
      false,
      true
    )
  }
}
export class Hariyama extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HARIYAMA,
      [Synergy.FIGHTING, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.DEFAULT,
      170,
      22,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      2,
      80,
      Ability.DYNAMIC_PUNCH,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Sentret extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SENTRET,
      [Synergy.GROUND, Synergy.NORMAL, Synergy.FIELD],
      Rarity.RARE,
      Pkm.FURRET,
      80,
      7,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.HELPING_HAND,
      shiny,
      emotion,
      false,
      true
    )
  }
}
export class Furret extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FURRET,
      [Synergy.GROUND, Synergy.NORMAL, Synergy.FIELD],
      Rarity.RARE,
      Pkm.DEFAULT,
      200,
      16,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      80,
      Ability.HELPING_HAND,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Joltik extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.JOLTIK,
      [Synergy.BUG, Synergy.ELECTRIC],
      Rarity.RARE,
      Pkm.GALVANTULA,
      80,
      8,
      3,
      2,
      1,
      AttackSprite.ELECTRIC_MELEE,
      1,
      100,
      Ability.ELECTRO_WEB,
      shiny,
      emotion,
      false,
      true
    )
  }
}
export class Galvantula extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GALVANTULA,
      [Synergy.BUG, Synergy.ELECTRIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      20,
      5,
      3,
      1,
      AttackSprite.ELECTRIC_MELEE,
      2,
      100,
      Ability.ELECTRO_WEB,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Paras extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PARAS,
      [Synergy.BUG, Synergy.POISON, Synergy.GRASS],
      Rarity.RARE,
      Pkm.PARASECT,
      90,
      6,
      2,
      2,
      1,
      AttackSprite.BUG_MELEE,
      1,
      110,
      Ability.ABSORB,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Parasect extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PARASECT,
      [Synergy.BUG, Synergy.POISON, Synergy.GRASS],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      16,
      3,
      3,
      1,
      AttackSprite.BUG_MELEE,
      2,
      110,
      Ability.ABSORB,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Corphish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CORPHISH,
      [Synergy.WATER, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.CRAWDAUNT,
      85,
      6,
      3,
      2,
      1,
      AttackSprite.WATER_MELEE,
      1,
      100,
      Ability.CRABHAMMER,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Crawdaunt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CRAWDAUNT,
      [Synergy.WATER, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      160,
      16,
      5,
      3,
      1,
      AttackSprite.WATER_MELEE,
      2,
      100,
      Ability.CRABHAMMER,
      shiny,
      emotion,
      true,
      true
    )
  }
}
export class Meowth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEOWTH,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.RARE,
      Pkm.PERSIAN,
      80,
      8,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      90,
      Ability.PAYDAY,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Persian extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PERSIAN,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.RARE,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      90,
      Ability.PAYDAY,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Hoothoot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HOOTHOOT,
      [Synergy.NORMAL, Synergy.FLYING, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.NOCTOWL,
      75,
      5,
      2,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.HYPNOSIS,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Noctowl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NOCTOWL,
      [Synergy.NORMAL, Synergy.FLYING, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      170,
      10,
      3,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      100,
      Ability.HYPNOSIS,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Munchlax extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MUNCHLAX,
      [Synergy.NORMAL, Synergy.HUMAN, Synergy.BABY],
      Rarity.EPIC,
      Pkm.SNORLAX,
      120,
      8,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      120,
      Ability.SLACK_OFF,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Snorlax extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SNORLAX,
      [Synergy.NORMAL, Synergy.HUMAN, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.DEFAULT,
      300,
      19,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      120,
      Ability.SLACK_OFF,
      shiny,
      emotion,
      true,
      true
    )
  }
}
export class Growlithe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GROWLITHE,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.ARCANINE,
      70,
      6,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      1,
      80,
      Ability.GROWL,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Arcanine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARCANINE,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      14,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      80,
      Ability.GROWL,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Smoochum extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SMOOCHUM,
      [Synergy.ICE, Synergy.PSYCHIC, Synergy.BABY],
      Rarity.UNCOMMON,
      Pkm.JYNX,
      60,
      6,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      80,
      Ability.CONFUSION,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Jynx extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.JYNX,
      [Synergy.ICE, Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      12,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      80,
      Ability.CONFUSION,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class MimeJr extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MIME_JR,
      [Synergy.FAIRY, Synergy.PSYCHIC, Synergy.BABY],
      Rarity.RARE,
      Pkm.MR_MIME,
      70,
      6,
      2,
      2,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      85,
      Ability.MIMIC,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class MrMime extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MR_MIME,
      [Synergy.FAIRY, Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.DEFAULT,
      200,
      15,
      2,
      4,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      85,
      Ability.MIMIC,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Salandit extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SALANDIT,
      [Synergy.FIRE, Synergy.POISON],
      Rarity.RARE,
      Pkm.SALAZZLE,
      70,
      7,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      60,
      Ability.POISON,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Salazzle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SALAZZLE,
      [Synergy.FIRE, Synergy.POISON],
      Rarity.RARE,
      Pkm.DEFAULT,
      170,
      17,
      4,
      4,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      60,
      Ability.POISON,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Venonat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VENONAT,
      [Synergy.BUG, Synergy.FLYING, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.VENOMOTH,
      50,
      6,
      2,
      2,
      1,
      AttackSprite.BUG_MELEE,
      1,
      80,
      Ability.BUG_BUZZ,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Venomoth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VENOMOTH,
      [Synergy.BUG, Synergy.FLYING, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      11,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      80,
      Ability.BUG_BUZZ,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Voltorb extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VOLTORB,
      [Synergy.ELECTRIC, Synergy.ARTIFICIAL],
      Rarity.UNCOMMON,
      Pkm.ELECTRODE,
      60,
      9,
      1,
      1,
      1,
      AttackSprite.ELECTRIC_MELEE,
      1,
      80,
      Ability.EXPLOSION,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Electrode extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ELECTRODE,
      [Synergy.ELECTRIC, Synergy.ARTIFICIAL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      150,
      18,
      3,
      3,
      1,
      AttackSprite.ELECTRIC_MELEE,
      2,
      80,
      Ability.EXPLOSION,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Slugma extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SLUGMA,
      [Synergy.FIRE, Synergy.ROCK],
      Rarity.RARE,
      Pkm.MAGCARGO,
      70,
      7,
      3,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      90,
      Ability.FIRE_BLAST,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Magcargo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGCARGO,
      [Synergy.FIRE, Synergy.ROCK],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      16,
      6,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      90,
      Ability.FIRE_BLAST,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Sneasel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SNEASEL,
      [Synergy.ICE, Synergy.DARK, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.WEAVILE,
      85,
      9,
      1,
      3,
      1,
      AttackSprite.ICE_MELEE,
      1,
      40,
      Ability.SLASHING_CLAW,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Weavile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WEAVILE,
      [Synergy.ICE, Synergy.DARK, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.DEFAULT,
      200,
      22,
      2,
      3,
      1,
      AttackSprite.ICE_MELEE,
      2,
      40,
      Ability.SLASHING_CLAW,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Seel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SEEL,
      [Synergy.ICE, Synergy.AQUATIC],
      Rarity.UNCOMMON,
      Pkm.DEWGONG,
      80,
      7,
      4,
      4,
      1,
      AttackSprite.ICE_MELEE,
      1,
      90,
      Ability.AURORA_BEAM,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Dewgong extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DEWGONG,
      [Synergy.ICE, Synergy.AQUATIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      170,
      16,
      4,
      4,
      1,
      AttackSprite.ICE_MELEE,
      2,
      90,
      Ability.AURORA_BEAM,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Croagunk extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CROAGUNK,
      [Synergy.POISON, Synergy.FIGHTING, Synergy.AQUATIC],
      Rarity.RARE,
      Pkm.TOXICROAK,
      75,
      6,
      2,
      2,
      1,
      AttackSprite.POISON_MELEE,
      1,
      85,
      Ability.GUILLOTINE,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Toxicroak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TOXICROAK,
      [Synergy.POISON, Synergy.FIGHTING, Synergy.AQUATIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      190,
      14,
      4,
      4,
      1,
      AttackSprite.POISON_MELEE,
      2,
      85,
      Ability.GUILLOTINE,
      shiny,
      emotion,
      true,
      true
    )
  }
}
export class Chinchou extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHINCHOU,
      [Synergy.WATER, Synergy.ELECTRIC, Synergy.LIGHT],
      Rarity.UNCOMMON,
      Pkm.LANTURN,
      60,
      7,
      2,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      1,
      90,
      Ability.THUNDER,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Lanturn extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LANTURN,
      [Synergy.WATER, Synergy.ELECTRIC, Synergy.LIGHT],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      16,
      3,
      5,
      2,
      AttackSprite.ELECTRIC_RANGE,
      2,
      90,
      Ability.THUNDER,
      shiny,
      emotion,
      true,
      true
    )
  }
}
export class Poochyena extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.POOCHYENA,
      [Synergy.NORMAL, Synergy.DARK, Synergy.FIELD],
      Rarity.RARE,
      Pkm.MIGHTYENA,
      70,
      9,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      75,
      Ability.GROWL,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Mightyena extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MIGHTYENA,
      [Synergy.NORMAL, Synergy.DARK, Synergy.FIELD],
      Rarity.RARE,
      Pkm.DEFAULT,
      160,
      19,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      75,
      Ability.GROWL,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Bronzor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BRONZOR,
      [Synergy.STEEL, Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.BRONZONG,
      90,
      5,
      5,
      3,
      1,
      AttackSprite.DRAGON_MELEE,
      1,
      95,
      Ability.IRON_DEFENSE,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Bronzong extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BRONZONG,
      [Synergy.STEEL, Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      200,
      11,
      9,
      7,
      1,
      AttackSprite.DRAGON_MELEE,
      2,
      95,
      Ability.IRON_DEFENSE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Drifloon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DRIFLOON,
      [Synergy.GHOST, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DRIFBLIM,
      120,
      5,
      2,
      2,
      2,
      AttackSprite.GHOST_RANGE,
      1,
      85,
      Ability.CALM_MIND,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Drifblim extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DRIFBLIM,
      [Synergy.GHOST, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      250,
      10,
      3,
      3,
      2,
      AttackSprite.GHOST_RANGE,
      2,
      85,
      Ability.CALM_MIND,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Shroomish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHROOMISH,
      [Synergy.GRASS, Synergy.FIGHTING],
      Rarity.UNCOMMON,
      Pkm.BRELOOM,
      60,
      7,
      2,
      2,
      1,
      AttackSprite.FIGHTING_MELEE,
      1,
      85,
      Ability.LEECH_SEED,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Breloom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BRELOOM,
      [Synergy.GRASS, Synergy.FIGHTING],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      150,
      15,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      2,
      85,
      Ability.LEECH_SEED,
      shiny,
      emotion,
      true,
      true
    )
  }
}
export class Tentacool extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TENTACOOL,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.POISON],
      Rarity.UNCOMMON,
      Pkm.TENTACRUEL,
      65,
      5,
      2,
      4,
      1,
      AttackSprite.WATER_MELEE,
      1,
      85,
      Ability.POISON,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Tentacruel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TENTACRUEL,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.POISON],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      150,
      10,
      3,
      7,
      1,
      AttackSprite.WATER_MELEE,
      2,
      85,
      Ability.POISON,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Snubull extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SNUBULL,
      [Synergy.FAIRY, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.GRANBULL,
      115,
      10,
      3,
      2,
      1,
      AttackSprite.FAIRY_MELEE,
      1,
      70,
      Ability.BITE,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Granbull extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GRANBULL,
      [Synergy.FAIRY, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.DEFAULT,
      265,
      24,
      6,
      3,
      1,
      AttackSprite.FAIRY_MELEE,
      2,
      70,
      Ability.BITE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class TypeNull extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TYPE_NULL,
      [Synergy.NORMAL],
      Rarity.EPIC,
      Pkm.GRANBULL,
      65,
      6,
      3,
      2,
      1,
      AttackSprite.FAIRY_MELEE,
      1,
      70,
      Ability.DEFAULT,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Sylvally extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SILVALLY,
      [Synergy.NORMAL],
      Rarity.EPIC,
      Pkm.DEFAULT,
      130,
      11,
      6,
      3,
      1,
      AttackSprite.FAIRY_MELEE,
      2,
      70,
      Ability.DEFAULT,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Applin extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.APPLIN,
      [Synergy.DRAGON, Synergy.GRASS],
      Rarity.EPIC,
      Pkm.APPLETUN,
      130,
      6,
      5,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      1,
      85,
      Ability.APPLE_ACID,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Appletun extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.APPLETUN,
      [Synergy.DRAGON, Synergy.GRASS],
      Rarity.EPIC,
      Pkm.DEFAULT,
      250,
      16,
      8,
      6,
      1,
      AttackSprite.GRASS_MELEE,
      2,
      85,
      Ability.APPLE_ACID,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Staryu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STARYU,
      [Synergy.WATER, Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.STARMIE,
      80,
      7,
      2,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.PSYCHIC,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Starmie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STARMIE,
      [Synergy.WATER, Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      20,
      2,
      6,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      100,
      Ability.PSYCHIC,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Vulpix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VULPIX,
      [Synergy.FIRE, Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.NINETALES,
      75,
      7,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      100,
      Ability.FIRE_SPIN,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Ninetales extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NINETALES,
      [Synergy.FIRE, Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      170,
      20,
      3,
      5,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      100,
      Ability.FIRE_SPIN,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class AlolanVulpix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_VULPIX,
      [Synergy.ICE, Synergy.FAIRY],
      Rarity.RARE,
      Pkm.ALOLAN_NINETALES,
      75,
      7,
      2,
      2,
      2,
      AttackSprite.ICE_RANGE,
      1,
      85,
      Ability.AURORA_VEIL,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class AlolanNinetales extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_NINETALES,
      [Synergy.ICE, Synergy.FAIRY],
      Rarity.RARE,
      Pkm.DEFAULT,
      170,
      20,
      5,
      5,
      2,
      AttackSprite.ICE_RANGE,
      2,
      85,
      Ability.AURORA_VEIL,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Snom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SNOM,
      [Synergy.BUG, Synergy.ICE],
      Rarity.RARE,
      Pkm.FROSMOTH,
      70,
      8,
      2,
      2,
      2,
      AttackSprite.ICE_RANGE,
      1,
      80,
      Ability.BUG_BUZZ,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Frosmoth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FROSMOTH,
      [Synergy.BUG, Synergy.ICE],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      20,
      3,
      3,
      2,
      AttackSprite.ICE_RANGE,
      2,
      80,
      Ability.BUG_BUZZ,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Wailmer extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WAILMER,
      [Synergy.WATER, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.WAILORD,
      180,
      6,
      2,
      2,
      1,
      AttackSprite.WATER_MELEE,
      1,
      110,
      Ability.DIVE,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Wailord extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WAILORD,
      [Synergy.WATER, Synergy.SOUND],
      Rarity.EPIC,
      Pkm.DEFAULT,
      400,
      11,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      2,
      110,
      Ability.DIVE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Dreepy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DREEPY,
      [Synergy.DRAGON, Synergy.GHOST],
      Rarity.HATCH,
      Pkm.DRAKLOAK,
      90,
      5,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      1,
      80,
      Ability.DRAGON_DARTS,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Drakloak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DRAKLOAK,
      [Synergy.DRAGON, Synergy.GHOST],
      Rarity.HATCH,
      Pkm.DRAGAPULT,
      140,
      12,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      2,
      80,
      Ability.DRAGON_DARTS,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Dragapult extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DRAGAPULT,
      [Synergy.DRAGON, Synergy.GHOST],
      Rarity.HATCH,
      Pkm.DEFAULT,
      190,
      22,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      3,
      80,
      Ability.DRAGON_DARTS,
      shiny,
      emotion,
      true
    )
  }
}

export class Snivy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SNIVY,
      [Synergy.GRASS, Synergy.FIELD],
      Rarity.HATCH,
      Pkm.SERVINE,
      90,
      5,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      1,
      70,
      Ability.MAGICAL_LEAF,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Servine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SERVINE,
      [Synergy.GRASS, Synergy.FIELD],
      Rarity.HATCH,
      Pkm.SERPERIOR,
      160,
      11,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      2,
      70,
      Ability.MAGICAL_LEAF,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Serperior extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SERPERIOR,
      [Synergy.GRASS, Synergy.FIELD],
      Rarity.HATCH,
      Pkm.DEFAULT,
      240,
      24,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      3,
      70,
      Ability.MAGICAL_LEAF,
      shiny,
      emotion,
      true
    )
  }
}

export class Starly extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STARLY,
      [Synergy.NORMAL, Synergy.FLYING],
      Rarity.HATCH,
      Pkm.STARAVIA,
      75,
      6,
      3,
      3,
      1,
      AttackSprite.FLYING_MELEE,
      1,
      100,
      Ability.BRAVE_BIRD,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Staravia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STARAVIA,
      [Synergy.NORMAL, Synergy.FLYING],
      Rarity.HATCH,
      Pkm.STARAPTOR,
      130,
      12,
      5,
      5,
      1,
      AttackSprite.FLYING_MELEE,
      2,
      100,
      Ability.BRAVE_BIRD,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Staraptor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STARAPTOR,
      [Synergy.NORMAL, Synergy.FLYING],
      Rarity.HATCH,
      Pkm.DEFAULT,
      180,
      20,
      7,
      7,
      1,
      AttackSprite.FLYING_MELEE,
      3,
      100,
      Ability.BRAVE_BIRD,
      shiny,
      emotion,
      true
    )
  }
}

export class Scorbunny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SCORBUNNY,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.HATCH,
      Pkm.RABOOT,
      75,
      6,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      1,
      35,
      Ability.PYRO_BALL,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Raboot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RABOOT,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.HATCH,
      Pkm.CINDERACE,
      130,
      12,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      2,
      35,
      Ability.PYRO_BALL,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Cinderace extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CINDERACE,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.HATCH,
      Pkm.DEFAULT,
      180,
      20,
      7,
      7,
      1,
      AttackSprite.FIRE_MELEE,
      3,
      50,
      Ability.PYRO_BALL,
      shiny,
      emotion,
      true
    )
  }
}

export class AlolanGeodude extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_GEODUDE,
      [Synergy.ELECTRIC, Synergy.ROCK],
      Rarity.HATCH,
      Pkm.ALOLAN_GRAVELER,
      100,
      5,
      3,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.DISCHARGE,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class AlolanGraveler extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_GRAVELER,
      [Synergy.ELECTRIC, Synergy.ROCK],
      Rarity.HATCH,
      Pkm.ALOLAN_GOLEM,
      180,
      10,
      5,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.DISCHARGE,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class AlolanGolem extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_GOLEM,
      [Synergy.ELECTRIC, Synergy.ROCK],
      Rarity.HATCH,
      Pkm.DEFAULT,
      250,
      20,
      7,
      7,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      100,
      Ability.DISCHARGE,
      shiny,
      emotion,
      true
    )
  }
}

export class Popplio extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.POPPLIO,
      [Synergy.WATER, Synergy.FAIRY, Synergy.SOUND],
      Rarity.HATCH,
      Pkm.BRIONNE,
      65,
      5,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.SPARKLING_ARIA,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Brionne extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BRIONNE,
      [Synergy.WATER, Synergy.FAIRY, Synergy.SOUND],
      Rarity.HATCH,
      Pkm.PRIMARINA,
      130,
      9,
      2,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      2,
      100,
      Ability.SPARKLING_ARIA,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Primarina extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PRIMARINA,
      [Synergy.WATER, Synergy.FAIRY, Synergy.SOUND],
      Rarity.HATCH,
      Pkm.DEFAULT,
      190,
      20,
      2,
      4,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      100,
      Ability.SPARKLING_ARIA,
      shiny,
      emotion,
      true
    )
  }
}

export class Gothita extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOTHITA,
      [Synergy.PSYCHIC, Synergy.DARK, Synergy.HUMAN],
      Rarity.HATCH,
      Pkm.GOTHORITA,
      70,
      5,
      1,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      1,
      80,
      Ability.FAKE_TEARS,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Gothorita extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOTHORITA,
      [Synergy.PSYCHIC, Synergy.DARK, Synergy.HUMAN],
      Rarity.HATCH,
      Pkm.GOTHITELLE,
      120,
      12,
      1,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      2,
      80,
      Ability.FAKE_TEARS,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Gothitelle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GOTHITELLE,
      [Synergy.PSYCHIC, Synergy.DARK, Synergy.HUMAN],
      Rarity.HATCH,
      Pkm.DEFAULT,
      190,
      20,
      1,
      4,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      80,
      Ability.FAKE_TEARS,
      shiny,
      emotion,
      true
    )
  }
}

export class Sandshrew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SANDSHREW,
      [Synergy.GROUND, Synergy.NORMAL],
      Rarity.UNCOMMON,
      Pkm.SANDSLASH,
      90,
      4,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      80,
      Ability.SPIKE_ARMOR,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Sandslash extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SANDSLASH,
      [Synergy.GROUND, Synergy.NORMAL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      180,
      10,
      5,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      80,
      Ability.SPIKE_ARMOR,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Nosepass extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NOSEPASS,
      [Synergy.ROCK, Synergy.ARTIFICIAL],
      Rarity.UNCOMMON,
      Pkm.PROBOPASS,
      60,
      5,
      3,
      3,
      2,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.MAGNET_RISE,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Probopass extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PROBOPASS,
      [Synergy.ROCK, Synergy.ARTIFICIAL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      120,
      10,
      8,
      8,
      2,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.MAGNET_RISE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Woobat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WOOBAT,
      [Synergy.FLYING, Synergy.SOUND, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.SWOOBAT,
      60,
      6,
      1,
      1,
      3,
      AttackSprite.FAIRY_RANGE,
      1,
      90,
      Ability.ATTRACT,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Swoobat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SWOOBAT,
      [Synergy.FLYING, Synergy.SOUND, Synergy.PSYCHIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      15,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      2,
      90,
      Ability.ATTRACT,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Pineco extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PINECO,
      [Synergy.BUG, Synergy.STEEL],
      Rarity.UNCOMMON,
      Pkm.FORRETRESS,
      75,
      5,
      3,
      3,
      1,
      AttackSprite.BUG_MELEE,
      1,
      120,
      Ability.EXPLOSION,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Forretress extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FORRETRESS,
      [Synergy.BUG, Synergy.STEEL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      200,
      5,
      5,
      3,
      1,
      AttackSprite.BUG_MELEE,
      2,
      120,
      Ability.EXPLOSION,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class UnownA extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_A,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_A,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}
export class UnownB extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_B,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      30,
      Ability.HIDDEN_POWER_B,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownC extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_C,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      60,
      Ability.HIDDEN_POWER_C,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownD extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_D,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      150,
      Ability.HIDDEN_POWER_D,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownE extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_E,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_E,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownF extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_F,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_F,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownG extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_G,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_G,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownH extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_H,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      80,
      Ability.HIDDEN_POWER_H,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownI extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_I,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_I,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownJ extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_J,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_J,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownK extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_K,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_K,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownL extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_L,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_L,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownM extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_M,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      50,
      Ability.HIDDEN_POWER_M,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownN extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_N,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_N,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_O,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_O,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownP extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_P,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_P,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownQ extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_Q,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      200,
      Ability.HIDDEN_POWER_Q,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownR extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_R,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_R,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownS extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_S,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_S,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownT extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_T,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      80,
      Ability.HIDDEN_POWER_T,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownU extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_U,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      80,
      Ability.HIDDEN_POWER_U,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownV extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_V,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_V,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownW extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_W,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_W,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownX extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_X,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_X,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownY extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_Y,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      50,
      Ability.HIDDEN_POWER_Y,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownZ extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_Z,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_Z,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownQuestion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_QUESTION,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_QM,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class UnownExclamation extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UNOWN_EXCLAMATION,
      [Synergy.PSYCHIC],
      Rarity.SPECIAL,
      Pkm.DEFAULT,
      100,
      1,
      1,
      1,
      9,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.HIDDEN_POWER_EM,
      shiny,
      emotion,
      false,
      false,
      Passive.UNOWN
    )
  }
}

export class Diglett extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DIGLETT,
      [Synergy.GROUND, Synergy.NORMAL],
      Rarity.UNCOMMON,
      Pkm.DUGTRIO,
      75,
      6,
      2,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      50,
      Ability.DIG,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Dugtrio extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DUGTRIO,
      [Synergy.GROUND, Synergy.NORMAL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      160,
      14,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      50,
      Ability.DIG,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Rowlet extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ROWLET,
      [Synergy.GRASS, Synergy.FLYING, Synergy.GHOST],
      Rarity.HATCH,
      Pkm.DARTIX,
      70,
      5,
      2,
      2,
      3,
      AttackSprite.GRASS_MELEE,
      1,
      80,
      Ability.SPIRIT_SHACKLE,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Dartix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DARTIX,
      [Synergy.GRASS, Synergy.FLYING, Synergy.GHOST],
      Rarity.HATCH,
      Pkm.DECIDUEYE,
      130,
      9,
      2,
      3,
      3,
      AttackSprite.GRASS_MELEE,
      2,
      80,
      Ability.SPIRIT_SHACKLE,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Decidueye extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DECIDUEYE,
      [Synergy.GRASS, Synergy.FLYING, Synergy.GHOST],
      Rarity.HATCH,
      Pkm.DEFAULT,
      190,
      18,
      2,
      4,
      3,
      AttackSprite.GRASS_MELEE,
      3,
      80,
      Ability.SPIRIT_SHACKLE,
      shiny,
      emotion,
      true
    )
  }
}

export class Zorua extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZORUA,
      [Synergy.DARK, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.ZOROARK,
      70,
      6,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.ILLUSION,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Zoroark extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZOROARK,
      [Synergy.DARK, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      140,
      15,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      100,
      Ability.ILLUSION,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class HisuiZorua extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HISUI_ZORUA,
      [Synergy.NORMAL, Synergy.GHOST],
      Rarity.UNCOMMON,
      Pkm.HISUI_ZOROARK,
      70,
      6,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.ILLUSION,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class HisuiZoroark extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HISUI_ZOROARK,
      [Synergy.NORMAL, Synergy.GHOST],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      140,
      15,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      100,
      Ability.ILLUSION,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Grimer extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GRIMER,
      [Synergy.POISON, Synergy.MONSTER],
      Rarity.UNCOMMON,
      Pkm.MUK,
      90,
      5,
      3,
      2,
      1,
      AttackSprite.POISON_MELEE,
      1,
      100,
      Ability.SLUDGE,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Muk extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MUK,
      [Synergy.POISON, Synergy.MONSTER],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      190,
      10,
      6,
      4,
      1,
      AttackSprite.POISON_MELEE,
      2,
      100,
      Ability.SLUDGE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class AlolanGrimer extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_GRIMER,
      [Synergy.POISON, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.ALOLAN_MUK,
      80,
      7,
      2,
      2,
      1,
      AttackSprite.POISON_MELEE,
      1,
      100,
      Ability.SLUDGE,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class AlolanMuk extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_MUK,
      [Synergy.POISON, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      160,
      15,
      6,
      4,
      1,
      AttackSprite.POISON_MELEE,
      2,
      100,
      Ability.SLUDGE,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Ekans extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.EKANS,
      [Synergy.POISON, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.ARBOK,
      60,
      8,
      2,
      2,
      1,
      AttackSprite.POISON_MELEE,
      1,
      90,
      Ability.VENOSHOCK,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Arbok extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARBOK,
      [Synergy.POISON, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      18,
      4,
      4,
      1,
      AttackSprite.POISON_MELEE,
      2,
      90,
      Ability.VENOSHOCK,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Carvanha extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CARVANHA,
      [Synergy.WATER, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.SHARPEDO,
      75,
      10,
      1,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      40,
      Ability.AGILITY,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Sharpedo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHARPEDO,
      [Synergy.WATER, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      21,
      2,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      40,
      Ability.AGILITY,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Froakie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FROAKIE,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.DARK],
      Rarity.HATCH,
      Pkm.FROGADIER,
      80,
      7,
      2,
      2,
      1,
      AttackSprite.WATER_MELEE,
      1,
      80,
      Ability.WATER_SHURIKEN,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Frogadier extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FROGADIER,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.DARK],
      Rarity.HATCH,
      Pkm.GRENINJA,
      140,
      14,
      3,
      4,
      1,
      AttackSprite.WATER_RANGE,
      2,
      80,
      Ability.WATER_SHURIKEN,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Greninja extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GRENINJA,
      [Synergy.WATER, Synergy.AQUATIC, Synergy.DARK],
      Rarity.HATCH,
      Pkm.DEFAULT,
      200,
      23,
      4,
      6,
      1,
      AttackSprite.WATER_RANGE,
      3,
      80,
      Ability.WATER_SHURIKEN,
      shiny,
      emotion,
      true
    )
  }
}

export class Chingling extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHINGLING,
      [Synergy.SOUND, Synergy.PSYCHIC, Synergy.BABY],
      Rarity.UNIQUE,
      Pkm.CHIMECHO,
      180,
      8,
      2,
      4,
      3,
      AttackSprite.PSYCHIC_RANGE,
      2,
      80,
      Ability.ECHO,
      shiny,
      emotion,
      false,
      false,
      Passive.CHINGLING
    )
  }
}

export class Chimecho extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHIMECHO,
      [Synergy.SOUND, Synergy.PSYCHIC],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      15,
      3,
      6,
      3,
      AttackSprite.PSYCHIC_RANGE,
      3,
      80,
      Ability.ECHO,
      shiny,
      emotion,
      true,
      false,
      Passive.CHIMECHO
    )
  }
}

export class Tyrogue extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TYROGUE,
      [Synergy.FIGHTING, Synergy.BABY],
      Rarity.UNIQUE,
      Pkm.HITMONTOP,
      150,
      10,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      2,
      100,
      Ability.MACH_PUNCH,
      shiny,
      emotion,
      false,
      false,
      Passive.TYROGUE
    )
  }
}

export class Hitmontop extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HITMONTOP,
      [Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      22,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      75,
      Ability.TRIPLE_KICK,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Hitmonlee extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HITMONLEE,
      [Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      180,
      25,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      100,
      Ability.MAWASHI_GERI,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Hitmonchan extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HITMONCHAN,
      [Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      180,
      20,
      7,
      7,
      1,
      AttackSprite.FIGHTING_MELEE,
      3,
      100,
      Ability.UPPERCUT,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Mimikyu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MIMIKYU,
      [Synergy.GHOST, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      4,
      3,
      1,
      AttackSprite.FAIRY_MELEE,
      3,
      40,
      Ability.SHADOW_SNEAK,
      shiny,
      emotion,
      true
    )
  }
}

export class Bonsley extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BONSLEY,
      [Synergy.ROCK, Synergy.FLORA, Synergy.BABY],
      Rarity.EPIC,
      Pkm.SUDOWOODO,
      125,
      8,
      5,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      1,
      100,
      Ability.MIMIC,
      shiny,
      emotion,
      false,
      true,
      Passive.SUDOWOODO
    )
  }
}

export class Sudowoodo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SUDOWOODO,
      [Synergy.ROCK, Synergy.FLORA, Synergy.MONSTER],
      Rarity.EPIC,
      Pkm.DEFAULT,
      250,
      16,
      6,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      2,
      100,
      Ability.MIMIC,
      shiny,
      emotion,
      true,
      true,
      Passive.SUDOWOODO
    )
  }
}

export class Combee extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.COMBEE,
      [Synergy.BUG, Synergy.FLORA],
      Rarity.EPIC,
      Pkm.VESPIQUEEN,
      120,
      8,
      3,
      3,
      1,
      AttackSprite.BUG_MELEE,
      1,
      90,
      Ability.HEAL_ORDER,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Vespiqueen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VESPIQUEEN,
      [Synergy.BUG, Synergy.FLORA],
      Rarity.EPIC,
      Pkm.DEFAULT,
      210,
      20,
      4,
      4,
      1,
      AttackSprite.BUG_MELEE,
      2,
      90,
      Ability.HEAL_ORDER,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Shuckle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHUCKLE,
      [Synergy.BUG, Synergy.ROCK],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      150,
      4,
      15,
      15,
      1,
      AttackSprite.ROCK_MELEE,
      3,
      70,
      Ability.SHELL_TRAP,
      shiny,
      emotion,
      true
    )
  }
}

export class Tepig extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TEPIG,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.FIELD],
      Rarity.HATCH,
      Pkm.PIGNITE,
      80,
      5,
      4,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      100,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Pignite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PIGNITE,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.FIELD],
      Rarity.HATCH,
      Pkm.EMBOAR,
      140,
      12,
      5,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      100,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      false,
      false,
      Passive.HATCH
    )
  }
}

export class Emboar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.EMBOAR,
      [Synergy.FIRE, Synergy.FIGHTING, Synergy.FIELD],
      Rarity.HATCH,
      Pkm.DEFAULT,
      220,
      18,
      6,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      100,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Wurmple extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WURMPLE,
      [Synergy.BUG],
      Rarity.EPIC,
      Pkm.SILCOON,
      110,
      10,
      3,
      3,
      1,
      AttackSprite.BUG_MELEE,
      1,
      100,
      Ability.STICKY_WEB,
      shiny,
      emotion,
      false,
      false,
      Passive.WURMPLE
    )
  }
}

export class Silcoon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SILCOON,
      [Synergy.BUG, Synergy.NORMAL],
      Rarity.EPIC,
      Pkm.BEAUTIFLY,
      180,
      20,
      6,
      6,
      1,
      AttackSprite.BUG_MELEE,
      2,
      100,
      Ability.SPIKE_ARMOR,
      shiny,
      emotion,
      false,
      false
    )
  }
}

export class Beautifly extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BEAUTIFLY,
      [Synergy.BUG, Synergy.NORMAL, Synergy.FLYING],
      Rarity.EPIC,
      Pkm.DEFAULT,
      250,
      30,
      6,
      6,
      1,
      AttackSprite.BUG_MELEE,
      3,
      60,
      Ability.SILVER_WIND,
      shiny,
      emotion,
      true,
      false
    )
  }
}

export class Cascoon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASCOON,
      [Synergy.BUG, Synergy.POISON],
      Rarity.EPIC,
      Pkm.DUSTOX,
      180,
      20,
      6,
      6,
      1,
      AttackSprite.BUG_MELEE,
      2,
      100,
      Ability.SPIKE_ARMOR,
      shiny,
      emotion,
      false,
      false
    )
  }
}

export class Dustox extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DUSTOX,
      [Synergy.BUG, Synergy.POISON, Synergy.FLYING],
      Rarity.EPIC,
      Pkm.DEFAULT,
      250,
      30,
      6,
      6,
      1,
      AttackSprite.BUG_MELEE,
      3,
      60,
      Ability.POISON_POWDER,
      shiny,
      emotion,
      false,
      false
    )
  }
}

export class Tinkatink extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TINKATINK,
      [Synergy.STEEL, Synergy.FAIRY],
      Rarity.EPIC,
      Pkm.TINKATUFF,
      100,
      11,
      3,
      3,
      1,
      AttackSprite.FAIRY_MELEE,
      1,
      150,
      Ability.GIGATON_HAMMER,
      shiny,
      emotion,
      false
    )
  }
}

export class Tinkatuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TINKATUFF,
      [Synergy.STEEL, Synergy.FAIRY],
      Rarity.EPIC,
      Pkm.TINKATON,
      200,
      22,
      4,
      4,
      1,
      AttackSprite.FAIRY_MELEE,
      2,
      150,
      Ability.GIGATON_HAMMER,
      shiny,
      emotion,
      false
    )
  }
}

export class Tinkaton extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TINKATON,
      [Synergy.STEEL, Synergy.FAIRY],
      Rarity.EPIC,
      Pkm.DEFAULT,
      300,
      44,
      8,
      8,
      1,
      AttackSprite.FAIRY_MELEE,
      3,
      150,
      Ability.GIGATON_HAMMER,
      shiny,
      emotion,
      true
    )
  }
}

export class Maractus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MARACTUS,
      [Synergy.GRASS, Synergy.GROUND, Synergy.FLORA],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      12,
      6,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      100,
      Ability.SPIKE_ARMOR,
      shiny,
      emotion,
      false,
      false,
      Passive.HYDRATATION
    )
  }
}

export class Plusle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PLUSLE,
      [Synergy.ELECTRIC, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      140,
      13,
      3,
      3,
      1,
      AttackSprite.ELECTRIC_MELEE,
      3,
      60,
      Ability.LINK_CABLE,
      shiny,
      emotion,
      false,
      false
    )
  }
}

export class Minun extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MINUN,
      [Synergy.ELECTRIC, Synergy.FAIRY],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      140,
      13,
      3,
      3,
      1,
      AttackSprite.ELECTRIC_MELEE,
      3,
      60,
      Ability.LINK_CABLE,
      shiny,
      emotion,
      false,
      false
    )
  }
}

export class Spectrier extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SPECTRIER,
      [Synergy.GHOST, Synergy.FIELD],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      280,
      25,
      5,
      10,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      100,
      Ability.ASTRAL_BARRAGE,
      shiny,
      emotion,
      false,
      false,
      Passive.GRIM_NEIGH
    )
  }
}

export class Kartana extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KARTANA,
      [Synergy.GRASS, Synergy.STEEL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      200,
      40,
      10,
      1,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      95,
      Ability.LEAF_BLADE,
      shiny,
      emotion,
      false,
      false,
      Passive.BEAST_BOOST
    )
  }
}

export class Dhelmise extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DHELMISE,
      [Synergy.GRASS, Synergy.GHOST, Synergy.STEEL],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      18,
      5,
      5,
      1,
      AttackSprite.GRASS_MELEE,
      3,
      80,
      Ability.ANCHOR_SHOT,
      shiny,
      emotion,
      true
    )
  }
}

export class Koffing extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KOFFING,
      [Synergy.POISON, Synergy.ARTIFICIAL],
      Rarity.UNCOMMON,
      Pkm.WEEZING,
      85,
      5,
      3,
      3,
      1,
      AttackSprite.POISON_MELEE,
      1,
      40,
      Ability.SMOG,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Weezing extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WEEZING,
      [Synergy.POISON, Synergy.ARTIFICIAL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      190,
      10,
      5,
      5,
      1,
      AttackSprite.POISON_MELEE,
      2,
      40,
      Ability.SMOG,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Clauncher extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLAUNCHER,
      [Synergy.WATER, Synergy.SOUND],
      Rarity.RARE,
      Pkm.CLAWITZER,
      80,
      7,
      1,
      1,
      4,
      AttackSprite.PSYCHIC_RANGE,
      1,
      200,
      Ability.WATER_PULSE,
      shiny,
      emotion,
      false,
      true,
      Passive.MEGA_LAUNCHER
    )
  }
}

export class Clawitzer extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLAWITZER,
      [Synergy.WATER, Synergy.SOUND],
      Rarity.RARE,
      Pkm.DEFAULT,
      140,
      15,
      3,
      2,
      4,
      AttackSprite.PSYCHIC_RANGE,
      2,
      200,
      Ability.WATER_PULSE,
      shiny,
      emotion,
      true,
      true,
      Passive.MEGA_LAUNCHER
    )
  }
}

export class Yanma extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.YANMA,
      [Synergy.BUG, Synergy.FOSSIL, Synergy.FLYING],
      Rarity.RARE,
      Pkm.YANMEGA,
      70,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      100,
      Ability.AERIAL_ACE,
      shiny,
      emotion,
      false,
      true,
      Passive.CLEAR_WING
    )
  }
}

export class Yanmega extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.YANMEGA,
      [Synergy.BUG, Synergy.FOSSIL, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      160,
      16,
      2,
      2,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      100,
      Ability.AERIAL_ACE,
      shiny,
      emotion,
      true,
      true,
      Passive.CLEAR_WING
    )
  }
}

export class Helioptile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HELIOPTILE,
      [Synergy.NORMAL, Synergy.ELECTRIC, Synergy.LIGHT],
      Rarity.EPIC,
      Pkm.HELIOLISK,
      90,
      10,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      1,
      80,
      Ability.PARABOLIC_CHARGE,
      shiny,
      emotion,
      false,
      true,
      Passive.DRY_SKIN
    )
  }
}

export class Heliolisk extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HELIOLISK,
      [Synergy.NORMAL, Synergy.ELECTRIC, Synergy.LIGHT],
      Rarity.EPIC,
      Pkm.DEFAULT,
      220,
      22,
      4,
      4,
      3,
      AttackSprite.ELECTRIC_RANGE,
      2,
      80,
      Ability.PARABOLIC_CHARGE,
      shiny,
      emotion,
      true,
      true,
      Passive.DRY_SKIN
    )
  }
}

export class Bidoof extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BIDOOF,
      [Synergy.NORMAL, Synergy.FIELD, Synergy.AQUATIC],
      Rarity.UNCOMMON,
      Pkm.BIBAREL,
      60,
      6,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      90,
      Ability.SUPER_FANG,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Bibarel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BIBAREL,
      [Synergy.NORMAL, Synergy.FIELD, Synergy.AQUATIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      135,
      15,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      80,
      Ability.SUPER_FANG,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Spinda extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SPINDA,
      [Synergy.NORMAL, Synergy.HUMAN, Synergy.SOUND],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      200,
      20,
      5,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
      3,
      100,
      Ability.TEETER_DANCE,
      shiny,
      emotion,
      true,
      false,
      Passive.SPOT_PANDA
    )
  }
}

export class Baltoy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BALTOY,
      [Synergy.GROUND, Synergy.PSYCHIC, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.CLAYDOL,
      80,
      8,
      4,
      4,
      2,
      AttackSprite.PSYCHIC_RANGE,
      1,
      70,
      Ability.CONFUSION,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Claydol extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLAYDOL,
      [Synergy.GROUND, Synergy.PSYCHIC, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.DEFAULT,
      150,
      16,
      6,
      6,
      2,
      AttackSprite.PSYCHIC_RANGE,
      2,
      70,
      Ability.CONFUSION,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Purrloin extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PURRLOIN,
      [Synergy.DARK, Synergy.FIELD],
      Rarity.RARE,
      Pkm.LIEPARD,
      80,
      9,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      1,
      90,
      Ability.ASSIST,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Liepard extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LIEPARD,
      [Synergy.DARK, Synergy.FIELD],
      Rarity.RARE,
      Pkm.DEFAULT,
      175,
      22,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      2,
      90,
      Ability.ASSIST,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Barboach extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BARBOACH,
      [Synergy.WATER, Synergy.GROUND],
      Rarity.EPIC,
      Pkm.WHISCASH,
      120,
      9,
      3,
      4,
      1,
      AttackSprite.WATER_MELEE,
      1,
      90,
      Ability.FISSURE,
      shiny,
      emotion,
      false,
      true,
      Passive.AQUA_VEIL
    )
  }
}

export class Whiscash extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.WHISCASH,
      [Synergy.WATER, Synergy.GROUND],
      Rarity.EPIC,
      Pkm.DEFAULT,
      250,
      22,
      4,
      5,
      1,
      AttackSprite.WATER_MELEE,
      2,
      90,
      Ability.FISSURE,
      shiny,
      emotion,
      true,
      true,
      Passive.AQUA_VEIL
    )
  }
}

export class Scraggy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SCRAGGY,
      [Synergy.DARK, Synergy.FIGHTING],
      Rarity.UNCOMMON,
      Pkm.SCRAFTY,
      70,
      8,
      2,
      2,
      1,
      AttackSprite.FIGHTING_MELEE,
      1,
      85,
      Ability.ASSURANCE,
      shiny,
      emotion,
      false,
      true,
      Passive.MOXIE
    )
  }
}

export class Scrafty extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SCRAFTY,
      [Synergy.DARK, Synergy.FIGHTING],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      140,
      18,
      4,
      4,
      1,
      AttackSprite.FIGHTING_MELEE,
      2,
      85,
      Ability.ASSURANCE,
      shiny,
      emotion,
      true,
      true,
      Passive.MOXIE
    )
  }
}

export class Finneon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.FINNEON,
      [Synergy.WATER, Synergy.LIGHT],
      Rarity.RARE,
      Pkm.LUMINEON,
      75,
      7,
      2,
      2,
      2,
      AttackSprite.WATER_RANGE,
      1,
      90,
      Ability.AQUA_RING,
      shiny,
      emotion,
      false,
      true
    )
  }
}

export class Lumineon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LUMINEON,
      [Synergy.WATER, Synergy.LIGHT],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      16,
      4,
      4,
      2,
      AttackSprite.WATER_RANGE,
      2,
      85,
      Ability.AQUA_RING,
      shiny,
      emotion,
      true,
      true
    )
  }
}

export class Stunky extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STUNKY,
      [Synergy.DARK, Synergy.POISON],
      Rarity.EPIC,
      Pkm.SKUNTANK,
      125,
      10,
      2,
      2,
      1,
      AttackSprite.POISON_MELEE,
      1,
      80,
      Ability.POISON_GAS,
      shiny,
      emotion,
      false,
      true,
      Passive.STENCH
    )
  }
}

export class Skuntank extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SKUNTANK,
      [Synergy.DARK, Synergy.POISON],
      Rarity.EPIC,
      Pkm.DEFAULT,
      280,
      22,
      4,
      4,
      1,
      AttackSprite.POISON_MELEE,
      2,
      80,
      Ability.POISON_GAS,
      shiny,
      emotion,
      true,
      true,
      Passive.STENCH
    )
  }
}

export class Illumise extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ILLUMISE,
      [Synergy.FLYING, Synergy.BUG, Synergy.LIGHT],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      150,
      13,
      3,
      3,
      1,
      AttackSprite.BUG_MELEE,
      3,
      90,
      Ability.STRUGGLE_BUG,
      shiny,
      emotion,
      true,
      false,
      Passive.ILLUMISE_VOLBEAT
    )
  }
}

export class Volbeat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VOLBEAT,
      [Synergy.FLYING, Synergy.BUG, Synergy.LIGHT],
      Rarity.UNIQUE,
      Pkm.DEFAULT,
      150,
      13,
      3,
      3,
      1,
      AttackSprite.BUG_MELEE,
      3,
      90,
      Ability.TAIL_GLOW,
      shiny,
      emotion,
      true,
      false,
      Passive.ILLUMISE_VOLBEAT
    )
  }
}

export class Necrozma extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NECROZMA,
      [Synergy.LIGHT, Synergy.PSYCHIC],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      3,
      100,
      Ability.PRISMATIC_LASER,
      shiny,
      emotion,
      true,
      false,
      Passive.PRISM
    )
  }

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
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ULTRA_NECROZMA,
      [Synergy.DRAGON, Synergy.LIGHT, Synergy.PSYCHIC],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      250,
      30,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      3,
      150,
      Ability.PRISMATIC_LASER,
      shiny,
      emotion,
      true,
      false,
      Passive.PRISM
    )
  }

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
