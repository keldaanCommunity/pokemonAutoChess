const CLIMATE = require("./enum").CLIMATE;
const EFFECTS = require("./enum").EFFECTS;

class Effects extends schema.Schema {
  constructor() {
    super();    
    this.climate = CLIMATE.NEUTRAL;
    this.effetcs = [];
  }

  update(synergies, board){
    this.updateEffects(synergies);
    this.climate = this.getClimate();
  }

  getClimate(){
      let climate = CLIMATE.NEUTRAL;
      if (this.effetcs.includes(EFFECTS.DRIZZLE)){
        climate = CLIMATE.RAIN;
      }
      if(this.effetcs.includes(EFFECTS.DROUGHT)){
        climate = CLIMATE.SUN;
      }
      if(this.effetcs.includes(EFFECTS.SANDSTORM)){
        climate = CLIMATE.SANDSTORM;
      }
      if(this.effetcs.includes(EFFECTS.PRIMORDIAL_SEA)){
        climate = CLIMATE.RAIN;
      }
      return climate;
  }

  updateEffects(synergies){
    if(synergies.GRASS >= 3){
         this.effetcs.push(EFFECTS.INGRAIN);
    }
    if(synergies.GRASS >= 6){
         this.effetcs.push(EFFECTS.GROWTH);
    }
    if(synergies.GRASS >= 9){
         this.effetcs.push(EFFECTS.SPORE);
    }
    if(synergies.FIRE >= 3){
         this.effetcs.push(EFFECTS.BLAZE);
    }
    if(synergies.FIRE >= 6){
         this.effetcs.push(EFFECTS.DROUGHT);
    }
    if(synergies.WATER >= 3){
         this.effetcs.push(EFFECTS.DRIZZLE);
    }
    if(synergies.WATER >= 6){
         this.effetcs.push(EFFECTS.RAIN_DANCE);
    }
    if(synergies.WATER >= 9){
         this.effetcs.push(EFFECTS.PRIMORDIAL_SEA);
    }
    if(synergies.NORMAL >= 3){
         this.effetcs.push(EFFECTS.STAMINA);
    }
    if(synergies.NORMAL >= 6){
         this.effetcs.push(EFFECTS.STRENGTH);
    }
    if(synergies.NORMAL >= 9){
        this.effetcs.push(EFFECTS.PURE_POWER);
    }
    if(synergies.ELECTRICITY >= 0){
        this.effetcs.push(EFFECTS.AGILITY);
    }
    if(synergies.FIGHTING >= 2){
        this.effetcs.push(EFFECTS.REVENGE);
    }
    if(synergies.FIGHTING >= 4){
        this.effetcs.push(EFFECTS.PUNISHMENT);
    }
    if(synergies.PSYCHIC >= 2){
        this.effetcs.push(EFFECTS.PSYWAVE);
    }
    if(synergies.PSYCHIC >= 4){
        this.effetcs.push(EFFECTS.MAGIC_ROOM);
    }
    if(synergies.DARK >= 2){
        this.effetcs.push(EFFECTS.MEAN_LOOK);
    }
    if(synergies.DARK >= 4){
        this.effetcs.push(EFFECTS.SCARY_FACE);
    }
    if(synergies.METAL >= 2){
        this.effetcs.push(EFFECTS.IRON_DEFENSE);
    }
    if(synergies.METAL >= 4){
        this.effetcs.push(EFFECTS.AUTOTOMIZE);
    }
    if(synergies.GROUND >= 2){
        this.effetcs.push(EFFECTS.SPIKES);
    }
    if(synergies.GROUND >= 4){
        this.effetcs.push(EFFECTS.STEALTH_ROCK);
    }
    if(synergies.GROUND >= 6){
        this.effetcs.push(EFFECTS.SANDSTORM);
    }
    if(synergies.POISON >= 2){
        this.effetcs.push(EFFECTS.POISON_GAS);
    }
    if(synergies.POISON >= 4){
        this.effetcs.push(EFFECTS.TOXIC);
    }
    if(synergies.DRAGON >= 2){
        this.effetcs.push(EFFECTS.INTIMIDATE);
    }
    if(synergies.DRAGON >= 4){
        this.effetcs.push(EFFECTS.DRACO_METEOR);
    }
    if(synergies.FIELD >= 3){
        this.effetcs.push(EFFECTS.WORK_UP);
    }
    if(synergies.FIELD >= 6){
        this.effetcs.push(EFFECTS.RAGE);
    }
    if(synergies.FIELD >= 9){
        this.effetcs.push(EFFECTS.ANGER_POINT);
    }
    if(synergies.MONSTER >= 3){
        this.effetcs.push(EFFECTS.PURSUIT);
    }
    if(synergies.MONSTER >= 6){
        this.effetcs.push(EFFECTS.BRUTAL_SWING);
    }
    if(synergies.MONSTER >= 9){
        this.effetcs.push(EFFECTS.POWER_TRIP);
    }
    if(synergies.HUMAN >= 3){
        this.effetcs.push(EFFECTS.MEDITATE);
    }
    if(synergies.HUMAN >= 6){
        this.effetcs.push(EFFECTS.FOCUS_ENERGY);
    }
    if(synergies.HUMAN >= 9){
        this.effetcs.push(EFFECTS.CALM_MIND);
    }
    if(synergies.AQUATIC >= 3){
        this.effetcs.push(EFFECTS.SWIFT_SWIM);
    }
    if(synergies.AQUATIC >= 6){
        this.effetcs.push(EFFECTS.HYDO_CANNON);
    }
    if(synergies.BUG >= 2){
        this.effetcs.push(EFFECTS.SWARM);
    }
    if(synergies.BUG >= 4){
        this.effetcs.push(EFFECTS.STICKY_WEB);
    }
    if(synergies.FLYING >= 2){
        this.effetcs.push(EFFECTS.RAZOR_WIND);
    }
    if(synergies.FLYING >= 4){
        this.effetcs.push(EFFECTS.HURRICANE);
    }
    if(synergies.FLORA >= 2){
        this.effetcs.push(EFFECTS.RAIN_DISH);
    }
    if(synergies.FLORA >= 4){
        this.effetcs.push(EFFECTS.FLOWER_SHIELD);
    }
    if(synergies.MINERAL >= 0){
        this.effetcs.push(EFFECTS.BATTLE_ARMOR);
    }
    if(synergies.AMORPH >= 0){
        this.effetcs.push(EFFECTS.PHANTOM_FORCE);
    }
    if(synergies.FAIRY >= 2){
        this.effetcs.push(EFFECTS.ATTRACT);
    }
    if(synergies.FAIRY >= 4){
        this.effetcs.push(EFFECTS.BABY_DOLL_EYES);
    }
  }
}

module.exports = Effects;