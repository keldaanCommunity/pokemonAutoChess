const colyseus = require("colyseus");
const social = require("@colyseus/social");
const Dispatcher = require("@colyseus/command").Dispatcher;
const STATE = require("../models/enum").STATE;
const GameState = require('./states/game-state');
const Commands = require("./commands/game-commands");

class GameRoom extends colyseus.Room {

  constructor(){
    super();
    this.dispatcher = new Dispatcher(this);
  }

  // When room is initialized
  onCreate() {
    this.setState(new GameState());

    this.onMessage("shop", (client, message) => {      
      let sessionId = client.sessionId;
      let pokemonId = message.id;
      this.dispatcher.dispatch(new Commands.OnShopCommand(), {sessionId, pokemonId});
    });

    this.onMessage("dragDrop", (client, message) => {
      let detail = message.detail;
      this.dispatcher.dispatch(new Commands.OnDragDropCommand(), {client, detail});
    });

    this.onMessage("sellDrop", (client, message) => {
      let detail = message.detail;
      this.dispatcher.dispatch(new Commands.OnSellDropCommand(), {client, detail});
    });

    this.onMessage("refresh", (client, message) => {
      let sessionId = client.sessionId;
      this.dispatcher.dispatch(new Commands.OnRefreshCommand(), sessionId);
    });

    this.onMessage("lock", (client, message) => {
      let sessionId = client.sessionId;
      this.dispatcher.dispatch(new Commands.OnLockCommand(), sessionId);
    });

    this.onMessage("levelUp", (client, message) => {
      let sessionId = client.sessionId;
      this.dispatcher.dispatch(new Commands.OnLevelUpCommand(), sessionId);
    });

    this.setSimulationInterval((deltaTime) => 
      this.dispatcher.dispatch(new Commands.OnUpdateCommand(), deltaTime));
  }

  async onAuth(client, options, request) {
    let token = social.verifyToken(options.token);
    let user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    this.dispatcher.dispatch(new Commands.OnJoinCommand(), { client, options, auth });
  }

  onLeave(client, consented) {
    this.dispatcher.dispatch(new Commands.OnLeaveCommand(), { client, consented });
  }

  onDispose() {
    this.dispatcher.stop();
  }

  getRandomOpponent(playerId) {
    let playersId = [];
    let playeruint8 = Object.keys(this.state.players).length;
    for (let id in this.state.players) {
      if(id != playerId || playeruint8 == 1){
        playersId.push(id);
      }
    }
    if (playersId.length > 0) {
      return this.state.players[playersId[Math.round(Math.random() * (playersId.length - 1))]].id;
    }
    else {
      return "";
    }
  }

  swap(board, pokemon, x, y){
    if (!this.isPositionEmpty(board, x, y)) {
      let pokemonToSwap = this.getPokemonByPosition(board, x, y);
      pokemonToSwap.positionX = pokemon.positionX;
      pokemonToSwap.positionY = pokemon.positionY;
    }
    pokemon.positionX = x;
    pokemon.positionY = y;
    
  }

  getTeamSize(sessionId) {
    let size = 0;
    for (let id in this.state.players[sessionId].board) {
      if (this.state.players[sessionId].board[id].positionY != 0) {
        size += 1;
      }
    }
    return size;
  }

  getBoardSize(sessionId){   
    let size = 0;
    for (let id in this.state.players[sessionId].board) {
      if (this.state.players[sessionId].board[id].positionY == 0) {
        size += 1;
      }
    }
    return size;
  }

  getPokemonByPosition(board, x, y) {
    for (let id in board) {
      let pokemon = board[id];
      if (pokemon.positionX == x && pokemon.positionY == y) {
        return pokemon;
      }
    }
  }

  isPositionEmpty(board, x, y) {
    let empty = true;
    for (let id in board) {
      let pokemon = board[id];
      if (pokemon.positionX == x && pokemon.positionY == y) {
        empty = false;
      }
    }
    return empty;
  }

  getFirstAvailablePositionInBoard(board) {
    for (let i = 0; i < 9; i++) {
      if(this.isPositionEmpty(board,i,0)){
        return i;
      }
    }
    return new Error("no place found, board full");
  }
}

module.exports = GameRoom;
