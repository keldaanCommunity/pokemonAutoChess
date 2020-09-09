const ITEMS = require('./enum').ITEMS;
const Item = require('./item');

class ItemFactory{

    static createRandomItem(){
        let keys = Object.keys(ITEMS);
        return ItemFactory.createItemFromName(keys[Math.floor(Math.random() * keys.length)]);
    }

    static createItemFromName(name){
        switch (name) {
            case ITEMS.APRICOT_BERRY:
                return new Item.ApricotBerry();
        
            case ITEMS.PETAYA_BERRY:
                return new Item.PetayaBerry();
            
            case ITEMS.SALAC_BERRY:
                return new Item.SalacBerry();
            
            case ITEMS.LIECHI_BERRY:
                return new Item.LiechiBerry();
            
            case ITEMS.GANLON_BERRY:
                return new Item.GanlonBerry();

            case ITEMS.ORAN_BERRY:
                return new Item.OranBerry();
            
            case ITEMS.WHITE_GLASSES:
                return new Item.WhiteGlasses();

            case ITEMS.WATER_STONE:
                return new Item.WaterStone();
            
            case ITEMS.THUNDER_STONE:
                return new Item.ThunderStone();
            
            case ITEMS.SOFT_SAND:
                return new Item.SoftSand();

            case ITEMS.SHELL_BELL:
                return new Item.ShellBell();
            
            case ITEMS.ROCKY_HELMET:
                return new Item.RockyHelmet();
            
            case ITEMS.POISON_BARB:
                return new Item.PoisonBarb();

            case ITEMS.NIGHT_STONE:
                return new Item.NightStone();
    
            case ITEMS.MUSCLE_BAND:
                return new Item.MuscleBand();

            case ITEMS.MOON_STONE:
                return new Item.MoonStone();
        
            case ITEMS.METRONOME:
                return new Item.Metronome();

            case ITEMS.METAL_SKIN:
                return new Item.MetalSkin();

            case ITEMS.LIFE_ORB:
                return new Item.LifeOrb();

            case ITEMS.LEAF_STONE:
                return new Item.LeafStone();

            case ITEMS.FIRE_STONE:
                return new Item.FireStone();
            
            case ITEMS.DRAGON_FANG:
                return new Item.DragonFang();
            
            case ITEMS.COIN_AMULET:
                return new Item.CoinAmulet();

            case ITEMS.BLACK_BELT:
                return new Item.BlackBelt();
        
            case ITEMS.BIG_ROOT:
                return new Item.BigRoot();
        }
    }
}

module.exports = ItemFactory;