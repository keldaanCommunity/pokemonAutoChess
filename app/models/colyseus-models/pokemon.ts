/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { Schema, type, ArraySchema, SetSchema } from "@colyseus/schema"
import uniqid from "uniqid"
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
    index: string,
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
    this.id = uniqid()
    this.name = name
    this.rarity = rarity
    this.index = index
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
      "0132",
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
      "0309",
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
      "0310",
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
      "0310-0001",
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
      "0353",
      Pkm.BANETTE,
      100,
      5,
      3,
      4,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      1,
      140,
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
      "0354",
      Pkm.MEGA_BANETTE,
      140,
      11,
      4,
      5,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      2,
      140,
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
      "0354-0001",
      Pkm.DEFAULT,
      240,
      21,
      5,
      6,
      1,
      AttackSprite.DRAGON_MELEE,
      AttackType.PHYSICAL,
      3,
      140,
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
      [Synergy.FIGHTING, Synergy.HUMAN],
      Rarity.LEGENDARY,
      "0447",
      Pkm.LUCARIO,
      90,
      5,
      3,
      3,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.FIGHTING, Synergy.HUMAN, Synergy.METAL],
      Rarity.LEGENDARY,
      "0448",
      Pkm.MEGA_LUCARIO,
      130,
      11,
      3,
      3,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.FIGHTING, Synergy.HUMAN, Synergy.METAL],
      Rarity.LEGENDARY,
      "0448-0001",
      Pkm.DEFAULT,
      230,
      21,
      3,
      3,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.FAIRY, Synergy.DRAGON, Synergy.SOUND],
      Rarity.LEGENDARY,
      "0333",
      Pkm.ALTARIA,
      90,
      5,
      3,
      3,
      2,
      AttackSprite.DRAGON_RANGE,
      AttackType.SPECIAL,
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
      "0334",
      Pkm.MEGA_ALTARIA,
      130,
      11,
      4,
      4,
      2,
      AttackSprite.DRAGON_RANGE,
      AttackType.SPECIAL,
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
      "0334-0001",
      Pkm.DEFAULT,
      230,
      21,
      5,
      5,
      2,
      AttackSprite.DRAGON_RANGE,
      AttackType.SPECIAL,
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
      "0123",
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
      "0212",
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
      "0212-0001",
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

export class Buneary extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.BUNEARY,
      [Synergy.NORMAL, Synergy.FIGHTING],
      Rarity.LEGENDARY,
      "0427",
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
      "0428",
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
      "0428-0001",
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
      "0095",
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
      "0208",
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
      "0208-0001",
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
      "0322",
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
      "0323",
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
      "0323-0001",
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
      "0307",
      Pkm.MEDICHAM,
      90,
      5,
      5,
      5,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
      1,
      80,
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
      "0308",
      Pkm.MEGA_MEDICHAM,
      130,
      9,
      6,
      6,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      80,
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
      "0308-0001",
      Pkm.DEFAULT,
      230,
      20,
      7,
      7,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      3,
      80,
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
      [Synergy.ELECTRIC, Synergy.HUMAN],
      Rarity.EPIC,
      "0239",
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
      [Synergy.ELECTRIC, Synergy.HUMAN],
      Rarity.EPIC,
      "0125",
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
      [Synergy.ELECTRIC, Synergy.HUMAN],
      Rarity.EPIC,
      "0466",
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
      "0443",
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
      "0444",
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
      "0445",
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
      [Synergy.PSYCHIC, Synergy.METAL, Synergy.MINERAL],
      Rarity.EPIC,
      "0374",
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
      [Synergy.PSYCHIC, Synergy.METAL, Synergy.MINERAL],
      Rarity.EPIC,
      "0375",
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
      [Synergy.PSYCHIC, Synergy.METAL, Synergy.MINERAL],
      Rarity.EPIC,
      "0376",
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
      "0535",
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
      "0536",
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
      "0537",
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
      "0371",
      Pkm.SHELGON,
      90,
      5,
      3,
      3,
      1,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0372",
      Pkm.SALAMENCE,
      130,
      9,
      3,
      3,
      1,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0373",
      Pkm.DEFAULT,
      230,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0280",
      Pkm.KIRLIA,
      90,
      5,
      2,
      4,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0281",
      Pkm.GARDEVOIR,
      130,
      9,
      3,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0282",
      Pkm.DEFAULT,
      230,
      18,
      4,
      8,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0406",
      Pkm.ROSELIA,
      90,
      5,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0315",
      Pkm.ROSERADE,
      130,
      9,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0407",
      Pkm.DEFAULT,
      230,
      18,
      1,
      1,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0287",
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
      "0288",
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
      "0289",
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
      [Synergy.GHOST, Synergy.METAL],
      Rarity.EPIC,
      "0679",
      Pkm.DOUBLADE,
      90,
      8,
      4,
      4,
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
      [Synergy.GHOST, Synergy.METAL],
      Rarity.EPIC,
      "0680",
      Pkm.AEGISLASH,
      130,
      9,
      6,
      6,
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
      [Synergy.GHOST, Synergy.METAL],
      Rarity.EPIC,
      "0681",
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
      Ability.KING_SHIELD,
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
      "0246",
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
      "0247",
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
      "0248",
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
      "0782",
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
      "0783",
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
      "0784",
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
      "0092",
      Pkm.HAUNTER,
      90,
      8,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
      1,
      120,
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
      "0093",
      Pkm.GENGAR,
      130,
      12,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
      2,
      120,
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
      "0094",
      Pkm.DEFAULT,
      230,
      25,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
      3,
      120,
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
      "0063",
      Pkm.KADABRA,
      90,
      5,
      2,
      4,
      4,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0064",
      Pkm.ALAKAZAM,
      130,
      9,
      3,
      5,
      4,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0065",
      Pkm.DEFAULT,
      230,
      18,
      4,
      8,
      4,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0607",
      Pkm.LAMPENT,
      90,
      5,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0608",
      Pkm.CHANDELURE,
      130,
      9,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0609",
      Pkm.DEFAULT,
      230,
      18,
      1,
      1,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.NORMAL, Synergy.PSYCHIC],
      Rarity.EPIC,
      "0137",
      Pkm.PORYGON_2,
      90,
      5,
      1,
      1,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.NORMAL, Synergy.PSYCHIC],
      Rarity.EPIC,
      "0233",
      Pkm.PORYGON_Z,
      130,
      9,
      1,
      1,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.NORMAL, Synergy.PSYCHIC],
      Rarity.EPIC,
      "0474",
      Pkm.DEFAULT,
      230,
      18,
      1,
      1,
      2,
      AttackSprite.FIGHTING_RANGE,
      AttackType.SPECIAL,
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
      "0540",
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
      "0541",
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
      "0542",
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
      "0387",
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
      "0388",
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
      "0389",
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
      "0633",
      Pkm.ZWEILOUS,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0634",
      Pkm.HYDREIGON,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0635",
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0060",
      Pkm.POLIWHIRL,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0061",
      Pkm.POLITOED,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0186",
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0240",
      Pkm.MAGMAR,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0126",
      Pkm.MAGMORTAR,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0467",
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.PSYCHIC, Synergy.GHOST],
      Rarity.RARE,
      "0577",
      Pkm.DUOSION,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
      1,
      100,
      Ability.DEFAULT,
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
      [Synergy.PSYCHIC, Synergy.GHOST],
      Rarity.RARE,
      "0578",
      Pkm.REUNICLUS,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
      2,
      100,
      Ability.DEFAULT,
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
      [Synergy.PSYCHIC, Synergy.GHOST],
      Rarity.RARE,
      "0579",
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
      3,
      100,
      Ability.DEFAULT,
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
      "0403",
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
      "0404",
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
      "0405",
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
      "0104",
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
      "0105",
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
      "0105-0001",
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
      "0610",
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
      "0611",
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
      "0612",
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
      [Synergy.DRAGON, Synergy.AQUATIC],
      Rarity.RARE,
      "0147",
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
      [Synergy.DRAGON, Synergy.AQUATIC],
      Rarity.RARE,
      "0148",
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
      "0149",
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

export class Lotad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.LOTAD,
      [Synergy.GRASS, Synergy.WATER],
      Rarity.RARE,
      "0270",
      Pkm.LOMBRE,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0271",
      Pkm.LUDICOLO,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0272",
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0175",
      Pkm.TOGETIC,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0176",
      Pkm.TOGEKISS,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0468",
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0111",
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
      "0112",
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
      "0464",
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
      "0304",
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
      "0305",
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
      "0306",
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
      "0293",
      Pkm.LOUDRED,
      80,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0294",
      Pkm.EXPLOUD,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0295",
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0220",
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
      "0221",
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
      "0473",
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
      "0459",
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
      "0460",
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
      "0460-0001",
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
      "0361",
      Pkm.GLALIE,
      80,
      5,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0362",
      Pkm.FROSLASS,
      120,
      9,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0478",
      Pkm.DEFAULT,
      220,
      20,
      2,
      2,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.FAIRY, Synergy.ICE],
      Rarity.RARE,
      "0582",
      Pkm.VANILLISH,
      80,
      5,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.FAIRY, Synergy.ICE],
      Rarity.RARE,
      "0583",
      Pkm.VANILLUXE,
      120,
      8,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.FAIRY, Synergy.ICE],
      Rarity.RARE,
      "0584",
      Pkm.DEFAULT,
      220,
      19,
      2,
      2,
      3,
      AttackSprite.FAIRY_RANGE,
      AttackType.SPECIAL,
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
      "0328",
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
      "0329",
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
      "0330",
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
      PkmIndex[Pkm.PICHU],
      Pkm.PIKACHU,
      80,
      5,
      2,
      2,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
      1,
      100,
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
      PkmIndex[Pkm.PIKACHU],
      Pkm.RAICHU,
      120,
      9,
      3,
      3,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      PkmIndex[Pkm.RAICHU],
      Pkm.DEFAULT,
      220,
      18,
      6,
      6,
      1,
      AttackSprite.ELECTRIC_MELEE,
      AttackType.PHYSICAL,
      3,
      100,
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
      "0001",
      Pkm.IVYSAUR,
      80,
      5,
      2,
      2,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0002",
      Pkm.VENUSAUR,
      120,
      9,
      3,
      3,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0003",
      Pkm.DEFAULT,
      210,
      18,
      4,
      4,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0174",
      Pkm.JIGGLYPUFF,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      AttackType.SPECIAL,
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
      "0039",
      Pkm.WIGGLYTUFF,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      AttackType.SPECIAL,
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
      "0040",
      Pkm.DEFAULT,
      210,
      18,
      2,
      2,
      2,
      AttackSprite.FAIRY_RANGE,
      AttackType.SPECIAL,
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
      "0355",
      Pkm.DUSCLOPS,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0356",
      Pkm.DUSKNOIR,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0477",
      Pkm.DEFAULT,
      210,
      18,
      1,
      1,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0081",
      Pkm.MAGNETON,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0082",
      Pkm.MAGNEZONE,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0462",
      Pkm.DEFAULT,
      210,
      20,
      2,
      2,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0116",
      Pkm.SEADRA,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0117",
      Pkm.KINGDRA,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0230",
      Pkm.DEFAULT,
      210,
      20,
      2,
      2,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0669",
      Pkm.FLOETTE,
      70,
      5,
      1,
      1,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0670",
      Pkm.FLORGES,
      120,
      9,
      1,
      1,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0671",
      Pkm.DEFAULT,
      210,
      20,
      2,
      2,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0152",
      Pkm.BAYLEEF,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0153",
      Pkm.MEGANIUM,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0154",
      Pkm.DEFAULT,
      210,
      20,
      1,
      1,
      2,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0551",
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
      "0552",
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
      "0553",
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
      "0543",
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
      "0544",
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
      "0545",
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
      "0363",
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
      "0364",
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
      "0365",
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
      "0029",
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
      "0030",
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
      "0031",
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
      "0032",
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
      "0033",
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
      "0034",
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
      "0066",
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
      "0067",
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
      "0068",
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
      "0393",
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
      "0394",
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
      "0395",
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
      "0390",
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
      "0391",
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
      "0392",
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
      "0258",
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
      "0259",
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
      "0260",
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
      "0255",
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
      "0256",
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
      "0257",
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
      "0252",
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
      "0253",
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
      "0254",
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
      "0155",
      Pkm.QUILAVA,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0156",
      Pkm.TYPHLOSION,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0157",
      Pkm.DEFAULT,
      210,
      18,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0079",
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
      "0080",
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
      "0199",
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
      Rarity.UNCOMMON,
      "0007",
      Pkm.WARTORTLE,
      70,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      Rarity.UNCOMMON,
      "0008",
      Pkm.BLASTOISE,
      120,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      Rarity.UNCOMMON,
      "0009",
      Pkm.DEFAULT,
      210,
      20,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0069",
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
      "0070",
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
      "0071",
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
      "0731",
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
      "0732",
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
      "0733",
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
      "0074",
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
      "0075",
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
      "0076",
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
      Rarity.COMMON,
      "0158",
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
      Rarity.COMMON,
      "0159",
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
      Rarity.COMMON,
      "0160",
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
      "0298",
      Pkm.MARILL,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0183",
      Pkm.AZUMARILL,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0184",
      Pkm.DEFAULT,
      200,
      20,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0041",
      Pkm.GOLBAT,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0042",
      Pkm.CROBAT,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0169",
      Pkm.DEFAULT,
      200,
      18,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0179",
      Pkm.FLAFFY,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0180",
      Pkm.AMPHAROS,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0181",
      Pkm.DEFAULT,
      200,
      18,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0173",
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
      "0035",
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
      "0036",
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
      "0010",
      Pkm.METAPOD,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.POISON_RANGE,
      AttackType.SPECIAL,
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
      "0011",
      Pkm.BUTTERFREE,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.POISON_RANGE,
      AttackType.SPECIAL,
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
      "0012",
      Pkm.DEFAULT,
      200,
      18,
      1,
      1,
      2,
      AttackSprite.POISON_RANGE,
      AttackType.SPECIAL,
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
      "0013",
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
      "0014",
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
      "0015",
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
      "0016",
      Pkm.PIDGEOTTO,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0017",
      Pkm.PIDGEOT,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0018",
      Pkm.DEFAULT,
      200,
      18,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0187",
      Pkm.SKIPLOOM,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0188",
      Pkm.JUMPLUFF,
      110,
      9,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0189",
      Pkm.DEFAULT,
      220,
      18,
      1,
      1,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0273",
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
      "0274",
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
      "0275",
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
      "0396",
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
      "0397",
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
      "0398",
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
      "0004",
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
      "0005",
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
      "0006",
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
      "0318",
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
      "0129",
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
      "0130",
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
      "0019",
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
      "0020",
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
      "0021",
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
      "0022",
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
      "0648",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      4,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0249",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      4,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0487",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0145",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0146",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0144",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      "0483",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0484",
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
      "0245",
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
      "0243",
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
      "0244",
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
      "0378",
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
      PkmIndex[Pkm.SEVIPER],
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
      "0377",
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
      PkmIndex[Pkm.TAUROS],
      Pkm.DEFAULT,
      200,
      20,
      7,
      2,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      1,
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
      "0379",
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
      "0486",
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
      "0382",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      4,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0383",
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
      Ability.HEAT_WAVE,
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
      "0384",
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
      "0133",
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
      "0134",
      Pkm.DEFAULT,
      130,
      9,
      1,
      1,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0135",
      Pkm.DEFAULT,
      130,
      9,
      1,
      1,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0136",
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
      "0196",
      Pkm.DEFAULT,
      130,
      9,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0197",
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
      "0470",
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
      "0700",
      Pkm.DEFAULT,
      130,
      9,
      1,
      1,
      2,
      AttackSprite.FAIRY_RANGE,
      AttackType.SPECIAL,
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
      "0471",
      Pkm.DEFAULT,
      130,
      9,
      1,
      1,
      2,
      AttackSprite.ICE_MELEE,
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
export class Darkrai extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.DARKRAI,
      [Synergy.DARK, Synergy.MONSTER, Synergy.GHOST],
      Rarity.MYTHICAL,
      "0491",
      Pkm.DEFAULT,
      300,
      30,
      2,
      2,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0637",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
        PkmIndex[Pkm.CHATOT],
        Pkm.DEFAULT,
        200,
        20,
        2,
        2,
        3,
        AttackSprite.PSYCHIC_RANGE,
        AttackType.SPECIAL,
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
      PkmIndex[Pkm.KECLEON],
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
      [Synergy.NORMAL, Synergy.GHOST],
      Rarity.MYTHICAL,
      "0351",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.NORMAL, Synergy.GHOST, Synergy.FIRE],
      Rarity.MYTHICAL,
      "0351-0001",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.DRAGON_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.NORMAL, Synergy.GHOST, Synergy.WATER],
      Rarity.MYTHICAL,
      "0351-0002",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.NORMAL, Synergy.GHOST, Synergy.ICE],
      Rarity.MYTHICAL,
      "0351-0003",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.ICE_MELEE,
      AttackType.SPECIAL,
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
      "0645",
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
      "0642",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.FLYING],
      Rarity.MYTHICAL,
      "0641",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
      2,
      100,
      Ability.DEFAULT,
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
      "0647",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      "0639",
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
      "0640",
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
      "0638",
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
      PkmIndex[Pkm.MAWILE],
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
      "0490",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0479",
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0442",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      "0359",
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
      "0131",
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
      Ability.SOAK,
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
      "0380",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0381",
      Pkm.DEFAULT,
      200,
      20,
      3,
      3,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0480",
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0481",
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0482",
      Pkm.DEFAULT,
      200,
      12,
      3,
      3,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
      2,
      110,
      Ability.SONG_OF_DESIRE,
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
      [Synergy.PSYCHIC, Synergy.MONSTER],
      Rarity.MYTHICAL,
      "0150",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0646",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0643",
      Pkm.DEFAULT,
      300,
      30,
      4,
      6,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0644",
      Pkm.DEFAULT,
      300,
      30,
      4,
      6,
      3,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      "0251",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0494",
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
      "0385",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.MYTHICAL,
      "0493",
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
      Ability.HAPPY_HOUR,
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
      [Synergy.PSYCHIC, Synergy.HUMAN],
      Rarity.MYTHICAL,
      "0386",
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
      "0492",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.GRASS_RANGE,
      AttackType.SPECIAL,
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
      "0488",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      "0485",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0250",
      Pkm.DEFAULT,
      300,
      30,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      "0383-0001",
      Pkm.DEFAULT,
      400,
      40,
      10,
      10,
      1,
      AttackSprite.FIRE_MELEE,
      AttackType.TRUE,
      3,
      100,
      Ability.BURN,
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
      "0382-0001",
      Pkm.DEFAULT,
      400,
      40,
      5,
      5,
      3,
      AttackSprite.WATER_RANGE,
      AttackType.TRUE,
      3,
      100,
      Ability.THUNDER,
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
      "0384-0001",
      Pkm.DEFAULT,
      400,
      40,
      5,
      5,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.TRUE,
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
      "0043",
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
      "0044",
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
      "0045",
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
      "0182",
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
      "0698",
      Pkm.AURORUS,
      150,
      10,
      4,
      5,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.SPECIAL,
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
      "0699",
      Pkm.DEFAULT,
      330,
      16,
      8,
      10,
      1,
      AttackSprite.ROCK_MELEE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.CARBINK],
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
      PkmIndex[Pkm.DIANCIE],
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
      "0347",
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
      "0348",
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
      "0566",
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
      "0567",
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
      "0410",
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
      "0411",
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
      "0564",
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
      "0565",
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
      "0345",
      Pkm.CRADILY,
      60,
      8,
      2,
      2,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.SPECIAL,
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
      "0346",
      Pkm.DEFAULT,
      140,
      14,
      4,
      4,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.SPECIAL,
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
      "0408",
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
      "0409",
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
      "0140",
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
      "0141",
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
      "0138",
      Pkm.OMASTAR,
      80,
      8,
      1,
      3,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.SPECIAL,
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
      "0139",
      Pkm.DEFAULT,
      150,
      16,
      2,
      4,
      2,
      AttackSprite.ROCK_MELEE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.CLAMPERL],
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
      PkmIndex[Pkm.GOREBYSS],
      Pkm.DEFAULT,
      220,
      14,
      3,
      3,
      2,
      AttackSprite.WATER_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.HUNTAIL],
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
      [Synergy.FOSSIL, Synergy.WATER],
      Rarity.EPIC,
      PkmIndex[Pkm.RELICANTH],
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
      Ability.DEFAULT,
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
      "0696",
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
      "0697",
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
      [Synergy.MINERAL, Synergy.FLYING],
      Rarity.MYTHICAL,
      PkmIndex[Pkm.AERODACTYL],
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
      [Synergy.BUG, Synergy.METAL],
      Rarity.MYTHICAL,
      PkmIndex[Pkm.GENESECT],
      Pkm.DEFAULT,
      270,
      22,
      6,
      3,
      1,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
      3,
      100,
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
      PkmIndex[Pkm.HATENNA],
      Pkm.HATTREM,
      50,
      5,
      1,
      2,
      1,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.HATTREM],
      Pkm.HATTERENE,
      130,
      11,
      4,
      6,
      1,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.HATTERENE],
      Pkm.DEFAULT,
      240,
      17,
      5,
      8,
      1,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.FENNEKIN],
      Pkm.BRAIXEN,
      70,
      6,
      1,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
      1,
      90,
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
      PkmIndex[Pkm.BRAIXEN],
      Pkm.DELPHOX,
      150,
      11,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
      2,
      90,
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
      PkmIndex[Pkm.DELPHOX],
      Pkm.DEFAULT,
      250,
      15,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
      3,
      90,
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
      PkmIndex[Pkm.REGIELEKI],
      Pkm.DEFAULT,
      270,
      17,
      3,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.REGIDRAGO],
      Pkm.DEFAULT,
      270,
      17,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.GUZZLORD],
      Pkm.DEFAULT,
      400,
      22,
      3,
      3,
      3,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.ETERNATUS],
      Pkm.DEFAULT,
      270,
      22,
      3,
      3,
      3,
      AttackSprite.POISON_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.NINCADA],
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
      PkmIndex[Pkm.NINJASK],
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
      PkmIndex[Pkm.SHEDNINJA],
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
      PkmIndex[Pkm.HAPPINY],
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
      PkmIndex[Pkm.CHANSEY],
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
      PkmIndex[Pkm.BLISSEY],
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
      PkmIndex[Pkm.TAPU_KOKO],
      Pkm.DEFAULT,
      270,
      17,
      3,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
      2,
      70,
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
      PkmIndex[Pkm.TAPU_LELE],
      Pkm.DEFAULT,
      270,
      17,
      3,
      3,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
      2,
      70,
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
      PkmIndex[Pkm.STAKATAKA],
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
      PkmIndex[Pkm.BLACEPHALON],
      Pkm.DEFAULT,
      200,
      18,
      3,
      3,
      3,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.HOUNDOUR],
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
      PkmIndex[Pkm.HOUNDOOM],
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
      PkmIndex[Pkm.MEGA_HOUNDOOM],
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
      PkmIndex[Pkm.CACNEA],
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
      PkmIndex[Pkm.CACTURNE],
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
      PkmIndex[Pkm.PUMPKABOO],
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
      PkmIndex[Pkm.GOURGEIST],
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
      PkmIndex[Pkm.NOIBAT],
      Pkm.NOIVERN,
      60,
      5,
      2,
      2,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.NOIVERN],
      Pkm.DEFAULT,
      110,
      9,
      2,
      2,
      2,
      AttackSprite.FLYING_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.BUIZEL],
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
      PkmIndex[Pkm.FLOATZEL],
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
      PkmIndex[Pkm.PONYTA],
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
      PkmIndex[Pkm.RAPIDASH],
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
      PkmIndex[Pkm.MAKUHITA],
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
      PkmIndex[Pkm.HARIYAMA],
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
      PkmIndex[Pkm.JOLTIK],
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
      PkmIndex[Pkm.GALVANTULA],
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
      PkmIndex[Pkm.CORPHISH],
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
      PkmIndex[Pkm.CRAWDAUNT],
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
      "0052",
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
      "0053",
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
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.LEGENDARY,
      "0446",
      Pkm.SNORLAX,
      160,
      15,
      3,
      5,
      1,
      AttackSprite.NORMAL_MELEE,
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

export class Snorlax extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(
      Pkm.SNORLAX,
      [Synergy.NORMAL, Synergy.FIELD],
      Rarity.LEGENDARY,
      "0143",
      Pkm.DEFAULT,
      350,
      25,
      5,
      7,
      1,
      AttackSprite.NORMAL_MELEE,
      AttackType.PHYSICAL,
      2,
      100,
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
      "0058",
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
      "0059",
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
      [Synergy.ICE, Synergy.PSYCHIC],
      Rarity.COMMON,
      PkmIndex[Pkm.SMOOCHUM],
      Pkm.JYNX,
      60,
      5,
      1,
      1,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      [Synergy.ICE, Synergy.PSYCHIC],
      Rarity.COMMON,
      PkmIndex[Pkm.JYNX],
      Pkm.DEFAULT,
      110,
      10,
      2,
      2,
      2,
      AttackSprite.PSYCHIC_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.SALANDIT],
      Pkm.SALAZZLE,
      70,
      6,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.SALAZZLE],
      Pkm.DEFAULT,
      120,
      10,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.VENONAT],
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
      PkmIndex[Pkm.VENOMOTH],
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
      [Synergy.ELECTRIC, Synergy.METAL],
      Rarity.COMMON,
      PkmIndex[Pkm.VOLTORB],
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
      [Synergy.ELECTRIC, Synergy.METAL],
      Rarity.COMMON,
      PkmIndex[Pkm.ELECTRODE],
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
      PkmIndex[Pkm.SLUGMA],
      Pkm.MAGCARGO,
      70,
      5,
      3,
      1,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.MAGCARGO],
      Pkm.DEFAULT,
      150,
      10,
      6,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.SNEASEL],
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
      PkmIndex[Pkm.WEAVILE],
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
      [Synergy.POISON, Synergy.FIGHTING],
      Rarity.RARE,
      PkmIndex[Pkm.CROAGUNK],
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
      [Synergy.POISON, Synergy.FIGHTING],
      Rarity.RARE,
      PkmIndex[Pkm.TOXICROAK],
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
      PkmIndex[Pkm.CHINCHOU],
      Pkm.LANTURN,
      60,
      5,
      2,
      3,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.LANTURN],
      Pkm.DEFAULT,
      115,
      9,
      3,
      5,
      2,
      AttackSprite.ELECTRIC_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.POOCHYENA],
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
      PkmIndex[Pkm.MIGHTYENA],
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
      PkmIndex[Pkm.BRONZOR],
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
      PkmIndex[Pkm.BRONZONG],
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
      PkmIndex[Pkm.DRIFLOON],
      Pkm.DRIFBLIM,
      70,
      5,
      2,
      2,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.DRIFBLIM],
      Pkm.DEFAULT,
      140,
      10,
      3,
      3,
      2,
      AttackSprite.GHOST_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.SHROOMISH],
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
      PkmIndex[Pkm.BRELOOM],
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
      PkmIndex[Pkm.TENTACOOL],
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
      PkmIndex[Pkm.TENTACRUEL],
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
      PkmIndex[Pkm.SNUBULL],
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
      Ability.EARTHQUAKE,
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
      PkmIndex[Pkm.GRANBULL],
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
      Ability.EARTHQUAKE,
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
      PkmIndex[Pkm.VULPIX],
      Pkm.NINETALES,
      65,
      6,
      2,
      2,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.NINETALES],
      Pkm.DEFAULT,
      130,
      12,
      3,
      3,
      2,
      AttackSprite.FIRE_RANGE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.ALOLAN_VULPIX],
      Pkm.ALOLAN_NINETALES,
      65,
      6,
      2,
      2,
      2,
      AttackSprite.ICE_MELEE,
      AttackType.SPECIAL,
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
      PkmIndex[Pkm.ALOLAN_NINETALES],
      Pkm.DEFAULT,
      130,
      12,
      3,
      3,
      2,
      AttackSprite.ICE_MELEE,
      AttackType.SPECIAL,
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
