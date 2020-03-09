const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
const social = require("@colyseus/social");
const superagent = require("superagent");
const Player = require("../models/player");
const Shop = require("../models/shop");
const Pokemon = require("../models/pokemon");
const PokemonFactory = require("../models/pokemon-factory");
const STATE = require("../models/enum").STATE;
const SimulationState = require("../core/simulation-state");

class GameState extends schema.Schema {
  constructor() {
    super();
    this.time = 5000;
    this.phase = STATE.PICK;
    this.players = new schema.MapSchema();
    this.shop = new Shop();
  }
}

schema.defineTypes(GameState, {
  time: "number",
  phase: "string",
  players: { map: Player }
});


class GameRoom extends colyseus.Room {
  // When room is initialized
  onCreate() {
    console.log("create new game room");
    this.setState(new GameState());
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
  }

  async onAuth(client, options) {
    console.log("onAuth");
    console.log(client);
    console.log(options);
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
    console.log(options.name, "joined successfully");
    this.state.players[client.sessionId] = new Player(client.sessionId, options.facebookName);
  }

  // When a client sends a message
  onMessage(client, message) {
    switch (message.event) {
      case "shop":
        this.onShop(client.sessionId, message.id);
        break;
      case "dragDrop":
        this.onDragDrop(client, message.detail);
        break;
      case "refresh":
        this.onRefresh(client.sessionId);
        break;
      case "levelUp":
        this.onLevelUp(client.sessionId);
        break;
      default:
        break;
    }
  }

  async onLeave(client, consented) {
    // flag client as inactive for other users
    this.state.players[client.sessionId].connected = false;

    try {
      if (consented) {
        throw new Error("consented leave");
      }
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);
      // client returned! let's re-activate it.
      this.state.players[client.sessionId].connected = true;
    }
    catch (e) {
      // 20 seconds expired. let's remove the client.
      this.state.shop.detachShop(this.state.players[client.sessionId]);
      delete this.state.players[client.sessionId];
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    
  }

  update(deltaTime) {
    this.state.time -= deltaTime;
    if (this.state.time < 0) {
      this.switchPhase();
      this.computeIncome();
    }
  }

  switchPhase() {
    if (this.state.phase == STATE.PICK) {
      this.initializeFightingPhase();
    }
    else if (this.state.phase == STATE.FIGHT) {
      this.initializePickingPhase();
    }
  }

  computeIncome() {
    for (let id in this.state.players) {
      let player = this.state.players[id];
      player.money += Math.min(Math.floor(player.money / 10), 5);
      player.money += 5;
    }
  }

  initializePickingPhase() {
    this.state.phase = STATE.PICK;
    this.state.time = 5000;
    for (let id in this.state.players) {
      let player = this.state.players[id];
      this.state.shop.detachShop(player);
    }
    for (let id in this.state.players) {
      let player = this.state.players[id];
      this.state.shop.assignShop(player);
    }
  }

  initializeFightingPhase() {
    this.state.phase = STATE.FIGHT;
    this.state.time = 5000;
    for (let id in this.state.players) {
      let player = this.state.players[id];
      let opponentId = this.getRandomOpponent();
      if (opponentId == "") {
        // no opponent fight ?
      }
      else {
        let pokemons = [];
        for (let id in player.board) {
          let pokemon = player.board[id];
          if (pokemon.positionY != 0) {
            let simulationPokemon = PokemonFactory.createPokemonFromName(pokemon.name);
            simulationPokemon.setPosition(pokemon.positionX, pokemon.positionY - 1);
            simulationPokemon.group = 0;
            pokemons.push(simulationPokemon);
          }
        }
        for (let id in this.state.players[opponentId].board) {
          let pokemon = this.state.players[opponentId].board[id];
          if (pokemon.positionY != 0) {
            let simulationPokemon = PokemonFactory.createPokemonFromName(pokemon.name);
            simulationPokemon.setPosition(pokemon.positionX, 7 - pokemon.positionY);
            simulationPokemon.group = 1;
            pokemons.push(simulationPokemon);
          }
        }
        player.simulationState = new SimulationState(pokemons);
        player.simulationState.simulation.run();
        player.setLog(player.simulationState.simulation.state.log);
      }
    }
  }

  getRandomOpponent() {
    let playersId = [];
    for (let id in this.state.players) {
      playersId.push(id);
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

  onLevelUp(sessionId) {
    if (sessionId in this.state.players) {
      if (this.state.players[sessionId].money >= 4) {
        this.state.players[sessionId].experienceManager.addExperience(4);
        this.state.players[sessionId].money -= 4;
      }
    }
  }

  onDragDrop(client, detail) {
    let success = false;
    if (client.sessionId in this.state.players) {
      if (detail.pokemonId in this.state.players[client.sessionId].board) {
        let pokemon = this.state.players[client.sessionId].board[detail.pokemonId];
        let x = parseInt(detail.x);
        let y = parseInt(detail.y);
        if (this.getTeamSize(client.sessionId) < this.state.players[client.sessionId].experienceManager.level || pokemon.positionY != 0) {

          if (!this.isPositionEmpty(this.state.players[client.sessionId].board, x, y)) {
            let pokemonToSwap = this.getPokemonByPosition(this.state.players[client.sessionId].board, x, y);
            pokemonToSwap.positionX = pokemon.positionX;
            pokemonToSwap.positionY = pokemon.positionY;
          }
          pokemon.positionX = x;
          pokemon.positionY = y;
          success = true;
        }
      }
    }
    if (!success) {
      this.send(client, {
        message: "DragDropFailed"
      });
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

  onShop(sessionId, pokemonId) {
    if (sessionId in this.state.players) {
      if (pokemonId in this.state.players[sessionId].shop) {
        if (this.state.players[sessionId].money >= this.state.players[sessionId].shop[pokemonId].cost) {
          this.state.players[sessionId].money -= this.state.players[sessionId].shop[pokemonId].cost;
          this.state.players[sessionId].board[pokemonId] = Object.assign(new Pokemon.Pokemon(), this.state.players[sessionId].shop[pokemonId]);
          delete this.state.players[sessionId].shop[pokemonId];
          this.state.players[sessionId].board[pokemonId].positionX = this.getFirstAvailablePositionInBoard(this.state.players[sessionId].board);
          this.state.players[sessionId].board[pokemonId].positionY = 0;

          this.computeEvolutions(this.state.players[sessionId].board);
          this.computeEvolutions(this.state.players[sessionId].board);
        }
      }
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
      let occupation = false;
      for (let id in board) {
        let pokemon = board[id];
        if (pokemon.positionX == i && pokemon.positionY == 0) {
          occupation = true;
        }
      }
      if (!occupation) {
        return i;
      }
    }
    return new Error("no place found, board full");
  }
}

module.exports = GameRoom;