const schema = require('@colyseus/schema');

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
      resurection: false
    });

    this.burnCooldown = 0;
    this.silenceCooldown = 0;
    this.poisonCooldown = 0;
    this.freezeCooldown = 0;
    this.protectCooldown = 0;
    this.sleepCooldown = 0;
    this.confusionCooldown = 0;
    this.woundCooldown = 0;
  }

  triggerBurn(timer) {
    if (!this.burn) {
      this.burn = true;
      this.burnCooldown = timer;
    }
  }

  updateBurn(dt) {
    if (this.burnCooldown - dt <= 0) {
      this.burn = false;
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

  triggerPoison(timer) {
    if (!this.poison) {
      this.poison = true;
      this.poisonCooldown = timer;
    }
  }

  updatePoison(dt) {
    if (this.poisonCooldown - dt <= 0) {
      this.poison = false;
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
  resurection: 'boolean'
});

module.exports = Status;
