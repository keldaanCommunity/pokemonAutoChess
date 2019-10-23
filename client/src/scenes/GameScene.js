"use strict";
import AnimationManager from '../AnimationManager';
import ShopContainer from './component/shopContainer';
import PlayerContainer from './component/PlayerContainer';
import BoardContainer from './component/BoardManager';
import BoardManager from './component/BoardManager';

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
      this.load.image("tiles","assets/tiles/tileset.png");
      this.load.tilemapTiledJSON("map","assets/tiles/tilemap.json")
      this.load.image("user","assets/ui/user.png");
      this.load.image("dashboard","assets/ui/dashboard.png");
    }
    
    create()
    {   
        this.input.dragDistanceThreshold = 16;
        const map = this.make.tilemap({ key:"map"});
        const tileset = map.addTilesetImage("tileset","tiles");
        map.createStaticLayer("World",tileset,0,0);
        this.dashboard = this.add.image(850,940,"dashboard");
        this.board = this.add.group();
        window.animationManager = new AnimationManager(this);
        [1,2,3,4,5,6,7,8,9].forEach(num=>{
            window.animationManager.createAnimations(num);
        });
        this.shopContainer = new ShopContainer(this, 200, 950);
        this.playerContainer = new PlayerContainer(this, 1750, 100);
        this.boardContainer = new BoardContainer(this, 275, 775);
        this.boardManager = new BoardManager(this, this.board, window.state.players[window.sessionId]);
        this.textStyle = 
        {
          fontSize: "30px",
          fontFamily: "Verdana",
          color: "white",
          align: "center"
        };

        this.timeText = this.add.text(850,20,window.state.time, this.textStyle);
        this.initilizeDragAndDrop();
        window.initialized = true;
    }


    update ()
    {
    }

    updateTimeText(time)
    {
        this.timeText.setText(time);
    }

    initilizeDragAndDrop()
    {
        let self = this;
        self.boardZones = [];
        self.teamZones = [];
        self.boardGraphics = [];
        self.teamGraphics = [];
        for (let i = 0; i < 9; i++) 
        {
            self.boardZones.push(self.add.zone(330 + 100 * i,790,60,60).setRectangleDropZone(60,60).setName(i));
            self.boardGraphics.push(self.add.graphics().lineStyle(2,0xffff00).strokeRect(
                self.boardZones[i].x - self.boardZones[i].input.hitArea.width / 2,
                self.boardZones[i].y - self.boardZones[i].input.hitArea.height / 2,
                self.boardZones[i].input.hitArea.width,
                self.boardZones[i].input.hitArea.height));
        }

        for (let i = 0; i < 3; i++) 
        {
            for (let j = 0; j < 9; j++) 
            {
                self.teamZones.push(self.add.zone(330 + 100 * j,530+ 65 * i,60,60).setRectangleDropZone(60,60).setName(i * 9 + j));
                self.boardGraphics.push(self.add.graphics().lineStyle(2,0xffff00).strokeRect(
                    self.teamZones[i * 9 + j].x - self.teamZones[i * 9 + j].input.hitArea.width / 2,
                    self.teamZones[i * 9 + j].y - self.teamZones[i * 9 + j].input.hitArea.height / 2,
                    self.teamZones[i * 9 + j].input.hitArea.width,
                    self.teamZones[i * 9 + j].input.hitArea.height));
            }
        }


        self.input.on('dragstart', function (pointer, gameObject) 
        {
            self.children.bringToTop(gameObject);
        }, self);
    
        self.input.on('drag', function (pointer, gameObject, dragX, dragY) 
        {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    
        self.input.on('dragenter', function (pointer, gameObject, dropZone) 
        {
            /**
             *             
            self.boardGraphics[dropZone.name].clear();
            self.boardGraphics[dropZone.name].lineStyle(2, 0x00ffff);
            self.boardGraphics[dropZone.name].strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
             */
        });
    
        self.input.on('dragleave', function (pointer, gameObject, dropZone) 
        {
            /**
            self.boardGraphics[dropZone.name].clear();
            self.boardGraphics[dropZone.name].lineStyle(2, 0xffff00);
            self.boardGraphics[dropZone.name].strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
             */
       });
    
        self.input.on('drop', function (pointer, gameObject, dropZone) 
        {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
        });
    
        self.input.on('dragend', function (pointer, gameObject, dropped) 
        {
            if (!dropped)
            {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
    }
}
