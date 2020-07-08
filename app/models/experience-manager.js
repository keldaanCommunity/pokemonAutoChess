const schema = require("@colyseus/schema");
const EXP_TABLE = require("./enum").EXP_TABLE;

class ExperienceManager extends schema.Schema {
  constructor() {
    super();
    this.level = 2;
    this.experience = 0;
    this.expNeeded = EXP_TABLE[this.level];
    this.maxLevel = 9;
  }

  addExperience(quantity) {
    let expToAdd = quantity;
    while (this.checkForLevelUp(expToAdd)) {
      expToAdd -= EXP_TABLE[this.level];
      this.level += 1;
      this.expNeeded = EXP_TABLE[this.level];
    }
  }

  checkForLevelUp(quantity) {
    if (this.experience + quantity >= EXP_TABLE[this.level] && this.level < this.maxLevel) {
      return true;
    }
    else {
      this.experience += quantity;
      return false;
    }
  }
}

schema.defineTypes(ExperienceManager, {
  level: "uint8",
  experience: "uint8",
  expNeeded: "uint8"
});

module.exports = ExperienceManager;