const CLIMATE = require('./enum').CLIMATE;
const EFFECTS = require('./enum').EFFECTS;

class Effects {
  constructor() {
    this.climate = CLIMATE.NEUTRAL;
    this.list = [];
  }

  update(synergies) {
    this.list = [];
    if (synergies.GRASS >= 0) {
      if (synergies.GRASS >= 7) {
        this.list.push(EFFECTS.SPORE);
      } else if (synergies.GRASS >= 5) {
        this.list.push(EFFECTS.GROWTH);
      } else if (synergies.GRASS >= 3) {
        this.list.push(EFFECTS.INGRAIN);
      }
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
    if (synergies.WATER >= 0) {
      if (synergies.WATER >= 9) {
        this.list.push(EFFECTS.PRIMORDIAL_SEA);
      } else if (synergies.WATER >= 6) {
        this.list.push(EFFECTS.RAIN_DANCE);
      } else if (synergies.WATER >= 3) {
        this.list.push(EFFECTS.DRIZZLE);
      }
    }

    if (synergies.NORMAL >= 0) {
      if (synergies.NORMAL >= 9) {
        this.list.push(EFFECTS.PURE_POWER);
      } else if (synergies.NORMAL >= 6) {
        this.list.push(EFFECTS.STRENGTH);
      } else if (synergies.NORMAL >= 3) {
        this.list.push(EFFECTS.STAMINA);
      }
    }

    if (synergies.ELECTRIC > 0) {
      this.list.push(EFFECTS.AGILITY);
    }

    if (synergies.FIGHTING >= 0) {
      if (synergies.FIGHTING >= 4) {
        this.list.push(EFFECTS.PUNISHMENT);
      } else if (synergies.FIGHTING >= 2) {
        this.list.push(EFFECTS.REVENGE);
      }
    }

    if (synergies.PSYCHIC >= 0) {
      if (synergies.PSYCHIC >= 6) {
        this.list.push(EFFECTS.EERIE_SPELL);
      } else if (synergies.PSYCHIC >= 4) {
        this.list.push(EFFECTS.LIGHT_SCREEN);
      } else if (synergies.PSYCHIC >= 2) {
        this.list.push(EFFECTS.AMNESIA);
      }
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

    if (synergies.METAL >= 0) {
      if (synergies.METAL >= 4) {
        this.list.push(EFFECTS.AUTOTOMIZE);
      } else if (synergies.METAL >= 2) {
        this.list.push(EFFECTS.IRON_DEFENSE);
      }
    }

    if (synergies.GROUND >= 0) {
      if (synergies.GROUND >= 6) {
        this.list.push(EFFECTS.SANDSTORM);
      } else if (synergies.GROUND >= 4) {
        this.list.push(EFFECTS.ROTOTILLER);
      } else if (synergies.GROUND >= 2) {
        this.list.push(EFFECTS.SHORE_UP);
      }
    }

    if (synergies.POISON >= 0) {
      if (synergies.POISON >= 6) {
        this.list.push(EFFECTS.TOXIC);
      } else if (synergies.POISON >= 3) {
        this.list.push(EFFECTS.POISON_GAS);
      }
    }

    if (synergies.DRAGON >= 0) {
      if (synergies.DRAGON >= 5) {
        this.list.push(EFFECTS.DRAGON_DANCE);
      } else if (synergies.DRAGON >= 3) {
        this.list.push(EFFECTS.DRAGON_ENERGY);
      }
    }

    if (synergies.FIELD >= 0) {
      if (synergies.FIELD >= 9) {
        this.list.push(EFFECTS.ANGER_POINT);
      } else if (synergies.FIELD >= 6) {
        this.list.push(EFFECTS.RAGE);
      } else if (synergies.FIELD >= 3) {
        this.list.push(EFFECTS.BULK_UP);
      }
    }

    if (synergies.MONSTER >= 0) {
      if (synergies.MONSTER >= 6) {
        this.list.push(EFFECTS.POWER_TRIP);
      } else if (synergies.MONSTER >= 4) {
        this.list.push(EFFECTS.BRUTAL_SWING);
      } else if (synergies.MONSTER >= 2) {
        this.list.push(EFFECTS.PURSUIT);
      }
    }

    if (synergies.HUMAN >= 0) {
      if (synergies.HUMAN >= 6) {
        this.list.push(EFFECTS.CALM_MIND);
      } else if (synergies.HUMAN >= 4) {
        this.list.push(EFFECTS.FOCUS_ENERGY);
      } else if (synergies.HUMAN >= 2) {
        this.list.push(EFFECTS.MEDITATE);
      }
    }

    if (synergies.AQUATIC >= 0) {
      if (synergies.AQUATIC >= 4) {
        this.list.push(EFFECTS.HYDRO_CANNON);
      } else if (synergies.AQUATIC >= 2) {
        this.list.push(EFFECTS.SWIFT_SWIM);
      }
    }

    if (synergies.BUG >= 0) {
      if (synergies.BUG >= 5) {
        this.list.push(EFFECTS.STICKY_WEB);
      } else if (synergies.BUG >= 2) {
        this.list.push(EFFECTS.SWARM);
      }
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
      if (synergies.FLORA >= 5) {
        this.list.push(EFFECTS.SUN_FLOWER);
      } else if (synergies.FLORA >= 4) {
        this.list.push(EFFECTS.VILE_FLOWER);
      } else if (synergies.FLORA >= 3) {
        this.list.push(EFFECTS.GLOOM_FLOWER);
      } else if (synergies.FLORA >= 2) {
        this.list.push(EFFECTS.ODD_FLOWER);
      }
    }
    if (synergies.MINERAL >= 0) {
      if (synergies.MINERAL >= 6) {
        this.list.push(EFFECTS.DIAMOND_STORM);
      } else if (synergies.MINERAL >= 4) {
        this.list.push(EFFECTS.MOUTAIN_RESISTANCE);
      } else if (synergies.MINERAL >= 2) {
        this.list.push(EFFECTS.BATTLE_ARMOR);
      }
    }
    if (synergies.GHOST >= 0) {
      if (synergies.GHOST >= 4) {
        this.list.push(EFFECTS.CURSE);
      } else if (synergies.GHOST >= 2) {
        this.list.push(EFFECTS.PHANTOM_FORCE);
      }
    }

    if (synergies.FAIRY >= 0) {
      if (synergies.FAIRY >= 6) {
        this.list.push(EFFECTS.STRANGE_STEAM);
      } else if (synergies.FAIRY >= 4) {
        this.list.push(EFFECTS.FAIRY_WIND);
      } else if (synergies.FAIRY >= 2) {
        this.list.push(EFFECTS.AROMATIC_MIST);
      }
    }

    if (synergies.ICE >= 0) {
      if (synergies.ICE >= 4) {
        this.list.push(EFFECTS.SHEER_COLD);
      } else if (synergies.ICE >= 2) {
        this.list.push(EFFECTS.SNOW);
      }
    }
    if (synergies.SOUND >= 0) {
      if (synergies.SOUND >= 7) {
        this.list.push(EFFECTS.PRESTO);
      } else if (synergies.SOUND >= 5) {
        this.list.push(EFFECTS.ALLEGRO);
      } else if (synergies.SOUND >= 3) {
        this.list.push(EFFECTS.LARGO);
      }
    }
  }
}

module.exports = Effects;
