const schema = require('@colyseus/schema');
const GameRecord = require('./game-record');
const MapTileset = require('./map-tileset');
const WinTileset = require('./win-tileset');
const Schema = schema.Schema;

class LobbyUser extends Schema {
  constructor(id, name, elo, avatar, map, langage, wins, exp, level, mapWin, donor, history) {
    super();
    this.assign({
      id: id,
      name: name,
      avatar: avatar,
      elo: elo,
      map: new MapTileset(map),
      langage: langage,
      wins: wins,
      exp: exp,
      level: level,
      donor:donor,
      mapWin:new WinTileset(mapWin),
      history: history
    });
  }

  toString() {
    return `id: ${this.id} name:${this.name}`;
  }
}

schema.defineTypes(LobbyUser, {
  id: 'string',
  name: 'string',
  avatar: 'string',
  elo: 'uint16',
  map: MapTileset,
  langage: 'string',
  wins: 'uint16',
  exp:'uint16',
  level:'uint16',
  donor:'boolean',
  mapWin: WinTileset,
  history: [GameRecord]
});

module.exports = LobbyUser;
