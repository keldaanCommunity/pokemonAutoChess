import GameScene from './scenes/game-scene';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';
import {transformCoordinate} from '../pages/utils/utils';

class GameContainer {
  constructor(div, uid, room) {
    this.room = room;
    this.div = div;
    this.game = null;
    this.player = null;
    this.uid = uid;
    this.initializeEvents();
  }

  initializeGame() {
    // Create Phaser game
    const config = {
      type: Phaser.CANVAS,
      width: 2000,
      height: 1000,
      parent: this.div,
      pixelArt: true,
      scene: [GameScene],
      scale: {mode: Phaser.Scale.FIT},
      plugins: {
        global: [{
          key: 'rexMoveTo',
          plugin: MoveToPlugin,
          start: true
        },
        {
          key: 'rexWebFontLoader',
          plugin: WebFontLoaderPlugin,
          start: true
        }]
      }
    };
    this.game = new Phaser.Game(config);
    this.game.scene.start('gameScene', this.room);
  }

  initializeEvents() {
    this.room.onMessage('DragDropFailed', (message) => this.handleDragDropFailed(message));
    this.room.onMessage('info', (message)=> this.handleServerInfo(message));
    this.room.onError((err) => console.log('room error', err));
  }

  initializePlayer(player) {
    // //console.log(player);
    const self = this;
    if (this.uid == player.id) {
      this.player = player;
      this.initializeGame();
    }

    player.board.onAdd = function(pokemon, key) {
      pokemon.onChange = function(changes) {
        changes.forEach((change) => {
          self.handleBoardPokemonChange(player, pokemon, change);
        });
      };

      pokemon.items.onChange = function(changes) {
        changes.forEach((change) => {
          self.handleBoardPokemonChange(player, pokemon, change);
        });
      };
      self.handleBoardPokemonAdd(player, pokemon);
    };

    player.board.onRemove = function(pokemon, key) {
      self.handleBoardPokemonRemove(player, pokemon);
    };

    player.stuff.onChange = ((changes) =>{
      changes.forEach((change) => this.handleStuffChange(change, player));
    });

    player.simulation.onChange = ((changes) => {
      if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').entryHazardsManager) {
        changes.forEach((change) =>{
          // console.log('simulation change ', change.field, change.value);
          if (change.field == 'climate') {
            this.handleClimateChange(change, player);
          } else if (change.field == 'redRocks') {
            if (change.value) {
              this.game.scene.getScene('gameScene').entryHazardsManager.addRedRocks();
            } else {
              this.game.scene.getScene('gameScene').entryHazardsManager.clearRedRocks();
            }
          } else if (change.field == 'blueRocks') {
            if (change.value) {
              this.game.scene.getScene('gameScene').entryHazardsManager.addBlueRocks();
            } else {
              this.game.scene.getScene('gameScene').entryHazardsManager.clearBlueRocks();
            }
          } else if (change.field == 'redSpikes') {
            if (change.value) {
              this.game.scene.getScene('gameScene').entryHazardsManager.addRedSpikes();
            } else {
              this.game.scene.getScene('gameScene').entryHazardsManager.clearRedSpikes();
            }
          } else if (change.field == 'blueSpikes') {
            if (change.value) {
              this.game.scene.getScene('gameScene').entryHazardsManager.addBlueSpikes();
            } else {
              this.game.scene.getScene('gameScene').entryHazardsManager.clearBlueSpikes();
            }
          }
        });
      }
    });

    player.simulation.blueTeam.onAdd = (pokemon, key) => {
      // console.log('add pokemon');
      this.handlePokemonAdd(player.id, pokemon);
      pokemon.onChange = (changes) => {
        // console.log('change pokemon');
        changes.forEach((change) => {
          // console.log(change.field);
          this.handlePokemonChange(player.id, change, pokemon);
        });
      };
      pokemon.items.onChange = (changes) => {
        // console.log('change item');
        changes.forEach((change) => {
          this.handlePokemonItemsChange(player.id, change, pokemon);
        });
      };
    };

    player.simulation.redTeam.onAdd = (pokemon, key) => {
      // console.log('add pokemon');
      this.handlePokemonAdd(player.id, pokemon);
      pokemon.onChange = (changes) => {
        // console.log('change pokemon');
        changes.forEach((change) => {
          this.handlePokemonChange(player.id, change, pokemon);
        });
      };
      pokemon.items.onChange = (changes) => {
        // console.log('change item');
        changes.forEach((change) => {
          this.handlePokemonItemsChange(player.id, change, pokemon);
        });
      };
    };
    player.simulation.blueTeam.onRemove = (pokemon, key) => {
      // console.log('remove pokemon');
      this.handlePokemonRemove(player.id, pokemon);
    };
    player.simulation.redTeam.onRemove = (pokemon, key) => {
      // console.log('remove pokemon');
      this.handlePokemonRemove(player.id, pokemon);
    };
    player.triggerAll();
  }

  handlePokemonAdd(playerId, pokemon) {
    // console.log('simulation add' + pokemon.name);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene') && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.addPokemon(playerId, pokemon);
    }
  }

  handlePokemonRemove(playerId, pokemon) {
    // console.log('simulation remove' + pokemon.name);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene') && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.removePokemon(playerId, pokemon);
    }
  }

  handleStuffChange(change, player) {
    if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').itemsContainer) {
      this.game.scene.getScene('gameScene').itemsContainer.changeStuff(change.field, change.value);
    }
  }

  handlePokemonChange(playerId, change, pokemon) {
    // console.log('simulation change' + change.field);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene') && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.changePokemon(playerId, change, pokemon);
    }
  }

  handlePokemonItemsChange(playerId, change, pokemon) {
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene') && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.changePokemonItems(playerId, change, pokemon);
    }
  }


  handleClimateChange(change, player) {
    if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene') != null) {
      switch (change.value) {
        case 'RAIN':
          this.game.scene.getScene('gameScene').weatherManager.addRain();
          break;

        case 'SUN':
          this.game.scene.getScene('gameScene').weatherManager.addSun();
          break;

        case 'SANDSTORM':
          this.game.scene.getScene('gameScene').weatherManager.addSandstorm();
          break;

        case 'SNOW':
          this.game.scene.getScene('gameScene').weatherManager.addSnow();
          break;

        case 'NEUTRAL':
          this.game.scene.getScene('gameScene').weatherManager.clearWeather();
          break;

        default:
          break;
      }
    }
  }

  handleBoardPokemonAdd(player, pokemon) {
    if (this.game != null && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').boardManager) {
      if (this.game.scene.getScene('gameScene').boardManager.player.id == player.id) {
        this.game.scene.getScene('gameScene').boardManager.addPokemon(pokemon);
      }
    }
  }

  handleBoardPokemonRemove(player, pokemon) {
    if (this.game != null && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').boardManager && this.game.scene.getScene('gameScene').boardManager.player.id == player.id) {
      this.game.scene.getScene('gameScene').boardManager.removePokemon(pokemon);
    }
  }

  handleBoardPokemonChange(player, pokemon, change) {
    if (this.game != null && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').boardManager && this.game.scene.getScene('gameScene').boardManager.player.id == player.id) {
      this.game.scene.getScene('gameScene').boardManager.changePokemon(pokemon, change);
    }
  }

  handleDragDropFailed(message) {
    if (message.updateBoard) {
      const coordinates = transformCoordinate(window.lastDragDropPokemon.positionX, window.lastDragDropPokemon.positionY);
      window.lastDragDropPokemon.x = coordinates[0];
      window.lastDragDropPokemon.y = coordinates[1];
    }

    if (message.updateItems) {
      this.game.scene.getScene('gameScene').itemsContainer.updateItem(message.field);
    }
  }

  handleServerInfo(message) {
    this.showPopup(message.title, message.info);
    // this.game.scene.getScene('gameScene').showPopup(message);
  }

  handleKickOut() {
    // console.log('kicked out');

    _client.joinOrCreate('lobby', {}).then((room) => {
      this.room.leave();
      // console.log('joined room:', room);
      document.getElementById('game').dispatchEvent(new CustomEvent('render-lobby', {detail: {room: room}}));
    }).catch((e) => {
      console.error('join error', e);
    });
  }

  onPlayerClick(id) {
    const scene = this.game.scene.getScene('gameScene');

    // scene.fade();
    scene.boardManager.setPlayer(this.room.state.players[id]);
    scene.battleManager.setPlayer(this.room.state.players[id]);
  }

  onDragDrop(event) {
    // this.showPopup('test', 'tues sanglier');
    this.room.send('dragDrop', {'detail': event.detail});
  }

  onSellDrop(event) {
    this.room.send('sellDrop', {'detail': event.detail});
  }

  showPopup(title, info) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-info').textContent = info;
    $('#modal-popup').modal();
  }

  closePopup() {
    $('#modal-popup').modal('hide');
  }

  transformToSimplePlayer(player) {
    const simplePlayer = {
      name: player.name,
      id: player.id,
      rank: player.rank,
      avatar: player.avatar,
      pokemons: [],
      exp: player.exp
    };
    player.board.forEach((pokemon) => {
      if (pokemon.positionY != 0) {
        simplePlayer.pokemons.push(pokemon.name);
      }
    });
    return simplePlayer;
  }
}

export default GameContainer;
