export default class ShopPortraitContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene,x ,y);

        this.textStyle = 
        {
          fontSize: "30px",
          fontFamily: "Verdana",
          color: "white",
          align: "center"
        };

        this.add(new Phaser.GameObjects.Text(scene,0,0,'test', this.textStyle));
    }
}