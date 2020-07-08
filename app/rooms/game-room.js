const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
const social = require("@colyseus/social");
const Player = require("../models/player");
const Shop = require("../models/shop");
const Pokemon = require("../models/pokemon");
const PokemonFactory = require("../models/pokemon-factory");
const STATE = require("../models/enum").STATE;
const COST = require("../models/enum").COST;
const Simulation = require('../core/simulation');

class GameState extends schema.Schema {
  constructor() {
    super();
    this.time = 30000;
    this.roundTime = Math.round(this.time/1000);
    this.phase = STATE.PICK;
    this.players = new schema.MapSchema();
    this.shop = new Shop();
  }
}

schema.defineTypes(GameState, {
  roundTime: "uint8",
  phase: "string",
  players: { map: Player }
});

class GameRoom extends colyseus.Room {
  // When room is initialized
  onCreate() {
    console.log("create new game room");

    this.onMessage("shop", (client, message) => {
      this.onShop(client.sessionId, message.id);
    });

    this.onMessage("dragDrop", (client, message) => {
      this.onDragDrop(client, message.detail);
    });

    this.onMessage("sellDrop", (client, message) => {
      this.onSellDrop(client, message.detail);
    });

    this.onMessage("refresh", (client, message) => {
      this.onRefresh(client.sessionId);
    });

    this.onMessage("lock", (client, message) => {
      this.onLock(client.sessionId);
    });

    this.onMessage("levelUp", (client, message) => {
      this.onLevelUp(client.sessionId);
    });

    this.setState(new GameState());
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
  }

  async onAuth(client, options, request) {
    console.log("onAuth");
    // const response = await superagent
    //   .get(`https://graph.facebook.com/debug_token`)
    //   .set("Accept", "application/json")
    //   .query({
    //     "input_token": options.token,
    //     "access_token": process.env.FACEBOOK_APP_TOKEN
    //   });
    // return response.body.data;
    let token = social.verifyToken(options.token);
    let user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    console.log("client joined game");
    this.state.players[client.sessionId] = new Player(client.sessionId, auth.email.slice(0,auth.email.indexOf("@")));
    this.state.shop.assignShop(this.state.players[client.sessionId]);
  }

  onLeave(client, consented) {
    console.log('client ' + client.sessionId + 'left');
    
    this.state.shop.detachShop(this.state.players[client.sessionId]);
    delete this.state.players[client.sessionId];
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    
  }

  update(deltaTime) {
    this.state.time -= deltaTime;
    if(Math.round(this.state.time/1000) != this.state.roundTime){
      this.state.roundTime = Math.round(this.state.time/1000);
    }
    if (this.state.time < 0) {
      this.switchPhase();
    }
    if(this.state.phase == STATE.FIGHT){
      let everySimulationFinished = true;
      for (let id in this.state.players){
        if(!this.state.players[id].simulation.finished){
          if(everySimulationFinished){
            everySimulationFinished = false;
          }
          this.state.players[id].simulation.update(deltaTime);
        }
      }
      if(everySimulationFinished){
        this.switchPhase();
        this.computeIncome();
      }
    }
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

  onRefresh(sessionId) {
    if (sessionId in this.state.players) {
      if (this.state.players[sessionId].money >= 2) {
        this.state.shop.detachShop(this.state.players[sessionId]);
        this.state.shop.assignShop(this.state.players[sessionId]);
        this.state.players[sessionId].money -= 2;
      }
    }
  }

  onLock(sessionId) {
    if (sessionId in this.state.players) {
      this.state.players[sessionId].shopLocked = !this.state.players[sessionId].shopLocked;
    }
  }

  onLevelUp(sessionId) {
    if (sessionId in this.state.players) {
      if (this.state.players[sessionId].money >= 4) {
        this.state.players[sessionId].experienceManager.addExperience(4);
        this.state.players[sessionId].money -= 4;
      }
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

  onSellDrop(client, detail){
    if (client.sessionId in this.state.players &&
    detail.pokemonId in this.state.players[client.sessionId].board) {
        this.state.players[client.sessionId].money += COST[this.state.players[client.sessionId].board[detail.pokemonId].rarity];
        delete this.state.players[client.sessionId].board[detail.pokemonId];
        this.state.players[client.sessionId].synergies.update(this.state.players[client.sessionId].board);
    }
  }

  onDragDrop(client, detail) {
    let success = false;

    if (client.sessionId in this.state.players) {
      if (detail.pokemonId in this.state.players[client.sessionId].board) {
        let pokemon = this.state.players[client.sessionId].board[detail.pokemonId];
        let x = parseInt(detail.x);
        let y = parseInt(detail.y);

        if( y == 0 && pokemon.positionY == 0){
          this.swap(this.state.players[client.sessionId].board,pokemon,x,y);
          success = true;
        }
        else if(this.state.phase == STATE.PICK){
          let teamSize = this.getTeamSize(client.sessionId);
          if (teamSize < this.state.players[client.sessionId].experienceManager.level) {
            this.swap(this.state.players[client.sessionId].board,pokemon,x,y);
            success = true;
          }
          else if(teamSize == this.state.players[client.sessionId].experienceManager.level){
            let empty = this.isPositionEmpty(this.state.players[client.sessionId].board,x,y);
            if(!empty){
              this.swap(this.state.players[client.sessionId].board,pokemon,x,y);
              success = true;
            }
            else{
              if((pokemon.positionY != 0 && y != 0) || y == 0){
                this.swap(this.state.players[client.sessionId].board,pokemon,x,y);
                success = true;
              }
            }
          }
        }
        this.state.players[client.sessionId].synergies.update(this.state.players[client.sessionId].board);
      }
    }

    if (!success) {
      client.send("DragDropFailed", {});
    }
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

  onShop(sessionId, pokemonId) {
    if (sessionId in this.state.players
      && pokemonId in this.state.players[sessionId].shop
      && this.getBoardSize(sessionId) < 9
      && this.state.players[sessionId].money >= this.state.players[sessionId].shop[pokemonId].cost) {

      this.state.players[sessionId].money -= this.state.players[sessionId].shop[pokemonId].cost;
      this.state.players[sessionId].board[pokemonId] = Object.assign(new Pokemon.Pokemon(), this.state.players[sessionId].shop[pokemonId]);
      delete this.state.players[sessionId].shop[pokemonId];
      this.state.players[sessionId].board[pokemonId].positionX = this.getFirstAvailablePositionInBoard(this.state.players[sessionId].board);
      this.state.players[sessionId].board[pokemonId].positionY = 0;

      this.computeEvolutions(this.state.players[sessionId].board);
      this.computeEvolutions(this.state.players[sessionId].board);
      this.state.players[sessionId].synergies.update(this.state.players[sessionId].board);
    }

  }

  computeEvolutions(board) {
    let evolve = false;
    for (let id in board) {
      let pokemon = board[id];
      let count = 0;
      let pokemonEvolutionName = pokemon.evolution;

      if (pokemonEvolutionName != "") {
        for (let id in board) {
          if (board[id].index == pokemon.index) {
            count += 1;
          }
        }

        if (count == 3) {
          for (let id in board) {
            if (board[id].index == pokemon.index && count >= 0) {
              delete board[id];
              count -= 1;
            }
          }
          let x = this.getFirstAvailablePositionInBoard(board);
          let pokemonEvolved = PokemonFactory.createPokemonFromName(pokemonEvolutionName);
          pokemonEvolved.positionX = x;
          pokemonEvolved.positionY = 0;
          board[pokemonEvolved.id] = pokemonEvolved;
          evolve = true;
        }
      }
    }

    return evolve;
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
