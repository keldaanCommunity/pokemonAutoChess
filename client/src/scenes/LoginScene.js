"use strict";
import PlayButton from './component/PlayButton';

export default class LoginScene extends Phaser.Scene
{

    constructor()
    {
        super({ key: "loginScene"});
    }
     
    preload()
    {
      this.load.image("login","assets/ui/login.png");
      this.load.image("playButton","assets/ui/playButton.png");
    }
    
    create()
    {   
        this.backgroundLogin = this.add.image(1000,500,"login");
        this.playButton = new PlayButton(this, 1000,500);
    }


    update ()
    {
    }



}
