const schema = require('@colyseus/schema');

class DpsHeal extends schema.Schema {
  constructor(id, name) {
    super();
    this.assign(
        {
          id: id,
          name: name,
          heal: 0,
          shield: 0
        }
    );
  }

  changeHeal(heal, shield) {
    if (this.heal != heal) {
      this.heal = heal;
    }
    if (this.shield != shield) {
      this.shield = shield;
    }
  }
}

schema.defineTypes(DpsHeal, {
  id: 'string',
  name: 'string',
  heal: 'uint16',
  shield: 'uint16'
});

module.exports = DpsHeal;
