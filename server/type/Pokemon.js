const TYPE = require('./Enum').TYPE;
const RARITY = require('./Enum').RARITY;

class Pokemon
{
    constructor(name, types, rarity, index, evolution)
    {
        this.name = name;
        this.types = types;
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

module.exports = {Bulbasaur, Ivysaur, Venusaur};