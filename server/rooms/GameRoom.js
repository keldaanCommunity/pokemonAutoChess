const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;
const MapSchema = schema.MapSchema;
const Simulation = require('../simulation/Simulation');
const Player = require('../type/Player');
const Shop = require('../type/Shop');
const PokemonFactory = require('../type/PokemonFactory');
const superagent = require('superagent');

class Vector2D extends Schema {}

class FightState extends Schema {
    constructor () {
        super();

        this.locations = new ArraySchema();
        this.velocities = new ArraySchema();
        this.simulation = new Simulation();
        this.typeState = "FightState";
    }
}

class PickState extends Schema {
  constructor () {
      super();
      this.time = 5000;
      this.typeState = "PickState";
      this.players = new MapSchema();
      this.shop = new Shop();
  }
}

schema.defineTypes(Vector2D, {
  x: "number",
  y: "number"
});

schema.defineTypes(PickState,{
  time: "number",
  typeState: "string",
  players: {map: Player}
});

schema.defineTypes(FightState, {
  locations: [ Vector2D ],
  velocities: [ Vector2D ],
  typeState: "string",
  time: "number"
});


class GameRoom extends colyseus.Room {

    // When room is initialized
    onCreate () {
      this.setState(new PickState());
      this.setSimulationInterval((deltaTime) => this.update(deltaTime));
    }
    
    update (deltaTime)
    {
      if(this.state.typeState == "FightState")
      {
        this.state.simulation.scheduler.update();
        for (let i = 0; i < this.state.simulation.space.locations.length; i++) 
        {
          this.state.locations[i].x = this.state.simulation.space.locations[i].x;
          this.state.locations[i].y = this.state.simulation.space.locations[i].y;
          this.state.velocities[i].x = this.state.simulation.space.agents[i].velocity.x;
          this.state.velocities[i].y = this.state.simulation.space.agents[i].velocity.y;
        }
      }
      else if(this.state.typeState == "PickState")
      {
        this.state.time -= deltaTime;
        if(this.state.time < 0)
        {
          this.initializePickingPhase();
          this.computeIncome();
        }
      }
    }

    computeIncome()
    {
      for (let id in this.state.players) 
      {
        let player = this.state.players[id];
        player.money += Math.min(Math.floor(player.money/10),5);
        player.money += 5;
      }
    }

    initializePickingPhase()
    {
      this.state.time = 5000;
      for (let id in this.state.players) 
      {
        let player = this.state.players[id];
        this.state.shop.detachShop(player);
        this.state.shop.assignShop(player);
      }
    }

    async onAuth (client, options) {
      const response = await superagent
      .get(`https://graph.facebook.com/debug_token`)
      .query({
        'input_token': options.accessToken,
        'access_token': process.env.FACEBOOK_APP_TOKEN
      })
      .set('Accept', 'application/json');
      return response.body.data;
    }
  
    onJoin(client, options, auth) {
      console.log(options.facebookName, "joined successfully");
      //console.log("Auth data: ", auth);
      this.state.players[client.sessionId] = new Player(client.sessionId, options.facebookName);
    }

    // When a client sends a message
    onMessage (client, message) 
    {
      switch (message.event) 
      {
        case 'shop':
          this.onShop(client.sessionId, message.id);
          break;
      
        case 'dragDrop':
          this.onDragDrop(client, message.detail);
          break;

        case 'refresh':
          this.onRefresh(client.sessionId);
          break;

        case 'levelUp':
          this.onLevelUp(client.sessionId);
          break;

        default:
          break;
      } 
    }

    onRefresh(sessionId)
    {
      if(sessionId in this.state.players)
      {
        if(this.state.players[sessionId].money >= 2)
        {
          this.state.shop.detachShop(this.state.players[sessionId]);
          this.state.shop.assignShop(this.state.players[sessionId]);
          this.state.players[sessionId].money -= 2;
        }
      }
    }

    onLevelUp(sessionId)
    {
      if(sessionId in this.state.players)
      {
        if(this.state.players[sessionId].money >= 4)
        {
          this.state.players[sessionId].experienceManager.addExperience(4);
          this.state.players[sessionId].money -= 4;
        }
      }
    }

    onDragDrop(client, detail)
    {
      let success = false;
      if(client.sessionId in this.state.players)
      {
        if(detail.pokemonId in this.state.players[client.sessionId].board)
        {
          let pokemon = this.state.players[client.sessionId].board[detail.pokemonId];
          let x = parseInt(detail.x);
          let y = parseInt(detail.y);
          if(this.getTeamSize(client.sessionId) < this.state.players[client.sessionId].experienceManager.level || pokemon.positionY != 0)
          {

            if(!this.isPositionEmpty(this.state.players[client.sessionId].board, x, y))
            {
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
      if(!success)
      {
        this.send(client, 
          {
             message: "DragDropFailed" 
          }
        );
      }
    }

    getTeamSize(sessionId)
    {
      let size = 0;
      for (let id in this.state.players[sessionId].board) 
      {
          if(this.state.players[sessionId].board[id].positionY != 0)
          {
            size += 1;
          }
      }
      return size;
    }

    onShop(sessionId, pokemonId)
    {
      if(sessionId in this.state.players)
      {
        if(pokemonId in this.state.players[sessionId].shop)
        {
          if (this.state.players[sessionId].money >= this.state.players[sessionId].shop[pokemonId].cost){
            this.state.players[sessionId].money -= this.state.players[sessionId].shop[pokemonId].cost;
            this.state.shop.switchPool.set(pokemonId, this.state.players[sessionId].shop[pokemonId]);
            delete this.state.players[sessionId].shop[pokemonId];
            this.state.shop.switchPool.get(pokemonId).positionX = this.getFirstAvailablePositionInBoard( this.state.players[sessionId].board);
            this.state.shop.switchPool.get(pokemonId).positionY = 0;
            this.state.players[sessionId].board[pokemonId] = this.state.shop.switchPool.get(pokemonId);
            this.state.shop.switchPool.delete(pokemonId);
            
            this.computeEvolutions(this.state.players[sessionId].board);
            this.computeEvolutions(this.state.players[sessionId].board);
          }
        }
      }
    }

    computeEvolutions(board)
    {
      let evolve = false;
      for (let id in board)
      {
        let pokemon = board[id];
        let count = 0;
        let pokemonEvolutionName = pokemon.evolution;
        
        if(pokemonEvolutionName != '')
        {
          for (let id in board)
          {
            if(board[id].index == pokemon.index)
            {
              count += 1;
            }
          }
          
          if(count == 3)
          {
            for (let id in board)
            {
              if( board[id].index == pokemon.index && count >= 0)
              {
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

    getPokemonByPosition(board, x, y)
    {
      for (let id in board)
      {
        let pokemon = board[id];
        if(pokemon.positionX == x && pokemon.positionY == y)
        {
          return pokemon;
        }
      }
    }

    isPositionEmpty(board, x, y)
    {
      let empty = true;
      for (let id in board)
      {
        let pokemon = board[id];
        if(pokemon.positionX == x && pokemon.positionY == y)
        {
          empty = false;
        }
      }
      return empty;
    }

    getFirstAvailablePositionInBoard(board)
    {
      for (let i = 0; i < 9; i++) 
      {  
        let occupation = false;
        for (let id in board)
        {
          let pokemon = board[id];
          if(pokemon.positionX == i && pokemon.positionY == 0)
          {
            occupation = true;
          }
        }
        if(!occupation)
        {
          return i;
        }
      }
      return new Error('no place found, board full');
    }

    async onLeave (client, consented) {
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
    
      } catch (e) {
    
        // 20 seconds expired. let's remove the client.
        this.state.shop.detachShop(this.state.players[client.sessionId]);
        delete this.state.players[client.sessionId];
      }
    }


    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}

module.exports = GameRoom;