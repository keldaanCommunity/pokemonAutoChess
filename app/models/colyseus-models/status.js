const schema = require('@colyseus/schema');
const {ITEM} = require('../enum');

class Status extends schema.Schema {
  constructor() {
    super();
    this.assign({
      burn: false,
      silence: false,
      poison: false,
      freeze: false,
      protect: false,
      sleep: false,
      confusion: false,
      wound: false,
      resurection: false,
      smoke: false,
      armorReduction: false,
      runeProtect: false
    });
    this.temporaryShield = false;
    this.soulDew = false;
    this.brightPowder = false;
    this.flameOrb = false;

    this.burnOrigin = undefined;
    this.poisonOrigin = undefined;
    this.burnCooldown = 0;
    this.silenceCooldown = 0;
    this.poisonCooldown = 0;
    this.freezeCooldown = 0;
    this.protectCooldown = 0;
    this.sleepCooldown = 0;
    this.confusionCooldown = 0;
    this.woundCooldown = 0;
    this.temporaryShieldCooldown = 0;
    this.soulDewCooldown = 0;
    this.brightPowderCooldown = 0;
    this.smokeCooldown = 0;
    this.armorReductionCooldown = 0;
    this.flameOrbCooldown = 0;
  }

  triggerFlameOrb(timer) {
    if (!this.flameOrb) {
      this.flameOrb = true;
      this.flameOrbCooldown = timer;
    }
  }

  updateFlameOrb(dt, pkm, board) {
    if (this.flameOrbCooldown - dt <= 0) {
      this.flameOrb = false;
      const cells = board.getAdjacentCells(pkm.positionX, pkm.positionY);
      let flameCount = 1;
      cells.forEach((cell) => {
        if (cell.value && pkm.team != cell.value.team && flameCount > 0) {
          cell.value.status.triggerBurn(8000, cell.value, pkm);
          flameCount --;
        }
      });
      if (pkm.items.has(ITEM.FLAME_ORB)) {
        pkm.status.triggerFlameOrb(2000);
      }
    } else {
      this.flameOrbCooldown = this.flameOrbCooldown - dt;
    }
  }

  triggerArmorReduction(timer) {
    if (!this.armorReduction) {
      this.armorReduction = true;
      this.armorReductionCooldown = timer;
    }
  }

  updateArmorReduction(dt) {
    if (this.armorReductionCooldown - dt <= 0) {
      this.armorReduction = false;
    } else {
      this.armorReductionCooldown = this.armorReductionCooldown - dt;
    }
  }

  triggerSoulDew(timer) {
    // console.log('sould dew');
    if (!this.soulDew) {
      this.soulDew = true;
      this.soulDewCooldown = timer;
    }
  }

  updateSoulDew(dt, pkm) {
    if (this.soulDewCooldown - dt <= 0) {
      this.soulDew = false;
      pkm.spellDamage += 3;
      if (pkm.items.has(ITEM.SOUL_DEW)) {
        this.triggerSoulDew(5000);
      }
    } else {
      this.soulDewCooldown = this.soulDewCooldown - dt;
    }
  }

  triggerBurn(timer, pkm, origin) {
    if (!this.burn && !pkm.items.has(ITEM.WIDE_LENS)) {
      this.burn = true;
      this.burnCooldown = timer;
      if (origin) {
        this.burnOrigin = origin;
      }
    }
  }

  updateBurn(dt) {
    if (this.burnCooldown - dt <= 0) {
      this.burn = false;
      this.burnOrigin = undefined;
    } else {
      this.burnCooldown = this.burnCooldown - dt;
    }
  }

  triggerSilence(timer) {
    if (!this.silence) {
      this.silence = true;
      this.silenceCooldown = timer;
    }
  }

  updateSilence(dt) {
    if (this.silenceCooldown - dt <= 0) {
      this.silence = false;
    } else {
      this.silenceCooldown = this.silenceCooldown - dt;
    }
  }

  triggerPoison(timer, pkm, origin) {
    if (!this.poison && !pkm.items.has(ITEM.WIDE_LENS)) {
      this.poison = true;
      this.poisonCooldown = timer;
      if (origin) {
        this.poisonOrigin = origin;
      }
    }
  }

  updatePoison(dt) {
    if (this.poisonCooldown - dt <= 0) {
      this.poison = false;
      this.poisonOrigin = undefined;
    } else {
      this.poisonCooldown = this.poisonCooldown - dt;
    }
  }

  triggerFreeze(timer) {
    if (!this.freeze) {
      this.freeze = true;
      this.freezeCooldown = timer;
    }
  }

  updateFreeze(dt) {
    if (this.freezeCooldown - dt <= 0) {
      this.freeze = false;
    } else {
      this.freezeCooldown = this.freezeCooldown - dt;
    }
  }

  triggerProtect(timer) {
    if (!this.protect) {
      this.protect = true;
      this.protectCooldown = timer;
    }
  }

  updateProtect(dt) {
    if (this.protectCooldown - dt <= 0) {
      this.protect = false;
    } else {
      this.protectCooldown = this.protectCooldown - dt;
    }
  }

  triggerSleep(timer) {
    if (!this.sleep) {
      this.sleep = true;
      this.sleepCooldown = timer;
    }
  }

  updateSleep(dt) {
    if (this.sleepCooldown - dt <= 0) {
      this.sleep = false;
    } else {
      this.sleepCooldown = this.sleepCooldown - dt;
    }
  }

  triggerConfusion(timer) {
    if (!this.confusion) {
      this.confusion = true;
      this.confusionCooldown = timer;
    }
  }

  updateConfusion(dt) {
    if (this.confusionCooldown - dt <= 0) {
      this.confusion = false;
    } else {
      this.confusionCooldown = this.confusionCooldown - dt;
    }
  }

  triggerWound(timer) {
    if (!this.wound) {
      this.wound = true;
      this.woundCooldown = timer;
    }
  }

  updateWound(dt) {
    if (this.woundCooldown - dt <= 0) {
      this.wound = false;
    } else {
      this.woundCooldown = this.woundCooldown - dt;
    }
  }

  triggerShield(timer) {
    if (!this.temporaryShield) {
      this.temporaryShield = true;
      this.temporaryShieldCooldown = timer;
    }
  }

  updateShield(dt, pkm) {
    if (this.temporaryShieldCooldown - dt <= 0) {
      this.temporaryShield = false;
      pkm.shield = 0;
    } else {
      this.temporaryShieldCooldown = this.temporaryShieldCooldown - dt;
    }
  }

  triggerBrightPowder(timer) {
    if (!this.brightPowder) {
      this.brightPowder = true;
      this.brightPowderCooldown = timer;
    }
  }

  updateBrightPowder(dt, pokemon, board) {
    if (this.brightPowderCooldown - dt <= 0) {
      this.brightPowder = false;
      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

      cells.forEach((cell) => {
        if (cell.value && pokemon.team == cell.value.team) {
          cell.value.handleHeal(0.18 * cell.value.hp, pokemon);
          cell.value.count.brightPowderCount ++;
        }
      });
      pokemon.handleHeal(0.18 * pokemon.hp, pokemon);

      if (pokemon.items.has(ITEM.BRIGHT_POWDER)) {
        pokemon.status.triggerBrightPowder(5000);
        pokemon.count.brightPowderCount ++;
      }
    } else {
      this.brightPowderCooldown = this.brightPowderCooldown - dt;
    }
  }

  triggerSmoke(timer, pkm) {
    if (!this.smoke) {
      this.smoke = true;
      pkm.handleAttackSpeed(-30);
      this.smokeCooldown = timer;
    }
  }

  updateSmoke(dt, pkm) {
    if (this.smokeCooldown - dt <= 0) {
      this.smoke = false;
      pkm.handleAttackSpeed(30);
    } else {
      this.smokeCooldown = this.smokeCooldown - dt;
    }
  }

  triggerRuneProtect() {
    // console.log('rune pritec');
    this.runeProtect = true;
  }

  disableRuneProtect() {
    this.runeProtect = false;
  }
}

schema.defineTypes(Status, {
  burn: 'boolean',
  silence: 'boolean',
  poison: 'boolean',
  freeze: 'boolean',
  protect: 'boolean',
  sleep: 'boolean',
  confusion: 'boolean',
  wound: 'boolean',
  resurection: 'boolean',
  smoke: 'boolean',
  armorReduction: 'boolean',
  runeProtect: 'boolean'
});

module.exports = Status;
