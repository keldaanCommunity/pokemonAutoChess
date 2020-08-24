
export default class EntryHazardsManager{
    constructor(scene, map, tileset){
        this.scene = scene;
        this.map = map;
        this.tileset = tileset;
    }

    addBlueSpikes(){
        this.blueSpikes = this.map.createStaticLayer('blue_spikes', this.tileset, 0, 0);
    }

    addRedSpikes(){
        this.redSpikes = this.map.createStaticLayer('red_spikes', this.tileset, 0, 0);
    }

    addBlueRocks(){
        this.blueRocks = this.map.createStaticLayer('blue_rocks', this.tileset, 0, 0);
    }

    addRedRocks(){
        this.redRocks = this.map.createStaticLayer('red_rocks', this.tileset, 0, 0);
    }

    clearBlueSpikes(){
        if(this.blueSpikes){
            this.blueSpikes.destroy(false);
        }
    }

    clearRedSpikes(){
        if(this.redSpikes){
            this.redSpikes.destroy(false);
        }
    }

    clearBlueRocks(){
        if(this.blueRocks){
            this.blueRocks.destroy(false);
        }
    }

    clearRedRocks(){
        if(this.redRocks){
            this.redRocks.destroy(false);
        }
    }
}