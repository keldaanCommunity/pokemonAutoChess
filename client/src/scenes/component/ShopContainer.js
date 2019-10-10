import ShopPortraitContainer from './ShopPortraitContainer';

export default class ShopContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene,x ,y);
        this.buildShopPortraits();
        scene.add.existing(this);
    }

    buildShopPortraits(){
        let firstPlayer = window.state.players[Object.keys(window.state.players)[0]];
        let  i = 0;
        for (let id in firstPlayer.shop) 
        {
            let pokemon = firstPlayer.shop[id];
            this.add(new ShopPortraitContainer(this.scene,i * 300, 800, pokemon));
            i += 1;
        }
    }

    updatePortraits(){
        this.removeAll();
        this.buildShopPortraits();
    }
}