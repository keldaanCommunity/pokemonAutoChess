/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import {Schema, type, ArraySchema, SetSchema} from '@colyseus/schema';
import uniqid from 'uniqid';
import { Emotion, IPokemon } from '../../types';
import {COST, ITEM} from '../enum';
import {Pkm} from '../../types/enum/Pokemon';
import { Rarity, AttackType } from '../../types/enum/Game';
import { Ability } from '../../types/enum/Ability';
import { Synergy } from '../../types/enum/Synergy';
import ItemFactory from '../item-factory';

export class Pokemon extends Schema implements IPokemon{
  @type('string') id: string;
  @type('string') name: string;
  @type(['string']) types = new ArraySchema<Synergy>();
  @type('string') rarity: Rarity;

  @type('string') index: string;
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
  @type('string') skill: Ability;
  @type({set: 'string'}) items = new SetSchema<string>();
  @type('boolean') shiny: boolean;
  @type('string') emotion: Emotion;
  fossilTimer: number;

  constructor(
     name: string,
      types: Synergy[],
      rarity: Rarity,
      index: string,
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
      skill: Ability,
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

    if (this.types.includes(Synergy.FOSSIL) && this.evolution != '') {
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
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DITTO, [Synergy.NORMAL], Rarity.LEGENDARY, '0132', '', 30, 1, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Electrike extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ELECTRIKE, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.LEGENDARY, '0309', Pkm.MANECTRIC, 110, 5, 5, 5, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 1, 60, Ability.VOLT_SWITCH,shiny, emotion);
  }
}

export class Manectric extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MANECTRIC, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.LEGENDARY, '0310', Pkm.MEGA_MANECTRIC, 150, 11, 6, 6, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 2, 60, Ability.VOLT_SWITCH,shiny, emotion);
  }
}

export class MegaManectric extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_MANECTRIC, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.LEGENDARY, '0310-0001', '', 300, 17, 7, 7, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 3, 60, Ability.VOLT_SWITCH,shiny, emotion);
  }
}

export class Shuppet extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SHUPPET, [Synergy.DARK, Synergy.GHOST], Rarity.LEGENDARY, '0353', Pkm.BANETTE, 100, 5, 3, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 140, Ability.SHADOW_CLONE,shiny, emotion);
  }
}

export class Banette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BANETTE, [Synergy.DARK, Synergy.GHOST], Rarity.LEGENDARY, '0354', Pkm.MEGA_BANETTE, 140, 11, 4, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 140, Ability.SHADOW_CLONE,shiny, emotion);
  }
}

export class MegaBanette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_BANETTE, [Synergy.DARK, Synergy.GHOST], Rarity.LEGENDARY, '0354-0001', '', 240, 21, 5, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 140, Ability.SHADOW_CLONE,shiny, emotion);
  }
}

export class Riolu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RIOLU, [Synergy.FIGHTING, Synergy.HUMAN], Rarity.LEGENDARY, '0447', Pkm.LUCARIO, 90, 5, 3, 3, 2, 'FIGHTING/range', AttackType.SPECIAL, 1, 100, Ability.SILENCE,shiny, emotion);
  }
}

export class Lucario extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LUCARIO, [Synergy.FIGHTING, Synergy.HUMAN, Synergy.METAL], Rarity.LEGENDARY, '0448', Pkm.MEGA_LUCARIO, 130, 11, 3, 3, 2, 'FIGHTING/range', AttackType.SPECIAL, 2, 100, Ability.SILENCE,shiny, emotion);
  }
}

export class MegaLucario extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_LUCARIO, [Synergy.FIGHTING, Synergy.HUMAN, Synergy.METAL], Rarity.LEGENDARY, '0448-0001', '', 230, 21, 3, 3, 2, 'FIGHTING/range', AttackType.SPECIAL, 3, 100, Ability.SILENCE,shiny, emotion);
  }
}

export class Swablu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SWABLU, [Synergy.FAIRY, Synergy.DRAGON, Synergy.SOUND], Rarity.LEGENDARY, '0333', Pkm.ALTARIA, 90, 5, 3, 3, 2, 'DRAGON/range', AttackType.SPECIAL, 1, 110, Ability.HYPER_VOICE,shiny, emotion);
  }
}

export class Altaria extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ALTARIA, [Synergy.FAIRY, Synergy.DRAGON, Synergy.SOUND], Rarity.LEGENDARY, '0334', Pkm.MEGA_ALTARIA, 130, 11, 4, 4, 2, 'DRAGON/range', AttackType.SPECIAL, 2, 110, Ability.HYPER_VOICE,shiny, emotion);
  }
}

export class MegaAltaria extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_ALTARIA, [Synergy.FAIRY, Synergy.DRAGON, Synergy.SOUND], Rarity.LEGENDARY, '0334-0001', '', 230, 21, 5, 5, 2, 'DRAGON/range', AttackType.SPECIAL, 3, 110, Ability.HYPER_VOICE,shiny, emotion);
  }
}

export class Scyther extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SCYTHER, [Synergy.BUG, Synergy.FLYING], Rarity.LEGENDARY, '0123', Pkm.SCIZOR, 90, 5, 5, 5, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.KING_SHIELD,shiny, emotion);
  }
}

export class Scizor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SCIZOR, [Synergy.BUG, Synergy.FLYING, Synergy.METAL], Rarity.LEGENDARY, '0212', Pkm.MEGA_SCIZOR, 130, 9, 6, 6, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.KING_SHIELD,shiny, emotion);
  }
}

export class MegaScizor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_SCIZOR, [Synergy.BUG, Synergy.FLYING, Synergy.METAL], Rarity.LEGENDARY, '0212-0001', '', 230, 20, 7, 7, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 100, Ability.KING_SHIELD,shiny, emotion);
  }
}

export class Buneary extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BUNEARY, [Synergy.NORMAL, Synergy.FIGHTING], Rarity.LEGENDARY, '0427', Pkm.LOPUNNY, 110, 5, 5, 5, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 1, 60, Ability.HIGH_JUMP_KICK,shiny, emotion);
  }
}

export class Lopunny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LOPUNNY, [Synergy.NORMAL, Synergy.FIGHTING], Rarity.LEGENDARY, '0428', Pkm.MEGA_LOPUNNY, 150, 9, 6, 6, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 2, 60, Ability.HIGH_JUMP_KICK,shiny, emotion);
  }
}

export class MegaLopunny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_LOPUNNY, [Synergy.NORMAL, Synergy.FIGHTING], Rarity.LEGENDARY, '0428-0001', '', 250, 25, 7, 7, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 3, 60, Ability.HIGH_JUMP_KICK,shiny, emotion);
  }
}

export class Onix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ONIX, [Synergy.MINERAL, Synergy.GROUND, Synergy.METAL], Rarity.LEGENDARY, '0095', Pkm.STEELIX, 150, 5, 7, 7, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.IRON_DEFENSE,shiny, emotion);
  }
}

export class Steelix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.STEELIX, [Synergy.MINERAL, Synergy.GROUND, Synergy.METAL], Rarity.LEGENDARY, '0208', Pkm.MEGA_STEELIX, 300, 9, 10, 10, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_DEFENSE,shiny, emotion);
  }
}

export class MegaSteelix extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_STEELIX, [Synergy.MINERAL, Synergy.GROUND, Synergy.METAL], Rarity.LEGENDARY, '0208-0001', '', 400, 20, 20, 20, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.IRON_DEFENSE,shiny, emotion);
  }
}

export class Growlithe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GROWLITHE, [], Rarity.LEGENDARY, '0058', Pkm.ARCANINE, 90, 9, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Arcanine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ARCANINE, [], Rarity.LEGENDARY, '0059', '', 130, 20, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Numel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.NUMEL, [Synergy.FIRE, Synergy.FIELD, Synergy.GROUND], Rarity.LEGENDARY, '0322', Pkm.CAMERUPT, 90, 5, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BURN,shiny, emotion);
  }
}

export class Camerupt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CAMERUPT, [Synergy.FIRE, Synergy.FIELD, Synergy.GROUND], Rarity.LEGENDARY, '0323', Pkm.MEGA_CAMERUPT, 150, 9, 10, 10, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.BURN,shiny, emotion);
  }
}

export class MegaCamerupt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_CAMERUPT, [Synergy.FIRE, Synergy.FIELD, Synergy.GROUND], Rarity.LEGENDARY, '0323-0001', '', 230, 20, 15, 15, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.BURN,shiny, emotion);
  }
}

export class Munchlax extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MUNCHLAX, [], Rarity.LEGENDARY, '0446', Pkm.SNORLAX, 90, 9, 5, 5, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Snorlax extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SNORLAX, [], Rarity.LEGENDARY, '0143', '', 130, 20, 5, 5, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Meditite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEDITITE, [Synergy.PSYCHIC, Synergy.HUMAN, Synergy.FIGHTING], Rarity.LEGENDARY, '0307', Pkm.MEDICHAM, 90, 5, 5, 5, 2, 'PSYCHIC/range', AttackType.SPECIAL, 1, 100, Ability.CONFUSION,shiny, emotion);
  }
}

export class Medicham extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEDICHAM, [Synergy.PSYCHIC, Synergy.HUMAN, Synergy.FIGHTING], Rarity.LEGENDARY, '0308', Pkm.MEGA_MEDICHAM, 130, 9, 6, 6, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.CONFUSION,shiny, emotion);
  }
}

export class MegaMedicham extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_MEDICHAM, [Synergy.PSYCHIC, Synergy.HUMAN, Synergy.FIGHTING], Rarity.LEGENDARY, '0308-0001', '', 230, 20, 7, 7, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 100, Ability.CONFUSION,shiny, emotion);
  }
}

export class Elekid extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ELEKID, [Synergy.ELECTRIC, Synergy.HUMAN], Rarity.EPIC, '0239', Pkm.ELECTABUZZ, 90, 5, 4, 4, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 1, 100, Ability.DISCHARGE,shiny, emotion);
  }
}

export class Electabuzz extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ELECTABUZZ, [Synergy.ELECTRIC, Synergy.HUMAN], Rarity.EPIC, '0125', Pkm.ELECTIVIRE, 130, 9, 5, 5, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 2, 100, Ability.DISCHARGE,shiny, emotion);
  }
}

export class Electivire extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ELECTIVIRE, [Synergy.ELECTRIC, Synergy.HUMAN], Rarity.EPIC, '0466', '', 230, 20, 6, 6, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 3, 100, Ability.DISCHARGE,shiny, emotion);
  }
}

export class Gible extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GIBLE, [Synergy.DRAGON, Synergy.GROUND, Synergy.MONSTER], Rarity.EPIC, '0443', Pkm.GABITE, 90, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.DRAGON_TAIL,shiny, emotion);
  }
}

export class Gabite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GABITE, [Synergy.DRAGON, Synergy.GROUND, Synergy.MONSTER], Rarity.EPIC, '0444', Pkm.GARCHOMP, 130, 9, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.DRAGON_TAIL,shiny, emotion);
  }
}

export class Garchomp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GARCHOMP, [Synergy.DRAGON, Synergy.GROUND, Synergy.MONSTER], Rarity.EPIC, '0445', '', 230, 20, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.DRAGON_TAIL,shiny, emotion);
  }
}

export class Beldum extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BELDUM, [Synergy.PSYCHIC, Synergy.METAL, Synergy.MINERAL], Rarity.EPIC, '0374', Pkm.METANG, 90, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.METEOR_MASH,shiny, emotion);
  }
}

export class Metang extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.METANG, [Synergy.PSYCHIC, Synergy.METAL, Synergy.MINERAL], Rarity.EPIC, '0375', Pkm.METAGROSS, 130, 9, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.METEOR_MASH,shiny, emotion);
  }
}

export class Metagross extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.METAGROSS, [Synergy.PSYCHIC, Synergy.METAL, Synergy.MINERAL], Rarity.EPIC, '0376', '', 230, 20, 8, 8, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.METEOR_MASH,shiny, emotion);
  }
}

export class Tympole extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TYMPOLE, [Synergy.WATER, Synergy.GROUND, Synergy.SOUND], Rarity.EPIC, '0535', Pkm.PALPITOAD, 90, 5, 4, 4, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 90, Ability.EXPLOSION,shiny, emotion);
  }
}

export class Palpitoad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PALPITOAD, [Synergy.WATER, Synergy.GROUND, Synergy.SOUND], Rarity.EPIC, '0536', Pkm.SEISMITOAD, 130, 9, 5, 5, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 90, Ability.EXPLOSION,shiny, emotion);
  }
}

export class Seismitoad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SEISMITOAD, [Synergy.WATER, Synergy.GROUND, Synergy.SOUND], Rarity.EPIC, '0537', '', 230, 20, 6, 6, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 90, Ability.EXPLOSION,shiny, emotion);
  }
}

export class Bagon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BAGON, [Synergy.DRAGON, Synergy.MONSTER], Rarity.EPIC, '0371', Pkm.SHELGON, 90, 5, 3, 3, 1, 'DRAGON/melee', AttackType.SPECIAL, 1, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Shelgon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SHELGON, [Synergy.DRAGON, Synergy.MONSTER], Rarity.EPIC, '0372', Pkm.SALAMENCE, 130, 9, 3, 3, 1, 'DRAGON/melee', AttackType.SPECIAL, 2, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Salamence extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SALAMENCE, [Synergy.DRAGON, Synergy.MONSTER, Synergy.FLYING], Rarity.EPIC, '0373', '', 230, 18, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 3, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Ralts extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RALTS, [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.HUMAN], Rarity.EPIC, '0280', Pkm.KIRLIA, 90, 5, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 1, 100, Ability.CALM_MIND,shiny, emotion);
  }
}

export class Kirlia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KIRLIA, [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.HUMAN], Rarity.EPIC, '0281', Pkm.GARDEVOIR, 130, 9, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND,shiny, emotion);
  }
}

export class Gardevoir extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GARDEVOIR, [Synergy.PSYCHIC, Synergy.FAIRY, Synergy.HUMAN], Rarity.EPIC, '0282', '', 230, 18, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 3, 100, Ability.CALM_MIND,shiny, emotion);
  }
}

export class Budew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BUDEW, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.EPIC, '0406', Pkm.ROSELIA, 90, 5, 1, 1, 3, 'GRASS/range', AttackType.SPECIAL, 1, 100, Ability.PETAL_DANCE,shiny, emotion);
  }
}

export class Roselia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ROSELIA, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.EPIC, '0315', Pkm.ROSERADE, 130, 9, 1, 1, 3, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.PETAL_DANCE,shiny, emotion);
  }
}

export class Roserade extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ROSERADE, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.EPIC, '0407', '', 230, 18, 1, 1, 3, 'GRASS/range', AttackType.SPECIAL, 3, 100, Ability.PETAL_DANCE,shiny, emotion);
  }
}

export class Slakoth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SLAKOTH, [Synergy.NORMAL, Synergy.FIELD], Rarity.EPIC, '0287', Pkm.VIGOROTH, 90, 5, 4, 4, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Vigoroth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VIGOROTH, [Synergy.NORMAL, Synergy.FIELD], Rarity.EPIC, '0288', Pkm.SLAKING, 130, 9, 4, 4, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Slaking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SLAKING, [Synergy.NORMAL, Synergy.FIELD], Rarity.EPIC, '0289', '', 230, 20, 4, 4, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 100, Ability.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Honedge extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HONEDGE, [Synergy.GHOST, Synergy.METAL], Rarity.EPIC, '0679', Pkm.DOUBLADE, 90, 8, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.KING_SHIELD,shiny, emotion);
  }
}

export class Doublade extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DOUBLADE, [Synergy.GHOST, Synergy.METAL], Rarity.EPIC, '0680', Pkm.AEGISLASH, 130, 9, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.KING_SHIELD,shiny, emotion);
  }
}

export class Aegislash extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AEGISLASH, [Synergy.GHOST, Synergy.METAL], Rarity.EPIC, '0681', '', 230, 20, 8, 8, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.KING_SHIELD,shiny, emotion);
  }
}

export class Larvitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LARVITAR, [Synergy.DARK, Synergy.MONSTER, Synergy.MINERAL], Rarity.EPIC, '0246', Pkm.PUPITAR, 90, 8, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.BITE,shiny, emotion);
  }
}

export class Pupitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PUPITAR, [Synergy.DARK, Synergy.MONSTER, Synergy.MINERAL], Rarity.EPIC, '0247', Pkm.TYRANITAR, 130, 9, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.BITE,shiny, emotion);
  }
}

export class Tyranitar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TYRANITAR, [Synergy.DARK, Synergy.MONSTER, Synergy.MINERAL], Rarity.EPIC, '0248', '', 230, 20, 8, 8, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.BITE,shiny, emotion);
  }
}

export class JangmoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.JANGMO_O, [Synergy.DRAGON, Synergy.FIGHTING, Synergy.SOUND], Rarity.EPIC, '0782', Pkm.HAKAMO_O, 90, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 110, Ability.CLANGOROUS_SOUL,shiny, emotion);
  }
}

export class HakamoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HAKAMO_O, [Synergy.DRAGON, Synergy.FIGHTING, Synergy.SOUND], Rarity.EPIC, '0783', Pkm.KOMMO_O, 130, 9, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 110, Ability.CLANGOROUS_SOUL,shiny, emotion);
  }
}

export class KommoO extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KOMMO_O, [Synergy.DRAGON, Synergy.FIGHTING, Synergy.SOUND], Rarity.EPIC, '0784', '', 230, 20, 8, 8, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 110, Ability.CLANGOROUS_SOUL,shiny, emotion);
  }
}

export class Gastly extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GASTLY, [Synergy.MONSTER, Synergy.POISON, Synergy.GHOST], Rarity.LEGENDARY, '0092', Pkm.HAUNTER, 90, 8, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 1, 120, Ability.NIGHTMARE,shiny, emotion);
  }
}

export class Haunter extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HAUNTER, [Synergy.MONSTER, Synergy.POISON, Synergy.GHOST], Rarity.LEGENDARY, '0093', Pkm.GENGAR, 130, 12, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 2, 120, Ability.NIGHTMARE,shiny, emotion);
  }
}

export class Gengar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GENGAR, [Synergy.MONSTER, Synergy.POISON, Synergy.GHOST], Rarity.LEGENDARY, '0094', '', 230, 25, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 3, 120, Ability.NIGHTMARE,shiny, emotion);
  }
}

export class Abra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ABRA, [Synergy.PSYCHIC, Synergy.HUMAN], Rarity.EPIC, '0063', Pkm.KADABRA, 90, 5, 1, 1, 4, 'PSYCHIC/range', AttackType.SPECIAL, 1, 50, Ability.TELEPORT,shiny, emotion);
  }
}

export class Kadabra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KADABRA, [Synergy.PSYCHIC, Synergy.HUMAN], Rarity.EPIC, '0064', Pkm.ALAKAZAM, 130, 9, 1, 1, 4, 'PSYCHIC/range', AttackType.SPECIAL, 2, 50, Ability.TELEPORT,shiny, emotion);
  }
}

export class Alakazam extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ALAKAZAM, [Synergy.PSYCHIC, Synergy.HUMAN], Rarity.EPIC, '0065', '', 230, 18, 1, 1, 4, 'PSYCHIC/range', AttackType.SPECIAL, 3, 50, Ability.TELEPORT,shiny, emotion);
  }
}

export class Litwick extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LITWICK, [Synergy.FIRE, Synergy.GHOST], Rarity.EPIC, '0607', Pkm.LAMPENT, 90, 5, 1, 1, 3, 'GHOST/range', AttackType.SPECIAL, 1, 100, Ability.FIRE_BLAST,shiny, emotion);
  }
}

export class Lampent extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LAMPENT, [Synergy.FIRE, Synergy.GHOST], Rarity.EPIC, '0608', Pkm.CHANDELURE, 130, 9, 1, 1, 3, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.FIRE_BLAST,shiny, emotion);
  }
}

export class Chandelure extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CHANDELURE, [Synergy.FIRE, Synergy.GHOST], Rarity.EPIC, '0609', '', 230, 18, 1, 1, 3, 'GHOST/range', AttackType.SPECIAL, 3, 100, Ability.FIRE_BLAST,shiny, emotion);
  }
}

export class Porygon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PORYGON, [Synergy.NORMAL, Synergy.PSYCHIC], Rarity.EPIC, '0137', Pkm.PORYGON_2, 90, 5, 1, 1, 2, 'FIGHTING/range', AttackType.SPECIAL, 1, 90, Ability.TRI_ATTACK,shiny, emotion);
  }
}

export class Porygon2 extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PORYGON_2, [Synergy.NORMAL, Synergy.PSYCHIC], Rarity.EPIC, '0233', Pkm.PORYGON_Z, 130, 9, 1, 1, 2, 'FIGHTING/range', AttackType.SPECIAL, 2, 90, Ability.TRI_ATTACK,shiny, emotion);
  }
}

export class PorygonZ extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PORYGON_Z, [Synergy.NORMAL, Synergy.PSYCHIC], Rarity.EPIC, '0474', '', 230, 18, 1, 1, 2, 'FIGHTING/range', AttackType.SPECIAL, 3, 90, Ability.TRI_ATTACK,shiny, emotion);
  }
}

export class Sewaddle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SEWADDLE, [Synergy.GRASS, Synergy.BUG, Synergy.SOUND], Rarity.EPIC, '0540', Pkm.SWADLOON, 80, 5, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 80, Ability.GRASS_WHISTLE,shiny, emotion);
  }
}

export class Swadloon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SWADLOON, [Synergy.GRASS, Synergy.BUG, Synergy.SOUND], Rarity.EPIC, '0541', Pkm.LEAVANNY, 120, 9, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 80, Ability.GRASS_WHISTLE,shiny, emotion);
  }
}

export class Leavanny extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LEAVANNY, [Synergy.GRASS, Synergy.BUG, Synergy.SOUND], Rarity.EPIC, '0542', '', 220, 20, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 80, Ability.GRASS_WHISTLE,shiny, emotion);
  }
}

export class Turtwig extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TURTWIG, [Synergy.GRASS, Synergy.GROUND, Synergy.FLORA], Rarity.RARE, '0387', Pkm.GROTLE, 80, 5, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Grotle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GROTLE, [Synergy.GRASS, Synergy.GROUND, Synergy.FLORA], Rarity.RARE, '0388', Pkm.TORTERRA, 120, 9, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Torterra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TORTERRA, [Synergy.GRASS, Synergy.GROUND, Synergy.FLORA], Rarity.RARE, '0389', '', 220, 20, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Deino extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DEINO, [Synergy.DARK, Synergy.DRAGON], Rarity.RARE, '0633', Pkm.ZWEILOUS, 80, 5, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Zweilous extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ZWEILOUS, [Synergy.DARK, Synergy.DRAGON], Rarity.RARE, '0634', Pkm.HYDREIGON, 120, 9, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Hydreigon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HYDREIGON, [Synergy.DARK, Synergy.DRAGON], Rarity.RARE, '0635', '', 220, 18, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 3, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Poliwag extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.POLIWAG, [Synergy.WATER, Synergy.FIGHTING], Rarity.RARE, '0060', Pkm.POLIWHIRL, 80, 5, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 1, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Poliwhirl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.POLIWHIRL, [Synergy.WATER, Synergy.FIGHTING], Rarity.RARE, '0061', Pkm.POLITOED, 120, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Politoed extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.POLITOED, [Synergy.WATER, Synergy.FIGHTING], Rarity.RARE, '0186', '', 220, 18, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 3, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Magby extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAGBY, [Synergy.FIRE, Synergy.HUMAN], Rarity.RARE, '0240', Pkm.MAGMAR, 80, 5, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.HEAT_WAVE,shiny, emotion);
  }
}

export class Magmar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAGMAR, [Synergy.FIRE, Synergy.HUMAN], Rarity.RARE, '0126', Pkm.MAGMORTAR, 120, 9, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.HEAT_WAVE,shiny, emotion);
  }
}

export class Magmortar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAGMORTAR, [Synergy.FIRE, Synergy.HUMAN], Rarity.RARE, '0467', '', 220, 18, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 3, 100, Ability.HEAT_WAVE,shiny, emotion);
  }
}

export class Solosis extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SOLOSIS, [Synergy.PSYCHIC, Synergy.GHOST], Rarity.RARE, '0577', Pkm.DUOSION, 80, 5, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 1, 100, Ability.LEECH_LIFE,shiny, emotion);
  }
}

export class Duosion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DUOSION, [Synergy.PSYCHIC, Synergy.GHOST], Rarity.RARE, '0578', Pkm.REUNICLUS, 120, 9, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.LEECH_LIFE,shiny, emotion);
  }
}

export class Reuniclus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.REUNICLUS, [Synergy.PSYCHIC, Synergy.GHOST], Rarity.RARE, '0579', '', 220, 18, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 3, 100, Ability.LEECH_LIFE,shiny, emotion);
  }
}

export class Shinx extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SHINX, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.RARE, '0403', Pkm.LUXIO, 80, 5, 4, 4, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 1, 100, Ability.DISCHARGE,shiny, emotion);
  }
}

export class Luxio extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LUXIO, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.RARE, '0404', Pkm.LUXRAY, 120, 9, 5, 5, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 2, 100, Ability.DISCHARGE,shiny, emotion);
  }
}

export class Luxray extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LUXRAY, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.RARE, '0405', '', 220, 20, 6, 6, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 3, 100, Ability.DISCHARGE,shiny, emotion);
  }
}

export class Cubone extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CUBONE, [Synergy.GROUND, Synergy.MINERAL], Rarity.EPIC, '0104', Pkm.MAROWAK, 80, 5, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 60, Ability.BONEMERANG,shiny, emotion);
  }
}

export class Marowak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAROWAK, [Synergy.GROUND, Synergy.MINERAL], Rarity.EPIC, '0105', Pkm.ALOLAN_MAROWAK, 120, 9, 5, 5, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 60, Ability.BONEMERANG,shiny, emotion);
  }
}

export class AlolanMarowak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ALOLAN_MAROWAK, [Synergy.GROUND, Synergy.MINERAL, Synergy.FIRE, Synergy.GHOST], Rarity.EPIC, '0105/0001', '', 220, 20, 6, 6, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 60, Ability.BONEMERANG,shiny, emotion);
  }
}

export class Axew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AXEW, [Synergy.DRAGON, Synergy.MONSTER], Rarity.RARE, '0610', Pkm.FRAXURE, 80, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.HEAD_SMASH,shiny, emotion);
  }
}

export class Fraxure extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FRAXURE, [Synergy.DRAGON, Synergy.MONSTER], Rarity.RARE, '0611', Pkm.HAXORUS, 120, 9, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAD_SMASH,shiny, emotion);
  }
}

export class Haxorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HAXORUS, [Synergy.DRAGON, Synergy.MONSTER], Rarity.RARE, '0612', '', 220, 20, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.HEAD_SMASH,shiny, emotion);
  }
}

export class Dratini extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DRATINI, [Synergy.DRAGON, Synergy.AQUATIC], Rarity.RARE, '0147', Pkm.DRAGONAIR, 80, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.DRAGON_BREATH,shiny, emotion);
  }
}

export class Dragonair extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DRAGONAIR, [Synergy.DRAGON, Synergy.AQUATIC], Rarity.RARE, '0148', Pkm.DRAGONITE, 120, 9, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.DRAGON_BREATH,shiny, emotion);
  }
}

export class Dragonite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DRAGONITE, [Synergy.DRAGON, Synergy.AQUATIC, Synergy.FLYING], Rarity.RARE, '0149', '', 220, 20, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.DRAGON_BREATH,shiny, emotion);
  }
}

export class Lotad extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LOTAD, [Synergy.GRASS, Synergy.WATER], Rarity.RARE, '0270', Pkm.LOMBRE, 80, 5, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 1, 100, Ability.TORMENT,shiny, emotion);
  }
}

export class Lombre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LOMBRE, [Synergy.GRASS, Synergy.WATER], Rarity.RARE, '0271', Pkm.LUDICOLO, 120, 9, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.TORMENT,shiny, emotion);
  }
}

export class Ludicolo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LUDICOLO, [Synergy.GRASS, Synergy.WATER], Rarity.RARE, '0272', '', 220, 18, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 3, 100, Ability.TORMENT,shiny, emotion);
  }
}

export class Togepi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TOGEPI, [Synergy.NORMAL, Synergy.FAIRY], Rarity.RARE, '0175', Pkm.TOGETIC, 80, 5, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 1, 70, Ability.WISH,shiny, emotion);
  }
}

export class Togetic extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TOGETIC, [Synergy.NORMAL, Synergy.FAIRY, Synergy.FLYING], Rarity.RARE, '0176', Pkm.TOGEKISS, 120, 9, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 2, 70, Ability.WISH,shiny, emotion);
  }
}

export class Togekiss extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TOGEKISS, [Synergy.NORMAL, Synergy.FAIRY, Synergy.FLYING], Rarity.RARE, '0468', '', 220, 18, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 3, 70, Ability.WISH,shiny, emotion);
  }
}

export class Rhyhorn extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RHYHORN, [Synergy.GROUND, Synergy.MONSTER, Synergy.MINERAL], Rarity.RARE, '0111', Pkm.RHYDON, 80, 5, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Rhydon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RHYDON, [Synergy.GROUND, Synergy.MONSTER, Synergy.MINERAL], Rarity.RARE, '0112', Pkm.RHYPERIOR, 120, 9, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Rhyperior extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RHYPERIOR, [Synergy.GROUND, Synergy.MONSTER, Synergy.MINERAL], Rarity.RARE, '0464', '', 220, 20, 8, 8, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Fletchling extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FLETCHLING, [Synergy.FIRE, Synergy.FLYING], Rarity.RARE, '0661', Pkm.FLETCHINDER, 80, 5, 4, 4, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Fletchinder extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FLETCHINDER, [Synergy.FIRE, Synergy.FLYING], Rarity.RARE, '0662', Pkm.TALONFLAME, 120, 9, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Talonflame extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TALONFLAME, [Synergy.FIRE, Synergy.FLYING], Rarity.RARE, '0663', '', 220, 20, 6, 6, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Aron extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ARON, [Synergy.METAL, Synergy.MONSTER, Synergy.MINERAL], Rarity.RARE, '0304', Pkm.LAIRON, 80, 5, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Lairon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LAIRON, [Synergy.METAL, Synergy.MONSTER, Synergy.MINERAL], Rarity.RARE, '0305', Pkm.AGGRON, 120, 9, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Aggron extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AGGRON, [Synergy.METAL, Synergy.MONSTER, Synergy.MINERAL], Rarity.RARE, '0306', '', 220, 20, 8, 8, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Whismur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.WHISMUR, [Synergy.NORMAL, Synergy.SOUND], Rarity.RARE, '0293', Pkm.LOUDRED, 80, 5, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 1, 90, Ability.ECHO,shiny, emotion);
  }
}
export class Loudred extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LOUDRED, [Synergy.NORMAL, Synergy.SOUND], Rarity.RARE, '0294', Pkm.EXPLOUD, 120, 9, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 90, Ability.ECHO,shiny, emotion);
  }
}

export class Exploud extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.EXPLOUD, [Synergy.NORMAL, Synergy.SOUND], Rarity.RARE, '0295', '', 220, 18, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 3, 90, Ability.ECHO,shiny, emotion);
  }
}

export class Swinub extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SWINUB, [Synergy.GROUND, Synergy.ICE, Synergy.FIELD], Rarity.COMMON, '0220', Pkm.PILOSWINE, 80, 5, 4, 4, 1, 'ICE/melee', AttackType.PHYSICAL, 1, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Piloswine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PILOSWINE, [Synergy.GROUND, Synergy.ICE, Synergy.FIELD], Rarity.COMMON, '0221', Pkm.MAMOSWINE, 120, 9, 4, 4, 1, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Mamoswine extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAMOSWINE, [Synergy.GROUND, Synergy.ICE, Synergy.FIELD], Rarity.COMMON, '0473', '', 220, 20, 6, 6, 1, 'ICE/melee', AttackType.PHYSICAL, 3, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Snover extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SNOVER, [Synergy.GRASS, Synergy.ICE], Rarity.LEGENDARY, '0459', Pkm.ABOMASNOW, 80, 7, 6, 6, 1, 'ICE/melee', AttackType.PHYSICAL, 1, 100, Ability.FREEZE,shiny, emotion);
  }
}

export class Abomasnow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ABOMASNOW, [Synergy.GRASS, Synergy.ICE], Rarity.LEGENDARY, '0460', Pkm.MEGA_ABOMASNOW, 120, 11, 8, 8, 1, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.FREEZE,shiny, emotion);
  }
}

export class MegaAbomasnow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_ABOMASNOW, [Synergy.GRASS, Synergy.ICE], Rarity.LEGENDARY, '0460-0001', '', 220, 25, 10, 10, 1, 'ICE/melee', AttackType.PHYSICAL, 3, 100, Ability.FREEZE,shiny, emotion);
  }
}

export class Snorunt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SNORUNT, [Synergy.GHOST, Synergy.ICE], Rarity.EPIC, '0361', Pkm.GLALIE, 80, 5, 2, 2, 3, 'GHOST/range', AttackType.SPECIAL, 1, 100, Ability.DARK_PULSE,shiny, emotion);
  }
}

export class Glalie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GLALIE, [Synergy.GHOST, Synergy.ICE], Rarity.EPIC, '0362', Pkm.FROSLASS, 120, 9, 2, 2, 3, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.DARK_PULSE,shiny, emotion);
  }
}

export class Froslass extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FROSLASS, [Synergy.GHOST, Synergy.ICE], Rarity.EPIC, '0478', '', 220, 20, 2, 2, 3, 'GHOST/range', AttackType.SPECIAL, 3, 100, Ability.DARK_PULSE,shiny, emotion);
  }
}

export class Vanillite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VANILLITE, [Synergy.FAIRY, Synergy.ICE], Rarity.RARE, '0582', Pkm.VANILLISH, 80, 5, 2, 2, 3, 'FAIRY/range', AttackType.SPECIAL, 1, 100, Ability.SLEEP,shiny, emotion);
  }
}

export class Vanillish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VANILLISH, [Synergy.FAIRY, Synergy.ICE], Rarity.RARE, '0583', Pkm.VANILLUXE, 120, 8, 2, 2, 3, 'FAIRY/range', AttackType.SPECIAL, 2, 100, Ability.SLEEP,shiny, emotion);
  }
}

export class Vanilluxe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VANILLUXE, [Synergy.FAIRY, Synergy.ICE], Rarity.RARE, '0584', '', 220, 19, 2, 2, 3, 'FAIRY/range', AttackType.SPECIAL, 3, 100, Ability.SLEEP,shiny, emotion);
  }
}

export class Trapinch extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TRAPINCH, [Synergy.GROUND, Synergy.BUG], Rarity.RARE, '0328', Pkm.VIBRAVA, 80, 5, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 1, 100, Ability.DRAGON_TAIL,shiny, emotion);
  }
}

export class Vibrava extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VIBRAVA, [Synergy.GROUND, Synergy.DRAGON, Synergy.BUG], Rarity.RARE, '0329', Pkm.FLYGON, 120, 9, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.DRAGON_TAIL,shiny, emotion);
  }
}

export class Flygon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FLYGON, [Synergy.GROUND, Synergy.DRAGON, Synergy.BUG], Rarity.RARE, '0330', '', 220, 20, 4, 4, 1, 'DRAGON/melee', AttackType.PHYSICAL, 3, 100, Ability.DRAGON_TAIL,shiny, emotion);
  }
}

export class Pichu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PICHU, [Synergy.ELECTRIC, Synergy.FAIRY], Rarity.RARE, '0172', Pkm.PIKACHU, 80, 5, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 1, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Pikachu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PIKACHU, [Synergy.ELECTRIC, Synergy.FAIRY], Rarity.RARE, '0025', Pkm.RAICHU, 120, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Raichu extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RAICHU, [Synergy.ELECTRIC, Synergy.FAIRY], Rarity.RARE, '0026', '', 220, 18, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 3, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Bulbasaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BULBASAUR, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.RARE, '0001', Pkm.IVYSAUR, 80, 5, 2, 2, 2, 'GRASS/range', AttackType.SPECIAL, 1, 100, Ability.ROOT,shiny, emotion);
  }
}

export class Ivysaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.IVYSAUR, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.RARE, '0002', Pkm.VENUSAUR, 120, 9, 3, 3, 2, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.ROOT,shiny, emotion);
  }
}

export class Venusaur extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VENUSAUR, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.RARE, '0003', '', 210, 18, 4, 4, 2, 'GRASS/range', AttackType.SPECIAL, 3, 100, Ability.ROOT,shiny, emotion);
  }
}

export class Igglybuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.IGGLYBUFF, [Synergy.FAIRY, Synergy.NORMAL, Synergy.SOUND], Rarity.UNCOMMON, '0174', Pkm.JIGGLYPUFF, 70, 5, 1, 1, 2, 'FAIRY/range', AttackType.SPECIAL, 1, 90, Ability.SLEEP,shiny, emotion);
  }
}

export class Jigglypuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.JIGGLYPUFF, [Synergy.FAIRY, Synergy.NORMAL, Synergy.SOUND], Rarity.UNCOMMON, '0039', Pkm.WIGGLYTUFF, 120, 9, 1, 1, 2, 'FAIRY/range', AttackType.SPECIAL, 2, 90, Ability.SLEEP,shiny, emotion);
  }
}

export class Wigglytuff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.WIGGLYTUFF, [Synergy.FAIRY, Synergy.NORMAL, Synergy.SOUND], Rarity.UNCOMMON, '0040', '', 210, 18, 2, 2, 2, 'FAIRY/range', AttackType.SPECIAL, 3, 90, Ability.SLEEP,shiny, emotion);
  }
}

export class Duskull extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DUSKULL, [Synergy.DARK, Synergy.GHOST], Rarity.UNCOMMON, '0355', Pkm.DUSCLOPS, 70, 5, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 1, 100, Ability.NIGHT_SLASH,shiny, emotion);
  }
}

export class Dusclops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DUSCLOPS, [Synergy.DARK, Synergy.GHOST], Rarity.UNCOMMON, '0356', Pkm.DUSKNOIR, 120, 9, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.NIGHT_SLASH,shiny, emotion);
  }
}

export class Dusknoir extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DUSKNOIR, [Synergy.DARK, Synergy.GHOST], Rarity.UNCOMMON, '0477', '', 210, 18, 1, 1, 2, 'GHOST/range', AttackType.SPECIAL, 3, 100, Ability.NIGHT_SLASH,shiny, emotion);
  }
}

export class Magnemite extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAGNEMITE, [Synergy.ELECTRIC, Synergy.METAL], Rarity.UNCOMMON, '0081', Pkm.MAGNETON, 70, 5, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 1, 100, Ability.CHARGE,shiny, emotion);
  }
}

export class Magneton extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAGNETON, [Synergy.ELECTRIC, Synergy.METAL], Rarity.UNCOMMON, '0082', Pkm.MAGNEZONE, 120, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.CHARGE,shiny, emotion);
  }
}

export class Magnezone extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAGNEZONE, [Synergy.ELECTRIC, Synergy.METAL], Rarity.UNCOMMON, '0462', '', 210, 20, 2, 2, 2, 'ELECTRIC/range', AttackType.SPECIAL, 3, 100, Ability.CHARGE,shiny, emotion);
  }
}

export class Horsea extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HORSEA, [Synergy.WATER, Synergy.DRAGON], Rarity.UNCOMMON, '0116', Pkm.SEADRA, 70, 5, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 1, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Seadra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SEADRA, [Synergy.WATER, Synergy.DRAGON], Rarity.UNCOMMON, '0117', Pkm.KINGDRA, 120, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Kingdra extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KINGDRA, [Synergy.WATER, Synergy.DRAGON], Rarity.UNCOMMON, '0230', '', 210, 20, 2, 2, 2, 'WATER/range', AttackType.SPECIAL, 3, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Flabebe extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FLABEBE, [Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA], Rarity.UNCOMMON, '0669', Pkm.FLOETTE, 70, 5, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 1, 90, Ability.DISARMING_VOICE,shiny, emotion);
  }
}

export class Floette extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FLOETTE, [Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA], Rarity.UNCOMMON, '0670', Pkm.FLORGES, 120, 9, 1, 1, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 90, Ability.DISARMING_VOICE,shiny, emotion);
  }
}
export class Florges extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FLORGES, [Synergy.SOUND, Synergy.FAIRY, Synergy.FLORA], Rarity.UNCOMMON, '0671', '', 210, 20, 2, 2, 3, 'PSYCHIC/range', AttackType.SPECIAL, 3, 90, Ability.DISARMING_VOICE,shiny, emotion);
  }
}

export class Klink extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KLINK, [Synergy.ELECTRIC, Synergy.METAL], Rarity.UNCOMMON, '0599', Pkm.KLANG, 70, 5, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Klang extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KLANG, [Synergy.ELECTRIC, Synergy.METAL], Rarity.UNCOMMON, '0600', Pkm.KLINKLANG, 120, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Klinklang extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KLINKLANG, [Synergy.ELECTRIC, Synergy.METAL], Rarity.UNCOMMON, '0601', '', 210, 20, 2, 2, 2, 'ELECTRIC/range', AttackType.SPECIAL, 3, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Chikorita extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CHIKORITA, [Synergy.GRASS, Synergy.FLORA], Rarity.UNCOMMON, '0152', Pkm.BAYLEEF, 70, 5, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 1, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Bayleef extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BAYLEEF, [Synergy.GRASS, Synergy.FLORA], Rarity.UNCOMMON, '0153', Pkm.MEGANIUM, 120, 9, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Meganium extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGANIUM, [Synergy.GRASS, Synergy.FLORA], Rarity.UNCOMMON, '0154', '', 210, 20, 1, 1, 2, 'GRASS/range', AttackType.SPECIAL, 3, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Sandile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SANDILE, [Synergy.GROUND, Synergy.DARK, Synergy.FIELD], Rarity.UNCOMMON, '0551', Pkm.KROKOROK, 70, 5, 3, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Krookorok extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KROKOROK, [Synergy.GROUND, Synergy.DARK, Synergy.FIELD], Rarity.UNCOMMON, '0552', Pkm.KROOKODILE, 120, 9, 3, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Krookodile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KROOKODILE, [Synergy.GROUND, Synergy.DARK, Synergy.FIELD], Rarity.UNCOMMON, '0553', '', 210, 20, 3, 3, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.STOMP,shiny, emotion);
  }
}

export class Venipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VENIPEDE, [Synergy.BUG, Synergy.POISON], Rarity.UNCOMMON, '0543', Pkm.WHIRLIPEDE, 70, 5, 3, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.POISON_STING,shiny, emotion);
  }
}

export class Whirlipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.WHIRLIPEDE, [Synergy.BUG, Synergy.POISON], Rarity.UNCOMMON, '0544', Pkm.SCOLIPEDE, 120, 9, 3, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.POISON_STING,shiny, emotion);
  }
}

export class Scolipede extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SCOLIPEDE, [Synergy.BUG, Synergy.POISON], Rarity.UNCOMMON, '0545', '', 210, 20, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.POISON_STING,shiny, emotion);
  }
}

export class Spheal extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SPHEAL, [Synergy.AQUATIC, Synergy.ICE], Rarity.UNCOMMON, '0363', Pkm.SEALEO, 70, 5, 3, 2, 1, 'ICE/melee', AttackType.PHYSICAL, 1, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Sealeo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SEALEO, [Synergy.AQUATIC, Synergy.ICE], Rarity.UNCOMMON, '0364', Pkm.WALREIN, 120, 9, 3, 2, 1, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Walrein extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.WALREIN, [Synergy.AQUATIC, Synergy.ICE], Rarity.UNCOMMON, '0365', '', 210, 20, 3, 3, 1, 'ICE/melee', AttackType.PHYSICAL, 3, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Lillipup extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LILLIPUP, [Synergy.NORMAL, Synergy.FIELD], Rarity.UNCOMMON, '0506', Pkm.HERDIER, 70, 5, 3, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Herdier extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HERDIER, [Synergy.NORMAL, Synergy.FIELD], Rarity.UNCOMMON, '0507', Pkm.STOUTLAND, 120, 9, 3, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Stoutland extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.STOUTLAND, [Synergy.NORMAL, Synergy.FIELD], Rarity.UNCOMMON, '0508', '', 210, 20, 3, 3, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class NidoranF extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.NIDORANF, [Synergy.POISON, Synergy.FIELD, Synergy.GROUND], Rarity.RARE, '0029', Pkm.NIDORINA, 70, 5, 3, 3, 1, 'POISON/melee', AttackType.PHYSICAL, 1, 100, Ability.POISON_STING,shiny, emotion);
  }
}

export class Nidorina extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.NIDORINA, [Synergy.POISON, Synergy.FIELD, Synergy.GROUND], Rarity.RARE, '0030', Pkm.NIDOQUEEN, 120, 9, 3, 3, 1, 'POISON/melee', AttackType.PHYSICAL, 2, 100, Ability.POISON_STING,shiny, emotion);
  }
}

export class Nidoqueen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.NIDOQUEEN, [Synergy.POISON, Synergy.FIELD, Synergy.GROUND], Rarity.RARE, '0031', '', 210, 20, 5, 5, 1, 'POISON/melee', AttackType.PHYSICAL, 3, 100, Ability.POISON_STING,shiny, emotion);
  }
}

export class NidoranM extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.NIDORANM, [Synergy.POISON, Synergy.FIELD, Synergy.GROUND], Rarity.RARE, '0032', Pkm.NIDORINO, 70, 5, 3, 3, 1, 'POISON/melee', AttackType.PHYSICAL, 1, 100, Ability.POISON,shiny, emotion);
  }
}

export class Nidorino extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.NIDORINO, [Synergy.POISON, Synergy.FIELD, Synergy.GROUND], Rarity.RARE, '0033', Pkm.NIDOKING, 120, 9, 3, 3, 1, 'POISON/melee', AttackType.PHYSICAL, 2, 100, Ability.POISON,shiny, emotion);
  }
}

export class Nidoking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.NIDOKING, [Synergy.POISON, Synergy.FIELD, Synergy.GROUND], Rarity.RARE, '0034', '', 210, 20, 5, 5, 1, 'POISON/melee', AttackType.PHYSICAL, 3, 100, Ability.POISON,shiny, emotion);
  }
}

export class Machop extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MACHOP, [Synergy.FIGHTING, Synergy.HUMAN], Rarity.UNCOMMON, '0066', Pkm.MACHOKE, 70, 5, 3, 3, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 1, 100, Ability.GUILLOTINE,shiny, emotion);
  }
}

export class Machoke extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MACHOKE, [Synergy.FIGHTING, Synergy.HUMAN], Rarity.UNCOMMON, '0067', Pkm.MACHAMP, 120, 9, 3, 3, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 2, 100, Ability.GUILLOTINE,shiny, emotion);
  }
}

export class Machamp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MACHAMP, [Synergy.FIGHTING, Synergy.HUMAN], Rarity.UNCOMMON, '0068', '', 210, 20, 5, 5, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 3, 100, Ability.GUILLOTINE,shiny, emotion);
  }
}

export class Piplup extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PIPLUP, [Synergy.WATER, Synergy.FLYING, Synergy.METAL], Rarity.UNCOMMON, '0393', Pkm.PRINPLUP, 70, 5, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.IRON_TAIL,shiny, emotion);
  }
}

export class Prinplup extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PRINPLUP, [Synergy.WATER, Synergy.FLYING, Synergy.METAL], Rarity.UNCOMMON, '0394', Pkm.EMPOLEON, 120, 9, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_TAIL,shiny, emotion);
  }
}

export class Empoleon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.EMPOLEON, [Synergy.WATER, Synergy.FLYING, Synergy.METAL], Rarity.UNCOMMON, '0395', '', 210, 20, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.IRON_TAIL,shiny, emotion);
  }
}

export class Chimchar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CHIMCHAR, [Synergy.FIRE, Synergy.FIGHTING], Rarity.UNCOMMON, '0390', Pkm.MONFERNO, 70, 5, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.TORMENT,shiny, emotion);
  }
}

export class Monferno extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MONFERNO, [Synergy.FIRE, Synergy.FIGHTING], Rarity.UNCOMMON, '0391', Pkm.INFERNAPE, 120, 9, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.TORMENT,shiny, emotion);
  }
}

export class Infernape extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.INFERNAPE, [Synergy.FIRE, Synergy.FIGHTING], Rarity.UNCOMMON, '0392', '', 210, 20, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.TORMENT,shiny, emotion);
  }
}

export class Mudkip extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MUDKIP, [Synergy.WATER, Synergy.GROUND], Rarity.UNCOMMON, '0258', Pkm.MARSHTOMP, 70, 5, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Marshtomp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MARSHTOMP, [Synergy.WATER, Synergy.GROUND], Rarity.UNCOMMON, '0259', Pkm.SWAMPERT, 120, 9, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Swampert extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SWAMPERT, [Synergy.WATER, Synergy.GROUND], Rarity.UNCOMMON, '0260', '', 210, 20, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Torchic extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TORCHIC, [Synergy.FIRE, Synergy.FIGHTING, Synergy.FLYING], Rarity.UNCOMMON, '0255', Pkm.COMBUSKEN, 70, 5, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BLAZE_KICK,shiny, emotion);
  }
}

export class Combusken extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.COMBUSKEN, [Synergy.FIRE, Synergy.FIGHTING, Synergy.FLYING], Rarity.UNCOMMON, '0256', Pkm.BLAZIKEN, 120, 9, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.BLAZE_KICK,shiny, emotion);
  }
}

export class Blaziken extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BLAZIKEN, [Synergy.FIRE, Synergy.FIGHTING, Synergy.FLYING], Rarity.UNCOMMON, '0257', '', 210, 20, 3, 3, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.BLAZE_KICK,shiny, emotion);
  }
}

export class Treecko extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TREECKO, [Synergy.GRASS, Synergy.MONSTER], Rarity.UNCOMMON, '0252', Pkm.GROVYLE, 70, 5, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.THIEF,shiny, emotion);
  }
}

export class Grovyle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GROVYLE, [Synergy.GRASS, Synergy.MONSTER], Rarity.UNCOMMON, '0253', Pkm.SCEPTILE, 120, 9, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.THIEF,shiny, emotion);
  }
}

export class Sceptile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SCEPTILE, [Synergy.GRASS, Synergy.MONSTER], Rarity.UNCOMMON, '0254', '', 210, 20, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.THIEF,shiny, emotion);
  }
}

export class Cyndaquil extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CYNDAQUIL, [Synergy.FIRE, Synergy.FIELD], Rarity.UNCOMMON, '0155', Pkm.QUILAVA, 70, 5, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.WHEEL_OF_FIRE,shiny, emotion);
  }
}

export class Quilava extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.QUILAVA, [Synergy.FIRE, Synergy.FIELD], Rarity.UNCOMMON, '0156', Pkm.TYPHLOSION, 120, 9, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.WHEEL_OF_FIRE,shiny, emotion);
  }
}

export class Typhlosion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TYPHLOSION, [Synergy.FIRE, Synergy.FIELD], Rarity.UNCOMMON, '0157', '', 210, 18, 1, 1, 2, 'FIRE/range', AttackType.SPECIAL, 3, 100, Ability.WHEEL_OF_FIRE,shiny, emotion);
  }
}

export class Slowpoke extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SLOWPOKE, [Synergy.AQUATIC, Synergy.PSYCHIC], Rarity.UNCOMMON, '0079', Pkm.SLOWBRO, 70, 5, 2, 2, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Slowbro extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SLOWBRO, [Synergy.AQUATIC, Synergy.PSYCHIC], Rarity.UNCOMMON, '0080', Pkm.SLOWKING, 120, 9, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Slowking extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SLOWKING, [Synergy.AQUATIC, Synergy.PSYCHIC], Rarity.UNCOMMON, '0199', '', 210, 20, 4, 4, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Squirtle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SQUIRTLE, [Synergy.WATER, Synergy.FIELD], Rarity.UNCOMMON, '0007', Pkm.WARTORTLE, 70, 5, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 1, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Wartortle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.WARTORTLE, [Synergy.WATER, Synergy.FIELD], Rarity.UNCOMMON, '0008', Pkm.BLASTOISE, 120, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Blastoise extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BLASTOISE, [Synergy.WATER, Synergy.FIELD], Rarity.UNCOMMON, '0009', '', 210, 20, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 3, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Bellsprout extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BELLSPROUT, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.UNCOMMON, '0069', Pkm.WEEPINBELL, 70, 5, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.ROOT,shiny, emotion);
  }
}

export class Weepinbell extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.WEEPINBELL, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.UNCOMMON, '0070', Pkm.VICTREEBEL, 120, 9, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.ROOT,shiny, emotion);
  }
}

export class Victreebel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VICTREEBEL, [Synergy.GRASS, Synergy.POISON, Synergy.FLORA], Rarity.UNCOMMON, '0071', '', 210, 20, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.ROOT,shiny, emotion);
  }
}

export class Pikipek extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PIKIPEK, [Synergy.NORMAL, Synergy.FLYING, Synergy.SOUND], Rarity.UNCOMMON, '0731', Pkm.TRUMBEAK, 70, 5, 2, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 70, Ability.GROWL,shiny, emotion);
  }
}

export class Trumbeak extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TRUMBEAK, [Synergy.NORMAL, Synergy.FLYING, Synergy.SOUND], Rarity.UNCOMMON, '0732', Pkm.TOUCANNON, 120, 9, 3, 3, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 70, Ability.GROWL,shiny, emotion);
  }
}

export class Toucannon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TOUCANNON, [Synergy.NORMAL, Synergy.FLYING, Synergy.SOUND], Rarity.UNCOMMON, '0733', '', 210, 20, 4, 4, 1, 'NORMAL/melee', AttackType.PHYSICAL, 3, 70, Ability.GROWL,shiny, emotion);
  }
}

export class Geodude extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GEODUDE, [Synergy.GROUND, Synergy.MINERAL], Rarity.COMMON, '0074', Pkm.GRAVELER, 60, 5, 2, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.ROCK_SLIDE,shiny, emotion);
  }
}

export class Graveler extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GRAVELER, [Synergy.GROUND, Synergy.MINERAL], Rarity.COMMON, '0075', Pkm.GOLEM, 110, 9, 4, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE,shiny, emotion);
  }
}

export class Golem extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GOLEM, [Synergy.GROUND, Synergy.MINERAL], Rarity.COMMON, '0076', '', 200, 20, 8, 8, 1, 'ROCK/melee', AttackType.PHYSICAL, 3, 100, Ability.ROCK_SLIDE,shiny, emotion);
  }
}

export class Totodile extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TOTODILE, [Synergy.MONSTER, Synergy.AQUATIC], Rarity.COMMON, '0158', Pkm.CROCONAW, 60, 5, 2, 2, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.BITE,shiny, emotion);
  }
}

export class Croconaw extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CROCONAW, [Synergy.MONSTER, Synergy.AQUATIC], Rarity.COMMON, '0159', Pkm.FERALIGATR, 110, 9, 3, 3, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.BITE,shiny, emotion);
  }
}

export class Feraligatr extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FERALIGATR, [Synergy.MONSTER, Synergy.AQUATIC], Rarity.COMMON, '0160', '', 200, 20, 5, 5, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.BITE,shiny, emotion);
  }
}

export class Azurill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AZURILL, [Synergy.WATER, Synergy.FAIRY], Rarity.COMMON, '0298', Pkm.MARILL, 60, 5, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 1, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Marill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MARILL, [Synergy.WATER, Synergy.FAIRY], Rarity.COMMON, '0183', Pkm.AZUMARILL, 110, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Azumarill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AZUMARILL, [Synergy.WATER, Synergy.FAIRY], Rarity.COMMON, '0184', '', 200, 20, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 3, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Zubat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ZUBAT, [Synergy.POISON, Synergy.FLYING, Synergy.SOUND], Rarity.COMMON, '0041', Pkm.GOLBAT, 60, 5, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 1, 90, Ability.LEECH_LIFE,shiny, emotion);
  }
}

export class Golbat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GOLBAT, [Synergy.POISON, Synergy.FLYING, Synergy.SOUND], Rarity.COMMON, '0042', Pkm.CROBAT, 110, 9, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 90, Ability.LEECH_LIFE,shiny, emotion);
  }
}

export class Crobat extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CROBAT, [Synergy.POISON, Synergy.FLYING, Synergy.SOUND], Rarity.COMMON, '0169', '', 200, 18, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 3, 90, Ability.LEECH_LIFE,shiny, emotion);
  }
}

export class Mareep extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAREEP, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.COMMON, '0179', Pkm.FLAFFY, 60, 5, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 1, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Flaffy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FLAFFY, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.COMMON, '0180', Pkm.AMPHAROS, 110, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Ampharos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AMPHAROS, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.COMMON, '0181', '', 200, 18, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 3, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Cleffa extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CLEFFA, [Synergy.FAIRY, Synergy.NORMAL], Rarity.COMMON, '0173', Pkm.CLEFAIRY, 60, 5, 2, 2, 1, 'FAIRY/melee', AttackType.PHYSICAL, 1, 100, Ability.METRONOME,shiny, emotion);
  }
}

export class Clefairy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CLEFAIRY, [Synergy.FAIRY, Synergy.NORMAL], Rarity.COMMON, '0035', Pkm.CLEFABLE, 110, 9, 2, 2, 1, 'FAIRY/melee', AttackType.PHYSICAL, 2, 100, Ability.METRONOME,shiny, emotion);
  }
}

export class Clefable extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CLEFABLE, [Synergy.FAIRY, Synergy.NORMAL], Rarity.COMMON, '0036', '', 200, 18, 2, 2, 1, 'FAIRY/melee', AttackType.PHYSICAL, 3, 100, Ability.METRONOME,shiny, emotion);
  }
}

export class Caterpie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CATERPIE, [Synergy.GRASS, Synergy.BUG], Rarity.COMMON, '0010', Pkm.METAPOD, 60, 5, 1, 1, 2, 'POISON/range', AttackType.SPECIAL, 1, 100, Ability.BUG_BUZZ,shiny, emotion);
  }
}

export class Metapod extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.METAPOD, [Synergy.GRASS, Synergy.BUG], Rarity.COMMON, '0011', Pkm.BUTTERFREE, 110, 9, 1, 1, 2, 'POISON/range', AttackType.SPECIAL, 2, 100, Ability.BUG_BUZZ,shiny, emotion);
  }
}

export class Butterfree extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BUTTERFREE, [Synergy.GRASS, Synergy.BUG, Synergy.FLYING], Rarity.COMMON, '0012', '', 200, 18, 1, 1, 2, 'POISON/range', AttackType.SPECIAL, 3, 100, Ability.BUG_BUZZ,shiny, emotion);
  }
}

export class Weedle extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.WEEDLE, [Synergy.POISON, Synergy.BUG], Rarity.COMMON, '0013', Pkm.KAKUNA, 60, 5, 2, 2, 1, 'BUG/melee', AttackType.PHYSICAL, 1, 100, Ability.BUG_BUZZ,shiny, emotion);
  }
}

export class Kakuna extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KAKUNA, [Synergy.POISON, Synergy.BUG], Rarity.COMMON, '0014', Pkm.BEEDRILL, 110, 9, 2, 2, 1, 'BUG/melee', AttackType.PHYSICAL, 2, 100, Ability.BUG_BUZZ,shiny, emotion);
  }
}

export class Beedrill extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BEEDRILL, [Synergy.POISON, Synergy.BUG, Synergy.FLYING], Rarity.COMMON, '0015', '', 200, 20, 2, 2, 1, 'BUG/melee', AttackType.PHYSICAL, 3, 100, Ability.BUG_BUZZ,shiny, emotion);
  }
}

export class Pidgey extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PIDGEY, [Synergy.NORMAL, Synergy.FLYING], Rarity.COMMON, '0016', Pkm.PIDGEOTTO, 60, 5, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 1, 100, Ability.HURRICANE,shiny, emotion);
  }
}

export class Pidgeotto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PIDGEOTTO, [Synergy.NORMAL, Synergy.FLYING], Rarity.COMMON, '0017', Pkm.PIDGEOT, 110, 9, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 2, 100, Ability.HURRICANE,shiny, emotion);
  }
}

export class Pidgeot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PIDGEOT, [Synergy.NORMAL, Synergy.FLYING], Rarity.COMMON, '0018', '', 200, 18, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 3, 100, Ability.HURRICANE,shiny, emotion);
  }
}

export class Hoppip extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HOPPIP, [Synergy.FLYING, Synergy.FLORA, Synergy.GRASS], Rarity.COMMON, '0187', Pkm.SKIPLOOM, 60, 5, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 1, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Skiploom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SKIPLOOM, [Synergy.FLYING, Synergy.FLORA, Synergy.GRASS], Rarity.COMMON, '0188', Pkm.JUMPLUFF, 110, 9, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 2, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Jumpluff extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.JUMPLUFF, [Synergy.FLYING, Synergy.FLORA, Synergy.GRASS], Rarity.COMMON, '0189', '', 220, 18, 1, 1, 2, 'FLYING/range', AttackType.SPECIAL, 3, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Seedot extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SEEDOT, [Synergy.GRASS, Synergy.DARK, Synergy.FIELD], Rarity.COMMON, '0273', Pkm.NUZLEAF, 60, 5, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.THIEF,shiny, emotion);
  }
}

export class Nuzleaf extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.NUZLEAF, [Synergy.GRASS, Synergy.DARK, Synergy.FIELD], Rarity.COMMON, '0274', Pkm.SHIFTRY, 110, 9, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.THIEF,shiny, emotion);
  }
}

export class Shiftry extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SHIFTRY, [Synergy.GRASS, Synergy.DARK, Synergy.FIELD], Rarity.COMMON, '0275', '', 200, 20, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.THIEF,shiny, emotion);
  }
}

export class Starly extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.STARLY, [Synergy.NORMAL, Synergy.FLYING], Rarity.COMMON, '0396', Pkm.STARAVIA, 60, 5, 2, 2, 1, 'FLYING/melee', AttackType.PHYSICAL, 1, 100, Ability.HURRICANE,shiny, emotion);
  }
}

export class Staravia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.STARAVIA, [Synergy.NORMAL, Synergy.FLYING], Rarity.COMMON, '0397', Pkm.STARAPTOR, 110, 9, 2, 2, 1, 'FLYING/melee', AttackType.PHYSICAL, 2, 100, Ability.HURRICANE,shiny, emotion);
  }
}

export class Staraptor extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.STARAPTOR, [Synergy.NORMAL, Synergy.FLYING], Rarity.COMMON, '0398', '', 200, 20, 2, 2, 1, 'FLYING/melee', AttackType.PHYSICAL, 3, 100, Ability.HURRICANE,shiny, emotion);
  }
}

export class Charmander extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CHARMANDER, [Synergy.FIRE, Synergy.DRAGON], Rarity.COMMON, '0004', Pkm.CHARMELEON, 60, 5, 2, 2, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BLAST_BURN,shiny, emotion);
  }
}

export class Charmeleon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CHARMELEON, [Synergy.FIRE, Synergy.DRAGON], Rarity.COMMON, '0005', Pkm.CHARIZARD, 110, 9, 2, 2, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.BLAST_BURN,shiny, emotion);
  }
}

export class Charizard extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CHARIZARD, [Synergy.FIRE, Synergy.DRAGON], Rarity.COMMON, '0006', '', 200, 20, 2, 2, 1, 'FIRE/melee', AttackType.PHYSICAL, 3, 100, Ability.BLAST_BURN,shiny, emotion);
  }
}


export class Carvanha extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CARVANHA, [Synergy.WATER, Synergy.DARK], Rarity.SUMMON, '0318', '', 40, 4, 1, 1, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.BITE,shiny, emotion);
  }
}

export class Houndour extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HOUNDOUR, [Synergy.FIRE, Synergy.DARK], Rarity.SUMMON, '0228', '', 40, 4, 1, 1, 1, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BLAZE_KICK,shiny, emotion);
  }
}

export class Magikarp extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MAGIKARP, [Synergy.WATER], Rarity.NEUTRAL, '0129', Pkm.GYARADOS, 30, 1, 1, 1, 1, 'WATER/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Gyarados extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GYARADOS, [Synergy.WATER], Rarity.NEUTRAL, '0130', '', 200, 20, 5, 1, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Rattata extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RATTATA, [Synergy.NORMAL], Rarity.NEUTRAL, '0019', Pkm.RATICATE, 30, 5, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Raticate extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RATICATE, [Synergy.NORMAL], Rarity.NEUTRAL, '0020', '', 60, 7, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Spearow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SPEAROW, [Synergy.FLYING, Synergy.NORMAL], Rarity.NEUTRAL, '0021', '', 30, 5, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Fearow extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FEAROW, [Synergy.FLYING, Synergy.NORMAL], Rarity.NEUTRAL, '0022', '', 60, 7, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Meloetta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MELOETTA, [Synergy.NORMAL, Synergy.SOUND], Rarity.MYTHICAL, '0648', '', 300, 30, 5, 5, 4, 'PSYCHIC/range', AttackType.SPECIAL, 3, 120, Ability.RELIC_SONG,shiny, emotion);
  }
}

export class Lugia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LUGIA, [Synergy.AQUATIC, Synergy.FLYING, Synergy.PSYCHIC], Rarity.MYTHICAL, '0249', '', 300, 30, 5, 5, 4, 'FLYING/range', AttackType.SPECIAL, 2, 100, Ability.SILENCE,shiny, emotion);
  }
}

export class Giratina extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GIRATINA, [Synergy.DRAGON, Synergy.GHOST], Rarity.MYTHICAL, '0487', '', 300, 30, 5, 5, 2, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.NIGHT_SLASH,shiny, emotion);
  }
}

export class Zapdos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ZAPDOS, [Synergy.ELECTRIC, Synergy.FLYING], Rarity.MYTHICAL, '0145', '', 200, 20, 3, 3, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.CHARGE,shiny, emotion);
  }
}

export class Moltres extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MOLTRES, [Synergy.FIRE, Synergy.FLYING], Rarity.MYTHICAL, '0146', '', 200, 20, 3, 3, 2, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.WHEEL_OF_FIRE,shiny, emotion);
  }
}

export class Articuno extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ARTICUNO, [Synergy.ICE, Synergy.FLYING], Rarity.MYTHICAL, '0144', '', 200, 20, 3, 3, 2, 'FLYING/range', AttackType.SPECIAL, 2, 100, Ability.FREEZE,shiny, emotion);
  }
}

export class Dialga extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DIALGA, [Synergy.METAL, Synergy.DRAGON], Rarity.MYTHICAL, '0483', '', 300, 30, 5, 5, 2, 'FIRE/range', AttackType.SPECIAL, 2, 150, Ability.ROAR_OF_TIME,shiny, emotion);
  }
}

export class Palkia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PALKIA, [Synergy.DRAGON, Synergy.WATER], Rarity.MYTHICAL, '0484', '', 300, 30, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 150, Ability.ROAR_OF_TIME,shiny, emotion);
  }
}

export class Suicune extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SUICUNE, [Synergy.WATER, Synergy.ICE], Rarity.MYTHICAL, '0245', '', 300, 30, 5, 5, 1, 'WATER/melee', AttackType.PHYSICAL, 3, 100, Ability.HYDRO_PUMP,shiny, emotion);
  }
}

export class Raikou extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RAIKOU, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.MYTHICAL, '0243', '', 300, 30, 5, 5, 1, 'ELECTRIC/melee', AttackType.PHYSICAL, 2, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Entei extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ENTEI, [Synergy.FIRE, Synergy.FIELD], Rarity.MYTHICAL, '0244', '', 300, 30, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.FIRE_BLAST,shiny, emotion);
  }
}

export class Regice extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.REGICE, [Synergy.ICE, Synergy.HUMAN], Rarity.MYTHICAL, '0378', '', 200, 20, 6, 6, 1, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Regirock extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.REGIROCK, [Synergy.MINERAL, Synergy.HUMAN], Rarity.MYTHICAL, '0377', '', 200, 20, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE,shiny, emotion);
  }
}

export class Registeel extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.REGISTEEL, [Synergy.METAL, Synergy.HUMAN], Rarity.MYTHICAL, '0379', '', 200, 20, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_DEFENSE,shiny, emotion);
  }
}

export class Regigigas extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.REGIGIGAS, [Synergy.NORMAL, Synergy.MONSTER, Synergy.HUMAN], Rarity.MYTHICAL, '0486', '', 300, 30, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_TAIL,shiny, emotion);
  }
}

export class Kyogre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KYOGRE, [Synergy.WATER, Synergy.AQUATIC], Rarity.MYTHICAL, '0382', '', 300, 30, 5, 5, 4, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.ORIGIN_PULSE,shiny, emotion);
  }
}

export class Groudon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GROUDON, [Synergy.GROUND, Synergy.FIRE], Rarity.MYTHICAL, '0383', '', 300, 30, 5, 5, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAT_WAVE,shiny, emotion);
  }
}

export class Rayquaza extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RAYQUAZA, [Synergy.DRAGON, Synergy.FLYING], Rarity.MYTHICAL, '0384', '', 300, 30, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Eevee extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.EEVEE, [Synergy.NORMAL, Synergy.FIELD], Rarity.UNCOMMON, '0133', '', 130, 5, 2, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Vaporeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VAPOREON, [Synergy.WATER, Synergy.FIELD, Synergy.AQUATIC], Rarity.UNCOMMON, '0134', '', 130, 9, 1, 1, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Jolteon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.JOLTEON, [Synergy.ELECTRIC, Synergy.FIELD], Rarity.UNCOMMON, '0135', '', 130, 9, 1, 1, 2, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Flareon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.FLAREON, [Synergy.FIRE, Synergy.FIELD], Rarity.UNCOMMON, '0136', '', 130, 9, 3, 2, 1, 'FIRE/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Espeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ESPEON, [Synergy.PSYCHIC, Synergy.FIELD], Rarity.UNCOMMON, '0196', '', 130, 9, 1, 1, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Umbreon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.UMBREON, [Synergy.DARK, Synergy.FIELD], Rarity.UNCOMMON, '0197', '', 130, 9, 3, 2, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Leafeon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LEAFEON, [Synergy.GRASS, Synergy.FLORA, Synergy.FIELD], Rarity.UNCOMMON, '0470', '', 130, 9, 3, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Sylveon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SYLVEON, [Synergy.FAIRY, Synergy.FIELD, Synergy.SOUND], Rarity.UNCOMMON, '0700', '', 130, 9, 1, 1, 2, 'FAIRY/range', AttackType.SPECIAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Glaceon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GLACEON, [Synergy.ICE, Synergy.FIELD], Rarity.UNCOMMON, '0471', '', 130, 9, 1, 1, 2, 'ICE/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Sandshrew extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SANDSHREW, [Synergy.GROUND, Synergy.FIELD], Rarity.NEUTRAL, '0027', '', 70, 5, 1, 1, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Darkrai extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DARKRAI, [Synergy.DARK, Synergy.MONSTER, Synergy.GHOST], Rarity.MYTHICAL, '0491', '', 300, 30, 3, 3, 3, 'GHOST/range', AttackType.SPECIAL, 3, 100, Ability.DARK_PULSE,shiny, emotion);
  }
}

export class Volcarona extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VOLCARONA, [Synergy.FIRE, Synergy.BUG], Rarity.MYTHICAL, '0637', '', 200, 20, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.FIRE_BLAST,shiny, emotion);
  }
}

export class Castform extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CASTFORM, [Synergy.NORMAL, Synergy.GHOST], Rarity.MYTHICAL, '0351', '', 200, 20, 3, 3, 2, 'PSYCHIC/range', AttackType.SPECIAL, 2, 80, Ability.NASTY_PLOT,shiny, emotion);
  }
}

export class CastformSun extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CASTFORM_SUN, [Synergy.NORMAL, Synergy.GHOST, Synergy.FIRE], Rarity.MYTHICAL, '0351-0001', '', 200, 20, 3, 3, 2, 'DRAGON/range', AttackType.SPECIAL, 2, 80, Ability.FIRE_BLAST,shiny, emotion);
  }
}

export class CastformRain extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CASTFORM_RAIN, [Synergy.NORMAL, Synergy.GHOST, Synergy.WATER], Rarity.MYTHICAL, '0351-0002', '', 200, 20, 3, 3, 2, 'WATER/range', AttackType.SPECIAL, 2, 80, Ability.SOAK,shiny, emotion);
  }
}

export class CastformHail extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CASTFORM_HAIL, [Synergy.NORMAL, Synergy.GHOST, Synergy.ICE], Rarity.MYTHICAL, '0351-0003', '', 200, 20, 3, 3, 2, 'ICE/melee', AttackType.SPECIAL, 2, 80, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Landorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LANDORUS, [Synergy.GROUND, Synergy.FLYING], Rarity.MYTHICAL, '0645', '', 200, 20, 3, 3, 2, 'FLYING/range', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE,shiny, emotion);
  }
}

export class Thundurus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.THUNDURUS, [Synergy.ELECTRIC, Synergy.FLYING], Rarity.MYTHICAL, '0642', '', 200, 20, 3, 3, 3, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Tornadus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TORNADUS, [Synergy.FLYING], Rarity.MYTHICAL, '0641', '', 200, 20, 3, 3, 3, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.HURRICANE,shiny, emotion);
  }
}

export class Keldeo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KELDEO, [Synergy.WATER, Synergy.FIGHTING], Rarity.MYTHICAL, '0647', '', 200, 20, 3, 3, 2, 'WATER/range', AttackType.SPECIAL, 2, 100, Ability.GUILLOTINE,shiny, emotion);
  }
}

export class Terrakion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TERRAKION, [Synergy.MINERAL, Synergy.FIGHTING], Rarity.MYTHICAL, '0639', '', 200, 20, 6, 6, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE,shiny, emotion);
  }
}

export class Virizion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VIRIZION, [Synergy.GRASS, Synergy.FIGHTING], Rarity.MYTHICAL, '0640', '', 200, 20, 6, 6, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Cobalion extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.COBALION, [Synergy.METAL, Synergy.FIGHTING], Rarity.MYTHICAL, '0638', '', 200, 20, 6, 6, 1, 'FIGHTING/melee', AttackType.PHYSICAL, 2, 100, Ability.SEISMIC_TOSS,shiny, emotion);
  }
}

export class Manaphy extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MANAPHY, [Synergy.WATER, Synergy.BUG], Rarity.MYTHICAL, '0490', '', 200, 20, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.NASTY_PLOT,shiny, emotion);
  }
}

export class Rotom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ROTOM, [Synergy.ELECTRIC, Synergy.GHOST], Rarity.MYTHICAL, '0479', '', 200, 12, 3, 3, 3, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND,shiny, emotion);
  }
}

export class Spiritomb extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SPIRITOMB, [Synergy.DARK, Synergy.GHOST], Rarity.MYTHICAL, '0442', '', 200, 20, 3, 3, 3, 'GHOST/range', AttackType.SPECIAL, 2, 100, Ability.NIGHT_SLASH,shiny, emotion);
  }
}

export class Absol extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ABSOL, [Synergy.DARK, Synergy.FIELD], Rarity.MYTHICAL, '0359', '', 250, 20, 6, 6, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.THIEF,shiny, emotion);
  }
}

export class Lapras extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LAPRAS, [Synergy.WATER, Synergy.ICE], Rarity.MYTHICAL, '0131', '', 250, 20, 6, 6, 1, 'WATER/melee', AttackType.PHYSICAL, 2, 100, Ability.SOAK,shiny, emotion);
  }
}

export class Latias extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LATIAS, [Synergy.PSYCHIC, Synergy.DRAGON], Rarity.MYTHICAL, '0380', '', 200, 20, 3, 3, 3, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Latios extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LATIOS, [Synergy.PSYCHIC, Synergy.DRAGON], Rarity.MYTHICAL, '0381', '', 200, 20, 3, 3, 3, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Uxie extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.UXIE, [Synergy.PSYCHIC, Synergy.FAIRY], Rarity.MYTHICAL, '0480', '', 200, 12, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND,shiny, emotion);
  }
}

export class Mesprit extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MESPRIT, [Synergy.PSYCHIC, Synergy.FAIRY], Rarity.MYTHICAL, '0481', '', 200, 12, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND,shiny, emotion);
  }
}

export class Azelf extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AZELF, [Synergy.PSYCHIC, Synergy.FAIRY], Rarity.MYTHICAL, '0482', '', 200, 12, 3, 3, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 100, Ability.CALM_MIND,shiny, emotion);
  }
}

export class Mewtwo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEWTWO, [Synergy.PSYCHIC, Synergy.MONSTER], Rarity.MYTHICAL, '0150', '', 300, 30, 5, 5, 3, 'PSYCHIC/range', AttackType.TRUE, 2, 100, Ability.TORMENT,shiny, emotion);
  }
}

export class Kyurem extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KYUREM, [Synergy.DRAGON, Synergy.ICE], Rarity.MYTHICAL, '0646', '', 300, 30, 5, 5, 3, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.FREEZE,shiny, emotion);
  }
}

export class Reshiram extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RESHIRAM, [Synergy.DRAGON, Synergy.FIRE], Rarity.MYTHICAL, '0643', '', 300, 30, 5, 5, 3, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.BURN,shiny, emotion);
  }
}

export class Zekrom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ZEKROM, [Synergy.DRAGON, Synergy.ELECTRIC], Rarity.MYTHICAL, '0644', '', 300, 30, 5, 5, 3, 'ELECTRIC/range', AttackType.SPECIAL, 2, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class Celebi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CELEBI, [Synergy.GRASS, Synergy.PSYCHIC], Rarity.MYTHICAL, '0251', '', 300, 30, 5, 5, 3, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.LEECH_LIFE,shiny, emotion);
  }
}

export class Victini extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VICTINI, [Synergy.FIRE, Synergy.PSYCHIC], Rarity.MYTHICAL, '0494', '', 300, 30, 5, 5, 3, 'FIRE/melee', AttackType.PHYSICAL, 1, 100, Ability.BURN,shiny, emotion);
  }
}

export class Jirachi extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.JIRACHI, [Synergy.METAL, Synergy.PSYCHIC], Rarity.MYTHICAL, '0385', '', 300, 30, 5, 5, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 50, Ability.WISH,shiny, emotion);
  }
}

export class Arceus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ARCEUS, [Synergy.NORMAL, Synergy.FIELD], Rarity.MYTHICAL, '0493', '', 300, 30, 5, 5, 1, 'DRAGON/melee', AttackType.PHYSICAL, 2, 100, Ability.HAPPY_HOUR,shiny, emotion);
  }
}

export class Deoxys extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.DEOXYS, [Synergy.PSYCHIC, Synergy.HUMAN], Rarity.MYTHICAL, '0386', '', 300, 30, 5, 5, 1, 'PSYCHIC/range', AttackType.PHYSICAL, 2, 100, Ability.PROTECT,shiny, emotion);
  }
}

export class Shaymin extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SHAYMIN, [Synergy.GRASS, Synergy.FLORA], Rarity.MYTHICAL, '0492', '', 300, 30, 5, 5, 3, 'GRASS/range', AttackType.SPECIAL, 2, 100, Ability.SEED_FLARE,shiny, emotion);
  }
}

export class Cresselia extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CRESSELIA, [Synergy.PSYCHIC, Synergy.FAIRY], Rarity.MYTHICAL, '0488', '', 300, 30, 5, 5, 3, 'PSYCHIC/range', AttackType.SPECIAL, 2, 50, Ability.WISH,shiny, emotion);
  }
}

export class Heatran extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HEATRAN, [Synergy.FIRE, Synergy.METAL], Rarity.MYTHICAL, '0485', '', 300, 30, 5, 5, 3, 'FIRE/range', AttackType.SPECIAL, 2, 100, Ability.BURN,shiny, emotion);
  }
}

export class HooH extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.HO_OH, [Synergy.FIRE, Synergy.FLYING], Rarity.MYTHICAL, '0250', '', 300, 30, 5, 5, 3, 'FIRE/range', AttackType.SPECIAL, 1, 100, Ability.BURN,shiny, emotion);
  }
}

export class PrimalGroudon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PRIMAL_GROUDON, [Synergy.GROUND, Synergy.FIRE], Rarity.MYTHICAL, '0383-0001', '', 400, 40, 10, 10, 1, 'FIRE/melee', AttackType.TRUE, 3, 100, Ability.BURN,shiny, emotion);
  }
}

export class PrimalKyogre extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PRIMAL_KYOGRE, [Synergy.WATER, Synergy.ELECTRIC, Synergy.AQUATIC], Rarity.MYTHICAL, '0382-0001', '', 400, 40, 5, 5, 3, 'WATER/range', AttackType.TRUE, 3, 100, Ability.THUNDER,shiny, emotion);
  }
}

export class MegaRayquaza extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEGA_RAYQUAZA, [Synergy.DRAGON, Synergy.FLYING], Rarity.MYTHICAL, '0384-0001', '', 400, 40, 5, 5, 3, 'FIRE/range', AttackType.TRUE, 3, 100, Ability.DRACO_METEOR,shiny, emotion);
  }
}

export class Meowth extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.MEOWTH, [], Rarity.NEUTRAL, '0052', '', 100, 10, 2, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 1, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Persian extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.PERSIAN, [], Rarity.NEUTRAL, '0053', '', 100, 10, 2, 2, 1, 'NORMAL/melee', AttackType.PHYSICAL, 2, 100, Ability.DEFAULT,shiny, emotion);
  }
}

export class Oddish extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ODDISH, [Synergy.POISON, Synergy.GRASS], Rarity.SUMMON, '0043', Pkm.GLOOM, 90, 9, 2, 2, 1, 'GRASS/melee', AttackType.PHYSICAL, 1, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Gloom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.GLOOM, [Synergy.POISON, Synergy.GRASS], Rarity.SUMMON, '0044', Pkm.VILEPLUME, 160, 18, 3, 3, 1, 'GRASS/melee', AttackType.PHYSICAL, 2, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Vileplume extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.VILEPLUME, [Synergy.POISON, Synergy.GRASS], Rarity.SUMMON, '0045', Pkm.BELLOSSOM, 260, 20, 4, 4, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Bellossom extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BELLOSSOM, [Synergy.POISON, Synergy.GRASS], Rarity.SUMMON, '0182', '', 360, 27, 5, 5, 1, 'GRASS/melee', AttackType.PHYSICAL, 3, 100, Ability.STUN_SPORE,shiny, emotion);
  }
}

export class Amaura extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AMAURA, [Synergy.FOSSIL, Synergy.ICE], Rarity.EPIC, '0698', Pkm.AURORUS, 150, 10, 4, 5, 1, 'ROCK/melee', AttackType.SPECIAL, 1, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Aurorus extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AURORUS, [Synergy.FOSSIL, Synergy.ICE], Rarity.EPIC, '0699', '', 330, 16, 8, 10, 1, 'ROCK/melee', AttackType.SPECIAL, 2, 100, Ability.ICICLE_CRASH,shiny, emotion);
  }
}

export class Anorith extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ANORITH, [Synergy.FOSSIL, Synergy.BUG], Rarity.UNCOMMON, '0347', Pkm.ARMALDO, 70, 10, 3, 1, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.ROCK_SMASH,shiny, emotion);
  }
}

export class Armaldo extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ARMALDO, [Synergy.FOSSIL, Synergy.BUG], Rarity.UNCOMMON, '0348', '', 160, 16, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SMASH,shiny, emotion);
  }
}

export class Archen extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ARCHEN, [Synergy.FOSSIL, Synergy.FLYING], Rarity.RARE, '0566', Pkm.ARCHEOPS, 100, 12, 2, 1, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.ROCK_SMASH,shiny, emotion);
  }
}

export class Archeops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.ARCHEOPS, [Synergy.FOSSIL, Synergy.FLYING], Rarity.RARE, '0567', '', 180, 20, 3, 2, 2, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SMASH,shiny, emotion);
  }
}

export class Shieldon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.SHIELDON, [Synergy.FOSSIL, Synergy.METAL], Rarity.RARE, '0410', Pkm.BASTIODON, 120, 7, 3, 5, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.IRON_DEFENSE,shiny, emotion);
  }
}

export class Bastiodon extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.BASTIODON, [Synergy.FOSSIL, Synergy.METAL], Rarity.RARE, '0411', '', 240, 14, 7, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.IRON_DEFENSE,shiny, emotion);
  }
}

export class Tirtouga extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TIRTOUGA, [Synergy.FOSSIL, Synergy.WATER], Rarity.RARE, '0564', Pkm.CARRACOSTA, 120, 7, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.ROCK_TOMB,shiny, emotion);
  }
}

export class Carracosta extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CARRACOSTA, [Synergy.FOSSIL, Synergy.WATER], Rarity.RARE, '0565', '', 240, 14, 7, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_TOMB,shiny, emotion);
  }
}

export class Lileep extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.LILEEP, [Synergy.FOSSIL, Synergy.GRASS], Rarity.UNCOMMON, '0345', Pkm.CRADILY, 60, 8, 2, 2, 2, 'ROCK/melee', AttackType.SPECIAL, 1, 100, Ability.HEAL_BLOCK,shiny, emotion);
  }
}

export class Cradily extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CRADILY, [Synergy.FOSSIL, Synergy.GRASS], Rarity.UNCOMMON, '0346', '', 140, 14, 4, 4, 2, 'ROCK/melee', AttackType.SPECIAL, 2, 100, Ability.HEAL_BLOCK,shiny, emotion);
  }
}

export class Cranidos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.CRANIDOS, [Synergy.FOSSIL, Synergy.MONSTER], Rarity.RARE, '0408', Pkm.RAMPARDOS, 100, 10, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.HEAD_SMASH,shiny, emotion);
  }
}

export class Rampardos extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.RAMPARDOS, [Synergy.FOSSIL, Synergy.MONSTER], Rarity.RARE, '0409', '', 200, 19, 6, 3, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAD_SMASH,shiny, emotion);
  }
}

export class Kabuto extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KABUTO, [Synergy.FOSSIL, Synergy.WATER], Rarity.UNCOMMON, '0140', Pkm.KABUTOPS, 70, 10, 3, 1, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.HEAL_BLOCK,shiny, emotion);
  }
}

export class Kabutops extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.KABUTOPS, [Synergy.FOSSIL, Synergy.WATER], Rarity.UNCOMMON, '0141', '', 160, 16, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAL_BLOCK,shiny, emotion);
  }
}

export class Omanyte extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.OMANYTE, [Synergy.FOSSIL, Synergy.WATER], Rarity.UNCOMMON, '0138', Pkm.OMASTAR, 60, 8, 1, 3, 2, 'ROCK/melee', AttackType.SPECIAL, 1, 100, Ability.ROCK_TOMB,shiny, emotion);
  }
}

export class Omastar extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.OMASTAR, [Synergy.FOSSIL, Synergy.WATER], Rarity.UNCOMMON, '0139', '', 140, 14, 2, 4, 2, 'ROCK/melee', AttackType.SPECIAL, 2, 100, Ability.ROCK_TOMB,shiny, emotion);
  }
}

export class Tyrunt extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TYRUNT, [Synergy.FOSSIL, Synergy.DRAGON], Rarity.EPIC, '0696', Pkm.TYRANTRUM, 135, 10, 4, 2, 1, 'ROCK/melee', AttackType.PHYSICAL, 1, 100, Ability.HEAD_SMASH,shiny, emotion);
  }
}

export class Tyrantrum extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.TYRANTRUM, [Synergy.FOSSIL, Synergy.DRAGON], Rarity.EPIC, '0697', '', 290, 22, 7, 4, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.HEAD_SMASH,shiny, emotion);
  }
}

export class Aerodactyl extends Pokemon {
  constructor(shiny: boolean, emotion: Emotion) {
    super(Pkm.AERODACTYL, [Synergy.FOSSIL, Synergy.FLYING], Rarity.EPIC, '0142', '', 270, 17, 6, 3, 1, 'ROCK/melee', AttackType.PHYSICAL, 2, 100, Ability.ROCK_SLIDE,shiny, emotion);
  }
}