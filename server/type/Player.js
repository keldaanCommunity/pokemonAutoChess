const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const Pokemon = require('./Pokemon').Pokemon;
const ExperienceManager = require('./ExperienceManager');
const SimulationState  = require('../simulation/SimulationState');

class Player extends Schema
{
    constructor(id, facebookName)
    {
        super();
        this.id = id;
        this.facebookName = facebookName;
        this.board = new MapSchema();
        this.shop = new MapSchema();
        this.experienceManager = new ExperienceManager();
        this.money = 0;
        this.simulationState = new SimulationState();
    }
}

schema.defineTypes(Player,
    {
        id:"string",
        facebookName:"string",
        board: {map: Pokemon},
        shop: {map: Pokemon},
        experienceManager: ExperienceManager,
        level: "number",
        money: "number",
        simulationState: SimulationState
    }
)

module.exports = Player;