const colyseus = require('colyseus');
const {Dispatcher} = require('@colyseus/command');
const GameState = require('./states/game-state');
const Commands = require('./commands/game-commands');
const Player = require('../models/colyseus-models/player');
const Statistic = require('../models/mongo-models/statistic');
const UserMetadata = require('../models/mongo-models/user-metadata');
const EloBot = require('../models/mongo-models/elo-bot');
const {POKEMON_BOT, XP_PLACE, XP_TABLE} = require('../models/enum');
const EloRank = require('elo-rank');
const admin = require('firebase-admin');


class GameRoom extends colyseus.Room {
  constructor() {
    super();
    this.dispatcher = new Dispatcher(this);
  }

  // When room is initialized
  onCreate(options) {
    console.log(`create game room`);
    this.setState(new GameState());
    this.maxClients = 8;
    this.eloEngine = new EloRank();
    for (const id in options.users) {
      const user = options.users[id];
      //console.log(user);
      if (user.isBot) {
        this.state.players.set(id, new Player(user.id, user.name, user.elo, user.avatar, true, this.state.specialCells, this.state.mapType, this.state.players.size + 1, `${this.state.mapType}0`));
        this.state.botManager.addBot(this.state.players.get(id));
        this.state.shop.assignShop(this.state.players.get(id));
      }
    }

    this.onMessage('shop', (client, message) => {
      if(!this.state.gameFinished){
        this.dispatcher.dispatch(new Commands.OnShopCommand(), {
          id: client.auth.uid,
          index: message.id
        });
      }
    });

    this.onMessage('dragDrop', (client, message) => {
      if(!this.state.gameFinished){
        this.dispatcher.dispatch(new Commands.OnDragDropCommand(), {
          client: client,
          detail: message.detail
        });
      }
    });

    this.onMessage('sellDrop', (client, message) => {
      if(!this.state.gameFinished){
        this.dispatcher.dispatch(new Commands.OnSellDropCommand(), {
          client,
          detail: message.detail
        });
      }
    });

    this.onMessage('refresh', (client, message) => {
      if(!this.state.gameFinished){
        this.dispatcher.dispatch(new Commands.OnRefreshCommand(), client.auth.uid);
      }
    });

    this.onMessage('lock', (client, message) => {
      if(!this.state.gameFinished){
        this.dispatcher.dispatch(new Commands.OnLockCommand(), client.auth.uid);
      }
    });

    this.onMessage('levelUp', (client, message) => {
      if(!this.state.gameFinished){
        this.dispatcher.dispatch(new Commands.OnLevelUpCommand(), client.auth.uid);
      }
    });
    
    this.onMessage('set-afterGameId', (client, message) => {
      this.state.afterGameId = message.id;
    });

    this.setSimulationInterval((deltaTime) =>{
      if(!this.state.gameFinished){
        this.dispatcher.dispatch(new Commands.OnUpdateCommand(), deltaTime);
      }
    })
  }

  async onAuth(client, options, request) {
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }

  onJoin(client, options, auth) {
    console.log(`${client.auth.displayName} join game room`);
    this.dispatcher.dispatch(new Commands.OnJoinCommand(), {client, options, auth});
  }

  async onLeave(client, consented) {
    try {
      if (consented) {
          throw new Error("consented leave");
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);
  
    } catch (e) {
  
      // 20 seconds expired. let's remove the client.
      console.log(`${client.auth.email} leave game room`);
      this.dispatcher.dispatch(new Commands.OnLeaveCommand(), {client, consented});
    }

  }

  onDispose() {
    console.log(`dispose game room`);
    let self = this;
    let requiredStageLevel = process.env.MODE == 'dev' ? 0 : 10;

    if(this.state.stageLevel >= requiredStageLevel && this.state.elligibleToXP){
      this.state.players.forEach(player =>{
        if(player.isBot){
          EloBot.find({'name': POKEMON_BOT[player.name]}, (err, bots)=>{
            if(bots){
              bots.forEach(bot =>{
                bot.elo = self.computeElo(player, player.rank, player.elo);
                bot.save();
              }); 
            }
          });
        }
        else{
          let dbrecord = this.transformToSimplePlayer(player);
          player.exp = XP_PLACE[player.rank - 1];
          let rank = player.rank;

          if(!this.state.gameFinished && player.life != 0){
            let rankOfLastPlayerAlive = this.state.players.size;
            this.state.players.forEach(plyr =>{
              if(plyr.life <= 0){
                rankOfLastPlayerAlive = Math.min(rankOfLastPlayerAlive, plyr.rank);
              }
            });
            rank = rankOfLastPlayerAlive;
          }

          UserMetadata.findOne({uid: player.id}, (err, usr)=> {
            if (err) {
              console.log(err);
            } else {
              let expThreshold = XP_TABLE[usr.level];
              if (expThreshold === undefined) {
                expThreshold = XP_TABLE[XP_TABLE.length - 1];
              }
              if (usr.exp + player.exp >= expThreshold) {
                usr.level += 1;
                usr.exp = usr.exp + player.exp - expThreshold;
              } else {
                usr.exp = usr.exp + player.exp;
              }
  
              if (player.rank == 1) {
                usr.wins += 1;
                usr.mapWin[self.state.mapType] += 1;
              }

              
              if(usr.elo){
                let elo = self.computeElo(player, rank, usr.elo);
                if(elo){
                  usr.elo = elo;
                }
                console.log(usr);
                //usr.markModified('metadata');
                usr.save();
    
                Statistic.create({
                  time: Date.now(),
                  name: dbrecord.name,
                  pokemons: dbrecord.pokemons,
                  rank: dbrecord.rank,
                  avatar: dbrecord.avatar,
                  playerId: dbrecord.id,
                  elo: elo
                });
              }
            }
          });
        }
      });
    }
    this.dispatcher.stop();
  }

  transformToSimplePlayer(player){
    let simplePlayer = {
      name: player.name,
      id: player.id,
      rank: player.rank,
      avatar: player.avatar,
      pokemons: [],
      exp: player.exp,
      elo: player.elo
    };
    player.board.forEach(pokemon => {
      if(pokemon.positionY != 0){
        simplePlayer.pokemons.push(pokemon.name);
      }
    });
    return simplePlayer;
  }

  computeElo(player, rank, elo){
    let eloGains = [];
    let meanGain = 0;
    this.state.players.forEach(plyr =>{
      if(player.name != plyr.name){
        let expectedScoreA = this.eloEngine.getExpected(elo, plyr.elo);
        if(rank < plyr.rank){
          eloGains.push(this.eloEngine.updateRating(expectedScoreA, 1, player.elo));
        }
        else{
          eloGains.push(this.eloEngine.updateRating(expectedScoreA, 0, player.elo));
        }
      }
    });

    eloGains.forEach(gain => {
      meanGain += gain;
    });
    meanGain = Math.floor(meanGain / eloGains.length);
    //console.log(eloGains);
    console.log(`${player.name} (was ${player.elo}) will be ${meanGain} (${rank})`);
    return meanGain;

  }

  computeRandomOpponent(playerId) {
      let player = this.state.players.get(playerId);
      this.checkOpponents(playerId);
      if(player.opponents.length == 0){
        this.fillOpponents(playerId);
      }
      if(player.opponents.length > 0){
        let id = player.opponents.pop();
        player.opponentName = this.state.players.get(id).name;
        return id;
      }
      else{
        return;
      }
  }

  checkOpponents(playerId){
    let player = this.state.players.get(playerId);
    let indexToDelete = [];
    player.opponents.forEach((p,i) =>{
      if(!this.state.players.get(p).alive){
        indexToDelete.push(i);
      }
    });
    indexToDelete.forEach(index =>{
      player.opponents.splice(index, 1);
    });
  }

  fillOpponents(playerId){
    let player = this.state.players.get(playerId);
    this.state.players.forEach((plyr, key) =>{
      if(plyr.alive && player.id != plyr.id){
        player.opponents.push(key);
      }
    });
    player.opponents.sort(() => Math.random() - 0.5);
  }

  swap(playerId, pokemon, x, y) {
    if (!this.isPositionEmpty(playerId, x, y)) {
      const pokemonToSwap = this.getPokemonByPosition(playerId, x, y);

      pokemonToSwap.positionX = pokemon.positionX;
      pokemonToSwap.positionY = pokemon.positionY;
    }
    pokemon.positionX = x;
    pokemon.positionY = y;
  }


  getPokemonByPosition(playerId, x, y) {
    let pkm;
    this.state.players.get(playerId).board.forEach((pokemon, key) => {
      if (pokemon.positionX == x && pokemon.positionY == y) {
        pkm = pokemon;
      }
    });
    return pkm;
  }

  isPositionEmpty(playerId, x, y) {
    let empty = true;

    this.state.players.get(playerId).board.forEach((pokemon, key) => {
      if (pokemon.positionX == x && pokemon.positionY == y) {
        empty = false;
      }
    });

    return empty;
  }

  getFirstAvailablePositionInBoard(playerId) {
    for (let i = 0; i < 8; i++) {
      if (this.isPositionEmpty(playerId, i, 0)) {
        return i;
      }
    }
  }

  getFirstAvailablePositionInTeam(playerId) {
    for (let x = 0; x < 8; x++) {
      for (let y = 1; y < 4; y++) {
        if (this.isPositionEmpty(playerId, x, y)) {
          return [x, y];
        }
      }
    }
  }
}

module.exports = GameRoom;
