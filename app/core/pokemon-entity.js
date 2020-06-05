const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const STATE_TYPE = require('../models/enum').STATE_TYPE;
const MovingState = require('./moving-state');
const uniqid = require("uniqid");

class PokemonEntity extends Schema {
    constructor(name, type, x, y) {
        super();
        this.id = uniqid();
        this.x = x;
        this.y = y;
        this.name = name;
        this.type = type;
        this.state = new MovingState();
        this.action = STATE_TYPE.MOVING;
    }

    update() {
        this.state.update(this);
    }

    handleDamage(damage) {
        this.state.handleDamage(this, damage);
    }
    
    changeState(state) {
        this.state.onExit(this);
        this.state = state;
        this.state.onEnter(this);
    }
}

schema.defineTypes(PokemonEntity, {
    x: "number",
    y: "number",
    action: "string",
    name: "string",
    type: "string"
});
  
module.exports = PokemonEntity;