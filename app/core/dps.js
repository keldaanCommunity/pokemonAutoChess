const schema = require('@colyseus/schema');

class Dps extends schema.Schema {
  constructor(id, name) {
    super();
    this.assign(
        {
          id: id,
          name: name,
          physicalDamage: 0,
          specialDamage: 0,
          trueDamage: 0
        }
    );
  }

  changeDamage(physicalDamage, specialDamage, trueDamage) {
    if (this.physicalDamage != physicalDamage) {
      this.physicalDamage = physicalDamage;
    }
    if (this.specialDamage != specialDamage) {
      this.specialDamage = specialDamage;
    }
    if (this.trueDamage != trueDamage) {
      this.trueDamage = trueDamage;
    }
  }
}

schema.defineTypes(Dps, {
  id: 'string',
  name: 'string',
  physicalDamage: 'uint16',
  specialDamage: 'uint16',
  trueDamage: 'uint16'
});

module.exports = Dps;
