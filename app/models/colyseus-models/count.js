const schema = require('@colyseus/schema');

class Count extends schema.Schema {
  constructor() {
    super();
    this.assign({
      crit: 0,
      ult: 0,
      petalDanceCount: 0,
      fieldCount: 0,
      soundCount: 0,
      fairyCritCount: 0,
      attackCount: 0,
      growGroundCount: 0,
      dodgeCount: 0,
      incenseCount: 0,
      staticCount: 0,
      brightPowderCount: 0,
      doubleAttackCount: 0
    });
    this.staticHolderCount = 0;
    this.defensiveRibbonCount = 0;
  }
}

schema.defineTypes(Count, {
  crit: 'uint8',
  ult: 'uint8',
  petalDanceCount: 'uint8',
  fieldCount: 'uint8',
  soundCount: 'uint8',
  fairyCritCount: 'uint8',
  attackCount: 'uint8',
  growGroundCount: 'uint8',
  dodgeCount: 'uint8',
  incenseCount: 'uint8',
  staticCount: 'uint8',
  brightPowderCount: 'uint8',
  doubleAttackCount: 'uint8'
});

module.exports = Count;
