const Command = require('@colyseus/command').Command;
const {STATE, COST, TYPE, ITEM, RARITY, PKM, BATTLE_RESULT, NEUTRAL_STAGE, BASIC_ITEM, ITEM_RECIPE} = require('../../models/enum');
const Player = require('../../models/colyseus-models/player');
const PokemonFactory = require('../../models/pokemon-factory');
const ItemFactory = require('../../models/item-factory');
const UserMetadata = require('../../models/mongo-models/user-metadata');

class OnShopCommand extends Command {
  execute({id, index}) {
    if (id !== true && index !== true && this.state.players.has(id)) {
      const player = this.state.players.get(id);
      if (player.shop[index]) {
        const name = player.shop[index];
        let pokemon = PokemonFactory.createPokemonFromName(name);

        if (player.money >= pokemon.cost && (this.room.getBoardSize(player.board) < 8 ||
        (this.room.getPossibleEvolution(player.board, pokemon.name) && this.room.getBoardSize(player.board) == 8))) {
          player.money -= pokemon.cost;
          if (pokemon.name == PKM.CASTFORM) {
            if (player.synergies.FIRE > 0 || player.synergies.WATER > 0 || player.synergies.ICE) {
              const rankArray = [{s: TYPE.FIRE, v: player.synergies.FIRE}, {s: TYPE.WATER, v: player.synergies.WATER}, {s: TYPE.ICE, v: player.synergies.ICE}];
              rankArray.sort((a, b)=>{
                return b.v -a.v;
              });
              switch (rankArray[0].s) {
                case TYPE.FIRE:
                  pokemon = PokemonFactory.createPokemonFromName(PKM.CASTFORMSUN);
                  break;
                case TYPE.WATER:
                  pokemon = PokemonFactory.createPokemonFromName(PKM.CASTFORMRAIN);
                  break;
                case TYPE.ICE:
                  pokemon = PokemonFactory.createPokemonFromName(PKM.CASTFORMHAIL);
                  break;
              }
            }
          }
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
        player.items.add(id);
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
    // console.log(detail);
    const commands = [];
    let success = false;
    let dittoReplaced = false;
    const message = {
      'updateBoard': true,
      'updateItems': true
    };
    const playerId = client.auth.uid; ;
    if (this.state.players.has(playerId)) {
      const player = this.state.players.get(playerId);
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
              const replaceDitto = PokemonFactory.createPokemonFromName(PokemonFactory.getPokemonBaseEvolution(pokemonToClone.name));
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

        if (!success && client.send) {
          client.send('DragDropFailed', message);
        }
        if (dittoReplaced) {
          this.room.updateEvolution(playerId);
          this.room.updateEvolution(playerId);
        }
      }
      if (detail.objType == 'item') {
        message.updateBoard = false;
        message.updateItems = true;

        const item = detail.id;

        if (!player.items.has(item) && !detail.bypass) {
          client.send('DragDropFailed', message);
          return;
        }

        const x = parseInt(detail.x);
        const y = parseInt(detail.y);

        const [pokemon, id] = player.getPokemonAt(x, y);

        if (pokemon === null) {
          client.send('DragDropFailed', message);
          return;
        }
        // check if full items
        if (pokemon.items.size >= 3) {
          if (Object.keys(BASIC_ITEM).includes(item)) {
            let includesBasicItem = false;
            pokemon.items.forEach((i)=>{
              if (Object.keys(BASIC_ITEM).includes(i)) {
                includesBasicItem = true;
              }
            });
          } else {
            client.send('DragDropFailed', message);
            return;
          }
        }

        // SPECIAL CASES: create a new pokemon on item equip
        let newItemPokemon = null;
        let equipAfterTransform = true;
        switch (pokemon.name) {
          case PKM.EEVEE:
            switch (item) {
              case ITEM.WATER_STONE:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.VAPOREON);
                break;
              case ITEM.FIRE_STONE:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.FLAREON);
                break;
              case ITEM.THUNDER_STONE:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.JOLTEON);
                break;
              case ITEM.DUSK_STONE:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.UMBREON);
                break;
              case ITEM.MOON_STONE:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.SYLVEON);
                break;
              case ITEM.LEAF_STONE:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.LEAFEON);
                break;
              case ITEM.DAWN_STONE:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.ESPEON);
                break;
              case ITEM.ICY_ROCK:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.GLACEON);
                break;
            }
            break;
          case PKM.DITTO:
            equipAfterTransform = false;
            switch (item) {
              case ITEM.FOSSIL_STONE:
                newItemPokemon = PokemonFactory.transformPokemon(pokemon, PokemonFactory.getRandomFossil(player.board));
                break;
              default:
                client.send('DragDropFailed', message);
                break;
            }
            break;
          case PKM.GROUDON:
            if (item == ITEM.RED_ORB) {
              newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.PRIMALGROUDON);
            }
            break;
          case PKM.KYOGRE:
            if (item == ITEM.BLUE_ORB) {
              newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.PRIMALKYOGRE);
            }
            break;
          case PKM.RAYQUAZA:
            if (item == ITEM.DELTA_ORB) {
              newItemPokemon = PokemonFactory.transformPokemon(pokemon, PKM.MEGARAYQUAZA);
            }
            break;
        }

        if (newItemPokemon) {
          // delete the extra pokemons
          player.board.delete(id);
          player.board.set(newItemPokemon.id, newItemPokemon);
          player.synergies.update(player.board);
          player.effects.update(player.synergies);
          player.boardSize = this.room.getTeamSize(player.board);
          if (equipAfterTransform) {
            newItemPokemon.items.add(item);
          }
          player.items.delete(item);
          return;
        }

        // regular equip
        switch (item) {
          case ITEM.WATER_STONE:
            pokemon.types.push(TYPE.WATER);
            break;
          case ITEM.FIRE_STONE:
            pokemon.types.push(TYPE.FIRE);
            break;
          case ITEM.THUNDER_STONE:
            pokemon.types.push(TYPE.ELECTRIC);
            break;
          case ITEM.DUSK_STONE:
            pokemon.types.push(TYPE.DARK);
            break;
          case ITEM.MOON_STONE:
            pokemon.types.push(TYPE.FAIRY);
            break;
          case ITEM.LEAF_STONE:
            pokemon.types.push(TYPE.GRASS);
            break;
          case ITEM.DAWN_STONE:
            pokemon.types.push(TYPE.PSYCHIC);
            break;
          case ITEM.ICY_ROCK:
            pokemon.types.push(TYPE.ICE);
            break;
          case ITEM.OLD_AMBER:
            pokemon.types.push(TYPE.FOSSIL);
            break;
        }

        if (Object.keys(BASIC_ITEM).includes(item)) {
          let itemToCombine;
          pokemon.items.forEach( (i)=>{
            if (Object.keys(BASIC_ITEM).includes(i)) {
              itemToCombine = i;
            }
          });
          if (itemToCombine) {
            Object.keys(ITEM_RECIPE).forEach((name) => {
              const recipe = ITEM_RECIPE[name];
              if ((recipe[0] == itemToCombine && recipe[1] == item) || (recipe[0] == item && recipe[1] == itemToCombine)) {
                pokemon.items.delete(itemToCombine);
                player.items.delete(item);
                const detail = {
                  'id': name,
                  'x': JSON.stringify(pokemon.positionX),
                  'y': JSON.stringify(pokemon.positionY),
                  'objType': 'item',
                  'bypass': true
                };
                commands.push(new OnDragDropCommand().setPayload({'client': client, 'detail': detail}));
              }
            });
          } else {
            pokemon.items.add(item);
            player.items.delete(item);
          }
        } else {
          if (pokemon.items.has(item)) {
            client.send('DragDropFailed', message);
            return;
          } else {
            pokemon.items.add(item);
            player.items.delete(item);
          }
        }
      }
      if (detail.objType == 'combine') {
        message.updateBoard = false;
        message.updateItems = true;

        const item = detail.id;
        const player = this.state.players.get(playerId);
        const itemToCombine = player.items.at(parseInt(detail.y));

        console.log(item, itemToCombine);

        if (!player.items.has(item) || !Object.keys(ITEM).includes(itemToCombine)) {
          client.send('DragDropFailed', message);
          return;
        }

        if (item == itemToCombine) {
          let count = 0;
          player.items.forEach((i)=>{
            if (i == item) {
              count ++;
            }
          });
          if (count < 2) {
            client.send('DragDropFailed', message);
            return;
          }
        }

        let crafted = false;
        Object.keys(ITEM_RECIPE).forEach((name) => {
          const recipe = ITEM_RECIPE[name];
          if ((recipe[0] == itemToCombine && recipe[1] == item) || (recipe[0] == item && recipe[1] == itemToCombine)) {
            player.items.delete(itemToCombine);
            player.items.delete(item);
            player.items.add(name);
            crafted = true;
          }
        });
        if (!crafted) {
          client.send('DragDropFailed', message);
        }
      }
      player.synergies.update(player.board);
      player.effects.update(player.synergies);
    }
    if (commands.length > 0) {
      return commands;
    }
  }
}

class OnSellDropCommand extends Command {
  execute({client, detail}) {
    if (this.state.players.has(client.auth.uid) &&
      this.state.players.get(client.auth.uid).board.has(detail.pokemonId)) {
      const pokemon = this.state.players.get(client.auth.uid).board.get(detail.pokemonId);
      const player = this.state.players.get(client.auth.uid);

      if (PokemonFactory.getPokemonBaseEvolution(pokemon.name) == PKM.EEVEE) {
        player.money += COST[pokemon.rarity];
      } else if (pokemon.types.includes(TYPE.FOSSIL)) {
        player.money += 5 + COST[pokemon.rarity] * pokemon.stars;
      } else {
        player.money += COST[pokemon.rarity] * pokemon.stars;
      }

      pokemon.items.forEach((it)=>{
        player.items.add(it);
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
      if (player.money >= 4 && player.experienceManager.canLevel()) {
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
            this.state.players.size + 1
        ));
        if (client && client.auth && client.auth.displayName) {
          console.log(`${client.auth.displayName} ${client.id} join game room`);
        }

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
      this.computeStreak();
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
      multiplier = 3;
    } else if (stageLevel >= 30) {
      multiplier = 5;
    } else if (stageLevel >= 35) {
      multiplier = 8;
    }
    damage = damage * multiplier;
    if (redTeam.size > 0) {
      redTeam.forEach((pokemon, key) => {
        damage += pokemon.stars;
      });
    }
    damage = Math.max(Math.round(damage), 0);
    return damage;
  }

  rankPlayers() {
    const rankArray = [];
    this.state.players.forEach((player, key) => {
      if (!player.alive) {
        return;
      }

      rankArray.push({
        id: player.id,
        life: player.life,
        level: player.experienceManager.level
      });
    });

    const sortPlayers = (a, b) => {
      let diff = b.life - a.life;
      if (diff == 0) {
        diff = b.level - a.level;
      }
      return diff;
    };

    rankArray.sort(sortPlayers);

    rankArray.forEach((rankPlayer, index)=>{
      this.state.players.get(rankPlayer.id).rank = index + 1;
    });
  }

  computeLife() {
    const isPVE = this.checkForPVE();
    this.state.players.forEach((player, key) => {
      if (player.alive) {
        const currentResult = player.getCurrentBattleResult();

        if (currentResult == BATTLE_RESULT.DEFEAT || currentResult == BATTLE_RESULT.DRAW) {
          player.life = player.life - this.computePlayerDamage(player.simulation.redTeam, player.experienceManager.level, this.state.stageLevel);
        }
        player.addBattleResult(player.opponentName, currentResult, player.opponentAvatar, isPVE);
      }
    });
  }

  computeStreak() {
    if (this.checkForPVE()) {
      return;
    }

    this.state.players.forEach((player, key) => {
      if (!player.alive) {
        return;
      }
      const currentResult = player.getCurrentBattleResult();
      const lastPlayerResult = player.getLastPlayerBattleResult();

      if (currentResult == BATTLE_RESULT.DRAW || currentResult != lastPlayerResult) {
        player.streak = 0;
      } else {
        player.streak = Math.min(player.streak + 1, 5);
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
      }
    });
  }

  checkDeath() {
    this.state.players.forEach((player, key) => {
      if (player.life <= 0) {
        player.life = 0;
        player.alive = false;
      }
    });
  }

  initializePickingPhase() {
    this.state.phase = STATE.PICK;
    this.state.time = process.env.MODE == 'dev' ? 20000 : 30000;

    const isPVE = this.checkForPVE();

    this.state.players.forEach((player, key) => {
      player.simulation.stop();
      if (player.alive) {
        if (player.isBot) {
          player.experienceManager.level = Math.min(9, Math.round(this.state.stageLevel/2));
        }
        if (isPVE && player.getLastBattleResult() == BATTLE_RESULT.WIN) {
          const items = ItemFactory.createRandomItems();
          // let items = process.env.MODE == 'dev' ? ItemFactory.createRandomFossils(): ItemFactory.createRandomItem();
          items.forEach((item)=>{
            player.itemsProposition.push(item);
          });
          // const item = ItemFactory.createRandomItem();
          // const item = ItemFactory.createSpecificItems([ITEMS.BLUE_ORB]);
          player.items.add(ItemFactory.createBasicRandomItem());
        }
        player.opponentName = '';

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
              const pokemonEvolved = PokemonFactory.createPokemonFromName(pokemon.evolution);
              pokemon.items.forEach((i)=>{
                pokemonEvolved.items.add(i);
                switch (i) {
                    case ITEM.WATER_STONE:
                      pokemonEvolved.types.push(TYPE.WATER);
                      break;
                    case ITEM.FIRE_STONE:
                      pokemonEvolved.types.push(TYPE.FIRE);
                      break;
                    case ITEM.THUNDER_STONE:
                      pokemonEvolved.types.push(TYPE.ELECTRIC);
                      break;
                    case ITEM.DUSK_STONE:
                      pokemonEvolved.types.push(TYPE.DARK);
                      break;
                    case ITEM.MOON_STONE:
                      pokemonEvolved.types.push(TYPE.FAIRY);
                      break;
                    case ITEM.LEAF_STONE:
                      pokemonEvolved.types.push(TYPE.GRASS);
                      break;
                    case ITEM.DAWN_STONE:
                      pokemonEvolved.types.push(TYPE.PSYCHIC);
                      break;
                    case ITEM.ICY_ROCK:
                      pokemonEvolved.types.push(TYPE.ICE);
                      break;
                    case ITEM.OLD_AMBER:
                      pokemonEvolved.types.push(TYPE.FOSSIL);
                      break;
                }
              });
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

  getPVEIndex(stageLevel) {
    const result = NEUTRAL_STAGE.findIndex((stage)=>{
      return stage.turn == stageLevel;
    });

    return result;
  }

  checkForPVE() {
    return (this.getPVEIndex(this.state.stageLevel) >= 0);
  }

  initializeFightingPhase() {
    this.state.phase = STATE.FIGHT;
    this.state.time = 40000;
    this.state.stageLevel += 1;
    this.state.botManager.updateBots();

    const stageIndex = this.getPVEIndex(this.state.stageLevel);

    this.state.players.forEach((player, key) => {
      if (player.alive) {
        if (player.itemsProposition.length != 0) {
          if (player.itemsProposition.length == 3) {
            player.items.add(player.itemsProposition.pop());
          }
          while (player.itemsProposition.length > 0) {
            player.itemsProposition.pop();
          }
        }

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
