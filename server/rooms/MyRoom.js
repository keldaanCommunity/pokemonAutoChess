const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;
const Simulation = require('../simulation/Simulation');

class Vector2D extends Schema {
}
schema.defineTypes(Vector2D, {
  x: "number",
  y: "number"
});

class MyState extends Schema {
    constructor () {
        super();

        this.locations = new ArraySchema();
        this.simulation = new Simulation();
    }
}
schema.defineTypes(MyState, {
  locations: [ Vector2D ],
});

class MyRoom extends colyseus.Room {

    // When room is initialized
    onCreate () {
      this.setState(new MyState());
      this.setSimulationInterval((deltaTime) => this.update(deltaTime));
      for(var i = 0; i < 20; ++i) 
      {
        this.state.locations.push(new Vector2D(0,0));
      }
    }
    
    update (deltaTime) {
      this.state.simulation.scheduler.update();

      for (let i = 0; i < this.state.simulation.space.locations.length; i++) {
        this.state.locations[i].x = this.state.simulation.space.locations[i].x;
        this.state.locations[i].y = this.state.simulation.space.locations[i].y;
      }
        // implement your physics or world updates here
        // this is a good place to update the room state
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) {
      return true;
     }

    // When client successfully join the room
    onJoin (client, options, auth) { }

    // When a client sends a message
    onMessage (client, message) { }

    // When a client leaves the room
    onLeave (client, consented) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}

module.exports = MyRoom;