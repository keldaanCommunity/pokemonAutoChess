/* eslint-disable max-len */

const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const uniqid = require('uniqid');
const ArraySchema = schema.ArraySchema;
const {SPECIAL_SKILL, TYPE, RARITY, COST, ATTACK_TYPE} = require('./enum');
const Items = require('./items');

class Pokemon extends Schema {
  constructor(name, frenchName, types, rarity, sheet, index, evolution, hp, atk, def, speDef, range, attackSprite, attackType, stars, maxMana, skill) {
    super();
    this.assign({
      id: uniqid(),
      name: name,
      types: new ArraySchema(),
      items: new Items(),
      sheet: sheet,
      rarity: rarity,
      index: index,
      evolution: evolution,
      positionX: -1,
      positionY: -1,
      cost: COST[rarity],
      hp: hp,
      atk: atk,
      def: def,
      speDef: speDef,
      range: range,
      attackSprite: attackSprite,
      atkSpeed: 1500,
      attackType: attackType,
      stars: stars,
      maxMana: maxMana,
      skill: skill,
      frenchName : frenchName
    });
    // this.items.add(ItemFactory.createRandomStone());
    if (types) {
      types.forEach((type) => {
        this.types.push(type);
      });
    }
  }

  toString() {
    return `Pokemon (Name: ${this.name}, (x: ${this.positionX}, y: ${this.positionY}))`;
  }
}

class Ditto extends Pokemon {
  constructor() {
    super('ditto', 'métamoprh', [TYPE.NORMAL], RARITY.LEGENDARY, 'LEGENDARY', 132, '', 30, 1, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Riolu extends Pokemon {
  constructor() {
    super('riolu', 'riolu', [TYPE.FIGHTING, TYPE.HUMAN], RARITY.LEGENDARY, 'LEGENDARY', 447, 'lucario', 90, 5, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.SILENCE);
  }
}

class Lucario extends Pokemon {
  constructor() {
    super('lucario', 'lucario', [TYPE.FIGHTING, TYPE.HUMAN, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY', 448, 'mega-lucario', 130, 9, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SILENCE);
  }
}

class MegaLucario extends Pokemon {
  constructor() {
    super('mega-lucario', 'méga-lucario', [TYPE.FIGHTING, TYPE.HUMAN, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY', 4480, '', 230, 18, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.SILENCE);
  }
}

class Scyther extends Pokemon {
  constructor() {
    super('scyther', 'insécatueur', [TYPE.BUG, TYPE.NORMAL], RARITY.LEGENDARY, 'LEGENDARY', 123, 'scizor', 90, 5, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.PROTECT);
  }
}

class Scizor extends Pokemon {
  constructor() {
    super('scizor', 'cizayox', [TYPE.BUG, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY', 212, 'mega-scizor', 130, 9, 6, 6, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.PROTECT);
  }
}

class MegaScizor extends Pokemon {
  constructor() {
    super('mega-scizor', 'méga-cizayox', [TYPE.BUG, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY', 2120, '', 230, 20, 7, 7, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.PROTECT);
  }
}

class Onix extends Pokemon {
  constructor() {
    super('onix', 'onix',[TYPE.MINERAL, TYPE.GROUND], RARITY.LEGENDARY, 'LEGENDARY', 95, 'steelix', 150, 5, 7, 7, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.IRON_DEFENSE);
  }
}

class Steelix extends Pokemon {
  constructor() {
    super('steelix', 'steelix',[TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY', 208, 'mega-steelix', 300, 9, 10, 10, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.IRON_DEFENSE);
  }
}

class MegaSteelix extends Pokemon {
  constructor() {
    super('mega-steelix', 'méga-steelix',[TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY', 2080, '', 400, 20, 20, 20, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.IRON_DEFENSE);
  }
}

class Growlithe extends Pokemon {
  constructor() {
    super('growlithe', 'caninos',[TYPE.FIRE, TYPE.FIELD], RARITY.LEGENDARY, 'LEGENDARY', 58, 'arcanine', 90, 9, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Arcanine extends Pokemon {
  constructor() {
    super('arcanine', 'arcanin',[TYPE.FIRE, TYPE.FIELD], RARITY.LEGENDARY, 'LEGENDARY', 59, '', 130, 20, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Numel extends Pokemon {
  constructor() {
    super('numel', 'chamallot',[TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], RARITY.LEGENDARY, 'LEGENDARY', 322, 'camerupt', 90, 5, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BURN);
  }
}

class Camerupt extends Pokemon {
  constructor() {
    super('camerupt', 'camerupt',[TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], RARITY.LEGENDARY, 'LEGENDARY', 323, 'mega-camerupt', 150, 9, 10, 10, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BURN);
  }
}

class MegaCamerupt extends Pokemon {
  constructor() {
    super('mega-camerupt', 'méga-camerupt',[TYPE.FIRE, TYPE.FIELD, TYPE.GROUND], RARITY.LEGENDARY, 'LEGENDARY', 3230, '', 230, 20, 15, 15, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BURN);
  }
}

class Munchlax extends Pokemon {
  constructor() {
    super('munchlax', 'goinfrex',[TYPE.NORMAL, TYPE.HUMAN], RARITY.LEGENDARY, 'LEGENDARY', 446, 'snorlax', 90, 9, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Snorlax extends Pokemon {
  constructor() {
    super('snorlax', 'ronflex',[TYPE.NORMAL, TYPE.HUMAN], RARITY.LEGENDARY, 'LEGENDARY', 143, '', 130, 20, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Meditite extends Pokemon {
  constructor() {
    super('meditite', 'méditika',[TYPE.NORMAL, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, 'LEGENDARY', 307, 'medicham', 90, 5, 5, 5, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.CONFUSION);
  }
}

class Medicham extends Pokemon {
  constructor() {
    super('medicham', 'charmina',[TYPE.NORMAL, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, 'LEGENDARY', 308, 'mega-medicham', 130, 9, 6, 6, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.CONFUSION);
  }
}

class MegaMedicham extends Pokemon {
  constructor() {
    super('mega-medicham', 'méga-charmina',[TYPE.NORMAL, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, 'LEGENDARY', 3080, '', 230, 20, 7, 7, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.CONFUSION);
  }
}

class Magby extends Pokemon {
  constructor() {
    super('magby', 'magby',[TYPE.FIRE, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 240, 'magmar', 90, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Magmar extends Pokemon {
  constructor() {
    super('magmar', 'magmar',[TYPE.FIRE, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 126, 'magmortar', 130, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Magmortar extends Pokemon {
  constructor() {
    super('magmortar', 'maganon',[TYPE.FIRE, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 467, '', 230, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Elekid extends Pokemon {
  constructor() {
    super('elekid', 'elekid',[TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 239, 'electabuzz', 90, 5, 4, 4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Electabuzz extends Pokemon {
  constructor() {
    super('electabuzz', 'élektek',[TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 125, 'electivire', 130, 9, 5, 5, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Electivire extends Pokemon {
  constructor() {
    super('electivire', 'élekable',[TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 466, '', 230, 20, 6, 6, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Gible extends Pokemon {
  constructor() {
    super('gible', 'griknot',[TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, 'EPIC', 443, 'gabite', 90, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Gabite extends Pokemon {
  constructor() {
    super('gabite', 'carmache',[TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, 'EPIC', 444, 'garchomp', 130, 9, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Garchomp extends Pokemon {
  constructor() {
    super('garchomp', 'carchakrok',[TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, 'EPIC', 445, '', 230, 20, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Beldum extends Pokemon {
  constructor() {
    super('beldum', 'tehral',[TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, 'EPIC', 374, 'metang', 90, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.METEOR_MASH);
  }
}

class Metang extends Pokemon {
  constructor() {
    super('metang', 'métang',[TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, 'EPIC', 375, 'metagross', 130, 9, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.METEOR_MASH);
  }
}

class Metagross extends Pokemon {
  constructor() {
    super('metagross', 'métalosse',[TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, 'EPIC', 376, '', 230, 20, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.METEOR_MASH);
  }
}

class Bagon extends Pokemon {
  constructor() {
    super('bagon', 'draby',[TYPE.DRAGON, TYPE.MONSTER], RARITY.EPIC, 'EPIC', 371, 'shelgon', 90, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Shelgon extends Pokemon {
  constructor() {
    super('shelgon', 'drackhaus',[TYPE.DRAGON, TYPE.MONSTER], RARITY.EPIC, 'EPIC', 372, 'salamence', 130, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Salamence extends Pokemon {
  constructor() {
    super('salamence', 'drattak',[TYPE.DRAGON, TYPE.MONSTER, TYPE.FLYING], RARITY.EPIC, 'EPIC', 373, '', 230, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Ralts extends Pokemon {
  constructor() {
    super('ralts', 'tarsal',[TYPE.PSYCHIC, TYPE.AMORPH], RARITY.EPIC, 'EPIC', 280, 'kirlia', 90, 5, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Kirlia extends Pokemon {
  constructor() {
    super('kirlia', 'kirlia',[TYPE.PSYCHIC, TYPE.AMORPH], RARITY.EPIC, 'EPIC', 281, 'gardevoir', 130, 9, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Gardevoir extends Pokemon {
  constructor() {
    super('gardevoir', 'gardevoir',[TYPE.PSYCHIC, TYPE.AMORPH], RARITY.EPIC, 'EPIC', 282, '', 230, 18, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Slakoth extends Pokemon {
  constructor() {
    super('slakoth', 'parecool',[TYPE.NORMAL, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 287, 'vigoroth', 90, 5, 4, 4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.SEISMIC_TOSS);
  }
}

class Vigoroth extends Pokemon {
  constructor() {
    super('vigoroth', 'vigoroth',[TYPE.NORMAL, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 288, 'slaking', 130, 9, 4, 4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SEISMIC_TOSS);
  }
}

class Slaking extends Pokemon {
  constructor() {
    super('slaking', 'monaflemit',[TYPE.NORMAL, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 289, '', 230, 20, 4, 4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.SEISMIC_TOSS);
  }
}

class Larvitar extends Pokemon {
  constructor() {
    super('larvitar', 'embrylex',[TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, 'EPIC', 246, 'pupitar', 90, 8, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.NASTY_PLOT);
  }
}

class Pupitar extends Pokemon {
  constructor() {
    super('pupitar', 'ymphect',[TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, 'EPIC', 247, 'tyranitar', 130, 9, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.NASTY_PLOT);
  }
}

class Tyranitar extends Pokemon {
  constructor() {
    super('tyranitar', 'tyranocif',[TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, 'EPIC', 248, '', 230, 20, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.NASTY_PLOT);
  }
}

class Dratini extends Pokemon {
  constructor() {
    super('dratini', 'minidraco',[TYPE.DRAGON, TYPE.AQUATIC], RARITY.EPIC, 'EPIC', 147, 'dragonair', 90, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DRAGON_BREATH);
  }
}

class Dragonair extends Pokemon {
  constructor() {
    super('dragonair', 'draco',[TYPE.DRAGON, TYPE.AQUATIC], RARITY.EPIC, 'EPIC', 148, 'dragonite', 130, 9, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DRAGON_BREATH);
  }
}

class Dragonite extends Pokemon {
  constructor() {
    super('dragonite', 'dracolosse',[TYPE.DRAGON, TYPE.AQUATIC, TYPE.FLYING], RARITY.EPIC, 'EPIC', 149, '', 230, 20, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DRAGON_BREATH);
  }
}

class Gastly extends Pokemon {
  constructor() {
    super('gastly', 'fantominus',[TYPE.DARK, TYPE.POISON, TYPE.AMORPH], RARITY.EPIC, 'EPIC', 92, 'haunter', 90, 5, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Haunter extends Pokemon {
  constructor() {
    super('haunter', 'spectrum',[TYPE.DARK, TYPE.POISON, TYPE.AMORPH], RARITY.EPIC, 'EPIC', 93, 'gengar', 130, 9, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Gengar extends Pokemon {
  constructor() {
    super('gengar', 'ectoplasma',[TYPE.DARK, TYPE.POISON, TYPE.AMORPH], RARITY.EPIC, 'EPIC', 94, '', 230, 18, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Abra extends Pokemon {
  constructor() {
    super('abra', 'abra',[TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 63, 'kadabra', 90, 5, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 30, SPECIAL_SKILL.TELEPORT);
  }
}

class Kadabra extends Pokemon {
  constructor() {
    super('kadabra', 'kadabra',[TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 64, 'alakazam', 130, 9, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 30, SPECIAL_SKILL.TELEPORT);
  }
}

class Alakazam extends Pokemon {
  constructor() {
    super('alakazam', 'alakazam',[TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC', 65, '', 230, 18, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 30, SPECIAL_SKILL.TELEPORT);
  }
}

class Litwick extends Pokemon {
  constructor() {
    super('litwick', 'funécire',[TYPE.FIRE, TYPE.AMORPH], RARITY.EPIC, 'EPIC2', 607, 'lampent', 90, 5, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.FIRE_BLAST);
  }
}

class Lampent extends Pokemon {
  constructor() {
    super('lampent', 'mélancolux',[TYPE.FIRE, TYPE.AMORPH], RARITY.EPIC, 'EPIC2', 608, 'chandelure', 130, 9, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.FIRE_BLAST);
  }
}

class Chandelure extends Pokemon {
  constructor() {
    super('chandelure', 'lugulabre',[TYPE.FIRE, TYPE.AMORPH], RARITY.EPIC, 'EPIC2', 609, '', 230, 18, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.FIRE_BLAST);
  }
}

class Poliwag extends Pokemon {
  constructor() {
    super('poliwag', 'ptitard',[TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE', 60, 'poliwhirl', 80, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.SOAK);
  }
}

class Poliwhirl extends Pokemon {
  constructor() {
    super('poliwhirl', 'tetarte',[TYPE.WATER, TYPE.FIGHTING, TYPE.AQUATIC], RARITY.RARE, 'RARE', 61, 'politoed', 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SOAK);
  }
}

class Politoed extends Pokemon {
  constructor() {
    super('politoed', 'tarpaud',[TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE', 186, '', 220, 18, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.SOAK);
  }
}

class Shinx extends Pokemon {
  constructor() {
    super('shinx', 'lixy',[TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, 'RARE', 403, 'luxio', 80, 5, 4, 4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.CHARGE);
  }
}

class Luxio extends Pokemon {
  constructor() {
    super('luxio', 'luxio',[TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, 'RARE', 404, 'luxray', 120, 9, 4, 4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.CHARGE);
  }
}

class Luxray extends Pokemon {
  constructor() {
    super('luxray', 'luxray',[TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, 'RARE', 405, '', 220, 20, 4, 4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.CHARGE);
  }
}

class Lotad extends Pokemon {
  constructor() {
    super('lotad', 'nénupiot',[TYPE.GRASS, TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE', 270, 'lombre', 80, 5, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Lombre extends Pokemon {
  constructor() {
    super('lombre', 'lombre',[TYPE.GRASS, TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE', 271, 'ludicolo', 120, 9, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Ludicolo extends Pokemon {
  constructor() {
    super('ludicolo', 'ludicolo',[TYPE.GRASS, TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE', 272, '', 220, 18, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Duskull extends Pokemon {
  constructor() {
    super('duskull', 'skélénox',[TYPE.DARK, TYPE.AMORPH], RARITY.RARE, 'RARE', 355, 'dusclops', 80, 5, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.NIGHT_SLASH);
  }
}

class Dusclops extends Pokemon {
  constructor() {
    super('dusclops', 'téraclope',[TYPE.DARK, TYPE.AMORPH], RARITY.RARE, 'RARE', 356, 'dusknoir', 120, 9, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.NIGHT_SLASH);
  }
}

class Dusknoir extends Pokemon {
  constructor() {
    super('dusknoir', 'noctunoir',[TYPE.DARK, TYPE.AMORPH], RARITY.RARE, 'RARE', 477, '', 220, 18, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.NIGHT_SLASH);
  }
}

class Togepi extends Pokemon {
  constructor() {
    super('togepi', 'togépi',[TYPE.NORMAL, TYPE.FAIRY, TYPE.PSYCHIC], RARITY.RARE, 'RARE', 175, 'togetic', 80, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 1, 50, SPECIAL_SKILL.WISH);
  }
}

class Togetic extends Pokemon {
  constructor() {
    super('togetic', 'togétic',[TYPE.NORMAL, TYPE.FAIRY, TYPE.PSYCHIC], RARITY.RARE, 'RARE', 176, 'togekiss', 120, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 2, 50, SPECIAL_SKILL.WISH);
  }
}

class Togekiss extends Pokemon {
  constructor() {
    super('togekiss', 'togekiss',[TYPE.NORMAL, TYPE.FAIRY, TYPE.PSYCHIC], RARITY.RARE, 'RARE', 468, '', 220, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 3, 50, SPECIAL_SKILL.WISH);
  }
}

class Rhyhorn extends Pokemon {
  constructor() {
    super('rhyhorn', 'rhinocorne',[TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE', 111, 'rhydon', 80, 5, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.STOMP);
  }
}

class Rhydon extends Pokemon {
  constructor() {
    super('rhydon', 'rhinoféros',[TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE', 112, 'rhyperior', 120, 9, 6, 6, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.STOMP);
  }
}

class Rhyperior extends Pokemon {
  constructor() {
    super('rhyperior', 'rhinastoc',[TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE', 464, '', 220, 20, 8, 8, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STOMP);
  }
}

class Magnemite extends Pokemon {
  constructor() {
    super('magnemite', 'magnéti',[TYPE.ELECTRIC, TYPE.METAL], RARITY.RARE, 'RARE', 81, 'magneton', 80, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Magneton extends Pokemon {
  constructor() {
    super('magneton', 'magnéton',[TYPE.ELECTRIC, TYPE.METAL], RARITY.RARE, 'RARE', 82, 'magnezone', 120, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Magnezone extends Pokemon {
  constructor() {
    super('magnezone', 'magnézone',[TYPE.ELECTRIC, TYPE.METAL], RARITY.RARE, 'RARE', 462, '', 220, 18, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Aron extends Pokemon {
  constructor() {
    super('aron', 'galékid',[TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE', 304, 'lairon', 80, 5, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.STOMP);
  }
}

class Lairon extends Pokemon {
  constructor() {
    super('lairon', 'galégon',[TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE', 305, 'aggron', 120, 9, 6, 6, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.STOMP);
  }
}

class Aggron extends Pokemon {
  constructor() {
    super('aggron', 'galéking',[TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE', 306, '', 220, 20, 8, 8, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STOMP);
  }
}

class Spheal extends Pokemon {
  constructor() {
    super('spheal', 'obalie',[TYPE.WATER, TYPE.FIELD, TYPE.ICE], RARITY.RARE, 'RARE', 363, 'sealeo', 80, 5, 4, 4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Sealeo extends Pokemon {
  constructor() {
    super('sealeo', 'phogleur',[TYPE.WATER, TYPE.FIELD, TYPE.ICE], RARITY.RARE, 'RARE', 364, 'walrein', 120, 9, 4, 4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Walrein extends Pokemon {
  constructor() {
    super('walrein', 'kaimorse',[TYPE.WATER, TYPE.FIELD, TYPE.ICE], RARITY.RARE, 'RARE', 365, '', 220, 20, 4, 4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Swinub extends Pokemon {
  constructor() {
    super('swinub', 'marcarin',[TYPE.GROUND, TYPE.ICE], RARITY.UNCOMMON, 'december', 220, 'piloswine', 80, 5, 4, 4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Piloswine extends Pokemon {
  constructor() {
    super('piloswine', 'cochignon',[TYPE.GROUND, TYPE.ICE], RARITY.UNCOMMON, 'december', 221, 'mamoswine', 120, 9, 4, 4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Mamoswine extends Pokemon {
  constructor() {
    super('mamoswine', 'mammochon',[TYPE.GROUND, TYPE.ICE], RARITY.UNCOMMON, 'december', 473, '', 220, 20, 6, 6, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Snover extends Pokemon {
  constructor() {
    super('snover', 'blizzi', [TYPE.GRASS, TYPE.ICE], RARITY.LEGENDARY, 'december', 459, 'abomasnow', 80, 7, 8, 8, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.FREEZE);
  }
}

class Abomasnow extends Pokemon {
  constructor() {
    super('abomasnow', 'blizzaroi',[TYPE.GRASS, TYPE.ICE], RARITY.LEGENDARY, 'december', 460, 'mega-abomasnow', 120, 11, 6, 6, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.FREEZE);
  }
}

class MegaAbomasnow extends Pokemon {
  constructor() {
    super('mega-abomasnow', 'méga-blizzaroi',[TYPE.GRASS, TYPE.ICE], RARITY.LEGENDARY, 'december', 4600, '', 220, 25, 8, 8, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.FREEZE);
  }
}

class Snorunt extends Pokemon {
  constructor() {
    super('snorunt', 'stalgamin',[TYPE.AMORPH, TYPE.ICE], RARITY.EPIC, 'december', 361, 'glalie', 80, 5, 2, 2, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Glalie extends Pokemon {
  constructor() {
    super('glalie', 'oniglali',[TYPE.AMORPH, TYPE.ICE], RARITY.EPIC, 'december', 362, 'froslass', 120, 9, 2, 2, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Froslass extends Pokemon {
  constructor() {
    super('froslass', 'momartik',[TYPE.AMORPH, TYPE.ICE], RARITY.EPIC, 'december', 478, '', 220, 20, 2, 2, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Vanillite extends Pokemon {
  constructor() {
    super('vanillite', 'sorbébé',[TYPE.FAIRY, TYPE.ICE], RARITY.RARE, 'december', 582, 'vanillish', 80, 5, 2, 2, 3, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.SLEEP);
  }
}

class Vanillish extends Pokemon {
  constructor() {
    super('vanillish', 'sorboul',[TYPE.FAIRY, TYPE.ICE], RARITY.RARE, 'december', 583, 'vanilluxe', 120, 8, 2, 2, 3, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SLEEP);
  }
}

class Vanilluxe extends Pokemon {
  constructor() {
    super('vanilluxe', 'sorbouboul',[TYPE.FAIRY, TYPE.ICE], RARITY.RARE, 'december', 584, '', 220, 19, 2, 2, 3, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.SLEEP);
  }
}

class Trapinch extends Pokemon {
  constructor() {
    super('trapinch', 'kraknoix',[TYPE.GROUND, TYPE.BUG], RARITY.RARE, 'RARE', 328, 'vibrava', 80, 5, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Vibrava extends Pokemon {
  constructor() {
    super('vibrava', 'vibranif',[TYPE.GROUND, TYPE.DRAGON, TYPE.BUG], RARITY.RARE, 'RARE', 329, 'flygon', 120, 9, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Flygon extends Pokemon {
  constructor() {
    super('flygon', 'libegon',[TYPE.GROUND, TYPE.DRAGON, TYPE.BUG], RARITY.RARE, 'RARE', 330, '', 220, 20, 4, 4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Horsea extends Pokemon {
  constructor() {
    super('horsea', 'hypotrempe',[TYPE.WATER, TYPE.AQUATIC, TYPE.DRAGON], RARITY.RARE, 'RARE', 116, 'seadra', 80, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Seadra extends Pokemon {
  constructor() {
    super('seadra', 'hypocéan', [TYPE.WATER, TYPE.DRAGON, TYPE.AQUATIC], RARITY.RARE, 'RARE', 117, 'kingdra', 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Kingdra extends Pokemon {
  constructor() {
    super('kingdra', 'hyporoi',[TYPE.WATER, TYPE.DRAGON, TYPE.AQUATIC], RARITY.RARE, 'RARE', 230, '', 220, 18, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Machop extends Pokemon {
  constructor() {
    super('machop', 'machoc',[TYPE.FIGHTING, TYPE.HUMAN], RARITY.RARE, 'RARE', 66, 'machoke', 80, 5, 4, 4, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Machoke extends Pokemon {
  constructor() {
    super('machoke', 'machopeur',[TYPE.FIGHTING, TYPE.HUMAN], RARITY.RARE, 'RARE', 67, 'machamp', 120, 9, 4, 4, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Machamp extends Pokemon {
  constructor() {
    super('machamp', 'mackogneur',[TYPE.FIGHTING, TYPE.HUMAN], RARITY.RARE, 'RARE', 68, '', 220, 20, 4, 4, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Pichu extends Pokemon {
  constructor() {
    super('pichu', 'pichu',[TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, 'RARE', 172, 'pikachu', 80, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Pikachu extends Pokemon {
  constructor() {
    super('pikachu', 'pikachu',[TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, 'RARE', 25, 'raichu', 120, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Raichu extends Pokemon {
  constructor() {
    super('raichu', 'raichu',[TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, 'RARE', 26, '', 220, 18, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Bulbasaur extends Pokemon {
  constructor() {
    super('bulbasaur', 'bulbizarre',[TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 1, 'ivysaur', 70, 5, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.ROOT);
  }
}

class Ivysaur extends Pokemon {
  constructor() {
    super('ivysaur', 'herbizarre',[TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 2, 'venusaur', 120, 9, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.ROOT);
  }
}

class Venusaur extends Pokemon {
  constructor() {
    super('venusaur', 'florizarre',[TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 3, '', 210, 18, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.ROOT);
  }
}

class Chikorita extends Pokemon {
  constructor() {
    super('chikorita', 'germignon',[TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 152, 'bayleef', 70, 5, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Bayleef extends Pokemon {
  constructor() {
    super('bayleef', 'macronium',[TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 153, 'meganium', 120, 9, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Meganium extends Pokemon {
  constructor() {
    super('meganium', 'meganium',[TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 154, '', 210, 20, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class NidoranF extends Pokemon {
  constructor() {
    super('nidoranF', 'nidoranF',[TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 29, 'nidorina', 70, 5, 3, 2, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class Nidorina extends Pokemon {
  constructor() {
    super('nidorina', 'nidorina',[TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 30, 'nidoqueen', 120, 9, 3, 2, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class Nidoqueen extends Pokemon {
  constructor() {
    super('nidoqueen', 'nidoqueen',[TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 31, '', 210, 20, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class NidoranM extends Pokemon {
  constructor() {
    super('nidoranM', 'nidoranM',[TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 32, 'nidorino', 70, 5, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.POISON);
  }
}

class Nidorino extends Pokemon {
  constructor() {
    super('nidorino', 'nidorino',[TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 33, 'nidoking', 120, 9, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.POISON);
  }
}

class Nidoking extends Pokemon {
  constructor() {
    super('nidoking', 'nidoking',[TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 34, '', 210, 20, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.POISON);
  }
}

class Piplup extends Pokemon {
  constructor() {
    super('piplup', 'tiplouf',[TYPE.WATER, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON', 393, 'prinplup', 70, 5, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Prinplup extends Pokemon {
  constructor() {
    super('prinplup', 'prinplouf',[TYPE.WATER, TYPE.FLYING, TYPE.METAL], RARITY.UNCOMMON, 'UNCOMMON', 394, 'empoleon', 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Empoleon extends Pokemon {
  constructor() {
    super('empoleon', 'pingoléon',[TYPE.WATER, TYPE.FLYING, TYPE.METAL], RARITY.UNCOMMON, 'UNCOMMON', 395, '', 210, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Chimchar extends Pokemon {
  constructor() {
    super('chimchar', 'ouisticram',[TYPE.FIRE, TYPE.HUMAN], RARITY.UNCOMMON, 'UNCOMMON', 390, 'monferno', 70, 5, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Monferno extends Pokemon {
  constructor() {
    super('monferno', 'chimpenfeu',[TYPE.FIRE, TYPE.HUMAN, TYPE.FIGHTING], RARITY.UNCOMMON, 'UNCOMMON', 391, 'infernape', 120, 9, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Infernape extends Pokemon {
  constructor() {
    super('infernape', 'simiabraz',[TYPE.FIRE, TYPE.HUMAN, TYPE.FIGHTING], RARITY.UNCOMMON, 'UNCOMMON', 392, '', 210, 20, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Turtwig extends Pokemon {
  constructor() {
    super('turtwig', 'tortipouss',[TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 387, 'grotle', 70, 5, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.STOMP);
  }
}

class Grotle extends Pokemon {
  constructor() {
    super('grotle', 'boskara',[TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 388, 'torterra', 120, 9, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.STOMP);
  }
}

class Torterra extends Pokemon {
  constructor() {
    super('torterra', 'torterra',[TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON', 389, '', 210, 20, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.STOMP);
  }
}

class Mudkip extends Pokemon {
  constructor() {
    super('mudkip', 'gobou',[TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, 'UNCOMMON', 258, 'marshtomp', 70, 5, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.SOAK);
  }
}

class Marshtomp extends Pokemon {
  constructor() {
    super('marshtomp', 'flobio',[TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, 'UNCOMMON', 259, 'swampert', 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SOAK);
  }
}

class Swampert extends Pokemon {
  constructor() {
    super('swampert', 'laggron',[TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, 'UNCOMMON', 260, '', 210, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.SOAK);
  }
}

class Torchic extends Pokemon {
  constructor() {
    super('torchic', 'poussifeu',[TYPE.FIRE, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON', 255, 'combusken', 70, 5, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BLAZE_KICK);
  }
}

class Combusken extends Pokemon {
  constructor() {
    super('combusken', 'galifeu',[TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON', 256, 'blaziken', 120, 9, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BLAZE_KICK);
  }
}

class Blaziken extends Pokemon {
  constructor() {
    super('blaziken', 'braségali',[TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON', 257, '', 210, 20, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BLAZE_KICK);
  }
}

class Treecko extends Pokemon {
  constructor() {
    super('treecko', 'arcko',[TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 252, 'grovyle', 70, 5, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.THIEF);
  }
}

class Grovyle extends Pokemon {
  constructor() {
    super('grovyle', 'massko',[TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 253, 'sceptile', 120, 9, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.THIEF);
  }
}

class Sceptile extends Pokemon {
  constructor() {
    super('sceptile', 'jungko',[TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 254, '', 210, 20, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.THIEF);
  }
}

class Totodile extends Pokemon {
  constructor() {
    super('totodile', 'kaiminus',[TYPE.WATER, TYPE.AQUATIC], RARITY.UNCOMMON, 'UNCOMMON', 158, 'croconaw', 70, 5, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BITE);
  }
}

class Croconaw extends Pokemon {
  constructor() {
    super('croconaw', 'crocodil',[TYPE.WATER, TYPE.AQUATIC], RARITY.UNCOMMON, 'UNCOMMON', 159, 'feraligatr', 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BITE);
  }
}

class Feraligatr extends Pokemon {
  constructor() {
    super('feraligatr', 'aligatueur',[TYPE.WATER, TYPE.AQUATIC], RARITY.UNCOMMON, 'UNCOMMON', 160, '', 210, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BITE);
  }
}

class Cyndaquil extends Pokemon {
  constructor() {
    super('cyndaquil', 'héricendre',[TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 155, 'quilava', 70, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.WHEEL_OF_FIRE);
  }
}

class Quilava extends Pokemon {
  constructor() {
    super('quilava', 'feurisson',[TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 156, 'typhlosion', 120, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.WHEEL_OF_FIRE);
  }
}

class Typhlosion extends Pokemon {
  constructor() {
    super('typhlosion', 'typhlosion',[TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 157, '', 210, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.WHEEL_OF_FIRE);
  }
}

class Charmander extends Pokemon {
  constructor() {
    super('charmander', 'salamèche',[TYPE.FIRE, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 4, 'charmeleon', 70, 5, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BLAST_BURN);
  }
}

class Charmeleon extends Pokemon {
  constructor() {
    super('charmeleon', 'reptincel',[TYPE.FIRE, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 5, 'charizard', 120, 9, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BLAST_BURN);
  }
}

class Charizard extends Pokemon {
  constructor() {
    super('charizard', 'dracaufeu',[TYPE.FIRE, TYPE.MONSTER, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON', 6, '', 210, 20, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BLAST_BURN);
  }
}

class Slowpoke extends Pokemon {
  constructor() {
    super('slowpoke', 'ramoloss',[TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, 'UNCOMMON2', 79, 'slowbro', 70, 5, 2, 2, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.SOAK);
  }
}

class Slowbro extends Pokemon {
  constructor() {
    super('slowbro', 'flagadoss',[TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, 'UNCOMMON2', 80, 'slowking', 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SOAK);
  }
}

class Slowking extends Pokemon {
  constructor() {
    super('slowking', 'roigada',[TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, 'UNCOMMON2', 199, '', 210, 20, 4, 4, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.SOAK);
  }
}

class Squirtle extends Pokemon {
  constructor() {
    super('squirtle', 'carapuce',[TYPE.WATER, TYPE.AQUATIC, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 7, 'wartortle', 70, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Wartortle extends Pokemon {
  constructor() {
    super('wartortle', 'carabaffe',[TYPE.WATER, TYPE.AQUATIC, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 8, 'blastoise', 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Blastoise extends Pokemon {
  constructor() {
    super('blastoise', 'tortank',[TYPE.WATER, TYPE.AQUATIC, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 9, '', 210, 20, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Geodude extends Pokemon {
  constructor() {
    super('geodude', 'racaillou',[TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, 'COMMON', 74, 'graveler', 60, 5, 2, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Graveler extends Pokemon {
  constructor() {
    super('graveler', 'gravalanch',[TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, 'COMMON', 75, 'golem', 110, 9, 4, 4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Golem extends Pokemon {
  constructor() {
    super('golem', 'grolem',[TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, 'COMMON', 76, '', 200, 20, 8, 8, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Azurill extends Pokemon {
  constructor() {
    super('azurill', 'azurill',[TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, 'COMMON', 298, 'marill', 60, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Marill extends Pokemon {
  constructor() {
    super('marill', 'marill',[TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, 'COMMON', 183, 'azumarill', 110, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Azumarill extends Pokemon {
  constructor() {
    super('azumarill', 'azumarill',[TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, 'COMMON', 184, '', 200, 20, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Zubat extends Pokemon {
  constructor() {
    super('zubat', 'nosferapti',[TYPE.POISON, TYPE.FLYING], RARITY.COMMON, 'COMMON', 41, 'golbat', 60, 5, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.LEECH_LIFE);
  }
}

class Golbat extends Pokemon {
  constructor() {
    super('golbat', 'nosferalto',[TYPE.POISON, TYPE.FLYING], RARITY.COMMON, 'COMMON', 42, 'crobat', 110, 9, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.LEECH_LIFE);
  }
}

class Crobat extends Pokemon {
  constructor() {
    super('crobat', 'nostenfer',[TYPE.POISON, TYPE.FLYING], RARITY.COMMON, 'COMMON', 169, '', 200, 18, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.LEECH_LIFE);
  }
}

class Mareep extends Pokemon {
  constructor() {
    super('mareep', 'wattouat',[TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, 'COMMON', 179, 'flaffy', 60, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Flaffy extends Pokemon {
  constructor() {
    super('flaffy', 'lainergie',[TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, 'COMMON', 180, 'ampharos', 110, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Ampharos extends Pokemon {
  constructor() {
    super('ampharos', 'pharamp',[TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, 'COMMON', 181, '', 200, 18, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Cleffa extends Pokemon {
  constructor() {
    super('cleffa', 'mélo',[TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON', 173, 'clefairy', 60, 5, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.METRONOME);
  }
}

class Clefairy extends Pokemon {
  constructor() {
    super('clefairy', 'mélofée',[TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON', 35, 'clefable', 110, 9, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.METRONOME);
  }
}

class Clefable extends Pokemon {
  constructor() {
    super('clefable', 'mélodelfe',[TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON', 36, '', 200, 18, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.METRONOME);
  }
}

class Igglybuff extends Pokemon {
  constructor() {
    super('igglybuff', 'toudoudou',[TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON', 174, 'jigglypuff', 60, 5, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.SLEEP);
  }
}

class Jigglypuff extends Pokemon {
  constructor() {
    super('jigglypuff', 'rondoudou',[TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON', 39, 'wigglytuff', 110, 9, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.SLEEP);
  }
}

class Wigglytuff extends Pokemon {
  constructor() {
    super('wigglytuff', 'grodoudou',[TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON', 40, '', 200, 18, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.SLEEP);
  }
}

class Caterpie extends Pokemon {
  constructor() {
    super('caterpie', 'chenipan',[TYPE.GRASS, TYPE.BUG], RARITY.COMMON, 'COMMON', 10, 'metapod', 60, 5, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Metapod extends Pokemon {
  constructor() {
    super('metapod', 'chrysacier',[TYPE.GRASS, TYPE.BUG], RARITY.COMMON, 'COMMON', 11, 'butterfree', 110, 9, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Butterfree extends Pokemon {
  constructor() {
    super('butterfree', 'papilusion',[TYPE.GRASS, TYPE.BUG, TYPE.FLYING], RARITY.COMMON, 'COMMON', 12, '', 200, 18, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Weedle extends Pokemon {
  constructor() {
    super('weedle', 'aspicot',[TYPE.POISON, TYPE.BUG], RARITY.COMMON, 'COMMON', 13, 'kakuna', 60, 5, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Kakuna extends Pokemon {
  constructor() {
    super('kakuna', 'coconfort',[TYPE.POISON, TYPE.BUG], RARITY.COMMON, 'COMMON', 14, 'beedrill', 110, 9, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Beedrill extends Pokemon {
  constructor() {
    super('beedrill', 'dardagnan',[TYPE.POISON, TYPE.BUG, TYPE.FLYING], RARITY.COMMON, 'COMMON', 15, '', 200, 20, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Pidgey extends Pokemon {
  constructor() {
    super('pidgey', 'roucool',[TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON', 16, 'pidgeotto', 60, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Pidgeotto extends Pokemon {
  constructor() {
    super('pidgeotto', 'roucoups',[TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON', 17, 'pidgeot', 110, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Pidgeot extends Pokemon {
  constructor() {
    super('pidgeot', 'roucarnage',[TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON', 18, '', 200, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Hoppip extends Pokemon {
  constructor() {
    super('hoppip', 'granivol',[TYPE.GRASS, TYPE.FLYING, TYPE.FLORA], RARITY.COMMON, 'COMMON', 187, 'skiploom', 60, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Skiploom extends Pokemon {
  constructor() {
    super('skiploom', 'floravol',[TYPE.GRASS, TYPE.FLYING, TYPE.FLORA], RARITY.COMMON, 'COMMON', 188, 'jumpluff', 110, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Jumpluff extends Pokemon {
  constructor() {
    super('jumpluff', 'cotovol',[TYPE.GRASS, TYPE.FLYING, TYPE.FLORA], RARITY.COMMON, 'COMMON', 189, '', 220, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Seedot extends Pokemon {
  constructor() {
    super('seedot', 'granipiot',[TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, 'COMMON', 273, 'nuzleaf', 60, 5, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.THIEF);
  }
}

class Nuzleaf extends Pokemon {
  constructor() {
    super('nuzleaf', 'pifeuil',[TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, 'COMMON', 274, 'shiftry', 110, 9, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.THIEF);
  }
}

class Shiftry extends Pokemon {
  constructor() {
    super('shiftry', 'tengalice',[TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, 'COMMON', 275, '', 200, 20, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.THIEF);
  }
}

class Starly extends Pokemon {
  constructor() {
    super('starly', 'étourmi',[TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON', 396, 'staravia', 60, 5, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Staravia extends Pokemon {
  constructor() {
    super('staravia', 'étourvol',[TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON', 397, 'staraptor', 110, 9, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Staraptor extends Pokemon {
  constructor() {
    super('staraptor', 'étouraptor',[TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON', 398, '', 200, 20, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Bellsprout extends Pokemon {
  constructor() {
    super('bellsprout', 'chétiflor',[TYPE.GRASS, TYPE.POISON], RARITY.COMMON, 'december', 69, 'weepinbell', 60, 5, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ROOT);
  }
}

class Weepinbell extends Pokemon {
  constructor() {
    super('weepinbell', 'boustiflor',[TYPE.GRASS, TYPE.POISON], RARITY.COMMON, 'december', 70, 'victreebel', 110, 9, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROOT);
  }
}

class Victreebel extends Pokemon {
  constructor() {
    super('victreebel', 'empiflor',[TYPE.GRASS, TYPE.POISON], RARITY.COMMON, 'december', 71, '', 200, 20, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.ROOT);
  }
}

class Magikarp extends Pokemon {
  constructor() {
    super('magikarp', 'magicarpe',[TYPE.WATER], RARITY.NEUTRAL, 'NEUTRAL', 129, '', 30, 1, 1, 1, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Gyarados extends Pokemon {
  constructor() {
    super('gyarados', 'léviator',[TYPE.WATER], RARITY.NEUTRAL, 'NEUTRAL', 130, '', 200, 20, 5, 1, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Rattata extends Pokemon {
  constructor() {
    super('rattata', 'ratatta',[TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL', 19, '', 30, 5, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Raticate extends Pokemon {
  constructor() {
    super('raticate', 'ratattac',[TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL', 20, '', 60, 7, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Spearow extends Pokemon {
  constructor() {
    super('spearow', 'piafabec',[TYPE.FLYING, TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL', 21, '', 30, 5, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Fearow extends Pokemon {
  constructor() {
    super('fearow', 'rapasdepic',[TYPE.FLYING, TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL', 22, '', 60, 7, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Lugia extends Pokemon {
  constructor() {
    super('lugia', 'lugia',[TYPE.AQUATIC, TYPE.NORMAL], RARITY.MYTHICAL, 'NEUTRAL', 249, '', 300, 30, 5, 5, 4, 'FLYING/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Giratina extends Pokemon {
  constructor() {
    super('giratina', 'giratina',[TYPE.DRAGON, TYPE.AMORPH], RARITY.MYTHICAL, 'NEUTRAL', 487, '', 300, 30, 5, 5, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.NIGHT_SLASH);
  }
}

class Zapdos extends Pokemon {
  constructor() {
    super('zapdos', 'électhor',[TYPE.ELECTRIC, TYPE.FLYING], RARITY.MYTHICAL, 'NEUTRAL', 145, '', 200, 20, 3, 3, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.CHARGE);
  }
}

class Moltres extends Pokemon {
  constructor() {
    super('moltres', 'sulfura',[TYPE.FIRE, TYPE.FLYING], RARITY.MYTHICAL, 'NEUTRAL', 146, '', 200, 20, 3, 3, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.WHEEL_OF_FIRE);
  }
}

class Articuno extends Pokemon {
  constructor() {
    super('articuno', 'artikodin',[TYPE.ICE, TYPE.FLYING], RARITY.MYTHICAL, 'NEUTRAL', 144, '', 200, 20, 3, 3, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.FREEZE);
  }
}

class Dialga extends Pokemon {
  constructor() {
    super('dialga', 'dialga',[TYPE.METAL, TYPE.DRAGON], RARITY.MYTHICAL, 'NEUTRAL', 483, '', 300, 30, 5, 5, 2, 'DRAGON/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Palkia extends Pokemon {
  constructor() {
    super('palkia', 'palkia',[TYPE.DRAGON, TYPE.WATER], RARITY.MYTHICAL, 'NEUTRAL', 484, '', 300, 30, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Suicune extends Pokemon {
  constructor() {
    super('suicune', 'suicune',[TYPE.WATER, TYPE.AQUATIC], RARITY.MYTHICAL, 'NEUTRAL', 245, '', 300, 30, 5, 5, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Raikou extends Pokemon {
  constructor() {
    super('raikou', 'raikou',[TYPE.ELECTRIC, TYPE.FIELD], RARITY.MYTHICAL, 'NEUTRAL', 243, '', 300, 30, 5, 5, 1, 'ELETRIC/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Entei extends Pokemon {
  constructor() {
    super('entei', 'entei',[TYPE.FIRE, TYPE.FIELD], RARITY.MYTHICAL, 'NEUTRAL', 244, '', 300, 30, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.FIRE_BLAST);
  }
}

class Regice extends Pokemon {
  constructor() {
    super('regice', 'régice',[TYPE.ICE, TYPE.HUMAN], RARITY.MYTHICAL, 'NEUTRAL', 378, '', 200, 20, 3, 3, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Regirock extends Pokemon {
  constructor() {
    super('regirock', 'régirock',[TYPE.MINERAL, TYPE.HUMAN], RARITY.MYTHICAL, 'NEUTRAL', 377, '', 200, 20, 3, 3, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Registeel extends Pokemon {
  constructor() {
    super('registeel', 'régisteel',[TYPE.METAL, TYPE.HUMAN], RARITY.MYTHICAL, 'NEUTRAL', 379, '', 200, 20, 3, 3, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.IRON_DEFENSE);
  }
}

class Regigigas extends Pokemon {
  constructor() {
    super('regigigas', 'régigigas',[TYPE.NORMAL, TYPE.MONSTER, TYPE.HUMAN], RARITY.MYTHICAL, 'NEUTRAL', 486, '', 300, 30, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Kyogre extends Pokemon {
  constructor() {
    super('kyogre', 'kyogre',[TYPE.WATER, TYPE.AQUATIC], RARITY.MYTHICAL, 'NEUTRAL', 382, '', 300, 30, 5, 5, 4, 'WATER/range', ATTACK_TYPE.SPECIAL, 1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Groudon extends Pokemon {
  constructor() {
    super('groudon', 'groudon',[TYPE.GROUND, TYPE.FIRE], RARITY.MYTHICAL, 'NEUTRAL', 383, '', 300, 30, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Rayquaza extends Pokemon {
  constructor() {
    super('rayquaza', 'rayquaza',[TYPE.DRAGON, TYPE.FLYING], RARITY.MYTHICAL, 'NEUTRAL', 384, '', 300, 30, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Eevee extends Pokemon {
  constructor() {
    super('eevee', 'évoli',[TYPE.NORMAL, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 133, '', 130, 5, 2, 2, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Vaporeon extends Pokemon {
  constructor() {
    super('vaporeon', 'aquali',[TYPE.WATER, TYPE.AQUATIC, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 134, '', 130, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Jolteon extends Pokemon {
  constructor() {
    super('jolteon', 'voltali',[TYPE.ELECTRIC, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 135, '', 130, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Flareon extends Pokemon {
  constructor() {
    super('flareon', 'pyroli',[TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 136, '', 130, 9, 3, 2, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Espeon extends Pokemon {
  constructor() {
    super('espeon', 'mentali',[TYPE.PSYCHIC, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 196, '', 130, 9, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Umbreon extends Pokemon {
  constructor() {
    super('umbreon', 'noctali',[TYPE.DARK, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 197, '', 130, 9, 3, 2, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Leafon extends Pokemon {
  constructor() {
    super('leafon', 'phylali',[TYPE.GRASS, TYPE.FLORA, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 470, '', 130, 9, 3, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Sylveon extends Pokemon {
  constructor() {
    super('sylveon', 'nymphali',[TYPE.FAIRY, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON', 700, '', 130, 9, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Glaceon extends Pokemon {
  constructor() {
    super('glaceon', 'givrali',[TYPE.ICE, TYPE.FIELD], RARITY.UNCOMMON, 'december', 471, '', 130, 9, 1, 1, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Sandshrew extends Pokemon {
  constructor() {
    super('sandshrew', 'sabelette',[TYPE.GROUND, TYPE.FIELD], RARITY.NEUTRAL, 'NEUTRAL', 27, '', 70, 5, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL, 1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Darkrai extends Pokemon {
  constructor() {
    super('darkrai', 'darkrai',[TYPE.DARK], RARITY.MYTHICAL, 'NEUTRAL', 491, '', 200, 20, 3, 3, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Volcarona extends Pokemon {
  constructor() {
    super('volcarona', 'pyrax',[TYPE.FIRE, TYPE.BUG], RARITY.MYTHICAL, 'february', 637, '', 200, 20, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.FIRE_BLAST);
  }
}

class Landorus extends Pokemon {
  constructor() {
    super('landorus', 'démétéros',[TYPE.GROUND, TYPE.FLYING], RARITY.MYTHICAL, 'february', 645, '', 200, 20, 3, 3, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Thundurus extends Pokemon {
  constructor() {
    super('thundurus', 'fulguris',[TYPE.ELECTRIC, TYPE.FLYING], RARITY.MYTHICAL, 'february', 642, '', 200, 20, 3, 3, 3, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Tornadus extends Pokemon {
  constructor() {
    super('tornadus', 'boréas',[TYPE.FLYING], RARITY.MYTHICAL, 'february', 641, '', 200, 20, 3, 3, 3, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Keldeo extends Pokemon {
  constructor() {
    super('keldeo', 'keldeo',[TYPE.WATER, TYPE.FIGHTING], RARITY.MYTHICAL, 'february', 647, '', 200, 20, 3, 3, 2, 'WATER/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Terrakion extends Pokemon {
  constructor() {
    super('terrakion', 'terrakium',[TYPE.MINERAL, TYPE.FIGHTING], RARITY.MYTHICAL, 'february', 639, '', 200, 20, 3, 3, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Virizion extends Pokemon {
  constructor() {
    super('virizion', 'viridium',[TYPE.GRASS, TYPE.FIGHTING], RARITY.MYTHICAL, 'february', 640, '', 200, 20, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SEISMIC_TOSS);
  }
}

class Cobalion extends Pokemon {
  constructor() {
    super('cobalion', 'cobaltium',[TYPE.METAL, TYPE.FIGHTING], RARITY.MYTHICAL, 'february', 638, '', 200, 20, 3, 3, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SEISMIC_TOSS);
  }
}

class Manaphy extends Pokemon {
  constructor() {
    super('manaphy', 'manaphy',[TYPE.WATER, TYPE.BUG], RARITY.MYTHICAL, 'february', 490, '', 200, 20, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.NASTY_PLOT);
  }
}

class Rotom extends Pokemon {
  constructor() {
    super('rotom', 'motisma',[TYPE.ELECTRIC, TYPE.AMORPH], RARITY.MYTHICAL, 'february', 479, '', 200, 20, 3, 3, 3, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Spiritomb extends Pokemon {
  constructor() {
    super('spiritomb', 'spiritomb',[TYPE.DARK, TYPE.AMORPH], RARITY.MYTHICAL, 'february', 442, '', 200, 20, 3, 3, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.NIGHT_SLASH);
  }
}

class Absol extends Pokemon {
  constructor() {
    super('absol', 'absol',[TYPE.DARK, TYPE.FIELD], RARITY.MYTHICAL, 'february', 359, '', 200, 20, 3, 3, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.THIEF);
  }
}

class Lapras extends Pokemon {
  constructor() {
    super('lapras', 'lokhlass',[TYPE.WATER, TYPE.ICE], RARITY.MYTHICAL, 'february', 131, '', 200, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.SOAK);
  }
}

class Latias extends Pokemon {
  constructor() {
    super('latias', 'latias',[TYPE.PSYCHIC, TYPE.DRAGON], RARITY.MYTHICAL, 'february', 380, '', 200, 20, 3, 3, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Latios extends Pokemon {
  constructor() {
    super('latios', 'latios',[TYPE.PSYCHIC, TYPE.DRAGON], RARITY.MYTHICAL, 'february', 381, '', 200, 20, 3, 3, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Uxie extends Pokemon {
  constructor() {
    super('uxie', 'créhelf',[TYPE.PSYCHIC, TYPE.FAIRY], RARITY.MYTHICAL, 'february', 480, '', 200, 20, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Mesprit extends Pokemon {
  constructor() {
    super('mesprit', 'créfollet',[TYPE.PSYCHIC, TYPE.FAIRY], RARITY.MYTHICAL, 'february', 481, '', 200, 20, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Azelf extends Pokemon {
  constructor() {
    super('azelf', 'créfadet',[TYPE.PSYCHIC, TYPE.FAIRY], RARITY.MYTHICAL, 'february', 482, '', 200, 20, 3, 3, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 2, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Aerodactyl extends Pokemon {
  constructor() {
    super('aerodactyl', 'ptéra',[TYPE.FLYING, TYPE.MINERAL], RARITY.MYTHICAL, 'february', 142, '', 200, 20, 3, 3, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL, 2, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Mewtwo extends Pokemon {
  constructor() {
    super('mewtwo', 'mewtwo',[TYPE.PSYCHIC, TYPE.MONSTER], RARITY.MYTHICAL, 'february', 150, '', 300, 30, 5, 5, 3, 'PSYCHIC/range', ATTACK_TYPE.TRUE, 3, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Kyurem extends Pokemon {
  constructor() {
    super('kyurem', 'kyurem',[TYPE.DRAGON, TYPE.MONSTER, TYPE.ICE], RARITY.MYTHICAL, 'february', 646, '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.FREEZE);
  }
}

class Reshiram extends Pokemon {
  constructor() {
    super('reshiram', 'reshiram',[TYPE.DRAGON, TYPE.FIRE], RARITY.MYTHICAL, 'february', 643, '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.BURN);
  }
}

class Zekrom extends Pokemon {
  constructor() {
    super('zekrom', 'zekrom',[TYPE.DRAGON, TYPE.ELECTRIC], RARITY.MYTHICAL, 'february', 644, '', 300, 30, 5, 5, 3, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Celebi extends Pokemon {
  constructor() {
    super('celebi', 'celebi',[TYPE.GRASS, TYPE.PSYCHIC], RARITY.MYTHICAL, 'february', 251, '', 300, 30, 5, 5, 3, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.LEECH_LIFE);
  }
}

class Victini extends Pokemon {
  constructor() {
    super('victini', 'victini',[TYPE.FIRE, TYPE.PSYCHIC], RARITY.MYTHICAL, 'february', 494, '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.BURN);
  }
}

class Jirachi extends Pokemon {
  constructor() {
    super('jirachi', 'jirachi',[TYPE.METAL, TYPE.PSYCHIC], RARITY.MYTHICAL, 'february', 385, '', 300, 30, 5, 5, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.WISH);
  }
}

class Arceus extends Pokemon {
  constructor() {
    super('arceus', 'arceus',[TYPE.NORMAL, TYPE.FIELD], RARITY.MYTHICAL, 'february', 493, '', 300, 30, 5, 5, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Deoxys extends Pokemon {
  constructor() {
    super('deoxys', 'deoxys',[TYPE.PSYCHIC, TYPE.HUMAN], RARITY.MYTHICAL, 'february', 386, '', 300, 30, 5, 5, 1, 'PSYCHIC/melee', ATTACK_TYPE.PHYSICAL, 3, 100, SPECIAL_SKILL.PROTECT);
  }
}

class Shaymin extends Pokemon {
  constructor() {
    super('shaymin', 'shaymin',[TYPE.GRASS, TYPE.FLORA], RARITY.MYTHICAL, 'february', 492, '', 300, 30, 5, 5, 3, 'GRASS/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.SILENCE);
  }
}

class Cresselia extends Pokemon {
  constructor() {
    super('cresselia', 'cresselia',[TYPE.PSYCHIC, TYPE.FAIRY], RARITY.MYTHICAL, 'february', 488, '', 300, 30, 5, 5, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.WISH);
  }
}

class Heatran extends Pokemon {
  constructor() {
    super('heatran', 'heatran',[TYPE.FIRE, TYPE.METAL], RARITY.MYTHICAL, 'february', 485, '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.BURN);
  }
}

class HooH extends Pokemon {
  constructor() {
    super('ho-Oh', 'ho-Oh',[TYPE.FIRE, TYPE.FLYING], RARITY.MYTHICAL, 'february', 250, '', 300, 30, 5, 5, 3, 'FIRE/range', ATTACK_TYPE.SPECIAL, 3, 100, SPECIAL_SKILL.BURN);
  }
}

schema.defineTypes(Pokemon, {
  id: 'string',
  name: 'string',
  types: ['string'],
  rarity: 'string',
  sheet: 'string',
  index: 'uint16',
  evolution: 'string',
  positionX: 'uint8',
  positionY: 'uint8',
  cost: 'uint8',
  attackSprite: 'string',
  atkSpeed: 'uint16',
  def: 'uint8',
  speDef: 'uint8',
  attackType: 'string',
  atk: 'uint8',
  hp: 'uint16',
  range: 'uint8',
  stars: 'uint8',
  maxMana: 'uint8',
  skill: 'string',
  items: Items,
  frenchName:'string'
});

module.exports = {
  Pokemon,
  Ditto,
  Bulbasaur,
  Ivysaur,
  Venusaur,
  Charmander,
  Charmeleon,
  Charizard,
  Squirtle,
  Wartortle,
  Blastoise,
  Geodude,
  Graveler,
  Golem,
  Azurill,
  Marill,
  Azumarill,
  Zubat,
  Golbat,
  Crobat,
  Mareep,
  Flaffy,
  Ampharos,
  Cleffa,
  Clefairy,
  Clefable,
  Igglybuff,
  Wigglytuff,
  Jigglypuff,
  Caterpie,
  Metapod,
  Butterfree,
  Weedle,
  Kakuna,
  Beedrill,
  Pidgey,
  Pidgeotto,
  Pidgeot,
  Hoppip,
  Skiploom,
  Jumpluff,
  Seedot,
  Nuzleaf,
  Shiftry,
  Starly,
  Staravia,
  Staraptor,
  Chikorita,
  Bayleef,
  Meganium,
  Cyndaquil,
  Quilava,
  Typhlosion,
  Totodile,
  Croconaw,
  Feraligatr,
  Treecko,
  Grovyle,
  Sceptile,
  Torchic,
  Combusken,
  Blaziken,
  Mudkip,
  Marshtomp,
  Swampert,
  Turtwig,
  Grotle,
  Torterra,
  Chimchar,
  Monferno,
  Infernape,
  Piplup,
  Prinplup,
  Empoleon,
  NidoranF,
  Nidorina,
  Nidoqueen,
  NidoranM,
  Nidorino,
  Nidoking,
  Pichu,
  Pikachu,
  Raichu,
  Machop,
  Machoke,
  Machamp,
  Horsea,
  Seadra,
  Kingdra,
  Trapinch,
  Vibrava,
  Flygon,
  Spheal,
  Sealeo,
  Walrein,
  Aron,
  Lairon,
  Aggron,
  Magnemite,
  Magneton,
  Magnezone,
  Rhyhorn,
  Rhydon,
  Rhyperior,
  Togepi,
  Togetic,
  Togekiss,
  Duskull,
  Dusclops,
  Dusknoir,
  Lotad,
  Lombre,
  Ludicolo,
  Shinx,
  Luxio,
  Luxray,
  Poliwag,
  Poliwhirl,
  Politoed,
  Abra,
  Kadabra,
  Alakazam,
  Gastly,
  Haunter,
  Gengar,
  Dratini,
  Dragonair,
  Dragonite,
  Larvitar,
  Pupitar,
  Tyranitar,
  Slakoth,
  Vigoroth,
  Slaking,
  Ralts,
  Kirlia,
  Gardevoir,
  Bagon,
  Shelgon,
  Salamence,
  Beldum,
  Metang,
  Metagross,
  Gible,
  Gabite,
  Garchomp,
  Elekid,
  Electabuzz,
  Electivire,
  Magby,
  Magmar,
  Magmortar,
  Munchlax,
  Snorlax,
  Growlithe,
  Arcanine,
  Onix,
  Steelix,
  MegaSteelix,
  Scyther,
  Scizor,
  MegaScizor,
  Riolu,
  Lucario,
  MegaLucario,
  Magikarp,
  Rattata,
  Raticate,
  Spearow,
  Fearow,
  Gyarados,
  Lugia,
  Giratina,
  Zapdos,
  Moltres,
  Articuno,
  Dialga,
  Palkia,
  Suicune,
  Raikou,
  Entei,
  Regice,
  Regirock,
  Registeel,
  Kyogre,
  Groudon,
  Rayquaza,
  Regigigas,
  Eevee,
  Vaporeon,
  Jolteon,
  Flareon,
  Espeon,
  Umbreon,
  Leafon,
  Sylveon,
  Meditite,
  Medicham,
  MegaMedicham,
  Numel,
  Camerupt,
  MegaCamerupt,
  Sandshrew,
  Darkrai,
  Litwick,
  Lampent,
  Chandelure,
  Slowpoke,
  Slowbro,
  Slowking,
  Bellsprout,
  Weepinbell,
  Victreebel,
  Swinub,
  Piloswine,
  Mamoswine,
  Snorunt,
  Glalie,
  Froslass,
  Snover,
  Abomasnow,
  MegaAbomasnow,
  Vanillite,
  Vanillish,
  Vanilluxe,
  Glaceon,
  Volcarona,
  Landorus,
  Thundurus,
  Tornadus,
  Keldeo,
  Terrakion,
  Virizion,
  Cobalion,
  Manaphy,
  Rotom,
  Spiritomb,
  Absol,
  Lapras,
  Latias,
  Latios,
  Mesprit,
  Azelf,
  Uxie,
  Mewtwo,
  Kyurem,
  Reshiram,
  Zekrom,
  Celebi,
  Victini,
  Jirachi,
  Arceus,
  Deoxys,
  Shaymin,
  Cresselia,
  Heatran,
  HooH,
  Aerodactyl
};
