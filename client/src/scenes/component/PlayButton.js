export default class PlayButton extends Phaser.GameObjects.Container
{
    constructor(scene,x,y)
    {
        super(scene,x,y);
        this.background = new Phaser.GameObjects.Image(scene,0,0,'playButton');
        this.setSize(108,108);
        this.add(this.background);
        this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => this.enterButtonHoverState() );
        this.scene.add.existing(this);
    }

    enterButtonHoverState() {
      let self = this;
      self.background.clearTint();
      self.background.setTint(0xFFFF00);
    }
    
      enterButtonRestState() {
        this.background.clearTint();
    }
    
    enterButtonActiveState() {
      let self = this;
      self.background.clearTint();
      self.background.setTint(0xDC143C);
      window.dispatchEvent(new CustomEvent('clickPlay'));
    }

}