const colyseus = require('colyseus');
const social = require('@colyseus/social');
const {Dispatcher} = require('@colyseus/command');
const GameState = require('./states/game-state');
const Commands = require('./commands/game-commands');
const Player = require('../models/player');
const GameStats = require('../models/game-stats');

class GameRoom extends colyseus.Room {
  constructor() {
    super();
    this.dispatcher = new Dispatcher(this);
  }

  // When room is initialized
  onCreate(options) {
    this.setState(new GameState());
    this.maxClients = 8;
    for (const id in options.users){
      const user = options.users[id];
      if(user.isBot){
        this.state.players.set(id, new Player(user.id, user.name, user.avatar, true, this.state.specialCells, this.state.mapType, ''));
        this.state.botManager.addBot(this.state.players[id]);
        this.state.shop.assignShop(this.state.players[id]);
      }
    }

    GameStats.create({'time': Date.now()});

    this.onMessage('shop', (client, message) => {
      this.dispatcher.dispatch(new Commands.OnShopCommand(), {
        sessionId: client.sessionId,
        index: message.id
      });
    });

    this.onMessage('dragDrop', (client, message) => {
      this.dispatcher.dispatch(new Commands.OnDragDropCommand(), {
        client: client,
        detail: message.detail
      });
    });

    this.onMessage('sellDrop', (client, message) => {
      this.dispatcher.dispatch(new Commands.OnSellDropCommand(), {
        client,
        detail: message.detail
      });
    });

    this.onMessage('refresh', (client, message) => {
      this.dispatcher.dispatch(new Commands.OnRefreshCommand(), client.sessionId);
    });

    this.onMessage('lock', (client, message) => {
      this.dispatcher.dispatch(new Commands.OnLockCommand(), client.sessionId);
    });

    this.onMessage('levelUp', (client, message) => {
      this.dispatcher.dispatch(new Commands.OnLevelUpCommand(), client.sessionId);
    });

    this.setSimulationInterval((deltaTime) =>
      this.dispatcher.dispatch(new Commands.OnUpdateCommand(), deltaTime));
  }

  async onAuth(client, options, request) {
    const token = social.verifyToken(options.token);
    const user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    this.dispatcher.dispatch(new Commands.OnJoinCommand(), {client, options, auth});
  }

  onLeave(client, consented) {
    this.dispatcher.dispatch(new Commands.OnLeaveCommand(), {client, consented});
  }

  onDispose() {
    this.dispatcher.stop();
  }

  getRandomOpponent(playerId) {
    const playersId = [];
    const numberOfPlayers = this.state.players.size;

    this.state.players.forEach((player, id) => {
      if (player.alive && (id != playerId || numberOfPlayers == 1 )) {
        playersId.push(id);
      }
    });

    if (playersId.length > 0) {
      const n = Math.floor(Math.random() * playersId.length);
      return this.state.players[playersId[n]].id;
    } else {
      return '';
    }
  }

  swap(playerId, pokemon, x, y) {
    if (!this.isPositionEmpty(playerId, x, y)) {
      const pokemonToSwap = this.getPokemonByPosition(playerId, x, y);

      pokemonToSwap.positionX = pokemon.positionX;
      pokemonToSwap.positionY = pokemon.positionY;
    }
    pokemon.positionX = x;
    pokemon.positionY = y;
  }


  getPokemonByPosition(playerId, x, y) {
    let pkm;
    this.state.players.get(playerId).board.forEach((pokemon, key) => {
      if (pokemon.positionX == x && pokemon.positionY == y) {
        pkm = pokemon;
      }
    });
    return pkm;
  }

  isPositionEmpty(playerId, x, y) {
    let empty = true;

    this.state.players.get(playerId).board.forEach((pokemon, key) => {
      if (pokemon.positionX == x && pokemon.positionY == y) {
        empty = false;
      }
    });

    return empty;
  }

  getFirstAvailablePositionInBoard(playerId) {
    for (let i = 0; i < 8; i++) {
      if (this.isPositionEmpty(playerId, i, 0)) {
        return i;
      }
    }
  }

  getFirstAvailablePositionInTeam(playerId) {
    for (let x = 0; x < 8; x++) {
      for (let y = 1; y < 4; y++) {
        if (this.isPositionEmpty(playerId, x, y)) {
          return [x, y];
        }
      }
    }
  }
}

module.exports = GameRoom;
