"use strict";
const path = require('path');

export default class GameScene extends Phaser.Scene{

    constructor(){
        super({ key: "gameScene", active: true });
    }
     
    preload ()
    {   
      this.load.multiatlas("13","assets/sprites/13/13.json");
      this.load.multiatlas("16","assets/sprites/16/16.json");
      this.load.image("map","assets/map.png");
    }
    
    create ()
    {   
        const map = this.add.image(600,600,"map");
        this.entities = this.add.group();     

        for(let i = 0; i < 20; i++)
        {
            let entity;
            if(i > 15){
                entity = this.add.sprite(100,100,'16','16_0_0_0').setScale(3,3);
            }
            else{
                entity = this.add.sprite(100,100,'13','13_0_0_0').setScale(3,3);
            }
            this.entities.add(entity);
        }
    }

    updateEntitiesLocation(locations)
    {
        let i = 0;
        this.entities.getChildren().forEach((entity)=>{
            entity.x = locations[i].x;
            entity.y = locations[i].y;
            i += 1;
        }); 
    }
    
    update ()
    {
    }
}
