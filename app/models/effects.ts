import Synergies from "./colyseus-models/synergies";
import { CLIMATE } from "./enum";
import { Effect } from "../types/enum/Effect";

export class Effects {
  climate: string;
  list: any[];

  constructor() {
    this.climate = CLIMATE.NEUTRAL;
    this.list = [];
  }

  update(synergies: Synergies) {
    this.list = [];
    if (synergies.GRASS >= 0) {
      if (synergies.GRASS >= 7) {
        this.list.push(Effect.SPORE);
      } else if (synergies.GRASS >= 5) {
        this.list.push(Effect.GROWTH);
      } else if (synergies.GRASS >= 3) {
        this.list.push(Effect.INGRAIN);
      }
    }

    if (synergies.FIRE >= 0) {
      if (synergies.FIRE >= 6) {
        this.list.push(Effect.DESOLATE_LAND);
      } else if (synergies.FIRE >= 4) {
        this.list.push(Effect.DROUGHT);
      } else if (synergies.FIRE >= 2) {
        this.list.push(Effect.BLAZE);
      }
    }
    if (synergies.FOSSIL >= 0) {
      if (synergies.FOSSIL >= 6) {
        this.list.push(Effect.UNOWN_GATHERINGS);
      } else if (synergies.FOSSIL >= 4) {
        this.list.push(Effect.ELDER_POWER);
      } else if (synergies.FOSSIL >= 2) {
        this.list.push(Effect.ANCIENT_POWER);
      }
    }
    if (synergies.WATER >= 0) {
      if (synergies.WATER >= 9) {
        this.list.push(Effect.PRIMORDIAL_SEA);
      } else if (synergies.WATER >= 6) {
        this.list.push(Effect.RAIN_DANCE);
      } else if (synergies.WATER >= 3) {
        this.list.push(Effect.DRIZZLE);
      }
    }

    if (synergies.NORMAL >= 0) {
      if (synergies.NORMAL >= 9) {
        this.list.push(Effect.PURE_POWER);
      } else if (synergies.NORMAL >= 6) {
        this.list.push(Effect.STRENGTH);
      } else if (synergies.NORMAL >= 3) {
        this.list.push(Effect.STAMINA);
      }
    }

    if (synergies.ELECTRIC > 0) {
      if (synergies.ELECTRIC >= 6) {
        this.list.push(Effect.OVERDRIVE);
      } else if (synergies.ELECTRIC >= 4) {
        this.list.push(Effect.RISING_VOLTAGE);
      } else if (synergies.ELECTRIC >= 2) {
        this.list.push(Effect.EERIE_IMPULSE);
      }
    }

    if (synergies.FIGHTING >= 0) {
      if (synergies.FIGHTING >= 4) {
        this.list.push(Effect.PUNISHMENT);
      } else if (synergies.FIGHTING >= 2) {
        this.list.push(Effect.REVENGE);
      }
    }

    if (synergies.PSYCHIC >= 0) {
      if (synergies.PSYCHIC >= 6) {
        this.list.push(Effect.EERIE_SPELL);
      } else if (synergies.PSYCHIC >= 4) {
        this.list.push(Effect.LIGHT_SCREEN);
      } else if (synergies.PSYCHIC >= 2) {
        this.list.push(Effect.AMNESIA);
      }
    }

    if (synergies.DARK >= 0) {
      if (synergies.DARK >= 6) {
        this.list.push(Effect.BEAT_UP);
      } else if (synergies.DARK >= 4) {
        this.list.push(Effect.ASSURANCE);
      } else if (synergies.DARK >= 2) {
        this.list.push(Effect.HONE_CLAWS);
      }
    }

    if (synergies.METAL >= 0) {
      if (synergies.METAL >= 4) {
        this.list.push(Effect.AUTOTOMIZE);
      } else if (synergies.METAL >= 2) {
        this.list.push(Effect.IRON_DEFENSE);
      }
    }

    if (synergies.GROUND >= 0) {
      if (synergies.GROUND >= 6) {
        this.list.push(Effect.SANDSTORM);
      } else if (synergies.GROUND >= 4) {
        this.list.push(Effect.ROTOTILLER);
      } else if (synergies.GROUND >= 2) {
        this.list.push(Effect.SHORE_UP);
      }
    }

    if (synergies.POISON >= 0) {
      if (synergies.POISON >= 6) {
        this.list.push(Effect.TOXIC);
      } else if (synergies.POISON >= 3) {
        this.list.push(Effect.POISON_GAS);
      }
    }

    if (synergies.DRAGON >= 0) {
      if (synergies.DRAGON >= 5) {
        this.list.push(Effect.DRAGON_DANCE);
      } else if (synergies.DRAGON >= 3) {
        this.list.push(Effect.DRAGON_ENERGY);
      }
    }

    if (synergies.FIELD >= 0) {
      if (synergies.FIELD >= 9) {
        this.list.push(Effect.ANGER_POINT);
      } else if (synergies.FIELD >= 6) {
        this.list.push(Effect.RAGE);
      } else if (synergies.FIELD >= 3) {
        this.list.push(Effect.BULK_UP);
      }
    }

    if (synergies.MONSTER >= 0) {
      if (synergies.MONSTER >= 6) {
        this.list.push(Effect.POWER_TRIP);
      } else if (synergies.MONSTER >= 4) {
        this.list.push(Effect.BRUTAL_SWING);
      } else if (synergies.MONSTER >= 2) {
        this.list.push(Effect.PURSUIT);
      }
    }

    if (synergies.HUMAN >= 0) {
      if (synergies.HUMAN >= 6) {
        this.list.push(Effect.CALM_MIND);
      } else if (synergies.HUMAN >= 4) {
        this.list.push(Effect.FOCUS_ENERGY);
      } else if (synergies.HUMAN >= 2) {
        this.list.push(Effect.MEDITATE);
      }
    }

    if (synergies.AQUATIC >= 0) {
      if (synergies.AQUATIC >= 4) {
        this.list.push(Effect.HYDRO_CANNON);
      } else if (synergies.AQUATIC >= 2) {
        this.list.push(Effect.SWIFT_SWIM);
      }
    }

    if (synergies.BUG >= 0) {
      if (synergies.BUG >= 5) {
        this.list.push(Effect.STICKY_WEB);
      } else if (synergies.BUG >= 2) {
        this.list.push(Effect.SWARM);
      }
    }

    if (synergies.FLYING >= 0) {
      if (synergies.FLYING >= 8) {
        this.list.push(Effect.MAX_GUARD);
      } else if (synergies.FLYING >= 6) {
        this.list.push(Effect.MAX_AIRSTREAM);
      } else if (synergies.FLYING >= 4) {
        this.list.push(Effect.FEATHER_DANCE);
      } else if (synergies.FLYING >= 2) {
        this.list.push(Effect.TAILWIND);
      }
    }
    if (synergies.FLORA >= 0) {
      if (synergies.FLORA >= 5) {
        this.list.push(Effect.SUN_FLOWER);
      } else if (synergies.FLORA >= 4) {
        this.list.push(Effect.VILE_FLOWER);
      } else if (synergies.FLORA >= 3) {
        this.list.push(Effect.GLOOM_FLOWER);
      } else if (synergies.FLORA >= 2) {
        this.list.push(Effect.ODD_FLOWER);
      }
    }
    if (synergies.MINERAL >= 0) {
      if (synergies.MINERAL >= 6) {
        this.list.push(Effect.DIAMOND_STORM);
      } else if (synergies.MINERAL >= 4) {
        this.list.push(Effect.MOUTAIN_RESISTANCE);
      } else if (synergies.MINERAL >= 2) {
        this.list.push(Effect.BATTLE_ARMOR);
      }
    }
    if (synergies.GHOST >= 0) {
      if (synergies.GHOST >= 4) {
        this.list.push(Effect.CURSE);
      } else if (synergies.GHOST >= 2) {
        this.list.push(Effect.PHANTOM_FORCE);
      }
    }

    if (synergies.FAIRY >= 0) {
      if (synergies.FAIRY >= 6) {
        this.list.push(Effect.STRANGE_STEAM);
      } else if (synergies.FAIRY >= 4) {
        this.list.push(Effect.FAIRY_WIND);
      } else if (synergies.FAIRY >= 2) {
        this.list.push(Effect.AROMATIC_MIST);
      }
    }

    if (synergies.ICE >= 0) {
      if (synergies.ICE >= 4) {
        this.list.push(Effect.SHEER_COLD);
      } else if (synergies.ICE >= 2) {
        this.list.push(Effect.SNOW);
      }
    }
    if (synergies.SOUND >= 0) {
      if (synergies.SOUND >= 7) {
        this.list.push(Effect.PRESTO);
      } else if (synergies.SOUND >= 5) {
        this.list.push(Effect.ALLEGRO);
      } else if (synergies.SOUND >= 3) {
        this.list.push(Effect.LARGO);
      }
    }
  }
}