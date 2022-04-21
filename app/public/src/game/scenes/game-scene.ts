/* eslint-disable no-invalid-this */
import {Scene, GameObjects} from 'phaser';
import AnimationManager from '../animation-manager';
import BoardManager from '../components/board-manager';
import BattleManager from '../components/battle-manager';
import WeatherManager from '../components/weather-manager';
import ItemsContainer from '../components/items-container';
import Pokemon from '../components/pokemon';
import {ITEM_RECIPE} from '../../../../models/enum';
import firebase from 'firebase/compat/app';
import {transformCoordinate} from '../../pages/utils/utils';
import { Room } from "colyseus.js";
import GameState from "../../../../rooms/states/game-state";
import ItemContainer from '../components/item-container';
import { GamePhaseState } from '../../../../types/enum/Game';
import indexList from '../../../dist/client/assets/pokemons/indexList.json';import PokemonDetail from '../components/pokemon-detail';
export default class GameScene extends Scene {
  tilemap: any;
  room: Room<GameState>;
  uid: string;
  textStyle: { fontSize: string; fontFamily: string; color: string; align: string; };
  bigTextStyle: { fontSize: string; fontFamily: string; color: string; align: string; stroke: string; strokeThickness: number; };
  map: Phaser.Tilemaps.Tilemap;
  battleGroup: GameObjects.Group;
  animationManager: AnimationManager;
  itemsContainer: ItemsContainer;
  board: BoardManager;
  battle: BattleManager;
  weatherManager: WeatherManager;
  pokemon: Pokemon;
  transitionImage: GameObjects.Image;
  transitionScreen: GameObjects.Container;
  music: Phaser.Sound.BaseSound;
  targetPokemon: Pokemon;
  graphics: Phaser.GameObjects.Graphics[];
  dragDropText: Phaser.GameObjects.Text;
  sellZoneGraphic: Phaser.GameObjects.Graphics;
  zones: Phaser.GameObjects.Zone[];
  lastDragDropPokemon: Pokemon;
  lastPokemonDetail: Pokemon;

  constructor() {
    super({
      key: 'gameScene',
      active: false
    });
  }

  init(data) {
    this.tilemap = data.tilemap;
    this.room = data.room;
    this.uid = firebase.auth().currentUser.uid;
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
      y: (height / 2) - 100,
      text: 'Loading...',
      style: {
        font: '30px monospace'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: (height / 2) -50,
      text: '0%',
      style: {
        font: '28px monospace'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: (height / 2) + 70,
      text: '',
      style: {
        font: '28px monospace'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      percentText.setText((value * 100).toFixed(1) + '%');
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

    indexList.forEach(id=>{
      this.load.multiatlas(id, `/assets/pokemons/${id}.json`, '/assets/pokemons');
    });

    // console.log(this.tilemap);
    this.load.audio('sound', [`https://raw.githubusercontent.com/keldaanInteractive/pokemonAutoChessMusic/main/music/${this.tilemap.tilesets[0].name}.mp3`]);
    this.load.image('tiles', `/assets/tilesets/${this.tilemap.tilesets[0].name}.png`);
    this.load.tilemapTiledJSON('map', this.tilemap);
    this.load.image('rain', '/assets/ui/rain.png');
    this.load.image('sand', '/assets/ui/sand.png');
    this.load.image('sun', '/assets/ui/sun.png');
    this.load.multiatlas('snowflakes', '/assets/ui/snowflakes.json', '/assets/ui/');
    this.load.multiatlas('status', '/assets/status/status.json', '/assets/status/');
    this.load.multiatlas('wound', '/assets/status/wound.json', '/assets/status');
    this.load.multiatlas('resurection', '/assets/status/resurection.json', '/assets/status');
    this.load.multiatlas('smoke', '/assets/status/SMOKE.json', '/assets/status');
    this.load.multiatlas('rune_protect', '/assets/status/RUNE_PROTECT.json', '/assets/status');
    this.load.multiatlas('armorReduction', '/assets/status/ARMOR_REDUCTION.json', '/assets/status');
    this.load.multiatlas('item', '/assets/item/item.json', '/assets/item/');
    this.load.multiatlas('lock', '/assets/lock/lock.json', '/assets/lock/');
    this.load.multiatlas('types', '/assets/types/types.json', '/assets/types');
    this.load.multiatlas('attacks', '/assets/attacks/attacks.json', '/assets/attacks');
    this.load.multiatlas('specials', '/assets/attacks/specials.json', '/assets/attacks');
    this.load.multiatlas('june', '/assets/attacks/june.json', '/assets/attacks');
    this.load.multiatlas('ROAR_OF_TIME', '/assets/attacks/ROAR_OF_TIME.json', '/assets/attacks');
    this.load.multiatlas('ROCK_TOMB', '/assets/attacks/ROCK_TOMB.json', '/assets/attacks');
    this.load.multiatlas('ROCK_SMASH', '/assets/attacks/ROCK_SMASH.json', '/assets/attacks');
    this.load.multiatlas('VOLT_SWITCH', '/assets/attacks/VOLT_SWITCH.json', '/assets/attacks');
    this.load.multiatlas('HYPER_VOICE', '/assets/attacks/HYPER_VOICE.json', '/assets/attacks');
    this.load.multiatlas('SHADOW_CLONE', '/assets/attacks/SHADOW_CLONE.json', '/assets/attacks');
    this.load.multiatlas('PETAL_DANCE', '/assets/attacks/PETAL_DANCE.json', '/assets/attacks');
    this.load.multiatlas('ECHO', '/assets/attacks/ECHO.json', '/assets/attacks');
    this.load.multiatlas('INCENSE_DAMAGE', '/assets/attacks/INCENSE_DAMAGE.json', '/assets/attacks');
    this.load.multiatlas('BRIGHT_POWDER', '/assets/attacks/BRIGHT_POWDER.json', '/assets/attacks');
    this.load.multiatlas('STATIC', '/assets/attacks/STATIC.json', '/assets/attacks');
    this.load.multiatlas('EXPLOSION', '/assets/attacks/EXPLOSION.json', '/assets/attacks');
    this.load.multiatlas('BONEMERANG', '/assets/attacks/BONEMERANG.json', '/assets/attacks');
    this.load.multiatlas('GROWL', '/assets/attacks/GROWL.json', '/assets/attacks');
    this.load.multiatlas('RELIC_SONG', '/assets/attacks/RELIC_SONG.json', '/assets/attacks');
    this.load.multiatlas('DISARMING_VOICE', '/assets/attacks/DISARMING_VOICE.json', '/assets/attacks');
    this.load.multiatlas('HIGH_JUMP_KICK', '/assets/attacks/HIGH_JUMP_KICK.json', '/assets/attacks');
    this.load.multiatlas('TRI_ATTACK', '/assets/attacks/TRI_ATTACK.json', '/assets/attacks');
    this.load.multiatlas('CLANGOROUS_SOUL', '/assets/attacks/CLANGOROUS_SOUL.json', '/assets/attacks');
    this.load.multiatlas('FIELD_DEATH', '/assets/attacks/FIELD_DEATH.json', '/assets/attacks');
    this.load.multiatlas('FAIRY_CRIT', '/assets/attacks/FAIRY_CRIT.json', '/assets/attacks');
    this.load.image('transition', '/assets/ui/transition.png');
    this.load.image('money', '/assets/ui/money.png');
    this.load.multiatlas('life', '/assets/ui/life.json', '/assets/ui');
  }

  create() {
    this.textStyle = {
      fontSize: '35px',
      fontFamily: '\'Press Start 2P\'',
      color: 'black',
      align: 'center'
    };

    this.bigTextStyle = {
      fontSize: '80px',
      fontFamily: '\'Press Start 2P\'',
      color: 'white',
      align: 'center',
      stroke: '#000',
      strokeThickness: 3
    };
    this.input.mouse.disableContextMenu();

    this.registerKeys();

    this.input.dragDistanceThreshold = 1;
    this.map = this.make.tilemap({key: 'map'});
    const tileset = this.map.addTilesetImage(this.tilemap.tilesets[0].name, 'tiles', 24, 24, 1, 1);
    this.map.createLayer('World', tileset, 0, 0).setScale(2,2);
    this.initializeDragAndDrop();
    this.battleGroup = this.add.group();
    this.animationManager = new AnimationManager(this);
    this.itemsContainer = new ItemsContainer(this, this.room.state.players[this.uid].items, 24*24 + 10, 5*24 + 10, true);
    this.board = new BoardManager(this, this.room.state.players[this.uid], this.animationManager, this.uid);
    this.battle = new BattleManager(this, this.battleGroup, this.room.state.players[this.uid], this.animationManager);
    this.weatherManager = new WeatherManager(this);
    this.music = this.sound.add('sound', {loop: true});
    this.music.play('',{volume: 0.3, loop: true});
  }

  registerKeys() {
    this.input.keyboard.on('keyup-D', () => {
      this.refreshShop();
    });

    this.input.keyboard.on('keyup-F', () => {
      this.buyExperience();
    });

    this.input.keyboard.on('keyup-E', () => {
      this.sellPokemon();
    });
  }

  refreshShop() {
    this.room.send('refresh');
  }

  buyExperience() {
    this.room.send('levelUp');
  }

  sellPokemon() {
    if (!this.targetPokemon || !this.targetPokemon.scene || !this.targetPokemon.input.draggable) {
      return;
    }

    document.getElementById('game').dispatchEvent(new CustomEvent('sell-drop', {
      detail: {
        'pokemonId': this.targetPokemon.id
      }
    }));
  }

  updatePhase() {
    this.targetPokemon = null;
    if (this.room.state.phase == GamePhaseState.FIGHT) {
      this.board.battleMode();
    } else {
      this.board.pickMode();
    }
  }

  drawRectangles(sellZoneVisible: boolean) {
    this.graphics.forEach((rect) => {
      rect.setVisible(true);
    });
    this.dragDropText.setVisible(sellZoneVisible);
    this.sellZoneGraphic.setVisible(sellZoneVisible);
  }

  removeRectangles() {
    this.graphics.forEach((rect) => {
      rect.setVisible(false);
    });
    this.dragDropText.setVisible(false);
    this.sellZoneGraphic.setVisible(false);
  }

  initializeDragAndDrop() {
    this.zones = [];
    this.graphics = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const coord = transformCoordinate(j, i);
        const zone = this.add.zone(coord[0], coord[1], 96, 120);
        zone.setRectangleDropZone(96, 120);
        zone.setName('board-zone');
        zone.setData({'x': j, 'y': i})
        this.zones.push(zone);
        const graphic = this.add.graphics().lineStyle(3, 0x000000, 0.3).strokeRect(
            this.zones[i * 8 + j].x - this.zones[i * 8 + j].input.hitArea.width / 2,
            this.zones[i * 8 + j].y - this.zones[i * 8 + j].input.hitArea.height / 2,
            this.zones[i * 8 + j].input.hitArea.width,
            this.zones[i * 8 + j].input.hitArea.height);
        graphic.setVisible(false);
        this.graphics.push(graphic);
      }
    }
    const sellZoneCoord = transformCoordinate(4, 5);
    const sellZone = this.add.zone(sellZoneCoord[0] -48, sellZoneCoord[1] + 24, 8 * 96, 240);
    sellZone.setRectangleDropZone(8 * 96, 240);
    sellZone.setName('sell-zone');
    this.zones.push(sellZone);

    const graphic = this.add.graphics()
        .fillStyle(0xffffff, 0.6)
        .fillRect(
            sellZone.x - sellZone.input.hitArea.width / 2,
            sellZone.y - sellZone.input.hitArea.height / 2,
            sellZone.input.hitArea.width,
            sellZone.input.hitArea.height
        ).lineStyle(4, 0x000000)
        .strokeRect(
            sellZone.x - sellZone.input.hitArea.width / 2,
            sellZone.y - sellZone.input.hitArea.height / 2,
            sellZone.input.hitArea.width,
            sellZone.input.hitArea.height
        );
    graphic.setVisible(false);

    this.sellZoneGraphic = graphic;

    this.dragDropText = this.add.text(sellZoneCoord[0] - 4 * 96 + 24, sellZoneCoord[1], 'Drop here to sell', this.textStyle);
    this.dragDropText.setVisible(false);

    this.input.mouse.disableContextMenu();

    this.input.on('gameobjectover', (pointer, gameObject: Phaser.GameObjects.GameObject) => {
      if(gameObject instanceof Pokemon){
        this.targetPokemon = gameObject;
      }
      else{
        this.targetPokemon = null;
      }
    });

    this.input.on('dragstart', (pointer, gameObject: Phaser.GameObjects.GameObject) => {
      gameObject instanceof Pokemon ? this.drawRectangles(true) : this.drawRectangles(false);
      // this.children.bringToTop(gameObject);
    });

    this.input.on('drag', (pointer, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      const g = <Phaser.GameObjects.Container> gameObject;
      g.x = dragX;
      g.y = dragY;
    });


    this.input.on('drop', (pointer, gameObject: Phaser.GameObjects.GameObject, dropZone: Phaser.GameObjects.Zone) => {
      this.removeRectangles();

      if(gameObject instanceof Pokemon){
        // POKEMON -> BOARD-ZONE = PLACE POKEMON
        if(dropZone.name == 'board-zone'){
          document.getElementById('game').dispatchEvent(new CustomEvent('drag-drop', {
            detail: {
              'x': dropZone.getData('x'),
              'y': dropZone.getData('y'),
              'id': gameObject.id,
              'objType': 'pokemon'
            }
          }));
          this.lastDragDropPokemon = gameObject;
        }
        // POKEMON -> SELL-ZONE = SELL POKEMON
        else if(dropZone.name == 'sell-zone'){
          document.getElementById('game').dispatchEvent(new CustomEvent('sell-drop', {
            detail: {
              'pokemonId': gameObject.id
            }
          }));
        }
        // RETURN TO ORIGINAL SPOT
        else{
            gameObject.x = gameObject.input.dragStartX
            gameObject.y = gameObject.input.dragStartY
        }
      }
      else if(gameObject instanceof ItemContainer){
        // ITEM -> ITEM = COMBINE
        if(dropZone instanceof ItemContainer){
          document.getElementById('game').dispatchEvent(new CustomEvent('drag-drop', {
            detail: {
              'itemA': dropZone.name,
              'itemB': gameObject.name,
              'objType': 'combine'
            }
          }));
        }
        // ITEM -> POKEMON(board zone) = EQUIP
        else if(dropZone.name == 'board-zone'){
          document.getElementById('game').dispatchEvent(new CustomEvent('drag-drop', {
            detail: {
              'x': dropZone.getData('x'),
              'y': dropZone.getData('y'),
              'id': gameObject.name,
              'objType': 'item'
            }
          }));
        }
        // RETURN TO ORIGINAL SPOT
        else{
          this.itemsContainer.updateItems();
          // gameObject.x = gameObject.input.dragStartX
          // gameObject.y = gameObject.input.dragStartY

        }
      }
    }, this);

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      this.removeRectangles();
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on('dragenter', (pointer, gameObject, dropZone) => {

      if (gameObject instanceof ItemContainer && dropZone instanceof ItemContainer) {
        // find the resulting item
        for (const [key, value] of Object.entries(ITEM_RECIPE)) {
          if ((value[0] == gameObject.name && value[1] == dropZone.name) || (value[0] == dropZone.name && value[1] == gameObject.name)) {
            this.itemsContainer.sendToBack(dropZone)
            gameObject.showTempDetail(key)
            break;
          }
        }
      }  
    }, this);

    this.input.on('dragleave', (pointer, gameObject, dropZone) => {
      if (gameObject instanceof ItemContainer && dropZone instanceof ItemContainer) {
        gameObject.closeDetail()
      }  
    }, this);
  }
}


// if (item && item.name && item != gameObject) {
//   Object.keys(ITEM_RECIPE).forEach((recipeName)=>{
//     const recipe = ITEM_RECIPE[recipeName];
//     if ((recipe[0] == item.name && recipe[1] == gameObject.name) || (recipe[1] == item.name && recipe[0] == gameObject.name)) {
//       item.detailDisabled = true;
//       item.detail.setScale(0, 0);
//       gameObject.sprite.setTexture('item', recipeName);
//       gameObject.remove(gameObject.detail, true);
//       gameObject.detail = new ItemDetail(this, 30, -100, recipeName);
//       gameObject.detail.setScale(1, 1);
//       gameObject.add(gameObject.detail);
//     }
//   });
// }