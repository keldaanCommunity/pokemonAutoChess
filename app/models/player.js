const schema = require("@colyseus/schema");
const Pokemon = require("./pokemon").Pokemon;
const ExperienceManager = require("./experience-manager");
const LogElement = require("./log-element");

const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

class Player extends Schema {
  constructor(id, facebookName) {
    super();
    this.id = id;
    this.facebookName = facebookName;
    this.board = new MapSchema();
    this.shop = new MapSchema();
    this.experienceManager = new ExperienceManager();
    this.money = 0;
    this.simulationState = null;
    this.simulationResult = new ArraySchema();
    this.life = 10;
  }

  setLog(array) {
    let self = this;
    this.simulationResult.splice(0, this.simulationResult.length - 1);
    array.forEach(element => {
      self.simulationResult.push(new LogElement(element[0], element[1]));
    });
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
  life: "number",
  simulationResult: [LogElement]
});

module.exports = Player;