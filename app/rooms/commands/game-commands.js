const Command = require('@colyseus/command').Command;
const {STATE, COST, TYPE, EFFECTS, ITEMS, RARITY_HP_COST} = require('../../models/enum');
const Player = require('../../models/player');
const PokemonFactory = require('../../models/pokemon-factory');
const ItemFactory = require('../../models/item-factory');

class OnShopCommand extends Command {
  execute({sessionId, index}) {
    if (this.state.players.has(sessionId)) {
      let player = this.state.players.get(sessionId);
      if (player.shop[index]) {
        let name = player.shop[index];
        let pokemon = PokemonFactory.createPokemonFromName(name);
        if (player.money >= pokemon.cost && (UtilsCommand.getBoardSize(player.board) < 8 
        || (UtilsCommand.getPossibleEvolution(player.board, pokemon.name) && UtilsCommand.getBoardSize(player.board) == 8))) {
          player.money -= pokemon.cost;
          pokemon.positionX = this.room.getFirstAvailablePositionInBoard(player.id);
          pokemon.positionY = 0;
          player.board.set(pokemon.id, pokemon);
          player.shop[index] = '';
          return [new OnEvolutionCommand().setPayload(sessionId), new OnEvolutionCommand().setPayload(sessionId)];
        }
      }
    }
  }
}

class OnDragDropCommand extends Command {
  execute({client, detail}) {
    let success = false;
    let dittoReplaced = false;
    let message = {
      'updateBoard':true,
      'updateItems':true,
      'field':detail.place
    }
    if (this.state.players.has(client.sessionId)) {
      if(detail.objType == 'pokemon'){
        message.updateItems = false;
        if (this.state.players.get(client.sessionId).board.has(detail.id)) {
          let pokemon = this.state.players.get(client.sessionId).board.get(detail.id);
          const x = parseInt(detail.x);
          const y = parseInt(detail.y);
          if(pokemon.name == 'ditto'){
            let pokemonToClone = this.room.getPokemonByPosition(client.sessionId, x, y);
            if(pokemonToClone){
              dittoReplaced = true;
              const replaceDitto = PokemonFactory.createPokemonFromName(PokemonFactory.getPokemonFamily(pokemonToClone.name));
              this.state.players.get(client.sessionId).board.delete(detail.id);
              const position = this.room.getFirstAvailablePositionInBoard(client.sessionId);
              if(position !== undefined){
                replaceDitto.positionX = position;
                replaceDitto.positionY = 0;
                this.state.players.get(client.sessionId).board.set(replaceDitto.id, replaceDitto);
                success = true;
                message.updateBoard = false;
              }
            }
          }
          else{
            if ( y == 0 && pokemon.positionY == 0) {
              this.room.swap(client.sessionId, pokemon, x, y);
              success = true;
            } else if (this.state.phase == STATE.PICK) {
              const teamSize = UtilsCommand.getTeamSize(this.state.players.get(client.sessionId).board);
              if (teamSize < this.state.players.get(client.sessionId).experienceManager.level) {
                this.room.swap(client.sessionId, pokemon, x, y);
                success = true;
              } else if (teamSize == this.state.players.get(client.sessionId).experienceManager.level) {
                const empty = this.room.isPositionEmpty(client.sessionId, x, y);
                if (!empty) {
                  this.room.swap(client.sessionId, pokemon, x, y);
                  success = true;
                  message.updateBoard = false;
                } else {
                  if ((pokemon.positionY != 0 && y != 0) || y == 0) {
                    this.room.swap(client.sessionId, pokemon, x, y);
                    success = true;
                    message.updateBoard = false;
                  }
                }
              }
            }
          }
          this.state.players.get(client.sessionId).synergies.update(this.state.players.get(client.sessionId).board);
          this.state.players.get(client.sessionId).effects.update(this.state.players.get(client.sessionId).synergies);
          this.state.players.get(client.sessionId).boardSize = UtilsCommand.getTeamSize(this.state.players.get(client.sessionId).board);
        }
      }
      if(detail.objType == 'item'){
        message.updateBoard = false;
        let item = this.state.players.get(client.sessionId).stuff[detail.place];
        if ( item ) {
          const x = parseInt(detail.x);
          const y = parseInt(detail.y);
          this.state.players.get(client.sessionId).board.forEach((pokemon, id) => {
            if(pokemon.positionX == x && pokemon.positionY == y && pokemon.items.length < 3){
              let evolve = false;
              if(pokemon.name == 'eevee' && item == ITEMS.WATER_STONE){
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                const eevolution = PokemonFactory.createPokemonFromName('vaporeon');
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items.item0 = pokemon.items.item0;
                eevolution.items.item1 = pokemon.items.item1;
                eevolution.items.item2 = pokemon.items.item2;
                //eevolution.items.add(item);
                this.state.players.get(client.sessionId).board.delete(id);
                this.state.players.get(client.sessionId).board.set(eevolution.id, eevolution);
                this.state.players.get(client.sessionId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              else if(pokemon.name == 'eevee' && item == ITEMS.FIRE_STONE){
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                const eevolution = PokemonFactory.createPokemonFromName('flareon');
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items.item0 = pokemon.items.item0;
                eevolution.items.item1 = pokemon.items.item1;
                eevolution.items.item2 = pokemon.items.item2;
                //eevolution.items.add(item);
                this.state.players.get(client.sessionId).board.delete(id);
                this.state.players.get(client.sessionId).board.set(eevolution.id, eevolution);
                this.state.players.get(client.sessionId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              else if(pokemon.name == 'eevee' && item == ITEMS.THUNDER_STONE){
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                const eevolution = PokemonFactory.createPokemonFromName('jolteon');
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items.item0 = pokemon.items.item0;
                eevolution.items.item1 = pokemon.items.item1;
                eevolution.items.item2 = pokemon.items.item2;
                //eevolution.items.add(item);
                this.state.players.get(client.sessionId).board.delete(id);
                this.state.players.get(client.sessionId).board.set(eevolution.id, eevolution);
                this.state.players.get(client.sessionId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              else if(pokemon.name == 'eevee' && item == ITEMS.NIGHT_STONE){
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                const eevolution = PokemonFactory.createPokemonFromName('umbreon');
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items.item0 = pokemon.items.item0;
                eevolution.items.item1 = pokemon.items.item1;
                eevolution.items.item2 = pokemon.items.item2;
                //eevolution.items.add(item);
                this.state.players.get(client.sessionId).board.delete(id);
                this.state.players.get(client.sessionId).board.set(eevolution.id, eevolution);
                this.state.players.get(client.sessionId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              else if(pokemon.name == 'eevee' && item == ITEMS.MOON_STONE){
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                const eevolution = PokemonFactory.createPokemonFromName('sylveon');
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items.item0 = pokemon.items.item0;
                eevolution.items.item1 = pokemon.items.item1;
                eevolution.items.item2 = pokemon.items.item2;
                //eevolution.items.add(item);
                this.state.players.get(client.sessionId).board.delete(id);
                this.state.players.get(client.sessionId).board.set(eevolution.id, eevolution);
                this.state.players.get(client.sessionId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              else if (pokemon.name == 'eevee' && item == ITEMS.LEAF_STONE){
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                const eevolution = PokemonFactory.createPokemonFromName('leafon');
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items.item0 = pokemon.items.item0;
                eevolution.items.item1 = pokemon.items.item1;
                eevolution.items.item2 = pokemon.items.item2;
                //eevolution.items.add(item);
                this.state.players.get(client.sessionId).board.delete(id);
                this.state.players.get(client.sessionId).board.set(eevolution.id, eevolution);
                this.state.players.get(client.sessionId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              else if(pokemon.name == 'eevee' && item == ITEMS.DAWN_STONE){
                evolve = true;
                const x = pokemon.positionX;
                const y = pokemon.positionY;
                const eevolution = PokemonFactory.createPokemonFromName('espeon');
                eevolution.positionX = x;
                eevolution.positionY = y;
                eevolution.items.item0 = pokemon.items.item0;
                eevolution.items.item1 = pokemon.items.item1;
                eevolution.items.item2 = pokemon.items.item2;
                //eevolution.items.add(item);
                this.state.players.get(client.sessionId).board.delete(id);
                this.state.players.get(client.sessionId).board.set(eevolution.id, eevolution);
                this.state.players.get(client.sessionId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              else{
                pokemon.items.add(item);
                this.state.players.get(client.sessionId).stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              if (evolve) {
                this.state.players.get(client.sessionId).synergies.update(this.state.players.get(client.sessionId).board);
                this.state.players.get(client.sessionId).effects.update(this.state.players.get(client.sessionId).synergies);
                this.state.players.get(client.sessionId).boardSize = UtilsCommand.getTeamSize(this.state.players.get(client.sessionId).board);
              }
            }
          });
        }
      }
    }
    if (!success) {
      client.send('DragDropFailed', message);
    }
    if(dittoReplaced){
      return [new OnEvolutionCommand().setPayload(client.sessionId), new OnEvolutionCommand().setPayload(client.sessionId)];
    }
  }
}

class OnSellDropCommand extends Command {
  execute({client, detail}) {
    if (this.state.players.has(client.sessionId) &&
      this.state.players.get(client.sessionId).board.has(detail.pokemonId)) {

      let pokemon = this.state.players.get(client.sessionId).board.get(detail.pokemonId);
      let player = this.state.players.get(client.sessionId);
      player.money += COST[pokemon.rarity] * pokemon.stars;

      if(pokemon.items.item0 != ''){
        player.stuff.add(pokemon.items.item0);
      }
      if(pokemon.items.item1 != ''){
        player.stuff.add(pokemon.items.item1);
      }
      if(pokemon.items.item2 != ''){
        player.stuff.add(pokemon.items.item2);
      }
      
      player.board.delete(detail.pokemonId);

      player.synergies.update(player.board);
      player.effects.update(player.synergies);
      player.boardSize = UtilsCommand.getTeamSize(player.board);
    }
  }
}

class OnRefreshCommand extends Command {
  execute(sessionId) {
    if (this.state.players.has(sessionId)) {
      let player = this.state.players.get(sessionId);
      if (player.money >= 2) {
        this.state.shop.detachShop(player);
        this.state.shop.assignShop(player);
        player.money -= 2;
      }
    }
  }
}

class OnLockCommand extends Command {
  execute(sessionId) {
    if (this.state.players.has(sessionId)) {
      this.state.players.get(sessionId).shopLocked = !this.state.players.get(sessionId).shopLocked;
    }
  }
}

class OnLevelUpCommand extends Command {
  execute(sessionId) {
    if (this.state.players.has(sessionId)) {
      let player = this.state.players.get(sessionId);
      if (player.money >= 4) {
        player.experienceManager.addExperience(4);
        player.money -= 4;
      }
    }
  }
}

class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    this.state.players.set(client.sessionId, new Player(client.sessionId, auth.email.slice(0, auth.email.indexOf('@')),client.auth.metadata.avatar, false));
    this.state.shop.assignShop(this.state.players.get(client.sessionId));
  }
}

class OnLeaveCommand extends Command {
  execute({client, consented}) {
    this.state.shop.detachShop(this.state.players.get(client.sessionId));
    this.state.players.delete(client.sessionId);
  }
}

class OnUpdateCommand extends Command {
  execute(deltaTime) {
    if(deltaTime){
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

class OnKickPlayerCommand extends Command {
  execute() {
    this.room.broadcast('kick-out');
  }
}

class UtilsCommand extends Command {
  static getBoardSize(board) {
    let boardSize = 0;

    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0) {
        boardSize ++;
      }
    });

    return boardSize;
  }

  static getBoardSizeWithoutDitto(board){
    let boardSize = 0;

    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0 && pokemon.name != 'ditto') {
        boardSize ++;
      }
    });

    return boardSize;
  }

  static getPossibleEvolution(board, name){
    let count = 0;

    board.forEach((pokemon, key) => {
      if(pokemon.name == name){
        count ++;
      }
  });
    return (count >= 2);
  }

  static getFirstPokemonOnBoard(board) {
    let pkm;
    let found = false;
    board.forEach((pokemon, key) => {
      if (pokemon.positionY == 0 && pokemon.name != 'ditto' && !found) {
        found = true;
        pkm = pokemon;
      }
    });
    return pkm;
  }

  static getTeamSize(board) {
    let size = 0;

    board.forEach((pokemon, key) => {
      if (pokemon.positionY != 0) {
        size ++;
      }
    });

    return size;
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
      this.checkDeath();
      const kickCommands = this.checkEndGame();
      if(kickCommands.length != 0){
        return kickCommands;
      }
      this.computeIncome();
      this.initializePickingPhase();
    }
  }

  checkEndGame(){
    let commands = [];
    let numberOfPlayersAlive = 0;

    this.state.players.forEach((player, key) => {
      if (player.alive) {
        numberOfPlayersAlive += 1;
      }
    });

    if(numberOfPlayersAlive <= 1 && !this.state.gameFinished){
      this.state.gameFinished = true;
      commands.push(new OnKickPlayerCommand());
    }
    return commands;
  }

  computePlayerDamage(redTeam, playerLevel){
    let damage = playerLevel - 2;
    if(redTeam.size > 0){

      redTeam.forEach((pokemon, key) => {
        damage += pokemon.stars;
      });

    }
    damage = Math.max(damage, 0);
    return damage;
  }
/*
  getStageLevelDamage(stageLevel){
    let damage = 0;
    let stageLevelFloor = Math.floor(stageLevel/5);
    if(stageLevelFloor == 0 || stageLevelFloor == 1){
      damage = 1;
    }
    else if(stageLevelFloor == 2 || stageLevelFloor == 3){
      damage = 2;
    }
    else if(stageLevelFloor == 4){
      damage = 3;
    }
    else if(stageLevelFloor == 5){
      damage = 4;
    }
    else if(stageLevelFloor == 6){
      damage = 5;
    }
    else if (stageLevelFloor == 7){
      damage = 8;
    }
    else{
      damage = 15;
    }
    return damage;
  }
*/
  computeLife() {
    this.state.players.forEach((player, key) => {
      if (player.simulation.blueTeam.size == 0) {
        if (player.lastBattleResult == 'Defeat') {
          player.streak = Math.min(player.streak + 1, 5);
        } else {
          player.streak = 0;
        }
        player.lastBattleResult = 'Defeat';
        player.life = Math.max(0, player.life - this.computePlayerDamage(player.simulation.redTeam, player.experienceManager.level));
      } else if (player.simulation.redTeam.size == 0) {
        if (player.lastBattleResult == 'Win') {
          player.streak = Math.min(player.streak + 1, 5);
        } else {
          player.streak = 0;
        }
        player.lastBattleResult = 'Win';
      } else {
        if (player.lastBattleResult == 'Draw') {
          player.streak = Math.min(player.streak + 1, 5);
        } else {
          player.streak = 0;
        }
        player.lastBattleResult = 'Draw';
        player.life = Math.max(0, player.life - this.computePlayerDamage(player.simulation.redTeam, player.experienceManager.level));
      }
    });
  }

  computeIncome() {
    this.state.players.forEach((player, key) => {
      if(player.alive){
        player.interest = Math.min(Math.floor(player.money / 5), 6);
        player.money += player.interest;
        player.money += player.streak;
        if (player.lastBattleResult == 'Win') {
          player.money += 1;
        }
        player.money += 5;
        player.experienceManager.addExperience(2);

        player.board.forEach((pokemon, id) => {
          if(pokemon.positionX != 0){
            if(pokemon.items.count(ITEMS.COIN_AMULET) != 0){
              player.money += Math.round(Math.random() * 5) * pokemon.items.count(ITEMS.COIN_AMULET);
            }
          }
        })
      }
    });
  }

  checkDeath() {

    this.state.players.forEach((player, key) => {
      if (player.life <= 0) {
        player.alive = false;
        player.board.forEach((pokemon, id) => {
          player.board.delete(id);
        })
      }
    });
  }

  initializePickingPhase() {
    this.state.phase = STATE.PICK;
    this.state.time = 30000;

    this.state.players.forEach((player, key) => {
      player.simulation.stop();
      if(player.alive){
        if(player.opponentName == 'PVE' && player.lastBattleResult == 'Win'){
          let item = ItemFactory.createRandomItem();
          player.stuff.add(item);
        }
        player.opponentName = '';
        if (!player.shopLocked) {
          this.state.shop.detachShop(player);
          this.state.shop.assignShop(player);
        } else {
          player.shopLocked = false;
        }
      }
    });
  }

  checkForLazyTeam() {
    const commands = [];

    this.state.players.forEach((player, key) => {
      const teamSize = UtilsCommand.getTeamSize(player.board);
      if (teamSize < player.experienceManager.level) {
        const numberOfPokemonsToMove = player.experienceManager.level - teamSize;
        for (let i = 0; i < numberOfPokemonsToMove; i++) {
          const boardSize = UtilsCommand.getBoardSizeWithoutDitto(player.board);
          if (boardSize > 0) {
            const coordinate = this.room.getFirstAvailablePositionInTeam(player.id);
            const detail = {
              'id': UtilsCommand.getFirstPokemonOnBoard(player.board).id,
              'x': coordinate[0],
              'y': coordinate[1],
              'objType':'pokemon'
            };
            const client = {
              'sessionId': key
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
    this.state.time = 30000;
    this.state.stageLevel += 1;
    this.state.botManager.updateBots();

    this.state.players.forEach((player, key) => {
      if(player.alive){
        if (this.state.neutralStages.includes(this.state.stageLevel)) {
          player.opponentName = 'PVE';
          player.simulation.initialize(player.board, PokemonFactory.getNeutralPokemonsByLevelStage(this.state.stageLevel), player.effects.list, []);
        } else {
          const opponentId = this.room.getRandomOpponent(key);
          player.opponentName = this.state.players.get(opponentId).name;
          player.simulation.initialize(player.board, this.state.players.get(opponentId).board, player.effects.list, this.state.players.get(opponentId).effects.list);
        }
      }
    });
  }
}

class OnEvolutionCommand extends Command {
  execute(sessionId) {
    let evolve = false;
    let itemsToAdd = [];
    let player = this.state.players.get(sessionId);
    player.board.forEach((pokemon, key) => {
      let count = 0;
      const pokemonEvolutionName = pokemon.evolution;

      if (pokemonEvolutionName != '') {

        player.board.forEach((pkm, id) => {
          if ( pkm.index == pokemon.index) {
            count += 1;
          }
        });

        if (count == 3 || (pokemon.types.includes(TYPE.BUG) && count == 2 && player.effects.list.includes(EFFECTS.SWARM))) {
          
          let x;
          let y;

          player.board.forEach((pkm, id) => {
            if ( pkm.index == pokemon.index && count >= 0) {
              if(x !== undefined && y !== undefined){
                if(pkm.positionY >= y){
                  if(pkm.positionY !== undefined){
                    y = pkm.positionY;
                  }
                  if(pkm.positionX !== undefined){
                    x = pkm.positionX;
                  }
                }
              }
              else{
                if(pkm.positionY !== undefined){
                  y = pkm.positionY;
                }
                if(pkm.positionX !== undefined){
                  x = pkm.positionX;
                }
              }
              let temp =pkm.items.getAllItems();
              temp.forEach((el)=>{
                itemsToAdd.push(el);
              });
              player.board.delete(id);
              count -= 1;
            }
          });
          const pokemonEvolved = PokemonFactory.createPokemonFromName(pokemonEvolutionName);
          for (let i = 0; i < 3; i++) {
            let itemToAdd = itemsToAdd.pop();
            if(itemToAdd){
              pokemonEvolved.items.add(itemToAdd);
            }
          }
          itemsToAdd.forEach( (item) =>{
            player.stuff.add(item);
          });
          pokemonEvolved.positionX = x;
          pokemonEvolved.positionY = y;
          player.board[pokemonEvolved.id] = pokemonEvolved;
          evolve = true;
        }
      }
    });

    if (evolve) {
      player.synergies.update(player.board);
      player.effects.update(player.synergies);
      player.boardSize = UtilsCommand.getTeamSize(player.board);
    }
    return evolve;
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
  OnEvolutionCommand: OnEvolutionCommand,
  OnUpdatePhaseCommand: OnUpdatePhaseCommand
};
