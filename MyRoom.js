const colyseus = require('colyseus');

exports.MyRoom = class extends colyseus.Room {
  onCreate (options) {}
  onJoin (client, options) {}
  onMessage (client, message) {}
  onLeave (client, consented) {}
  onDispose() {}
}
