import Button from "./Button";

export default class RefreshButton extends Button
{
    constructor(scene,x,y)
    {
        super(scene, x, y, 200, 50);
        this.background = new Phaser.GameObjects.Image(scene, 0, 0, 'refreshButton');
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
      window.dispatchEvent(new CustomEvent('refreshClick'));
    }

}