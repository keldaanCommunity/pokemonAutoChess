import { Scene, GameObjects } from "phaser";
import AnimationManager from "../animation-manager";
import ShopContainer from "../components/shop-container";
import PlayerContainer from "../components/player-container";
import BoardContainer from "../components/board-manager";
import BoardManager from "../components/board-manager";
import BattleManager from "../components/battle-manager";
import MoneyContainer from "../components/money-container";


export default class GameScene extends Scene {

  constructor() {
    super({ key: "gameScene" });
  }

  preload() {
    let self = this;
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(500, 500, 1020, 50);
    
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: (height / 2) - 50,
        text: 'Loading...',
        style: {
            font: '30px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    var percentText = this.make.text({
        x: width / 2,
        y: (height / 2)  + 10,
        text: '0%',
        style: {
            font: '28px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    
    var assetText = this.make.text({
        x: width / 2,
        y: (height / 2) + 70,
        text: '',
        style: {
            font: '28px monospace',
            fill: '#ffffff'
        }
    });

    assetText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(500, 510, 1000 * value, 30);
    });
    
    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
    this.load.audioSprite("sounds","assets/sounds/sounds.json",["assets/sounds/sounds.mp3"]);
    this.load.image("tiles", "assets/tiles/tileset.png");
    this.load.image("hexagon", "assets/ui/hexagon.png");
    this.load.multiatlas("lock","assets/lock/lock.json", "assets/lock/");
    this.load.tilemapTiledJSON("map", "assets/tiles/tilemap.json");
    this.load.multiatlas("rarity", "assets/rarity/rarity.json", "assets/rarity");
    this.load.multiatlas("types","assets/types/types.json", "assets/types");
    this.load.multiatlas("COMMON","assets/pokemons/common/common.json","assets/pokemons/common");
    this.load.multiatlas("UNCOMMON","assets/pokemons/uncommon/uncommon.json","assets/pokemons/uncommon");
    this.load.multiatlas("RARE","assets/pokemons/rare/rare.json","assets/pokemons/rare");
    this.load.multiatlas("EPIC","assets/pokemons/epic/epic.json","assets/pokemons/epic");
    this.load.multiatlas("LEGENDARY","assets/pokemons/legendary/legendary.json","assets/pokemons/legendary");
    this.load.multiatlas("attacks","assets/attacks/attacks.json","assets/attacks");
    this.load.image("user", "assets/ui/user.png");
    this.load.image("transition", "assets/ui/transition.png");
    this.load.image("money", "assets/ui/money.png");
    this.load.image("refreshButton", "assets/ui/refreshButton.png");
    this.load.image("life", "assets/ui/life.png");
    }

  create() {
    this.input.mouse.disableContextMenu();
    this.input.dragDistanceThreshold = 1;
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("tileset", "tiles");
    this.map.createStaticLayer("World", tileset, 0, 0);

    this.board = this.add.group();
    this.battle = this.add.group();
    window.animationManager = new AnimationManager(this);
    this.shopContainer = new ShopContainer(this, 370, 910);
    this.playerContainer = new PlayerContainer(this, 1750, 100);
    this.boardContainer = new BoardContainer(this, 275, 775);
    this.moneyContainer = new MoneyContainer(this,20, 60, window.state.players[window.sessionId]);
    this.boardManager = new BoardManager(this, this.board, window.state.players[window.sessionId]);
    this.battleManager = new BattleManager(this, this.battle, window.state.players[window.sessionId]);
    this.textStyle = {
      fontSize: "30px",
      fontFamily: "Verdana",
      color: "white",
      align: "center"
    };
    this.nameText = this.add.text(20, 20, window.state.players[window.sessionId].name, this.textStyle);
    this.timeText = this.add.text(700, 20, window.state.roundTime, this.textStyle);
    this.add.text(800, 20, "Last battle: ", this.textStyle);
    this.lastBattleResult = this.add.text(1000, 20, window.state.players[window.sessionId].lastBattleResult, this.textStyle);
    this.add.text(740, 20, "s", this.textStyle);
    this.phaseText = this.add.text(550, 20, window.state.phase, this.textStyle);
    this.transitionImage = new GameObjects.Image(this, 720, 450, "transition").setScale(1.5, 1.5);
    this.transitionScreen = this.add.container(0, 0, this.transitionImage).setDepth(Number.MAX_VALUE);
    this.transitionScreen.alpha = 0;
    this.music = this.sound.addAudioSprite("sounds");
    this.music.play('pick-1');
    this.initilizeDragAndDrop();
    this.shopContainer.updatePortraits();
    this.boardManager.update();
    window.initialized = true;
  }

  update() {
  }

  fade() {
    this.tweens.add({
      targets: this.transitionScreen,
      duration: 150,
      alpha: 1,
      yoyo: true,
      repeat: 0
    });
  }

  updateTime() {
    this.timeText.setText(window.state.roundTime);
  }

  updatePhase() {
    if(window.state.phase == "FIGHT"){
      this.boardManager.clearBoard();
      this.music.play('battle-1');
    }
    else{
      this.boardManager.buildPokemons();
      this.music.play('pick-1');
    }
    this.phaseText.setText(window.state.phase);
  }

  initilizeDragAndDrop() {
    let self = this;
    self.zones = [];
    self.graphics = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 9; j++) {
        self.zones.push(self.add.zone(330 + 100 * j, 790 - 80 * i, 90, 70).setRectangleDropZone(90, 70).setName("zone-" + j + "-" + i));
        self.graphics.push(self.add.graphics().lineStyle(2, 0xffff00).strokeRect(
          self.zones[i * 9 + j].x - self.zones[i * 9 + j].input.hitArea.width / 2,
          self.zones[i * 9 + j].y - self.zones[i * 9 + j].input.hitArea.height / 2,
          self.zones[i * 9 + j].input.hitArea.width,
          self.zones[i * 9 + j].input.hitArea.height)
        );
      }
    }

    self.input.on("dragstart", function (pointer, gameObject) {
      self.children.bringToTop(gameObject);
    }, self);

    self.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    self.input.on("drop", function (pointer, gameObject, dropZone) {
      if(dropZone.name == "sell-zone"){
        window.dispatchEvent(new CustomEvent("sell-drop", {
          detail: {
            "pokemonId": gameObject.id
          }
        }));
      }
      else{
        window.dispatchEvent(new CustomEvent("drag-drop", {
          detail: {
            "x": dropZone.name.substr(5, 1),
            "y": dropZone.name.substr(7, 1),
            "pokemonId": gameObject.id
          }
        }));
      }
    });

    self.input.on("dragend", function (pointer, gameObject, dropped) {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });
  }
}
