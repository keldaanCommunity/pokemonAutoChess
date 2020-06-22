import { Scene, GameObjects } from "phaser";
import AnimationManager from "../animation-manager";
import ShopContainer from "../components/shop-container";
import PlayerContainer from "../components/player-container";
import BoardContainer from "../components/board-manager";
import BoardManager from "../components/board-manager";
import BattleManager from "../components/battle-manager";
import RefreshButton from "../components/refresh-button";
import LevelUpButton from "../components/levelup-button";

export default class GameScene extends Scene {

  constructor() {
    super({ key: "gameScene" });
  }

  preload() {
    this.load.image("tiles", "assets/tiles/tileset.png");
    this.load.tilemapTiledJSON("map", "assets/tiles/tilemap.json")
    this.load.multiatlas("COMMON","assets/pokemons/common/common.json","assets/pokemons/common");
    this.load.multiatlas("attacks","assets/attacks/attacks.json","assets/attacks");
    this.load.image("user", "assets/ui/user.png");
    this.load.image("dashboard", "assets/ui/dashboard.png");
    this.load.image("transition", "assets/ui/transition.png");
    this.load.image("money", "assets/ui/money.png");
    this.load.image("refreshButton", "assets/ui/refreshButton.png");
    this.load.image("levelUpButton", "assets/ui/levelUpButton.png");
    this.load.image("life", "assets/ui/life.png");
    }

  create() {
    this.input.mouse.disableContextMenu();
    this.input.dragDistanceThreshold = 1;
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("tileset", "tiles");
    this.map.createStaticLayer("World", tileset, 0, 0);
    this.dashboard = this.add.image(850, 940, "dashboard");
    this.dashboardZone = this.add.zone(850, 940, this.dashboard.width, this.dashboard.height);
    this.dashboardZone.setRectangleDropZone(this.dashboard.width, this.dashboard.height);
    this.dashboardZone.setName("sell-zone");
    this.refreshButton = new RefreshButton(this, 120, 900);
    this.levelUpButton = new LevelUpButton(this, 120, 970);
    this.board = this.add.group();
    this.battle = this.add.group();
    window.animationManager = new AnimationManager(this);
    this.shopContainer = new ShopContainer(this, 300, 950);
    this.playerContainer = new PlayerContainer(this, 1750, 100);
    this.boardContainer = new BoardContainer(this, 275, 775);
    this.boardManager = new BoardManager(this, this.board, window.state.players[window.sessionId]);
    this.battleManager = new BattleManager(this, this.battle, window.state.players[window.sessionId]);
    this.textStyle = {
      fontSize: "30px",
      fontFamily: "Verdana",
      color: "white",
      align: "center"
    };
    this.nameText = this.add.text(10, 50, window.state.players[window.sessionId].facebookName, this.textStyle);
    this.timeText = this.add.text(700, 20, window.state.roundTime, this.textStyle);
    this.add.text(740, 20, "s", this.textStyle);
    this.phaseText = this.add.text(550, 20, window.state.phase, this.textStyle);
    this.money = this.add.text(120, 115, window.state.players[window.sessionId].money, this.textStyle);
    this.moneyIcon = this.add.image(200, 130, "money");
    this.transitionImage = new GameObjects.Image(this, 720, 450, "transition").setScale(1.5, 1.5);
    this.transitionScreen = this.add.container(0, 0, this.transitionImage).setDepth(Number.MAX_VALUE);
    this.transitionScreen.alpha = 0;

    this.initilizeDragAndDrop();
    this.shopContainer.updatePortraits();
    this.playerContainer.updatePortraits();
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
    }
    else{
      this.boardManager.buildPokemons();
    }
    this.phaseText.setText(window.state.phase);
  }

  updateMoney() {
    this.money.setText(window.state.players[window.sessionId].money);
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
