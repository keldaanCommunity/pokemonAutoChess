import {Scene, GameObjects} from 'phaser';
import AnimationManager from '../animation-manager';
import ShopContainer from '../components/shop-container';
import PlayerContainer from '../components/player-container';
import BoardContainer from '../components/board-manager';
import BoardManager from '../components/board-manager';
import BattleManager from '../components/battle-manager';
import MoneyContainer from '../components/money-container';
import SynergiesContainer from '../components/synergies-container';
import WeatherManager from '../components/weather-manager';
import EntryHazardsManager from '../components/Entry-hazards-manager';
import ItemsContainer from '../components/items-container';
import DpsMeterContainer from '../components/dps-meter-container';
import Pokemon from '../components/pokemon';
import PokemonFactory from '../../../../models/pokemon-factory';
import {WORDS, PHASE_TRADUCTION} from '../../../../models/enum';

export default class GameScene extends Scene {
  constructor() {
    super({key: 'gameScene'});
  }

  preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(500, 500, 1020, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: (height / 2) - 50,
      text: 'Loading...',
      style: {
        font: '30px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: (height / 2) + 10,
      text: '0%',
      style: {
        font: '28px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: (height / 2) + 70,
      text: '',
      style: {
        font: '28px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(500, 510, 1000 * value, 30);
    });

    this.load.on('fileprogress', (file) => {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
    //console.log(window.state.mapType);
    this.load.audioSprite('sounds', `assets/sounds/${window.state.mapType}.json`, [`assets/sounds/${window.state.mapType}.mp3`]);
    this.load.image('tiles', `assets/tiles/${window.state.mapType}.png`);
    this.load.tilemapTiledJSON('map', `assets/tiles/${window.state.mapType}.json`);
    this.load.image('hexagon', 'assets/ui/hexagon.png');
    this.load.image('shield', 'assets/ui/shield.png');
    this.load.image('sword', 'assets/ui/sword.png');
    this.load.image('range', 'assets/ui/range.png');
    this.load.image('heart', 'assets/ui/heart.png');
    this.load.image('rain', 'assets/ui/rain.png');
    this.load.image('sand', 'assets/ui/sand.png');
    this.load.image('sun', 'assets/ui/sun.png');
    this.load.image('socle', 'assets/ui/socle.png');
    this.load.image('PHYSICAL', 'assets/types/PHYSICAL.png');
    this.load.image('SPECIAL', 'assets/types/SPECIAL.png');
    this.load.multiatlas('items','assets/items/items.json','assets/items/')
    this.load.multiatlas('type-details', `assets/types/${window.langage}/type-details.json`, `assets/types/${window.langage}/`);
    this.load.multiatlas('lock', 'assets/lock/lock.json', 'assets/lock/');
    this.load.multiatlas('effects', 'assets/effects/effects.json', 'assets/effects');
    this.load.multiatlas('rarity', 'assets/rarity/rarity.json', 'assets/rarity');
    this.load.multiatlas('types', 'assets/types/types.json', 'assets/types');
    this.load.multiatlas('COMMON', 'assets/pokemons/common/common.json', 'assets/pokemons/common');
    this.load.multiatlas('NEUTRAL', 'assets/pokemons/neutral/neutral.json', 'assets/pokemons/neutral');
    this.load.multiatlas('UNCOMMON', 'assets/pokemons/uncommon/uncommon.json', 'assets/pokemons/uncommon');
    this.load.multiatlas('RARE', 'assets/pokemons/rare/rare.json', 'assets/pokemons/rare');
    this.load.multiatlas('EPIC', 'assets/pokemons/epic/epic.json', 'assets/pokemons/epic');
    this.load.multiatlas('LEGENDARY', 'assets/pokemons/legendary/legendary.json', 'assets/pokemons/legendary');
    this.load.multiatlas('attacks', 'assets/attacks/attacks.json', 'assets/attacks');
    this.load.image('transition', 'assets/ui/transition.png');
    this.load.image('money', 'assets/ui/money.png');
    this.load.image('refreshButton', 'assets/ui/refreshButton.png');
    this.load.image('life', 'assets/ui/life.png');
  }

  create() {
    this.input.mouse.disableContextMenu();
    this.input.dragDistanceThreshold = 1;
    this.map = this.make.tilemap({key: 'map'});
    const tileset = this.map.addTilesetImage(window.state.mapType, 'tiles',24,24,1,1);
    this.map.createStaticLayer('World', tileset, 0, 0);
    //this.map.createStaticLayer('Top', tileset, 0, 0);

    this.board = this.add.group();
    this.battle = this.add.group();
    window.animationManager = new AnimationManager(this);
    this.shopContainer = new ShopContainer(this, 470, 912);
    this.playerContainer = new PlayerContainer(this, 1800, 160);
    this.boardContainer = new BoardContainer(this, 382, 808);
    this.synergiesContainer = new SynergiesContainer(this, 1290, 135, window.state.players[window.sessionId]);
    this.dpsMeterContainer = new DpsMeterContainer(this, 1520, 135, window.state.players[window.sessionId]);
    this.itemsContainer = new ItemsContainer(this, 66, 430);
    this.moneyContainer = new MoneyContainer(this, 10, 60, window.state.players[window.sessionId]);
    this.boardManager = new BoardManager(this, this.board, window.state.players[window.sessionId]);
    this.battleManager = new BattleManager(this, this.battle, window.state.players[window.sessionId]);
    this.weatherManager = new WeatherManager(this);
    this.entryHazardsManager = new EntryHazardsManager(this, this.map, tileset);
    this.pokemon = this.add.existing(new Pokemon(this, 130,340,PokemonFactory.createPokemonFromName(window.state.players[window.sessionId].avatar),false));
    window.animationManager.animatePokemon(this.pokemon);

    this.textStyle = {
      fontSize: '35px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'center',
      stroke: '#000',
      strokeThickness: 2,
    };

    this.bigTextStyle = {
      fontSize: '80px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'center',
      stroke: '#000',
      strokeThickness: 2
    };
    this.nameText = this.add.text(20, 20, window.state.players[window.sessionId].name.slice(0, 10), this.textStyle);
    this.phaseText = this.add.text(860, 25, window.state.players[window.sessionId].phase, this.textStyle);
    this.opponentNameText = this.add.text(1270, 25, window.state.players[window.sessionId].opponentName.slice(0, 10), this.textStyle);
    
    this.turnText = this.add.text(560, 25, window.state.stageLevel, this.textStyle);
    this.add.text(470, 25, WORDS.TURN[window.langage], this.textStyle);

    this.timeText = this.add.text(685, 25, window.state.roundTime, this.textStyle);
    this.add.text(735, 25, 's', this.textStyle);

    this.lastBattleResult = this.add.text(1050, 25, window.state.players[window.sessionId].lastBattleResult, this.textStyle);

    this.countdownText = this.add.text(700, 300, window.state.players[window.sessionId].lastBattleResult, this.bigTextStyle);
    this.countdownText.setAlpha(0);
    this.boardSizeText = this.add.text(300, 25, Object.keys(window.state.players[window.sessionId].boardSize).length, this.textStyle);
    this.add.text(325, 25, '/', this.textStyle);
    this.maxBoardSizeText = this.add.text(350, 25, window.state.players[window.sessionId].experienceManager.level, this.textStyle);
    this.transitionImage = new GameObjects.Image(this, 720, 450, 'transition').setScale(1.5, 1.5);
    this.transitionScreen = this.add.container(0, 0, this.transitionImage).setDepth(10);
    this.transitionScreen.setAlpha(0);
    this.music = this.sound.addAudioSprite('sounds');
    this.music.play(window.state.mapType);
    this.initilizeDragAndDrop();
    this.boardManager.update();
    window.initialized = true;
  }

  update() {
  }

  fade() {
    /*
    this.tweens.add({
      targets: this.transitionScreen,
      duration: 150,
      alpha: 1,
      yoyo: true,
      repeat: 0
    });
    */
  }

  displayCountDown(countdown) {
    this.countdownText.setText(countdown);
    this.countdownText.setAlpha(0);
    this.tweens.add({
      targets: this.countdownText,
      duration: 500,
      alpha: 1,
      yoyo: true,
      repeat: 0
    });
  }

  updateTime() {
    this.timeText.setText(window.state.roundTime);
  }

  updatePhase() {
    this.dpsMeterContainer.maxDamage = 0;
    this.phaseText.setText(PHASE_TRADUCTION[window.state.phase][window.langage]);
    if (window.state.phase == 'FIGHT') {
      this.boardManager.clearBoard();
      //this.music.play('battle-1');
    } else {
      this.boardManager.buildPokemons();
      //this.music.play('pick-1');
    }
  }

  drawRectangles() {
    this.graphics.forEach((rect) => {
      rect.setVisible(true);
    });
  }

  removeRectangles() {
    this.graphics.forEach((rect) => {
      rect.setVisible(false);
    });
  }

  initilizeDragAndDrop() {
    this.zones = [];
    this.graphics = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const zone = this.add.zone(382 + 96 * j, 808 - 120 * i, 96, 120);
        zone.setRectangleDropZone(96, 120);
        zone.setName('zone-' + j + '-' + i);
        this.zones.push(zone);
        const graphic = this.add.graphics().lineStyle(3, 0x304050).strokeRect(
            this.zones[i * 8 + j].x - this.zones[i * 8 + j].input.hitArea.width / 2,
            this.zones[i * 8 + j].y - this.zones[i * 8 + j].input.hitArea.height / 2,
            this.zones[i * 8 + j].input.hitArea.width,
            this.zones[i * 8 + j].input.hitArea.height);
        graphic.setVisible(false);
        this.graphics.push(graphic);
      }
    }

    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', function (pointer) {
        if (pointer.rightButtonDown())
        {
          //console.log(this.pokemon);
          this.pokemon.orientation = window.getOrientation(this.pokemon.x, this.pokemon.y, pointer.x, pointer.y);
          window.animationManager.animatePokemon(this.pokemon);
          this.pokemon.moveManager.moveTo(pointer.x, pointer.y);
        }
    }, this);

    this.input.on('dragstart', (pointer, gameObject) => {
      this.drawRectangles();
      this.children.bringToTop(gameObject);
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('drop', (pointer, gameObject, dropZone) => {
      this.removeRectangles();
      if (dropZone.name == 'sell-zone') {
        if(gameObject.objType == 'item'){
          this.itemsContainer.updateItem(gameObject.place);
        }
        window.dispatchEvent(new CustomEvent('sell-drop', {
          detail: {
            'pokemonId': gameObject.id
          }
        }));
      } else {
        let place = '';
        if(gameObject.place){
          place = gameObject.place;
        }
        window.dispatchEvent(new CustomEvent('drag-drop', {
          detail: {
            'x': dropZone.name.substr(5, 1),
            'y': dropZone.name.substr(7, 1),
            'id': gameObject.id,
            'objType': gameObject.objType,
            'place': place
          }
        }));
        if(gameObject.objType == 'item'){
          this.itemsContainer.updateItem(gameObject.place);
        }
      }
    }, this);

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });
  }
}
