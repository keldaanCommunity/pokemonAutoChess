const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const uniqid = require('uniqid');
const OBJECTS = require('./enum').OBJECTS;

class Item extends Schema{
    constructor(name){
        super();
        this.name = name;
        this.id = uniqid();
    }
}

class WhiteGlasses extends Item{
    constructor(){
        super(OBJECTS.WHITE_GLASSES);
    }
}

class MuscleBand extends Item{
    constructor(){
        super(OBJECTS.MUSCLE_BAND);
    }
}

class LifeOrb extends Item{
    constructor(){
        super(OBJECTS.LIFE_ORB);
    }
}

class CoinAmulet extends Item{
    constructor(){
        super(OBJECTS.COIN_AMULET);
    }
}

class RockyHelmet extends Item{
    constructor(){
        super(OBJECTS.ROCKY_HELMET);
    }
}

class ShellBell extends Item{
    constructor(){
        super(OBJECTS.SHELL_BELL);
    }
}

class BigRoot extends Item{
    constructor(){
        super(OBJECTS.BIG_ROOT);
    }
}

class ApricotBerry extends Item{
    constructor(){
        super(OBJECTS.APRICOT_BERRY);
    }
}

class LiechiBerry extends Item{
    constructor(){
        super(OBJECTS.LIECHI_BERRY);
    }
}

class GanlonBerry extends Item{
    constructor(){
        super(OBJECTS.GANLON_BERRY);
    }
}

class PetayaBerry extends Item{
    constructor(){
        super(OBJECTS.PETAYA_BERRY);
    }
}

class SalacBerry extends Item{
    constructor(){
        super(OBJECTS.SALAC_BERRY);
    }
}

class OranBerry extends Item{
    constructor(){
        super(OBJECTS.ORAN_BERRY);
    }
}

class SoftSand extends Item{
    constructor(){
        super(OBJECTS.SOFT_SAND);
    }
}

class MoonStone extends Item{
    constructor(){
        super(OBJECTS.MOON_STONE);
    }
}

class NightStone extends Item{
    constructor(){
        super(OBJECTS.NIGHT_STONE);
    }
}

class PoisonBarb extends Item{
    constructor(){
        super(OBJECTS.POISON_BARB);
    }
}

class DragonFang extends Item{
    constructor(){
        super(OBJECTS.DRAGON_FANG);
    }
}

class ThunderStone extends Item{
    constructor(){
        super(OBJECTS.THUNDER_STONE);
    }
}

class MetalSkin extends Item{
    constructor(){
        super(OBJECTS.METAL_SKIN);
    }
}

class Metronome extends Item{
    constructor(){
        super(OBJECTS.METRONOME);
    }
}

class WaterStone extends Item{
    constructor(){
        super(OBJECTS.WATER_STONE);
    }
}

class FireStone extends Item{
    constructor(){
        super(OBJECTS.FIRE_STONE);
    }
}

class LeafStone extends Item{
    constructor(){
        super(OBJECTS.LEAF_STONE);
    }
}

class BlackBelt extends Item{
    constructor(){
        super(OBJECTS.BLACK_BELT);
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