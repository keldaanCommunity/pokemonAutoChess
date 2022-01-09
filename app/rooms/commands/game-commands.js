const Command = require('@colyseus/command').Command;
const {STATE, COST, TYPE, ITEMS, XP_PLACE, RARITY, PKM, BATTLE_RESULT, NEUTRAL_STAGE} = require('../../models/enum');
const Player = require('../../models/colyseus-models/player');
const PokemonFactory = require('../../models/pokemon-factory');
const ItemFactory = require('../../models/item-factory');
const UserMetadata = require('../../models/mongo-models/user-metadata');
const Items = require('../../models/colyseus-models/items');

class OnShopCommand extends Command {
  execute({id, index}) {
    if (id !== true && index !== true && this.state.players.has(id)) {
      const player = this.state.players.get(id);
      if (player.shop[index]) {
        const name = player.shop[index];
        const pokemon = PokemonFactory.createPokemonFromName(name);

        if (player.money >= pokemon.cost && (this.room.getBoardSize(player.board) < 8 ||
        (this.room.getPossibleEvolution(player.board, pokemon.name) && this.room.getBoardSize(player.board) == 8))) {
          player.money -= pokemon.cost;
          pokemon.positionX = this.room.getFirstAvailablePositionInBoard(player.id);
          pokemon.positionY = 0;
          player.board.set(pokemon.id, pokemon);

          if (pokemon.rarity == RARITY.MYTHICAL) {
            this.state.shop.assignShop(player);
          } else {
            player.shop[index] = '';
          }
          this.room.updateEvolution(id);
          this.room.updateEvolution(id);
        }
      }
    }
  }
}

class OnItemCommand extends Command {
  execute({playerId, id}) {
    if (this.state.players.has(playerId)) {
      const player = this.state.players.get(playerId);
      if (player.itemsProposition.includes(id)) {
        player.stuff.add(id);
      }
      while (player.itemsProposition.length > 0) {
        player.itemsProposition.pop();
      }
    }
  }
}

class OnDragDropCommand extends Command {
  execute({client, detail}) {
    /*
    client.send('info', {
      title:'Information',
      info:'Tu es un sanglier'
    });
    */
    let success = false;
    let dittoReplaced = false;
    const message = {
      'updateBoard': true,
      'updateItems': true,
      'field': detail.place
    };
    const playerId = client.auth.uid; ;

    if (this.state.players.has(playerId)) {
      if (detail.objType == 'pokemon') {
        message.updateItems = false;
        if (this.state.players.get(playerId).board.has(detail.id)) {
          const pokemon = this.state.players.get(playerId).board.get(detail.id);
          const x = parseInt(detail.x);
          const y = parseInt(detail.y);
          if (pokemon.name == PKM.DITTO) {
            const pokemonToClone = this.room.getPokemonByPosition(playerId, x, y);
            if (pokemonToClone && pokemonToClone.rarity != RARITY.MYTHICAL && !pokemonToClone.types.includes(TYPE.FOSSIL)) {
              dittoReplaced = true;
              const replaceDitto = PokemonFactory.createPokemonFromName(PokemonFactory.getPokemonFamily(pokemonToClone.name));
              this.state.players.get(playerId).board.delete(detail.id);
              const position = this.room.getFirstAvailablePositionInBoard(playerId);
              if (position !== undefined) {
                replaceDitto.positionX = position;
                replaceDitto.positionY = 0;
                this.state.players.get(playerId).board.set(replaceDitto.id, replaceDitto);
                success = true;
                message.updateBoard = false;
              }
            }
          } else {
            if ( y == 0 && pokemon.positionY == 0) {
              this.room.swap(playerId, pokemon, x, y);
              success = true;
            } else if (this.state.phase == STATE.PICK) {
              const teamSize = this.room.getTeamSize(this.state.players.get(playerId).board);
              if (teamSize < this.state.players.get(playerId).experienceManager.level) {
                this.room.swap(playerId, pokemon, x, y);
                success = true;
              } else if (teamSize == this.state.players.get(playerId).experienceManager.level) {
                const empty = this.room.isPositionEmpty(playerId, x, y);
                if (!empty) {
                  this.room.swap(playerId, pokemon, x, y);
                  success = true;
                  message.updateBoard = false;
                } else {
                  if ((pokemon.positionY != 0 && y != 0) || y == 0) {
                    this.room.swap(playerId, pokemon, x, y);
                    success = true;
                    message.updateBoard = false;
                  }
                }
              }
            }
          }
          this.state.players.get(playerId).synergies.update(this.state.players.get(playerId).board);
          this.state.players.get(playerId).effects.update(this.state.players.get(playerId).synergies);
          this.state.players.get(playerId).boardSize = this.room.getTeamSize(this.state.players.get(playerId).board);
        }
      }
      if (detail.objType == 'item') {
        message.updateBoard = false;
        const item = this.state.players.get(playerId).stuff[detail.place];
        if ( item ) {
          const x = parseInt(detail.x);
          const y = parseInt(detail.y);
          let eevolution;
          let evolve = false;

          this.state.players.get(playerId).board.forEach((pokemon, id) => {
            if (pokemon.positionX == x && pokemon.positionY == y && pokemon.items.length < 3) {
              if (pokemon.name == PKM.EEVEE && item == ITEMS.WATER_STONE) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.VAPOREON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.EEVEE && item == ITEMS.FIRE_STONE) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.FLAREON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.EEVEE && item == ITEMS.THUNDER_STONE) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.JOLTEON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.EEVEE && item == ITEMS.NIGHT_STONE) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.UMBREON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.EEVEE && item == ITEMS.MOON_STONE) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.SYLVEON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.EEVEE && item == ITEMS.LEAF_STONE) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.LEAFEON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.EEVEE && item == ITEMS.DAWN_STONE) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.ESPEON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.EEVEE && item == ITEMS.ICY_ROCK) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.GLACEON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.GROUDON && item == ITEMS.RED_ORB) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.PRIMALGROUDON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.KYOGRE && item == ITEMS.BLUE_ORB) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.PRIMALKYOGRE);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.RAYQUAZA && item == ITEMS.DELTA_ORB) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.MEGARAYQUAZA);
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items = new Items(pokemon.items);
                eevolution.items.add(item);
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.DOME_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.KABUTO);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.HELIX_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.OMANYTE);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.OLD_AMBER) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.AERODACTYL);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.ROOT_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.LILEEP);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.CLAW_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.ANORITH);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.SKULL_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.CRANIDOS);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.ARMOR_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.SHIELDON);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.PLUME_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.ARCHEN);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.COVER_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.TIRTOUGA);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.JAW_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.TYRUNT);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else if (pokemon.name == PKM.DITTO && item == ITEMS.SAIL_FOSSIL) {
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                eevolution = PokemonFactory.createPokemonFromName(PKM.AMAURA);
                eevolution.positionX = x;
                eevolution.positionY = y;
                this.state.players.get(playerId).board.delete(id);
                success = true;
                message.updateItems = false;
              } else {
                pokemon.items.add(item);
                this.state.players.get(playerId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
            }
          });
          if (eevolution) {
            this.state.players.get(playerId).board.set(eevolution.id, eevolution);
            this.state.players.get(playerId).stuff.remove(item);
          }
          if (evolve) {
            this.state.players.get(playerId).synergies.update(this.state.players.get(playerId).board);
            this.state.players.get(playerId).effects.update(this.state.players.get(playerId).synergies);
            this.state.players.get(playerId).boardSize = this.room.getTeamSize(this.state.players.get(playerId).board);
          }
        }
      }
    }
    if (!success && client.send) {
      client.send('DragDropFailed', message);
    }
    if (dittoReplaced) {
      this.room.updateEvolution(playerId);
      this.room.updateEvolution(playerId);
    }
  }
}

class OnSellDropCommand extends Command {
  execute({client, detail}) {
    if (this.state.players.has(client.auth.uid) &&
      this.state.players.get(client.auth.uid).board.has(detail.pokemonId)) {
      const pokemon = this.state.players.get(client.auth.uid).board.get(detail.pokemonId);
      const player = this.state.players.get(client.auth.uid);
      player.money += COST[pokemon.rarity] * pokemon.stars;

      const items = pokemon.items.getAllItems();
      items.forEach((it)=>{
        player.stuff.add(it);
      });

      player.board.delete(detail.pokemonId);

      player.synergies.update(player.board);
      player.effects.update(player.synergies);
      player.boardSize = this.room.getTeamSize(player.board);
    }
  }
}

class OnRefreshCommand extends Command {
  execute(id) {
    if (this.state.players.has(id)) {
      const player = this.state.players.get(id);
      if (player.money >= 2) {
        this.state.shop.assignShop(player);
        player.money -= 2;
      }
    }
  }
}

class OnLockCommand extends Command {
  execute(id) {
    if (this.state.players.has(id)) {
      this.state.players.get(id).shopLocked = !this.state.players.get(id).shopLocked;
    }
  }
}

class OnLevelUpCommand extends Command {
  execute(id) {
    if (this.state.players.has(id)) {
      const player = this.state.players.get(id);
      if (player.money >= 4) {
        player.experienceManager.addExperience(4);
        player.money -= 4;
      }
    }
  }
}

class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    UserMetadata.findOne({'uid': auth.uid}, (err, user)=>{
      if (user) {
        this.state.players.set(client.auth.uid, new Player(
            user.uid,
            user.displayName,
            user.elo,
            user.avatar,
            false,
            this.state.specialCells,
            this.state.mapType,
            this.state.players.size + 1,
            user.map[this.state.mapType]
        ));
        if (client && client.auth && client.auth.displayName) {
          console.log(`${client.auth.displayName} ${client.id} join game room`);
        }

        this.state.players.forEach((p)=>{
          console.log(p.name);
        });
        // console.log(this.state.players.get(client.auth.uid).tileset);
        this.state.shop.assignShop(this.state.players.get(client.auth.uid));
        if (this.state.players.size >= 8) {
        // console.log('game elligible to xp');
          this.state.elligibleToXP = true;
        }
      }
    });
  }
}

class OnLeaveCommand extends Command {
  execute({client, consented}) {
  }
}

class OnUpdateCommand extends Command {
  execute(deltaTime) {
    if (deltaTime) {
      let updatePhaseNeeded = false;
      this.state.time -= deltaTime;
      if (Math.round(this.state.time/1000) != this.state.roundTime) {
        this.state.roundTime = Math.round(this.state.time/1000);
      }
      if (this.state.time < 0) {
        updatePhaseNeeded = true;
      } else if (this.state.phase == STATE.FIGHT) {
        let everySimulationFinished = true;

        this.state.players.forEach((player, key) => {
          if (!player.simulation.finished) {
            if (everySimulationFinished) {
              everySimulationFinished = false;
            }
            player.simulation.update(deltaTime);
          }
        });

        if (everySimulationFinished) {
          updatePhaseNeeded = true;
        }
      }
      if (updatePhaseNeeded) {
        return [new OnUpdatePhaseCommand()];
      }
    }
  }
}

class OnUpdatePhaseCommand extends Command {
  execute() {
    if (this.state.phase == STATE.PICK) {
      const commands = this.checkForLazyTeam();
      if (commands.length != 0) {
        return commands;
      }
      this.initializeFightingPhase();
    } else if (this.state.phase == STATE.FIGHT) {
      this.computeLife();
      this.rankPlayers();
      this.checkDeath();
      const kickCommands = this.checkEndGame();
      if (kickCommands.length != 0) {
        return kickCommands;
      }
      this.computeIncome();
      this.initializePickingPhase();
    }
  }

  checkEndGame() {
    const commands = [];
    const numberOfPlayersAlive = this.room.getNumberOfPlayersAlive(this.state.players);

    if (numberOfPlayersAlive <= 1) {
      this.state.gameFinished = true;
      this.room.broadcast('info',
          {
            title: 'End of the game',
            info: 'We have a winner !'
          });
      // commands.push(new OnKickPlayerCommand());
    }
    return commands;
  }

  computePlayerDamage(redTeam, playerLevel, stageLevel) {
    let damage = playerLevel - 2;
    let multiplier = 1;
    if (stageLevel >= 10) {
      multiplier = 1.25;
    } else if (stageLevel >= 15) {
      multiplier = 1.5;
    } else if (stageLevel >= 20) {
      multiplier = 2.0;
    } else if (stageLevel >= 25) {
      multiplier = 2.5;
    }

    if (redTeam.size > 0) {
      redTeam.forEach((pokemon, key) => {
        damage += pokemon.stars;
      });
    }
    damage = Math.max(Math.round(damage * multiplier), 0);
    return damage;
  }

  rankPlayers() {
    const rankArray = [];
    this.state.players.forEach((player, key) => {
      if (player.alive) {
        rankArray.push({id: player.id, life: player.life});
      }
    });
    rankArray.sort(function(a, b) {
      return b.life - a.life;
    });
    rankArray.forEach((rankPlayer, index)=>{
      this.state.players.get(rankPlayer.id).rank = index + 1;
      this.state.players.get(rankPlayer.id).exp = XP_PLACE[index];
    });
  }

  computeLife() {
    this.state.players.forEach((player, key) => {
      if (player.simulation.blueTeam.size == 0) {
        if (player.opponentName != 'PVE') {
          if (player.getLastBattleResult() == BATTLE_RESULT.DEFEAT) {
            player.streak = Math.min(player.streak + 1, 5);
          } else {
            player.streak = 0;
          }
        }
        player.addBattleResult(player.opponentName, BATTLE_RESULT.DEFEAT, player.opponentAvatar);
        player.life = Math.max(0, player.life - this.computePlayerDamage(player.simulation.redTeam, player.experienceManager.level, this.state.stageLevel));
      } else if (player.simulation.redTeam.size == 0) {
        if (player.opponentName != 'PVE') {
          if (player.getLastBattleResult() == BATTLE_RESULT.WIN) {
            player.streak = Math.min(player.streak + 1, 5);
          } else {
            player.streak = 0;
          }
        }
        player.addBattleResult(player.opponentName, BATTLE_RESULT.WIN, player.opponentAvatar);
      } else {
        if (player.opponentName != 'PVE') {
          if (player.getLastBattleResult() == BATTLE_RESULT.DRAW) {
            player.streak = Math.min(player.streak + 1, 5);
          } else {
            player.streak = 0;
          }
        }
        player.addBattleResult(player.opponentName, BATTLE_RESULT.DRAW, player.opponentAvatar);
        player.life = Math.max(0, player.life - this.computePlayerDamage(player.simulation.redTeam, player.experienceManager.level, this.state.stageLevel));
      }
    });
  }

  computeIncome() {
    this.state.players.forEach((player, key) => {
      if (player.alive && !player.isBot) {
        player.interest = Math.min(Math.floor(player.money / 10), 5);
        player.money += player.interest;
        player.money += player.streak;
        if (player.getLastBattleResult() == BATTLE_RESULT.WIN) {
          player.money += 1;
        }
        player.money += 5;
        player.experienceManager.addExperience(2);

        player.board.forEach((pokemon, id) => {
          if (pokemon.positionX != 0) {
            if (pokemon.items.count(ITEMS.COIN_AMULET) != 0) {
              player.money += Math.round(Math.random() * 3) * pokemon.items.count(ITEMS.COIN_AMULET);
            }
          }
        });
      }
    });
  }

  checkDeath() {
    this.state.players.forEach((player, key) => {
      if (player.life <= 0) {
        player.alive = false;
      }
    });
  }

  initializePickingPhase() {
    this.state.phase = STATE.PICK;
    this.state.time = process.env.MODE == 'dev' ? 20000 : 30000;

    this.state.players.forEach((player, key) => {
      player.simulation.stop();
      if (player.alive) {
        if (player.opponentName == 'PVE' && player.getLastBattleResult() == BATTLE_RESULT.WIN) {
          const items = ItemFactory.createRandomItems();
          // let items = process.env.MODE == 'dev' ? ItemFactory.createRandomFossils(): ItemFactory.createRandomItem();
          items.forEach((item)=>{
            player.itemsProposition.push(item);
          });
          // const item = ItemFactory.createRandomItem();
          // const item = ItemFactory.createSpecificItems([ITEMS.DELTA_ORB, ITEMS.BLUE_ORB]);
          // player.stuff.add(item);
        }
        player.opponentName = '';
        player.opponentAvatar = '';
        if (!player.shopLocked) {
          if (this.state.stageLevel == 10) {
            this.state.shop.assignFirstMythicalShop(player);
          } else if (this.state.stageLevel == 20) {
            this.state.shop.assignSecondMythicalShop(player);
          } else if (this.state.stageLevel == 2) {
            this.state.shop.assignDittoShop(player);
          } else if (this.state.stageLevel == 3) {
            this.state.shop.assignDittoShop(player);
          } else {
            this.state.shop.assignShop(player);
          }
        } else {
          player.shopLocked = false;
        }
        player.board.forEach((pokemon, key)=>{
          if (pokemon.fossilTimer !== undefined) {
            if (pokemon.fossilTimer == 0) {
              const itemsToAdd = pokemon.items.getAllItems();
              const pokemonEvolved = PokemonFactory.createPokemonFromName(pokemon.evolution);
              for (let i = 0; i < 3; i++) {
                const itemToAdd = itemsToAdd.pop();
                if (itemToAdd) {
                  pokemonEvolved.items.add(itemToAdd);
                }
              }
              pokemonEvolved.positionX = pokemon.positionX;
              pokemonEvolved.positionY = pokemon.positionY;
              player.board.delete(key);
              player.board.set(pokemonEvolved.id, pokemonEvolved);
            } else {
              pokemon.fossilTimer -= 1;
            }
          }
        });
      }
    }); ;
  }

  checkForLazyTeam() {
    const commands = [];

    this.state.players.forEach((player, key) => {
      const teamSize = this.room.getTeamSize(player.board);
      if (teamSize < player.experienceManager.level) {
        const numberOfPokemonsToMove = player.experienceManager.level - teamSize;
        for (let i = 0; i < numberOfPokemonsToMove; i++) {
          const boardSize = this.room.getBoardSizeWithoutDitto(player.board);
          if (boardSize > 0) {
            const coordinate = this.room.getFirstAvailablePositionInTeam(player.id);
            const detail = {
              'id': this.room.getFirstPokemonOnBoard(player.board).id,
              'x': coordinate[0],
              'y': coordinate[1],
              'objType': 'pokemon'
            };
            const client = {
              auth: {
                'uid': key
              }
            };
            commands.push(new OnDragDropCommand().setPayload({'client': client, 'detail': detail}));
          }
        }
      }
    });
    return commands;
  }

  initializeFightingPhase() {
    this.state.phase = STATE.FIGHT;
    this.state.time = 40000;
    this.state.stageLevel += 1;
    this.state.botManager.updateBots();

    this.state.players.forEach((player, key) => {
      if (player.alive) {
        if (player.itemsProposition.length != 0) {
          while (player.itemsProposition.length > 0) {
            player.itemsProposition.pop();
          }
        }
        const stageIndex = NEUTRAL_STAGE.findIndex((stage)=>{
          return stage.turn == this.state.stageLevel;
        });
        if (stageIndex != -1) {
          player.opponentName = 'PVE';
          player.opponentAvatar = NEUTRAL_STAGE[stageIndex].avatar;
          player.simulation.initialize(player.board, PokemonFactory.getNeutralPokemonsByLevelStage(this.state.stageLevel), player.effects.list, []);
        } else {
          const opponentId = this.room.computeRandomOpponent(key);
          if (opponentId) {
            player.simulation.initialize(player.board, this.state.players.get(opponentId).board, player.effects.list, this.state.players.get(opponentId).effects.list);
          }
        }
      }
    });
  }
}

module.exports = {
  OnShopCommand: OnShopCommand,
  OnDragDropCommand: OnDragDropCommand,
  OnSellDropCommand: OnSellDropCommand,
  OnRefreshCommand: OnRefreshCommand,
  OnLockCommand: OnLockCommand,
  OnLevelUpCommand: OnLevelUpCommand,
  OnJoinCommand: OnJoinCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnUpdateCommand: OnUpdateCommand,
  OnUpdatePhaseCommand: OnUpdatePhaseCommand,
  OnItemCommand: OnItemCommand
};
