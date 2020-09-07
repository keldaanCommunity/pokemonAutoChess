const OBJECTS = require('./enum').OBJECTS;
const Item = require('./item');

class ItemFactory{

    static createRandomItem(){
        let keys = Object.keys(OBJECTS);
        return ItemFactory.createItemFromName(keys[Math.floor(Math.random() * keys.length)]);
    }

    static createItemFromName(name){
        switch (name) {
            case OBJECTS.APRICOT_BERRY:
                return new Item.ApricotBerry();
        
            case OBJECTS.PETAYA_BERRY:
                return new Item.PetayaBerry();
            
            case OBJECTS.SALAC_BERRY:
                return new Item.SalacBerry();
            
            case OBJECTS.LIECHI_BERRY:
                return new Item.LiechiBerry();
            
            case OBJECTS.GANLON_BERRY:
                return new Item.GanlonBerry();

            case OBJECTS.ORAN_BERRY:
                return new Item.OranBerry();
            
            case OBJECTS.WHITE_GLASSES:
                return new Item.WhiteGlasses();

            case OBJECTS.WATER_STONE:
                return new Item.WaterStone();
            
            case OBJECTS.THUNDER_STONE:
                return new Item.ThunderStone();
            
            case OBJECTS.SOFT_SAND:
                return new Item.SoftSand();

            case OBJECTS.SHELL_BELL:
                return new Item.ShellBell();
            
            case OBJECTS.ROCKY_HELMET:
                return new Item.RockyHelmet();
            
            case OBJECTS.POISON_BARB:
                return new Item.PoisonBarb();

            case OBJECTS.NIGHT_STONE:
                return new Item.NightStone();
    
            case OBJECTS.MUSCLE_BAND:
                return new Item.MuscleBand();

            case OBJECTS.MOON_STONE:
                return new Item.MoonStone();
        
            case OBJECTS.METRONOME:
                return new Item.Metronome();

            case OBJECTS.METAL_SKIN:
                return new Item.MetalSkin();

            case OBJECTS.LIFE_ORB:
                return new Item.LifeOrb();

            case OBJECTS.LEAF_STONE:
                return new Item.LeafStone();

            case OBJECTS.FIRE_STONE:
                return new Item.FireStone();
            
            case OBJECTS.DRAGON_FANG:
                return new Item.DragonFang();
            
            case OBJECTS.COIN_AMULET:
                return new Item.CoinAmulet();

            case OBJECTS.BLACK_BELT:
                return new Item.BlackBelt();
        
            case OBJECTS.BIG_ROOT:
                return new Item.BigRoot();
        }
    }
}

module.exports = ItemFactory;