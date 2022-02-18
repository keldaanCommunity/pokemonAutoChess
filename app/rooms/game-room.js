const colyseus = require('colyseus');
const {Dispatcher} = require('@colyseus/command');
const GameState = require('./states/game-state');
const Commands = require('./commands/game-commands');
const Player = require('../models/colyseus-models/player');
const UserMetadata = require('../models/mongo-models/user-metadata');
const BOT = require('../models/mongo-models/bot');
const {XP_PLACE, XP_TABLE, PKM} = require('../models/enum');
const PokemonFactory = require('../models/pokemon-factory');
const EloRank = require('elo-rank');
const admin = require('firebase-admin');
const DetailledStatistic = require('../models/mongo-models/detailled-statistic-v2');


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
      // console.log(user);
      if (user.isBot) {
        this.state.players.set(id, new Player(user.id, user.name, user.elo, user.avatar, true, this.state.players.size + 1));
        this.state.botManager.addBot(this.state.players.get(id));
        this.state.shop.assignShop(this.state.players.get(id));
      }
    }

    this.onMessage('shop', (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new Commands.OnShopCommand(), {
            id: client.auth.uid,
            index: message.id
          });
        } catch (error) {
          console.log('shop error', message, error);
        }
      }
    });

    this.onMessage('item', (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new Commands.OnItemCommand(), {
            playerId: client.auth.uid,
            id: message.id
          });
        } catch (error) {

        }
      }
    });

    this.onMessage('dragDrop', (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new Commands.OnDragDropCommand(), {
            client: client,
            detail: message.detail
          });
        } catch (error) {
          const errorInformation = {
            'updateBoard': true,
            'updateItems': true
          };
          client.send('DragDropFailed', errorInformation);
          console.log('drag drop error', error);
        }
      }
    });

    this.onMessage('sellDrop', (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new Commands.OnSellDropCommand(), {
            client,
            detail: message.detail
          });
        } catch (error) {
          console.log('sell drop error', message);
        }
      }
    });

    this.onMessage('request-tilemap', (client, message)=>{
      client.send('tilemap', this.state.tilemap);
    });

    this.onMessage('refresh', (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new Commands.OnRefreshCommand(), client.auth.uid);
        } catch (error) {
          console.log('refresh error', message);
        }
      }
    });

    this.onMessage('lock', (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new Commands.OnLockCommand(), client.auth.uid);
        } catch (error) {
          console.log('lock error', message);
        }
      }
    });

    this.onMessage('levelUp', (client, message) => {
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new Commands.OnLevelUpCommand(), client.auth.uid);
        } catch (error) {
          console.log('level up error', message);
        }
      }
    });

    this.onMessage('set-afterGameId', (client, message) => {
      this.state.afterGameId = message.id;
    });

    this.setSimulationInterval((deltaTime) =>{
      if (!this.state.gameFinished) {
        try {
          this.dispatcher.dispatch(new Commands.OnUpdateCommand(), deltaTime);
        } catch (error) {
          console.log('update error', error);
        }
      }
    });
  }

  async onAuth(client, options, request) {
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }

  onJoin(client, options, auth) {
    this.dispatcher.dispatch(new Commands.OnJoinCommand(), {client, options, auth});
  }

  async onLeave(client, consented) {
    try {
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} is leaving`);
      }
      if (consented) {
        throw new Error('consented leave');
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 60);
    } catch (e) {
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} leave game room`);
        this.dispatcher.dispatch(new Commands.OnLeaveCommand(), {client, consented});
      }
    }
  }

  onDispose() {
    // console.log(`dispose game room`);
    const self = this;
    const requiredStageLevel = process.env.MODE == 'dev' ? 0: 10;

    if (this.state.stageLevel >= requiredStageLevel && this.state.elligibleToXP) {
      this.state.players.forEach((player) =>{
        if (player.isBot) {
          BOT.find({'avatar': player.id}, (err, bots)=>{
            if (bots) {
              bots.forEach((bot) =>{
                bot.elo = self.computeElo(player, player.rank, player.elo);
                bot.save();
              });
            }
          });
        } else {
          const dbrecord = this.transformToSimplePlayer(player);
          player.exp = XP_PLACE[player.rank - 1];
          let rank = player.rank;

          if (!this.state.gameFinished && player.life != 0) {
            let rankOfLastPlayerAlive = this.state.players.size;
            this.state.players.forEach((plyr) =>{
              if (plyr.life <= 0) {
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

              if (usr.elo) {
                const elo = self.computeElo(player, rank, usr.elo);
                if (elo) {
                  usr.elo = elo;
                }
                console.log(usr);
                // usr.markModified('metadata');
                usr.save();

                DetailledStatistic.create({
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

  transformToSimplePlayer(player) {
    const simplePlayer = {
      name: player.name,
      id: player.id,
      rank: player.rank,
      avatar: player.avatar,
      pokemons: [],
      exp: player.exp,
      elo: player.elo
    };

    player.board.forEach((pokemon) => {
      if (pokemon.positionY != 0) {
        simplePlayer.pokemons.push({
          name: pokemon.name,
          items: Array.from(pokemon.items)
        });
      }
    });
    return simplePlayer;
  }

  computeElo(player, rank, elo) {
    const eloGains = [];
    let meanGain = 0;
    this.state.players.forEach((plyr) =>{
      if (player.name != plyr.name) {
        const expectedScoreA = this.eloEngine.getExpected(elo, plyr.elo);
        if (rank < plyr.rank) {
          eloGains.push(this.eloEngine.updateRating(expectedScoreA, 1, player.elo));
        } else {
          eloGains.push(this.eloEngine.updateRating(expectedScoreA, 0, player.elo));
        }
      }
    });

    eloGains.forEach((gain) => {
      meanGain += gain;
    });
    meanGain = Math.floor(meanGain / eloGains.length);
    // console.log(eloGains);
    console.log(`${player.name} (was ${player.elo}) will be ${meanGain} (${rank})`);
    return meanGain;
  }

  computeRandomOpponent(playerId) {
    const player = this.state.players.get(playerId);
    this.checkOpponents(playerId);
    if (player.opponents.length == 0) {
      this.fillOpponents(playerId);
    }
    if (player.opponents.length > 0) {
      const id = player.opponents.pop();
      player.opponentName = this.state.players.get(id).name;
      player.opponentAvatar = this.state.players.get(id).avatar;
      return id;
    } else {
      return;
    }
  }

  checkOpponents(playerId) {
    const player = this.state.players.get(playerId);
    const indexToDelete = [];
    player.opponents.forEach((p, i) =>{
      if (!this.state.players.get(p).alive) {
        indexToDelete.push(i);
      }
    });
    indexToDelete.forEach((index) =>{
      player.opponents.splice(index, 1);
    });
  }

  fillOpponents(playerId) {
    const player = this.state.players.get(playerId);
    this.state.players.forEach((plyr, key) =>{
      if (plyr.alive && player.id != plyr.id) {
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

  updateEvolution(id) {
    let evolve = false;
    const itemsToAdd = [];
    const player = this.state.players.get(id);
    player.board.forEach((pokemon, key) => {
      let count = 0;
      const pokemonEvolutionName = pokemon.evolution;

      if (pokemonEvolutionName != '' && pokemon.name != PKM.DITTO) {
        player.board.forEach((pkm, id) => {
          if ( pkm.index == pokemon.index) {
            count += 1;
          }
        });

        if (count == 3) {
          let x;
          let y;

          player.board.forEach((pkm, id) => {
            if ( pkm.index == pokemon.index && count >= 0) {
              if (x !== undefined && y !== undefined) {
                if (pkm.positionY >= y) {
                  if (pkm.positionY !== undefined) {
                    y = pkm.positionY;
                  }
                  if (pkm.positionX !== undefined) {
                    x = pkm.positionX;
                  }
                }
              } else {
                if (pkm.positionY !== undefined) {
                  y = pkm.positionY;
                }
                if (pkm.positionX !== undefined) {
                  x = pkm.positionX;
                }
              }

              pkm.items.forEach((el)=>{
                itemsToAdd.push(el);
              });
              player.board.delete(id);
              count -= 1;
            }
          });
          const pokemonEvolved = PokemonFactory.createPokemonFromName(pokemonEvolutionName);
          for (let i = 0; i < 3; i++) {
            const itemToAdd = itemsToAdd.pop();
            if (itemToAdd) {
              pokemonEvolved.items.add(itemToAdd);
            }
          }
          itemsToAdd.forEach( (item) =>{
            player.items.add(item);
          });
          pokemonEvolved.positionX = x;
          pokemonEvolved.positionY = y;
          player.board.set(pokemonEvolved.id, pokemonEvolved);
          evolve = true;
        }
      }
    });

    if (evolve) {
      player.synergies.update(player.board);
      player.effects.update(player.synergies);
    }
    player.boardSize = this.getTeamSize(player.board);
    return evolve;
  }

  getNumberOfPlayersAlive(players) {
    let numberOfPlayersAlive = 0;
    players.forEach((player, key) => {
      if (player.alive) {
        numberOfPlayersAlive ++;
      }
    });
    return numberOfPlayersAlive;
  }

  getBoardSize(board) {
    let boardSize = 0;

    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0) {
        boardSize ++;
      }
    });

    return boardSize;
  }

  getBoardSizeWithoutDitto(board) {
    let boardSize = 0;

    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0 && pokemon.name != PKM.DITTO) {
        boardSize ++;
      }
    });

    return boardSize;
  }

  getPossibleEvolution(board, name) {
    let count = 0;

    board.forEach((pokemon, key) => {
      if (pokemon.name == name && pokemon.evolution != '') {
        count ++;
      }
    });
    return (count >= 2);
  }

  getFirstPokemonOnBoard(board) {
    let pkm;
    let found = false;
    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0 && pokemon.name != PKM.DITTO && !found) {
        found = true;
        pkm = pokemon;
      }
    });
    return pkm;
  }

  getTeamSize(board) {
    let size = 0;

    board.forEach((pokemon, key) => {
      if (pokemon.positionY != 0) {
        size ++;
      }
    });

    return size;
  }
}

module.exports = GameRoom;
