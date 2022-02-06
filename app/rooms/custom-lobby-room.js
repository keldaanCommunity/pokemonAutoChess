const colyseus = require('colyseus');
const LobbyState = require('./states/lobby-state');
const Mongoose = require('mongoose');
const Chat = require('../models/mongo-models/chat');
const Bot = require('../models/mongo-models/bot');
const UserMetadata = require('../models/mongo-models/user-metadata');
const LeaderboardInfo = require('../models/colyseus-models/leaderboard-info');
const schema = require('@colyseus/schema');
const LobbyUser = require('../models/colyseus-models/lobby-user');
const admin = require('firebase-admin');
const GameRecord = require('../models/colyseus-models/game-record');
const {MessageEmbed, WebhookClient} = require('discord.js');
const PasteBinAPI = require('pastebin-ts');
const DetailledStatistic = require('../models/mongo-models/detailled-statistic');

const pastebin = new PasteBinAPI({
  'api_dev_key': process.env.PASTEBIN_API_DEV_KEY,
  'api_user_name': process.env.PASTEBIN_API_USERNAME,
  'api_user_password': process.env.PASTEBIN_API_PASSWORD
});

class CustomLobbyRoom extends colyseus.LobbyRoom {
  constructor() {
    super();
  }

  onCreate(options) {
    console.log(`create lobby`);
    const self = this;
    super.onCreate(options);
    this.discordWebhook = new WebhookClient({url: process.env.WEBHOOK_URL});
    this.bots = new Map();
    this.setState(new LobbyState());
    this.autoDispose = false;

    Mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
      Chat.find({'time': {$gt: Date.now() - 86400000}}, (err, messages)=> {
        if (err) {
          console.log(err);
        } else {
          messages.forEach((message) => {
            self.state.addMessage(message.name, message.payload, message.avatar, message.time, false);
          });
        }
      });
      UserMetadata.find({}, ['displayName', 'avatar', 'elo'], {limit: 30, sort: {'elo': -1}}, (err, users)=>{
        if (err) {
          console.log(err);
        } else {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            self.state.leaderboard.push(new LeaderboardInfo(user.displayName, user.avatar, i + 1, user.elo));
          }
        }
      });
      Bot.find({}, {_id: 0}, {sort: {elo: -1}}, (err, bots)=>{
        bots.forEach((bot, i)=>{
          self.bots[bot.avatar] = bot;
          // console.log(bot.avatar, bot.elo);
          self.state.botLeaderboard.push(new LeaderboardInfo(bot.avatar, bot.avatar, i + 1, bot.elo));
        });
      });
    });


    this.onMessage('new-message', (client, message) => {
      if (message.payload != '') {
        this.state.addMessage(message.name, message.payload, message.avatar, Date.now(), true);
      }
    });

    this.onMessage('bot-creation', (client, message)=>{
      try {
        const bot = message.bot;
        const user = this.state.users.get(client.auth.uid);
        pastebin.createPaste({text: JSON.stringify(bot), title: `${user.name} has uploaded BOT ${bot.avatar}`, format: 'json'}).then((data) => {
          const dsEmbed = new MessageEmbed()
              .setTitle(`BOT ${bot.avatar} created by ${bot.author}`)
              .setURL(data)
              .setAuthor(user.name, `https://raw.githubusercontent.com/arnaudgregoire/pokemonAutoChess/master/app/public/dist/assets/avatar/${user.avatar}.png`)
              .setDescription(`A new bot has been created by ${user.name}, You can import the data in the Pokemon Auto Chess Bot Builder (url: ${data} ).`)
              .setThumbnail(`https://raw.githubusercontent.com/arnaudgregoire/pokemonAutoChess/master/app/public/dist/assets/avatar/${bot.avatar}.png`);
          client.send('pastebin-url', {url: data});
          try {
            this.discordWebhook.send({
              embeds: [dsEmbed]
            });
          } catch (error) {
            console.log(error);
          }
        })
            .catch((err) => {
              console.log(err);
            });
      } catch (error) {
        console.log(error);
      }
    });

    this.onMessage('bot-list-request', (client, message)=>{
      const botList = [];

      for (const bot in this.bots) {
        botList.push(bot);
      }

      client.send('bot-list', botList);
    });

    this.onMessage('bot-data-request', (client, bot)=>{
      const botData = this.bots[bot];
      client.send('bot-data', botData);
    });

    this.onMessage('map', (client, message) => {
      UserMetadata.findOne({'uid': client.auth.uid}, (err, user)=>{
        if (user) {
          const mapName = `${message.map}${message.index}`;
          const map = message.map;
          const index = message.index;
          const mapWin = user.mapWin[map];
          let changeNeeded = false;
          if (index == 0) {
            changeNeeded = true;
          } else if (index == 1 && mapWin >= 5) {
            changeNeeded = true;
          } else if (index == 2 && mapWin >= 10) {
            changeNeeded = true;
          } else if (index == 3 && mapWin >= 20) {
            changeNeeded = true;
          } else if (index == 4 && mapWin >= 40) {
            changeNeeded = true;
          }
          if (changeNeeded && mapName != user.map[map]) {
            user.map[map] = mapName;
            user.save();
          }
        }
      });
    });

    this.onMessage('name', (client, message)=>{
      this.state.users.get(client.auth.uid).name = message.name;
      UserMetadata.findOne({'uid': client.auth.uid}, (err, user)=>{
        if (user) {
          user.displayName = message.name;
          user.save();
        }
      });
    });

    this.onMessage('search', (client, message)=>{
      UserMetadata.findOne({'displayName': message.name}, (err, user)=>{
        if (user) {
          DetailledStatistic.find({'playerId': user.uid}, ['pokemons', 'time', 'rank', 'elo'], {limit: 10, sort: {'time': -1}}, (err, stats)=>{
            if (err) {
              console.log(err);
            } else {
              const records = new schema.ArraySchema();
              stats.forEach((record) =>{
                records.push(new GameRecord(record.time, record.rank, record.elo, record.pokemons));
              });

              client.send('user', new LobbyUser(
                  user.uid,
                  user.displayName,
                  user.elo,
                  user.avatar,
                  user.map,
                  user.langage,
                  user.wins,
                  user.exp,
                  user.level,
                  user.mapWin,
                  user.donor,
                  records,
                  user.honors));
            }
          });
        } else {
          client.send('user', {});
        }
      });
    });

    this.onMessage('avatar', (client, message) => {
      UserMetadata.findOne({'uid': client.auth.uid}, (err, user)=>{
        if (user) {
          const pokemon = message.pokemon;
          const lvl = user.level;
          const mapWin = user.mapWin;
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

            case 'archen':
              if (lvl >= 26) {
                changeNeeded = true;
              }
              break;

            case 'tirtouga':
              if (lvl >= 27) {
                changeNeeded = true;
              }
              break;

            case 'omanyte':
              if (lvl >= 28) {
                changeNeeded = true;
              }
              break;

            case 'kabuto':
              if (lvl >= 29) {
                changeNeeded = true;
              }
              break;

            case 'lileep':
              if (lvl >= 30) {
                changeNeeded = true;
              }
              break;

            case 'shieldon':
              if (lvl >= 31) {
                changeNeeded = true;
              }
              break;

            case 'amaura':
              if (lvl >= 32) {
                changeNeeded = true;
              }
              break;

            case 'tyrunt':
              if (lvl >= 33) {
                changeNeeded = true;
              }
              break;

            case 'cranidos':
              if (lvl >= 34) {
                changeNeeded = true;
              }
              break;
            case 'aerodactyl':
              if (lvl >= 35) {
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

            case 'cyndaquil':
              if (mapWin.FIRE >= 5) {
                changeNeeded = true;
              }
              break;

            case 'quilava':
              if (mapWin.FIRE >= 10) {
                changeNeeded = true;
              }
              break;

            case 'typlosion':
              if (mapWin.FIRE >= 25) {
                changeNeeded = true;
              }
              break;

            case 'entei':
              if (mapWin.FIRE >= 100) {
                changeNeeded = true;
              }
              break;

            case 'meowth':
              if (user.donor) {
                changeNeeded = true;
              }
              break;

            case 'persian':
              if (user.donor) {
                changeNeeded = true;
              }
              break;

            case 'absol':
              if (user.honors.includes('absol')) {
                changeNeeded = true;
              }
              break;

            case 'meloetta':
              if (user.honors.includes('meloetta')) {
                changeNeeded = true;
              }
              break;

            default:
              break;
          }

          if (changeNeeded && user.avatar != pokemon) {
            user.avatar = pokemon;
            user.save();
            this.state.users.get(user.uid).avatar = user.avatar;
          }
        }
      });
    });
  }

  async onAuth(client, options, request) {
    super.onAuth(client, options, request);
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }

  onJoin(client, options, auth) {
    super.onJoin(client, options, auth);
    // console.log(auth);
    // client.send('bot-data', this.bots);
    UserMetadata.findOne({'uid': client.auth.uid}, (err, user)=>{
      if (user) {
        DetailledStatistic.find({'playerId': client.auth.uid}, ['pokemons', 'time', 'rank', 'elo'], {limit: 10, sort: {'time': -1}}, (err, stats)=>{
          if (err) {
            console.log(err);
          } else {
            const records = new schema.ArraySchema();
            stats.forEach((record) =>{
              records.push(new GameRecord(record.time, record.rank, record.elo, record.pokemons));
            });

            this.state.users.set(client.auth.uid, new LobbyUser(
                user.uid,
                user.displayName,
                user.elo,
                user.avatar,
                user.map,
                user.langage,
                user.wins,
                user.exp,
                user.level,
                user.mapWin,
                user.donor,
                records,
                user.honors));
          }
        });
      } else {
        UserMetadata.create({
          uid: client.auth.uid,
          displayName: client.auth.displayName
        });
        this.state.users.set(client.auth.uid, new LobbyUser(
            client.auth.uid,
            client.auth.displayName,
            1000,
            'rattata',
            {
              FIRE: 'FIRE0',
              ICE: 'ICE0',
              GROUND: 'GROUND0',
              NORMAL: 'NORMAL0',
              GRASS: 'GRASS0',
              WATER: 'WATER0'
            },
            'eng',
            0,
            0,
            0,
            {
              FIRE: 0,
              ICE: 0,
              GROUND: 0,
              NORMAL: 0,
              GRASS: 0,
              WATER: 0
            },
            false,
            [],
            []
        ));
      }
    });
  }

  onLeave(client) {
    try {
      super.onLeave(client);
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} ${client.id} leave lobby`);
        this.state.users.delete(client.auth.uid);
      }
    } catch (error) {
      console.log(error);
    }
  }

  onDispose() {
    try {
      super.onDispose();
      console.log(`dispose lobby`);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CustomLobbyRoom;
