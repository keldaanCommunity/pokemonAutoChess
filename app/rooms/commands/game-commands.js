const Command = require('@colyseus/command').Command;
const {Pokemon} = require('../../models/pokemon');
const STATE = require('../../models/enum').STATE;
const COST = require('../../models/enum').COST;
const TYPE = require('../../models/enum').TYPE;
const EFFECTS = require('../../models/enum').EFFECTS;
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
        if (UtilsCommand.getBoardSize(player.board) < 9 && player.money >= pokemon.cost) {
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
      'itemIndex':-1
    }

    if (client.sessionId in this.state.players) {
      if(detail.objType == 'pokemon'){
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
        const itemIndex = this.state.players[client.sessionId].items.findIndex((item) => item.id === detail.id);
        if ( itemIndex != -1 ) {
          const object = this.state.players[client.sessionId].items[detail.id];
          const x = parseInt(detail.x);
          const y = parseInt(detail.y);
          for (let id in this.state.players[client.sessionId].board){
            let pokemon = this.state.players[client.sessionId].board[id];
            if(pokemon.positionX == x && pokemon.positionY == y && pokemon.items.length <= 3){
              pokemon.items.push(ItemFactory.createItemFromName(this.state.players[client.sessionId].items[itemIndex].name));
              this.state.players[client.sessionId].items.splice(itemIndex, 1);
              success = true;
              message.updateItems = false;
            }
          }
        }
        if(!success){
          message.itemIndex = itemIndex;
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
      for (let i = 0; i < this.state.players[client.sessionId].board[detail.pokemonId].items.length; i++) {
        this.state.players[client.sessionId].items.push(ItemFactory.createItemFromName(this.state.players[client.sessionId].board[detail.pokemonId].items[i].name));
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
        return [new OnKickPlayerCommand().setPayload(deadPlayerId)];
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
      player.interest = Math.min(Math.floor(player.money / 10), 5);
      player.money += player.interest;
      player.money += player.streak;
      if (player.lastBattleResult == 'Win') {
        player.money += 1;
      }
      player.money += 5;
      player.experienceManager.addExperience(2);
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
      if(player.opponentName == 'PVE' && player.lastBattleResult == 'Win'){
        player.items.push(ItemFactory.createRandomItem());
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

class OnEvolutionCommand extends Command {
  execute(sessionId) {
    let evolve = false;
    let itemsToTransfer = [];
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
              for (let i = 0; i < this.state.players[sessionId].board[id].items.length; i++) {
                itemsToTransfer.push(this.state.players[sessionId].board[id].items[i].name);
              }
              delete this.state.players[sessionId].board[id];
              count -= 1;
            }
          }
          const x = this.room.getFirstAvailablePositionInBoard( this.state.players[sessionId].board);
          const pokemonEvolved = PokemonFactory.createPokemonFromName(pokemonEvolutionName);
          pokemonEvolved.positionX = x;
          pokemonEvolved.positionY = 0;
          for (let i = 0; i < 3; i++) {
            const itemTransfer = itemsToTransfer.pop();
            if(itemTransfer){
              pokemonEvolved.items.push(ItemFactory.createItemFromName(itemTransfer));
            }
            else{
              break;
            }
          }
          while(itemsToTransfer.length > 0){
            this.state.players[sessionId].items.push(itemsToTransfer.pop());
          }
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
