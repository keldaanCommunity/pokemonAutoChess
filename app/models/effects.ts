import Synergies from "./colyseus-models/synergies";
import { CLIMATE } from "./enum";
import { Effect } from "../types/enum/Effect";
import { Synergy } from "../types/enum/Synergy";

export class Effects {
  climate: string;
  list: any[];

  constructor() {
    this.climate = CLIMATE.NEUTRAL;
    this.list = [];
  }

  update(synergies: Synergies) {
    this.list = [];
    if (synergies.get(Synergy.GRASS) >= 0) {
      if (synergies.get(Synergy.GRASS) >= 7) {
        this.list.push(Effect.SPORE);
      } else if (synergies.get(Synergy.GRASS) >= 5) {
        this.list.push(Effect.GROWTH);
      } else if (synergies.get(Synergy.GRASS) >= 3) {
        this.list.push(Effect.INGRAIN);
      }
    }

    if (synergies.get(Synergy.FIRE) >= 0) {
      if (synergies.get(Synergy.FIRE) >= 6) {
        this.list.push(Effect.DESOLATE_LAND);
      } else if (synergies.get(Synergy.FIRE) >= 4) {
        this.list.push(Effect.DROUGHT);
      } else if (synergies.get(Synergy.FIRE) >= 2) {
        this.list.push(Effect.BLAZE);
      }
    }
    if (synergies.get(Synergy.FOSSIL) >= 0) {
      if (synergies.get(Synergy.FOSSIL) >= 6) {
        this.list.push(Effect.UNOWN_GATHERINGS);
      } else if (synergies.get(Synergy.FOSSIL) >= 4) {
        this.list.push(Effect.ELDER_POWER);
      } else if (synergies.get(Synergy.FOSSIL) >= 2) {
        this.list.push(Effect.ANCIENT_POWER);
      }
    }
    if (synergies.get(Synergy.WATER) >= 0) {
      if (synergies.get(Synergy.WATER) >= 9) {
        this.list.push(Effect.PRIMORDIAL_SEA);
      } else if (synergies.get(Synergy.WATER) >= 6) {
        this.list.push(Effect.RAIN_DANCE);
      } else if (synergies.get(Synergy.WATER) >= 3) {
        this.list.push(Effect.DRIZZLE);
      }
    }

    if (synergies.get(Synergy.NORMAL) >= 0) {
      if (synergies.get(Synergy.NORMAL) >= 9) {
        this.list.push(Effect.PURE_POWER);
      } else if (synergies.get(Synergy.NORMAL) >= 6) {
        this.list.push(Effect.STRENGTH);
      } else if (synergies.get(Synergy.NORMAL) >= 3) {
        this.list.push(Effect.STAMINA);
      }
    }

    if (synergies.get(Synergy.ELECTRIC) > 0) {
      if (synergies.get(Synergy.ELECTRIC) >= 6) {
        this.list.push(Effect.OVERDRIVE);
      } else if (synergies.get(Synergy.ELECTRIC) >= 4) {
        this.list.push(Effect.RISING_VOLTAGE);
      } else if (synergies.get(Synergy.ELECTRIC) >= 2) {
        this.list.push(Effect.EERIE_IMPULSE);
      }
    }

    if (synergies.get(Synergy.FIGHTING) >= 0) {
      if (synergies.get(Synergy.FIGHTING) >= 4) {
        this.list.push(Effect.PUNISHMENT);
      } else if (synergies.get(Synergy.FIGHTING) >= 2) {
        this.list.push(Effect.REVENGE);
      }
    }

    if (synergies.get(Synergy.PSYCHIC) >= 0) {
      if (synergies.get(Synergy.PSYCHIC) >= 6) {
        this.list.push(Effect.EERIE_SPELL);
      } else if (synergies.get(Synergy.PSYCHIC) >= 4) {
        this.list.push(Effect.LIGHT_SCREEN);
      } else if (synergies.get(Synergy.PSYCHIC) >= 2) {
        this.list.push(Effect.AMNESIA);
      }
    }

    if (synergies.get(Synergy.DARK) >= 0) {
      if (synergies.get(Synergy.DARK) >= 6) {
        this.list.push(Effect.BEAT_UP);
      } else if (synergies.get(Synergy.DARK) >= 4) {
        this.list.push(Effect.ASSURANCE);
      } else if (synergies.get(Synergy.DARK) >= 2) {
        this.list.push(Effect.HONE_CLAWS);
      }
    }

    if (synergies.get(Synergy.METAL) >= 0) {
      if (synergies.get(Synergy.METAL) >= 4) {
        this.list.push(Effect.AUTOTOMIZE);
      } else if (synergies.get(Synergy.METAL) >= 2) {
        this.list.push(Effect.IRON_DEFENSE);
      }
    }

    if (synergies.get(Synergy.GROUND) >= 0) {
      if (synergies.get(Synergy.GROUND) >= 6) {
        this.list.push(Effect.SANDSTORM);
      } else if (synergies.get(Synergy.GROUND) >= 4) {
        this.list.push(Effect.ROTOTILLER);
      } else if (synergies.get(Synergy.GROUND) >= 2) {
        this.list.push(Effect.SHORE_UP);
      }
    }

    if (synergies.get(Synergy.POISON) >= 0) {
      if (synergies.get(Synergy.POISON) >= 6) {
        this.list.push(Effect.TOXIC);
      } else if (synergies.get(Synergy.POISON) >= 3) {
        this.list.push(Effect.POISON_GAS);
      }
    }

    if (synergies.get(Synergy.DRAGON) >= 0) {
      if (synergies.get(Synergy.DRAGON) >= 5) {
        this.list.push(Effect.DRAGON_DANCE);
      } else if (synergies.get(Synergy.DRAGON) >= 3) {
        this.list.push(Effect.DRAGON_ENERGY);
      }
    }

    if (synergies.get(Synergy.FIELD) >= 0) {
      if (synergies.get(Synergy.FIELD) >= 9) {
        this.list.push(Effect.ANGER_POINT);
      } else if (synergies.get(Synergy.FIELD) >= 6) {
        this.list.push(Effect.RAGE);
      } else if (synergies.get(Synergy.FIELD) >= 3) {
        this.list.push(Effect.BULK_UP);
      }
    }

    if (synergies.get(Synergy.MONSTER) >= 0) {
      if (synergies.get(Synergy.MONSTER) >= 6) {
        this.list.push(Effect.POWER_TRIP);
      } else if (synergies.get(Synergy.MONSTER) >= 4) {
        this.list.push(Effect.BRUTAL_SWING);
      } else if (synergies.get(Synergy.MONSTER) >= 2) {
        this.list.push(Effect.PURSUIT);
      }
    }

    if (synergies.get(Synergy.HUMAN) >= 0) {
      if (synergies.get(Synergy.HUMAN) >= 6) {
        this.list.push(Effect.CALM_MIND);
      } else if (synergies.get(Synergy.HUMAN) >= 4) {
        this.list.push(Effect.FOCUS_ENERGY);
      } else if (synergies.get(Synergy.HUMAN) >= 2) {
        this.list.push(Effect.MEDITATE);
      }
    }

    if (synergies.get(Synergy.AQUATIC) >= 0) {
      if (synergies.get(Synergy.AQUATIC) >= 4) {
        this.list.push(Effect.HYDRO_CANNON);
      } else if (synergies.get(Synergy.AQUATIC) >= 2) {
        this.list.push(Effect.SWIFT_SWIM);
      }
    }

    if (synergies.get(Synergy.BUG) >= 0) {
      if (synergies.get(Synergy.BUG) >= 5) {
        this.list.push(Effect.STICKY_WEB);
      } else if (synergies.get(Synergy.BUG) >= 2) {
        this.list.push(Effect.SWARM);
      }
    }

    if (synergies.get(Synergy.FLYING) >= 0) {
      if (synergies.get(Synergy.FLYING) >= 8) {
        this.list.push(Effect.MAX_GUARD);
      } else if (synergies.get(Synergy.FLYING) >= 6) {
        this.list.push(Effect.MAX_AIRSTREAM);
      } else if (synergies.get(Synergy.FLYING) >= 4) {
        this.list.push(Effect.FEATHER_DANCE);
      } else if (synergies.get(Synergy.FLYING) >= 2) {
        this.list.push(Effect.TAILWIND);
      }
    }
    if (synergies.get(Synergy.FLORA) >= 0) {
      if (synergies.get(Synergy.FLORA) >= 5) {
        this.list.push(Effect.SUN_FLOWER);
      } else if (synergies.get(Synergy.FLORA) >= 4) {
        this.list.push(Effect.VILE_FLOWER);
      } else if (synergies.get(Synergy.FLORA) >= 3) {
        this.list.push(Effect.GLOOM_FLOWER);
      } else if (synergies.get(Synergy.FLORA) >= 2) {
        this.list.push(Effect.ODD_FLOWER);
      }
    }
    if (synergies.get(Synergy.MINERAL) >= 0) {
      if (synergies.get(Synergy.MINERAL) >= 6) {
        this.list.push(Effect.DIAMOND_STORM);
      } else if (synergies.get(Synergy.MINERAL) >= 4) {
        this.list.push(Effect.MOUTAIN_RESISTANCE);
      } else if (synergies.get(Synergy.MINERAL) >= 2) {
        this.list.push(Effect.BATTLE_ARMOR);
      }
    }
    if (synergies.get(Synergy.GHOST) >= 0) {
      if (synergies.get(Synergy.GHOST) >= 4) {
        this.list.push(Effect.CURSE);
      } else if (synergies.get(Synergy.GHOST) >= 2) {
        this.list.push(Effect.PHANTOM_FORCE);
      }
    }

    if (synergies.get(Synergy.FAIRY) >= 0) {
      if (synergies.get(Synergy.FAIRY) >= 6) {
        this.list.push(Effect.STRANGE_STEAM);
      } else if (synergies.get(Synergy.FAIRY) >= 4) {
        this.list.push(Effect.FAIRY_WIND);
      } else if (synergies.get(Synergy.FAIRY) >= 2) {
        this.list.push(Effect.AROMATIC_MIST);
      }
    }

    if (synergies.get(Synergy.ICE) >= 0) {
      if (synergies.get(Synergy.ICE) >= 4) {
        this.list.push(Effect.SHEER_COLD);
      } else if (synergies.get(Synergy.ICE) >= 2) {
        this.list.push(Effect.SNOW);
      }
    }
    if (synergies.get(Synergy.SOUND) >= 0) {
      if (synergies.get(Synergy.SOUND) >= 7) {
        this.list.push(Effect.PRESTO);
      } else if (synergies.get(Synergy.SOUND) >= 5) {
        this.list.push(Effect.ALLEGRO);
      } else if (synergies.get(Synergy.SOUND) >= 3) {
        this.list.push(Effect.LARGO);
      }
    }
  }
}