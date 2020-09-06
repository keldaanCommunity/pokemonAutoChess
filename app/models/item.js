const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const uniqid = require('uniqid');

class Item extends Schema{
    constructor(name){
        this.name = name;
        this.id = uniqid();
    }
}

class WhiteGlasses extends Item{
    constructor(){
        super('WHITE_GLASSES');
    }
}

class MuscleBand extends Item{
    constructor(){
        super('MUSCLE_BAND');
    }
}

class LifeOrb extends Item{
    constructor(){
        super('LIFE_ORB');
    }
}

class CoinAmulet extends Item{
    constructor(){
        super('COIN_AMULET');
    }
}

class RockyHelmet extends Item{
    constructor(){
        super('ROCKY_HELMET');
    }
}

class ShellBell extends Item{
    constructor(){
        super('SHELL_BELL');
    }
}

module.exports = {Item, WhiteGlasses, MuscleBand, LifeOrb, CoinAmulet, RockyHelmet, ShellBell};