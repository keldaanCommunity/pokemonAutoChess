const schema = require("@colyseus/schema");
const Pokemon = require("./pokemon").Pokemon;
const ExperienceManager = require("./experience-manager");

const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
  constructor(id, facebookName) {
    super();
    this.id = id;
    this.facebookName = facebookName;
    this.board = new MapSchema();
    this.shop = new MapSchema();
    this.experienceManager = new ExperienceManager();
    this.money = 5;
    this.life = 10;
  }
}

schema.defineTypes(Player, {
  id: "string",
  facebookName: "string",
  board: { map: Pokemon },
  shop: { map: Pokemon },
  experienceManager: ExperienceManager,
  level: "number",
  money: "number",
  life: "number"
});

module.exports = Player;