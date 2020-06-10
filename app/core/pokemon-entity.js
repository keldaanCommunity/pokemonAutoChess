const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const STATE_TYPE = require('../models/enum').STATE_TYPE;
const ORIENTATION = require('../models/enum').ORIENTATION;
const MovingState = require('./moving-state');
const uniqid = require("uniqid");

class PokemonEntity extends Schema {
    constructor(index, type, positionX, positionY) {
        super();
        this.id = uniqid();
        this.positionX = positionX;
        this.positionY = positionY;
        this.index = index;
        this.type = type;
        this.state = new MovingState();
        this.action = STATE_TYPE.MOVING;
        this.orientation = ORIENTATION.DOWNLEFT;
    }

    update(dt, board) {
        this.state.update(this, dt, board);
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
    positionX: "number",
    positionY: "number",
    action: "string",
    index: "number",
    type: "string",
    id:"string",
    orientation:"string"
});
  
module.exports = PokemonEntity;