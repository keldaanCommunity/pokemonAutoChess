"use strict";
const path = require('path');
import AnimationManager from '../AnimationManager';


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
        this.animationManager = new AnimationManager(this);
        this.animationManager.createAnimations(13);
        this.animationManager.createAnimations(16);
        console.log(this.anims.exists('13_0_0_0'));
        console.log(this.anims);
        
        for(let i = 0; i < 20; i++)
        {
            let entity;
            if(i > 15){
                entity = this.add.sprite(100,100).setScale(3,3);
                entity.gameIndex = 16;
            }
            else{
                entity = this.add.sprite(100,100).setScale(3,3);
                entity.gameIndex = 13;
            }
            entity.velocity = 
            {
                x:0,
                y:0
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
    
    updateEntitiesVelocity(velocities)
    {
        let i = 0;
        this.entities.getChildren().forEach((entity)=>{
            entity.velocity.x = velocities[i].x;
            entity.velocity.y = velocities[i].y;
            i += 1;
            this.displayEntity(entity);
        }); 
    }

    displayEntity(entity)
    {
        let orientation = this.getOrientation(entity.velocity.x, entity.velocity.y);
        let key = this.getSpriteKey(entity, orientation);
        
        if(!this.anims.exists(key))
        {
            
        }
        this.playAnimation(entity, key);
    }


    playAnimation(entity, spriteKey)
    {
        let flipxTable = {"down":false, "downleft":false, "left":false, "upleft":false, "up":false, "upright":true, "right":true, "downright":true};
        entity.flipX = flipxTable[entity.orientation];
        entity.anims.play(spriteKey);
    }


    getSpriteKey(entity, orientation)
    {
        let orientationTable = 
        {
        "down": 0,
        "downleft": 1,
        "left": 2,
        "upleft": 3,
        "up": 4,
        "upright": 3,
        "right": 2,
        "downright":1
        };
        let key = "";
        key += entity.gameIndex;
        key += "_";
        key += "0";
        key += "_";
        key += orientationTable[orientation];
        return key;
    }

    getOrientation(vx, vy) 
    {
        let angle = Math.atan(vx/vy);
        let angleSeparation = Math.PI / 8;

        if(angle < angleSeparation)
        {
            return "right";
        }
        else if(angle < angleSeparation * 3)
        {
            return "upright";
        }
        else if(angle < angleSeparation * 5)
        {
            return "up";
        }
        else if(angle < angleSeparation * 7)
        {
            return "upleft";
        }
        else if(angle < angleSeparation * 9)
        {
            return "left";
        }
        else if(angle < angleSeparation * 11)
        {
            return "downleft";
        }
        else if(angle < angleSeparation * 13)
        {
            return "down";
        }
        else if(angle < angleSeparation * 15)
        {
            return "downright";
        }
        else
        {
            return "right";
        }
    }

    update ()
    {
    }
}
