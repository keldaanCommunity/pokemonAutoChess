import GameScene from './scenes/game-scene';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';
import {transformCoordinate} from '../pages/utils/utils';
import Phaser from 'phaser';

class GameContainer {
  constructor(div, uid, room) {
    this.room = room;
    this.div = div;
    this.game = null;
    this.player = null;
    this.tilemap = null;
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
    this.game.scene.start('gameScene', {room: this.room, tilemap: this.tilemap});
  }

  initializeEvents() {
    this.room.onMessage('DragDropFailed', (message) => this.handleDragDropFailed(message));
    this.room.onError((err) => console.log('room error', err));
  }

  setTilemap(tilemap) {
    this.tilemap = tilemap;
    if (this.player) {
      // console.log('setTilemap', this.player, this.tilemap);
      this.initializeGame();
    }
  }

  initializePlayer(player) {
    // //console.log(player);
    const self = this;
    if (this.uid == player.id) {
      this.player = player;
      if (this.tilemap) {
        // console.log('initializePlayer', this.player, this.tilemap);
        this.initializeGame();
      }
    }

    player.board.onAdd = function(pokemon, key) {
      pokemon.onChange = function(changes) {
        changes.forEach((change) => {
          self.handleBoardPokemonChange(player, pokemon, change);
        });
      };

      pokemon.items.onAdd = ((value, key) => {
        // console.log('added', value, key)
        self.handleBoardPokemonItemAdd(player.id, value, pokemon);
      });
      pokemon.items.onRemove = ((value, key) => {
        // console.log('removed', value, key)
        self.handleBoardPokemonItemRemove(player.id, value, pokemon);
      });

      self.handleBoardPokemonAdd(player, pokemon);
    };

    player.board.onRemove = function(pokemon, key) {
      self.handleBoardPokemonRemove(player, pokemon);
    };

    player.items.onAdd = ((value, key) => {
      // console.log('added', value, key);
      this.handleItemAdd(player, value);
    });

    player.items.onRemove = ((value, key) => {
      // console.log('removed', value, key);
      this.handleItemRemove(player, value);
    });


    player.simulation.onChange = ((changes) => {
      if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene') != null) {
        changes.forEach((change) =>{
          // console.log('simulation change ', change.field, change.value);
          if (change.field == 'climate') {
            this.handleClimateChange(change, player);
          }
        });
      }
    });

    player.simulation.blueTeam.onAdd = (pokemon, key) => {
      // console.log('add pokemon');
      this.handlePokemonAdd(player.id, pokemon);

      pokemon.status.onChange = (changes) =>{
        changes.forEach((change) => {
          this.handlePokemonStatusChange(player.id, change, pokemon);
        });
      };

      pokemon.onChange = (changes) => {
        // console.log('change pokemon');
        changes.forEach((change) => {
          // console.log(change.field);
          this.handlePokemonChange(player.id, change, pokemon);
        });
      };

      pokemon.items.onAdd = ((value, key) => {
        // console.log('added', value, key)
        this.handleBattleManagerPokemonItemAdd(player.id, value, pokemon);
      });
      pokemon.items.onRemove = ((value, key) => {
        // console.log('removed', value, key)
        this.handleBattleManagerPokemonItemRemove(player.id, value, pokemon);
      });

      pokemon.count.onChange = (changes) => {
        // console.log('change item');
        changes.forEach((change) => {
          this.handlePokemonCountChange(player.id, change, pokemon);
        });
      };
    };

    player.simulation.redTeam.onAdd = (pokemon, key) => {
      // console.log('add pokemon');
      this.handlePokemonAdd(player.id, pokemon);

      pokemon.status.onChange = (changes) =>{
        changes.forEach((change) => {
          this.handlePokemonStatusChange(player.id, change, pokemon);
        });
      };

      pokemon.onChange = (changes) => {
        // console.log('change pokemon');
        changes.forEach((change) => {
          this.handlePokemonChange(player.id, change, pokemon);
        });
      };
      pokemon.items.onAdd = ((value, key) => {
        // console.log('added', value, key)
        this.handleBattleManagerPokemonItemAdd(player.id, value, pokemon);
      });
      pokemon.items.onRemove = ((value, key) => {
        // console.log('removed', value, key)
        this.handleBattleManagerPokemonItemRemove(player.id, value, pokemon);
      });
      pokemon.count.onChange = (changes) => {
        // console.log('change item');
        changes.forEach((change) => {
          this.handlePokemonCountChange(player.id, change, pokemon);
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

  handleItemAdd(player, value) {
    if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').itemsContainer) {
      this.game.scene.getScene('gameScene').itemsContainer.addItem(value);
    }
  }

  handleItemRemove(player, value) {
    if (this.game != null && player.id == this.uid && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').itemsContainer) {
      this.game.scene.getScene('gameScene').itemsContainer.removeItem(value);
    }
  }


  handlePokemonChange(playerId, change, pokemon) {
    // console.log('simulation change' + change.field);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene') && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.changePokemon(playerId, change, pokemon);
    }
  }

  handlePokemonStatusChange(playerId, change, pokemon) {
    // console.log('simulation change' + change.field);
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene') && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.changeStatus(playerId, change, pokemon);
    }
  }

  handleBattleManagerPokemonItemAdd(playerId, value, pokemon) {
    if (this.game != null && playerId == this.uid && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.addPokemonItem(playerId, value, pokemon);
    }
  }

  handleBattleManagerPokemonItemRemove(playerId, value, pokemon) {
    if (this.game != null && playerId == this.uid && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.removePokemonItem(playerId, value, pokemon);
    }
  }

  handlePokemonCountChange(playerId, change, pokemon) {
    if (this.game && this.game.scene && this.game.scene.getScene('gameScene') && this.game.scene.getScene('gameScene').battleManager) {
      this.game.scene.getScene('gameScene').battleManager.changeCount(playerId, change, pokemon);
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

  handleBoardPokemonItemAdd(playerId, value, pokemon) {
    if (this.game != null && playerId == this.uid && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').boardManager) {
      this.game.scene.getScene('gameScene').boardManager.addPokemonItem(playerId, value, pokemon);
    }
  }

  handleBoardPokemonItemRemove(playerId, value, pokemon) {
    if (this.game != null && playerId == this.uid && this.game.scene.getScene('gameScene') != null && this.game.scene.getScene('gameScene').boardManager) {
      this.game.scene.getScene('gameScene').boardManager.removePokemonItem(playerId, value, pokemon);
    }
  }

  handleDragDropFailed(message) {
    if (message.updateBoard) {
      const coordinates = transformCoordinate(window.lastDragDropPokemon.positionX, window.lastDragDropPokemon.positionY);
      window.lastDragDropPokemon.x = coordinates[0];
      window.lastDragDropPokemon.y = coordinates[1];
    }

    if (message.updateItems) {
      this.game.scene.getScene('gameScene').itemsContainer.updateItems();
    }
  }

  onPlayerClick(id) {
    const scene = this.game.scene.getScene('gameScene');

    // scene.fade();
    scene.boardManager.setPlayer(this.room.state.players.get(id));
    scene.battleManager.setPlayer(this.room.state.players.get(id));
  }

  onDragDrop(event) {
    this.room.send('dragDrop', {'detail': event.detail});
  }

  onSellDrop(event) {
    this.room.send('sellDrop', {'detail': event.detail});
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
