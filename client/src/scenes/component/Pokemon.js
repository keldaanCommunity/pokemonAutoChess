export default class Pokemon extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, pokemon)
    {
        super(scene,x ,y);
        this.sprite = new Phaser.GameObjects.Sprite(scene, x, y);
        this.sprite.setScale(3,3);
        this.sprite.index = pokemon.index;
        this.add(this.sprite);
    }
}