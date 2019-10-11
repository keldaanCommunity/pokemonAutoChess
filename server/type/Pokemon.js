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

class Charmander extends Pokemon
{
    constructor()
    {
        super('charmander',[TYPE.FIRE], RARITY.UNCOMMON, 4, 'charmeleon');
    }
}

class Charmeleon extends Pokemon
{
    constructor()
    {
        super('charmeleon',[TYPE.FIRE], RARITY.UNCOMMON, 5, 'charizard');
    }
}

class Charizard extends Pokemon
{
    constructor()
    {
        super('charizard',[TYPE.FIRE], RARITY.UNCOMMON, 6, '');
    }
}

class Squirtle extends Pokemon
{
    constructor()
    {
        super('squirtle',[TYPE.WATER], RARITY.UNCOMMON, 7, 'wartortle');
    }
}

class Wartortle  extends Pokemon
{
    constructor()
    {
        super('charmeleon',[TYPE.WATER], RARITY.UNCOMMON, 8, 'blastoise');
    }
}

class Blastoise  extends Pokemon
{
    constructor()
    {
        super('charizard',[TYPE.WATER], RARITY.UNCOMMON, 9, '');
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

module.exports = {Bulbasaur, Ivysaur, Venusaur, Charmander, Charmeleon, Charizard, Squirtle, Wartortle, Blastoise, Pokemon};