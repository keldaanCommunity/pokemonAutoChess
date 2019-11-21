import Button from "./Button";

export default class LevelUpButton extends Button
{
    constructor(scene,x,y)
    {
        super(scene, x, y, 200, 50);
        this.background = new Phaser.GameObjects.Image(scene, 0, 0, 'levelUpButton');
        this.add(this.background);
    }

    enterButtonHoverState() 
    {
    }
    
    enterButtonRestState() 
    {
    }
    
    enterButtonActiveState() 
    {
      window.dispatchEvent(new CustomEvent('levelUpClick'));
    }

}