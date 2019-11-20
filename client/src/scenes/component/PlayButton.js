import Button from "./Button";

export default class PlayButton extends Button
{
    constructor(scene,x,y)
    {
        super(scene,x,y,108, 108);
        this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => this.enterButtonHoverState() );
        this.background = new Phaser.GameObjects.Image(scene,0,0,'playButton');
        this.add(this.background);
    }

    enterButtonHoverState() {
      console.log(hover);
      
      this.background.setTint(0xFFFF00);
    }
    
      enterButtonRestState() {
        this.background.clearTint();
    }
    
    enterButtonActiveState() {
      this.background.setTint(0xDC143C);
      window.dispatchEvent(new CustomEvent('clickPlay'));
    }

}