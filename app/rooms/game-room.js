const colyseus = require("colyseus");
const social = require("@colyseus/social");
const Dispatcher = require("@colyseus/command").Dispatcher;
const STATE = require("../models/enum").STATE;
const Simulation = require('../core/simulation');
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
      this.dispatcher.dispatch(new Commands.OnRefreshCommand(), {sessionId});
    });

    this.onMessage("lock", (client, message) => {
      let sessionId = client.sessionId;
      this.dispatcher.dispatch(new Commands.OnLockCommand(), {sessionId});
    });

    this.onMessage("levelUp", (client, message) => {
      let sessionId = client.sessionId;
      this.dispatcher.dispatch(new Commands.OnLevelUpCommand(), {sessionId});
    });

    this.setSimulationInterval((deltaTime) => 
      this.dispatcher.dispatch(new Commands.OnUpdateCommand(), { deltaTime }));
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


  switchPhase() {
    if (this.state.phase == STATE.PICK) {
      this.initializeFightingPhase();
    }
    else if (this.state.phase == STATE.FIGHT) {
      this.computeLife();
      this.computeIncome();
      this.checkDeath();
      this.initializePickingPhase();
    }
  }

  computeLife(){
    for (let id in this.state.players) {
      let player = this.state.players[id];
      if(Object.keys(player.simulation.blueTeam).length == 0){
        if(player.lastBattleResult == "Defeat"){
          player.streak +=1;
        }
        else{
          player.streak = 0;
        }
        player.lastBattleResult = "Defeat";
        player.life = Math.max(0, player.life - 1);
      }
      else if(Object.keys(player.simulation.redTeam).length == 0){
        if(player.lastBattleResult == "Win"){
          player.streak += 1;
        }
        else{
          player.streak = 0;
        }
        player.lastBattleResult = "Win";
      }
      else{
        if(player.lastBattleResult == "Draw"){
          player.streak += 1;
        }
        else{
          player.streak = 0;
        }
        player.lastBattleResult = "Draw";
      }
    }
  }

  computeIncome() {
    if(this.state.phase == STATE.PICK){
      for (let id in this.state.players) {
        let player = this.state.players[id];
        player.interest = Math.min(Math.floor(player.money / 10), 5);
        player.money += player.interest;
        player.money += Math.max(Math.abs(player.streak) - 1, 0);
        if(player.lastBattleResult == "Win"){
          player.money += 1;
        }
        player.money += 5;
        player.experienceManager.addExperience(2);
      }
    }
  }

  checkDeath(){
    for (let id in this.state.players) {
      let player = this.state.players[id];
        if(player.life <= 0){
          this.kickPlayer(player.id);
        }
    }
  }

  kickPlayer(sessionId){
    console.log(sessionId);
    for (let i = 0; i < this.clients.length; i++) {
      console.log(this.clients[i].sessionId);
      if(this.clients[i].sessionId == sessionId){
        this.clients[i].send("kick-out");
      }
    }
  }

  initializePickingPhase() {
    this.state.phase = STATE.PICK;
    this.state.time = 30000;
    for (let id in this.state.players) {
      let player = this.state.players[id];
      player.simulation.stop();
      if(!player.shopLocked){
        this.state.shop.detachShop(player);
        this.state.shop.assignShop(player);
      }
    }
  }

  initializeFightingPhase() {
    this.state.phase = STATE.FIGHT;
    this.state.time = 30000;
    for (let id in this.state.players) {
      let player = this.state.players[id];
      let opponentId = this.getRandomOpponent(id);
      player.simulation = new Simulation(player.board, this.state.players[opponentId].board);
    }
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
