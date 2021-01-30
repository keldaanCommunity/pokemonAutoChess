const colyseus = require('colyseus');
const social = require('@colyseus/social');
const LobbyState = require('./states/lobby-state');
const Mongoose = require('mongoose');
const Chat = require('../models/chat');
const User = require('@colyseus/social').User;

class CustomLobbyRoom extends colyseus.LobbyRoom {
  constructor() {
    super();
  }

  onCreate(options) {
    const self = this;
    super.onCreate(options);
    this.setState(new LobbyState());

    Mongoose.connect(process.env.MONGO_URI, (err) => {
      Chat.find({'time': {$gt: Date.now() - 86400000}}, (err, messages)=> {
        if (err) {
          console.log(err);
        } else {
          messages.forEach((message) => {
            self.state.addMessage(message.name, message.payload, message.avatar, message.time, false);
          });
        }
      });
    });

    this.onMessage('new-message', (client, message) => {
      this.state.addMessage(message.name, message.payload, message.avatar, Date.now(), true);
    });

    this.onMessage('avatar', (client, message) => {
      const pokemon = message.pokemon;
      const lvl = client.auth.metadata.level;
      const mapWin = client.auth.metadata.mapWin;
      let changeNeeded = false;
      switch (pokemon) {
        case 'rattata':
          if (lvl >= 0) {
            changeNeeded = true;
          }
          break;

        case 'pidgey':
          if (lvl >= 1) {
            changeNeeded = true;
          }
          break;

        case 'spearow':
          if (lvl >= 2) {
            changeNeeded = true;
          }
          break;

        case 'caterpie':
          if (lvl >= 3) {
            changeNeeded = true;
          }
          break;

        case 'weedle':
          if (lvl >= 4) {
            changeNeeded = true;
          }
          break;

        case 'igglybuff':
          if (lvl >= 5) {
            changeNeeded = true;
          }
          break;

        case 'seedot':
          if (lvl >= 6) {
            changeNeeded = true;
          }
          break;

        case 'zubat':
          if (lvl >= 7) {
            changeNeeded = true;
          }
          break;

        case 'sandshrew':
          if (lvl >= 8) {
            changeNeeded = true;
          }
          break;

        case 'pikachu':
          if (lvl >= 9) {
            changeNeeded = true;
          }
          break;

        case 'nidoranF':
          if (lvl >= 10) {
            changeNeeded = true;
          }
          break;

        case 'machop':
          if (lvl >= 11) {
            changeNeeded = true;
          }
          break;

        case 'geodude':
          if (lvl >= 12) {
            changeNeeded = true;
          }
          break;

        case 'eevee':
          if (lvl >= 13) {
            changeNeeded = true;
          }
          break;

        case 'poliwag':
          if (lvl >= 14) {
            changeNeeded = true;
          }
          break;

        case 'turtwig':
          if (lvl >= 15) {
            changeNeeded = true;
          }
          break;

        case 'togepi':
          if (lvl >= 16) {
            changeNeeded = true;
          }
          break;

        case 'ralts':
          if (lvl >= 17) {
            changeNeeded = true;
          }
          break;

        case 'nidoranM':
          if (lvl >= 18) {
            changeNeeded = true;
          }
          break;

        case 'slakoth':
          if (lvl >= 19) {
            changeNeeded = true;
          }
          break;

        case 'growlithe':
          if (lvl >= 20) {
            changeNeeded = true;
          }
          break;

        case 'numel':
          if (lvl >= 21) {
            changeNeeded = true;
          }
          break;

        case 'abra':
          if (lvl >= 22) {
            changeNeeded = true;
          }
          break;

        case 'horsea':
          if (lvl >= 23) {
            changeNeeded = true;
          }
          break;

        case 'gastly':
          if (lvl >= 24) {
            changeNeeded = true;
          }
          break;

        case 'mudkip':
          if (lvl >= 25) {
            changeNeeded = true;
          }
          break;

        case 'trapinch':
          if (mapWin.GROUND >= 5) {
            changeNeeded = true;
          }
          break;

        case 'vibrava':
          if (mapWin.GROUND >= 10) {
            changeNeeded = true;
          }
          break;

        case 'flygon':
          if (mapWin.GROUND >= 25) {
            changeNeeded = true;
          }
          break;

        case 'regirock':
          if (mapWin.GROUND >= 100) {
            changeNeeded = true;
          }
          break;

        case 'bagon':
          if (mapWin.NORMAL >= 5) {
            changeNeeded = true;
          }
          break;

        case 'shelgon':
          if (mapWin.NORMAL >= 10) {
            changeNeeded = true;
          }
          break;

        case 'salamence':
          if (mapWin.NORMAL >= 25) {
            changeNeeded = true;
          }
          break;

        case 'rayquaza':
          if (mapWin.NORMAL >= 100) {
            changeNeeded = true;
          }
          break;

        case 'spheal':
          if (mapWin.ICE >= 5) {
            changeNeeded = true;
          }
          break;

        case 'sealeo':
          if (mapWin.ICE >= 10) {
            changeNeeded = true;
          }
          break;

        case 'walrein':
          if (mapWin.ICE >= 25) {
            changeNeeded = true;
          }
          break;

        case 'articuno':
          if (mapWin.ICE >= 100) {
            changeNeeded = true;
          }
          break;

        case 'bulbasaur':
          if (mapWin.GRASS >= 5) {
            changeNeeded = true;
          }
          break;

        case 'ivysaur':
          if (mapWin.GRASS >= 10) {
            changeNeeded = true;
          }
          break;

        case 'venusaur':
          if (mapWin.GRASS >= 25) {
            changeNeeded = true;
          }
          break;

        case 'shaymin':
          if (mapWin.GRASS >= 100) {
            changeNeeded = true;
          }
          break;

        case 'squirtle':
          if (mapWin.WATER >= 5) {
            changeNeeded = true;
          }
          break;

        case 'wartortle':
          if (mapWin.WATER >= 10) {
            changeNeeded = true;
          }
          break;

        case 'blastoise':
          if (mapWin.WATER >= 25) {
            changeNeeded = true;
          }
          break;

        case 'kyogre':
          if (mapWin.WATER >= 100) {
            changeNeeded = true;
          }
          break;

        case 'charmander':
          if (mapWin.FIRE >= 5) {
            changeNeeded = true;
          }
          break;

        case 'charmeleon':
          if (mapWin.FIRE >= 10) {
            changeNeeded = true;
          }
          break;

        case 'charizard':
          if (mapWin.FIRE >= 25) {
            changeNeeded = true;
          }
          break;

        case 'groudon':
          if (mapWin.FIRE >= 100) {
            changeNeeded = true;
          }
          break;

        default:
          break;
      }

      if (changeNeeded) {
        client.auth.metadata.avatar = pokemon;
        Mongoose.connect(process.env.MONGO_URI, (err) => {
          User.find({email: client.auth.email}, (err, users)=> {
            if (err) {
              console.log(err);
            } else {
              users.forEach((usr) => {
                usr.metadata.avatar = pokemon;
                usr.markModified('metadata');
                usr.save();
              });
            }
          });
        });
      }

      client.send('metadata', client.auth.metadata);
    });
  }

  async onAuth(client, options, request) {
    super.onAuth(client, options, request);
    const token = social.verifyToken(options.token);
    const user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    super.onJoin(client, options, auth);
    this.state.addMessage('Server', `${auth.email.split('@')[0]} joined.`, auth.metadata.avatar, Date.now(), true);
    this.clients.forEach((cli) => {
      if (cli.auth.email == client.auth.email && client.sessionId != cli.sessionId) {
        cli.send('to-lobby', {});
      }
    });
  }

  onLeave(client) {
    super.onLeave(client);
    // const time = new Date(Date.now());
    // this.state.addMessage('Server',`${client.auth.email} left.`, client.auth.metadata.avatar, Date.now(), true);
  }

  onDispose() {
    super.onDispose();
    console.log('Dispose LobbyRoom');
  }
}

module.exports = CustomLobbyRoom;
