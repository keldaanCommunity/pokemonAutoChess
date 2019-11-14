export default class Pokemon extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, pokemon)
    {
        super(scene,x ,y, pokemon.index, pokemon.index + "_0_1_0");
        this.setScale(3,3);
        this.index = pokemon.index;
        this.id = pokemon.id;
        this.positionX = pokemon.positionX;
        this.positionY = pokemon.positionY;
        this.cost = pokemon.cost;
    }
}