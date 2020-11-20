/* eslint-disable max-len */

const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const uniqid = require('uniqid');
const ArraySchema = schema.ArraySchema;
const {SPECIAL_SKILL, TYPE, RARITY, COST, ATTACK_TYPE} = require('./enum');
const ItemFactory = require('./item-factory');
const Items = require('./items');

class Pokemon extends Schema {
  constructor(name, types, rarity, sheet, index, evolution, hp, atk, def, speDef, range, attackSprite, attackType, stars, maxMana, skill) {
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
      skill: skill
    });
    //this.items.add(ItemFactory.createRandomStone());
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

class Ditto extends Pokemon{
  constructor() {
    super('ditto', [TYPE.NORMAL], RARITY.LEGENDARY, 'LEGENDARY',  132, '', 30, 1, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Riolu extends Pokemon {
  constructor() {
    super('riolu', [TYPE.FIGHTING, TYPE.HUMAN], RARITY.LEGENDARY, 'LEGENDARY', 447, 'lucario', 90, 5, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.NASTY_PLOT);
  }
}

class Lucario extends Pokemon {
  constructor() {
    super('lucario', [TYPE.FIGHTING, TYPE.HUMAN], RARITY.LEGENDARY, 'LEGENDARY',  448, 'mega-lucario', 130, 9, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.NASTY_PLOT);
  }
}

class MegaLucario extends Pokemon {
  constructor() {
    super('mega-lucario', [TYPE.FIGHTING, TYPE.HUMAN], RARITY.LEGENDARY, 'LEGENDARY',  4480, '', 230, 18, 1, 1, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.NASTY_PLOT);
  }
}

class Scyther extends Pokemon {
  constructor() {
    super('scyther', [TYPE.BUG, TYPE.NORMAL], RARITY.LEGENDARY, 'LEGENDARY',  123, 'scizor', 90, 5, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,1, 50, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Scizor extends Pokemon {
  constructor() {
    super('scizor', [TYPE.BUG, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY',  212, 'mega-scizor', 130, 9, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,2, 50, SPECIAL_SKILL.GUILLOTINE);
  }
}

class MegaScizor extends Pokemon {
  constructor() {
    super('mega-scizor', [TYPE.BUG, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY',  2120, '', 230, 18, 2, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,3, 50, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Onix extends Pokemon {
  constructor() {
    super('onix', [TYPE.MINERAL, TYPE.GROUND], RARITY.LEGENDARY, 'LEGENDARY',  95, 'steelix', 90, 5, 5, 5, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.IRON_DEFENSE);
  }
}

class Steelix extends Pokemon {
  constructor() {
    super('steelix', [TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY',  208, 'mega-steelix', 130, 9, 5, 5, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.IRON_DEFENSE);
  }
}

class MegaSteelix extends Pokemon {
  constructor() {
    super('mega-steelix', [TYPE.MINERAL, TYPE.GROUND, TYPE.METAL], RARITY.LEGENDARY, 'LEGENDARY',  2080, '', 230, 20, 10, 10, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.IRON_DEFENSE);
  }
}

class Growlithe extends Pokemon {
  constructor() {
    super('growlithe', [TYPE.FIRE, TYPE.FIELD], RARITY.LEGENDARY, 'LEGENDARY',  58, 'arcanine', 90, 9, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Arcanine extends Pokemon {
  constructor() {
    super('arcanine', [TYPE.FIRE, TYPE.FIELD], RARITY.LEGENDARY, 'LEGENDARY',  59, '', 130, 20, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Numel extends Pokemon{
  constructor(){
    super('numel',[TYPE.FIRE,TYPE.FIELD,TYPE.GROUND], RARITY.LEGENDARY, 'LEGENDARY',  322, 'camerupt', 90, 5, 5, 5, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.BLAST_BURN);
  }
}

class Camerupt extends Pokemon{
  constructor(){
    super('camerupt',[TYPE.FIRE,TYPE.FIELD,TYPE.GROUND], RARITY.LEGENDARY, 'LEGENDARY',  323, 'mega-camerupt', 150, 9, 10, 10, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.BLAST_BURN);
  }
}

class MegaCamerupt extends Pokemon{
  constructor(){
  super('mega-camerupt',[TYPE.FIRE,TYPE.FIELD,TYPE.GROUND], RARITY.LEGENDARY, 'LEGENDARY',  3230, '', 230, 20, 15, 15, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.BLAST_BURN);
  }
}

class Munchlax extends Pokemon {
  constructor() {
    super('munchlax', [TYPE.NORMAL, TYPE.HUMAN], RARITY.LEGENDARY, 'LEGENDARY',  446, 'snorlax', 90, 9, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Snorlax extends Pokemon {
  constructor() {
    super('snorlax', [TYPE.NORMAL, TYPE.HUMAN], RARITY.LEGENDARY, 'LEGENDARY',  143, '', 130, 20, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Meditite extends Pokemon{
  constructor(){
    super('meditite', [TYPE.NORMAL, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, 'LEGENDARY',  307, 'medicham', 90, 5, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.SEISMIC_TOSS);
  }
}

class Medicham extends Pokemon{
  constructor(){
    super('medicham', [TYPE.NORMAL, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, 'LEGENDARY',  308, 'mega-medicham', 130, 9, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.SEISMIC_TOSS);
  }
}

class MegaMedicham extends Pokemon{
  constructor(){
    super('mega-medicham', [TYPE.NORMAL, TYPE.HUMAN, TYPE.FIGHTING], RARITY.LEGENDARY, 'LEGENDARY',  3080, '', 230, 20, 5, 5, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.SEISMIC_TOSS);
  }
}

class Magby extends Pokemon {
  constructor() {
    super('magby', [TYPE.FIRE, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  240, 'magmar', 90, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Magmar extends Pokemon {
  constructor() {
    super('magmar', [TYPE.FIRE, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  126, 'magmortar', 130, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Magmortar extends Pokemon {
  constructor() {
    super('magmortar', [TYPE.FIRE, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  467, '', 230, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Elekid extends Pokemon {
  constructor() {
    super('elekid', [TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  239, 'electabuzz', 90, 5, 4,4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Electabuzz extends Pokemon {
  constructor() {
    super('electabuzz', [TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  125, 'electivire', 130, 9, 4,4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Electivire extends Pokemon {
  constructor() {
    super('electivire', [TYPE.ELECTRIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  466, '', 230, 20, 4,4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Gible extends Pokemon {
  constructor() {
    super('gible', [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, 'EPIC',  443, 'gabite', 90, 5, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Gabite extends Pokemon {
  constructor() {
    super('gabite', [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, 'EPIC',  444, 'garchomp', 130, 9, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Garchomp extends Pokemon {
  constructor() {
    super('garchomp', [TYPE.DRAGON, TYPE.GROUND, TYPE.MONSTER], RARITY.EPIC, 'EPIC',  445, '', 230, 20, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Beldum extends Pokemon {
  constructor() {
    super('beldum', [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, 'EPIC',  374, 'metang', 90, 5, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.METEOR_MASH);
  }
}

class Metang extends Pokemon {
  constructor() {
    super('metang', [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, 'EPIC',  375, 'metagross', 130, 9, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.METEOR_MASH);
  }
}

class Metagross extends Pokemon {
  constructor() {
    super('metagross', [TYPE.PSYCHIC, TYPE.METAL, TYPE.MINERAL], RARITY.EPIC, 'EPIC',  376, '', 230, 20, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.METEOR_MASH);
  }
}

class Bagon extends Pokemon {
  constructor() {
    super('bagon', [TYPE.DRAGON, TYPE.MONSTER], RARITY.EPIC, 'EPIC',  371, 'shelgon', 90, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Shelgon extends Pokemon {
  constructor() {
    super('shelgon', [TYPE.DRAGON, TYPE.MONSTER], RARITY.EPIC, 'EPIC',  372, 'salamence', 130, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Salamence extends Pokemon {
  constructor() {
    super('salamence', [TYPE.DRAGON, TYPE.MONSTER, TYPE.FLYING], RARITY.EPIC, 'EPIC',  373, '', 230, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.DRACO_METEOR);
  }
}

class Ralts extends Pokemon {
  constructor() {
    super('ralts', [TYPE.PSYCHIC, TYPE.AMORPH], RARITY.EPIC, 'EPIC',  280, 'kirlia', 90, 5, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Kirlia extends Pokemon {
  constructor() {
    super('kirlia', [TYPE.PSYCHIC, TYPE.AMORPH], RARITY.EPIC, 'EPIC',  281, 'gardevoir', 130, 9, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Gardevoir extends Pokemon {
  constructor() {
    super('gardevoir', [TYPE.PSYCHIC, TYPE.AMORPH], RARITY.EPIC, 'EPIC',  282, '', 230, 18, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.CALM_MIND);
  }
}

class Slakoth extends Pokemon {
  constructor() {
    super('slakoth', [TYPE.NORMAL, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  287, 'vigoroth', 90, 5, 4,4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Vigoroth extends Pokemon {
  constructor() {
    super('vigoroth', [TYPE.NORMAL, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  288, 'slaking', 130, 9, 4,4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Slaking extends Pokemon {
  constructor() {
    super('slaking', [TYPE.NORMAL, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  289, '', 230, 20, 4,4, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Larvitar extends Pokemon {
  constructor() {
    super('larvitar', [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, 'EPIC',  246, 'pupitar', 90, 8, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.BITE);
  }
}

class Pupitar extends Pokemon {
  constructor() {
    super('pupitar', [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, 'EPIC',  247, 'tyranitar', 130, 9, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.BITE);
  }
}

class Tyranitar extends Pokemon {
  constructor() {
    super('tyranitar', [TYPE.DARK, TYPE.MONSTER, TYPE.MINERAL], RARITY.EPIC, 'EPIC',  248, '', 230, 20, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.BITE);
  }
}

class Dratini extends Pokemon {
  constructor() {
    super('dratini', [TYPE.DRAGON, TYPE.AQUATIC], RARITY.EPIC, 'EPIC',  147, 'dragonair', 90, 5, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DRAGON_BREATH);
  }
}

class Dragonair extends Pokemon {
  constructor() {
    super('dragonair', [TYPE.DRAGON, TYPE.AQUATIC], RARITY.EPIC, 'EPIC',  148, 'dragonite', 130, 9, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.DRAGON_BREATH);
  }
}

class Dragonite extends Pokemon {
  constructor() {
    super('dragonite', [TYPE.DRAGON, TYPE.AQUATIC, TYPE.FLYING], RARITY.EPIC, 'EPIC',  149, '', 230, 20, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.DRAGON_BREATH);
  }
}

class Gastly extends Pokemon {
  constructor() {
    super('gastly', [TYPE.DARK, TYPE.POISON, TYPE.AMORPH], RARITY.EPIC, 'EPIC',  92, 'haunter', 90, 5, 1,1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Haunter extends Pokemon {
  constructor() {
    super('haunter', [TYPE.DARK, TYPE.POISON, TYPE.AMORPH], RARITY.EPIC, 'EPIC',  93, 'gengar', 130, 9, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Gengar extends Pokemon {
  constructor() {
    super('gengar', [TYPE.DARK, TYPE.POISON, TYPE.AMORPH], RARITY.EPIC, 'EPIC',  94, '', 230, 18, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.DARK_PULSE);
  }
}

class Abra extends Pokemon {
  constructor() {
    super('abra', [TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  63, 'kadabra', 90, 5, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,1, 30, SPECIAL_SKILL.TELEPORT);
  }
}

class Kadabra extends Pokemon {
  constructor() {
    super('kadabra', [TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  64, 'alakazam', 130, 9, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,2, 30, SPECIAL_SKILL.TELEPORT);
  }
}

class Alakazam extends Pokemon {
  constructor() {
    super('alakazam', [TYPE.PSYCHIC, TYPE.HUMAN], RARITY.EPIC, 'EPIC',  65, '', 230, 18, 1, 1, 3, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,3, 30, SPECIAL_SKILL.TELEPORT);
  }
}

class Litwick extends Pokemon {
  constructor() {
    super('litwick', [TYPE.FIRE, TYPE.AMORPH], RARITY.EPIC, 'EPIC2',  607, 'lampent', 90, 5, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.FIRE_BLAST);
  }
}

class Lampent extends Pokemon {
  constructor() {
    super('lampent', [TYPE.FIRE, TYPE.AMORPH], RARITY.EPIC, 'EPIC2',  608, 'chandelure', 130, 9, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.FIRE_BLAST);
  }
}

class Chandelure extends Pokemon {
  constructor() {
    super('chandelure', [TYPE.FIRE, TYPE.AMORPH], RARITY.EPIC, 'EPIC2',  609, '', 230, 18, 1, 1, 3, 'GHOST/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.FIRE_BLAST);
  }
}

class Poliwag extends Pokemon {
  constructor() {
    super('poliwag', [TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE',  60, 'poliwhirl', 80, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.SOAK);
  }
}

class Poliwhirl extends Pokemon {
  constructor() {
    super('poliwhirl', [TYPE.WATER, TYPE.FIGHTING, TYPE.AQUATIC], RARITY.RARE, 'RARE',  61, 'politoed', 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.SOAK);
  }
}

class Politoed extends Pokemon {
  constructor() {
    super('politoed', [TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE',  186, '', 220, 18, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.SOAK);
  }
}

class Shinx extends Pokemon {
  constructor() {
    super('shinx', [TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, 'RARE',  403, 'luxio', 80, 5, 4,4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.CHARGE);
  }
}

class Luxio extends Pokemon {
  constructor() {
    super('luxio', [TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, 'RARE',  404, 'luxray', 120, 9, 4,4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.CHARGE);
  }
}

class Luxray extends Pokemon {
  constructor() {
    super('luxray', [TYPE.ELECTRIC, TYPE.FIELD], RARITY.RARE, 'RARE',  405, '', 220, 20, 4,4, 1, 'ELECTRIC/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.CHARGE);
  }
}

class Lotad extends Pokemon {
  constructor() {
    super('lotad', [TYPE.GRASS, TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE',  270, 'lombre', 80, 5, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Lombre extends Pokemon {
  constructor() {
    super('lombre', [TYPE.GRASS, TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE',  271, 'ludicolo', 120, 9, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Ludicolo extends Pokemon {
  constructor() {
    super('ludicolo', [TYPE.GRASS, TYPE.WATER, TYPE.AQUATIC], RARITY.RARE, 'RARE',  272, '', 220, 18, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Duskull extends Pokemon {
  constructor() {
    super('duskull', [TYPE.DARK, TYPE.AMORPH], RARITY.RARE, 'RARE',  355, 'dusclops', 80, 5, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.NIGHT_SLASH);
  }
}

class Dusclops extends Pokemon {
  constructor() {
    super('dusclops', [TYPE.DARK, TYPE.AMORPH], RARITY.RARE, 'RARE',  356, 'dusknoir', 120, 9, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.NIGHT_SLASH);
  }
}

class Dusknoir extends Pokemon {
  constructor() {
    super('dusknoir', [TYPE.DARK, TYPE.AMORPH], RARITY.RARE, 'RARE',  477, '', 220, 18, 1, 1, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.NIGHT_SLASH);
  }
}

class Togepi extends Pokemon {
  constructor() {
    super('togepi', [TYPE.NORMAL, TYPE.FAIRY, TYPE.PSYCHIC], RARITY.RARE, 'RARE',  175, 'togetic', 80, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,1, 50, SPECIAL_SKILL.WISH);
  }
}

class Togetic extends Pokemon {
  constructor() {
    super('togetic', [TYPE.NORMAL, TYPE.FAIRY, TYPE.PSYCHIC], RARITY.RARE, 'RARE',  176, 'togekiss', 120, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,2, 50, SPECIAL_SKILL.WISH);
  }
}

class Togekiss extends Pokemon {
  constructor() {
    super('togekiss', [TYPE.NORMAL, TYPE.FAIRY, TYPE.PSYCHIC], RARITY.RARE, 'RARE',  468, '', 220, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,3, 50, SPECIAL_SKILL.WISH);
  }
}

class Rhyhorn extends Pokemon {
  constructor() {
    super('rhyhorn', [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE',  111, 'rhydon', 80, 5, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.STOMP);
  }
}

class Rhydon extends Pokemon {
  constructor() {
    super('rhydon', [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE',  112, 'rhyperior', 120, 9, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.STOMP);
  }
}

class Rhyperior extends Pokemon {
  constructor() {
    super('rhyperior', [TYPE.GROUND, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE',  464, '', 220, 20, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.STOMP);
  }
}

class Magnemite extends Pokemon {
  constructor() {
    super('magnemite', [TYPE.ELECTRIC, TYPE.METAL], RARITY.RARE, 'RARE',  81, 'magneton', 80, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Magneton extends Pokemon {
  constructor() {
    super('magneton', [TYPE.ELECTRIC, TYPE.METAL], RARITY.RARE, 'RARE',  82, 'magnezone', 120, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Magnezone extends Pokemon {
  constructor() {
    super('magnezone', [TYPE.ELECTRIC, TYPE.METAL], RARITY.RARE, 'RARE',  462, '', 220, 18, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.DISCHARGE);
  }
}

class Aron extends Pokemon {
  constructor() {
    super('aron', [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE',  304, 'lairon', 80, 5, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.STOMP);
  }
}

class Lairon extends Pokemon {
  constructor() {
    super('lairon', [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE',  305, 'aggron', 120, 9, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.STOMP);
  }
}

class Aggron extends Pokemon {
  constructor() {
    super('aggron', [TYPE.METAL, TYPE.MONSTER, TYPE.MINERAL], RARITY.RARE, 'RARE',  306, '', 220, 20, 4,4, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.STOMP);
  }
}

class Spheal extends Pokemon {
  constructor() {
    super('spheal', [TYPE.WATER, TYPE.FIELD], RARITY.RARE, 'RARE',  363, 'sealeo', 80, 5, 4,4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Sealeo extends Pokemon {
  constructor() {
    super('sealeo', [TYPE.WATER, TYPE.FIELD], RARITY.RARE, 'RARE',  364, 'walrein', 120, 9, 4,4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Walrein extends Pokemon {
  constructor() {
    super('walrein', [TYPE.WATER, TYPE.FIELD], RARITY.RARE, 'RARE',  365, '', 220, 20, 4,4, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.ICICLE_CRASH);
  }
}

class Trapinch extends Pokemon {
  constructor() {
    super('trapinch', [TYPE.GROUND, TYPE.BUG], RARITY.RARE, 'RARE',  328, 'vibrava', 80, 5, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Vibrava extends Pokemon {
  constructor() {
    super('vibrava', [TYPE.GROUND, TYPE.DRAGON, TYPE.BUG], RARITY.RARE, 'RARE',  329, 'flygon', 120, 9, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Flygon extends Pokemon {
  constructor() {
    super('flygon', [TYPE.GROUND, TYPE.DRAGON, TYPE.BUG], RARITY.RARE, 'RARE',  330, '', 220, 20, 4,4, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.DRAGON_TAIL);
  }
}

class Horsea extends Pokemon {
  constructor() {
    super('horsea', [TYPE.WATER, TYPE.AQUATIC, TYPE.DRAGON], RARITY.RARE, 'RARE',  116, 'seadra', 80, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Seadra extends Pokemon {
  constructor() {
    super('seadra', [TYPE.WATER, TYPE.DRAGON, TYPE.AQUATIC], RARITY.RARE, 'RARE',  117, 'kingdra', 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Kingdra extends Pokemon {
  constructor() {
    super('kingdra', [TYPE.WATER, TYPE.DRAGON, TYPE.AQUATIC], RARITY.RARE, 'RARE',  230, '', 220, 18, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Machop extends Pokemon {
  constructor() {
    super('machop', [TYPE.FIGHTING, TYPE.HUMAN], RARITY.RARE, 'RARE',  66, 'machoke', 80, 5, 4,4, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Machoke extends Pokemon {
  constructor() {
    super('machoke', [TYPE.FIGHTING, TYPE.HUMAN], RARITY.RARE, 'RARE',  67, 'machamp', 120, 9, 4,4, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Machamp extends Pokemon {
  constructor() {
    super('machamp', [TYPE.FIGHTING, TYPE.HUMAN], RARITY.RARE, 'RARE',  68, '', 220, 20, 4,4, 1, 'FIGHTING/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.GUILLOTINE);
  }
}

class Pichu extends Pokemon {
  constructor() {
    super('pichu', [TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, 'RARE',  172, 'pikachu', 80, 5, 1,1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Pikachu extends Pokemon {
  constructor() {
    super('pikachu', [TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, 'RARE',  25, 'raichu', 120, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Raichu extends Pokemon {
  constructor() {
    super('raichu', [TYPE.ELECTRIC, TYPE.FAIRY], RARITY.RARE, 'RARE',  26, '', 220, 18, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Bulbasaur extends Pokemon {
  constructor() {
    super('bulbasaur', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  1, 'ivysaur', 70, 5, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.ROOT);
  }
}

class Ivysaur extends Pokemon {
  constructor() {
    super('ivysaur', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  2, 'venusaur', 120, 9, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.ROOT);
  }
}

class Venusaur extends Pokemon {
  constructor() {
    super('venusaur', [TYPE.GRASS, TYPE.POISON, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  3, '', 210, 18, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.ROOT);
  }
}

class Chikorita extends Pokemon {
  constructor() {
    super('chikorita', [TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  152, 'bayleef', 70, 5, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Bayleef extends Pokemon {
  constructor() {
    super('bayleef', [TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  153, 'meganium', 120, 9, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Meganium extends Pokemon {
  constructor() {
    super('meganium', [TYPE.GRASS, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  154, '', 210, 20, 1, 1, 2, 'GRASS/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class NidoranF extends Pokemon {
  constructor() {
    super('nidoranF', [TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  29, 'nidorina', 70, 5, 3,2, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class Nidorina extends Pokemon {
  constructor() {
    super('nidorina', [TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  30, 'nidoqueen', 120, 9, 3,2, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class Nidoqueen extends Pokemon {
  constructor() {
    super('nidoqueen', [TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  31, '', 210, 20, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class NidoranM extends Pokemon {
  constructor() {
    super('nidoranM', [TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  32, 'nidorino', 70, 5, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class Nidorino extends Pokemon {
  constructor() {
    super('nidorino', [TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  33, 'nidoking', 120, 9, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class Nidoking extends Pokemon {
  constructor() {
    super('nidoking', [TYPE.POISON, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  34, '', 210, 20, 3, 3, 1, 'POISON/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.POISON_STING);
  }
}

class Piplup extends Pokemon {
  constructor() {
    super('piplup', [TYPE.WATER, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON',  393, 'prinplup', 70, 5, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Prinplup extends Pokemon {
  constructor() {
    super('prinplup', [TYPE.WATER, TYPE.FLYING, TYPE.METAL], RARITY.UNCOMMON, 'UNCOMMON',  394, 'empoleon', 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Empoleon extends Pokemon {
  constructor() {
    super('empoleon', [TYPE.WATER, TYPE.FLYING, TYPE.METAL], RARITY.UNCOMMON, 'UNCOMMON',  395, '', 210, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.IRON_TAIL);
  }
}

class Chimchar extends Pokemon {
  constructor() {
    super('chimchar', [TYPE.FIRE, TYPE.HUMAN], RARITY.UNCOMMON, 'UNCOMMON',  390, 'monferno', 70, 5, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Monferno extends Pokemon {
  constructor() {
    super('monferno', [TYPE.FIRE, TYPE.HUMAN, TYPE.FIGHTING], RARITY.UNCOMMON, 'UNCOMMON',  391, 'infernape', 120, 9, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Infernape extends Pokemon {
  constructor() {
    super('infernape', [TYPE.FIRE, TYPE.HUMAN, TYPE.FIGHTING], RARITY.UNCOMMON, 'UNCOMMON',  392, '', 210, 20, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.TORMENT);
  }
}

class Turtwig extends Pokemon {
  constructor() {
    super('turtwig', [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  387, 'grotle', 70, 5, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.STOMP);
  }
}

class Grotle extends Pokemon {
  constructor() {
    super('grotle', [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  388, 'torterra', 120, 9, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.STOMP);
  }
}

class Torterra extends Pokemon {
  constructor() {
    super('torterra', [TYPE.GRASS, TYPE.GROUND, TYPE.FLORA], RARITY.UNCOMMON, 'UNCOMMON',  389, '', 210, 20, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.STOMP);
  }
}

class Mudkip extends Pokemon {
  constructor() {
    super('mudkip', [TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, 'UNCOMMON',  258, 'marshtomp', 70, 5, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.SOAK);
  }
}

class Marshtomp extends Pokemon {
  constructor() {
    super('marshtomp', [TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, 'UNCOMMON',  259, 'swampert', 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.SOAK);
  }
}

class Swampert extends Pokemon {
  constructor() {
    super('swampert', [TYPE.WATER, TYPE.GROUND], RARITY.UNCOMMON, 'UNCOMMON',  260, '', 210, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.SOAK);
  }
}

class Torchic extends Pokemon {
  constructor() {
    super('torchic', [TYPE.FIRE, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON',  255, 'combusken', 70, 5, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.BLAZE_KICK);
  }
}

class Combusken extends Pokemon {
  constructor() {
    super('combusken', [TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON',  256, 'blaziken', 120, 9, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.BLAZE_KICK);
  }
}

class Blaziken extends Pokemon {
  constructor() {
    super('blaziken', [TYPE.FIRE, TYPE.FIGHTING, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON',  257, '', 210, 20, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.BLAZE_KICK);
  }
}

class Treecko extends Pokemon {
  constructor() {
    super('treecko', [TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON',  252, 'grovyle', 70, 5, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.THIEF);
  }
}

class Grovyle extends Pokemon {
  constructor() {
    super('grovyle', [TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON',  253, 'sceptile', 120, 9, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.THIEF);
  }
}

class Sceptile extends Pokemon {
  constructor() {
    super('sceptile', [TYPE.GRASS, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON',  254, '', 210, 20, 3, 3, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.THIEF);
  }
}

class Totodile extends Pokemon {
  constructor() {
    super('totodile', [TYPE.WATER, TYPE.AQUATIC], RARITY.UNCOMMON, 'UNCOMMON',  158, 'croconaw', 70, 5, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.BITE);
  }
}

class Croconaw extends Pokemon {
  constructor() {
    super('croconaw', [TYPE.WATER, TYPE.AQUATIC], RARITY.UNCOMMON, 'UNCOMMON',  159, 'feraligatr', 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.BITE);
  }
}

class Feraligatr extends Pokemon {
  constructor() {
    super('feraligatr', [TYPE.WATER, TYPE.AQUATIC], RARITY.UNCOMMON, 'UNCOMMON',  160, '', 210, 20, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.BITE);
  }
}

class Cyndaquil extends Pokemon {
  constructor() {
    super('cyndaquil', [TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  155, 'quilava', 70, 5, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.WHEEL_OF_FIRE);
  }
}

class Quilava extends Pokemon {
  constructor() {
    super('quilava', [TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  156, 'typhlosion', 120, 9, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.WHEEL_OF_FIRE);
  }
}

class Typhlosion extends Pokemon {
  constructor() {
    super('typhlosion', [TYPE.FIRE, TYPE.FIELD], RARITY.UNCOMMON, 'UNCOMMON',  157, '', 210, 18, 1, 1, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.WHEEL_OF_FIRE);
  }
}

class Charmander extends Pokemon {
  constructor() {
    super('charmander', [TYPE.FIRE, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 4, 'charmeleon', 70, 5, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Charmeleon extends Pokemon {
  constructor() {
    super('charmeleon', [TYPE.FIRE, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON', 5, 'charizard', 120, 9, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Charizard extends Pokemon {
  constructor() {
    super('charizard', [TYPE.FIRE, TYPE.MONSTER, TYPE.FLYING], RARITY.UNCOMMON, 'UNCOMMON', 6, '', 210, 20, 3, 3, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.HEAT_WAVE);
  }
}

class Slowpoke extends Pokemon {
  constructor() {
    super('slowpoke', [TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, 'UNCOMMON2', 79, 'slowbro', 70, 5, 2, 2, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.SOAK);
  }
}

class Slowbro extends Pokemon {
  constructor() {
    super('slowbro', [TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, 'UNCOMMON2', 80, 'slowking', 120, 9, 3, 3, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.SOAK);
  }
}

class Slowking extends Pokemon {
  constructor() {
    super('slowking', [TYPE.AQUATIC, TYPE.PSYCHIC], RARITY.UNCOMMON, 'UNCOMMON2', 199, '', 210, 20, 4, 4, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.SOAK);
  }
}

class Squirtle extends Pokemon {
  constructor() {
    super('squirtle', [TYPE.WATER, TYPE.AQUATIC, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON',  7, 'wartortle', 70, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Wartortle extends Pokemon {
  constructor() {
    super('wartortle', [TYPE.WATER, TYPE.AQUATIC, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON',  8, 'blastoise', 120, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Blastoise extends Pokemon {
  constructor() {
    super('blastoise', [TYPE.WATER, TYPE.AQUATIC, TYPE.MONSTER], RARITY.UNCOMMON, 'UNCOMMON',  9, '', 210, 20, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Geodude extends Pokemon {
  constructor() {
    super('geodude', [TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, 'COMMON',  74, 'graveler', 60, 5, 2, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Graveler extends Pokemon {
  constructor() {
    super('graveler', [TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, 'COMMON',  75, 'golem', 110, 9, 2, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Golem extends Pokemon {
  constructor() {
    super('golem', [TYPE.GROUND, TYPE.MINERAL], RARITY.COMMON, 'COMMON',  76, '', 200, 20, 2, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.ROCK_SLIDE);
  }
}

class Azurill extends Pokemon {
  constructor() {
    super('azurill', [TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, 'COMMON',  298, 'marill', 60, 5, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Marill extends Pokemon {
  constructor() {
    super('marill', [TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, 'COMMON',  183, 'azumarill', 110, 9, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Azumarill extends Pokemon {
  constructor() {
    super('azumarill', [TYPE.WATER, TYPE.FAIRY], RARITY.COMMON, 'COMMON',  184, '', 200, 20, 1, 1, 2, 'WATER/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.HYDRO_PUMP);
  }
}

class Zubat extends Pokemon {
  constructor() {
    super('zubat', [TYPE.POISON, TYPE.FLYING], RARITY.COMMON, 'COMMON',  41, 'golbat', 60, 5, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.LEECH_LIFE);
  }
}

class Golbat extends Pokemon {
  constructor() {
    super('golbat', [TYPE.POISON, TYPE.FLYING], RARITY.COMMON, 'COMMON',  42, 'crobat', 110, 9, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.LEECH_LIFE);
  }
}

class Crobat extends Pokemon {
  constructor() {
    super('crobat', [TYPE.POISON, TYPE.FLYING], RARITY.COMMON, 'COMMON',  169, '', 200, 18, 1, 1, 2, 'PSYCHIC/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.LEECH_LIFE);
  }
}

class Mareep extends Pokemon {
  constructor() {
    super('mareep', [TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, 'COMMON',  179, 'flaffy', 60, 5, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Flaffy extends Pokemon {
  constructor() {
    super('flaffy', [TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, 'COMMON',  180, 'ampharos', 110, 9, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Ampharos extends Pokemon {
  constructor() {
    super('ampharos', [TYPE.ELECTRIC, TYPE.FIELD], RARITY.COMMON, 'COMMON',  181, '', 200, 18, 1, 1, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.THUNDER);
  }
}

class Cleffa extends Pokemon {
  constructor() {
    super('cleffa', [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON',  173, 'clefairy', 60, 5, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.METRONOME);
  }
}

class Clefairy extends Pokemon {
  constructor() {
    super('clefairy', [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON',  35, 'clefable', 110, 9, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.METRONOME);
  }
}

class Clefable extends Pokemon {
  constructor() {
    super('clefable', [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON',  36, '', 200, 18, 2, 2, 1, 'FAIRY/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.METRONOME);
  }
}

class Igglybuff extends Pokemon {
  constructor() {
    super('igglybuff', [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON',  174, 'jigglypuff', 60, 5, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.WISH);
  }
}

class Jigglypuff extends Pokemon {
  constructor() {
    super('jigglypuff', [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON',  39, 'wigglytuff', 110, 9, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.WISH);
  }
}

class Wigglytuff extends Pokemon {
  constructor() {
    super('wigglytuff', [TYPE.FAIRY, TYPE.NORMAL], RARITY.COMMON, 'COMMON',  40, '', 200, 18, 1, 1, 2, 'FAIRY/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.WISH);
  }
}

class Caterpie extends Pokemon {
  constructor() {
    super('caterpie', [TYPE.GRASS, TYPE.BUG], RARITY.COMMON, 'COMMON',  10, 'metapod', 60, 5, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Metapod extends Pokemon {
  constructor() {
    super('metapod', [TYPE.GRASS, TYPE.BUG], RARITY.COMMON, 'COMMON',  11, 'butterfree', 110, 9, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Butterfree extends Pokemon {
  constructor() {
    super('butterfree', [TYPE.GRASS, TYPE.BUG, TYPE.FLYING], RARITY.COMMON, 'COMMON',  12, '', 200, 18, 1, 1, 2, 'POISON/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Weedle extends Pokemon {
  constructor() {
    super('weedle', [TYPE.POISON, TYPE.BUG], RARITY.COMMON, 'COMMON',  13, 'kakuna', 60, 5, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Kakuna extends Pokemon {
  constructor() {
    super('kakuna', [TYPE.POISON, TYPE.BUG], RARITY.COMMON, 'COMMON',  14, 'beedrill', 110, 9, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Beedrill extends Pokemon {
  constructor() {
    super('beedrill', [TYPE.POISON, TYPE.BUG, TYPE.FLYING], RARITY.COMMON, 'COMMON',  15, '', 200, 20, 2, 2, 1, 'BUG/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.BUG_BUZZ);
  }
}

class Pidgey extends Pokemon {
  constructor() {
    super('pidgey', [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON',  16, 'pidgeotto', 60, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Pidgeotto extends Pokemon {
  constructor() {
    super('pidgeotto', [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON',  17, 'pidgeot', 110, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Pidgeot extends Pokemon {
  constructor() {
    super('pidgeot', [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON',  18, '', 200, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Hoppip extends Pokemon {
  constructor() {
    super('hoppip', [TYPE.GRASS, TYPE.FLYING, TYPE.FLORA], RARITY.COMMON, 'COMMON',  187, 'skiploom', 60, 5, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Skiploom extends Pokemon {
  constructor() {
    super('skiploom', [TYPE.GRASS, TYPE.FLYING, TYPE.FLORA], RARITY.COMMON, 'COMMON',  188, 'jumpluff', 110, 9, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Jumpluff extends Pokemon {
  constructor() {
    super('jumpluff', [TYPE.GRASS, TYPE.FLYING, TYPE.FLORA], RARITY.COMMON, 'COMMON',  189, '', 220, 18, 1, 1, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,3, 100, SPECIAL_SKILL.STUN_SPORE);
  }
}

class Seedot extends Pokemon {
  constructor() {
    super('seedot', [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, 'COMMON',  273, 'nuzleaf', 60, 5, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.THIEF);
  }
}

class Nuzleaf extends Pokemon {
  constructor() {
    super('nuzleaf', [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, 'COMMON',  274, 'shiftry', 110, 9, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.THIEF);
  }
}

class Shiftry extends Pokemon {
  constructor() {
    super('shiftry', [TYPE.GRASS, TYPE.DARK, TYPE.FIELD], RARITY.COMMON, 'COMMON',  275, '', 200, 20, 2, 2, 1, 'GRASS/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.THIEF);
  }
}

class Starly extends Pokemon {
  constructor() {
    super('starly', [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON',  396, 'staravia', 60, 5, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Staravia extends Pokemon {
  constructor() {
    super('staravia', [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON',  397, 'staraptor', 110, 9, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.HURRICANE);
  }
}

class Staraptor extends Pokemon {
  constructor() {
    super('staraptor', [TYPE.NORMAL, TYPE.FLYING], RARITY.COMMON, 'COMMON',  398, '', 200, 20, 2, 2, 1, 'FLYING/melee', ATTACK_TYPE.PHYSICAL,3, 100, SPECIAL_SKILL.HURRICANE);
  }
}
class Magikarp extends Pokemon {
  constructor() {
    super('magikarp', [TYPE.WATER], RARITY.NEUTRAL, 'NEUTRAL',  129, '', 30, 1, 1, 1, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Gyarados extends Pokemon {
  constructor() {
    super('gyarados', [TYPE.WATER], RARITY.NEUTRAL, 'NEUTRAL',  130, '', 200, 20, 5, 1, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Rattata extends Pokemon {
  constructor() {
    super('rattata', [TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL',  19, '', 30, 5, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Raticate extends Pokemon {
  constructor() {
    super('raticate', [TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL',  20, '', 60, 7, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Spearow extends Pokemon {
  constructor() {
    super('spearow', [TYPE.FLYING, TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL',  21, '', 30, 5, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Fearow extends Pokemon {
  constructor() {
    super('fearow', [TYPE.FLYING, TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL',  22, '', 60, 7, 1, 1, 1, 'NORMAL/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Lugia extends Pokemon {
  constructor() {
    super('lugia', [TYPE.WATER, TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL',  249, '', 250, 20, 10, 2, 4, 'FLYING/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Giratina extends Pokemon {
  constructor() {
    super('giratina', [TYPE.DARK, TYPE.AMORPH], RARITY.NEUTRAL, 'NEUTRAL',  487, '', 250, 20, 10, 2, 2, 'GHOST/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Zapdos extends Pokemon {
  constructor() {
    super('zapdos', [TYPE.ELECTRIC, TYPE.FLYING], RARITY.NEUTRAL, 'NEUTRAL',  145, '', 250, 20, 10, 2, 2, 'ELECTRIC/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Moltres extends Pokemon {
  constructor() {
    super('moltres', [TYPE.FIRE,TYPE.FLYING], RARITY.NEUTRAL, 'NEUTRAL',  146, '', 250, 20, 10, 2, 2, 'FIRE/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Articuno extends Pokemon {
  constructor() {
    super('articuno', [TYPE.WATER, TYPE.FLYING], RARITY.NEUTRAL, 'NEUTRAL',  144, '', 250, 20, 10, 2, 2, 'FLYING/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Dialga extends Pokemon {
  constructor() {
    super('dialga', [TYPE.METAL, TYPE.DRAGON], RARITY.NEUTRAL, 'NEUTRAL',  483, '', 250, 20, 10, 2, 2, 'FIGHTING/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Palkia extends Pokemon {
  constructor() {
    super('palkia', [TYPE.DRAGON, TYPE.WATER], RARITY.NEUTRAL, 'NEUTRAL',  484, '', 250, 20, 10, 2, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Suicune extends Pokemon {
  constructor() {
    super('suicune', [TYPE.WATER, TYPE.AQUATIC], RARITY.NEUTRAL, 'NEUTRAL',  245, '', 250, 20, 10, 2, 1, 'WATER/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Raikou extends Pokemon {
  constructor() {
    super('raikou', [TYPE.ELECTRIC], RARITY.NEUTRAL, 'NEUTRAL',  243, '', 250, 20, 10, 2, 1, 'ELETRIC/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Entei extends Pokemon {
  constructor() {
    super('entei', [TYPE.FIRE], RARITY.NEUTRAL, 'NEUTRAL',  244, '', 250, 20, 10, 2, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Regice extends Pokemon {
  constructor() {
    super('regice', [TYPE.WATER], RARITY.NEUTRAL, 'NEUTRAL',  378, '', 250, 20, 10, 2, 1, 'ICE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Regirock extends Pokemon {
  constructor() {
    super('regirock', [TYPE.MINERAL], RARITY.NEUTRAL, 'NEUTRAL',  377, '', 250, 20, 10, 2, 1, 'ROCK/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Registeel extends Pokemon {
  constructor() {
    super('registeel', [TYPE.METAL], RARITY.NEUTRAL, 'NEUTRAL',  379, '', 250, 20, 10, 2, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Regigigas extends Pokemon {
  constructor() {
    super('regigigas', [TYPE.NORMAL], RARITY.NEUTRAL, 'NEUTRAL',  486, '', 250, 20, 10, 2, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Kyogre extends Pokemon {
  constructor() {
    super('kyogre', [TYPE.WATER, TYPE.AQUATIC], RARITY.NEUTRAL, 'NEUTRAL',  382, '', 250, 20, 10, 2, 4, 'WATER/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Groudon extends Pokemon {
  constructor() {
    super('groudon', [TYPE.GROUND, TYPE.FIRE], RARITY.NEUTRAL, 'NEUTRAL',  383, '', 250, 20, 10, 2, 1, 'FIRE/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Rayquaza extends Pokemon {
  constructor() {
    super('rayquaza', [TYPE.DRAGON,TYPE.FLYING], RARITY.NEUTRAL, 'NEUTRAL',  384, '', 250, 20, 10, 2, 1, 'DRAGON/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Eevee extends Pokemon{
  constructor(){
    super('eevee',[TYPE.NORMAL, TYPE.FIELD],RARITY.UNCOMMON, 'UNCOMMON', 133,'',130,5,2,2,1,'NORMAL/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Vaporeon extends Pokemon{
  constructor(){
    super('vaporeon',[TYPE.WATER, TYPE.AQUATIC, TYPE.FIELD],RARITY.UNCOMMON, 'UNCOMMON', 134,'',130,9,1,1,2,'WATER/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Jolteon extends Pokemon{
  constructor(){
    super('jolteon',[TYPE.ELECTRIC, TYPE.FIELD],RARITY.UNCOMMON, 'UNCOMMON', 135,'',130,9,1,1,2,'ELECTRIC/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Flareon extends Pokemon{
  constructor(){
    super('flareon',[TYPE.FIRE, TYPE.FIELD],RARITY.UNCOMMON, 'UNCOMMON', 136,'',130,9,3,2,1,'FIRE/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Espeon extends Pokemon{
  constructor(){
    super('espeon',[TYPE.PSYCHIC, TYPE.FIELD],RARITY.UNCOMMON, 'UNCOMMON', 196,'',130,9,1,1,2,'PSYCHIC/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Umbreon extends Pokemon{
  constructor(){
    super('umbreon',[TYPE.DARK, TYPE.FIELD],RARITY.UNCOMMON, 'UNCOMMON', 197,'',130,9,3,2,1,'DRAGON/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Leafon extends Pokemon{
  constructor(){
    super('leafon',[TYPE.GRASS, TYPE.FLORA, TYPE.FIELD],RARITY.UNCOMMON, 'UNCOMMON', 470,'',130,9,3,2,1,'GRASS/melee', ATTACK_TYPE.PHYSICAL,2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Sylveon extends Pokemon{
  constructor(){
    super('sylveon',[TYPE.FAIRY, TYPE.FIELD],RARITY.UNCOMMON, 'UNCOMMON', 700,'',130,9,1,1,2,'FAIRY/range', ATTACK_TYPE.SPECIAL,2, 100, SPECIAL_SKILL.HAPPY_HOUR);
  }
}

class Sandshrew extends Pokemon{
  constructor(){
    super('sandshrew',[TYPE.GROUND, TYPE.FIELD],RARITY.NEUTRAL, 'NEUTRAL', 27,'',70,5,1,1,1,'NORMAL/melee', ATTACK_TYPE.PHYSICAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

class Darkrai extends Pokemon{
  constructor(){
    super('darkrai',[TYPE.DARK, TYPE.AMORPH],RARITY.NEUTRAL, 'NEUTRAL', 491,'',200,10,3,3,3,'GHOST/range', ATTACK_TYPE.SPECIAL,1, 100, SPECIAL_SKILL.DEFAULT);
  }
}

schema.defineTypes(Pokemon, {
  id: 'string',
  name: 'string',
  types: ['string'],
  rarity: 'string',
  sheet:'string',
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
  hp: 'uint8',
  range: 'uint8',
  stars: 'uint8',
  maxMana: 'uint8',
  skill: 'string',
  items: Items
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
  Slowking
};
