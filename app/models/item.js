const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const uniqid = require('uniqid');
const ITEMS = require('./enum').ITEMS;

class Item extends Schema{
    constructor(name){
        super();
        this.name = name;
        this.id = uniqid();
    }
}

class WhiteGlasses extends Item{
    constructor(){
        super(ITEMS.WHITE_GLASSES);
    }
}

class MuscleBand extends Item{
    constructor(){
        super(ITEMS.MUSCLE_BAND);
    }
}

class LifeOrb extends Item{
    constructor(){
        super(ITEMS.LIFE_ORB);
    }
}

class CoinAmulet extends Item{
    constructor(){
        super(ITEMS.COIN_AMULET);
    }
}

class RockyHelmet extends Item{
    constructor(){
        super(ITEMS.ROCKY_HELMET);
    }
}

class ShellBell extends Item{
    constructor(){
        super(ITEMS.SHELL_BELL);
    }
}

class BigRoot extends Item{
    constructor(){
        super(ITEMS.BIG_ROOT);
    }
}

class ApricotBerry extends Item{
    constructor(){
        super(ITEMS.APRICOT_BERRY);
    }
}

class LiechiBerry extends Item{
    constructor(){
        super(ITEMS.LIECHI_BERRY);
    }
}

class GanlonBerry extends Item{
    constructor(){
        super(ITEMS.GANLON_BERRY);
    }
}

class PetayaBerry extends Item{
    constructor(){
        super(ITEMS.PETAYA_BERRY);
    }
}

class SalacBerry extends Item{
    constructor(){
        super(ITEMS.SALAC_BERRY);
    }
}

class OranBerry extends Item{
    constructor(){
        super(ITEMS.ORAN_BERRY);
    }
}

class SoftSand extends Item{
    constructor(){
        super(ITEMS.SOFT_SAND);
    }
}

class MoonStone extends Item{
    constructor(){
        super(ITEMS.MOON_STONE);
    }
}

class NightStone extends Item{
    constructor(){
        super(ITEMS.NIGHT_STONE);
    }
}

class PoisonBarb extends Item{
    constructor(){
        super(ITEMS.POISON_BARB);
    }
}

class DragonFang extends Item{
    constructor(){
        super(ITEMS.DRAGON_FANG);
    }
}

class ThunderStone extends Item{
    constructor(){
        super(ITEMS.THUNDER_STONE);
    }
}

class MetalSkin extends Item{
    constructor(){
        super(ITEMS.METAL_SKIN);
    }
}

class Metronome extends Item{
    constructor(){
        super(ITEMS.METRONOME);
    }
}

class WaterStone extends Item{
    constructor(){
        super(ITEMS.WATER_STONE);
    }
}

class FireStone extends Item{
    constructor(){
        super(ITEMS.FIRE_STONE);
    }
}

class LeafStone extends Item{
    constructor(){
        super(ITEMS.LEAF_STONE);
    }
}

class BlackBelt extends Item{
    constructor(){
        super(ITEMS.BLACK_BELT);
    }
}

schema.defineTypes(Item, {
    id: 'string',
    name: 'string',
  });
  

module.exports = {
    Item
    , WhiteGlasses
    , MuscleBand
    , LifeOrb
    , CoinAmulet
    , RockyHelmet
    , ShellBell
    , BigRoot
    , ApricotBerry
    , LiechiBerry
    , GanlonBerry
    , PetayaBerry
    , SalacBerry
    , OranBerry
    , SoftSand
    , MoonStone
    , NightStone
    , PoisonBarb
    , DragonFang
    , ThunderStone
    , MetalSkin
    , Metronome
    , WaterStone
    , FireStone
    , LeafStone
    , BlackBelt
};