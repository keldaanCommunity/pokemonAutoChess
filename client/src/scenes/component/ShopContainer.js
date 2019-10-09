import ShopPortraitContainer from './ShopPortraitContainer';

export default class ShopContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene,x ,y);
        
        for (let i = 0; i < 10; i++) {
            this.add(new ShopPortraitContainer(scene,i * 150, 800));
        }
        scene.add.existing(this);
    }
}