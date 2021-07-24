const colyseus = require('colyseus');
const {PKM, TYPE, RARITY, BOT_AVATAR} = require('../models/enum');
const LobbyState = require('./states/lobby-state');
const Mongoose = require('mongoose');
const Chat = require('../models/mongo-models/chat');
const Statistic = require('../models/mongo-models/statistic');
const UserMetadata = require('../models/mongo-models/user-metadata');
const LeaderboardInfo = require('../models/colyseus-models/leaderboard-info');
const PokemonFactory = require('../models/pokemon-factory');
const EloBot = require('../models/mongo-models/elo-bot');
const schema = require('@colyseus/schema');
const GameRecord = require('../models/colyseus-models/game-record');
const DetailledGameUser = require('../models/colyseus-models/detailled-game-user');
const ArraySchema = schema.ArraySchema;
const admin = require('firebase-admin');

class CustomLobbyRoom extends colyseus.LobbyRoom {
  constructor() {
    super();
  }

  onCreate(options) {
    console.log(`create lobby`);
    const self = this;
    super.onCreate(options);
    this.setState(new LobbyState());

    Mongoose.connect(process.env.MONGO_URI, (err) => {
      Chat.find({'time': {$gt: Date.now() - 864000000}}, (err, messages)=> {
        if (err) {
          console.log(err);
        } else {
          messages.forEach((message) => {
            self.state.addMessage(message.name, message.payload, message.avatar, message.time, false);
          });
        }
      });
      UserMetadata.find({}, ['displayName','avatar','level'], {limit:25, sort:{'level': -1}}, (err, users)=> {
        if(err){
          console.log(err);
        }
        else{
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            self.state.leaderboard.push(new LeaderboardInfo(user.displayName, user.avatar, i + 1, user.level));
          }
        }
      });
      UserMetadata.find({'elo':{$ne: 1000}},['displayName','avatar','elo'],{limit:25, sort:{'elo': -1}}, (err, users)=>{
        if(err){
          console.log(err);
        }
        else{
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            self.state.playerEloLeaderboard.push(new LeaderboardInfo(user.displayName, user.avatar, i + 1, user.elo));
          }
        }
      });
      EloBot.find({},['name','elo'],{sort: {'elo': -1}}, (err, bots)=>{
        if(err){
          console.log(err);
        }
        else{
          for (let i = 0; i < bots.length; i++) {
            const bot = bots[i];
            self.state.botEloLeaderboard.push(new LeaderboardInfo(BOT_AVATAR[bot.name], BOT_AVATAR[bot.name], i + 1, bot.elo));
          }
        }
      });
      
      /*
      Statistic.find({'time':{$gt: Date.now() - 2592000000}}, (err, stats)=>{

        if(stats.length != 0){
          let typeCount = new Map();
          let pkmCount = new Map();
          let mythicalPkmCount = new Map();
          let threeStarsPkmCount = new Map();
          let avatars = new Map();
  
          Object.keys(TYPE).forEach(type => {
            typeCount.set(type,0);
          });
          Object.values(PKM).forEach(pkm => {
            pkmCount.set(pkm,0);
            mythicalPkmCount.set(pkm,0);
            threeStarsPkmCount.set(pkm,0);
          });
          stats.forEach((stat)=>{
            if(stat.pokemons && stat.pokemons.length != 0){
              if(stat.pokemons.length > 2){
                if(stat.avatar && !avatars.has(stat.name)){
                  avatars.set(stat.name, stat.avatar);
                }
              }
              stat.pokemons.forEach(pokemon =>{
                let colyseusPkm = PokemonFactory.createPokemonFromName(pokemon);
                pkmCount.set(pokemon, pkmCount.get(pokemon) + 1);
                if(colyseusPkm.rarity == RARITY.MYTHICAL){
                  mythicalPkmCount.set(pokemon, mythicalPkmCount.get(pokemon) + 1);
                }
                if(colyseusPkm.stars == 3){
                  threeStarsPkmCount.set(pokemon, threeStarsPkmCount.get(pokemon) + 1);
                }
                colyseusPkm.types.forEach(type =>{
                  typeCount.set(type, typeCount.get(type) + 1);
                });
              });
            }
          });
          let types = [];
          let mythicalPkms = [];
          let pkms = [];
          let threeStarsPkm = [];
  
          pkmCount.forEach((value, key) =>{
            if(value != 0){
              pkms.push({pkm: key, count: value});
            }
          });
          mythicalPkmCount.forEach((value, key) =>{
            if(value != 0){
              mythicalPkms.push({pkm: key, count: value});
            }
          });
          threeStarsPkmCount.forEach((value, key) =>{
            if(value != 0){
              threeStarsPkm.push({pkm: key, count: value});
            }
          });
          typeCount.forEach((value, key) =>{
            if(value != 0){
              types.push({type: key, count: value});
            }
          });
          types.sort((a, b) => {return b.count - a.count});
          mythicalPkms.sort((a, b) => {return b.count - a.count});
          pkms.sort((a, b) => {return b.count - a.count});
          threeStarsPkm.sort((a, b) => {return b.count - a.count});
          //console.log(players);
  
          for (let i = 0; i < types.length; i++) {
            self.state.typesLeaderboard.push(new LeaderboardInfo(types[i].type, types[i].type, i+1 ,types[i].count));
          }
          
          for (let i = 0; i < 25; i++) {
            self.state.mythicalPokemonLeaderboard.push(new LeaderboardInfo(mythicalPkms[i].pkm, mythicalPkms[i].pkm, i+1 ,mythicalPkms[i].count));
            self.state.pokemonLeaderboard.push(new LeaderboardInfo(pkms[i].pkm, pkms[i].pkm, i+1 ,pkms[i].count));
            self.state.threeStarsLeaderboard.push(new LeaderboardInfo(threeStarsPkm[i].pkm, threeStarsPkm[i].pkm, i+1 ,threeStarsPkm[i].count));
          }
        }
      });
          */
    });


    this.onMessage('new-message', (client, message) => {
      this.state.addMessage(message.name, message.payload, message.avatar, Date.now(), true);
    });

    this.onMessage('map', (client, message) => {
      const mapName = `${message.map}${message.index}`;
      const map = message.map;
      const index = message.index;
      const mapWin = client.auth.metadata.mapWin[map];
      let changeNeeded = false;
      if(index == 0){
        changeNeeded = true;
      }
      else if(index == 1 && mapWin >= 5){
        changeNeeded = true;
      }
      else if(index == 2 && mapWin >= 10){
        changeNeeded = true;
      }
      else if(index == 3 && mapWin >= 20){
        changeNeeded = true;
      }
      else if(index == 4 && mapWin >= 40){
        changeNeeded = true;
      }
      if(changeNeeded && mapName != client.auth.metadata.map[map]){
        client.auth.metadata.map[map] = mapName;
        User.find({_id: client.auth.uid}, (err, users)=> {
          if (err) {
            console.log(err);
          } else {
            users.forEach((usr) => {
              usr.metadata.map[map] = mapName;
              usr.markModified('metadata');
              usr.save();
            });
          }
        });
      }
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
          if(client.auth.metadata.donor){
            changeNeeded = true;
          }
          break;
        
        case 'persian':
          if(client.auth.metadata.donor){
            changeNeeded = true;
          }

        default:
          break;
      }

      if (changeNeeded && client.auth.metadata.avatar != pokemon) {
        client.auth.metadata.avatar = pokemon;
        User.find({_id: client.auth.uid}, (err, users)=> {
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
      }

      client.send('metadata', client.auth.metadata);
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
    //console.log(auth);
    UserMetadata.findOne({'uid':auth.uid},(err, user)=>{
      if(user){
        this.state.users[client.auth.uid] = new DetailledGameUser(user.uid, user.displayName, user.elo, user.avatar, false, false, user.history);
      }
      else{
        UserMetadata.create({
          uid: client.auth.uid,
          displayName: client.auth.displayName
        });
        this.state.users[client.auth.uid] = new DetailledGameUser(client.auth.uid, client.auth.displayName, 1000, 'rattata', false, false, []);
      }
    });
    /*
    console.log(`${client.auth.email} join lobby`);
    Statistic.find({'playerId': client.auth.uid}, ['pokemons','time','rank','elo'], {limit:15, sort:{'time': -1}}, (err, stats)=>{
      if(err){
        console.log(err);
      }
      else{
        let records = new ArraySchema();
        stats.forEach(record =>{
          //console.log(record.elo);
          records.push(new GameRecord(record.time, record.rank, record.elo, record.pokemons));
        });
        
        this.state.users[client.auth.uid] = new DetailledGameUser(client.auth.uid, client.auth.displayName, auth.metadata.elo, auth.metadata.avatar, false, false, records);

        this.clients.forEach((cli) => {
          if (client.auth.email && cli.auth.email == client.auth.email && client.sessionId != cli.sessionId) {
            cli.send('to-lobby', {});
          }
        });
      }
    });
    */
  }

  onLeave(client) {
    super.onLeave(client);
    console.log(`${client.auth.email} leave lobby`);
    this.state.users.delete(client.auth.uid);
    // const time = new Date(Date.now());
    // this.state.addMessage('Server',`${client.auth.email} left.`, client.auth.metadata.avatar, Date.now(), true);
  }

  onDispose() {
    super.onDispose();
    console.log(`dispose lobby`);
  }
}

module.exports = CustomLobbyRoom;
