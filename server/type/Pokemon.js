const TYPE = require('./Enum').TYPE;
const RARITY = require('./Enum').RARITY;
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;
const uniqid = require('uniqid');

class Pokemon extends Schema
{
    constructor(name, types, rarity, index, evolution)
    {
        super();
        this.id = uniqid();
        this.name = name;
        this.types = new ArraySchema();
        types.forEach(type=>{this.types.push(type)});
        this.rarity = rarity;
        this.index = index;
        this.evolution = evolution;
    }    
}

class Bulbasaur extends Pokemon
{
    constructor()
    {
        super('bulbasaur',[TYPE.POISON, TYPE.GRASS], RARITY.UNCOMMON, 1, 'ivysaur');
    }
}

class Ivysaur extends Pokemon
{
    constructor()
    {
        super('ivysaur',[TYPE.POISON, TYPE.GRASS], RARITY.UNCOMMON, 2, 'venusaur');
    }
}

class Venusaur extends Pokemon
{
    constructor()
    {
        super('venusaur',[TYPE.POISON, TYPE.GRASS], RARITY.UNCOMMON, 3, '');
    }
}

schema.defineTypes(Pokemon,{
    id: "string",
    name: "string",
    types: ["string"],
    rarity: "string",
    index: "number",
    evolution: "string"
});

module.exports = {Bulbasaur, Ivysaur, Venusaur, Pokemon};