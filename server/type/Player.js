const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const Pokemon = require('./Pokemon').Pokemon;

class Player extends Schema
{
    constructor(id){
        super();
        this.id = id;
        this.board = new MapSchema();
        this.team = new MapSchema();
        this.shop = new MapSchema();
        this.level = 2;
    }
}

schema.defineTypes(Player,{
    id:"string",
    board: {map: Pokemon},
    team: {map: Pokemon},
    shop: {map: Pokemon},
    level: "number"
})

module.exports = Player;