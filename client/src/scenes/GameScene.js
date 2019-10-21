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
        const map = this.make.tilemap({ key:"map"});
        const tileset = map.addTilesetImage("tileset","tiles");
        map.createStaticLayer("World",tileset,0,0);

        this.dashboard = this.add.image(850,940,"dashboard");
        this.board = this.add.group();
        this.boardManager = new BoardManager(this, this.board);
        window.animationManager = new AnimationManager(this);
        [1,2,3,4,5,6,7,8,9].forEach(num=>{
            window.animationManager.createAnimations(num);
        });
        this.shopContainer = new ShopContainer(this, 200, 950);
        this.playerContainer = new PlayerContainer(this, 1750, 100);
        this.boardContainer = new BoardContainer(this, 275, 775);

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


    update ()
    {
    }

    updateTimeText(time)
    {
        this.timeText.setText(time);
    }
}
