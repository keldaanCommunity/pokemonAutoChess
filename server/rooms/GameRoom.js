const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;
const MapSchema = schema.MapSchema;
const Simulation = require('../simulation/Simulation');
const Player = require('../type/Player');
const Shop = require('../type/Shop');

class Vector2D extends Schema {}
schema.defineTypes(Vector2D, {
  x: "number",
  y: "number"
});


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
      /*
      for(var i = 0; i < 10; ++i) 
      {
        this.state.locations.push(new Vector2D(0,0));
        this.state.velocities.push(new Vector2D(0,0));
      }
       */
    }
    
    update (deltaTime)
    {
      if(this.state.typeState == "FightState")
      {
        this.state.simulation.scheduler.update();
        for (let i = 0; i < this.state.simulation.space.locations.length; i++) {
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
        }
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

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) 
    {
      return true;
    }

    // When client successfully join the room
    onJoin (client, options, auth) 
    {
      this.state.players[client.sessionId] = new Player(client.sessionId);
    }

    // When a client sends a message
    onMessage (client, message) 
    {
      switch (message.event) 
      {
        case 'shopClick':
          this.onShopClick(client.sessionId, message.id);
          break;
      
        case 'dragDrop':
          this.onDragDrop(client.sessionId, message.detail);
        default:
          break;
      } 
    }

    onDragDrop(sessionId, detail)
    {
      let pokemonId = detail.pokemonId;
      let x = parseInt(detail.x);
      let y;
      if(detail.y)
      {
        y = parseInt(detail.y);
      }
      if(sessionId in this.state.players)
      {
        switch (detail.zone) {
          case 'boardZone':
            if(this.isBoardPlaceAvailable(this.state.players[sessionId].board, x))
            {
              if(pokemonId in this.state.players[sessionId].board)
              {
                this.state.players[sessionId].board[pokemonId].positionX = x;
              }
              else if(pokemonId in this.state.players[sessionId].team)
              {
                this.state.shop.pool.set(pokemonId, this.state.players[sessionId].team[pokemonId]);
                delete this.state.players[sessionId].team[pokemonId];
                this.state.shop.pool.get(pokemonId).positionX = x;
                this.state.players[sessionId].board[pokemonId] = this.state.shop.pool.get(pokemonId);
                this.state.shop.pool.delete(pokemonId);
              }
            }
            else
            {
              return new Error('no pokemon found in board or team');
            }
            break;
          
          case 'teamZone':
            if(this.isTeamPlaceAvailable(this.state.players[sessionId].board, x, y))
            {
              if(pokemonId in this.state.players[sessionId].board)
              {
                this.state.shop.pool.set(pokemonId, this.state.players[sessionId].board[pokemonId]);
                delete this.state.players[sessionId].board[pokemonId];
                this.state.shop.pool.get(pokemonId).positionX = x;
                this.state.shop.pool.get(pokemonId).positionY = y;
                this.state.players[sessionId].team[pokemonId] = this.state.shop.pool.get(pokemonId);
                this.state.shop.pool.delete(pokemonId);

              }
              else if(pokemonId in this.state.players[sessionId].team)
              {
                this.state.players[sessionId].team[pokemonId].positionX = x;
                this.state.players[sessionId].team[pokemonId].positionY = y;
              }
            }
            else
            {

            }
            break;
        
          default:
           return new Error('bad drop zone name');
        }
      }
    }

    isBoardPlaceAvailable(board, x)
    {
      let empty = true;
      for (let id in board)
      {
        let pokemon = board[id];
        if(pokemon.positionX == x)
        {
          empty = false;
        }
      }
      return empty;
    }

    isTeamPlaceAvailable(team, x, y)
    {
      let empty = true;
      for (let id in team)
      {
        let pokemon = team[id];
        if(pokemon.positionX == x && pokemon.positionY == y)
        {
          empty = false;
        }
      }
      return empty;
    }


    onShopClick(sessionId, pokemonId)
    {
      if(sessionId in this.state.players)
      {
        if(pokemonId in this.state.players[sessionId].shop)
        {
         this.state.shop.pool.set(pokemonId, this.state.players[sessionId].shop[pokemonId]);
         delete this.state.players[sessionId].shop[pokemonId];
         this.state.shop.pool.get(pokemonId).positionX = this.getFirstAvailablePositionInBoard( this.state.players[sessionId].board);
         this.state.players[sessionId].board[pokemonId] = this.state.shop.pool.get(pokemonId);
         this.state.shop.pool.delete(pokemonId);
        }
      }
    }

    getFirstAvailablePositionInBoard(board)
    {
      for (let i = 0; i < 9; i++) 
      { 
        let occupation = false;
        for (let id in board)
        {
          let pokemon = board[id];
          if(pokemon.positionX == i)
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

    onLeave (client, consented) 
    {
      this.state.shop.detachShop(this.state.players[client.sessionId]);
      delete this.state.players[client.sessionId];
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}

module.exports = GameRoom;