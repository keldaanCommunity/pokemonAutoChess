/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { Schema, type, ArraySchema, SetSchema } from "@colyseus/schema"
import { nanoid } from "nanoid"
import { Emotion, IPokemon, AttackSprite } from "../../types"
import { PkmCost } from "../../types/Config"
import { Item } from "../../types/enum/Item"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Rarity, AttackType } from "../../types/enum/Game"
import { Ability } from "../../types/enum/Ability"
import { Synergy } from "../../types/enum/Synergy"

export class Pokemon extends Schema implements IPokemon {
  @type("string") id: string
  @type("string") name: Pkm
  @type(["string"]) types = new ArraySchema<Synergy>()
  @type("string") rarity: Rarity
  @type("string") index: string
  @type("string") evolution: Pkm
  @type("int8") positionX = -1
  @type("int8") positionY = -1
  @type("uint8") cost: number
  @type("string") attackSprite: AttackSprite
  @type("float32") atkSpeed = 0.75
  @type("uint8") def: number
  @type("uint8") speDef: number
  @type("uint8") attackType: AttackType
  @type("uint16") atk: number
  @type("uint16") hp: number
  @type("uint8") range: number
  @type("uint8") stars: number
  @type("uint8") maxMana: number
  @type("string") skill: Ability
  @type({ set: "string" }) items = new SetSchema<Item>()
  @type("boolean") shiny: boolean
  @type("string") emotion: Emotion
  fossilTimer: number | undefined
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
    attackType: AttackType,
    stars: number,
    maxMana: number,
    skill: Ability,
    shiny: boolean,
    emotion: Emotion,
    final: boolean,
    additional?: boolean
  ) {
    super()
    this.id = nanoid()
    this.name = name
    this.rarity = rarity
    this.index = PkmIndex[name]
    this.evolution = evolution
    this.cost = PkmCost[rarity]
    this.hp = hp
    this.atk = atk
    this.def = def
    this.speDef = speDef
    this.range = range
    this.attackSprite = attackSprite
    this.attackType = attackType
    this.stars = stars
    this.maxMana = maxMana
    this.skill = skill
    this.shiny = shiny
    this.emotion = emotion
    this.final = final
    this.additional = !!additional
    types.forEach((type) => {
      this.types.push(type)
    })

    if (this.types.includes(Synergy.FOSSIL) && this.evolution != Pkm.DEFAULT) {
      this.fossilTimer = 4
    }
  }
}

export class Ditto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DITTO,
      [Synergy.NORMAL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      30,
      1,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Electrike extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ELECTRIKE,
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.LEGENDARY,
      Pkm.MANECTRIC,
      110,
      5,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.LEGENDARY,
      Pkm.MEGA_MANECTRIC,
      150,
      11,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      300,
      17,
      7,
      7,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.LEGENDARY,
      Pkm.BANETTE,
      100,
      5,
      3,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      1,
      150,
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
      Rarity.LEGENDARY,
      Pkm.MEGA_BANETTE,
      140,
      11,
      4,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      150,
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
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      240,
      21,
      5,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      3,
      150,
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
      [Synergy.FIGHTING, Synergy.HUMAN, Synergy.METAL],
      Rarity.LEGENDARY,
      Pkm.LUCARIO,
      90,
      5,
      3,
      3,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.PHYSICAL,
      1,
      60,
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
      [Synergy.FIGHTING, Synergy.HUMAN, Synergy.METAL],
      Rarity.LEGENDARY,
      Pkm.MEGA_LUCARIO,
      130,
      11,
      3,
      3,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.PHYSICAL,
      2,
      60,
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
      [Synergy.FIGHTING, Synergy.HUMAN, Synergy.METAL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      230,
      21,
      3,
      3,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.PHYSICAL,
      3,
      60,
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
      [Synergy.FAIRY, Synergy.DRAGON, Synergy.SOUND],
      Rarity.LEGENDARY,
      Pkm.ALTARIA,
      90,
      5,
      3,
      3,
      2,
      AttackSprite.DRAGON_RANGE,
      AttackType.PHYSICAL,
      1,
      110,
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
      [Synergy.FAIRY, Synergy.DRAGON, Synergy.SOUND],
      Rarity.LEGENDARY,
      Pkm.MEGA_ALTARIA,
      130,
      11,
      4,
      4,
      2,
      AttackSprite.DRAGON_RANGE,
      AttackType.PHYSICAL,
      2,
      110,
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
      [Synergy.FAIRY, Synergy.DRAGON, Synergy.SOUND],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      230,
      21,
      5,
      5,
      2,
      AttackSprite.DRAGON_RANGE,
      AttackType.PHYSICAL,
      3,
      110,
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
      Rarity.LEGENDARY,
      Pkm.SCIZOR,
      90,
      5,
      5,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.KING_SHIELD,
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
      [Synergy.BUG, Synergy.FLYING, Synergy.METAL],
      Rarity.LEGENDARY,
      Pkm.MEGA_SCIZOR,
      130,
      9,
      6,
      6,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.KING_SHIELD,
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
      [Synergy.BUG, Synergy.FLYING, Synergy.METAL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      230,
      20,
      7,
      7,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.KING_SHIELD,
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
      110,
      5,
      4,
      4,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
      1,
      90,
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
      150,
      8,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
      2,
      90,
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
      240,
      22,
      6,
      6,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.LEGENDARY,
      Pkm.LOPUNNY,
      110,
      5,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
      1,
      60,
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
      Rarity.LEGENDARY,
      Pkm.MEGA_LOPUNNY,
      150,
      9,
      6,
      6,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
      2,
      60,
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
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      250,
      25,
      7,
      7,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
      3,
      60,
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
      [Synergy.MINERAL, Synergy.GROUND, Synergy.METAL],
      Rarity.LEGENDARY,
      Pkm.STEELIX,
      150,
      5,
      7,
      7,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.IRON_DEFENSE,
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
      [Synergy.MINERAL, Synergy.GROUND, Synergy.METAL],
      Rarity.LEGENDARY,
      Pkm.MEGA_STEELIX,
      300,
      9,
      10,
      10,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.IRON_DEFENSE,
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
      [Synergy.MINERAL, Synergy.GROUND, Synergy.METAL],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      400,
      20,
      20,
      20,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.IRON_DEFENSE,
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
      Rarity.LEGENDARY,
      Pkm.CAMERUPT,
      90,
      5,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.BURN,
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
      Rarity.LEGENDARY,
      Pkm.MEGA_CAMERUPT,
      150,
      9,
      10,
      10,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.BURN,
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
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      230,
      20,
      15,
      15,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.BURN,
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
      Rarity.LEGENDARY,
      Pkm.MEDICHAM,
      90,
      5,
      5,
      5,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      1,
      90,
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
      Rarity.LEGENDARY,
      Pkm.MEGA_MEDICHAM,
      130,
      9,
      6,
      6,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      90,
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
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      230,
      20,
      7,
      7,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      3,
      90,
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
      [Synergy.ELECTRIC, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.ELECTABUZZ,
      90,
      5,
      4,
      4,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
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
      [Synergy.ELECTRIC, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.ELECTIVIRE,
      130,
      9,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      [Synergy.ELECTRIC, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      20,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
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
      90,
      5,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DRAGON_TAIL,
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
      130,
      9,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DRAGON_TAIL,
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
      230,
      20,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.DRAGON_TAIL,
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
      [Synergy.PSYCHIC, Synergy.METAL, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.METANG,
      90,
      5,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.PSYCHIC, Synergy.METAL, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.METAGROSS,
      130,
      9,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.PSYCHIC, Synergy.METAL, Synergy.ARTIFICIAL],
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      20,
      8,
      8,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      5,
      3,
      3,
      1,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DRACO_METEOR,
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
      130,
      9,
      3,
      3,
      1,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DRACO_METEOR,
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
      230,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.DRACO_METEOR,
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
      AttackType.PHYSICAL,
      1,
      100,
      Ability.CALM_MIND,
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
      9,
      3,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.CALM_MIND,
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
      18,
      4,
      8,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.CALM_MIND,
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
      [Synergy.GRASS, Synergy.POISON, Synergy.FLORA],
      Rarity.EPIC,
      Pkm.ROSELIA,
      90,
      5,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
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
      9,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      90,
      5,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.SEISMIC_TOSS,
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
      130,
      9,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.SEISMIC_TOSS,
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
      230,
      20,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.SEISMIC_TOSS,
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
      [Synergy.GHOST, Synergy.METAL, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.DOUBLADE,
      90,
      8,
      3,
      3,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GHOST, Synergy.METAL, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.AEGISLASH,
      130,
      8,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GHOST, Synergy.METAL, Synergy.ARTIFICIAL],
      Rarity.RARE,
      Pkm.DEFAULT,
      230,
      18,
      7,
      7,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.MONSTER, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.DEWOTT,
      90,
      8,
      4,
      4,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.MONSTER, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.SAMUROTT,
      130,
      9,
      6,
      6,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.MONSTER, Synergy.FIGHTING],
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      20,
      8,
      8,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.DARK, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.EPIC,
      Pkm.PUPITAR,
      90,
      8,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
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
      [Synergy.DARK, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.EPIC,
      Pkm.TYRANITAR,
      130,
      9,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      [Synergy.DARK, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      20,
      8,
      8,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
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
      90,
      5,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      1,
      110,
      Ability.DEFAULT,
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
      130,
      9,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      110,
      Ability.DEFAULT,
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
      230,
      20,
      8,
      8,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      3,
      110,
      Ability.DEFAULT,
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
      Rarity.LEGENDARY,
      Pkm.HAUNTER,
      90,
      8,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      1,
      135,
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
      Rarity.LEGENDARY,
      Pkm.GENGAR,
      130,
      12,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      2,
      135,
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
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      230,
      25,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      3,
      135,
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
      Rarity.EPIC,
      Pkm.KADABRA,
      90,
      5,
      2,
      4,
      4,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      Rarity.EPIC,
      Pkm.ALAKAZAM,
      130,
      9,
      3,
      5,
      4,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      18,
      4,
      8,
      4,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.GHOST],
      Rarity.EPIC,
      Pkm.LAMPENT,
      90,
      5,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DEFAULT,
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
      [Synergy.FIRE, Synergy.GHOST],
      Rarity.EPIC,
      Pkm.CHANDELURE,
      130,
      9,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DEFAULT,
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
      [Synergy.FIRE, Synergy.GHOST],
      Rarity.EPIC,
      Pkm.DEFAULT,
      230,
      18,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.DEFAULT,
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
      90,
      5,
      1,
      1,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.PHYSICAL,
      1,
      90,
      Ability.TRI_ATTACK,
      shiny,
      emotion,
      false
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
      130,
      9,
      1,
      1,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.PHYSICAL,
      2,
      90,
      Ability.TRI_ATTACK,
      shiny,
      emotion,
      false
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
      230,
      18,
      1,
      1,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.PHYSICAL,
      3,
      90,
      Ability.TRI_ATTACK,
      shiny,
      emotion,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
      1,
      100,
      Ability.STOMP,
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
      120,
      9,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.STOMP,
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
      220,
      20,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.STOMP,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.FIGHTING],
      Rarity.COMMON,
      Pkm.POLIWHIRL,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false
    )
  }
}

export class Poliwhirl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.POLIWHIRL,
      [Synergy.WATER, Synergy.FIGHTING],
      Rarity.COMMON,
      Pkm.POLITOED,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false
    )
  }
}

export class Politoed extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.POLITOED,
      [Synergy.WATER, Synergy.FIGHTING],
      Rarity.COMMON,
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      true
    )
  }
}

export class Magby extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGBY,
      [Synergy.FIRE, Synergy.HUMAN],
      Rarity.RARE,
      Pkm.MAGMAR,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
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
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      220,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
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
      Rarity.LEGENDARY,
      Pkm.DUOSION,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      1,
      65,
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
      Rarity.LEGENDARY,
      Pkm.REUNICLUS,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      65,
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
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      3,
      65,
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
      5,
      4,
      4,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      120,
      9,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      20,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.MINERAL],
      Rarity.EPIC,
      Pkm.MAROWAK,
      80,
      5,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      60,
      Ability.BONEMERANG,
      shiny,
      emotion,
      false
    )
  }
}

export class Marowak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAROWAK,
      [Synergy.GROUND, Synergy.MINERAL],
      Rarity.EPIC,
      Pkm.ALOLAN_MAROWAK,
      120,
      9,
      5,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      60,
      Ability.BONEMERANG,
      shiny,
      emotion,
      false
    )
  }
}

export class AlolanMarowak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_MAROWAK,
      [Synergy.GROUND, Synergy.MINERAL, Synergy.FIRE, Synergy.GHOST],
      Rarity.EPIC,
      Pkm.DEFAULT,
      220,
      20,
      6,
      6,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      3,
      60,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
      1,
      100,
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
      9,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      220,
      20,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
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
      5,
      4,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      140,
      9,
      5,
      7,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      280,
      20,
      6,
      10,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GRASS, Synergy.WATER],
      Rarity.RARE,
      Pkm.LOMBRE,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
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
      [Synergy.GRASS, Synergy.WATER],
      Rarity.RARE,
      Pkm.LUDICOLO,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      [Synergy.GRASS, Synergy.WATER],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
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
      [Synergy.NORMAL, Synergy.FAIRY],
      Rarity.RARE,
      Pkm.TOGETIC,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.NORMAL, Synergy.FAIRY, Synergy.FLYING],
      Rarity.RARE,
      Pkm.TOGEKISS,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.NORMAL, Synergy.FAIRY, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.RARE,
      Pkm.RHYDON,
      80,
      5,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.RARE,
      Pkm.RHYPERIOR,
      120,
      9,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      20,
      8,
      8,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.METAL, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.RARE,
      Pkm.LAIRON,
      80,
      5,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.METAL, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.RARE,
      Pkm.AGGRON,
      120,
      9,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.METAL, Synergy.MONSTER, Synergy.MINERAL],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      20,
      8,
      8,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      80,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      120,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      220,
      18,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      80,
      5,
      4,
      4,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
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
      120,
      9,
      4,
      4,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
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
      220,
      20,
      6,
      6,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.LEGENDARY,
      Pkm.ABOMASNOW,
      80,
      7,
      6,
      6,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.FREEZE,
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
      [Synergy.GRASS, Synergy.ICE],
      Rarity.LEGENDARY,
      Pkm.MEGA_ABOMASNOW,
      120,
      11,
      8,
      8,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.FREEZE,
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
      [Synergy.GRASS, Synergy.ICE],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      220,
      25,
      10,
      10,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.FREEZE,
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
      80,
      5,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DARK_PULSE,
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
      120,
      9,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DARK_PULSE,
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
      220,
      20,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.DARK_PULSE,
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
      80,
      5,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      AttackType.PHYSICAL,
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
      120,
      8,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      AttackType.PHYSICAL,
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
      220,
      19,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.BUG],
      Rarity.RARE,
      Pkm.VIBRAVA,
      80,
      5,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.DRAGON, Synergy.BUG],
      Rarity.RARE,
      Pkm.FLYGON,
      120,
      9,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.DRAGON, Synergy.BUG],
      Rarity.RARE,
      Pkm.DEFAULT,
      220,
      20,
      4,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.ELECTRIC, Synergy.FAIRY],
      Rarity.COMMON,
      Pkm.PIKACHU,
      80,
      5,
      2,
      2,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      Pkm.DEFAULT,
      220,
      18,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
      3,
      140,
      Ability.VOLT_SWITCH,
      shiny,
      emotion,
      true
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
      AttackType.PHYSICAL,
      1,
      100,
      Ability.ROOT,
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
      120,
      9,
      3,
      3,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.ROOT,
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
      210,
      18,
      4,
      4,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.ROOT,
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
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.SOUND],
      Rarity.UNCOMMON,
      Pkm.JIGGLYPUFF,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.SOUND],
      Rarity.UNCOMMON,
      Pkm.WIGGLYTUFF,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.FAIRY, Synergy.NORMAL, Synergy.SOUND],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      18,
      2,
      2,
      2,
      AttackSprite.FAIRY_RANGE,
      AttackType.PHYSICAL,
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
      5,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
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
      120,
      9,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
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
      210,
      18,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.ELECTRIC, Synergy.METAL],
      Rarity.UNCOMMON,
      Pkm.MAGNETON,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.ELECTRIC, Synergy.METAL],
      Rarity.UNCOMMON,
      Pkm.MAGNEZONE,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.ELECTRIC, Synergy.METAL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      2,
      2,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.DRAGON],
      Rarity.UNCOMMON,
      Pkm.SEADRA,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.HYDRO_PUMP,
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
      [Synergy.WATER, Synergy.DRAGON],
      Rarity.UNCOMMON,
      Pkm.KINGDRA,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.HYDRO_PUMP,
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
      [Synergy.WATER, Synergy.DRAGON],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      2,
      2,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.HYDRO_PUMP,
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
      70,
      5,
      1,
      1,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      5,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
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
      120,
      9,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      210,
      20,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      5,
      3,
      2,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
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
      120,
      9,
      3,
      2,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
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
      210,
      20,
      3,
      3,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.RARE,
      Pkm.NIDORINA,
      70,
      5,
      3,
      3,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
      1,
      89,
      Ability.POISON_STING,
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
      Rarity.RARE,
      Pkm.NIDOQUEEN,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
      2,
      89,
      Ability.POISON_STING,
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
      Rarity.RARE,
      Pkm.DEFAULT,
      210,
      20,
      5,
      5,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
      3,
      89,
      Ability.POISON_STING,
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
      Rarity.RARE,
      Pkm.NIDORINO,
      70,
      5,
      3,
      3,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.RARE,
      Pkm.NIDOKING,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.RARE,
      Pkm.DEFAULT,
      210,
      20,
      5,
      5,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
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
      5,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
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
      120,
      9,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
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
      210,
      20,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.FLYING, Synergy.METAL],
      Rarity.UNCOMMON,
      Pkm.PRINPLUP,
      70,
      5,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.FLYING, Synergy.METAL],
      Rarity.UNCOMMON,
      Pkm.EMPOLEON,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.FLYING, Synergy.METAL],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.FIGHTING],
      Rarity.UNCOMMON,
      Pkm.MONFERNO,
      70,
      5,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.FIGHTING],
      Rarity.UNCOMMON,
      Pkm.INFERNAPE,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.FIGHTING],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.UNCOMMON,
      Pkm.MARSHTOMP,
      70,
      5,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false
    )
  }
}

export class Marshtomp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MARSHTOMP,
      [Synergy.WATER, Synergy.GROUND],
      Rarity.UNCOMMON,
      Pkm.SWAMPERT,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false
    )
  }
}

export class Swampert extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SWAMPERT,
      [Synergy.WATER, Synergy.GROUND],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      210,
      20,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      true
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
      70,
      5,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      9,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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
      20,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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
      5,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
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
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      210,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
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
      70,
      5,
      2,
      2,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false
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
      120,
      9,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.SOAK,
      shiny,
      emotion,
      false
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
      210,
      20,
      4,
      4,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.SOAK,
      shiny,
      emotion,
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
      70,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
      1,
      100,
      Ability.ROOT,
      shiny,
      emotion,
      false
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
      120,
      9,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.ROOT,
      shiny,
      emotion,
      false
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
      210,
      20,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.ROOT,
      shiny,
      emotion,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.MINERAL],
      Rarity.COMMON,
      Pkm.GRAVELER,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.MINERAL],
      Rarity.COMMON,
      Pkm.GOLEM,
      110,
      9,
      4,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GROUND, Synergy.MINERAL],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      20,
      8,
      8,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.UNCOMMON,
      Pkm.CROCONAW,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.BITE,
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
      Rarity.UNCOMMON,
      Pkm.FERALIGATR,
      110,
      9,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.BITE,
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
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      200,
      20,
      5,
      5,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.BITE,
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
      [Synergy.WATER, Synergy.FAIRY],
      Rarity.COMMON,
      Pkm.MARILL,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.HYDRO_PUMP,
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
      AttackType.PHYSICAL,
      2,
      100,
      Ability.HYDRO_PUMP,
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
      AttackType.PHYSICAL,
      3,
      100,
      Ability.HYDRO_PUMP,
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
      60,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      110,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.FLAFFY,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
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
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.AMPHAROS,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      [Synergy.ELECTRIC, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      18,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
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
      [Synergy.FAIRY, Synergy.NORMAL],
      Rarity.COMMON,
      Pkm.CLEFAIRY,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.METRONOME,
      shiny,
      emotion,
      false
    )
  }
}

export class Clefairy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLEFAIRY,
      [Synergy.FAIRY, Synergy.NORMAL],
      Rarity.COMMON,
      Pkm.CLEFABLE,
      110,
      9,
      2,
      2,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.METRONOME,
      shiny,
      emotion,
      false
    )
  }
}

export class Clefable extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLEFABLE,
      [Synergy.FAIRY, Synergy.NORMAL],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      18,
      2,
      2,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.METRONOME,
      shiny,
      emotion,
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
      AttackType.PHYSICAL,
      1,
      100,
      Ability.BUG_BUZZ,
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
      AttackType.PHYSICAL,
      2,
      100,
      Ability.BUG_BUZZ,
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
      18,
      1,
      1,
      2,
      AttackSprite.POISON_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.BUG_BUZZ,
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
      AttackType.PHYSICAL,
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
      9,
      2,
      2,
      1,
      AttackSprite.BUG_MELEE,
      AttackType.PHYSICAL,
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
      20,
      2,
      2,
      1,
      AttackSprite.BUG_MELEE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
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
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
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
      60,
      5,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.STUN_SPORE,
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
      AttackType.PHYSICAL,
      2,
      100,
      Ability.STUN_SPORE,
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
      AttackType.PHYSICAL,
      3,
      100,
      Ability.STUN_SPORE,
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
      [Synergy.GRASS, Synergy.DARK, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.NUZLEAF,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.THIEF,
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
      [Synergy.GRASS, Synergy.DARK, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.SHIFTRY,
      110,
      9,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.THIEF,
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
      [Synergy.GRASS, Synergy.DARK, Synergy.FIELD],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.THIEF,
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
      Rarity.COMMON,
      Pkm.STARAVIA,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.FLYING_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.HURRICANE,
      shiny,
      emotion,
      false
    )
  }
}

export class Staravia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STARAVIA,
      [Synergy.NORMAL, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.STARAPTOR,
      110,
      9,
      2,
      2,
      1,
      AttackSprite.FLYING_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.HURRICANE,
      shiny,
      emotion,
      false
    )
  }
}

export class Staraptor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STARAPTOR,
      [Synergy.NORMAL, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      1,
      AttackSprite.FLYING_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.HURRICANE,
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
      [Synergy.FIRE, Synergy.DRAGON],
      Rarity.COMMON,
      Pkm.CHARMELEON,
      60,
      5,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.DRAGON],
      Rarity.COMMON,
      Pkm.CHARIZARD,
      110,
      9,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.DRAGON],
      Rarity.COMMON,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.BLAST_BURN,
      shiny,
      emotion,
      true
    )
  }
}

export class Carvanha extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CARVANHA,
      [Synergy.WATER, Synergy.DARK],
      Rarity.SUMMON,
      Pkm.DEFAULT,
      40,
      4,
      1,
      1,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.BITE,
      shiny,
      emotion,
      false
    )
  }
}

export class Magikarp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MAGIKARP,
      [Synergy.WATER],
      Rarity.NEUTRAL,
      Pkm.GYARADOS,
      30,
      1,
      1,
      1,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Gyarados extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GYARADOS,
      [Synergy.WATER],
      Rarity.NEUTRAL,
      Pkm.DEFAULT,
      200,
      20,
      5,
      1,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.NEUTRAL,
      Pkm.RATICATE,
      30,
      5,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DEFAULT,
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
      Rarity.NEUTRAL,
      Pkm.DEFAULT,
      60,
      7,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DEFAULT,
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
      Rarity.NEUTRAL,
      Pkm.DEFAULT,
      30,
      5,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DEFAULT,
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
      Rarity.NEUTRAL,
      Pkm.DEFAULT,
      60,
      7,
      1,
      1,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DEFAULT,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      4,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      3,
      120,
      Ability.RELIC_SONG,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      4,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.SILENCE,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.NIGHT_SLASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Zapdos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZAPDOS,
      [Synergy.ELECTRIC, Synergy.FLYING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.CHARGE,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.WHEEL_OF_FIRE,
      shiny,
      emotion,
      true
    )
  }
}

export class Articuno extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARTICUNO,
      [Synergy.ICE, Synergy.FLYING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.FREEZE,
      shiny,
      emotion,
      true
    )
  }
}

export class Dialga extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DIALGA,
      [Synergy.METAL, Synergy.DRAGON],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      150,
      Ability.ROAR_OF_TIME,
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
      [Synergy.WATER, Synergy.ICE],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.AURORA_VEIL,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.THUNDER,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.FIRE_BLAST,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      180,
      18,
      4,
      2,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
      2,
      75,
      Ability.POISON_STING,
      shiny,
      emotion,
      true
    )
  }
}

export class Regirock extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REGIROCK,
      [Synergy.MINERAL, Synergy.HUMAN],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.ROCK_SLIDE,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      7,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      105,
      Ability.EARTHQUAKE,
      shiny,
      emotion,
      true
    )
  }
}

export class Registeel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.REGISTEEL,
      [Synergy.METAL, Synergy.HUMAN],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
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
      [Synergy.WATER, Synergy.AQUATIC],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      4,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.ORIGIN_PULSE,
      shiny,
      emotion,
      true
    )
  }
}

export class Groudon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.GROUDON,
      [Synergy.GROUND, Synergy.FIRE],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.EARTHQUAKE,
      shiny,
      emotion,
      true
    )
  }
}

export class Rayquaza extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RAYQUAZA,
      [Synergy.DRAGON, Synergy.FLYING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DRACO_METEOR,
      shiny,
      emotion,
      true
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
      130,
      5,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.HAPPY_HOUR,
      shiny,
      emotion,
      false
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
      130,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
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
      130,
      9,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      130,
      9,
      3,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      130,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      130,
      9,
      3,
      2,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      130,
      9,
      3,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      130,
      9,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      130,
      9,
      1,
      1,
      2,
      AttackSprite.ICE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      3,
      90,
      Ability.STEAM_ERUPTION,
      shiny,
      emotion,
      true
    )
  }
}

export class Darkrai extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DARKRAI,
      [Synergy.DARK, Synergy.GHOST],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      2,
      2,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      3,
      120,
      Ability.TWISTING_NEITHER,
      shiny,
      emotion,
      true
    )
  }
}

export class Volcarona extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VOLCARONA,
      [Synergy.FIRE, Synergy.BUG],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.FIRE_BLAST,
      shiny,
      emotion,
      true
    )
  }
}

export class Chatot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CHATOT,
      [Synergy.FLYING, Synergy.SOUND],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      120,
      Ability.CHATTER,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      80,
      Ability.PROTEAN,
      shiny,
      emotion,
      false
    )
  }
}

export class Castform extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASTFORM,
      [Synergy.NORMAL, Synergy.ARTIFICIAL],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      80,
      Ability.NASTY_PLOT,
      shiny,
      emotion,
      false
    )
  }
}

export class CastformSun extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASTFORM_SUN,
      [Synergy.NORMAL, Synergy.ARTIFICIAL, Synergy.FIRE],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.DRAGON_RANGE,
      AttackType.PHYSICAL,
      2,
      80,
      Ability.FIRE_BLAST,
      shiny,
      emotion,
      true
    )
  }
}

export class CastformRain extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASTFORM_RAIN,
      [Synergy.NORMAL, Synergy.ARTIFICIAL, Synergy.WATER],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      2,
      80,
      Ability.AQUA_JET,
      shiny,
      emotion,
      true
    )
  }
}

export class CastformHail extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CASTFORM_HAIL,
      [Synergy.NORMAL, Synergy.ARTIFICIAL, Synergy.ICE],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.ICE_RANGE,
      AttackType.PHYSICAL,
      2,
      80,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Landorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LANDORUS,
      [Synergy.GROUND, Synergy.FLYING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.ROCK_SLIDE,
      shiny,
      emotion,
      true
    )
  }
}

export class Thundurus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.THUNDURUS,
      [Synergy.ELECTRIC, Synergy.FLYING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.THUNDER,
      shiny,
      emotion,
      true
    )
  }
}

export class Tornadus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TORNADUS,
      [Synergy.FLYING, Synergy.HUMAN, Synergy.MONSTER],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.TRI_ATTACK,
      shiny,
      emotion,
      true
    )
  }
}

export class Keldeo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KELDEO,
      [Synergy.WATER, Synergy.FIGHTING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      2,
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
      [Synergy.MINERAL, Synergy.FIGHTING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.SEISMIC_TOSS,
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
      [Synergy.METAL, Synergy.FIGHTING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
      2,
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
      [Synergy.METAL, Synergy.FAIRY, Synergy.MONSTER],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      6,
      6,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
      2,
      80,
      Ability.IRON_TAIL,
      shiny,
      emotion,
      true
    )
  }
}

export class Manaphy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MANAPHY,
      [Synergy.WATER, Synergy.BUG],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      250,
      20,
      6,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.THIEF,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      250,
      20,
      6,
      6,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      2,
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
      [Synergy.PSYCHIC, Synergy.DRAGON],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DRACO_METEOR,
      shiny,
      emotion,
      true
    )
  }
}

export class Latios extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LATIOS,
      [Synergy.PSYCHIC, Synergy.DRAGON],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DRACO_METEOR,
      shiny,
      emotion,
      true
    )
  }
}

export class Uxie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.UXIE,
      [Synergy.PSYCHIC, Synergy.FAIRY],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      90,
      Ability.CONFUSING_MIND,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      110,
      Ability.SONG_OF_DESIRE,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      20,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      200,
      Ability.SYNCHRO,
      shiny,
      emotion,
      true
    )
  }
}

export class Mewtwo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MEWTWO,
      [Synergy.PSYCHIC, Synergy.MONSTER, Synergy.ARTIFICIAL],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      110,
      Ability.DYNAMAX_CANNON,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.FREEZE,
      shiny,
      emotion,
      true
    )
  }
}

export class Reshiram extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RESHIRAM,
      [Synergy.DRAGON, Synergy.FIRE],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      4,
      6,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      1,
      90,
      Ability.BLUE_FLARE,
      shiny,
      emotion,
      true
    )
  }
}

export class Zekrom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ZEKROM,
      [Synergy.DRAGON, Synergy.ELECTRIC],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      4,
      6,
      3,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      2,
      90,
      Ability.FUSION_BOLT,
      shiny,
      emotion,
      true
    )
  }
}

export class Celebi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CELEBI,
      [Synergy.GRASS, Synergy.PSYCHIC],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.BURN,
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
      [Synergy.METAL, Synergy.PSYCHIC],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      50,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.PROTEAN,
      shiny,
      emotion,
      true
    )
  }
}

export class Deoxys extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DEOXYS,
      [Synergy.PSYCHIC, Synergy.HUMAN, Synergy.ARTIFICIAL],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      1,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.PHYSICAL,
      2,
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
      [Synergy.PSYCHIC, Synergy.FAIRY],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      50,
      Ability.WISH,
      shiny,
      emotion,
      true
    )
  }
}

export class Heatran extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HEATRAN,
      [Synergy.FIRE, Synergy.METAL],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.BURN,
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
      [Synergy.FIRE, Synergy.FLYING],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.BURN,
      shiny,
      emotion,
      true
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
      40,
      10,
      10,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.EARTHQUAKE,
      shiny,
      emotion,
      true
    )
  }
}

export class PrimalKyogre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.PRIMAL_KYOGRE,
      [Synergy.WATER, Synergy.ELECTRIC, Synergy.AQUATIC],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      400,
      40,
      5,
      5,
      3,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.ORIGIN_PULSE,
      shiny,
      emotion,
      true
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
      40,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.DRACO_METEOR,
      shiny,
      emotion,
      true
    )
  }
}

export class Oddish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ODDISH,
      [Synergy.POISON, Synergy.GRASS],
      Rarity.SUMMON,
      Pkm.GLOOM,
      90,
      9,
      2,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.SUMMON,
      Pkm.VILEPLUME,
      160,
      18,
      3,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.SUMMON,
      Pkm.BELLOSSOM,
      260,
      20,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.SUMMON,
      Pkm.DEFAULT,
      360,
      27,
      5,
      5,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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
      150,
      10,
      4,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      false
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
      330,
      16,
      8,
      10,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.ICICLE_CRASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Carbink extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CARBINK,
      [Synergy.FOSSIL, Synergy.FAIRY],
      Rarity.EPIC,
      Pkm.DIANCIE,
      130,
      9,
      4,
      4,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DIAMOND_STORM,
      shiny,
      emotion,
      false
    )
  }
}

export class Diancie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DIANCIE,
      [Synergy.FOSSIL, Synergy.FAIRY],
      Rarity.EPIC,
      Pkm.DEFAULT,
      270,
      17,
      7,
      7,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DIAMOND_STORM,
      shiny,
      emotion,
      true
    )
  }
}

export class Anorith extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ANORITH,
      [Synergy.FOSSIL, Synergy.BUG],
      Rarity.UNCOMMON,
      Pkm.ARMALDO,
      70,
      10,
      3,
      1,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.ROCK_SMASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Armaldo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARMALDO,
      [Synergy.FOSSIL, Synergy.BUG],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      160,
      16,
      4,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.ROCK_SMASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Archen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARCHEN,
      [Synergy.FOSSIL, Synergy.FLYING],
      Rarity.RARE,
      Pkm.ARCHEOPS,
      100,
      12,
      2,
      1,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      90,
      Ability.ROCK_SMASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Archeops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ARCHEOPS,
      [Synergy.FOSSIL, Synergy.FLYING],
      Rarity.RARE,
      Pkm.DEFAULT,
      180,
      20,
      3,
      2,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      90,
      Ability.ROCK_SMASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Shieldon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHIELDON,
      [Synergy.FOSSIL, Synergy.METAL],
      Rarity.RARE,
      Pkm.BASTIODON,
      120,
      7,
      3,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.IRON_DEFENSE,
      shiny,
      emotion,
      false
    )
  }
}

export class Bastiodon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BASTIODON,
      [Synergy.FOSSIL, Synergy.METAL],
      Rarity.RARE,
      Pkm.DEFAULT,
      240,
      14,
      7,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.IRON_DEFENSE,
      shiny,
      emotion,
      true
    )
  }
}

export class Tirtouga extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TIRTOUGA,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.RARE,
      Pkm.CARRACOSTA,
      120,
      7,
      4,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
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
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Lileep extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LILEEP,
      [Synergy.FOSSIL, Synergy.GRASS],
      Rarity.UNCOMMON,
      Pkm.CRADILY,
      60,
      8,
      2,
      2,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.HEAL_BLOCK,
      shiny,
      emotion,
      false
    )
  }
}

export class Cradily extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CRADILY,
      [Synergy.FOSSIL, Synergy.GRASS],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      140,
      14,
      4,
      4,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.HEAL_BLOCK,
      shiny,
      emotion,
      true
    )
  }
}

export class Cranidos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CRANIDOS,
      [Synergy.FOSSIL, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.RAMPARDOS,
      100,
      10,
      4,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.HEAD_SMASH,
      shiny,
      emotion,
      false
    )
  }
}

export class Rampardos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RAMPARDOS,
      [Synergy.FOSSIL, Synergy.MONSTER],
      Rarity.RARE,
      Pkm.DEFAULT,
      200,
      19,
      6,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.HEAD_SMASH,
      shiny,
      emotion,
      true
    )
  }
}

export class Kabuto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KABUTO,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.UNCOMMON,
      Pkm.KABUTOPS,
      80,
      10,
      3,
      1,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      90,
      Ability.HEAL_BLOCK,
      shiny,
      emotion,
      false
    )
  }
}

export class Kabutops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.KABUTOPS,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      160,
      16,
      4,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      90,
      Ability.HEAL_BLOCK,
      shiny,
      emotion,
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
      80,
      8,
      1,
      3,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      90,
      Ability.ROCK_TOMB,
      shiny,
      emotion,
      false
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
      16,
      2,
      4,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      90,
      Ability.ROCK_TOMB,
      shiny,
      emotion,
      true
    )
  }
}
export class Clamperl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CLAMPERL,
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.EPIC,
      Pkm.HUNTAIL,
      90,
      7,
      6,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      1,
      80,
      Ability.HYDRO_PUMP,
      shiny,
      emotion,
      true
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
      220,
      14,
      3,
      3,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.PHYSICAL,
      2,
      80,
      Ability.HYDRO_PUMP,
      shiny,
      emotion,
      true
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
      270,
      17,
      6,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      2,
      80,
      Ability.ROCK_TOMB,
      shiny,
      emotion,
      true
    )
  }
}
export class Relicanth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.RELICANTH,
      [Synergy.MINERAL, Synergy.WATER, Synergy.FOSSIL],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      270,
      17,
      6,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.EPIC,
      Pkm.TYRANTRUM,
      135,
      10,
      4,
      2,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      false
    )
  }
}

export class Tyrantrum extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TYRANTRUM,
      [Synergy.FOSSIL, Synergy.DRAGON],
      Rarity.EPIC,
      Pkm.DEFAULT,
      290,
      22,
      7,
      4,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.DEFAULT,
      shiny,
      emotion,
      true
    )
  }
}

export class Aerodactyl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.AERODACTYL,
      [Synergy.MINERAL, Synergy.FLYING, Synergy.FOSSIL],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      270,
      17,
      6,
      3,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
      2,
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
      [Synergy.BUG, Synergy.METAL, Synergy.ARTIFICIAL],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      270,
      25,
      6,
      3,
      4,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      3,
      70,
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
      50,
      5,
      1,
      2,
      1,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      17,
      5,
      8,
      1,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      70,
      6,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      1,
      120,
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
      150,
      11,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
      120,
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
      250,
      15,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      3,
      120,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      270,
      17,
      3,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      2,
      70,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      270,
      17,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      2,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      400,
      22,
      3,
      3,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
      3,
      120,
      Ability.TWISTING_NEITHER,
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
      [Synergy.DRAGON, Synergy.POISON],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      270,
      22,
      3,
      3,
      3,
      AttackSprite.POISON_RANGE,
      AttackType.PHYSICAL,
      3,
      110,
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
      Rarity.LEGENDARY,
      Pkm.NINJASK,
      10,
      7,
      0,
      0,
      1,
      AttackSprite.BUG_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
      Ability.WONDER_GUARD,
      shiny,
      emotion,
      false
    )
  }
}
export class Ninjask extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NINJASK,
      [Synergy.BUG, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.SHEDNINJA,
      20,
      14,
      0,
      0,
      1,
      AttackSprite.BUG_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
      Ability.WONDER_GUARD,
      shiny,
      emotion,
      false
    )
  }
}
export class Shedninja extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SHEDNINJA,
      [Synergy.BUG, Synergy.GHOST, Synergy.FLYING],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      40,
      21,
      0,
      0,
      1,
      AttackSprite.BUG_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
      Ability.WONDER_GUARD,
      shiny,
      emotion,
      true
    )
  }
}

export class Happiny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.HAPPINY,
      [Synergy.NORMAL, Synergy.FAIRY, Synergy.HUMAN],
      Rarity.LEGENDARY,
      Pkm.CHANSEY,
      120,
      5,
      5,
      3,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.NORMAL, Synergy.FAIRY, Synergy.HUMAN],
      Rarity.LEGENDARY,
      Pkm.BLISSEY,
      240,
      11,
      6,
      4,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.NORMAL, Synergy.FAIRY, Synergy.HUMAN],
      Rarity.LEGENDARY,
      Pkm.DEFAULT,
      480,
      17,
      7,
      5,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      270,
      17,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      2,
      200,
      Ability.ELECTRIC_SURGE,
      shiny,
      emotion,
      true
    )
  }
}

export class TapuLele extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.TAPU_LELE,
      [Synergy.PSYCHIC, Synergy.FAIRY],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      270,
      17,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      200,
      Ability.PSYCHIC_SURGE,
      shiny,
      emotion,
      true
    )
  }
}

export class Stakataka extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.STAKATAKA,
      [Synergy.MINERAL, Synergy.METAL],
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      300,
      20,
      15,
      15,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.MYTHICAL,
      Pkm.DEFAULT,
      200,
      18,
      3,
      3,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      2,
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
      90,
      8,
      4,
      4,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      1,
      120,
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
      130,
      9,
      6,
      6,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      2,
      120,
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
      230,
      20,
      8,
      8,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      3,
      120,
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
      [Synergy.GRASS, Synergy.DARK],
      Rarity.RARE,
      Pkm.CACTURNE,
      100,
      8,
      4,
      3,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      1,
      70,
      Ability.LEECH_SEED,
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
      [Synergy.GRASS, Synergy.DARK],
      Rarity.RARE,
      Pkm.DEFAULT,
      170,
      16,
      6,
      5,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
      2,
      70,
      Ability.LEECH_SEED,
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
      Rarity.RARE,
      Pkm.GOURGEIST,
      80,
      6,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.RARE,
      Pkm.DEFAULT,
      130,
      10,
      4,
      4,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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

export class Noibat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NOIBAT,
      [Synergy.DRAGON, Synergy.SOUND, Synergy.FLYING],
      Rarity.COMMON,
      Pkm.NOIVERN,
      60,
      5,
      2,
      2,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
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
      Rarity.COMMON,
      Pkm.DEFAULT,
      110,
      9,
      2,
      2,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      17,
      5,
      5,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      9,
      3,
      3,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
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
      180,
      17,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
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
      70,
      8,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
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
      150,
      11,
      5,
      5,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
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
export class Joltik extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.JOLTIK,
      [Synergy.BUG, Synergy.ELECTRIC],
      Rarity.RARE,
      Pkm.GALVANTULA,
      100,
      8,
      3,
      2,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      170,
      16,
      5,
      3,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
export class Corphish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.CORPHISH,
      [Synergy.WATER, Synergy.DARK],
      Rarity.UNCOMMON,
      Pkm.CRAWDAUNT,
      100,
      8,
      3,
      2,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      1,
      110,
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
      170,
      16,
      5,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
      2,
      110,
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
      6,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
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
      120,
      10,
      3,
      3,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
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
export class Munchlax extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.MUNCHLAX,
      [Synergy.NORMAL, Synergy.HUMAN],
      Rarity.EPIC,
      Pkm.SNORLAX,
      160,
      13,
      2,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
      130,
      Ability.DYNAMIC_PUNCH,
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
      [Synergy.NORMAL, Synergy.HUMAN],
      Rarity.EPIC,
      Pkm.DEFAULT,
      350,
      19,
      3,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      130,
      Ability.DYNAMIC_PUNCH,
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
      60,
      5,
      2,
      2,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
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
      110,
      11,
      5,
      5,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      [Synergy.ICE, Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.COMMON,
      Pkm.JYNX,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      1,
      90,
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
      Rarity.COMMON,
      Pkm.DEFAULT,
      110,
      10,
      2,
      2,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
      2,
      90,
      Ability.CONFUSION,
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
      6,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
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
      120,
      10,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      100,
      10,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.PHYSICAL,
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
      Rarity.COMMON,
      Pkm.ELECTRODE,
      60,
      8,
      0,
      0,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      Rarity.COMMON,
      Pkm.DEFAULT,
      120,
      14,
      1,
      1,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.MINERAL],
      Rarity.RARE,
      Pkm.MAGCARGO,
      70,
      5,
      3,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
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
      [Synergy.FIRE, Synergy.MINERAL],
      Rarity.RARE,
      Pkm.DEFAULT,
      150,
      10,
      6,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
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
      60,
      9,
      1,
      3,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
      1,
      70,
      Ability.ICICLE_CRASH,
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
      130,
      18,
      2,
      3,
      1,
      AttackSprite.ICE_MELEE,
      AttackType.PHYSICAL,
      2,
      70,
      Ability.ICICLE_CRASH,
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
      60,
      6,
      2,
      2,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
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
      115,
      11,
      4,
      4,
      1,
      AttackSprite.POISON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.ELECTRIC],
      Rarity.UNCOMMON,
      Pkm.LANTURN,
      60,
      5,
      2,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      1,
      105,
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
      [Synergy.WATER, Synergy.ELECTRIC],
      Rarity.UNCOMMON,
      Pkm.DEFAULT,
      115,
      9,
      3,
      5,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.PHYSICAL,
      2,
      105,
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
      Rarity.COMMON,
      Pkm.MIGHTYENA,
      50,
      5,
      2,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
      75,
      Ability.BITE,
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
      Rarity.COMMON,
      Pkm.DEFAULT,
      105,
      11,
      4,
      4,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      75,
      Ability.BITE,
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
      [Synergy.METAL, Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.BRONZONG,
      60,
      5,
      5,
      3,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.METAL, Synergy.PSYCHIC],
      Rarity.RARE,
      Pkm.DEFAULT,
      105,
      11,
      9,
      7,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
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
      70,
      5,
      2,
      2,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      1,
      95,
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
      140,
      10,
      3,
      3,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.PHYSICAL,
      2,
      95,
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
      AttackType.PHYSICAL,
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
      120,
      14,
      3,
      3,
      1,
      AttackSprite.FIGHTING_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.POISON],
      Rarity.COMMON,
      Pkm.TENTACRUEL,
      50,
      5,
      2,
      4,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.WATER, Synergy.POISON],
      Rarity.COMMON,
      Pkm.DEFAULT,
      100,
      9,
      3,
      7,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.NORMAL, Synergy.FAIRY, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.GRANBULL,
      65,
      6,
      3,
      2,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
      1,
      85,
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
      [Synergy.NORMAL, Synergy.FAIRY, Synergy.FIELD],
      Rarity.EPIC,
      Pkm.DEFAULT,
      130,
      11,
      6,
      3,
      1,
      AttackSprite.FAIRY_MELEE,
      AttackType.PHYSICAL,
      2,
      85,
      Ability.BITE,
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
      [Synergy.GRASS, Synergy.DRAGON],
      Rarity.EPIC,
      Pkm.APPLETUN,
      65,
      6,
      5,
      2,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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
      [Synergy.GRASS, Synergy.DRAGON],
      Rarity.EPIC,
      Pkm.DEFAULT,
      130,
      11,
      8,
      6,
      1,
      AttackSprite.GRASS_MELEE,
      AttackType.PHYSICAL,
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

export class Vulpix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.VULPIX,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.RARE,
      Pkm.NINETALES,
      65,
      6,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
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

export class Ninetales extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.NINETALES,
      [Synergy.FIRE, Synergy.FIELD],
      Rarity.RARE,
      Pkm.DEFAULT,
      130,
      12,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.PHYSICAL,
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

export class AlolanVulpix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.ALOLAN_VULPIX,
      [Synergy.ICE, Synergy.FAIRY],
      Rarity.RARE,
      Pkm.ALOLAN_NINETALES,
      65,
      6,
      2,
      2,
      2,
      AttackSprite.ICE_RANGE,
      AttackType.PHYSICAL,
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
      130,
      12,
      3,
      3,
      2,
      AttackSprite.ICE_RANGE,
      AttackType.PHYSICAL,
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
      5,
      2,
      2,
      2,
      AttackSprite.ICE_RANGE,
      AttackType.PHYSICAL,
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
      140,
      11,
      3,
      3,
      2,
      AttackSprite.ICE_RANGE,
      AttackType.PHYSICAL,
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
      AttackType.PHYSICAL,
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
      360,
      11,
      3,
      3,
      1,
      AttackSprite.WATER_MELEE,
      AttackType.PHYSICAL,
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
