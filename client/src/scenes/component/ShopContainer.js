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
        let player = window.state.players[window.sessionId];
        let  i = 0;
        
        for (let id in player.shop) 
        {
            let pokemon = player.shop[id];
            this.add(new ShopPortraitContainer(this.scene,i * 300, 0, pokemon));
            i += 1;
        }
    }

    updatePortraits(){
        this.removeAll();
        this.buildShopPortraits();
    }
}