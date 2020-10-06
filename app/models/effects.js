const CLIMATE = require('./enum').CLIMATE;
const EFFECTS = require('./enum').EFFECTS;

class Effects {
  constructor() {
    this.climate = CLIMATE.NEUTRAL;
    this.list = [];
  }

  update(synergies) {
    this.list = [];
    if (synergies.GRASS >= 3) {
      this.list.push(EFFECTS.INGRAIN);
    }
    if (synergies.GRASS >= 6) {
      this.list.push(EFFECTS.GROWTH);
    }
    if (synergies.GRASS >= 8) {
      this.list.push(EFFECTS.SPORE);
    }
    if (synergies.FIRE >= 3) {
      this.list.push(EFFECTS.BLAZE);
    }
    if (synergies.FIRE >= 6) {
      this.list.push(EFFECTS.DROUGHT);
    }
    if (synergies.WATER >= 3) {
      this.list.push(EFFECTS.DRIZZLE);
    }
    if (synergies.WATER >= 6) {
      this.list.push(EFFECTS.RAIN_DANCE);
    }
    if (synergies.WATER >= 9) {
      this.list.push(EFFECTS.PRIMORDIAL_SEA);
    }
    if (synergies.NORMAL >= 3) {
      this.list.push(EFFECTS.STAMINA);
    }
    if (synergies.NORMAL >= 6) {
      this.list.push(EFFECTS.STRENGTH);
    }
    if (synergies.NORMAL >= 9) {
      this.list.push(EFFECTS.PURE_POWER);
    }
    if (synergies.ELECTRIC > 0) {
      this.list.push(EFFECTS.AGILITY);
    }
    if (synergies.FIGHTING >= 2) {
      this.list.push(EFFECTS.REVENGE);
    }
    if (synergies.FIGHTING >= 4) {
      this.list.push(EFFECTS.PUNISHMENT);
    }
    if (synergies.PSYCHIC >= 2) {
      this.list.push(EFFECTS.PSYWAVE);
    }
    if (synergies.PSYCHIC >= 4) {
      this.list.push(EFFECTS.MAGIC_ROOM);
    }
    if (synergies.DARK >= 2) {
      this.list.push(EFFECTS.MEAN_LOOK);
    }
    if (synergies.DARK >= 4) {
      this.list.push(EFFECTS.SCARY_FACE);
    }
    if (synergies.METAL >= 2) {
      this.list.push(EFFECTS.IRON_DEFENSE);
    }
    if (synergies.METAL >= 4) {
      this.list.push(EFFECTS.AUTOTOMIZE);
    }
    if (synergies.GROUND >= 2) {
      this.list.push(EFFECTS.SPIKES);
    }
    if (synergies.GROUND >= 4) {
      this.list.push(EFFECTS.STEALTH_ROCK);
    }
    if (synergies.GROUND >= 6) {
      this.list.push(EFFECTS.SANDSTORM);
    }
    if (synergies.POISON >= 3) {
      this.list.push(EFFECTS.POISON_GAS);
    }
    if (synergies.POISON >= 6) {
      this.list.push(EFFECTS.TOXIC);
    }
    if (synergies.DRAGON >= 2) {
      this.list.push(EFFECTS.INTIMIDATE);
    }
    if (synergies.DRAGON >= 4) {
      this.list.push(EFFECTS.DRACO_METEOR);
    }
    if (synergies.FIELD >= 3) {
      this.list.push(EFFECTS.WORK_UP);
    }
    if (synergies.FIELD >= 6) {
      this.list.push(EFFECTS.RAGE);
    }
    if (synergies.FIELD >= 9) {
      this.list.push(EFFECTS.ANGER_POINT);
    }
    if (synergies.MONSTER >= 3) {
      this.list.push(EFFECTS.PURSUIT);
    }
    if (synergies.MONSTER >= 5) {
      this.list.push(EFFECTS.BRUTAL_SWING);
    }
    if (synergies.MONSTER >= 7) {
      this.list.push(EFFECTS.POWER_TRIP);
    }
    if (synergies.HUMAN >= 2) {
      this.list.push(EFFECTS.MEDITATE);
    }
    if (synergies.HUMAN >= 4) {
      this.list.push(EFFECTS.FOCUS_ENERGY);
    }
    if (synergies.HUMAN >= 6) {
      this.list.push(EFFECTS.CALM_MIND);
    }
    if (synergies.AQUATIC >= 3) {
      this.list.push(EFFECTS.SWIFT_SWIM);
    }
    if (synergies.AQUATIC >= 6) {
      this.list.push(EFFECTS.HYDO_CANNON);
    }
    if (synergies.BUG >= 2) {
      this.list.push(EFFECTS.SWARM);
    }
    if (synergies.BUG >= 4) {
      this.list.push(EFFECTS.STICKY_WEB);
    }
    if (synergies.FLYING >= 2) {
      this.list.push(EFFECTS.RAZOR_WIND);
    }
    if (synergies.FLYING >= 4) {
      this.list.push(EFFECTS.HURRICANE);
    }
    if (synergies.FLORA >= 2) {
      this.list.push(EFFECTS.RAIN_DISH);
    }
    if (synergies.FLORA >= 4) {
      this.list.push(EFFECTS.FLOWER_SHIELD);
    }
    if (synergies.MINERAL >= 2) {
      this.list.push(EFFECTS.BATTLE_ARMOR);
    }
    if (synergies.MINERAL >= 4) {
      this.list.push(EFFECTS.MOUTAIN_RESISTANCE);
    }
    if (synergies.AMORPH >= 2) {
      this.list.push(EFFECTS.PHANTOM_FORCE);
    }
    if (synergies.FAIRY >= 2) {
      this.list.push(EFFECTS.ATTRACT);
    }
    if (synergies.FAIRY >= 4) {
      this.list.push(EFFECTS.BABY_DOLL_EYES);
    }
  }
}

module.exports = Effects;
