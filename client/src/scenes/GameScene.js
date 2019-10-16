"use strict";
import AnimationManager from '../AnimationManager';
import ShopContainer from './component/shopContainer';
import PlayerContainer from './component/PlayerContainer';

export default class GameScene extends Phaser.Scene
{

    constructor()
    {
        super({ key: "gameScene", active: true });
    }
     
    preload()
    {
    ["1","2","3","4","5","6","7","8","9"].forEach(num=>{
        this.load.multiatlas(num, "assets/sprites/" + num + "/" + num + ".json");
    })   
      this.load.image("tiles","assets/tileset.png");
      this.load.tilemapTiledJSON("map","assets/tilemap.json")
      this.load.image("user","assets/user.png");
      this.load.image("dashboard","assets/dashboard.png");
    }
    
    create()
    {   
        const map = this.make.tilemap({ key:"map"});
        const tileset = map.addTilesetImage("tileset","tiles");
        map.createStaticLayer("World",tileset,0,0);

        this.dashboard = this.add.image(850,940,"dashboard");
        this.entities = this.add.group();
        this.animationManager = new AnimationManager(this);
        [1,2,3,4,5,6,7,8,9].forEach(num=>{
            this.animationManager.createAnimations(num);
        })
        this.shopContainer = new ShopContainer(this,200,950);
        this.playerContainer = new PlayerContainer(this,1750,100);

        this.textStyle = 
        {
          fontSize: "30px",
          fontFamily: "Verdana",
          color: "white",
          align: "center"
        };

        this.timeText = this.add.text(850,20,window.state.time, this.textStyle);
        window.initialized = true;
    }

    createEntities()
    {
        for(let i = 0; i < 10; i++)
        {
            let entity;
            if(i > 7){
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
        if(entity.orientation != orientation)
        {
            entity.orientation = orientation;
            let key = this.getSpriteKey(entity);
            this.playAnimation(entity, key);
        }
    }


    playAnimation(entity, spriteKey)
    {
        let flipxTable = {"down":false, "downleft":false, "left":false, "upleft":false, "up":false, "upright":true, "right":true, "downright":true};
        entity.flipX = flipxTable[entity.orientation];
        entity.anims.play(spriteKey);
    }


    getSpriteKey(entity)
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
        key += orientationTable[entity.orientation];
        return key;
    }

    getOrientation(vx, vy) 
    {
        let angle = Math.atan2(vy, vx);
        if(angle < 0){
            angle += 2 * Math.PI;
        }
        let angleSeparation = Math.PI / 8;
        let orientation;

        if(angle < angleSeparation)
        {
            orientation = "right";
        }
        else if(angle < angleSeparation * 3)
        {
            orientation = "downright";
        }
        else if(angle < angleSeparation * 5)
        {
            orientation = "down";
        }
        else if(angle < angleSeparation * 7)
        {
            orientation = "downleft";
        }
        else if(angle < angleSeparation * 9)
        {
            orientation = "left";
        }
        else if(angle < angleSeparation * 11)
        {
            orientation = "upleft";
        }
        else if(angle < angleSeparation * 13)
        {
            orientation = "up";
        }
        else if(angle < angleSeparation * 15)
        {
            orientation = "upright";
        }
        else{
            orientation = "right";
        }
        
        return orientation;
    }

    update ()
    {
    }

    updateTimeText(time)
    {
        this.timeText.setText(time);
    }
}
