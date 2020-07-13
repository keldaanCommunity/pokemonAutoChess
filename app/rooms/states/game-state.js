const Player = require("../../models/player");
const Shop = require("../../models/shop");
const schema = require("@colyseus/schema");
const STATE = require("../../models/enum").STATE;

class GameState extends schema.Schema {
    constructor() {
      super();
      this.time = 5000;
      this.roundTime = Math.round(this.time/1000);
      this.phase = STATE.PICK;
      this.players = new schema.MapSchema();
      this.shop = new Shop();
    }
  }
  
  schema.defineTypes(GameState, {
    roundTime: "uint8",
    phase: "string",
    players: { map: Player }
  });

  module.exports = GameState;