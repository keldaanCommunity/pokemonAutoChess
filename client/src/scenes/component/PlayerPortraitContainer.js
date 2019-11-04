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
        this.background = new Phaser.GameObjects.Image(scene,70,0,'user');
        this.background.setInteractive().on('pointerdown', ()=>{
          window.dispatchEvent(new CustomEvent('playerClick',
            {
              detail: {'id': player.id}
            }
          ))});
        this.add(this.background);
        this.add(new Phaser.GameObjects.Text(scene,0,0, player.id, this.textStyle));
    }
}