import {Scene, GameObjects} from 'phaser';
import AnimationManager from '../animation-manager';
import BoardManager from '../components/board-manager';
import BattleManager from '../components/battle-manager';
import WeatherManager from '../components/weather-manager';
import EntryHazardsManager from '../components/Entry-hazards-manager';
import ItemsContainer from '../components/items-container';
import Pokemon from '../components/pokemon';
import PokemonFactory from '../../../../models/pokemon-factory';
import {STATE} from '../../../../models/enum';
import firebase from 'firebase/compat/app';
import {transformAttackCoordinate, getOrientation, transformCoordinate} from '../../pages/utils/utils';


export default class GameScene extends Scene {
  constructor() {
    super({
      key: 'gameScene',
      active: false
    });
  }

  init(room) {
    this.room = room;
    this.uid = firebase.auth().currentUser.uid;
  }

  preload() {
    this.load.rexWebFont({
      google: {
        families: ['Press Start 2P']
      }
    });

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

    const chosenTileset = this.room.state.players.get(this.uid).tileset;

    // console.log(chosenTileset);
    this.load.audioSprite('sounds', `/assets/sounds/${this.room.state.mapType}.json`, [`/assets/sounds/${this.room.state.mapType}.mp3`]);
    this.load.image('tiles', `/assets/tiles/${this.room.state.mapType}/${chosenTileset}.png`);
    this.load.tilemapTiledJSON('map', `/assets/tiles/${this.room.state.mapType}/${this.room.state.mapType}.json`);
    this.load.image('rain', '/assets/ui/rain.png');
    this.load.image('sand', '/assets/ui/sand.png');
    this.load.image('sun', '/assets/ui/sun.png');
    this.load.image('socle', '/assets/ui/socle.png');
    this.load.image('PHYSICAL', '/assets/types/PHYSICAL.png');
    this.load.image('SPECIAL', '/assets/types/SPECIAL.png');
    this.load.image('TRUE', '/assets/types/TRUE.png');
    this.load.multiatlas('sleep', '/assets/pokemons/sleep/sleep.json', '/assets/pokemons/sleep');
    this.load.multiatlas('snowflakes', '/assets/ui/snowflakes.json', '/assets/ui/');
    this.load.multiatlas('status', '/assets/status/status.json', '/assets/status/');
    this.load.multiatlas('wound', '/assets/status/wound.json', '/assets/status');
    this.load.multiatlas('resurection', '/assets/status/resurection.json', '/assets/status');
    this.load.multiatlas('icons', '/assets/ui/icons.json', '/assets/ui/');
    this.load.multiatlas('items', '/assets/items/items.json', '/assets/items/');
    this.load.multiatlas('lock', '/assets/lock/lock.json', '/assets/lock/');
    this.load.multiatlas('rarity', '/assets/rarity/rarity.json', '/assets/rarity');
    this.load.multiatlas('types', '/assets/types/types.json', '/assets/types');
    this.load.multiatlas('fossil', '/assets/pokemons/fossil/fossil.json', '/assets/pokemons/fossil/');
    this.load.multiatlas('december', '/assets/pokemons/december/december.json', '/assets/pokemons/december/');
    this.load.multiatlas('february', '/assets/pokemons/february/february.json', '/assets/pokemons/february/');
    this.load.multiatlas('april', '/assets/pokemons/april/april.json', '/assets/pokemons/april/');
    this.load.multiatlas('september', '/assets/pokemons/september/september.json', '/assets/pokemons/september/');
    this.load.multiatlas('COMMON', '/assets/pokemons/common/common.json', '/assets/pokemons/common');
    this.load.multiatlas('NEUTRAL', '/assets/pokemons/neutral/neutral.json', '/assets/pokemons/neutral');
    this.load.multiatlas('UNCOMMON', '/assets/pokemons/uncommon/uncommon.json', '/assets/pokemons/uncommon');
    this.load.multiatlas('RARE', '/assets/pokemons/rare/rare.json', '/assets/pokemons/rare');
    this.load.multiatlas('EPIC', '/assets/pokemons/epic/epic.json', '/assets/pokemons/epic');
    this.load.multiatlas('EPIC2', '/assets/pokemons/epic/epic2.json', '/assets/pokemons/epic');
    this.load.multiatlas('UNCOMMON2', '/assets/pokemons/uncommon/uncommon2.json', '/assets/pokemons/uncommon');
    this.load.multiatlas('LEGENDARY', '/assets/pokemons/legendary/legendary.json', '/assets/pokemons/legendary');
    this.load.multiatlas('sound', 'assets/pokemons/sound/sound.json', '/assets/pokemons/sound');
    this.load.multiatlas('attacks', '/assets/attacks/attacks.json', '/assets/attacks');
    this.load.multiatlas('specials', '/assets/attacks/specials.json', '/assets/attacks');
    this.load.multiatlas('june', '/assets/attacks/june.json', '/assets/attacks');
    this.load.multiatlas('ROAR_OF_TIME', '/assets/attacks/ROAR_OF_TIME.json', '/assets/attacks');
    this.load.multiatlas('ROCK_TOMB', '/assets/attacks/ROCK_TOMB.json', '/assets/attacks');
    this.load.multiatlas('ROCK_SMASH', '/assets/attacks/ROCK_SMASH.json', '/assets/attacks');
    this.load.multiatlas('VOLT_SWITCH', '/assets/attacks/VOLT_SWITCH.json', '/assets/attacks');
    this.load.multiatlas('SHADOW_CLONE', '/assets/attacks/SHADOW_CLONE.json', '/assets/attacks');
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
    this.dialog = undefined;
    this.input.mouse.disableContextMenu();

    this.input.dragDistanceThreshold = 1;
    this.map = this.make.tilemap({key: 'map'});
    const tileset = this.map.addTilesetImage(this.room.state.mapType, 'tiles', 24, 24, 1, 1);
    this.map.createLayer('World', tileset, 0, 0);

    this.battle = this.add.group();
    this.animationManager = new AnimationManager(this, this.room.state.mapType);
    this.itemsContainer = new ItemsContainer(this, 24*24 + 10, 5*24 + 10);
    this.boardManager = new BoardManager(this, this.room.state.players[this.uid], this.animationManager, this.uid);
    this.battleManager = new BattleManager(this, this.battle, this.room.state.players[this.uid], this.animationManager);
    this.weatherManager = new WeatherManager(this);
    this.entryHazardsManager = new EntryHazardsManager(this, this.map, tileset);
    this.pokemon = this.add.existing(new Pokemon(this, 11*24, 19*24, PokemonFactory.createPokemonFromName(this.room.state.players[this.uid].avatar), false));
    this.animationManager.animatePokemon(this.pokemon);

    this.transitionImage = new GameObjects.Image(this, 720, 450, 'transition').setScale(1.5, 1.5);
    this.transitionScreen = this.add.container(0, 0, this.transitionImage).setDepth(10);
    this.transitionScreen.setAlpha(0);
    this.music = this.sound.addAudioSprite('sounds');
    this.music.play(this.room.state.mapType, {
      mute: false,
      volume: 0.3,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    });
    this.initilizeDragAndDrop();

    // console.log(this.room.state.mapType);
    const self = this;
    this.room.state.specialCells.forEach((cell) => {
      const coordinates = transformAttackCoordinate(cell.positionX, cell.positionY);
      const sprite = new GameObjects.Sprite(self, coordinates[0], coordinates[1], 'attacks', `${this.room.state.mapType}/cell/000`);
      self.add.existing(sprite);
      this.animationManager.playSpecialCells(sprite);
    });
  }

  update() {
  }

  updatePhase() {
    if (this.room.state.phase == STATE.FIGHT) {
      this.boardManager.battleMode();
    } else {
      this.boardManager.pickMode();
    }
  }

  drawRectangles() {
    this.graphics.forEach((rect) => {
      rect.setVisible(true);
    });
    this.dragDropText.setVisible(true);
  }

  removeRectangles() {
    this.graphics.forEach((rect) => {
      rect.setVisible(false);
      this.dragDropText.setVisible(false);
    });
  }

  initilizeDragAndDrop() {
    this.zones = [];
    this.graphics = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const coord = transformCoordinate(j, i);
        const zone = this.add.zone(coord[0], coord[1], 96, 120);
        zone.setRectangleDropZone(96, 120);
        zone.setName('zone-' + j + '-' + i);
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
    this.graphics.push(graphic);

    this.dragDropText = this.add.text(sellZoneCoord[0] - 4 * 96 + 24, sellZoneCoord[1], 'Drop here to sell', this.textStyle);
    this.dragDropText.setVisible(false);

    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) {
        // console.log(this.pokemon);
        this.pokemon.orientation = getOrientation(this.pokemon.x, this.pokemon.y, pointer.x, pointer.y);
        this.animationManager.animatePokemon(this.pokemon);
        this.pokemon.moveManager.moveTo(pointer.x, pointer.y);
      } else {
        if (this.dialog && !this.dialog.isInTouching(pointer)) {
          this.dialog.scaleDownDestroy(100);
          this.dialog = undefined;
        }
      }
    });

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
      // console.log(dropZone.name);
      if (dropZone.name == 'sell-zone') {
        if (gameObject.objType == 'item') {
          this.itemsContainer.updateItem(gameObject.place);
        }
        document.getElementById('game').dispatchEvent(new CustomEvent('sell-drop', {
          detail: {
            'pokemonId': gameObject.id
          }
        }));
      } else {
        let place = '';
        if (gameObject.place) {
          place = gameObject.place;
        }
        document.getElementById('game').dispatchEvent(new CustomEvent('drag-drop', {
          detail: {
            'x': dropZone.name.substr(5, 1),
            'y': dropZone.name.substr(7, 1),
            'id': gameObject.id,
            'objType': gameObject.objType,
            'place': place
          }
        }));
        if (gameObject.objType == 'pokemon') {
          window.lastDragDropPokemon = gameObject;
        }
        if (gameObject.objType == 'item') {
          this.itemsContainer.updateItem(gameObject.place);
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
  }
}
