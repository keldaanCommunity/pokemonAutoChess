/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import {Schema, type, ArraySchema, SetSchema} from '@colyseus/schema';
import uniqid from 'uniqid';
import { Emotion, IPokemon } from '../../types';
import {SPECIAL_SKILL, TYPE, RARITY, COST, ATTACK_TYPE, PKM} from '../enum';

export class Pokemon extends Schema implements IPokemon{
  @type('string') id: string;
  @type('string') name: string;
  @type(['string']) types = new ArraySchema<string>();
  @type('string') rarity: string;
  @type('string') index: string;
  @type('string') evolution:string;
  @type('int8') positionX = -1;
  @type('int8') positionY = -1;
  @type('uint8') cost: number;
  @type('string') attackSprite: string;
  @type('float32') atkSpeed = 0.75;
  @type('uint8') def: number;
  @type('uint8') speDef: number;
  @type('string') attackType: string;
  @type('uint16') atk: number;
  @type('uint16') hp: number;
  @type('uint8') range: number;
  @type('uint8') stars: number;
  @type('uint8') maxMana: number;
  @type('string') skill: string;
  @type({set: 'string'}) items = new SetSchema<string>();
  @type('boolean') shiny: boolean;
  @type('string') emotion: Emotion;
  fossilTimer: number;

  constructor(
     name: string,
      types: string[],
      rarity: string,
      index: string,
      evolution: string,
      hp: number,
      atk: number,
      def: number,
      speDef: number,
      range: number,
      attackSprite: string,
      attackType: string,
      stars: number,
      maxMana: number,
      skill: string,
      shiny: boolean,
      emotion: Emotion) {
    super();
    this.id = uniqid();
    this.name = name;
    this.rarity = rarity;
    this.index = index;
    this.evolution = evolution;
    this.cost = COST[rarity];
    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.speDef = speDef;
    this.range = range;
    this.attackSprite = attackSprite;
    this.attackType = attackType;
    this.stars = stars;
    this.maxMana = maxMana;
    this.skill = skill;
    this.shiny = shiny;
    this.emotion = emotion;
    types.forEach(type=>{
      this.types.push(type);
    });

    if (this.types.includes(TYPE.FOSSIL) && this.evolution != '') {
      switch (this.rarity) {
        case RARITY.EPIC:
          this.fossilTimer = 8;
          break;

        case RARITY.RARE:
          this.fossilTimer = 6;
          break;

        case RARITY.UNCOMMON:
          this.fossilTimer = 4;
          break;

        default:
          break;
      }
    }
  }
}

export class Ditto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DITTO, [TYPE.NORMAL], RARITY.LEGENDARY, '0132', '', 30, 1, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Electrike extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ELECTRIKE, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.LEGENDARY, '0309', PKM.MANECTRIC, 110, 5, 5, 5, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 1, 60, SPECIAL_SKILL.VOLT_SWITCH,shiny, emotion);
  }
}

export class Manectric extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MANECTRIC, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.LEGENDARY, '0310', PKM.MEGAMANECTRIC, 150, 11, 6, 6, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 2, 60, SPECIAL_SKILL.VOLT_SWITCH,shiny, emotion);
  }
}

export class MegaManectric extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGAMANECTRIC, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.LEGENDARY, '0310-0001', '', 300, 17, 7, 7, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 3, 60, SPECIAL_SKILL.VOLT_SWITCH,shiny, emotion);
  }
}

export class Shuppet extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SHUPPET, [TYPE.DARK, TYPE.GHOST], RARITY.LEGENDARY, '0353', PKM.BANETTE, 100, 5, 3, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 140, SPECIAL_SKILL.SHADOW_CLONE,shiny, emotion);
  }
}

export class Banette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BANETTE, [TYPE.DARK, TYPE.GHOST], RARITY.LEGENDARY, '0354', PKM.MEGABANETTE, 140, 11, 4, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 140, SPECIAL_SKILL.SHADOW_CLONE,shiny, emotion);
  }
}

export class MegaBanette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGABANETTE, [TYPE.DARK, TYPE.GHOST], RARITY.LEGENDARY, '0354-0001', '', 240, 21, 5, 6, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 140, SPECIAL_SKILL.SHADOW_CLONE,shiny, emotion);
  }
}

export class Riolu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RIOLU, [TYPE.FIGHTING, TYPE.HUMAN], RARITY.LEGENDARY, '0447', PKM.LUCARIO, 90, 5, 3, 3, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.SILENCE,shiny, emotion);
  }
}

export class Lucario extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LUCARIO, [TYPE.FIGHTING, TYPE.HUMAN, TYPE.METAL], RARITY.LEGENDARY, '0448', PKM.MEGALUCARIO, 130, 11, 3, 3, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SILENCE,shiny, emotion);
  }
}

export class MegaLucario extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGALUCARIO, [TYPE.FIGHTING, TYPE.HUMAN, TYPE.METAL], RARITY.LEGENDARY, '0448-0001', '', 230, 21, 3, 3, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.SILENCE,shiny, emotion);
  }
}

export class Swablu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SWABLU, [TYPE.FAIRY, TYPE.DRAGON, TYPE.SOUND], RARITY.LEGENDARY, '0333', PKM.ALTARIA, 90, 5, 3, 3, 2, 'DRAGON/range', ATTACK_TYPE.SPECIAL, 1, 110, SPECIAL_SKILL.HYPER_VOICE,shiny, emotion);
  }
}

export class Altaria extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ALTARIA, [TYPE.FAIRY, TYPE.DRAGON, TYPE.SOUND], RARITY.LEGENDARY, '0334', PKM.MEGAALTARIA, 130, 11, 4, 4, 2, 'DRAGON/range', ATTACK_TYPE.SPECIAL, 2, 110, SPECIAL_SKILL.HYPER_VOICE,shiny, emotion);
  }
}

export class MegaAltaria extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGAALTARIA, [TYPE.FAIRY, TYPE.DRAGON, TYPE.SOUND], RARITY.LEGENDARY, '0334-0001', '', 230, 21, 5, 5, 2, 'DRAGON/range', ATTACK_TYPE.SPECIAL, 3, 110, SPECIAL_SKILL.HYPER_VOICE,shiny, emotion);
  }
}

export class Scyther extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SCYTHER, [TYPE.BUG, TYPE.FLYING], RARITY.LEGENDARY, '0123', PKM.SCIZOR, 90, 5, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.KING_SHIELD,shiny, emotion);
  }
}

export class Scizor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SCIZOR, [TYPE.BUG, TYPE.FLYING, TYPE.METAL], RARITY.LEGENDARY, '0212', PKM.MEGASCIZOR, 130, 9, 6, 6, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.KING_SHIELD,shiny, emotion);
  }
}

export class MegaScizor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGASCIZOR, [TYPE.BUG, TYPE.FLYING, TYPE.METAL], RARITY.LEGENDARY, '0212-0001', '', 230, 20, 7, 7, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.KING_SHIELD,shiny, emotion);
  }
}

export class Buneary extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BUNEARY, [TYPE.NORMAL, TYPE.FIGHTING], RARITY.LEGENDARY, '0427', PKM.LOPUNNY, 110, 5, 5, 5, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 1, 60, SPECIAL_SKILL.HIGH_JUMP_KICK,shiny, emotion);
  }
}

export class Lopunny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LOPUNNY, [TYPE.NORMAL, TYPE.FIGHTING], RARITY.LEGENDARY, '0428', PKM.MEGALOPUNNY, 150, 9, 6, 6, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 2, 60, SPECIAL_SKILL.HIGH_JUMP_KICK,shiny, emotion);
  }
}

export class MegaLopunny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGALOPUNNY, [TYPE.NORMAL, TYPE.FIGHTING], RARITY.LEGENDARY, '0428-0001', '', 250, 25, 7, 7, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 3, 60, SPECIAL_SKILL.HIGH_JUMP_KICK,shiny, emotion);
  }
}

export class Onix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ONIX, [TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], RARITY.LEGENDARY, '0095', PKM.STEELIX, 150, 5, 7, 7, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.IRON_DEFENSE,shiny, emotion);
  }
}

export class Steelix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.STEELIX, [TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], RARITY.LEGENDARY, '0208', PKM.MEGASTEELIX, 300, 9, 10, 10, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.IRON_DEFENSE,shiny, emotion);
  }
}

export class MegaSteelix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGASTEELIX, [TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], RARITY.LEGENDARY, '0208-0001', '', 400, 20, 20, 20, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.IRON_DEFENSE,shiny, emotion);
  }
}

export class Growlithe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GROWLITHE, [], RARITY.LEGENDARY, '0058', PKM.ARCANINE, 90, 9, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Arcanine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ARCANINE, [], RARITY.LEGENDARY, '0059', '', 130, 20, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Numel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.NUMEL, [TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], RARITY.LEGENDARY, '0322', PKM.CAMERUPT, 90, 5, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BURN,shiny, emotion);
  }
}

export class Camerupt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CAMERUPT, [TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], RARITY.LEGENDARY, '0323', PKM.MEGACAMERUPT, 150, 9, 10, 10, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BURN,shiny, emotion);
  }
}

export class MegaCamerupt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGACAMERUPT, [TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], RARITY.LEGENDARY, '0323-0001', '', 230, 20, 15, 15, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BURN,shiny, emotion);
  }
}

export class Munchlax extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MUNCHLAX, [], RARITY.LEGENDARY, '0446', PKM.SNORLAX, 90, 9, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Snorlax extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SNORLAX, [], RARITY.LEGENDARY, '0143', '', 130, 20, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Meditite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEDITITE, [TYPE.PSYCHIC, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, '0307', PKM.MEDICHAM, 90, 5, 5, 5, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.CONFUSION,shiny, emotion);
  }
}

export class Medicham extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEDICHAM, [TYPE.PSYCHIC, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, '0308', PKM.MEGAMEDICHAM, 130, 9, 6, 6, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.CONFUSION,shiny, emotion);
  }
}

export class MegaMedicham extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGAMEDICHAM, [TYPE.PSYCHIC, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, '0308-0001', '', 230, 20, 7, 7, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.CONFUSION,shiny, emotion);
  }
}

export class Elekid extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ELEKID, [TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, '0239', PKM.ELECTABUZZ, 90, 5, 4, 4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DISCHARGE,shiny, emotion);
  }
}

export class Electabuzz extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ELECTABUZZ, [TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, '0125', PKM.ELECTIVIRE, 130, 9, 5, 5, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DISCHARGE,shiny, emotion);
  }
}

export class Electivire extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ELECTIVIRE, [TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, '0466', '', 230, 20, 6, 6, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DISCHARGE,shiny, emotion);
  }
}

export class Gible extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GIBLE, [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, '0443', PKM.GABITE, 90, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DRAGON_TAIL,shiny, emotion);
  }
}

export class Gabite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GABITE, [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, '0444', PKM.GARCHOMP, 130, 9, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DRAGON_TAIL,shiny, emotion);
  }
}

export class Garchomp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GARCHOMP, [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, '0445', '', 230, 20, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DRAGON_TAIL,shiny, emotion);
  }
}

export class Beldum extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BELDUM, [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, '0374', PKM.METANG, 90, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.METEOR_MASH,shiny, emotion);
  }
}

export class Metang extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.METANG, [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, '0375', PKM.METAGROSS, 130, 9, 6, 6, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.METEOR_MASH,shiny, emotion);
  }
}

export class Metagross extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.METAGROSS, [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, '0376', '', 230, 20, 8, 8, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.METEOR_MASH,shiny, emotion);
  }
}

export class Tympole extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TYMPOLE, [TYPE.WATER, TYPE.GROUND, TYPE.SOUND], RARITY.EPIC, '0535', PKM.PALPITOAD, 90, 5, 4, 4, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 90, SPECIAL_SKILL.EXPLOSION,shiny, emotion);
  }
}

export class Palpitoad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PALPITOAD, [TYPE.WATER, TYPE.GROUND, TYPE.SOUND], RARITY.EPIC, '0536', PKM.SEISMITOAD, 130, 9, 5, 5, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 90, SPECIAL_SKILL.EXPLOSION,shiny, emotion);
  }
}

export class Seismitoad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SEISMITOAD, [TYPE.WATER, TYPE.GROUND, TYPE.SOUND], RARITY.EPIC, '0537', '', 230, 20, 6, 6, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 90, SPECIAL_SKILL.EXPLOSION,shiny, emotion);
  }
}

export class Bagon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BAGON, [TYPE.DRAGON, TYPE.MONSTER], RARITY.EPIC, '0371', PKM.SHELGON, 90, 5, 3, 3, 1, 'DRAGON/melee', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Shelgon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SHELGON, [TYPE.DRAGON, TYPE.MONSTER], RARITY.EPIC, '0372', PKM.SALAMENCE, 130, 9, 3, 3, 1, 'DRAGON/melee', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Salamence extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SALAMENCE, [TYPE.DRAGON, TYPE.MONSTER, TYPE.FLYING], RARITY.EPIC, '0373', '', 230, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Ralts extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RALTS, [TYPE.PSYCHIC, TYPE.FAIRY, TYPE.HUMAN], RARITY.EPIC, '0280', PKM.KIRLIA, 90, 5, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.CALM_MIND,shiny, emotion);
  }
}

export class Kirlia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KIRLIA, [TYPE.PSYCHIC, TYPE.FAIRY, TYPE.HUMAN], RARITY.EPIC, '0281', PKM.GARDEVOIR, 130, 9, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND,shiny, emotion);
  }
}

export class Gardevoir extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GARDEVOIR, [TYPE.PSYCHIC, TYPE.FAIRY, TYPE.HUMAN], RARITY.EPIC, '0282', '', 230, 18, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.CALM_MIND,shiny, emotion);
  }
}

export class Budew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BUDEW, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.EPIC, '0406', PKM.ROSELIA, 90, 5, 1, 1, 3, 'GRASS/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.PETAL_DANCE,shiny, emotion);
  }
}

export class Roselia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ROSELIA, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.EPIC, '0315', PKM.ROSERADE, 130, 9, 1, 1, 3, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.PETAL_DANCE,shiny, emotion);
  }
}

export class Roserade extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ROSERADE, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.EPIC, '0407', '', 230, 18, 1, 1, 3, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.PETAL_DANCE,shiny, emotion);
  }
}

export class Slakoth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SLAKOTH, [TYPE.NORMAL, TYPE.FIELD], RARITY.EPIC, '0287', PKM.VIGOROTH, 90, 5, 4, 4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Vigoroth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VIGOROTH, [TYPE.NORMAL, TYPE.FIELD], RARITY.EPIC, '0288', PKM.SLAKING, 130, 9, 4, 4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Slaking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SLAKING, [TYPE.NORMAL, TYPE.FIELD], RARITY.EPIC, '0289', '', 230, 20, 4, 4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Honedge extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HONEDGE, [TYPE.GHOST, TYPE.METAL], RARITY.EPIC, '0679', PKM.DOUBLADE, 90, 8, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.KING_SHIELD,shiny, emotion);
  }
}

export class Doublade extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DOUBLADE, [TYPE.GHOST, TYPE.METAL], RARITY.EPIC, '0680', PKM.AEGISLASH, 130, 9, 6, 6, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.KING_SHIELD,shiny, emotion);
  }
}

export class Aegislash extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AEGISLASH, [TYPE.GHOST, TYPE.METAL], RARITY.EPIC, '0681', '', 230, 20, 8, 8, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.KING_SHIELD,shiny, emotion);
  }
}

export class Larvitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LARVITAR, [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, '0246', PKM.PUPITAR, 90, 8, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BITE,shiny, emotion);
  }
}

export class Pupitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PUPITAR, [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, '0247', PKM.TYRANITAR, 130, 9, 6, 6, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BITE,shiny, emotion);
  }
}

export class Tyranitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TYRANITAR, [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, '0248', '', 230, 20, 8, 8, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BITE,shiny, emotion);
  }
}

export class JangmoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.JANGMOO, [TYPE.DRAGON, TYPE.FIGHTING, TYPE.SOUND], RARITY.EPIC, '0782', PKM.HAKAMOO, 90, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 110, SPECIAL_SKILL.CLANGOROUS_SOUL,shiny, emotion);
  }
}

export class HakamoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HAKAMOO, [TYPE.DRAGON, TYPE.FIGHTING, TYPE.SOUND], RARITY.EPIC, '0783', PKM.KOMMOO, 130, 9, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 110, SPECIAL_SKILL.CLANGOROUS_SOUL,shiny, emotion);
  }
}

export class KommoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KOMMOO, [TYPE.DRAGON, TYPE.FIGHTING, TYPE.SOUND], RARITY.EPIC, '0784', '', 230, 20, 8, 8, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 110, SPECIAL_SKILL.CLANGOROUS_SOUL,shiny, emotion);
  }
}

export class Gastly extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GASTLY, [TYPE.MONSTER, TYPE.POISON, TYPE.GHOST], RARITY.LEGENDARY, '0092', PKM.HAUNTER, 90, 8, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 120, SPECIAL_SKILL.NIGHTMARE,shiny, emotion);
  }
}

export class Haunter extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HAUNTER, [TYPE.MONSTER, TYPE.POISON, TYPE.GHOST], RARITY.LEGENDARY, '0093', PKM.GENGAR, 130, 12, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 120, SPECIAL_SKILL.NIGHTMARE,shiny, emotion);
  }
}

export class Gengar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GENGAR, [TYPE.MONSTER, TYPE.POISON, TYPE.GHOST], RARITY.LEGENDARY, '0094', '', 230, 25, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 120, SPECIAL_SKILL.NIGHTMARE,shiny, emotion);
  }
}

export class Abra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ABRA, [TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, '0063', PKM.KADABRA, 90, 5, 1, 1, 4, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 50, SPECIAL_SKILL.TELEPORT,shiny, emotion);
  }
}

export class Kadabra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KADABRA, [TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, '0064', PKM.ALAKAZAM, 130, 9, 1, 1, 4, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 50, SPECIAL_SKILL.TELEPORT,shiny, emotion);
  }
}

export class Alakazam extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ALAKAZAM, [TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, '0065', '', 230, 18, 1, 1, 4, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 50, SPECIAL_SKILL.TELEPORT,shiny, emotion);
  }
}

export class Litwick extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LITWICK, [TYPE.FIRE, TYPE.GHOST], RARITY.EPIC, '0607', PKM.LAMPENT, 90, 5, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.FIRE_BLAST,shiny, emotion);
  }
}

export class Lampent extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LAMPENT, [TYPE.FIRE, TYPE.GHOST], RARITY.EPIC, '0608', PKM.CHANDELURE, 130, 9, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.FIRE_BLAST,shiny, emotion);
  }
}

export class Chandelure extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CHANDELURE, [TYPE.FIRE, TYPE.GHOST], RARITY.EPIC, '0609', '', 230, 18, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.FIRE_BLAST,shiny, emotion);
  }
}

export class Porygon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PORYGON, [TYPE.NORMAL, TYPE.PSYCHIC], RARITY.EPIC, '0137', PKM.PORYGON2, 90, 5, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 1, 90, SPECIAL_SKILL.TRI_ATTACK,shiny, emotion);
  }
}

export class Porygon2 extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PORYGON2, [TYPE.NORMAL, TYPE.PSYCHIC], RARITY.EPIC, '0233', PKM.PORYGONZ, 130, 9, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 2, 90, SPECIAL_SKILL.TRI_ATTACK,shiny, emotion);
  }
}

export class PorygonZ extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PORYGONZ, [TYPE.NORMAL, TYPE.PSYCHIC], RARITY.EPIC, '0474', '', 230, 18, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 3, 90, SPECIAL_SKILL.TRI_ATTACK,shiny, emotion);
  }
}

export class Sewaddle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SEWADDLE, [TYPE.GRASS, TYPE.BUG, TYPE.SOUND], RARITY.EPIC, '0540', PKM.SWADLOON, 80, 5, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 80, SPECIAL_SKILL.GRASS_WHISTLE,shiny, emotion);
  }
}

export class Swadloon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SWADLOON, [TYPE.GRASS, TYPE.BUG, TYPE.SOUND], RARITY.EPIC, '0541', PKM.LEAVANNY, 120, 9, 4, 4, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 80, SPECIAL_SKILL.GRASS_WHISTLE,shiny, emotion);
  }
}

export class Leavanny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LEAVANNY, [TYPE.GRASS, TYPE.BUG, TYPE.SOUND], RARITY.EPIC, '0542', '', 220, 20, 4, 4, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 80, SPECIAL_SKILL.GRASS_WHISTLE,shiny, emotion);
  }
}

export class Turtwig extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TURTWIG, [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.RARE, '0387', PKM.GROTLE, 80, 5, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Grotle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GROTLE, [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.RARE, '0388', PKM.TORTERRA, 120, 9, 4, 4, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Torterra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TORTERRA, [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.RARE, '0389', '', 220, 20, 4, 4, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Deino extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DEINO, [TYPE.DARK, TYPE.DRAGON], RARITY.RARE, '0633', PKM.ZWEILOUS, 80, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Zweilous extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ZWEILOUS, [TYPE.DARK, TYPE.DRAGON], RARITY.RARE, '0634', PKM.HYDREIGON, 120, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Hydreigon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HYDREIGON, [TYPE.DARK, TYPE.DRAGON], RARITY.RARE, '0635', '', 220, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Poliwag extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.POLIWAG, [TYPE.WATER, TYPE.FIGHTING], RARITY.RARE, '0060', PKM.POLIWHIRL, 80, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Poliwhirl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.POLIWHIRL, [TYPE.WATER, TYPE.FIGHTING], RARITY.RARE, '0061', PKM.POLITOED, 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Politoed extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.POLITOED, [TYPE.WATER, TYPE.FIGHTING], RARITY.RARE, '0186', '', 220, 18, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Magby extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAGBY, [TYPE.FIRE, TYPE.HUMAN], RARITY.RARE, '0240', PKM.MAGMAR, 80, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HEAT_WAVE,shiny, emotion);
  }
}

export class Magmar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAGMAR, [TYPE.FIRE, TYPE.HUMAN], RARITY.RARE, '0126', PKM.MAGMORTAR, 120, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HEAT_WAVE,shiny, emotion);
  }
}

export class Magmortar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAGMORTAR, [TYPE.FIRE, TYPE.HUMAN], RARITY.RARE, '0467', '', 220, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HEAT_WAVE,shiny, emotion);
  }
}

export class Solosis extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SOLOSIS, [TYPE.PSYCHIC, TYPE.GHOST], RARITY.RARE, '0577', PKM.DUOSION, 80, 5, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.LEECH_LIFE,shiny, emotion);
  }
}

export class Duosion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DUOSION, [TYPE.PSYCHIC, TYPE.GHOST], RARITY.RARE, '0578', PKM.REUNICLUS, 120, 9, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.LEECH_LIFE,shiny, emotion);
  }
}

export class Reuniclus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.REUNICLUS, [TYPE.PSYCHIC, TYPE.GHOST], RARITY.RARE, '0579', '', 220, 18, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.LEECH_LIFE,shiny, emotion);
  }
}

export class Shinx extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SHINX, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, '0403', PKM.LUXIO, 80, 5, 4, 4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DISCHARGE,shiny, emotion);
  }
}

export class Luxio extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LUXIO, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, '0404', PKM.LUXRAY, 120, 9, 5, 5, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DISCHARGE,shiny, emotion);
  }
}

export class Luxray extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LUXRAY, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, '0405', '', 220, 20, 6, 6, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DISCHARGE,shiny, emotion);
  }
}

export class Cubone extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CUBONE, [TYPE.GROUND, TYPE.MINERAL], RARITY.EPIC, '0104', PKM.MAROWAK, 80, 5, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 60, SPECIAL_SKILL.BONEMERANG,shiny, emotion);
  }
}

export class Marowak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAROWAK, [TYPE.GROUND, TYPE.MINERAL], RARITY.EPIC, '0105', PKM.ALOLANMAROWAK, 120, 9, 5, 5, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 60, SPECIAL_SKILL.BONEMERANG,shiny, emotion);
  }
}

export class AlolanMarowak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ALOLANMAROWAK, [TYPE.GROUND, TYPE.MINERAL, TYPE.FIRE, TYPE.GHOST], RARITY.EPIC, '0105/0001', '', 220, 20, 6, 6, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 60, SPECIAL_SKILL.BONEMERANG,shiny, emotion);
  }
}

export class Axew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AXEW, [TYPE.DRAGON, TYPE.MONSTER], RARITY.RARE, '0610', PKM.FRAXURE, 80, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HEAD_SMASH,shiny, emotion);
  }
}

export class Fraxure extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FRAXURE, [TYPE.DRAGON, TYPE.MONSTER], RARITY.RARE, '0611', PKM.HAXORUS, 120, 9, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HEAD_SMASH,shiny, emotion);
  }
}

export class Haxorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HAXORUS, [TYPE.DRAGON, TYPE.MONSTER], RARITY.RARE, '0612', '', 220, 20, 6, 6, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.HEAD_SMASH,shiny, emotion);
  }
}

export class Dratini extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DRATINI, [TYPE.DRAGON, TYPE.AQUATIC], RARITY.RARE, '0147', PKM.DRAGONAIR, 80, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DRAGON_BREATH,shiny, emotion);
  }
}

export class Dragonair extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DRAGONAIR, [TYPE.DRAGON, TYPE.AQUATIC], RARITY.RARE, '0148', PKM.DRAGONITE, 120, 9, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DRAGON_BREATH,shiny, emotion);
  }
}

export class Dragonite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DRAGONITE, [TYPE.DRAGON, TYPE.AQUATIC, TYPE.FLYING], RARITY.RARE, '0149', '', 220, 20, 6, 6, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DRAGON_BREATH,shiny, emotion);
  }
}

export class Lotad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LOTAD, [TYPE.GRASS, TYPE.WATER], RARITY.RARE, '0270', PKM.LOMBRE, 80, 5, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.TORMENT,shiny, emotion);
  }
}

export class Lombre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LOMBRE, [TYPE.GRASS, TYPE.WATER], RARITY.RARE, '0271', PKM.LUDICOLO, 120, 9, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.TORMENT,shiny, emotion);
  }
}

export class Ludicolo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LUDICOLO, [TYPE.GRASS, TYPE.WATER], RARITY.RARE, '0272', '', 220, 18, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.TORMENT,shiny, emotion);
  }
}

export class Togepi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TOGEPI, [TYPE.NORMAL, TYPE.FAIRY], RARITY.RARE, '0175', PKM.TOGETIC, 80, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 1, 70, SPECIAL_SKILL.WISH,shiny, emotion);
  }
}

export class Togetic extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TOGETIC, [TYPE.NORMAL, TYPE.FAIRY, TYPE.FLYING], RARITY.RARE, '0176', PKM.TOGEKISS, 120, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 2, 70, SPECIAL_SKILL.WISH,shiny, emotion);
  }
}

export class Togekiss extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TOGEKISS, [TYPE.NORMAL, TYPE.FAIRY, TYPE.FLYING], RARITY.RARE, '0468', '', 220, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 3, 70, SPECIAL_SKILL.WISH,shiny, emotion);
  }
}

export class Rhyhorn extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RHYHORN, [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, '0111', PKM.RHYDON, 80, 5, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Rhydon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RHYDON, [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, '0112', PKM.RHYPERIOR, 120, 9, 6, 6, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Rhyperior extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RHYPERIOR, [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, '0464', '', 220, 20, 8, 8, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Fletchling extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FLETCHLING, [TYPE.FIRE, TYPE.FLYING], RARITY.RARE, '0661', PKM.FLETCHINDER, 80, 5, 4, 4, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Fletchinder extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FLETCHINDER, [TYPE.FIRE, TYPE.FLYING], RARITY.RARE, '0662', PKM.TALONFLAME, 120, 9, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Talonflame extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TALONFLAME, [TYPE.FIRE, TYPE.FLYING], RARITY.RARE, '0663', '', 220, 20, 6, 6, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Aron extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ARON, [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, '0304', PKM.LAIRON, 80, 5, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Lairon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LAIRON, [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, '0305', PKM.AGGRON, 120, 9, 6, 6, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Aggron extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AGGRON, [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, '0306', '', 220, 20, 8, 8, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Whismur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.WHISMUR, [TYPE.NORMAL, TYPE.SOUND], RARITY.RARE, '0293', PKM.LOUDRED, 80, 5, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 90, SPECIAL_SKILL.ECHO,shiny, emotion);
  }
}
export class Loudred extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LOUDRED, [TYPE.NORMAL, TYPE.SOUND], RARITY.RARE, '0294', PKM.EXPLOUD, 120, 9, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 90, SPECIAL_SKILL.ECHO,shiny, emotion);
  }
}

export class Exploud extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.EXPLOUD, [TYPE.NORMAL, TYPE.SOUND], RARITY.RARE, '0295', '', 220, 18, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 90, SPECIAL_SKILL.ECHO,shiny, emotion);
  }
}

export class Swinub extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SWINUB, [TYPE.GROUND, TYPE.ICE, TYPE.FIELD], RARITY.COMMON, '0220', PKM.PILOSWINE, 80, 5, 4, 4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Piloswine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PILOSWINE, [TYPE.GROUND, TYPE.ICE, TYPE.FIELD], RARITY.COMMON, '0221', PKM.MAMOSWINE, 120, 9, 4, 4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Mamoswine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAMOSWINE, [TYPE.GROUND, TYPE.ICE, TYPE.FIELD], RARITY.COMMON, '0473', '', 220, 20, 6, 6, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Snover extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SNOVER, [TYPE.GRASS, TYPE.ICE], RARITY.LEGENDARY, '0459', PKM.ABOMASNOW, 80, 7, 6, 6, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.FREEZE,shiny, emotion);
  }
}

export class Abomasnow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ABOMASNOW, [TYPE.GRASS, TYPE.ICE], RARITY.LEGENDARY, '0460', PKM.MEGAABOMASNOW, 120, 11, 8, 8, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.FREEZE,shiny, emotion);
  }
}

export class MegaAbomasnow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGAABOMASNOW, [TYPE.GRASS, TYPE.ICE], RARITY.LEGENDARY, '0460-0001', '', 220, 25, 10, 10, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.FREEZE,shiny, emotion);
  }
}

export class Snorunt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SNORUNT, [TYPE.GHOST, TYPE.ICE], RARITY.EPIC, '0361', PKM.GLALIE, 80, 5, 2, 2, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DARK_PULSE,shiny, emotion);
  }
}

export class Glalie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GLALIE, [TYPE.GHOST, TYPE.ICE], RARITY.EPIC, '0362', PKM.FROSLASS, 120, 9, 2, 2, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DARK_PULSE,shiny, emotion);
  }
}

export class Froslass extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FROSLASS, [TYPE.GHOST, TYPE.ICE], RARITY.EPIC, '0478', '', 220, 20, 2, 2, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DARK_PULSE,shiny, emotion);
  }
}

export class Vanillite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VANILLITE, [TYPE.FAIRY, TYPE.ICE], RARITY.RARE, '0582', PKM.VANILLISH, 80, 5, 2, 2, 3, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.SLEEP,shiny, emotion);
  }
}

export class Vanillish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VANILLISH, [TYPE.FAIRY, TYPE.ICE], RARITY.RARE, '0583', PKM.VANILLUXE, 120, 8, 2, 2, 3, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SLEEP,shiny, emotion);
  }
}

export class Vanilluxe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VANILLUXE, [TYPE.FAIRY, TYPE.ICE], RARITY.RARE, '0584', '', 220, 19, 2, 2, 3, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.SLEEP,shiny, emotion);
  }
}

export class Trapinch extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TRAPINCH, [TYPE.GROUND, TYPE.BUG], RARITY.RARE, '0328', PKM.VIBRAVA, 80, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DRAGON_TAIL,shiny, emotion);
  }
}

export class Vibrava extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VIBRAVA, [TYPE.GROUND, TYPE.DRAGON, TYPE.BUG], RARITY.RARE, '0329', PKM.FLYGON, 120, 9, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DRAGON_TAIL,shiny, emotion);
  }
}

export class Flygon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FLYGON, [TYPE.GROUND, TYPE.DRAGON, TYPE.BUG], RARITY.RARE, '0330', '', 220, 20, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DRAGON_TAIL,shiny, emotion);
  }
}

export class Pichu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PICHU, [TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, '0172', PKM.PIKACHU, 80, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Pikachu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PIKACHU, [TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, '0025', PKM.RAICHU, 120, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Raichu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RAICHU, [TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, '0026', '', 220, 18, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Bulbasaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BULBASAUR, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.RARE, '0001', PKM.IVYSAUR, 80, 5, 2, 2, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.ROOT,shiny, emotion);
  }
}

export class Ivysaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.IVYSAUR, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.RARE, '0002', PKM.VENUSAUR, 120, 9, 3, 3, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.ROOT,shiny, emotion);
  }
}

export class Venusaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VENUSAUR, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.RARE, '0003', '', 210, 18, 4, 4, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.ROOT,shiny, emotion);
  }
}

export class Igglybuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.IGGLYBUFF, [TYPE.FAIRY, TYPE.NORMAL, TYPE.SOUND], RARITY.UNCOMMON, '0174', PKM.JIGGLYPUFF, 70, 5, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 1, 90, SPECIAL_SKILL.SLEEP,shiny, emotion);
  }
}

export class Jigglypuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.JIGGLYPUFF, [TYPE.FAIRY, TYPE.NORMAL, TYPE.SOUND], RARITY.UNCOMMON, '0039', PKM.WIGGLYTUFF, 120, 9, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 2, 90, SPECIAL_SKILL.SLEEP,shiny, emotion);
  }
}

export class Wigglytuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.WIGGLYTUFF, [TYPE.FAIRY, TYPE.NORMAL, TYPE.SOUND], RARITY.UNCOMMON, '0040', '', 210, 18, 2, 2, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 3, 90, SPECIAL_SKILL.SLEEP,shiny, emotion);
  }
}

export class Duskull extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DUSKULL, [TYPE.DARK, TYPE.GHOST], RARITY.UNCOMMON, '0355', PKM.DUSCLOPS, 70, 5, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.NIGHT_SLASH,shiny, emotion);
  }
}

export class Dusclops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DUSCLOPS, [TYPE.DARK, TYPE.GHOST], RARITY.UNCOMMON, '0356', PKM.DUSKNOIR, 120, 9, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.NIGHT_SLASH,shiny, emotion);
  }
}

export class Dusknoir extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DUSKNOIR, [TYPE.DARK, TYPE.GHOST], RARITY.UNCOMMON, '0477', '', 210, 18, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.NIGHT_SLASH,shiny, emotion);
  }
}

export class Magnemite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAGNEMITE, [TYPE.ELECTRIC, TYPE.METAL], RARITY.UNCOMMON, '0081', PKM.MAGNETON, 70, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.CHARGE,shiny, emotion);
  }
}

export class Magneton extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAGNETON, [TYPE.ELECTRIC, TYPE.METAL], RARITY.UNCOMMON, '0082', PKM.MAGNEZONE, 120, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CHARGE,shiny, emotion);
  }
}

export class Magnezone extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAGNEZONE, [TYPE.ELECTRIC, TYPE.METAL], RARITY.UNCOMMON, '0462', '', 210, 20, 2, 2, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.CHARGE,shiny, emotion);
  }
}

export class Horsea extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HORSEA, [TYPE.WATER, TYPE.DRAGON], RARITY.UNCOMMON, '0116', PKM.SEADRA, 70, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Seadra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SEADRA, [TYPE.WATER, TYPE.DRAGON], RARITY.UNCOMMON, '0117', PKM.KINGDRA, 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Kingdra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KINGDRA, [TYPE.WATER, TYPE.DRAGON], RARITY.UNCOMMON, '0230', '', 210, 20, 2, 2, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Flabebe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FLABEBE, [TYPE.SOUND, TYPE.FAIRY, TYPE.FLORA], RARITY.UNCOMMON, '0669', PKM.FLOETTE, 70, 5, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 90, SPECIAL_SKILL.DISARMING_VOICE,shiny, emotion);
  }
}

export class Floette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FLOETTE, [TYPE.SOUND, TYPE.FAIRY, TYPE.FLORA], RARITY.UNCOMMON, '0670', PKM.FLORGES, 120, 9, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 90, SPECIAL_SKILL.DISARMING_VOICE,shiny, emotion);
  }
}
export class Florges extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FLORGES, [TYPE.SOUND, TYPE.FAIRY, TYPE.FLORA], RARITY.UNCOMMON, '0671', '', 210, 20, 2, 2, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 90, SPECIAL_SKILL.DISARMING_VOICE,shiny, emotion);
  }
}

export class Klink extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KLINK, [TYPE.ELECTRIC, TYPE.METAL], RARITY.UNCOMMON, '0599', PKM.KLANG, 70, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Klang extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KLANG, [TYPE.ELECTRIC, TYPE.METAL], RARITY.UNCOMMON, '0600', PKM.KLINKLANG, 120, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Klinklang extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KLINKLANG, [TYPE.ELECTRIC, TYPE.METAL], RARITY.UNCOMMON, '0601', '', 210, 20, 2, 2, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Chikorita extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CHIKORITA, [TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, '0152', PKM.BAYLEEF, 70, 5, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Bayleef extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BAYLEEF, [TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, '0153', PKM.MEGANIUM, 120, 9, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Meganium extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGANIUM, [TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, '0154', '', 210, 20, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Sandile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SANDILE, [TYPE.GROUND, TYPE.DARK, TYPE.FIELD], RARITY.UNCOMMON, '0551', PKM.KROKOROK, 70, 5, 3, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Krookorok extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KROKOROK, [TYPE.GROUND, TYPE.DARK, TYPE.FIELD], RARITY.UNCOMMON, '0552', PKM.KROOKODILE, 120, 9, 3, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Krookodile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KROOKODILE, [TYPE.GROUND, TYPE.DARK, TYPE.FIELD], RARITY.UNCOMMON, '0553', '', 210, 20, 3, 3, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STOMP,shiny, emotion);
  }
}

export class Venipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VENIPEDE, [TYPE.BUG, TYPE.POISON], RARITY.UNCOMMON, '0543', PKM.WHIRLIPEDE, 70, 5, 3, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.POISON_STING,shiny, emotion);
  }
}

export class Whirlipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.WHIRLIPEDE, [TYPE.BUG, TYPE.POISON], RARITY.UNCOMMON, '0544', PKM.SCOLIPEDE, 120, 9, 3, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.POISON_STING,shiny, emotion);
  }
}

export class Scolipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SCOLIPEDE, [TYPE.BUG, TYPE.POISON], RARITY.UNCOMMON, '0545', '', 210, 20, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.POISON_STING,shiny, emotion);
  }
}

export class Spheal extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SPHEAL, [TYPE.AQUATIC, TYPE.ICE], RARITY.UNCOMMON, '0363', PKM.SEALEO, 70, 5, 3, 2, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Sealeo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SEALEO, [TYPE.AQUATIC, TYPE.ICE], RARITY.UNCOMMON, '0364', PKM.WALREIN, 120, 9, 3, 2, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Walrein extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.WALREIN, [TYPE.AQUATIC, TYPE.ICE], RARITY.UNCOMMON, '0365', '', 210, 20, 3, 3, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Lillipup extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LILLIPUP, [TYPE.NORMAL, TYPE.FIELD], RARITY.UNCOMMON, '0506', PKM.HERDIER, 70, 5, 3, 2, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Herdier extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HERDIER, [TYPE.NORMAL, TYPE.FIELD], RARITY.UNCOMMON, '0507', PKM.STOUTLAND, 120, 9, 3, 2, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Stoutland extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.STOUTLAND, [TYPE.NORMAL, TYPE.FIELD], RARITY.UNCOMMON, '0508', '', 210, 20, 3, 3, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class NidoranF extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.NIDORANF, [TYPE.POISON, TYPE.FIELD], RARITY.RARE, '0029', PKM.NIDORINA, 70, 5, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.POISON_STING,shiny, emotion);
  }
}

export class Nidorina extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.NIDORINA, [TYPE.POISON, TYPE.FIELD], RARITY.RARE, '0030', PKM.NIDOQUEEN, 120, 9, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.POISON_STING,shiny, emotion);
  }
}

export class Nidoqueen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.NIDOQUEEN, [TYPE.POISON, TYPE.FIELD], RARITY.RARE, '0031', '', 210, 20, 5, 5, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.POISON_STING,shiny, emotion);
  }
}

export class NidoranM extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.NIDORANM, [TYPE.POISON, TYPE.FIELD], RARITY.RARE, '0032', PKM.NIDORINO, 70, 5, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.POISON,shiny, emotion);
  }
}

export class Nidorino extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.NIDORINO, [TYPE.POISON, TYPE.FIELD], RARITY.RARE, '0033', PKM.NIDOKING, 120, 9, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.POISON,shiny, emotion);
  }
}

export class Nidoking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.NIDOKING, [TYPE.POISON, TYPE.FIELD], RARITY.RARE, '0034', '', 210, 20, 5, 5, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.POISON,shiny, emotion);
  }
}

export class Machop extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MACHOP, [TYPE.FIGHTING, TYPE.HUMAN], RARITY.UNCOMMON, '0066', PKM.MACHOKE, 70, 5, 3, 3, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.GUILLOTINE,shiny, emotion);
  }
}

export class Machoke extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MACHOKE, [TYPE.FIGHTING, TYPE.HUMAN], RARITY.UNCOMMON, '0067', PKM.MACHAMP, 120, 9, 3, 3, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.GUILLOTINE,shiny, emotion);
  }
}

export class Machamp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MACHAMP, [TYPE.FIGHTING, TYPE.HUMAN], RARITY.UNCOMMON, '0068', '', 210, 20, 5, 5, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.GUILLOTINE,shiny, emotion);
  }
}

export class Piplup extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PIPLUP, [TYPE.WATER, TYPE.FLYING, TYPE.METAL], RARITY.UNCOMMON, '0393', PKM.PRINPLUP, 70, 5, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.IRON_TAIL,shiny, emotion);
  }
}

export class Prinplup extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PRINPLUP, [TYPE.WATER, TYPE.FLYING, TYPE.METAL], RARITY.UNCOMMON, '0394', PKM.EMPOLEON, 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.IRON_TAIL,shiny, emotion);
  }
}

export class Empoleon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.EMPOLEON, [TYPE.WATER, TYPE.FLYING, TYPE.METAL], RARITY.UNCOMMON, '0395', '', 210, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.IRON_TAIL,shiny, emotion);
  }
}

export class Chimchar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CHIMCHAR, [TYPE.FIRE, TYPE.FIGHTING], RARITY.UNCOMMON, '0390', PKM.MONFERNO, 70, 5, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.TORMENT,shiny, emotion);
  }
}

export class Monferno extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MONFERNO, [TYPE.FIRE, TYPE.FIGHTING], RARITY.UNCOMMON, '0391', PKM.INFERNAPE, 120, 9, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.TORMENT,shiny, emotion);
  }
}

export class Infernape extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.INFERNAPE, [TYPE.FIRE, TYPE.FIGHTING], RARITY.UNCOMMON, '0392', '', 210, 20, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.TORMENT,shiny, emotion);
  }
}

export class Mudkip extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MUDKIP, [TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, '0258', PKM.MARSHTOMP, 70, 5, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Marshtomp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MARSHTOMP, [TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, '0259', PKM.SWAMPERT, 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Swampert extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SWAMPERT, [TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, '0260', '', 210, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Torchic extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TORCHIC, [TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], RARITY.UNCOMMON, '0255', PKM.COMBUSKEN, 70, 5, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BLAZE_KICK,shiny, emotion);
  }
}

export class Combusken extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.COMBUSKEN, [TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], RARITY.UNCOMMON, '0256', PKM.BLAZIKEN, 120, 9, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BLAZE_KICK,shiny, emotion);
  }
}

export class Blaziken extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BLAZIKEN, [TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], RARITY.UNCOMMON, '0257', '', 210, 20, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BLAZE_KICK,shiny, emotion);
  }
}

export class Treecko extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TREECKO, [TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, '0252', PKM.GROVYLE, 70, 5, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.THIEF,shiny, emotion);
  }
}

export class Grovyle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GROVYLE, [TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, '0253', PKM.SCEPTILE, 120, 9, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.THIEF,shiny, emotion);
  }
}

export class Sceptile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SCEPTILE, [TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, '0254', '', 210, 20, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.THIEF,shiny, emotion);
  }
}

export class Cyndaquil extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CYNDAQUIL, [TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, '0155', PKM.QUILAVA, 70, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.WHEEL_OF_FIRE,shiny, emotion);
  }
}

export class Quilava extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.QUILAVA, [TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, '0156', PKM.TYPHLOSION, 120, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.WHEEL_OF_FIRE,shiny, emotion);
  }
}

export class Typhlosion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TYPHLOSION, [TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, '0157', '', 210, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.WHEEL_OF_FIRE,shiny, emotion);
  }
}

export class Slowpoke extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SLOWPOKE, [TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, '0079', PKM.SLOWBRO, 70, 5, 2, 2, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Slowbro extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SLOWBRO, [TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, '0080', PKM.SLOWKING, 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Slowking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SLOWKING, [TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, '0199', '', 210, 20, 4, 4, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Squirtle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SQUIRTLE, [TYPE.WATER, TYPE.FIELD], RARITY.UNCOMMON, '0007', PKM.WARTORTLE, 70, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Wartortle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.WARTORTLE, [TYPE.WATER, TYPE.FIELD], RARITY.UNCOMMON, '0008', PKM.BLASTOISE, 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Blastoise extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BLASTOISE, [TYPE.WATER, TYPE.FIELD], RARITY.UNCOMMON, '0009', '', 210, 20, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Bellsprout extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BELLSPROUT, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, '0069', PKM.WEEPINBELL, 70, 5, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ROOT,shiny, emotion);
  }
}

export class Weepinbell extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.WEEPINBELL, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, '0070', PKM.VICTREEBEL, 120, 9, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROOT,shiny, emotion);
  }
}

export class Victreebel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VICTREEBEL, [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, '0071', '', 210, 20, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.ROOT,shiny, emotion);
  }
}

export class Pikipek extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PIKIPEK, [TYPE.NORMAL, TYPE.FLYING, TYPE.SOUND], RARITY.UNCOMMON, '0731', PKM.TRUMBEAK, 70, 5, 2, 2, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 70, SPECIAL_SKILL.GROWL,shiny, emotion);
  }
}

export class Trumbeak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TRUMBEAK, [TYPE.NORMAL, TYPE.FLYING, TYPE.SOUND], RARITY.UNCOMMON, '0732', PKM.TOUCANNON, 120, 9, 3, 3, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 70, SPECIAL_SKILL.GROWL,shiny, emotion);
  }
}

export class Toucannon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TOUCANNON, [TYPE.NORMAL, TYPE.FLYING, TYPE.SOUND], RARITY.UNCOMMON, '0733', '', 210, 20, 4, 4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 3, 70, SPECIAL_SKILL.GROWL,shiny, emotion);
  }
}

export class Geodude extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GEODUDE, [TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, '0074', PKM.GRAVELER, 60, 5, 2, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ROCK_SLIDE,shiny, emotion);
  }
}

export class Graveler extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GRAVELER, [TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, '0075', PKM.GOLEM, 110, 9, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE,shiny, emotion);
  }
}

export class Golem extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GOLEM, [TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, '0076', '', 200, 20, 8, 8, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.ROCK_SLIDE,shiny, emotion);
  }
}

export class Totodile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TOTODILE, [TYPE.MONSTER, TYPE.AQUATIC], RARITY.COMMON, '0158', PKM.CROCONAW, 60, 5, 2, 2, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BITE,shiny, emotion);
  }
}

export class Croconaw extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CROCONAW, [TYPE.MONSTER, TYPE.AQUATIC], RARITY.COMMON, '0159', PKM.FERALIGATR, 110, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BITE,shiny, emotion);
  }
}

export class Feraligatr extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FERALIGATR, [TYPE.MONSTER, TYPE.AQUATIC], RARITY.COMMON, '0160', '', 200, 20, 5, 5, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BITE,shiny, emotion);
  }
}

export class Azurill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AZURILL, [TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, '0298', PKM.MARILL, 60, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Marill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MARILL, [TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, '0183', PKM.AZUMARILL, 110, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Azumarill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AZUMARILL, [TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, '0184', '', 200, 20, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Zubat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ZUBAT, [TYPE.POISON, TYPE.FLYING, TYPE.SOUND], RARITY.COMMON, '0041', PKM.GOLBAT, 60, 5, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 90, SPECIAL_SKILL.LEECH_LIFE,shiny, emotion);
  }
}

export class Golbat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GOLBAT, [TYPE.POISON, TYPE.FLYING, TYPE.SOUND], RARITY.COMMON, '0042', PKM.CROBAT, 110, 9, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 90, SPECIAL_SKILL.LEECH_LIFE,shiny, emotion);
  }
}

export class Crobat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CROBAT, [TYPE.POISON, TYPE.FLYING, TYPE.SOUND], RARITY.COMMON, '0169', '', 200, 18, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 90, SPECIAL_SKILL.LEECH_LIFE,shiny, emotion);
  }
}

export class Mareep extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAREEP, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, '0179', PKM.FLAFFY, 60, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Flaffy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FLAFFY, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, '0180', PKM.AMPHAROS, 110, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Ampharos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AMPHAROS, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, '0181', '', 200, 18, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Cleffa extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CLEFFA, [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, '0173', PKM.CLEFAIRY, 60, 5, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.METRONOME,shiny, emotion);
  }
}

export class Clefairy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CLEFAIRY, [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, '0035', PKM.CLEFABLE, 110, 9, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.METRONOME,shiny, emotion);
  }
}

export class Clefable extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CLEFABLE, [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, '0036', '', 200, 18, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.METRONOME,shiny, emotion);
  }
}

export class Caterpie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CATERPIE, [TYPE.GRASS, TYPE.BUG], RARITY.COMMON, '0010', PKM.METAPOD, 60, 5, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.BUG_BUZZ,shiny, emotion);
  }
}

export class Metapod extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.METAPOD, [TYPE.GRASS, TYPE.BUG], RARITY.COMMON, '0011', PKM.BUTTERFREE, 110, 9, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.BUG_BUZZ,shiny, emotion);
  }
}

export class Butterfree extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BUTTERFREE, [TYPE.GRASS, TYPE.BUG, TYPE.FLYING], RARITY.COMMON, '0012', '', 200, 18, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.BUG_BUZZ,shiny, emotion);
  }
}

export class Weedle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.WEEDLE, [TYPE.POISON, TYPE.BUG], RARITY.COMMON, '0013', PKM.KAKUNA, 60, 5, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BUG_BUZZ,shiny, emotion);
  }
}

export class Kakuna extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KAKUNA, [TYPE.POISON, TYPE.BUG], RARITY.COMMON, '0014', PKM.BEEDRILL, 110, 9, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BUG_BUZZ,shiny, emotion);
  }
}

export class Beedrill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BEEDRILL, [TYPE.POISON, TYPE.BUG, TYPE.FLYING], RARITY.COMMON, '0015', '', 200, 20, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BUG_BUZZ,shiny, emotion);
  }
}

export class Pidgey extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PIDGEY, [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, '0016', PKM.PIDGEOTTO, 60, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HURRICANE,shiny, emotion);
  }
}

export class Pidgeotto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PIDGEOTTO, [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, '0017', PKM.PIDGEOT, 110, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HURRICANE,shiny, emotion);
  }
}

export class Pidgeot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PIDGEOT, [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, '0018', '', 200, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HURRICANE,shiny, emotion);
  }
}

export class Hoppip extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HOPPIP, [TYPE.FLYING, TYPE.FLORA, TYPE.GRASS], RARITY.COMMON, '0187', PKM.SKIPLOOM, 60, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Skiploom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SKIPLOOM, [TYPE.FLYING, TYPE.FLORA, TYPE.GRASS], RARITY.COMMON, '0188', PKM.JUMPLUFF, 110, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Jumpluff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.JUMPLUFF, [TYPE.FLYING, TYPE.FLORA, TYPE.GRASS], RARITY.COMMON, '0189', '', 220, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Seedot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SEEDOT, [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, '0273', PKM.NUZLEAF, 60, 5, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.THIEF,shiny, emotion);
  }
}

export class Nuzleaf extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.NUZLEAF, [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, '0274', PKM.SHIFTRY, 110, 9, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.THIEF,shiny, emotion);
  }
}

export class Shiftry extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SHIFTRY, [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, '0275', '', 200, 20, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.THIEF,shiny, emotion);
  }
}

export class Starly extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.STARLY, [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, '0396', PKM.STARAVIA, 60, 5, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HURRICANE,shiny, emotion);
  }
}

export class Staravia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.STARAVIA, [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, '0397', PKM.STARAPTOR, 110, 9, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HURRICANE,shiny, emotion);
  }
}

export class Staraptor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.STARAPTOR, [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, '0398', '', 200, 20, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.HURRICANE,shiny, emotion);
  }
}

export class Charmander extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CHARMANDER, [TYPE.FIRE, TYPE.DRAGON], RARITY.COMMON, '0004', PKM.CHARMELEON, 60, 5, 2, 2, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BLAST_BURN,shiny, emotion);
  }
}

export class Charmeleon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CHARMELEON, [TYPE.FIRE, TYPE.DRAGON], RARITY.COMMON, '0005', PKM.CHARIZARD, 110, 9, 2, 2, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BLAST_BURN,shiny, emotion);
  }
}

export class Charizard extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CHARIZARD, [TYPE.FIRE, TYPE.DRAGON], RARITY.COMMON, '0006', '', 200, 20, 2, 2, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BLAST_BURN,shiny, emotion);
  }
}


export class Carvanha extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CARVANHA, [TYPE.WATER, TYPE.DARK], RARITY.SUMMON, '0318', '', 40, 4, 1, 1, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BITE,shiny, emotion);
  }
}

export class Houndour extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HOUNDOUR, [TYPE.FIRE, TYPE.DARK], RARITY.SUMMON, '0228', '', 40, 4, 1, 1, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BLAZE_KICK,shiny, emotion);
  }
}

export class Magikarp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MAGIKARP, [TYPE.WATER], RARITY.NEUTRAL, '0129', PKM.GYARADOS, 30, 1, 1, 1, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Gyarados extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GYARADOS, [TYPE.WATER], RARITY.NEUTRAL, '0130', '', 200, 20, 5, 1, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Rattata extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RATTATA, [TYPE.NORMAL], RARITY.NEUTRAL, '0019', PKM.RATICATE, 30, 5, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Raticate extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RATICATE, [TYPE.NORMAL], RARITY.NEUTRAL, '0020', '', 60, 7, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Spearow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SPEAROW, [TYPE.FLYING, TYPE.NORMAL], RARITY.NEUTRAL, '0021', '', 30, 5, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Fearow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FEAROW, [TYPE.FLYING, TYPE.NORMAL], RARITY.NEUTRAL, '0022', '', 60, 7, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Meloetta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MELOETTA, [TYPE.NORMAL, TYPE.SOUND], RARITY.MYTHICAL, '0648', '', 300, 30, 5, 5, 4, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 120, SPECIAL_SKILL.RELIC_SONG,shiny, emotion);
  }
}

export class Lugia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LUGIA, [TYPE.AQUATIC, TYPE.FLYING, TYPE.PSYCHIC], RARITY.MYTHICAL, '0249', '', 300, 30, 5, 5, 4, 'FLYING/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SILENCE,shiny, emotion);
  }
}

export class Giratina extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GIRATINA, [TYPE.DRAGON, TYPE.GHOST], RARITY.MYTHICAL, '0487', '', 300, 30, 5, 5, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.NIGHT_SLASH,shiny, emotion);
  }
}

export class Zapdos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ZAPDOS, [TYPE.ELECTRIC, TYPE.FLYING], RARITY.MYTHICAL, '0145', '', 200, 20, 3, 3, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CHARGE,shiny, emotion);
  }
}

export class Moltres extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MOLTRES, [TYPE.FIRE, TYPE.FLYING], RARITY.MYTHICAL, '0146', '', 200, 20, 3, 3, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.WHEEL_OF_FIRE,shiny, emotion);
  }
}

export class Articuno extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ARTICUNO, [TYPE.ICE, TYPE.FLYING], RARITY.MYTHICAL, '0144', '', 200, 20, 3, 3, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.FREEZE,shiny, emotion);
  }
}

export class Dialga extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DIALGA, [TYPE.METAL, TYPE.DRAGON], RARITY.MYTHICAL, '0483', '', 300, 30, 5, 5, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 150, SPECIAL_SKILL.ROAR_OF_TIME,shiny, emotion);
  }
}

export class Palkia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PALKIA, [TYPE.DRAGON, TYPE.WATER], RARITY.MYTHICAL, '0484', '', 300, 30, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 150, SPECIAL_SKILL.ROAR_OF_TIME,shiny, emotion);
  }
}

export class Suicune extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SUICUNE, [TYPE.WATER, TYPE.ICE], RARITY.MYTHICAL, '0245', '', 300, 30, 5, 5, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.HYDRO_PUMP,shiny, emotion);
  }
}

export class Raikou extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RAIKOU, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.MYTHICAL, '0243', '', 300, 30, 5, 5, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Entei extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ENTEI, [TYPE.FIRE, TYPE.FIELD], RARITY.MYTHICAL, '0244', '', 300, 30, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.FIRE_BLAST,shiny, emotion);
  }
}

export class Regice extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.REGICE, [TYPE.ICE, TYPE.HUMAN], RARITY.MYTHICAL, '0378', '', 200, 20, 6, 6, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Regirock extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.REGIROCK, [TYPE.MINERAL, TYPE.HUMAN], RARITY.MYTHICAL, '0377', '', 200, 20, 6, 6, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE,shiny, emotion);
  }
}

export class Registeel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.REGISTEEL, [TYPE.METAL, TYPE.HUMAN], RARITY.MYTHICAL, '0379', '', 200, 20, 6, 6, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.IRON_DEFENSE,shiny, emotion);
  }
}

export class Regigigas extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.REGIGIGAS, [TYPE.NORMAL, TYPE.MONSTER, TYPE.HUMAN], RARITY.MYTHICAL, '0486', '', 300, 30, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.IRON_TAIL,shiny, emotion);
  }
}

export class Kyogre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KYOGRE, [TYPE.WATER, TYPE.AQUATIC], RARITY.MYTHICAL, '0382', '', 300, 30, 5, 5, 4, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.ORIGIN_PULSE,shiny, emotion);
  }
}

export class Groudon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GROUDON, [TYPE.GROUND, TYPE.FIRE], RARITY.MYTHICAL, '0383', '', 300, 30, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HEAT_WAVE,shiny, emotion);
  }
}

export class Rayquaza extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RAYQUAZA, [TYPE.DRAGON, TYPE.FLYING], RARITY.MYTHICAL, '0384', '', 300, 30, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Eevee extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.EEVEE, [TYPE.NORMAL, TYPE.FIELD], RARITY.UNCOMMON, '0133', '', 130, 5, 2, 2, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Vaporeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VAPOREON, [TYPE.WATER, TYPE.FIELD], RARITY.UNCOMMON, '0134', '', 130, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Jolteon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.JOLTEON, [TYPE.ELECTRIC, TYPE.FIELD], RARITY.UNCOMMON, '0135', '', 130, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Flareon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.FLAREON, [TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, '0136', '', 130, 9, 3, 2, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Espeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ESPEON, [TYPE.PSYCHIC, TYPE.FIELD], RARITY.UNCOMMON, '0196', '', 130, 9, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Umbreon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.UMBREON, [TYPE.DARK, TYPE.FIELD], RARITY.UNCOMMON, '0197', '', 130, 9, 3, 2, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Leafeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LEAFEON, [TYPE.GRASS, TYPE.FLORA, TYPE.FIELD], RARITY.UNCOMMON, '0470', '', 130, 9, 3, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Sylveon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SYLVEON, [TYPE.FAIRY, TYPE.FIELD], RARITY.UNCOMMON, '0700', '', 130, 9, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Glaceon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GLACEON, [TYPE.ICE, TYPE.FIELD], RARITY.UNCOMMON, '0471', '', 130, 9, 1, 1, 2, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Sandshrew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SANDSHREW, [TYPE.GROUND, TYPE.FIELD], RARITY.NEUTRAL, '0027', '', 70, 5, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Darkrai extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DARKRAI, [TYPE.DARK, TYPE.MONSTER, TYPE.GHOST], RARITY.MYTHICAL, '0491', '', 300, 30, 3, 3, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DARK_PULSE,shiny, emotion);
  }
}

export class Volcarona extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VOLCARONA, [TYPE.FIRE, TYPE.BUG], RARITY.MYTHICAL, '0637', '', 200, 20, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.FIRE_BLAST,shiny, emotion);
  }
}

export class Castform extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CASTFORM, [TYPE.NORMAL, TYPE.GHOST], RARITY.MYTHICAL, '0351', '', 200, 20, 3, 3, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 80, SPECIAL_SKILL.NASTY_PLOT,shiny, emotion);
  }
}

export class CastformSun extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CASTFORMSUN, [TYPE.NORMAL, TYPE.GHOST, TYPE.FIRE], RARITY.MYTHICAL, '0351-0001', '', 200, 20, 3, 3, 2, 'DRAGON/range', ATTACK_TYPE.SPECIAL, 2, 80, SPECIAL_SKILL.FIRE_BLAST,shiny, emotion);
  }
}

export class CastformRain extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CASTFORMRAIN, [TYPE.NORMAL, TYPE.GHOST, TYPE.WATER], RARITY.MYTHICAL, '0351-0002', '', 200, 20, 3, 3, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 80, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class CastformHail extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CASTFORMHAIL, [TYPE.NORMAL, TYPE.GHOST, TYPE.ICE], RARITY.MYTHICAL, '0351-0003', '', 200, 20, 3, 3, 2, 'ICE/melee', ATTACK_TYPE.SPECIAL, 2, 80, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Landorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LANDORUS, [TYPE.GROUND, TYPE.FLYING], RARITY.MYTHICAL, '0645', '', 200, 20, 3, 3, 2, 'FLYING/range', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE,shiny, emotion);
  }
}

export class Thundurus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.THUNDURUS, [TYPE.ELECTRIC, TYPE.FLYING], RARITY.MYTHICAL, '0642', '', 200, 20, 3, 3, 3, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Tornadus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TORNADUS, [TYPE.FLYING], RARITY.MYTHICAL, '0641', '', 200, 20, 3, 3, 3, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HURRICANE,shiny, emotion);
  }
}

export class Keldeo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KELDEO, [TYPE.WATER, TYPE.FIGHTING], RARITY.MYTHICAL, '0647', '', 200, 20, 3, 3, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.GUILLOTINE,shiny, emotion);
  }
}

export class Terrakion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TERRAKION, [TYPE.MINERAL, TYPE.FIGHTING], RARITY.MYTHICAL, '0639', '', 200, 20, 6, 6, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE,shiny, emotion);
  }
}

export class Virizion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VIRIZION, [TYPE.GRASS, TYPE.FIGHTING], RARITY.MYTHICAL, '0640', '', 200, 20, 6, 6, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Cobalion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.COBALION, [TYPE.METAL, TYPE.FIGHTING], RARITY.MYTHICAL, '0638', '', 200, 20, 6, 6, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Manaphy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MANAPHY, [TYPE.WATER, TYPE.BUG], RARITY.MYTHICAL, '0490', '', 200, 20, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.NASTY_PLOT,shiny, emotion);
  }
}

export class Rotom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ROTOM, [TYPE.ELECTRIC, TYPE.GHOST], RARITY.MYTHICAL, '0479', '', 200, 12, 3, 3, 3, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND,shiny, emotion);
  }
}

export class Spiritomb extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SPIRITOMB, [TYPE.DARK, TYPE.GHOST], RARITY.MYTHICAL, '0442', '', 200, 20, 3, 3, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.NIGHT_SLASH,shiny, emotion);
  }
}

export class Absol extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ABSOL, [TYPE.DARK, TYPE.FIELD], RARITY.MYTHICAL, '0359', '', 250, 20, 6, 6, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.THIEF,shiny, emotion);
  }
}

export class Lapras extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LAPRAS, [TYPE.WATER, TYPE.ICE], RARITY.MYTHICAL, '0131', '', 250, 20, 6, 6, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SOAK,shiny, emotion);
  }
}

export class Latias extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LATIAS, [TYPE.PSYCHIC, TYPE.DRAGON], RARITY.MYTHICAL, '0380', '', 200, 20, 3, 3, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Latios extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LATIOS, [TYPE.PSYCHIC, TYPE.DRAGON], RARITY.MYTHICAL, '0381', '', 200, 20, 3, 3, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Uxie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.UXIE, [TYPE.PSYCHIC, TYPE.FAIRY], RARITY.MYTHICAL, '0480', '', 200, 12, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND,shiny, emotion);
  }
}

export class Mesprit extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MESPRIT, [TYPE.PSYCHIC, TYPE.FAIRY], RARITY.MYTHICAL, '0481', '', 200, 12, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND,shiny, emotion);
  }
}

export class Azelf extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AZELF, [TYPE.PSYCHIC, TYPE.FAIRY], RARITY.MYTHICAL, '0482', '', 200, 12, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND,shiny, emotion);
  }
}

export class Mewtwo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEWTWO, [TYPE.PSYCHIC, TYPE.MONSTER], RARITY.MYTHICAL, '0150', '', 300, 30, 5, 5, 3, 'PSYCHIC/range', ATTACK_TYPE.TRUE, 2, 100, SPECIAL_SKILL.TORMENT,shiny, emotion);
  }
}

export class Kyurem extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KYUREM, [TYPE.DRAGON, TYPE.ICE], RARITY.MYTHICAL, '0646', '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.FREEZE,shiny, emotion);
  }
}

export class Reshiram extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RESHIRAM, [TYPE.DRAGON, TYPE.FIRE], RARITY.MYTHICAL, '0643', '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.BURN,shiny, emotion);
  }
}

export class Zekrom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ZEKROM, [TYPE.DRAGON, TYPE.ELECTRIC], RARITY.MYTHICAL, '0644', '', 300, 30, 5, 5, 3, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class Celebi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CELEBI, [TYPE.GRASS, TYPE.PSYCHIC], RARITY.MYTHICAL, '0251', '', 300, 30, 5, 5, 3, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.LEECH_LIFE,shiny, emotion);
  }
}

export class Victini extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VICTINI, [TYPE.FIRE, TYPE.PSYCHIC], RARITY.MYTHICAL, '0494', '', 300, 30, 5, 5, 3, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BURN,shiny, emotion);
  }
}

export class Jirachi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.JIRACHI, [TYPE.METAL, TYPE.PSYCHIC], RARITY.MYTHICAL, '0385', '', 300, 30, 5, 5, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 50, SPECIAL_SKILL.WISH,shiny, emotion);
  }
}

export class Arceus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ARCEUS, [TYPE.NORMAL, TYPE.FIELD], RARITY.MYTHICAL, '0493', '', 300, 30, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR,shiny, emotion);
  }
}

export class Deoxys extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.DEOXYS, [TYPE.PSYCHIC, TYPE.HUMAN], RARITY.MYTHICAL, '0386', '', 300, 30, 5, 5, 1, 'PSYCHIC/range', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.PROTECT,shiny, emotion);
  }
}

export class Shaymin extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SHAYMIN, [TYPE.GRASS, TYPE.FLORA], RARITY.MYTHICAL, '0492', '', 300, 30, 5, 5, 3, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SEED_FLARE,shiny, emotion);
  }
}

export class Cresselia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CRESSELIA, [TYPE.PSYCHIC, TYPE.FAIRY], RARITY.MYTHICAL, '0488', '', 300, 30, 5, 5, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 50, SPECIAL_SKILL.WISH,shiny, emotion);
  }
}

export class Heatran extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HEATRAN, [TYPE.FIRE, TYPE.METAL], RARITY.MYTHICAL, '0485', '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.BURN,shiny, emotion);
  }
}

export class HooH extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.HOOH, [TYPE.FIRE, TYPE.FLYING], RARITY.MYTHICAL, '0250', '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.BURN,shiny, emotion);
  }
}

export class PrimalGroudon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PRIMALGROUDON, [TYPE.GROUND, TYPE.FIRE], RARITY.MYTHICAL, '0383-0001', '', 400, 40, 10, 10, 1, 'FIRE/melee', ATTACK_TYPE.TRUE, 3, 100, SPECIAL_SKILL.BURN,shiny, emotion);
  }
}

export class PrimalKyogre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PRIMALKYOGRE, [TYPE.WATER, TYPE.ELECTRIC, TYPE.AQUATIC], RARITY.MYTHICAL, '0382-0001', '', 400, 40, 5, 5, 3, 'WATER/range', ATTACK_TYPE.TRUE, 3, 100, SPECIAL_SKILL.THUNDER,shiny, emotion);
  }
}

export class MegaRayquaza extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEGARAYQUAZA, [TYPE.DRAGON, TYPE.FLYING], RARITY.MYTHICAL, '0384-0001', '', 400, 40, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.TRUE, 3, 100, SPECIAL_SKILL.DRACO_METEOR,shiny, emotion);
  }
}

export class Meowth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.MEOWTH, [], RARITY.NEUTRAL, '0052', '', 100, 10, 2, 2, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Persian extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.PERSIAN, [], RARITY.NEUTRAL, '0053', '', 100, 10, 2, 2, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT,shiny, emotion);
  }
}

export class Oddish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ODDISH, [TYPE.POISON, TYPE.GRASS], RARITY.SUMMON, '0043', PKM.GLOOM, 90, 9, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Gloom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.GLOOM, [TYPE.POISON, TYPE.GRASS], RARITY.SUMMON, '0044', PKM.VILEPLUME, 160, 18, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Vileplume extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.VILEPLUME, [TYPE.POISON, TYPE.GRASS], RARITY.SUMMON, '0045', PKM.BELLOSSOM, 260, 20, 4, 4, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Bellossom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BELLOSSOM, [TYPE.POISON, TYPE.GRASS], RARITY.SUMMON, '0182', '', 360, 27, 5, 5, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STUN_SPORE,shiny, emotion);
  }
}

export class Amaura extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AMAURA, [TYPE.FOSSIL, TYPE.ICE], RARITY.EPIC, '0698', PKM.AURORUS, 150, 10, 4, 5, 1, 'ROCK/melee', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Aurorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AURORUS, [TYPE.FOSSIL, TYPE.ICE], RARITY.EPIC, '0699', '', 330, 16, 8, 10, 1, 'ROCK/melee', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.ICICLE_CRASH,shiny, emotion);
  }
}

export class Anorith extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ANORITH, [TYPE.FOSSIL, TYPE.BUG], RARITY.UNCOMMON, '0347', PKM.ARMALDO, 70, 10, 3, 1, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ROCK_SMASH,shiny, emotion);
  }
}

export class Armaldo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ARMALDO, [TYPE.FOSSIL, TYPE.BUG], RARITY.UNCOMMON, '0348', '', 160, 16, 4, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SMASH,shiny, emotion);
  }
}

export class Archen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ARCHEN, [TYPE.FOSSIL, TYPE.FLYING], RARITY.RARE, '0566', PKM.ARCHEOPS, 100, 12, 2, 1, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ROCK_SMASH,shiny, emotion);
  }
}

export class Archeops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.ARCHEOPS, [TYPE.FOSSIL, TYPE.FLYING], RARITY.RARE, '0567', '', 180, 20, 3, 2, 2, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SMASH,shiny, emotion);
  }
}

export class Shieldon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.SHIELDON, [TYPE.FOSSIL, TYPE.METAL], RARITY.RARE, '0410', PKM.BASTIODON, 120, 7, 3, 5, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.IRON_DEFENSE,shiny, emotion);
  }
}

export class Bastiodon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.BASTIODON, [TYPE.FOSSIL, TYPE.METAL], RARITY.RARE, '0411', '', 240, 14, 7, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.IRON_DEFENSE,shiny, emotion);
  }
}

export class Tirtouga extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TIRTOUGA, [TYPE.FOSSIL, TYPE.WATER], RARITY.RARE, '0564', PKM.CARRACOSTA, 120, 7, 4, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ROCK_TOMB,shiny, emotion);
  }
}

export class Carracosta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CARRACOSTA, [TYPE.FOSSIL, TYPE.WATER], RARITY.RARE, '0565', '', 240, 14, 7, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_TOMB,shiny, emotion);
  }
}

export class Lileep extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.LILEEP, [TYPE.FOSSIL, TYPE.GRASS], RARITY.UNCOMMON, '0345', PKM.CRADILY, 60, 8, 2, 2, 2, 'ROCK/melee', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HEAL_BLOCK,shiny, emotion);
  }
}

export class Cradily extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CRADILY, [TYPE.FOSSIL, TYPE.GRASS], RARITY.UNCOMMON, '0346', '', 140, 14, 4, 4, 2, 'ROCK/melee', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HEAL_BLOCK,shiny, emotion);
  }
}

export class Cranidos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.CRANIDOS, [TYPE.FOSSIL, TYPE.MONSTER], RARITY.RARE, '0408', PKM.RAMPARDOS, 100, 10, 4, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HEAD_SMASH,shiny, emotion);
  }
}

export class Rampardos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.RAMPARDOS, [TYPE.FOSSIL, TYPE.MONSTER], RARITY.RARE, '0409', '', 200, 19, 6, 3, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HEAD_SMASH,shiny, emotion);
  }
}

export class Kabuto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KABUTO, [TYPE.FOSSIL, TYPE.WATER], RARITY.UNCOMMON, '0140', PKM.KABUTOPS, 70, 10, 3, 1, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HEAL_BLOCK,shiny, emotion);
  }
}

export class Kabutops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.KABUTOPS, [TYPE.FOSSIL, TYPE.WATER], RARITY.UNCOMMON, '0141', '', 160, 16, 4, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HEAL_BLOCK,shiny, emotion);
  }
}

export class Omanyte extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.OMANYTE, [TYPE.FOSSIL, TYPE.WATER], RARITY.UNCOMMON, '0138', PKM.OMASTAR, 60, 8, 1, 3, 2, 'ROCK/melee', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.ROCK_TOMB,shiny, emotion);
  }
}

export class Omastar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.OMASTAR, [TYPE.FOSSIL, TYPE.WATER], RARITY.UNCOMMON, '0139', '', 140, 14, 2, 4, 2, 'ROCK/melee', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.ROCK_TOMB,shiny, emotion);
  }
}

export class Tyrunt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TYRUNT, [TYPE.FOSSIL, TYPE.DRAGON], RARITY.EPIC, '0696', PKM.TYRANTRUM, 135, 10, 4, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HEAD_SMASH,shiny, emotion);
  }
}

export class Tyrantrum extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.TYRANTRUM, [TYPE.FOSSIL, TYPE.DRAGON], RARITY.EPIC, '0697', '', 290, 22, 7, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HEAD_SMASH,shiny, emotion);
  }
}

export class Aerodactyl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(PKM.AERODACTYL, [TYPE.FOSSIL, TYPE.FLYING], RARITY.EPIC, '0142', '', 270, 17, 6, 3, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE,shiny, emotion);
  }
}