const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;
const Pokemon = require('./Pokemon').Pokemon;
const ExperienceManager = require('./ExperienceManager');
const LogElement = require('../type/LogElement');

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
        this.simulationState = null;
        this.simulationResult = new ArraySchema();
    }

    setLog(array)
    {   
        let self = this;
        this.simulationResult.splice(0, this.simulationResult.length - 1);
        array.forEach(element => {
            self.simulationResult.push(new LogElement(element[0], element[1]));
        });
    }
}

schema.defineTypes(Player,
    {
        id: "string",
        facebookName: "string",
        board: {map: Pokemon},
        shop: {map: Pokemon},
        experienceManager: ExperienceManager,
        level: "number",
        money: "number",
        simulationResult: [LogElement]
    }
)

module.exports = Player;