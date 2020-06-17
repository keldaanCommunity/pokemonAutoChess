const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const STATE_TYPE = require('../models/enum').STATE_TYPE;
const ORIENTATION = require('../models/enum').ORIENTATION;
const MovingState = require('./moving-state');
const AttackingState = require('./attacking-state');
const uniqid = require("uniqid");

class PokemonEntity extends Schema {
    constructor(index, type, positionX, positionY, hp, atk, range, team) {
        super();
        this.id = uniqid();
        this.positionX = positionX;
        this.positionY = positionY;
        this.targetX = -1;
        this.targetY = -1;
        this.index = index;
        this.type = type;
        this.state = new MovingState();
        this.action = STATE_TYPE.MOVING;
        this.orientation = ORIENTATION.DOWNLEFT;
        this.atk = atk;
        this.life = hp;
        this.range = range;
        this.cooldown = 1000;
        this.team = team;
    }

    update(dt, board) {
        this.state.update(this, dt, board);
    }

    handleDamage(damage, board) {
        this.state.handleDamage(this, damage, board);
    }
    
    changeState(state) {
        this.state.onExit(this);
        this.state = state;
        this.state.onEnter(this);
    }

    toMovingState(){
        this.changeState(new MovingState());
    }

    toAttackingState(){
        this.changeState(new AttackingState());
    }
}

schema.defineTypes(PokemonEntity, {
    positionX: "number",
    positionY: "number",
    action: "string",
    index: "number",
    type: "string",
    id:"string",
    orientation:"string",
    life:"number",
    team:"number",
    range:"number",
    targetX:"number",
    targetY:"number"
});
  
module.exports = PokemonEntity;