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
    if (synergies.GRASS >= 5) {
      this.list.push(EFFECTS.GROWTH);
    }
    if (synergies.GRASS >= 7) {
      this.list.push(EFFECTS.SPORE);
    }
    if (synergies.FIRE >= 0) {
      if (synergies.FIRE >= 6) {
        this.list.push(EFFECTS.DESOLATE_LAND);
      } else if (synergies.FIRE >= 4) {
        this.list.push(EFFECTS.DROUGHT);
      } else if (synergies.FIRE >= 2) {
        this.list.push(EFFECTS.BLAZE);
      }
    }
    if (synergies.FOSSIL >= 0) {
      if (synergies.FOSSIL >= 6) {
        this.list.push(EFFECTS.UNOWN_GATHERINGS);
      } else if (synergies.FOSSIL >= 4) {
        this.list.push(EFFECTS.ELDER_POWER);
      } else if (synergies.FOSSIL >= 2) {
        this.list.push(EFFECTS.ANCIENT_POWER);
      }
    }
    if (synergies.WATER >= 3) {
      this.list.push(EFFECTS.DRIZZLE);
    }
    if (synergies.WATER >= 6) {
      this.list.push(EFFECTS.RAIN_DANCE);
    }
    if (synergies.WATER >= 8) {
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
      this.list.push(EFFECTS.AMNESIA);
    }
    if (synergies.PSYCHIC >= 4) {
      this.list.push(EFFECTS.LIGHT_SCREEN);
    }
    if (synergies.PSYCHIC >= 6) {
      this.list.push(EFFECTS.EERIE_SPELL);
    }
    if (synergies.DARK >= 0) {
      if (synergies.DARK >= 6) {
        this.list.push(EFFECTS.BEAT_UP);
      } else if (synergies.DARK >= 4) {
        this.list.push(EFFECTS.ASSURANCE);
      } else if (synergies.DARK >= 2) {
        this.list.push(EFFECTS.HONE_CLAWS);
      }
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
      this.list.push(EFFECTS.DRAGON_DANCE);
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
    if (synergies.AQUATIC >= 0) {
      if (synergies.AQUATIC >= 4) {
        this.list.push(EFFECTS.HYDRO_CANNON);
      } else if (synergies.AQUATIC >= 2) {
        this.list.push(EFFECTS.SWIFT_SWIM);
      }
    }
    if (synergies.BUG >= 2) {
      this.list.push(EFFECTS.SWARM);
    }
    if (synergies.BUG >= 4) {
      this.list.push(EFFECTS.STICKY_WEB);
    }
    if (synergies.FLYING >= 0) {
      if (synergies.FLYING >= 8) {
        this.list.push(EFFECTS.MAX_GUARD);
      } else if (synergies.FLYING >= 6) {
        this.list.push(EFFECTS.MAX_AIRSTREAM);
      } else if (synergies.FLYING >= 4) {
        this.list.push(EFFECTS.FEATHER_DANCE);
      } else if (synergies.FLYING >= 2) {
        this.list.push(EFFECTS.TAILWIND);
      }
    }
    if (synergies.FLORA >= 0) {
      if (synergies.FLORA >= 4) {
        this.list.push(EFFECTS.VILE_FLOWER);
      } else if (synergies.FLORA >= 3) {
        this.list.push(EFFECTS.GLOOM_FLOWER);
      } else if (synergies.FLORA >= 2) {
        this.list.push(EFFECTS.ODD_FLOWER);
      }
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
    if (synergies.AMORPH >= 4) {
      this.list.push(EFFECTS.CURSE);
    }
    if (synergies.FAIRY >= 2) {
      this.list.push(EFFECTS.ATTRACT);
    }
    if (synergies.FAIRY >= 4) {
      this.list.push(EFFECTS.BABY_DOLL_EYES);
    }
    if (synergies.ICE >= 2) {
      this.list.push(EFFECTS.SNOW);
    }
    if (synergies.ICE >= 4) {
      this.list.push(EFFECTS.SHEER_COLD);
    }
  }
}

module.exports = Effects;
