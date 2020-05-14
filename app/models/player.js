const schema = require("@colyseus/schema");
const Pokemon = require("./pokemon").Pokemon;
const ExperienceManager = require("./experience-manager");
const Simulation = require('../core/simulation');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
    this.board = new MapSchema();
    this.shop = new MapSchema();
    this.experienceManager = new ExperienceManager();
    this.money = 5;
    this.life = 20;
    this.simulation = new Simulation({},{});
    this.shopLocked = false;
    this.streak = 0;
    this.interest = 0;
    this.lastBattleResult = "No battle yet";
  }
}

schema.defineTypes(Player, {
  id: "string",
  name: "string",
  board: { map: Pokemon },
  shop: { map: Pokemon },
  simulation : Simulation,
  experienceManager: ExperienceManager,
  level: "number",
  money: "number",
  life: "number",
  shopLocked: "boolean",
  streak: "number",
  interest : "number",
  lastBattleResult: "string"
});

module.exports = Player;