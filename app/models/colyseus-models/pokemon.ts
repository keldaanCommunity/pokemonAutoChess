/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import {Schema, type, ArraySchema, SetSchema} from '@colyseus/schema';
import uniqid from 'uniqid';
import { IPokemon } from '../../types';
import {TYPE, COST, PKM, ITEM} from '../enum';
import { Rarity, AttackType } from '../../types/enum/Game';
import { Ability } from '../../types/enum/Ability';
import ItemFactory from '../item-factory';

export class Pokemon extends Schema implements IPokemon{
  @type('string') id: string;
  @type('string') name: string;
  @type(['string']) types = new ArraySchema<string>();
  @type('uint8') rarity: Rarity;
  @type('string') sheet: string;
  @type('uint16') index: number;
  @type('string') evolution:string;
  @type('int8') positionX = -1;
  @type('int8') positionY = -1;
  @type('uint8') cost: number;
  @type('string') attackSprite: string;
  @type('float32') atkSpeed = 0.75;
  @type('uint8') def: number;
  @type('uint8') speDef: number;
  @type('uint8') attackType: AttackType;
  @type('uint16') atk: number;
  @type('uint16') hp: number;
  @type('uint8') range: number;
  @type('uint8') stars: number;
  @type('uint8') maxMana: number;
  @type('uint8') skill: Ability;
  @type({set: 'string'}) items = new SetSchema<string>();
  author: string;
  fossilTimer: number;

  constructor(author:string,
     name: string,
      frenchName: string,
      types: string[],
      rarity: Rarity,
      sheet: string,
      index: number,
      evolution: string,
      hp: number,
      atk: number,
      def: number,
      speDef: number,
      range: number,
      attackSprite: string,
      attackType: AttackType,
      stars: number,
      maxMana: number,
      skill: Ability
    ) {
    super();
    this.id = uniqid();
    this.name = name;
    this.sheet = sheet;
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
    this.author = author;
    this.skill = skill;

    types.forEach(type=>{
      this.types.push(type);
    });

    if (this.types.includes(TYPE.FOSSIL) && this.evolution != '') {
      switch (this.rarity) {
        case Rarity.EPIC:
          this.fossilTimer = 8;
          break;

        case Rarity.RARE:
          this.fossilTimer = 6;
          break;

        case Rarity.UNCOMMON:
          this.fossilTimer = 4;
          break;

        default:
          break;
      }
    }
  }
}

export class Ditto extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DITTO, 'métamoprh', [TYPE.NORMAL], Rarity.LEGENDARY, 'LEGENDARY', 132, '', 30, 1, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Electrike extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ELECTRIKE, 'ptéra', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.LEGENDARY, 'sound', 309, PKM.MANECTRIC, 110, 5, 5, 5, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 1, 60, Ability.VOLT_SWITCH);
  }
}

export class Manectric extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MANECTRIC, 'ptéra', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.LEGENDARY, 'sound', 310, PKM.MEGAMANECTRIC, 150, 11, 6, 6, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 2, 60, Ability.VOLT_SWITCH);
  }
}

export class MegaManectric extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MEGAMANECTRIC, 'ptéra', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.LEGENDARY, 'sound', 3100, '', 300, 17, 7, 7, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 3, 60, Ability.VOLT_SWITCH);
  }
}

export class Shuppet extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SHUPPET, 'ptéra', [TYPE.DARK, TYPE.GHOST], Rarity.LEGENDARY, 'sound', 353, PKM.BANETTE, 100, 5, 3, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 140, Ability.SHADOW_CLONE);
  }
}

export class Banette extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BANETTE, 'ptéra', [TYPE.DARK, TYPE.GHOST], Rarity.LEGENDARY, 'sound', 354, PKM.MEGABANETTE, 140, 11, 4, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 140, Ability.SHADOW_CLONE);
  }
}

export class MegaBanette extends Pokemon {
  constructor() {
    super('Junaca', PKM.MEGABANETTE, 'ptéra', [TYPE.DARK, TYPE.GHOST], Rarity.LEGENDARY, 'sound', 3540, '', 240, 21, 5, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 140, Ability.SHADOW_CLONE);
  }
}

export class Riolu extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RIOLU, 'riolu', [TYPE.FIGHTING, TYPE.HUMAN], Rarity.LEGENDARY, 'LEGENDARY', 447, PKM.LUCARIO, 90, 5, 3, 3, 2, 'FIGHTING/range', AttackType.SPECIAL, 1, 100, Ability.SILENCE);
  }
}

export class Lucario extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LUCARIO, 'lucario', [TYPE.FIGHTING, TYPE.HUMAN, TYPE.METAL], Rarity.LEGENDARY, 'LEGENDARY', 448, PKM.MEGALUCARIO, 130, 11, 3, 3, 2, 'FIGHTING/range', AttackType.SPECIAL, 2, 100, Ability.SILENCE);
  }
}

export class MegaLucario extends Pokemon {
  constructor() {
    super('Juanca', PKM.MEGALUCARIO, 'méga-lucario', [TYPE.FIGHTING, TYPE.HUMAN, TYPE.METAL], Rarity.LEGENDARY, 'LEGENDARY', 4480, '', 230, 21, 3, 3, 2, 'FIGHTING/range', AttackType.SPECIAL, 3, 100, Ability.SILENCE);
  }
}

export class Swablu extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SWABLU, 'tylton', [TYPE.FAIRY, TYPE.DRAGON, TYPE.SOUND], Rarity.LEGENDARY, 'september', 333, PKM.ALTARIA, 90, 5, 3, 3, 2, 'DRAGON/range', AttackType.SPECIAL, 1, 110, Ability.HYPER_VOICE);
  }
}

export class Altaria extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ALTARIA, 'ptéra', [TYPE.FAIRY, TYPE.DRAGON, TYPE.SOUND], Rarity.LEGENDARY, 'sound', 334, PKM.MEGAALTARIA, 130, 11, 4, 4, 2, 'DRAGON/range', AttackType.SPECIAL, 2, 110, Ability.HYPER_VOICE);
  }
}

export class MegaAltaria extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MEGAALTARIA, 'ptéra', [TYPE.FAIRY, TYPE.DRAGON, TYPE.SOUND], Rarity.LEGENDARY, 'sound', 3340, '', 230, 21, 5, 5, 2, 'DRAGON/range', AttackType.SPECIAL, 3, 110, Ability.HYPER_VOICE);
  }
}

export class Scyther extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SCYTHER, 'insécatueur', [TYPE.BUG, TYPE.FLYING], Rarity.LEGENDARY, 'LEGENDARY', 123, PKM.SCIZOR, 90, 5, 5, 5, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.KING_SHIELD);
  }
}

export class Scizor extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SCIZOR, 'cizayox', [TYPE.BUG, TYPE.FLYING, TYPE.METAL], Rarity.LEGENDARY, 'LEGENDARY', 212, PKM.MEGASCIZOR, 130, 9, 6, 6, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.KING_SHIELD);
  }
}

export class MegaScizor extends Pokemon {
  constructor() {
    super('Keldaan', PKM.MEGASCIZOR, 'méga-cizayox', [TYPE.BUG, TYPE.FLYING, TYPE.METAL], Rarity.LEGENDARY, 'LEGENDARY', 2120, '', 230, 20, 7, 7, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 100, Ability.KING_SHIELD);
  }
}

export class Buneary extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BUNEARY, 'ptéra', [TYPE.NORMAL, TYPE.FIGHTING], Rarity.LEGENDARY, 'sound', 427, PKM.LOPUNNY, 110, 5, 5, 5, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 1, 60, Ability.HIGH_JUMP_KICK);
  }
}

export class Lopunny extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LOPUNNY, 'ptéra', [TYPE.NORMAL, TYPE.FIGHTING], Rarity.LEGENDARY, 'sound', 428, PKM.MEGALOPUNNY, 150, 9, 6, 6, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 2, 60, Ability.HIGH_JUMP_KICK);
  }
}

export class MegaLopunny extends Pokemon {
  constructor() {
    super('PMDCollab', PKM.MEGALOPUNNY, 'ptéra', [TYPE.NORMAL, TYPE.FIGHTING], Rarity.LEGENDARY, 'sound', 4280, '', 250, 25, 7, 7, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 3, 60, Ability.HIGH_JUMP_KICK);
  }
}

export class Onix extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ONIX, 'onix', [TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], Rarity.LEGENDARY, 'LEGENDARY', 95, PKM.STEELIX, 150, 5, 7, 7, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.IRON_DEFENSE);
  }
}

export class Steelix extends Pokemon {
  constructor() {
    super('Nintendo', PKM.STEELIX, 'steelix', [TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], Rarity.LEGENDARY, 'LEGENDARY', 208, PKM.MEGASTEELIX, 300, 9, 10, 10, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_DEFENSE);
  }
}

export class MegaSteelix extends Pokemon {
  constructor() {
    super('Keldaan', PKM.MEGASTEELIX, 'méga-steelix', [TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], Rarity.LEGENDARY, 'LEGENDARY', 2080, '', 400, 20, 20, 20, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.IRON_DEFENSE);
  }
}

export class Growlithe extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GROWLITHE, 'caninos', [], Rarity.LEGENDARY, 'LEGENDARY', 58, PKM.ARCANINE, 90, 9, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Arcanine extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ARCANINE, 'arcanin', [], Rarity.LEGENDARY, 'LEGENDARY', 59, '', 130, 20, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT);
  }
}

export class Numel extends Pokemon {
  constructor() {
    super('Nintendo', PKM.NUMEL, 'chamallot', [TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], Rarity.LEGENDARY, 'LEGENDARY', 322, PKM.CAMERUPT, 90, 5, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BURN);
  }
}

export class Camerupt extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CAMERUPT, 'camerupt', [TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], Rarity.LEGENDARY, 'LEGENDARY', 323, PKM.MEGACAMERUPT, 150, 9, 10, 10, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.BURN);
  }
}

export class MegaCamerupt extends Pokemon {
  constructor() {
    super('Phoenix', PKM.MEGACAMERUPT, 'méga-camerupt', [TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], Rarity.LEGENDARY, 'LEGENDARY', 3230, '', 230, 20, 15, 15, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.BURN);
  }
}

export class Munchlax extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MUNCHLAX, 'goinfrex', [], Rarity.LEGENDARY, 'LEGENDARY', 446, PKM.SNORLAX, 90, 9, 5, 5, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Snorlax extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SNORLAX, 'ronflex', [], Rarity.LEGENDARY, 'LEGENDARY', 143, '', 130, 20, 5, 5, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT);
  }
}

export class Meditite extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MEDITITE, 'méditika', [TYPE.PSYCHIC, TYPE.HUMAN, TYPE.FIGHTING], Rarity.LEGENDARY, 'LEGENDARY', 307, PKM.MEDICHAM, 90, 5, 5, 5, 2, 'PSYCHIC/range', AttackType.SPECIAL, 1, 100, Ability.CONFUSION);
  }
}

export class Medicham extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MEDICHAM, 'charmina', [TYPE.PSYCHIC, TYPE.HUMAN, TYPE.FIGHTING], Rarity.LEGENDARY, 'LEGENDARY', 308, PKM.MEGAMEDICHAM, 130, 9, 6, 6, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.CONFUSION);
  }
}

export class MegaMedicham extends Pokemon {
  constructor() {
    super('Juanca', PKM.MEGAMEDICHAM, 'méga-charmina', [TYPE.PSYCHIC, TYPE.HUMAN, TYPE.FIGHTING], Rarity.LEGENDARY, 'LEGENDARY', 3080, '', 230, 20, 7, 7, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 100, Ability.CONFUSION);
  }
}

export class Elekid extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ELEKID, 'elekid', [TYPE.ELECTRIC, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 239, PKM.ELECTABUZZ, 90, 5, 4, 4, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 1, 100, Ability.DISCHARGE);
  }
}

export class Electabuzz extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ELECTABUZZ, 'élektek', [TYPE.ELECTRIC, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 125, PKM.ELECTIVIRE, 130, 9, 5, 5, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 2, 100, Ability.DISCHARGE);
  }
}

export class Electivire extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ELECTIVIRE, 'élekable', [TYPE.ELECTRIC, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 466, '', 230, 20, 6, 6, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 3, 100, Ability.DISCHARGE);
  }
}

export class Gible extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GIBLE, 'griknot', [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], Rarity.EPIC, 'EPIC', 443, PKM.GABITE, 90, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.DRAGON_TAIL);
  }
}

export class Gabite extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GABITE, 'carmache', [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], Rarity.EPIC, 'EPIC', 444, PKM.GARCHOMP, 130, 9, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.DRAGON_TAIL);
  }
}

export class Garchomp extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GARCHOMP, 'carchakrok', [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], Rarity.EPIC, 'EPIC', 445, '', 230, 20, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.DRAGON_TAIL);
  }
}

export class Beldum extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BELDUM, 'tehral', [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], Rarity.EPIC, 'EPIC', 374, PKM.METANG, 90, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.METEOR_MASH);
  }
}

export class Metang extends Pokemon {
  constructor() {
    super('Nintendo', PKM.METANG, 'métang', [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], Rarity.EPIC, 'EPIC', 375, PKM.METAGROSS, 130, 9, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.METEOR_MASH);
  }
}

export class Metagross extends Pokemon {
  constructor() {
    super('Nintendo', PKM.METAGROSS, 'métalosse', [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], Rarity.EPIC, 'EPIC', 376, '', 230, 20, 8, 8, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.METEOR_MASH);
  }
}

export class Tympole extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TYMPOLE, 'ptéra', [TYPE.WATER, TYPE.GROUND, TYPE.SOUND], Rarity.EPIC, 'sound', 535, PKM.PALPITOAD, 90, 5, 4, 4, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 90, Ability.EXPLOSION);
  }
}

export class Palpitoad extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PALPITOAD, 'ptéra', [TYPE.WATER, TYPE.GROUND, TYPE.SOUND], Rarity.EPIC, 'sound', 536, PKM.SEISMITOAD, 130, 9, 5, 5, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 90, Ability.EXPLOSION);
  }
}

export class Seismitoad extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SEISMITOAD, 'ptéra', [TYPE.WATER, TYPE.GROUND, TYPE.SOUND], Rarity.EPIC, 'sound', 537, '', 230, 20, 6, 6, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 90, Ability.EXPLOSION);
  }
}

export class Bagon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BAGON, 'draby', [TYPE.DRAGON, TYPE.MONSTER], Rarity.EPIC, 'EPIC', 371, PKM.SHELGON, 90, 5, 3, 3, 1, 'DRAGON/melee', AttackType.SPECIAL, 1, 100, Ability.DRACO_METEOR);
  }
}

export class Shelgon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SHELGON, 'drackhaus', [TYPE.DRAGON, TYPE.MONSTER], Rarity.EPIC, 'EPIC', 372, PKM.SALAMENCE, 130, 9, 3, 3, 1, 'DRAGON/melee', AttackType.SPECIAL, 2, 100, Ability.DRACO_METEOR);
  }
}

export class Salamence extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SALAMENCE, 'drattak', [TYPE.DRAGON, TYPE.MONSTER, TYPE.FLYING], Rarity.EPIC, 'EPIC', 373, '', 230, 18, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 3, 100, Ability.DRACO_METEOR);
  }
}

export class Ralts extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RALTS, 'tarsal', [TYPE.PSYCHIC, TYPE.FAIRY, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 280, PKM.KIRLIA, 90, 5, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 1, 100, Ability.CALM_MIND);
  }
}

export class Kirlia extends Pokemon {
  constructor() {
    super('Nintendo', PKM.KIRLIA, 'kirlia', [TYPE.PSYCHIC, TYPE.FAIRY, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 281, PKM.GARDEVOIR, 130, 9, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND);
  }
}

export class Gardevoir extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GARDEVOIR, 'gardevoir', [TYPE.PSYCHIC, TYPE.FAIRY, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 282, '', 230, 18, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 3, 100, Ability.CALM_MIND);
  }
}

export class Budew extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BUDEW, 'ptéra', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.EPIC, 'sound', 406, PKM.ROSELIA, 90, 5, 1, 1, 3, 'GRASS/range', AttackType.SPECIAL, 1, 100, Ability.PETAL_DANCE);
  }
}

export class Roselia extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ROSELIA, 'ptéra', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.EPIC, 'sound', 315, PKM.ROSERADE, 130, 9, 1, 1, 3, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.PETAL_DANCE);
  }
}

export class Roserade extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ROSERADE, 'ptéra', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.EPIC, 'sound', 407, '', 230, 18, 1, 1, 3, 'GRASS/range', AttackType.SPECIAL, 3, 100, Ability.PETAL_DANCE);
  }
}

export class Slakoth extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SLAKOTH, 'parecool', [TYPE.NORMAL, TYPE.FIELD], Rarity.EPIC, 'EPIC', 287, PKM.VIGOROTH, 90, 5, 4, 4, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.SEISMIC_TOSS);
  }
}

export class Vigoroth extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VIGOROTH, 'vigoroth', [TYPE.NORMAL, TYPE.FIELD], Rarity.EPIC, 'EPIC', 288, PKM.SLAKING, 130, 9, 4, 4, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.SEISMIC_TOSS);
  }
}

export class Slaking extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SLAKING, 'monaflemit', [TYPE.NORMAL, TYPE.FIELD], Rarity.EPIC, 'EPIC', 289, '', 230, 20, 4, 4, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 100, Ability.SEISMIC_TOSS);
  }
}

export class Honedge extends Pokemon {
  constructor() {
    super('PmdCollab', PKM.HONEDGE, 'monorpale', [TYPE.GHOST, TYPE.METAL], Rarity.EPIC, 'sound', 679, PKM.DOUBLADE, 90, 8, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.KING_SHIELD);
  }
}

export class Doublade extends Pokemon {
  constructor() {
    super('pokegirl4ever', PKM.DOUBLADE, 'doublade', [TYPE.GHOST, TYPE.METAL], Rarity.EPIC, 'sound', 680, PKM.AEGISLASH, 130, 9, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.KING_SHIELD);
  }
}

export class Aegislash extends Pokemon {
  constructor() {
    super('jhony rex', PKM.AEGISLASH, 'exagide', [TYPE.GHOST, TYPE.METAL], Rarity.EPIC, 'sound', 681, '', 230, 20, 8, 8, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.KING_SHIELD);
  }
}

export class Larvitar extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LARVITAR, 'embrylex', [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], Rarity.EPIC, 'EPIC', 246, PKM.PUPITAR, 90, 8, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.BITE);
  }
}

export class Pupitar extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PUPITAR, 'ymphect', [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], Rarity.EPIC, 'EPIC', 247, PKM.TYRANITAR, 130, 9, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.BITE);
  }
}

export class Tyranitar extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TYRANITAR, 'tyranocif', [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], Rarity.EPIC, 'EPIC', 248, '', 230, 20, 8, 8, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.BITE);
  }
}

export class JangmoO extends Pokemon {
  constructor() {
    super('princess phoenix', PKM.JANGMOO, 'ptéra', [TYPE.DRAGON, TYPE.FIGHTING, TYPE.SOUND], Rarity.EPIC, 'sound', 782, PKM.HAKAMOO, 90, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 110, Ability.CLANGOROUS_SOUL);
  }
}

export class HakamoO extends Pokemon {
  constructor() {
    super('princess phoenix', PKM.HAKAMOO, 'ptéra', [TYPE.DRAGON, TYPE.FIGHTING, TYPE.SOUND], Rarity.EPIC, 'sound', 783, PKM.KOMMOO, 130, 9, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 110, Ability.CLANGOROUS_SOUL);
  }
}

export class KommoO extends Pokemon {
  constructor() {
    super('princess phoenix', PKM.KOMMOO, 'ptéra', [TYPE.DRAGON, TYPE.FIGHTING, TYPE.SOUND], Rarity.EPIC, 'sound', 784, '', 230, 20, 8, 8, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 110, Ability.CLANGOROUS_SOUL);
  }
}

export class Gastly extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GASTLY, 'fantominus', [TYPE.MONSTER, TYPE.POISON, TYPE.GHOST], Rarity.LEGENDARY, 'EPIC', 92, PKM.HAUNTER, 90, 8, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 1, 120, Ability.NIGHTMARE);
  }
}

export class Haunter extends Pokemon {
  constructor() {
    super('Nintendo', PKM.HAUNTER, 'spectrum', [TYPE.MONSTER, TYPE.POISON, TYPE.GHOST], Rarity.LEGENDARY, 'EPIC', 93, PKM.GENGAR, 130, 12, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 2, 120, Ability.NIGHTMARE);
  }
}

export class Gengar extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GENGAR, 'ectoplasma', [TYPE.MONSTER, TYPE.POISON, TYPE.GHOST], Rarity.LEGENDARY, 'EPIC', 94, '', 230, 25, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 3, 120, Ability.NIGHTMARE);
  }
}

export class Abra extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ABRA, 'abra', [TYPE.PSYCHIC, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 63, PKM.KADABRA, 90, 5, 1, 1, 4, 'PSYCHIC/range', AttackType.SPECIAL, 1, 50, Ability.TELEPORT);
  }
}

export class Kadabra extends Pokemon {
  constructor() {
    super('Nintendo', PKM.KADABRA, 'kadabra', [TYPE.PSYCHIC, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 64, PKM.ALAKAZAM, 130, 9, 1, 1, 4, 'PSYCHIC/range', AttackType.SPECIAL, 2, 50, Ability.TELEPORT);
  }
}

export class Alakazam extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ALAKAZAM, 'alakazam', [TYPE.PSYCHIC, TYPE.HUMAN], Rarity.EPIC, 'EPIC', 65, '', 230, 18, 1, 1, 4, 'PSYCHIC/range', AttackType.SPECIAL, 3, 50, Ability.TELEPORT);
  }
}

export class Litwick extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.LITWICK, 'funécire', [TYPE.FIRE, TYPE.GHOST], Rarity.EPIC, 'EPIC2', 607, PKM.LAMPENT, 90, 5, 1, 1, 3, 'GHOST/range', AttackType.SPECIAL, 1, 100, Ability.FIRE_BLAST);
  }
}

export class Lampent extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.LAMPENT, 'mélancolux', [TYPE.FIRE, TYPE.GHOST], Rarity.EPIC, 'EPIC2', 608, PKM.CHANDELURE, 130, 9, 1, 1, 3, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.FIRE_BLAST);
  }
}

export class Chandelure extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.CHANDELURE, 'lugulabre', [TYPE.FIRE, TYPE.GHOST], Rarity.EPIC, 'EPIC2', 609, '', 230, 18, 1, 1, 3, 'GHOST/range', AttackType.SPECIAL, 3, 100, Ability.FIRE_BLAST);
  }
}

export class Porygon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PORYGON, 'ptéra', [TYPE.NORMAL, TYPE.PSYCHIC], Rarity.EPIC, 'sound', 137, PKM.PORYGON2, 90, 5, 1, 1, 2, 'FIGHTING/range', AttackType.SPECIAL, 1, 90, Ability.TRI_ATTACK);
  }
}

export class Porygon2 extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PORYGON2, 'ptéra', [TYPE.NORMAL, TYPE.PSYCHIC], Rarity.EPIC, 'sound', 233, PKM.PORYGONZ, 130, 9, 1, 1, 2, 'FIGHTING/range', AttackType.SPECIAL, 2, 90, Ability.TRI_ATTACK);
  }
}

export class PorygonZ extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PORYGONZ, 'ptéra', [TYPE.NORMAL, TYPE.PSYCHIC], Rarity.EPIC, 'sound', 474, '', 230, 18, 1, 1, 2, 'FIGHTING/range', AttackType.SPECIAL, 3, 90, Ability.TRI_ATTACK);
  }
}

export class Sewaddle extends Pokemon {
  constructor() {
    super('Ploaj', PKM.SEWADDLE, 'ptéra', [TYPE.GRASS, TYPE.BUG, TYPE.SOUND], Rarity.EPIC, 'sound', 540, PKM.SWADLOON, 80, 5, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 80, Ability.GRASS_WHISTLE);
  }
}

export class Swadloon extends Pokemon {
  constructor() {
    super('Ploaj', PKM.SWADLOON, 'ptéra', [TYPE.GRASS, TYPE.BUG, TYPE.SOUND], Rarity.EPIC, 'sound', 541, PKM.LEAVANNY, 120, 9, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 80, Ability.GRASS_WHISTLE);
  }
}

export class Leavanny extends Pokemon {
  constructor() {
    super('PmdCollab', PKM.LEAVANNY, 'ptéra', [TYPE.GRASS, TYPE.BUG, TYPE.SOUND], Rarity.EPIC, 'sound', 542, '', 220, 20, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 80, Ability.GRASS_WHISTLE);
  }
}

export class Turtwig extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TURTWIG, 'tortipouss', [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], Rarity.RARE, 'UNCOMMON', 387, PKM.GROTLE, 80, 5, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.STOMP);
  }
}

export class Grotle extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GROTLE, 'boskara', [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], Rarity.RARE, 'UNCOMMON', 388, PKM.TORTERRA, 120, 9, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.STOMP);
  }
}

export class Torterra extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TORTERRA, 'torterra', [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], Rarity.RARE, 'UNCOMMON', 389, '', 220, 20, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.STOMP);
  }
}

export class Deino extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.DEINO, 'solochi', [TYPE.DARK, TYPE.DRAGON], Rarity.RARE, 'february', 633, PKM.ZWEILOUS, 80, 5, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.DRACO_METEOR);
  }
}

export class Zweilous extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.ZWEILOUS, 'diamat', [TYPE.DARK, TYPE.DRAGON], Rarity.RARE, 'february', 634, PKM.HYDREIGON, 120, 9, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.DRACO_METEOR);
  }
}

export class Hydreigon extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.HYDREIGON, 'tryoxhydre', [TYPE.DARK, TYPE.DRAGON], Rarity.RARE, 'february', 635, '', 220, 18, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 3, 100, Ability.DRACO_METEOR);
  }
}

export class Poliwag extends Pokemon {
  constructor() {
    super('Nintendo', PKM.POLIWAG, 'ptitard', [TYPE.WATER, TYPE.FIGHTING], Rarity.RARE, 'RARE', 60, PKM.POLIWHIRL, 80, 5, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 1, 100, Ability.SOAK);
  }
}

export class Poliwhirl extends Pokemon {
  constructor() {
    super('Nintendo', PKM.POLIWHIRL, 'tetarte', [TYPE.WATER, TYPE.FIGHTING], Rarity.RARE, 'RARE', 61, PKM.POLITOED, 120, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.SOAK);
  }
}

export class Politoed extends Pokemon {
  constructor() {
    super('Nintendo', PKM.POLITOED, 'tarpaud', [TYPE.WATER, TYPE.FIGHTING], Rarity.RARE, 'RARE', 186, '', 220, 18, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 3, 100, Ability.SOAK);
  }
}

export class Magby extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAGBY, 'magby', [TYPE.FIRE, TYPE.HUMAN], Rarity.RARE, 'EPIC', 240, PKM.MAGMAR, 80, 5, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.HEAT_WAVE);
  }
}

export class Magmar extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAGMAR, 'magmar', [TYPE.FIRE, TYPE.HUMAN], Rarity.RARE, 'EPIC', 126, PKM.MAGMORTAR, 120, 9, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.HEAT_WAVE);
  }
}

export class Magmortar extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAGMORTAR, 'maganon', [TYPE.FIRE, TYPE.HUMAN], Rarity.RARE, 'EPIC', 467, '', 220, 18, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 3, 100, Ability.HEAT_WAVE);
  }
}

export class Solosis extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.SOLOSIS, 'nucléos', [TYPE.PSYCHIC, TYPE.GHOST], Rarity.RARE, 'april', 577, PKM.DUOSION, 80, 5, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 1, 100, Ability.LEECH_LIFE);
  }
}

export class Duosion extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.DUOSION, 'méïos', [TYPE.PSYCHIC, TYPE.GHOST], Rarity.RARE, 'april', 578, PKM.REUNICLUS, 120, 9, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.LEECH_LIFE);
  }
}

export class Reuniclus extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.REUNICLUS, 'symbios', [TYPE.PSYCHIC, TYPE.GHOST], Rarity.RARE, 'april', 579, '', 220, 18, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 3, 100, Ability.LEECH_LIFE);
  }
}

export class Shinx extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SHINX, 'lixy', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.RARE, 'RARE', 403, PKM.LUXIO, 80, 5, 4, 4, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 1, 100, Ability.DISCHARGE);
  }
}

export class Luxio extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LUXIO, 'luxio', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.RARE, 'RARE', 404, PKM.LUXRAY, 120, 9, 5, 5, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 2, 100, Ability.DISCHARGE);
  }
}

export class Luxray extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LUXRAY, 'luxray', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.RARE, 'RARE', 405, '', 220, 20, 6, 6, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 3, 100, Ability.DISCHARGE);
  }
}

export class Cubone extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CUBONE, 'ptéra', [TYPE.GROUND, TYPE.MINERAL], Rarity.EPIC, 'sound', 104, PKM.MAROWAK, 80, 5, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 60, Ability.BONEMERANG);
  }
}

export class Marowak extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAROWAK, 'ptéra', [TYPE.GROUND, TYPE.MINERAL], Rarity.EPIC, 'sound', 105, PKM.ALOLANMAROWAK, 120, 9, 5, 5, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 60, Ability.BONEMERANG);
  }
}

export class AlolanMarowak extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ALOLANMAROWAK, 'ptéra', [TYPE.GROUND, TYPE.MINERAL, TYPE.FIRE, TYPE.GHOST], Rarity.EPIC, 'sound', 1050, '', 220, 20, 6, 6, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 60, Ability.BONEMERANG);
  }
}

export class Axew extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.AXEW, 'ptéra', [TYPE.DRAGON, TYPE.MONSTER], Rarity.RARE, 'sound', 610, PKM.FRAXURE, 80, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.HEAD_SMASH);
  }
}

export class Fraxure extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.FRAXURE, 'ptéra', [TYPE.DRAGON, TYPE.MONSTER], Rarity.RARE, 'sound', 611, PKM.HAXORUS, 120, 9, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAD_SMASH);
  }
}

export class Haxorus extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.HAXORUS, 'ptéra', [TYPE.DRAGON, TYPE.MONSTER], Rarity.RARE, 'sound', 612, '', 220, 20, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.HEAD_SMASH);
  }
}

export class Dratini extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DRATINI, 'minidraco', [TYPE.DRAGON, TYPE.AQUATIC], Rarity.RARE, 'EPIC', 147, PKM.DRAGONAIR, 80, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.DRAGON_BREATH);
  }
}

export class Dragonair extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DRAGONAIR, 'draco', [TYPE.DRAGON, TYPE.AQUATIC], Rarity.RARE, 'EPIC', 148, PKM.DRAGONITE, 120, 9, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.DRAGON_BREATH);
  }
}

export class Dragonite extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DRAGONITE, 'dracolosse', [TYPE.DRAGON, TYPE.AQUATIC, TYPE.FLYING], Rarity.RARE, 'EPIC', 149, '', 220, 20, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.DRAGON_BREATH);
  }
}

export class Lotad extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LOTAD, 'nénupiot', [TYPE.GRASS, TYPE.WATER], Rarity.RARE, 'RARE', 270, PKM.LOMBRE, 80, 5, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 1, 100, Ability.TORMENT);
  }
}

export class Lombre extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LOMBRE, 'lombre', [TYPE.GRASS, TYPE.WATER], Rarity.RARE, 'RARE', 271, PKM.LUDICOLO, 120, 9, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.TORMENT);
  }
}

export class Ludicolo extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LUDICOLO, 'ludicolo', [TYPE.GRASS, TYPE.WATER], Rarity.RARE, 'RARE', 272, '', 220, 18, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 3, 100, Ability.TORMENT);
  }
}

export class Togepi extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TOGEPI, 'togépi', [TYPE.NORMAL, TYPE.FAIRY], Rarity.RARE, 'RARE', 175, PKM.TOGETIC, 80, 5, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 1, 70, Ability.WISH);
  }
}

export class Togetic extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TOGETIC, 'togétic', [TYPE.NORMAL, TYPE.FAIRY, TYPE.FLYING], Rarity.RARE, 'RARE', 176, PKM.TOGEKISS, 120, 9, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 2, 70, Ability.WISH);
  }
}

export class Togekiss extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TOGEKISS, 'togekiss', [TYPE.NORMAL, TYPE.FAIRY, TYPE.FLYING], Rarity.RARE, 'RARE', 468, '', 220, 18, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 3, 70, Ability.WISH);
  }
}

export class Rhyhorn extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RHYHORN, 'rhinocorne', [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], Rarity.RARE, 'RARE', 111, PKM.RHYDON, 80, 5, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.STOMP);
  }
}

export class Rhydon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RHYDON, 'rhinoféros', [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], Rarity.RARE, 'RARE', 112, PKM.RHYPERIOR, 120, 9, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.STOMP);
  }
}

export class Rhyperior extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RHYPERIOR, 'rhinastoc', [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], Rarity.RARE, 'RARE', 464, '', 220, 20, 8, 8, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.STOMP);
  }
}

export class Fletchling extends Pokemon {
  constructor() {
    super('Nintendo', PKM.FLETCHLING, 'ptéra', [TYPE.FIRE, TYPE.FLYING], Rarity.RARE, 'sound', 661, PKM.FLETCHINDER, 80, 5, 4, 4, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Fletchinder extends Pokemon {
  constructor() {
    super('Nintendo', PKM.FLETCHINDER, 'ptéra', [TYPE.FIRE, TYPE.FLYING], Rarity.RARE, 'sound', 662, PKM.TALONFLAME, 120, 9, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT);
  }
}

export class Talonflame extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TALONFLAME, 'ptéra', [TYPE.FIRE, TYPE.FLYING], Rarity.RARE, 'sound', 663, '', 220, 20, 6, 6, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.DEFAULT);
  }
}

export class Aron extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ARON, 'galékid', [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], Rarity.RARE, 'RARE', 304, PKM.LAIRON, 80, 5, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.STOMP);
  }
}

export class Lairon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LAIRON, 'galégon', [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], Rarity.RARE, 'RARE', 305, PKM.AGGRON, 120, 9, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.STOMP);
  }
}

export class Aggron extends Pokemon {
  constructor() {
    super('Nintendo', PKM.AGGRON, 'galéking', [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], Rarity.RARE, 'RARE', 306, '', 220, 20, 8, 8, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.STOMP);
  }
}

export class Whismur extends Pokemon {
  constructor() {
    super('Nintendo', PKM.WHISMUR, 'ptéra', [TYPE.NORMAL, TYPE.SOUND], Rarity.RARE, 'sound', 293, PKM.LOUDRED, 80, 5, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 1, 90, Ability.ECHO);
  }
}
export class Loudred extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LOUDRED, 'ptéra', [TYPE.NORMAL, TYPE.SOUND], Rarity.RARE, 'sound', 294, PKM.EXPLOUD, 120, 9, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 90, Ability.ECHO);
  }
}

export class Exploud extends Pokemon {
  constructor() {
    super('Nintendo', PKM.EXPLOUD, 'ptéra', [TYPE.NORMAL, TYPE.SOUND], Rarity.RARE, 'sound', 295, '', 220, 18, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 3, 90, Ability.ECHO);
  }
}

export class Swinub extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SWINUB, 'marcarin', [TYPE.GROUND, TYPE.ICE, TYPE.FIELD], Rarity.COMMON, 'december', 220, PKM.PILOSWINE, 80, 5, 4, 4, 1, 'ICE/melee', AttackType.PHYSICAL, 1, 100, Ability.ICICLE_CRASH);
  }
}

export class Piloswine extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PILOSWINE, 'cochignon', [TYPE.GROUND, TYPE.ICE, TYPE.FIELD], Rarity.COMMON, 'december', 221, PKM.MAMOSWINE, 120, 9, 4, 4, 1, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.ICICLE_CRASH);
  }
}

export class Mamoswine extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAMOSWINE, 'mammochon', [TYPE.GROUND, TYPE.ICE, TYPE.FIELD], Rarity.COMMON, 'december', 473, '', 220, 20, 6, 6, 1, 'ICE/melee', AttackType.PHYSICAL, 3, 100, Ability.ICICLE_CRASH);
  }
}

export class Snover extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SNOVER, 'blizzi', [TYPE.GRASS, TYPE.ICE], Rarity.LEGENDARY, 'december', 459, PKM.ABOMASNOW, 80, 7, 6, 6, 1, 'ICE/melee', AttackType.PHYSICAL, 1, 100, Ability.FREEZE);
  }
}

export class Abomasnow extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ABOMASNOW, 'blizzaroi', [TYPE.GRASS, TYPE.ICE], Rarity.LEGENDARY, 'december', 460, PKM.MEGAABOMASNOW, 120, 11, 8, 8, 1, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.FREEZE);
  }
}

export class MegaAbomasnow extends Pokemon {
  constructor() {
    super('phoenix', PKM.MEGAABOMASNOW, 'méga-blizzaroi', [TYPE.GRASS, TYPE.ICE], Rarity.LEGENDARY, 'december', 4600, '', 220, 25, 10, 10, 1, 'ICE/melee', AttackType.PHYSICAL, 3, 100, Ability.FREEZE);
  }
}

export class Snorunt extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SNORUNT, 'stalgamin', [TYPE.GHOST, TYPE.ICE], Rarity.EPIC, 'december', 361, PKM.GLALIE, 80, 5, 2, 2, 3, 'GHOST/range', AttackType.SPECIAL, 1, 100, Ability.DARK_PULSE);
  }
}

export class Glalie extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GLALIE, 'oniglali', [TYPE.GHOST, TYPE.ICE], Rarity.EPIC, 'december', 362, PKM.FROSLASS, 120, 9, 2, 2, 3, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.DARK_PULSE);
  }
}

export class Froslass extends Pokemon {
  constructor() {
    super('Nintendo', PKM.FROSLASS, 'momartik', [TYPE.GHOST, TYPE.ICE], Rarity.EPIC, 'december', 478, '', 220, 20, 2, 2, 3, 'GHOST/range', AttackType.SPECIAL, 3, 100, Ability.DARK_PULSE);
  }
}

export class Vanillite extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VANILLITE, 'sorbébé', [TYPE.FAIRY, TYPE.ICE], Rarity.RARE, 'december', 582, PKM.VANILLISH, 80, 5, 2, 2, 3, 'FAIRY/range', AttackType.SPECIAL, 1, 100, Ability.SLEEP);
  }
}

export class Vanillish extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VANILLISH, 'sorboul', [TYPE.FAIRY, TYPE.ICE], Rarity.RARE, 'december', 583, PKM.VANILLUXE, 120, 8, 2, 2, 3, 'FAIRY/range', AttackType.SPECIAL, 2, 100, Ability.SLEEP);
  }
}

export class Vanilluxe extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VANILLUXE, 'sorbouboul', [TYPE.FAIRY, TYPE.ICE], Rarity.RARE, 'december', 584, '', 220, 19, 2, 2, 3, 'FAIRY/range', AttackType.SPECIAL, 3, 100, Ability.SLEEP);
  }
}

export class Trapinch extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TRAPINCH, 'kraknoix', [TYPE.GROUND, TYPE.BUG], Rarity.RARE, 'RARE', 328, PKM.VIBRAVA, 80, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.DRAGON_TAIL);
  }
}

export class Vibrava extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VIBRAVA, 'vibranif', [TYPE.GROUND, TYPE.DRAGON, TYPE.BUG], Rarity.RARE, 'RARE', 329, PKM.FLYGON, 120, 9, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.DRAGON_TAIL);
  }
}

export class Flygon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.FLYGON, 'libegon', [TYPE.GROUND, TYPE.DRAGON, TYPE.BUG], Rarity.RARE, 'RARE', 330, '', 220, 20, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.DRAGON_TAIL);
  }
}

export class Pichu extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PICHU, 'pichu', [TYPE.ELECTRIC, TYPE.FAIRY], Rarity.RARE, 'RARE', 172, PKM.PIKACHU, 80, 5, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 1, 100, Ability.THUNDER);
  }
}

export class Pikachu extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PIKACHU, 'pikachu', [TYPE.ELECTRIC, TYPE.FAIRY], Rarity.RARE, 'RARE', 25, PKM.RAICHU, 120, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.THUNDER);
  }
}

export class Raichu extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RAICHU, 'raichu', [TYPE.ELECTRIC, TYPE.FAIRY], Rarity.RARE, 'RARE', 26, '', 220, 18, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 3, 100, Ability.THUNDER);
  }
}

export class Bulbasaur extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BULBASAUR, 'bulbizarre', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.RARE, 'UNCOMMON', 1, PKM.IVYSAUR, 80, 5, 2, 2, 2, 'GRASS/range', AttackType.SPECIAL, 1, 100, Ability.ROOT);
  }
}

export class Ivysaur extends Pokemon {
  constructor() {
    super('Nintendo', PKM.IVYSAUR, 'herbizarre', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.RARE, 'UNCOMMON', 2, PKM.VENUSAUR, 120, 9, 3, 3, 2, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.ROOT);
  }
}

export class Venusaur extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VENUSAUR, 'florizarre', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.RARE, 'UNCOMMON', 3, '', 210, 18, 4, 4, 2, 'GRASS/range', AttackType.SPECIAL, 3, 100, Ability.ROOT);
  }
}

export class Igglybuff extends Pokemon {
  constructor() {
    super('Nintendo', PKM.IGGLYBUFF, 'toudoudou', [TYPE.FAIRY, TYPE.NORMAL, TYPE.SOUND], Rarity.UNCOMMON, 'COMMON', 174, PKM.JIGGLYPUFF, 70, 5, 1, 1, 2, 'FAIRY/range', AttackType.SPECIAL, 1, 90, Ability.SLEEP);
  }
}

export class Jigglypuff extends Pokemon {
  constructor() {
    super('Nintendo', PKM.JIGGLYPUFF, 'rondoudou', [TYPE.FAIRY, TYPE.NORMAL, TYPE.SOUND], Rarity.UNCOMMON, 'COMMON', 39, PKM.WIGGLYTUFF, 120, 9, 1, 1, 2, 'FAIRY/range', AttackType.SPECIAL, 2, 90, Ability.SLEEP);
  }
}

export class Wigglytuff extends Pokemon {
  constructor() {
    super('Nintendo', PKM.WIGGLYTUFF, 'grodoudou', [TYPE.FAIRY, TYPE.NORMAL, TYPE.SOUND], Rarity.UNCOMMON, 'COMMON', 40, '', 210, 18, 2, 2, 2, 'FAIRY/range', AttackType.SPECIAL, 3, 90, Ability.SLEEP);
  }
}

export class Duskull extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DUSKULL, 'skélénox', [TYPE.DARK, TYPE.GHOST], Rarity.UNCOMMON, 'RARE', 355, PKM.DUSCLOPS, 70, 5, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 1, 100, Ability.NIGHT_SLASH);
  }
}

export class Dusclops extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DUSCLOPS, 'téraclope', [TYPE.DARK, TYPE.GHOST], Rarity.UNCOMMON, 'RARE', 356, PKM.DUSKNOIR, 120, 9, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.NIGHT_SLASH);
  }
}

export class Dusknoir extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DUSKNOIR, 'noctunoir', [TYPE.DARK, TYPE.GHOST], Rarity.UNCOMMON, 'RARE', 477, '', 210, 18, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 3, 100, Ability.NIGHT_SLASH);
  }
}

export class Magnemite extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAGNEMITE, 'magnéti', [TYPE.ELECTRIC, TYPE.METAL], Rarity.UNCOMMON, 'RARE', 81, PKM.MAGNETON, 70, 5, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 1, 100, Ability.CHARGE);
  }
}

export class Magneton extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAGNETON, 'magnéton', [TYPE.ELECTRIC, TYPE.METAL], Rarity.UNCOMMON, 'RARE', 82, PKM.MAGNEZONE, 120, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.CHARGE);
  }
}

export class Magnezone extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAGNEZONE, 'magnézone', [TYPE.ELECTRIC, TYPE.METAL], Rarity.UNCOMMON, 'RARE', 462, '', 210, 20, 2, 2, 2, 'ELECTRIC/range', AttackType.SPECIAL, 3, 100, Ability.CHARGE);
  }
}

export class Horsea extends Pokemon {
  constructor() {
    super('Nintendo', PKM.HORSEA, 'hypotrempe', [TYPE.WATER, TYPE.DRAGON], Rarity.UNCOMMON, 'RARE', 116, PKM.SEADRA, 70, 5, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 1, 100, Ability.HYDRO_PUMP);
  }
}

export class Seadra extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SEADRA, 'hypocéan', [TYPE.WATER, TYPE.DRAGON], Rarity.UNCOMMON, 'RARE', 117, PKM.KINGDRA, 120, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.HYDRO_PUMP);
  }
}

export class Kingdra extends Pokemon {
  constructor() {
    super('Nintendo', PKM.KINGDRA, 'hyporoi', [TYPE.WATER, TYPE.DRAGON], Rarity.UNCOMMON, 'RARE', 230, '', 210, 20, 2, 2, 2, 'WATER/range', AttackType.SPECIAL, 3, 100, Ability.HYDRO_PUMP);
  }
}

export class Flabebe extends Pokemon {
  constructor() {
    super('PmdCollab', PKM.FLABEBE, 'ptéra', [TYPE.SOUND, TYPE.FAIRY, TYPE.FLORA], Rarity.UNCOMMON, 'sound', 669, PKM.FLOETTE, 70, 5, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 1, 90, Ability.DISARMING_VOICE);
  }
}

export class Floette extends Pokemon {
  constructor() {
    super('PmdCollab', PKM.FLOETTE, 'ptéra', [TYPE.SOUND, TYPE.FAIRY, TYPE.FLORA], Rarity.UNCOMMON, 'sound', 670, PKM.FLORGES, 120, 9, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 90, Ability.DISARMING_VOICE);
  }
}
export class Florges extends Pokemon {
  constructor() {
    super('PmdCollab', PKM.FLORGES, 'ptéra', [TYPE.SOUND, TYPE.FAIRY, TYPE.FLORA], Rarity.UNCOMMON, 'sound', 671, '', 210, 20, 2, 2, 3, 'PSYCHIC/range', AttackType.SPECIAL, 3, 90, Ability.DISARMING_VOICE);
  }
}

export class Klink extends Pokemon {
  constructor() {
    super('Joojishibuki', PKM.KLINK, 'ptéra', [TYPE.ELECTRIC, TYPE.METAL], Rarity.UNCOMMON, 'sound', 599, PKM.KLANG, 70, 5, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 1, 100, Ability.DEFAULT);
  }
}

export class Klang extends Pokemon {
  constructor() {
    super('Joojishibuki', PKM.KLANG, 'ptéra', [TYPE.ELECTRIC, TYPE.METAL], Rarity.UNCOMMON, 'sound', 600, PKM.KLINKLANG, 120, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.DEFAULT);
  }
}

export class Klinklang extends Pokemon {
  constructor() {
    super('Joojishibuki', PKM.KLINKLANG, 'ptéra', [TYPE.ELECTRIC, TYPE.METAL], Rarity.UNCOMMON, 'sound', 601, '', 210, 20, 2, 2, 2, 'ELECTRIC/range', AttackType.SPECIAL, 3, 100, Ability.DEFAULT);
  }
}

export class Chikorita extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CHIKORITA, 'germignon', [TYPE.GRASS, TYPE.FLORA], Rarity.UNCOMMON, 'UNCOMMON', 152, PKM.BAYLEEF, 70, 5, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 1, 100, Ability.STUN_SPORE);
  }
}

export class Bayleef extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BAYLEEF, 'macronium', [TYPE.GRASS, TYPE.FLORA], Rarity.UNCOMMON, 'UNCOMMON', 153, PKM.MEGANIUM, 120, 9, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.STUN_SPORE);
  }
}

export class Meganium extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MEGANIUM, 'meganium', [TYPE.GRASS, TYPE.FLORA], Rarity.UNCOMMON, 'UNCOMMON', 154, '', 210, 20, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 3, 100, Ability.STUN_SPORE);
  }
}

export class Sandile extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.SANDILE, 'mascaïman', [TYPE.GROUND, TYPE.DARK, TYPE.FIELD], Rarity.UNCOMMON, 'february', 551, PKM.KROKOROK, 70, 5, 3, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.STOMP);
  }
}

export class Krookorok extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.KROKOROK, 'escroco', [TYPE.GROUND, TYPE.DARK, TYPE.FIELD], Rarity.UNCOMMON, 'february', 552, PKM.KROOKODILE, 120, 9, 3, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.STOMP);
  }
}

export class Krookodile extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.KROOKODILE, 'krocorible', [TYPE.GROUND, TYPE.DARK, TYPE.FIELD], Rarity.UNCOMMON, 'february', 553, '', 210, 20, 3, 3, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.STOMP);
  }
}

export class Venipede extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VENIPEDE, 'ptéra', [TYPE.BUG, TYPE.POISON], Rarity.UNCOMMON, 'sound', 543, PKM.WHIRLIPEDE, 70, 5, 3, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.POISON_STING);
  }
}

export class Whirlipede extends Pokemon {
  constructor() {
    super('Nintendo', PKM.WHIRLIPEDE, 'ptéra', [TYPE.BUG, TYPE.POISON], Rarity.UNCOMMON, 'sound', 544, PKM.SCOLIPEDE, 120, 9, 3, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.POISON_STING);
  }
}

export class Scolipede extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SCOLIPEDE, 'ptéra', [TYPE.BUG, TYPE.POISON], Rarity.UNCOMMON, 'sound', 545, '', 210, 20, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.POISON_STING);
  }
}

export class Spheal extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SPHEAL, 'obalie', [TYPE.AQUATIC, TYPE.ICE], Rarity.UNCOMMON, 'RARE', 363, PKM.SEALEO, 70, 5, 3, 2, 1, 'ICE/melee', AttackType.PHYSICAL, 1, 100, Ability.ICICLE_CRASH);
  }
}

export class Sealeo extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SEALEO, 'phogleur', [TYPE.AQUATIC, TYPE.ICE], Rarity.UNCOMMON, 'RARE', 364, PKM.WALREIN, 120, 9, 3, 2, 1, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.ICICLE_CRASH);
  }
}

export class Walrein extends Pokemon {
  constructor() {
    super('Nintendo', PKM.WALREIN, 'kaimorse', [TYPE.AQUATIC, TYPE.ICE], Rarity.UNCOMMON, 'RARE', 365, '', 210, 20, 3, 3, 1, 'ICE/melee', AttackType.PHYSICAL, 3, 100, Ability.ICICLE_CRASH);
  }
}

export class Lillipup extends Pokemon {
  constructor() {
    super('princess phoenix', PKM.LILLIPUP, 'ptéra', [TYPE.NORMAL, TYPE.FIELD], Rarity.UNCOMMON, 'sound', 506, PKM.HERDIER, 70, 5, 3, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Herdier extends Pokemon {
  constructor() {
    super('princess phoenix', PKM.HERDIER, 'ptéra', [TYPE.NORMAL, TYPE.FIELD], Rarity.UNCOMMON, 'sound', 507, PKM.STOUTLAND, 120, 9, 3, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT);
  }
}

export class Stoutland extends Pokemon {
  constructor() {
    super('princess phoenix', PKM.STOUTLAND, 'ptéra', [TYPE.NORMAL, TYPE.FIELD], Rarity.UNCOMMON, 'sound', 508, '', 210, 20, 3, 3, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 100, Ability.DEFAULT);
  }
}

export class NidoranF extends Pokemon {
  constructor() {
    super('Nintendo', PKM.NIDORANF, 'nidoranF', [TYPE.POISON, TYPE.FIELD], Rarity.RARE, 'UNCOMMON', 29, PKM.NIDORINA, 70, 5, 3, 3, 1, 'POISON/melee', AttackType.PHYSICAL, 1, 100, Ability.POISON_STING);
  }
}

export class Nidorina extends Pokemon {
  constructor() {
    super('Nintendo', PKM.NIDORINA, 'nidorina', [TYPE.POISON, TYPE.FIELD], Rarity.RARE, 'UNCOMMON', 30, PKM.NIDOQUEEN, 120, 9, 3, 3, 1, 'POISON/melee', AttackType.PHYSICAL, 2, 100, Ability.POISON_STING);
  }
}

export class Nidoqueen extends Pokemon {
  constructor() {
    super('Nintendo', PKM.NIDOQUEEN, 'nidoqueen', [TYPE.POISON, TYPE.FIELD], Rarity.RARE, 'UNCOMMON', 31, '', 210, 20, 5, 5, 1, 'POISON/melee', AttackType.PHYSICAL, 3, 100, Ability.POISON_STING);
  }
}

export class NidoranM extends Pokemon {
  constructor() {
    super('Nintendo', PKM.NIDORANM, 'nidoranM', [TYPE.POISON, TYPE.FIELD], Rarity.RARE, 'UNCOMMON', 32, PKM.NIDORINO, 70, 5, 3, 3, 1, 'POISON/melee', AttackType.PHYSICAL, 1, 100, Ability.POISON);
  }
}

export class Nidorino extends Pokemon {
  constructor() {
    super('Nintendo', PKM.NIDORINO, 'nidorino', [TYPE.POISON, TYPE.FIELD], Rarity.RARE, 'UNCOMMON', 33, PKM.NIDOKING, 120, 9, 3, 3, 1, 'POISON/melee', AttackType.PHYSICAL, 2, 100, Ability.POISON);
  }
}

export class Nidoking extends Pokemon {
  constructor() {
    super('Nintendo', PKM.NIDOKING, 'nidoking', [TYPE.POISON, TYPE.FIELD], Rarity.RARE, 'UNCOMMON', 34, '', 210, 20, 5, 5, 1, 'POISON/melee', AttackType.PHYSICAL, 3, 100, Ability.POISON);
  }
}

export class Machop extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MACHOP, 'machoc', [TYPE.FIGHTING, TYPE.HUMAN], Rarity.UNCOMMON, 'RARE', 66, PKM.MACHOKE, 70, 5, 3, 3, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 1, 100, Ability.GUILLOTINE);
  }
}

export class Machoke extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MACHOKE, 'machopeur', [TYPE.FIGHTING, TYPE.HUMAN], Rarity.UNCOMMON, 'RARE', 67, PKM.MACHAMP, 120, 9, 3, 3, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 2, 100, Ability.GUILLOTINE);
  }
}

export class Machamp extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MACHAMP, 'mackogneur', [TYPE.FIGHTING, TYPE.HUMAN], Rarity.UNCOMMON, 'RARE', 68, '', 210, 20, 5, 5, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 3, 100, Ability.GUILLOTINE);
  }
}

export class Piplup extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PIPLUP, 'tiplouf', [TYPE.WATER, TYPE.FLYING, TYPE.METAL], Rarity.UNCOMMON, 'UNCOMMON', 393, PKM.PRINPLUP, 70, 5, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.IRON_TAIL);
  }
}

export class Prinplup extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PRINPLUP, 'prinplouf', [TYPE.WATER, TYPE.FLYING, TYPE.METAL], Rarity.UNCOMMON, 'UNCOMMON', 394, PKM.EMPOLEON, 120, 9, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_TAIL);
  }
}

export class Empoleon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.EMPOLEON, 'pingoléon', [TYPE.WATER, TYPE.FLYING, TYPE.METAL], Rarity.UNCOMMON, 'UNCOMMON', 395, '', 210, 20, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.IRON_TAIL);
  }
}

export class Chimchar extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CHIMCHAR, 'ouisticram', [TYPE.FIRE, TYPE.FIGHTING], Rarity.UNCOMMON, 'UNCOMMON', 390, PKM.MONFERNO, 70, 5, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.TORMENT);
  }
}

export class Monferno extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MONFERNO, 'chimpenfeu', [TYPE.FIRE, TYPE.FIGHTING], Rarity.UNCOMMON, 'UNCOMMON', 391, PKM.INFERNAPE, 120, 9, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.TORMENT);
  }
}

export class Infernape extends Pokemon {
  constructor() {
    super('Nintendo', PKM.INFERNAPE, 'simiabraz', [TYPE.FIRE, TYPE.FIGHTING], Rarity.UNCOMMON, 'UNCOMMON', 392, '', 210, 20, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.TORMENT);
  }
}

export class Mudkip extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MUDKIP, 'gobou', [TYPE.WATER, TYPE.GROUND], Rarity.UNCOMMON, 'UNCOMMON', 258, PKM.MARSHTOMP, 70, 5, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.SOAK);
  }
}

export class Marshtomp extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MARSHTOMP, 'flobio', [TYPE.WATER, TYPE.GROUND], Rarity.UNCOMMON, 'UNCOMMON', 259, PKM.SWAMPERT, 120, 9, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.SOAK);
  }
}

export class Swampert extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SWAMPERT, 'laggron', [TYPE.WATER, TYPE.GROUND], Rarity.UNCOMMON, 'UNCOMMON', 260, '', 210, 20, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.SOAK);
  }
}

export class Torchic extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TORCHIC, 'poussifeu', [TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], Rarity.UNCOMMON, 'UNCOMMON', 255, PKM.COMBUSKEN, 70, 5, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BLAZE_KICK);
  }
}

export class Combusken extends Pokemon {
  constructor() {
    super('Nintendo', PKM.COMBUSKEN, 'galifeu', [TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], Rarity.UNCOMMON, 'UNCOMMON', 256, PKM.BLAZIKEN, 120, 9, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.BLAZE_KICK);
  }
}

export class Blaziken extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BLAZIKEN, 'braségali', [TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], Rarity.UNCOMMON, 'UNCOMMON', 257, '', 210, 20, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.BLAZE_KICK);
  }
}

export class Treecko extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TREECKO, 'arcko', [TYPE.GRASS, TYPE.MONSTER], Rarity.UNCOMMON, 'UNCOMMON', 252, PKM.GROVYLE, 70, 5, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.THIEF);
  }
}

export class Grovyle extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GROVYLE, 'massko', [TYPE.GRASS, TYPE.MONSTER], Rarity.UNCOMMON, 'UNCOMMON', 253, PKM.SCEPTILE, 120, 9, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.THIEF);
  }
}

export class Sceptile extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SCEPTILE, 'jungko', [TYPE.GRASS, TYPE.MONSTER], Rarity.UNCOMMON, 'UNCOMMON', 254, '', 210, 20, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.THIEF);
  }
}

export class Cyndaquil extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CYNDAQUIL, 'héricendre', [TYPE.FIRE, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 155, PKM.QUILAVA, 70, 5, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.WHEEL_OF_FIRE);
  }
}

export class Quilava extends Pokemon {
  constructor() {
    super('Nintendo', PKM.QUILAVA, 'feurisson', [TYPE.FIRE, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 156, PKM.TYPHLOSION, 120, 9, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.WHEEL_OF_FIRE);
  }
}

export class Typhlosion extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TYPHLOSION, 'typhlosion', [TYPE.FIRE, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 157, '', 210, 18, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 3, 100, Ability.WHEEL_OF_FIRE);
  }
}

export class Slowpoke extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SLOWPOKE, 'ramoloss', [TYPE.AQUATIC, TYPE.PSYCHIC], Rarity.UNCOMMON, 'UNCOMMON2', 79, PKM.SLOWBRO, 70, 5, 2, 2, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.SOAK);
  }
}

export class Slowbro extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SLOWBRO, 'flagadoss', [TYPE.AQUATIC, TYPE.PSYCHIC], Rarity.UNCOMMON, 'UNCOMMON2', 80, PKM.SLOWKING, 120, 9, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.SOAK);
  }
}

export class Slowking extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SLOWKING, 'roigada', [TYPE.AQUATIC, TYPE.PSYCHIC], Rarity.UNCOMMON, 'UNCOMMON2', 199, '', 210, 20, 4, 4, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.SOAK);
  }
}

export class Squirtle extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SQUIRTLE, 'carapuce', [TYPE.WATER, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 7, PKM.WARTORTLE, 70, 5, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 1, 100, Ability.HYDRO_PUMP);
  }
}

export class Wartortle extends Pokemon {
  constructor() {
    super('Nintendo', PKM.WARTORTLE, 'carabaffe', [TYPE.WATER, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 8, PKM.BLASTOISE, 120, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.HYDRO_PUMP);
  }
}

export class Blastoise extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BLASTOISE, 'tortank', [TYPE.WATER, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 9, '', 210, 20, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 3, 100, Ability.HYDRO_PUMP);
  }
}

export class Bellsprout extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BELLSPROUT, 'chétiflor', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.UNCOMMON, 'december', 69, PKM.WEEPINBELL, 70, 5, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.ROOT);
  }
}

export class Weepinbell extends Pokemon {
  constructor() {
    super('Nintendo', PKM.WEEPINBELL, 'boustiflor', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.UNCOMMON, 'december', 70, PKM.VICTREEBEL, 120, 9, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.ROOT);
  }
}

export class Victreebel extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VICTREEBEL, 'empiflor', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], Rarity.UNCOMMON, 'december', 71, '', 210, 20, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.ROOT);
  }
}

export class Pikipek extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PIKIPEK, 'ptéra', [TYPE.NORMAL, TYPE.FLYING, TYPE.SOUND], Rarity.UNCOMMON, 'sound', 731, PKM.TRUMBEAK, 70, 5, 2, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 70, Ability.GROWL);
  }
}

export class Trumbeak extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TRUMBEAK, 'ptéra', [TYPE.NORMAL, TYPE.FLYING, TYPE.SOUND], Rarity.UNCOMMON, 'sound', 732, PKM.TOUCANNON, 120, 9, 3, 3, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 70, Ability.GROWL);
  }
}

export class Toucannon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TOUCANNON, 'ptéra', [TYPE.NORMAL, TYPE.FLYING, TYPE.SOUND], Rarity.UNCOMMON, 'sound', 733, '', 210, 20, 4, 4, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 70, Ability.GROWL);
  }
}

export class Geodude extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GEODUDE, 'racaillou', [TYPE.GROUND, TYPE.MINERAL], Rarity.COMMON, 'COMMON', 74, PKM.GRAVELER, 60, 5, 2, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.ROCK_SLIDE);
  }
}

export class Graveler extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GRAVELER, 'gravalanch', [TYPE.GROUND, TYPE.MINERAL], Rarity.COMMON, 'COMMON', 75, PKM.GOLEM, 110, 9, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE);
  }
}

export class Golem extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GOLEM, 'grolem', [TYPE.GROUND, TYPE.MINERAL], Rarity.COMMON, 'COMMON', 76, '', 200, 20, 8, 8, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.ROCK_SLIDE);
  }
}

export class Totodile extends Pokemon {
  constructor() {
    super('Nintendo', PKM.TOTODILE, 'kaiminus', [TYPE.MONSTER, TYPE.AQUATIC], Rarity.COMMON, 'UNCOMMON', 158, PKM.CROCONAW, 60, 5, 2, 2, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.BITE);
  }
}

export class Croconaw extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CROCONAW, 'crocodil', [TYPE.MONSTER, TYPE.AQUATIC], Rarity.COMMON, 'UNCOMMON', 159, PKM.FERALIGATR, 110, 9, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.BITE);
  }
}

export class Feraligatr extends Pokemon {
  constructor() {
    super('Nintendo', PKM.FERALIGATR, 'aligatueur', [TYPE.MONSTER, TYPE.AQUATIC], Rarity.COMMON, 'UNCOMMON', 160, '', 200, 20, 5, 5, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.BITE);
  }
}

export class Azurill extends Pokemon {
  constructor() {
    super('Nintendo', PKM.AZURILL, 'azurill', [TYPE.WATER, TYPE.FAIRY], Rarity.COMMON, 'COMMON', 298, PKM.MARILL, 60, 5, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 1, 100, Ability.HYDRO_PUMP);
  }
}

export class Marill extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MARILL, 'marill', [TYPE.WATER, TYPE.FAIRY], Rarity.COMMON, 'COMMON', 183, PKM.AZUMARILL, 110, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.HYDRO_PUMP);
  }
}

export class Azumarill extends Pokemon {
  constructor() {
    super('Nintendo', PKM.AZUMARILL, 'azumarill', [TYPE.WATER, TYPE.FAIRY], Rarity.COMMON, 'COMMON', 184, '', 200, 20, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 3, 100, Ability.HYDRO_PUMP);
  }
}

export class Zubat extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ZUBAT, 'nosferapti', [TYPE.POISON, TYPE.FLYING, TYPE.SOUND], Rarity.COMMON, 'COMMON', 41, PKM.GOLBAT, 60, 5, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 1, 90, Ability.LEECH_LIFE);
  }
}

export class Golbat extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GOLBAT, 'nosferalto', [TYPE.POISON, TYPE.FLYING, TYPE.SOUND], Rarity.COMMON, 'COMMON', 42, PKM.CROBAT, 110, 9, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 90, Ability.LEECH_LIFE);
  }
}

export class Crobat extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CROBAT, 'nostenfer', [TYPE.POISON, TYPE.FLYING, TYPE.SOUND], Rarity.COMMON, 'COMMON', 169, '', 200, 18, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 3, 90, Ability.LEECH_LIFE);
  }
}

export class Mareep extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAREEP, 'wattouat', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.COMMON, 'COMMON', 179, PKM.FLAFFY, 60, 5, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 1, 100, Ability.THUNDER);
  }
}

export class Flaffy extends Pokemon {
  constructor() {
    super('Nintendo', PKM.FLAFFY, 'lainergie', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.COMMON, 'COMMON', 180, PKM.AMPHAROS, 110, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.THUNDER);
  }
}

export class Ampharos extends Pokemon {
  constructor() {
    super('Nintendo', PKM.AMPHAROS, 'pharamp', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.COMMON, 'COMMON', 181, '', 200, 18, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 3, 100, Ability.THUNDER);
  }
}

export class Cleffa extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CLEFFA, 'mélo', [TYPE.FAIRY, TYPE.NORMAL], Rarity.COMMON, 'COMMON', 173, PKM.CLEFAIRY, 60, 5, 2, 2, 1, 'FAIRY/melee', AttackType.PHYSICAL, 1, 100, Ability.METRONOME);
  }
}

export class Clefairy extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CLEFAIRY, 'mélofée', [TYPE.FAIRY, TYPE.NORMAL], Rarity.COMMON, 'COMMON', 35, PKM.CLEFABLE, 110, 9, 2, 2, 1, 'FAIRY/melee', AttackType.PHYSICAL, 2, 100, Ability.METRONOME);
  }
}

export class Clefable extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CLEFABLE, 'mélodelfe', [TYPE.FAIRY, TYPE.NORMAL], Rarity.COMMON, 'COMMON', 36, '', 200, 18, 2, 2, 1, 'FAIRY/melee', AttackType.PHYSICAL, 3, 100, Ability.METRONOME);
  }
}

export class Caterpie extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CATERPIE, 'chenipan', [TYPE.GRASS, TYPE.BUG], Rarity.COMMON, 'COMMON', 10, PKM.METAPOD, 60, 5, 1, 1, 2, 'POISON/range', AttackType.SPECIAL, 1, 100, Ability.BUG_BUZZ);
  }
}

export class Metapod extends Pokemon {
  constructor() {
    super('Nintendo', PKM.METAPOD, 'chrysacier', [TYPE.GRASS, TYPE.BUG], Rarity.COMMON, 'COMMON', 11, PKM.BUTTERFREE, 110, 9, 1, 1, 2, 'POISON/range', AttackType.SPECIAL, 2, 100, Ability.BUG_BUZZ);
  }
}

export class Butterfree extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BUTTERFREE, 'papilusion', [TYPE.GRASS, TYPE.BUG, TYPE.FLYING], Rarity.COMMON, 'COMMON', 12, '', 200, 18, 1, 1, 2, 'POISON/range', AttackType.SPECIAL, 3, 100, Ability.BUG_BUZZ);
  }
}

export class Weedle extends Pokemon {
  constructor() {
    super('Nintendo', PKM.WEEDLE, 'aspicot', [TYPE.POISON, TYPE.BUG], Rarity.COMMON, 'COMMON', 13, PKM.KAKUNA, 60, 5, 2, 2, 1, 'BUG/melee', AttackType.PHYSICAL, 1, 100, Ability.BUG_BUZZ);
  }
}

export class Kakuna extends Pokemon {
  constructor() {
    super('Nintendo', PKM.KAKUNA, 'coconfort', [TYPE.POISON, TYPE.BUG], Rarity.COMMON, 'COMMON', 14, PKM.BEEDRILL, 110, 9, 2, 2, 1, 'BUG/melee', AttackType.PHYSICAL, 2, 100, Ability.BUG_BUZZ);
  }
}

export class Beedrill extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BEEDRILL, 'dardagnan', [TYPE.POISON, TYPE.BUG, TYPE.FLYING], Rarity.COMMON, 'COMMON', 15, '', 200, 20, 2, 2, 1, 'BUG/melee', AttackType.PHYSICAL, 3, 100, Ability.BUG_BUZZ);
  }
}

export class Pidgey extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PIDGEY, 'roucool', [TYPE.NORMAL, TYPE.FLYING], Rarity.COMMON, 'COMMON', 16, PKM.PIDGEOTTO, 60, 5, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 1, 100, Ability.HURRICANE);
  }
}

export class Pidgeotto extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PIDGEOTTO, 'roucoups', [TYPE.NORMAL, TYPE.FLYING], Rarity.COMMON, 'COMMON', 17, PKM.PIDGEOT, 110, 9, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 2, 100, Ability.HURRICANE);
  }
}

export class Pidgeot extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PIDGEOT, 'roucarnage', [TYPE.NORMAL, TYPE.FLYING], Rarity.COMMON, 'COMMON', 18, '', 200, 18, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 3, 100, Ability.HURRICANE);
  }
}

export class Hoppip extends Pokemon {
  constructor() {
    super('Nintendo', PKM.HOPPIP, 'granivol', [TYPE.FLYING, TYPE.FLORA, TYPE.GRASS], Rarity.COMMON, 'COMMON', 187, PKM.SKIPLOOM, 60, 5, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 1, 100, Ability.STUN_SPORE);
  }
}

export class Skiploom extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SKIPLOOM, 'floravol', [TYPE.FLYING, TYPE.FLORA, TYPE.GRASS], Rarity.COMMON, 'COMMON', 188, PKM.JUMPLUFF, 110, 9, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 2, 100, Ability.STUN_SPORE);
  }
}

export class Jumpluff extends Pokemon {
  constructor() {
    super('Nintendo', PKM.JUMPLUFF, 'cotovol', [TYPE.FLYING, TYPE.FLORA, TYPE.GRASS], Rarity.COMMON, 'COMMON', 189, '', 220, 18, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 3, 100, Ability.STUN_SPORE);
  }
}

export class Seedot extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SEEDOT, 'granipiot', [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], Rarity.COMMON, 'COMMON', 273, PKM.NUZLEAF, 60, 5, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.THIEF);
  }
}

export class Nuzleaf extends Pokemon {
  constructor() {
    super('Nintendo', PKM.NUZLEAF, 'pifeuil', [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], Rarity.COMMON, 'COMMON', 274, PKM.SHIFTRY, 110, 9, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.THIEF);
  }
}

export class Shiftry extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SHIFTRY, 'tengalice', [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], Rarity.COMMON, 'COMMON', 275, '', 200, 20, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.THIEF);
  }
}

export class Starly extends Pokemon {
  constructor() {
    super('Nintendo', PKM.STARLY, 'étourmi', [TYPE.NORMAL, TYPE.FLYING], Rarity.COMMON, 'COMMON', 396, PKM.STARAVIA, 60, 5, 2, 2, 1, 'FLYING/melee', AttackType.PHYSICAL, 1, 100, Ability.HURRICANE);
  }
}

export class Staravia extends Pokemon {
  constructor() {
    super('Nintendo', PKM.STARAVIA, 'étourvol', [TYPE.NORMAL, TYPE.FLYING], Rarity.COMMON, 'COMMON', 397, PKM.STARAPTOR, 110, 9, 2, 2, 1, 'FLYING/melee', AttackType.PHYSICAL, 2, 100, Ability.HURRICANE);
  }
}

export class Staraptor extends Pokemon {
  constructor() {
    super('Nintendo', PKM.STARAPTOR, 'étouraptor', [TYPE.NORMAL, TYPE.FLYING], Rarity.COMMON, 'COMMON', 398, '', 200, 20, 2, 2, 1, 'FLYING/melee', AttackType.PHYSICAL, 3, 100, Ability.HURRICANE);
  }
}

export class Charmander extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CHARMANDER, 'salamèche', [TYPE.FIRE, TYPE.DRAGON], Rarity.COMMON, 'UNCOMMON', 4, PKM.CHARMELEON, 60, 5, 2, 2, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BLAST_BURN);
  }
}

export class Charmeleon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CHARMELEON, 'reptincel', [TYPE.FIRE, TYPE.DRAGON], Rarity.COMMON, 'UNCOMMON', 5, PKM.CHARIZARD, 110, 9, 2, 2, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.BLAST_BURN);
  }
}

export class Charizard extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CHARIZARD, 'dracaufeu', [TYPE.FIRE, TYPE.DRAGON], Rarity.COMMON, 'UNCOMMON', 6, '', 200, 20, 2, 2, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.BLAST_BURN);
  }
}


export class Carvanha extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CARVANHA, 'carvanha', [TYPE.WATER, TYPE.DARK], Rarity.SUMMON, 'february', 318, '', 40, 4, 1, 1, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.BITE);
  }
}

export class Houndour extends Pokemon {
  constructor() {
    super('Nintendo', PKM.HOUNDOUR, 'malosse', [TYPE.FIRE, TYPE.DARK], Rarity.SUMMON, 'february', 228, '', 40, 4, 1, 1, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BLAZE_KICK);
  }
}

export class Magikarp extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MAGIKARP, 'magicarpe', [TYPE.WATER], Rarity.NEUTRAL, 'NEUTRAL', 129, PKM.GYARADOS, 30, 1, 1, 1, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Gyarados extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GYARADOS, 'léviator', [TYPE.WATER], Rarity.NEUTRAL, 'NEUTRAL', 130, '', 200, 20, 5, 1, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.HYDRO_PUMP);
  }
}

export class Rattata extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RATTATA, 'ratatta', [TYPE.NORMAL], Rarity.NEUTRAL, 'NEUTRAL', 19, PKM.RATICATE, 30, 5, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Raticate extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RATICATE, 'ratattac', [TYPE.NORMAL], Rarity.NEUTRAL, 'NEUTRAL', 20, '', 60, 7, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT);
  }
}

export class Spearow extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SPEAROW, 'piafabec', [TYPE.FLYING, TYPE.NORMAL], Rarity.NEUTRAL, 'NEUTRAL', 21, '', 30, 5, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Fearow extends Pokemon {
  constructor() {
    super('Nintendo', PKM.FEAROW, 'rapasdepic', [TYPE.FLYING, TYPE.NORMAL], Rarity.NEUTRAL, 'NEUTRAL', 22, '', 60, 7, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT);
  }
}

export class Meloetta extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MELOETTA, 'ptéra', [TYPE.NORMAL, TYPE.SOUND], Rarity.MYTHICAL, 'sound', 648, '', 300, 30, 5, 5, 4, 'PSYCHIC/range', AttackType.SPECIAL, 3, 120, Ability.RELIC_SONG);
  }
}

export class Lugia extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LUGIA, 'lugia', [TYPE.AQUATIC, TYPE.FLYING, TYPE.PSYCHIC], Rarity.MYTHICAL, 'NEUTRAL', 249, '', 300, 30, 5, 5, 4, 'FLYING/range', AttackType.SPECIAL, 2, 100, Ability.SILENCE);
  }
}

export class Giratina extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GIRATINA, 'giratina', [TYPE.DRAGON, TYPE.GHOST], Rarity.MYTHICAL, 'NEUTRAL', 487, '', 300, 30, 5, 5, 2, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.NIGHT_SLASH);
  }
}

export class Zapdos extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ZAPDOS, 'électhor', [TYPE.ELECTRIC, TYPE.FLYING], Rarity.MYTHICAL, 'NEUTRAL', 145, '', 200, 20, 3, 3, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.CHARGE);
  }
}

export class Moltres extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MOLTRES, 'sulfura', [TYPE.FIRE, TYPE.FLYING], Rarity.MYTHICAL, 'NEUTRAL', 146, '', 200, 20, 3, 3, 2, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.WHEEL_OF_FIRE);
  }
}

export class Articuno extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ARTICUNO, 'artikodin', [TYPE.ICE, TYPE.FLYING], Rarity.MYTHICAL, 'NEUTRAL', 144, '', 200, 20, 3, 3, 2, 'FLYING/range', AttackType.SPECIAL, 2, 100, Ability.FREEZE);
  }
}

export class Dialga extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DIALGA, 'dialga', [TYPE.METAL, TYPE.DRAGON], Rarity.MYTHICAL, 'NEUTRAL', 483, '', 300, 30, 5, 5, 2, 'FIRE/range', AttackType.SPECIAL, 2, 150, Ability.ROAR_OF_TIME);
  }
}

export class Palkia extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PALKIA, 'palkia', [TYPE.DRAGON, TYPE.WATER], Rarity.MYTHICAL, 'NEUTRAL', 484, '', 300, 30, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 150, Ability.ROAR_OF_TIME);
  }
}

export class Suicune extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SUICUNE, 'suicune', [TYPE.WATER, TYPE.ICE], Rarity.MYTHICAL, 'NEUTRAL', 245, '', 300, 30, 5, 5, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.HYDRO_PUMP);
  }
}

export class Raikou extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RAIKOU, 'raikou', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.MYTHICAL, 'NEUTRAL', 243, '', 300, 30, 5, 5, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 2, 100, Ability.THUNDER);
  }
}

export class Entei extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ENTEI, 'entei', [TYPE.FIRE, TYPE.FIELD], Rarity.MYTHICAL, 'NEUTRAL', 244, '', 300, 30, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.FIRE_BLAST);
  }
}

export class Regice extends Pokemon {
  constructor() {
    super('Nintendo', PKM.REGICE, 'régice', [TYPE.ICE, TYPE.HUMAN], Rarity.MYTHICAL, 'NEUTRAL', 378, '', 200, 20, 6, 6, 1, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.ICICLE_CRASH);
  }
}

export class Regirock extends Pokemon {
  constructor() {
    super('Nintendo', PKM.REGIROCK, 'régirock', [TYPE.MINERAL, TYPE.HUMAN], Rarity.MYTHICAL, 'NEUTRAL', 377, '', 200, 20, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE);
  }
}

export class Registeel extends Pokemon {
  constructor() {
    super('Nintendo', PKM.REGISTEEL, 'régisteel', [TYPE.METAL, TYPE.HUMAN], Rarity.MYTHICAL, 'NEUTRAL', 379, '', 200, 20, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_DEFENSE);
  }
}

export class Regigigas extends Pokemon {
  constructor() {
    super('Nintendo', PKM.REGIGIGAS, 'régigigas', [TYPE.NORMAL, TYPE.MONSTER, TYPE.HUMAN], Rarity.MYTHICAL, 'NEUTRAL', 486, '', 300, 30, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_TAIL);
  }
}

export class Kyogre extends Pokemon {
  constructor() {
    super('Nintendo', PKM.KYOGRE, 'kyogre', [TYPE.WATER, TYPE.AQUATIC], Rarity.MYTHICAL, 'NEUTRAL', 382, '', 300, 30, 5, 5, 4, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.ORIGIN_PULSE);
  }
}

export class Groudon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GROUDON, 'groudon', [TYPE.GROUND, TYPE.FIRE], Rarity.MYTHICAL, 'NEUTRAL', 383, '', 300, 30, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAT_WAVE);
  }
}

export class Rayquaza extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RAYQUAZA, 'rayquaza', [TYPE.DRAGON, TYPE.FLYING], Rarity.MYTHICAL, 'NEUTRAL', 384, '', 300, 30, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.DRACO_METEOR);
  }
}

export class Eevee extends Pokemon {
  constructor() {
    super('Nintendo', PKM.EEVEE, 'évoli', [TYPE.NORMAL, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 133, '', 130, 5, 2, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.HAPPY_HOUR);
  }
}

export class Vaporeon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VAPOREON, 'aquali', [TYPE.WATER, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 134, '', 130, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Jolteon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.JOLTEON, 'voltali', [TYPE.ELECTRIC, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 135, '', 130, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Flareon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.FLAREON, 'pyroli', [TYPE.FIRE, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 136, '', 130, 9, 3, 2, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Espeon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ESPEON, 'mentali', [TYPE.PSYCHIC, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 196, '', 130, 9, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Umbreon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.UMBREON, 'noctali', [TYPE.DARK, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 197, '', 130, 9, 3, 2, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Leafeon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LEAFEON, 'phylali', [TYPE.GRASS, TYPE.FLORA, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 470, '', 130, 9, 3, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Sylveon extends Pokemon {
  constructor() {
    super('Shiny Wolf', PKM.SYLVEON, 'nymphali', [TYPE.FAIRY, TYPE.FIELD], Rarity.UNCOMMON, 'UNCOMMON', 700, '', 130, 9, 1, 1, 2, 'FAIRY/range', AttackType.SPECIAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Glaceon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GLACEON, 'givrali', [TYPE.ICE, TYPE.FIELD], Rarity.UNCOMMON, 'december', 471, '', 130, 9, 1, 1, 2, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Sandshrew extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SANDSHREW, 'sabelette', [TYPE.GROUND, TYPE.FIELD], Rarity.NEUTRAL, 'NEUTRAL', 27, '', 70, 5, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Darkrai extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DARKRAI, 'darkrai', [TYPE.DARK, TYPE.MONSTER, TYPE.GHOST], Rarity.MYTHICAL, 'NEUTRAL', 491, '', 300, 30, 3, 3, 3, 'GHOST/range', AttackType.SPECIAL, 3, 100, Ability.DARK_PULSE);
  }
}

export class Volcarona extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.VOLCARONA, 'pyrax', [TYPE.FIRE, TYPE.BUG], Rarity.MYTHICAL, 'february', 637, '', 200, 20, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.FIRE_BLAST);
  }
}

export class Castform extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CASTFORM, 'morphéo', [TYPE.NORMAL, TYPE.GHOST], Rarity.MYTHICAL, 'castform', 351, '', 200, 20, 3, 3, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 80, Ability.NASTY_PLOT);
  }
}

export class CastformSun extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CASTFORMSUN, 'morphéo-soleil', [TYPE.NORMAL, TYPE.GHOST, TYPE.FIRE], Rarity.MYTHICAL, 'castform', 3510, '', 200, 20, 3, 3, 2, 'DRAGON/range', AttackType.SPECIAL, 2, 80, Ability.FIRE_BLAST);
  }
}

export class CastformRain extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CASTFORMRAIN, 'morphéo-pluie', [TYPE.NORMAL, TYPE.GHOST, TYPE.WATER], Rarity.MYTHICAL, 'castform', 3511, '', 200, 20, 3, 3, 2, 'WATER/range', AttackType.SPECIAL, 2, 80, Ability.SOAK);
  }
}

export class CastformHail extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CASTFORMHAIL, 'morphéo-neige', [TYPE.NORMAL, TYPE.GHOST, TYPE.ICE], Rarity.MYTHICAL, 'castform', 3512, '', 200, 20, 3, 3, 2, 'ICE/melee', AttackType.SPECIAL, 2, 80, Ability.ICICLE_CRASH);
  }
}

export class Landorus extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.LANDORUS, 'démétéros', [TYPE.GROUND, TYPE.FLYING], Rarity.MYTHICAL, 'february', 645, '', 200, 20, 3, 3, 2, 'FLYING/range', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE);
  }
}

export class Thundurus extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.THUNDURUS, 'fulguris', [TYPE.ELECTRIC, TYPE.FLYING], Rarity.MYTHICAL, 'february', 642, '', 200, 20, 3, 3, 3, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.THUNDER);
  }
}

export class Tornadus extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.TORNADUS, 'boréas', [TYPE.FLYING], Rarity.MYTHICAL, 'february', 641, '', 200, 20, 3, 3, 3, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.HURRICANE);
  }
}

export class Keldeo extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.KELDEO, 'keldeo', [TYPE.WATER, TYPE.FIGHTING], Rarity.MYTHICAL, 'february', 647, '', 200, 20, 3, 3, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.GUILLOTINE);
  }
}

export class Terrakion extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.TERRAKION, 'terrakium', [TYPE.MINERAL, TYPE.FIGHTING], Rarity.MYTHICAL, 'february', 639, '', 200, 20, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE);
  }
}

export class Virizion extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.VIRIZION, 'viridium', [TYPE.GRASS, TYPE.FIGHTING], Rarity.MYTHICAL, 'february', 640, '', 200, 20, 6, 6, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.SEISMIC_TOSS);
  }
}

export class Cobalion extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.COBALION, 'cobaltium', [TYPE.METAL, TYPE.FIGHTING], Rarity.MYTHICAL, 'february', 638, '', 200, 20, 6, 6, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 2, 100, Ability.SEISMIC_TOSS);
  }
}

export class Manaphy extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MANAPHY, 'manaphy', [TYPE.WATER, TYPE.BUG], Rarity.MYTHICAL, 'february', 490, '', 200, 20, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.NASTY_PLOT);
  }
}

export class Rotom extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ROTOM, 'motisma', [TYPE.ELECTRIC, TYPE.GHOST], Rarity.MYTHICAL, 'february', 479, '', 200, 12, 3, 3, 3, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND);
  }
}

export class Spiritomb extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SPIRITOMB, 'spiritomb', [TYPE.DARK, TYPE.GHOST], Rarity.MYTHICAL, 'february', 442, '', 200, 20, 3, 3, 3, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.NIGHT_SLASH);
  }
}

export class Absol extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ABSOL, 'absol', [TYPE.DARK, TYPE.FIELD], Rarity.MYTHICAL, 'february', 359, '', 250, 20, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.THIEF);
  }
}

export class Lapras extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LAPRAS, 'lokhlass', [TYPE.WATER, TYPE.ICE], Rarity.MYTHICAL, 'february', 131, '', 250, 20, 6, 6, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.SOAK);
  }
}

export class Latias extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LATIAS, 'latias', [TYPE.PSYCHIC, TYPE.DRAGON], Rarity.MYTHICAL, 'february', 380, '', 200, 20, 3, 3, 3, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.DRACO_METEOR);
  }
}

export class Latios extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LATIOS, 'latios', [TYPE.PSYCHIC, TYPE.DRAGON], Rarity.MYTHICAL, 'february', 381, '', 200, 20, 3, 3, 3, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.DRACO_METEOR);
  }
}

export class Uxie extends Pokemon {
  constructor() {
    super('Nintendo', PKM.UXIE, 'créhelf', [TYPE.PSYCHIC, TYPE.FAIRY], Rarity.MYTHICAL, 'february', 480, '', 200, 12, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND);
  }
}

export class Mesprit extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MESPRIT, 'créfollet', [TYPE.PSYCHIC, TYPE.FAIRY], Rarity.MYTHICAL, 'february', 481, '', 200, 12, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND);
  }
}

export class Azelf extends Pokemon {
  constructor() {
    super('Nintendo', PKM.AZELF, 'créfadet', [TYPE.PSYCHIC, TYPE.FAIRY], Rarity.MYTHICAL, 'february', 482, '', 200, 12, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND);
  }
}

export class Mewtwo extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MEWTWO, 'mewtwo', [TYPE.PSYCHIC, TYPE.MONSTER], Rarity.MYTHICAL, 'february', 150, '', 300, 30, 5, 5, 3, 'PSYCHIC/range', AttackType.TRUE, 2, 100, Ability.TORMENT);
  }
}

export class Kyurem extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.KYUREM, 'kyurem', [TYPE.DRAGON, TYPE.ICE], Rarity.MYTHICAL, 'february', 646, '', 300, 30, 5, 5, 3, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.FREEZE);
  }
}

export class Reshiram extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.RESHIRAM, 'reshiram', [TYPE.DRAGON, TYPE.FIRE], Rarity.MYTHICAL, 'february', 643, '', 300, 30, 5, 5, 3, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.BURN);
  }
}

export class Zekrom extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.ZEKROM, 'zekrom', [TYPE.DRAGON, TYPE.ELECTRIC], Rarity.MYTHICAL, 'february', 644, '', 300, 30, 5, 5, 3, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.THUNDER);
  }
}

export class Celebi extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CELEBI, 'celebi', [TYPE.GRASS, TYPE.PSYCHIC], Rarity.MYTHICAL, 'february', 251, '', 300, 30, 5, 5, 3, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.LEECH_LIFE);
  }
}

export class Victini extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.VICTINI, 'victini', [TYPE.FIRE, TYPE.PSYCHIC], Rarity.MYTHICAL, 'february', 494, '', 300, 30, 5, 5, 3, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BURN);
  }
}

export class Jirachi extends Pokemon {
  constructor() {
    super('Nintendo', PKM.JIRACHI, 'jirachi', [TYPE.METAL, TYPE.PSYCHIC], Rarity.MYTHICAL, 'february', 385, '', 300, 30, 5, 5, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 50, Ability.WISH);
  }
}

export class Arceus extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ARCEUS, 'arceus', [TYPE.NORMAL, TYPE.FIELD], Rarity.MYTHICAL, 'february', 493, '', 300, 30, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR);
  }
}

export class Deoxys extends Pokemon {
  constructor() {
    super('Nintendo', PKM.DEOXYS, 'deoxys', [TYPE.PSYCHIC, TYPE.HUMAN], Rarity.MYTHICAL, 'february', 386, '', 300, 30, 5, 5, 1, 'PSYCHIC/range', AttackType.PHYSICAL, 2, 100, Ability.PROTECT);
  }
}

export class Shaymin extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SHAYMIN, 'shaymin', [TYPE.GRASS, TYPE.FLORA], Rarity.MYTHICAL, 'february', 492, '', 300, 30, 5, 5, 3, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.SEED_FLARE);
  }
}

export class Cresselia extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CRESSELIA, 'cresselia', [TYPE.PSYCHIC, TYPE.FAIRY], Rarity.MYTHICAL, 'february', 488, '', 300, 30, 5, 5, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 50, Ability.WISH);
  }
}

export class Heatran extends Pokemon {
  constructor() {
    super('Nintendo', PKM.HEATRAN, 'heatran', [TYPE.FIRE, TYPE.METAL], Rarity.MYTHICAL, 'february', 485, '', 300, 30, 5, 5, 3, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.BURN);
  }
}

export class HooH extends Pokemon {
  constructor() {
    super('Nintendo', PKM.HOOH, 'ho-Oh', [TYPE.FIRE, TYPE.FLYING], Rarity.MYTHICAL, 'february', 250, '', 300, 30, 5, 5, 3, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.BURN);
  }
}

export class PrimalGroudon extends Pokemon {
  constructor() {
    super('Keldaan', PKM.PRIMALGROUDON, 'Primo-Groudon', [TYPE.GROUND, TYPE.FIRE], Rarity.MYTHICAL, 'february', 3830, '', 400, 40, 10, 10, 1, 'FIRE/melee', AttackType.TRUE, 3, 100, Ability.BURN);
  }
}

export class PrimalKyogre extends Pokemon {
  constructor() {
    super('Keldaan', PKM.PRIMALKYOGRE, 'Primo-Kyogre', [TYPE.WATER, TYPE.ELECTRIC, TYPE.AQUATIC], Rarity.MYTHICAL, 'february', 3820, '', 400, 40, 5, 5, 3, 'WATER/range', AttackType.TRUE, 3, 100, Ability.THUNDER);
  }
}

export class MegaRayquaza extends Pokemon {
  constructor() {
    super('academico95', PKM.MEGARAYQUAZA, 'Mega-Rayquaza', [TYPE.DRAGON, TYPE.FLYING], Rarity.MYTHICAL, 'september', 3840, '', 400, 40, 5, 5, 3, 'FIRE/range', AttackType.TRUE, 3, 100, Ability.DRACO_METEOR);
  }
}

export class Meowth extends Pokemon {
  constructor() {
    super('Nintendo', PKM.MEOWTH, 'miaouss', [], Rarity.NEUTRAL, 'february', 52, '', 100, 10, 2, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT);
  }
}

export class Persian extends Pokemon {
  constructor() {
    super('Nintendo', PKM.PERSIAN, 'persian', [], Rarity.NEUTRAL, 'february', 53, '', 100, 10, 2, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT);
  }
}

export class Oddish extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ODDISH, 'mystherbe', [TYPE.POISON, TYPE.GRASS], Rarity.SUMMON, 'september', 43, PKM.GLOOM, 90, 9, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.STUN_SPORE);
  }
}

export class Gloom extends Pokemon {
  constructor() {
    super('Nintendo', PKM.GLOOM, 'ortide', [TYPE.POISON, TYPE.GRASS], Rarity.SUMMON, 'september', 44, PKM.VILEPLUME, 160, 18, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.STUN_SPORE);
  }
}

export class Vileplume extends Pokemon {
  constructor() {
    super('Nintendo', PKM.VILEPLUME, 'rafflesia', [TYPE.POISON, TYPE.GRASS], Rarity.SUMMON, 'september', 45, PKM.BELLOSSOM, 260, 20, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.STUN_SPORE);
  }
}

export class Bellossom extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BELLOSSOM, 'joliflor', [TYPE.POISON, TYPE.GRASS], Rarity.SUMMON, 'september', 182, '', 360, 27, 5, 5, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.STUN_SPORE);
  }
}

export class Amaura extends Pokemon {
  constructor() {
    super('PMDCollab', PKM.AMAURA, 'amaura', [TYPE.FOSSIL, TYPE.ICE], Rarity.EPIC, 'fossil', 698, PKM.AURORUS, 150, 10, 4, 5, 1, 'ROCK/melee', AttackType.SPECIAL, 1, 100, Ability.ICICLE_CRASH);
  }
}

export class Aurorus extends Pokemon {
  constructor() {
    super('PMDCollab', PKM.AURORUS, 'aurorus', [TYPE.FOSSIL, TYPE.ICE], Rarity.EPIC, 'fossil', 699, '', 330, 16, 8, 10, 1, 'ROCK/melee', AttackType.SPECIAL, 2, 100, Ability.ICICLE_CRASH);
  }
}

export class Anorith extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ANORITH, 'anorith', [TYPE.FOSSIL, TYPE.BUG], Rarity.UNCOMMON, 'fossil', 347, PKM.ARMALDO, 70, 10, 3, 1, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.ROCK_SMASH);
  }
}

export class Armaldo extends Pokemon {
  constructor() {
    super('Nintendo', PKM.ARMALDO, 'armaldo', [TYPE.FOSSIL, TYPE.BUG], Rarity.UNCOMMON, 'fossil', 348, '', 160, 16, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SMASH);
  }
}

export class Archen extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.ARCHEN, 'aéroptéri', [TYPE.FOSSIL, TYPE.FLYING], Rarity.RARE, 'fossil', 566, PKM.ARCHEOPS, 100, 12, 2, 1, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.ROCK_SMASH);
  }
}

export class Archeops extends Pokemon {
  constructor() {
    super('Tuxiie', PKM.ARCHEOPS, 'aéroptéryx', [TYPE.FOSSIL, TYPE.FLYING], Rarity.RARE, 'fossil', 567, '', 180, 20, 3, 2, 2, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SMASH);
  }
}

export class Shieldon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.SHIELDON, 'dinoclier', [TYPE.FOSSIL, TYPE.METAL], Rarity.RARE, 'fossil', 410, PKM.BASTIODON, 120, 7, 3, 5, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.IRON_DEFENSE);
  }
}

export class Bastiodon extends Pokemon {
  constructor() {
    super('Nintendo', PKM.BASTIODON, 'bastiodon', [TYPE.FOSSIL, TYPE.METAL], Rarity.RARE, 'fossil', 411, '', 240, 14, 7, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_DEFENSE);
  }
}

export class Tirtouga extends Pokemon {
  constructor() {
    super('Tuxiie', PKM.TIRTOUGA, 'tirtouga', [TYPE.FOSSIL, TYPE.WATER], Rarity.RARE, 'fossil', 564, PKM.CARRACOSTA, 120, 7, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.ROCK_TOMB);
  }
}

export class Carracosta extends Pokemon {
  constructor() {
    super('PowerCrystal', PKM.CARRACOSTA, 'carracosta', [TYPE.FOSSIL, TYPE.WATER], Rarity.RARE, 'fossil', 565, '', 240, 14, 7, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_TOMB);
  }
}

export class Lileep extends Pokemon {
  constructor() {
    super('Nintendo', PKM.LILEEP, 'lilia', [TYPE.FOSSIL, TYPE.GRASS], Rarity.UNCOMMON, 'fossil', 345, PKM.CRADILY, 60, 8, 2, 2, 2, 'ROCK/melee', AttackType.SPECIAL, 1, 100, Ability.HEAL_BLOCK);
  }
}

export class Cradily extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CRADILY, 'vacylis', [TYPE.FOSSIL, TYPE.GRASS], Rarity.UNCOMMON, 'fossil', 346, '', 140, 14, 4, 4, 2, 'ROCK/melee', AttackType.SPECIAL, 2, 100, Ability.HEAL_BLOCK);
  }
}

export class Cranidos extends Pokemon {
  constructor() {
    super('Nintendo', PKM.CRANIDOS, 'kranidos', [TYPE.FOSSIL, TYPE.MONSTER], Rarity.RARE, 'fossil', 408, PKM.RAMPARDOS, 100, 10, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.HEAD_SMASH);
  }
}

export class Rampardos extends Pokemon {
  constructor() {
    super('Nintendo', PKM.RAMPARDOS, 'charkos', [TYPE.FOSSIL, TYPE.MONSTER], Rarity.RARE, 'fossil', 409, '', 200, 19, 6, 3, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAD_SMASH);
  }
}

export class Kabuto extends Pokemon {
  constructor() {
    super('Nintendo', PKM.KABUTO, 'kabuto', [TYPE.FOSSIL, TYPE.WATER], Rarity.UNCOMMON, 'fossil', 140, PKM.KABUTOPS, 70, 10, 3, 1, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.HEAL_BLOCK);
  }
}

export class Kabutops extends Pokemon {
  constructor() {
    super('Nintendo', PKM.KABUTOPS, 'kabutops', [TYPE.FOSSIL, TYPE.WATER], Rarity.UNCOMMON, 'fossil', 141, '', 160, 16, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAL_BLOCK);
  }
}

export class Omanyte extends Pokemon {
  constructor() {
    super('Nintendo', PKM.OMANYTE, 'omanyte', [TYPE.FOSSIL, TYPE.WATER], Rarity.UNCOMMON, 'fossil', 138, PKM.OMASTAR, 60, 8, 1, 3, 2, 'ROCK/melee', AttackType.SPECIAL, 1, 100, Ability.ROCK_TOMB);
  }
}

export class Omastar extends Pokemon {
  constructor() {
    super('Nintendo', PKM.OMASTAR, 'omastar', [TYPE.FOSSIL, TYPE.WATER], Rarity.UNCOMMON, 'fossil', 139, '', 140, 14, 2, 4, 2, 'ROCK/melee', AttackType.SPECIAL, 2, 100, Ability.ROCK_TOMB);
  }
}

export class Tyrunt extends Pokemon {
  constructor() {
    super('NeroIntruder', PKM.TYRUNT, 'ptyranidur', [TYPE.FOSSIL, TYPE.DRAGON], Rarity.EPIC, 'fossil', 696, PKM.TYRANTRUM, 135, 10, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.HEAD_SMASH);
  }
}

export class Tyrantrum extends Pokemon {
  constructor() {
    super('NeroIntruder', PKM.TYRANTRUM, 'rexilius', [TYPE.FOSSIL, TYPE.DRAGON], Rarity.EPIC, 'fossil', 697, '', 290, 22, 7, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAD_SMASH);
  }
}

export class Aerodactyl extends Pokemon {
  constructor() {
    super('Nintendo', PKM.AERODACTYL, 'ptéra', [TYPE.FOSSIL, TYPE.FLYING], Rarity.EPIC, 'february', 142, '', 270, 17, 6, 3, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE);
  }
}