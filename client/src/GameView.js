import 'Phaser';

export default class Gameview
{
    constructor()
    {
        var config = {
            type: Phaser.AUTO,
            width: 1200,
            height: 600,
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            scale:{
                mode:Phaser.Scale.FIT
            }
          };
          
          this.game = new Phaser.Game(config);
          
          function preload ()
          {
            this.load.multiatlas("13","assets/sprites/13/13.json");
            this.load.multiatlas("16","assets/sprites/16/16.json");
          }
          
          function create ()
          {  
              this.add.sprite(100,100,'13','13_0_0_0');
          }
          
          function update ()
          {
          }
    }

}

