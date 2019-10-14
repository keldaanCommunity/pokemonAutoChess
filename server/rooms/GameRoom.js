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
      this.time = 30000;
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
      
      this.state.time = 30000;
      
      for (let id in this.state.players) {
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
    onMessage (client, message) { }

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
        delete this.state.players[client.sessionId];
      }
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}

module.exports = GameRoom;