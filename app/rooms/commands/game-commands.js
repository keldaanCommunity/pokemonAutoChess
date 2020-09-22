const Command = require('@colyseus/command').Command;
const {Pokemon} = require('../../models/pokemon');
const {STATE, COST, TYPE, EFFECTS, ITEMS} = require('../../models/enum');
const Player = require('../../models/player');
const PokemonFactory = require('../../models/pokemon-factory');
const Simulation = require('../../core/simulation');
const ItemFactory = require('../../models/item-factory');

class OnShopCommand extends Command {
  execute({sessionId, pokemonId}) {
    if (sessionId in this.state.players) {
      const player = this.state.players[sessionId];
      if (pokemonId in player.shop) {
        const pokemon = player.shop[pokemonId];
        if (player.money >= pokemon.cost && (UtilsCommand.getBoardSize(player.board) < 9 
        || (UtilsCommand.getPossibleEvolution(player.board, pokemon.name) && UtilsCommand.getBoardSize(player.board) == 9))) {
          player.money -= player.shop[pokemonId].cost;
          player.board[pokemonId] = Object.assign(new Pokemon(), player.shop[pokemonId]);
          delete player.shop[pokemonId];
          player.board[pokemonId].positionX = this.room.getFirstAvailablePositionInBoard(player.board);
          player.board[pokemonId].positionY = 0;
          return [new OnEvolutionCommand().setPayload(sessionId), new OnEvolutionCommand().setPayload(sessionId)];
        }
      }
    }
  }
}

class OnDragDropCommand extends Command {
  execute({client, detail}) {
    let success = false;
    let message = {
      'updateBoard':true,
      'updateItems':true,
      'field':detail.place
    }
    if (client.sessionId in this.state.players) {
      if(detail.objType == 'pokemon'){
        message.updateItems = false;
        if (detail.id in this.state.players[client.sessionId].board) {
          const pokemon = this.state.players[client.sessionId].board[detail.id];
          const x = parseInt(detail.x);
          const y = parseInt(detail.y);
  
          if ( y == 0 && pokemon.positionY == 0) {
            this.room.swap(this.state.players[client.sessionId].board, pokemon, x, y);
            success = true;
          } else if (this.state.phase == STATE.PICK) {
            const teamSize = UtilsCommand.getTeamSize(this.state.players[client.sessionId].board);
            if (teamSize < this.state.players[client.sessionId].experienceManager.level) {
              this.room.swap(this.state.players[client.sessionId].board, pokemon, x, y);
              success = true;
            } else if (teamSize == this.state.players[client.sessionId].experienceManager.level) {
              const empty = this.room.isPositionEmpty(this.state.players[client.sessionId].board, x, y);
              if (!empty) {
                this.room.swap(this.state.players[client.sessionId].board, pokemon, x, y);
                success = true;
                message.updateBoard = false;
              } else {
                if ((pokemon.positionY != 0 && y != 0) || y == 0) {
                  this.room.swap(this.state.players[client.sessionId].board, pokemon, x, y);
                  success = true;
                  message.updateBoard = false;
                }
              }
            }
          }
          this.state.players[client.sessionId].synergies.update(this.state.players[client.sessionId].board);
          this.state.players[client.sessionId].effects.update(this.state.players[client.sessionId].synergies);
          this.state.players[client.sessionId].boardSize = UtilsCommand.getTeamSize(this.state.players[client.sessionId].board);
        }
      }
      if(detail.objType == 'item'){
        message.updateBoard = false;
        let item = this.state.players[client.sessionId].stuff[detail.place];
        if ( item ) {
          const x = parseInt(detail.x);
          const y = parseInt(detail.y);
          for (let id in this.state.players[client.sessionId].board){
            let pokemon = this.state.players[client.sessionId].board[id];
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
                eevolution.items.add(item);
                delete this.state.players[client.sessionId].board[id];
                this.state.players[client.sessionId].board[eevolution.id] = eevolution;
                this.state.players[client.sessionId].stuff.remove(item);
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
                eevolution.items.add(item);
                delete this.state.players[client.sessionId].board[id];
                this.state.players[client.sessionId].board[eevolution.id] = eevolution;
                this.state.players[client.sessionId].stuff.remove(item);
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
                eevolution.items.add(item);
                delete this.state.players[client.sessionId].board[id];
                this.state.players[client.sessionId].board[eevolution.id] = eevolution;
                this.state.players[client.sessionId].stuff.remove(item);
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
                eevolution.items.add(item);
                delete this.state.players[client.sessionId].board[id];
                this.state.players[client.sessionId].board[eevolution.id] = eevolution;
                this.state.players[client.sessionId].stuff.remove(item);
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
                eevolution.items.add(item);
                delete this.state.players[client.sessionId].board[id];
                this.state.players[client.sessionId].board[eevolution.id] = eevolution;
                this.state.players[client.sessionId].stuff.remove(item);
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
                eevolution.items.add(item);
                delete this.state.players[client.sessionId].board[id];
                this.state.players[client.sessionId].board[eevolution.id] = eevolution;
                this.state.players[client.sessionId].stuff.remove(item);
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
                eevolution.items.add(item);
                delete this.state.players[client.sessionId].board[id];
                this.state.players[client.sessionId].board[eevolution.id] = eevolution;
                this.state.players[client.sessionId].stuff.remove(item);
                success = true;
                message.updateItems = false;
              }
              else{
                pokemon.items.add(item);
                this.state.players[client.sessionId].stuff.remove(item);
                success = true;
                message.updateItems = false;
                break;
              }
              if (evolve) {
                this.state.players[client.sessionId].synergies.update(this.state.players[client.sessionId].board);
                this.state.players[client.sessionId].effects.update(this.state.players[client.sessionId].synergies);
                this.state.players[client.sessionId].boardSize = UtilsCommand.getTeamSize(this.state.players[client.sessionId].board);
              }

            }
          }
        }
      }
    }
    if (!success) {
      client.send('DragDropFailed', message);
    }
  }
}

class OnSellDropCommand extends Command {
  execute({client, detail}) {
    if (client.sessionId in this.state.players &&
    detail.pokemonId in this.state.players[client.sessionId].board) {
      this.state.players[client.sessionId].money += COST[this.state.players[client.sessionId].board[detail.pokemonId].rarity];
      if(this.state.players[client.sessionId].board[detail.pokemonId].items.item0 != ''){
        this.state.players[client.sessionId].stuff.add(this.state.players[client.sessionId].board[detail.pokemonId].items.item0);
      }
      if(this.state.players[client.sessionId].board[detail.pokemonId].items.item1 != ''){
        this.state.players[client.sessionId].stuff.add(this.state.players[client.sessionId].board[detail.pokemonId].items.item1);
      }
      if(this.state.players[client.sessionId].board[detail.pokemonId].items.item2 != ''){
        this.state.players[client.sessionId].stuff.add(this.state.players[client.sessionId].board[detail.pokemonId].items.item2);
      }
      
      delete this.state.players[client.sessionId].board[detail.pokemonId];
      this.state.players[client.sessionId].synergies.update(this.state.players[client.sessionId].board);
      this.state.players[client.sessionId].effects.update(this.state.players[client.sessionId].synergies);
      this.state.players[client.sessionId].boardSize = UtilsCommand.getTeamSize(this.state.players[client.sessionId].board);
    }
  }
}

class OnRefreshCommand extends Command {
  execute(sessionId) {
    if (sessionId in this.state.players) {
      if (this.state.players[sessionId].money >= 2) {
        this.state.shop.detachShop(this.state.players[sessionId]);
        this.state.shop.assignShop(this.state.players[sessionId]);
        this.state.players[sessionId].money -= 2;
      }
    }
  }
}

class OnLockCommand extends Command {
  execute(sessionId) {
    if (sessionId in this.state.players) {
      this.state.players[sessionId].shopLocked = !this.state.players[sessionId].shopLocked;
    }
  }
}

class OnLevelUpCommand extends Command {
  execute(sessionId) {
    if (sessionId in this.state.players) {
      if (this.state.players[sessionId].money >= 4) {
        this.state.players[sessionId].experienceManager.addExperience(4);
        this.state.players[sessionId].money -= 4;
      }
    }
  }
}

class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    this.state.players[client.sessionId] = new Player(client.sessionId, auth.email.slice(0, auth.email.indexOf('@')));
    this.state.shop.assignShop(this.state.players[client.sessionId]);
  }
}

class OnLeaveCommand extends Command {
  execute({client, consented}) {
    this.state.shop.detachShop(this.state.players[client.sessionId]);
    delete this.state.players[client.sessionId];
  }
}

class OnUpdateCommand extends Command {
  execute(deltaTime) {
    let updatePhaseNeeded = false;
    this.state.time -= deltaTime;
    if (Math.round(this.state.time/1000) != this.state.roundTime) {
      this.state.roundTime = Math.round(this.state.time/1000);
    }
    if (this.state.time < 0) {
      updatePhaseNeeded = true;
    } else if (this.state.phase == STATE.FIGHT) {
      let everySimulationFinished = true;
      for (const id in this.state.players) {
        if (!this.state.players[id].simulation.finished) {
          if (everySimulationFinished) {
            everySimulationFinished = false;
          }
          this.state.players[id].simulation.update(deltaTime);
        }
      }
      if (everySimulationFinished) {
        updatePhaseNeeded = true;
      }
    }
    if (updatePhaseNeeded) {
      return [new OnUpdatePhaseCommand()];
    }
  }
}

class OnKickPlayerCommand extends Command {
  execute(sessionId) {
    for (let i = 0; i < this.room.clients.length; i++) {
      if (this.room.clients[i].sessionId == sessionId) {
        this.room.clients[i].send('kick-out');
      }
    }
  }
}

class UtilsCommand extends Command {
  static getBoardSize(board) {
    let boardSize = 0;
    for (const id in board) {
      if (board[id].positionY == 0) {
        boardSize ++;
      }
    }
    return boardSize;
  }

  static getPossibleEvolution(board, name){
    let count = 0;
    for(const id in board){
      if(board[id].name == name){
        count ++;
      }
    }
    return (count >= 2);
  }

  static getFirstPokemonOnBoard(board) {
    for (const id in board) {
      if (board[id].positionY == 0) {
        return board[id];
      }
    }
  }

  static getTeamSize(board) {
    let size = 0;
    for (const id in board) {
      if (board[id].positionY != 0) {
        size ++;
      }
    }
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
      const deadPlayerId = this.checkDeath();
      if (deadPlayerId) {
        this.state.players[deadPlayerId].alive = false;
        for(const id in this.state.players[deadPlayerId].board){
          delete this.state.players[deadPlayerId].board[id];
        }
        //return [new OnKickPlayerCommand().setPayload(deadPlayerId)];
      }
      this.computeIncome();
      this.initializePickingPhase();
    }
  }

  computeLife() {
    for (const id in this.state.players) {
      const player = this.state.players[id];
      if (Object.keys(player.simulation.blueTeam).length == 0) {
        if (player.lastBattleResult == 'Defeat') {
          player.streak = Math.min(player.streak + 1, 5);
        } else {
          player.streak = 0;
        }
        player.lastBattleResult = 'Defeat';
        player.life = Math.max(0, player.life - 1);
      } else if (Object.keys(player.simulation.redTeam).length == 0) {
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
      }
    }
  }

  computeIncome() {
    for (const id in this.state.players) {
      const player = this.state.players[id];
      if(player.alive){
        player.interest = Math.min(Math.floor(player.money / 10), 5);
        player.money += player.interest;
        player.money += player.streak;
        if (player.lastBattleResult == 'Win') {
          player.money += 1;
        }
        player.money += 5;
        player.experienceManager.addExperience(2);
        for (let i = 0; i < player.board.length; i++) {
          if(player.board[i].positionX != 0){
            if(player.board[i].items.count(ITEMS.COIN_AMULET) != 0){
              player.money += Math.round(Math.random() * 5) * player.board[i].items.count(ITEMS.COIN_AMULET);
            }
          }
        }
      }
    }
  }

  checkDeath() {
    for (const id in this.state.players) {
      const player = this.state.players[id];
      if (player.life <= 0) {
        return player.id;
      }
    }
  }

  initializePickingPhase() {
    this.state.phase = STATE.PICK;
    this.state.time = 30000;
    for (const id in this.state.players) {
      const player = this.state.players[id];
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
    }
  }

  checkForLazyTeam() {
    const commands = [];
    for (const id in this.state.players) {
      const player = this.state.players[id];
      const teamSize = UtilsCommand.getTeamSize(player.board);
      if (teamSize < player.experienceManager.level) {
        const numberOfPokemonsToMove = player.experienceManager.level - teamSize;
        for (let i = 0; i < numberOfPokemonsToMove; i++) {
          const boardSize = UtilsCommand.getBoardSize(player.board);
          if (boardSize > 0) {
            const coordinate = this.room.getFirstAvailablePositionInTeam(player.board);
            const detail = {
              'id': UtilsCommand.getFirstPokemonOnBoard(player.board).id,
              'x': coordinate[0],
              'y': coordinate[1],
              'objType':'pokemon'
            };
            const client = {
              'sessionId': id
            };
            commands.push(new OnDragDropCommand().setPayload({'client': client, 'detail': detail}));
          }
        }
      }
    }
    return commands;
  }

  initializeFightingPhase() {
    this.state.phase = STATE.FIGHT;
    this.state.time = 30000;
    this.state.stageLevel += 1;

    for (const id in this.state.players) {
      const player = this.state.players[id];
      if(player.alive){
        if (this.state.neutralStages.includes(this.state.stageLevel)) {
          player.opponentName = 'PVE';
          player.simulation = new Simulation(player.board, PokemonFactory.getNeutralPokemonsByLevelStage(this.state.stageLevel), player.effects.list, []);
        } else {
          const opponentId = this.room.getRandomOpponent(id);
          player.opponentName = this.state.players[opponentId].name;
          player.simulation = new Simulation(player.board, this.state.players[opponentId].board, player.effects.list, this.state.players[opponentId].effects.list);
        }
      }
    }
  }
}

class OnEvolutionCommand extends Command {
  execute(sessionId) {
    let evolve = false;
    let itemsToAdd = [];
    for (const id in this.state.players[sessionId].board) {
      const pokemon = this.state.players[sessionId].board[id];
      let count = 0;
      const pokemonEvolutionName = pokemon.evolution;

      if (pokemonEvolutionName != '') {
        for (const id in this.state.players[sessionId].board) {
          if ( this.state.players[sessionId].board[id].index == pokemon.index) {
            count += 1;
          }
        }

        if (count == 3 || (pokemon.types.includes(TYPE.BUG) && count == 2 && this.state.players[sessionId].effects.list.includes(EFFECTS.SWARM))) {
          for (const id in this.state.players[sessionId].board) {
            if ( this.state.players[sessionId].board[id].index == pokemon.index && count >= 0) {
              let temp = this.state.players[sessionId].board[id].items.getAllItems();
              temp.forEach((el)=>{
                itemsToAdd.push(el);
              });
              delete this.state.players[sessionId].board[id];
              count -= 1;
            }
          }
          const x = this.room.getFirstAvailablePositionInBoard( this.state.players[sessionId].board);
          const pokemonEvolved = PokemonFactory.createPokemonFromName(pokemonEvolutionName);
          for (let i = 0; i < 3; i++) {
            let itemToAdd = itemsToAdd.pop();
            if(itemToAdd){
              pokemonEvolved.items.add(itemToAdd);
            }
          }
          itemsToAdd.forEach( (item) =>{
            this.state.players[sessionId].stuff.add(item);
          });
          pokemonEvolved.positionX = x;
          pokemonEvolved.positionY = 0;
          this.state.players[sessionId].board[pokemonEvolved.id] = pokemonEvolved;
          evolve = true;
        }
      }
    }
    if (evolve) {
      this.state.players[sessionId].synergies.update(this.state.players[sessionId].board);
      this.state.players[sessionId].effects.update(this.state.players[sessionId].synergies);
      this.state.players[sessionId].boardSize = UtilsCommand.getTeamSize(this.state.players[sessionId].board);
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
