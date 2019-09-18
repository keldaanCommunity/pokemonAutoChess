const colyseus = require('colyseus');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const Simulation = require('../simulation/Simulation');

class World extends Schema {
  constructor()
  {
    super();
    this.time = 0;
  }
}
schema.defineTypes(World, {
  time: "number"
});

class MyState extends Schema {
    constructor () {
        super();

        this.world = new World();
        this.simulation = new Simulation();
    }
}
schema.defineTypes(MyState, {
  world: World
});

class MyRoom extends colyseus.Room {

    // When room is initialized
    onCreate () {
      this.setState(new MyState());
      this.setSimulationInterval((deltaTime) => this.update(deltaTime));
    }
    
    update (deltaTime) {
      this.state.world.time += deltaTime;
      console.log(this.state.world.time);
      this.state.simulation.scheduler.update();
      
        // implement your physics or world updates here!
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