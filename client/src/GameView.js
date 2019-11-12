import 'Phaser';
import LoginScene from './scenes/LoginScene';
import GameScene from './scenes/GameScene';
export default class Gameview
{
    constructor()
    {
        var config = {
            type: Phaser.AUTO,
            width: 2000,
            height: 1000,
            scene: [LoginScene, GameScene],
            scale:{
                mode:Phaser.Scale.FIT
            }
          };
          
          this.game = new Phaser.Game(config);
          

    }

}

