export default class PlayerPortraitContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, player)
    {
        super(scene,x ,y);
        
        this.textStyle = 
        {
          fontSize: "30px",
          fontFamily: "Verdana",
          color: "white",
          align: "center"
        };
        this.add(new Phaser.GameObjects.Image(scene,70,0,'user'));
        this.add(new Phaser.GameObjects.Text(scene,0,0, player.id, this.textStyle));
    }
}