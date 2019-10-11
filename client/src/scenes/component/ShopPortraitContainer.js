export default class ShopPortraitContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, pokemon)
    {
        super(scene,x ,y);

        this.textStyle = 
        {
          fontSize: "30px",
          fontFamily: "Verdana",
          color: "white",
          align: "center"
        };
        this.add(new Phaser.GameObjects.Image(scene,0,0, pokemon.index,"portrait").setScale(3,3));
        this.add(new Phaser.GameObjects.Text(scene,-60,60, pokemon.name, this.textStyle));
    }
}