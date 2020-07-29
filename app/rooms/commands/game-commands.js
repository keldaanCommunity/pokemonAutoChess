const Command = require("@colyseus/command").Command;
const Pokemon = require("../../models/pokemon");
const STATE = require("../../models/enum").STATE;
const COST = require("../../models/enum").COST;
const Player = require("../../models/player");
const PokemonFactory = require("../../models/pokemon-factory");
const Simulation =require("../../core/simulation");


class OnShopCommand extends Command {
    execute({sessionId, pokemonId}) {
        if (sessionId in this.state.players
        && pokemonId in this.state.players[sessionId].shop
        && this.room.getBoardSize(sessionId) < 9
        && this.state.players[sessionId].money >= this.state.players[sessionId].shop[pokemonId].cost) {
            this.state.players[sessionId].money -= this.state.players[sessionId].shop[pokemonId].cost;
            this.state.players[sessionId].board[pokemonId] = Object.assign(new Pokemon.Pokemon(), this.state.players[sessionId].shop[pokemonId]);
            delete this.state.players[sessionId].shop[pokemonId];
            this.state.players[sessionId].board[pokemonId].positionX = this.room.getFirstAvailablePositionInBoard(this.state.players[sessionId].board);
            this.state.players[sessionId].board[pokemonId].positionY = 0;
            return[new OnEvolutionCommand().setPayload(sessionId), new OnEvolutionCommand().setPayload(sessionId)];
        }
    }
}

class OnDragDropCommand extends Command {
    execute({client, detail}) {
        let success = false;
    
        if (client.sessionId in this.state.players) {
          if (detail.pokemonId in this.state.players[client.sessionId].board) {
            let pokemon = this.state.players[client.sessionId].board[detail.pokemonId];
            let x = parseInt(detail.x);
            let y = parseInt(detail.y);
    
            if( y == 0 && pokemon.positionY == 0){
              this.room.swap(this.state.players[client.sessionId].board,pokemon,x,y);
              success = true;
            }
            else if(this.state.phase == STATE.PICK){
              let teamSize = this.room.getTeamSize(client.sessionId);
              if (teamSize < this.state.players[client.sessionId].experienceManager.level) {
                this.room.swap(this.state.players[client.sessionId].board,pokemon,x,y);
                success = true;
              }
              else if(teamSize == this.state.players[client.sessionId].experienceManager.level){
                let empty = this.room.isPositionEmpty(this.state.players[client.sessionId].board,x,y);
                if(!empty){
                  this.room.swap(this.state.players[client.sessionId].board,pokemon,x,y);
                  success = true;
                }
                else{
                  if((pokemon.positionY != 0 && y != 0) || y == 0){
                    this.room.swap(this.state.players[client.sessionId].board,pokemon,x,y);
                    success = true;
                  }
                }
              }
            }
            this.state.players[client.sessionId].synergies.update(this.state.players[client.sessionId].board);
          }
        }
    
        if (!success) {
          client.send("DragDropFailed", {});
        }
    }
}

class OnSellDropCommand extends Command {
    execute({client, detail}) {
        if (client.sessionId in this.state.players &&
        detail.pokemonId in this.state.players[client.sessionId].board) {
            this.state.players[client.sessionId].money += COST[this.state.players[client.sessionId].board[detail.pokemonId].rarity];
            delete this.state.players[client.sessionId].board[detail.pokemonId];
            this.state.players[client.sessionId].synergies.update(this.state.players[client.sessionId].board);
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
        this.state.players[client.sessionId] = new Player(client.sessionId, auth.email.slice(0,auth.email.indexOf("@")));
        this.state.shop.assignShop(this.state.players[client.sessionId]);
    }
  }

class OnLeaveCommand extends Command{
    execute({client, consented}) {
        this.state.shop.detachShop(this.state.players[client.sessionId]);
        delete this.state.players[client.sessionId];
    }
}

class OnUpdateCommand extends Command{
    execute(deltaTime) {
        let updatePhaseNeeded = false;
        this.state.time -= deltaTime;
        if(Math.round(this.state.time/1000) != this.state.roundTime){
          this.state.roundTime = Math.round(this.state.time/1000);
        }
        if (this.state.time < 0) {
            updatePhaseNeeded = true;
        }
        else if(this.state.phase == STATE.FIGHT){
            let everySimulationFinished = true;
            for (let id in this.state.players){
            if(!this.state.players[id].simulation.finished){
                if(everySimulationFinished){
                    everySimulationFinished = false;
                }
                this.state.players[id].simulation.update(deltaTime);
            }
            }
            if(everySimulationFinished){
                updatePhaseNeeded = true;
            }
        }
        if(updatePhaseNeeded){
            return [new OnUpdatePhaseCommand()];
        }
    }
}

class OnKickPlayerCommand extends Command{
    execute(sessionId){
        for (let i = 0; i < this.room.clients.length; i++) {
            if(this.room.clients[i].sessionId == sessionId){
              this.room.clients[i].send("kick-out");
            }
        }
    }
}

class OnUpdatePhaseCommand extends Command{
    execute() {
        if (this.state.phase == STATE.PICK) {
          this.initializeFightingPhase();
        }
        else if (this.state.phase == STATE.FIGHT) {
            this.computeLife();
            let deadPlayerId = this.checkDeath();
            if(deadPlayerId){
                return [new OnKickPlayerCommand().setPayload(deadPlayerId)];
            }
            this.computeIncome();
            this.initializePickingPhase();
        }
      }
    
      computeLife(){
        for (let id in this.state.players) {
          let player = this.state.players[id];
          if(Object.keys(player.simulation.blueTeam).length == 0){
            if(player.lastBattleResult == "Defeat"){
              player.streak = Math.min(player.streak + 1, 5);
            }
            else{
              player.streak = 0;
            }
            player.lastBattleResult = "Defeat";
            player.life = Math.max(0, player.life - 1);
          }
          else if(Object.keys(player.simulation.redTeam).length == 0){
            if(player.lastBattleResult == "Win"){
              player.streak += Math.min(player.streak + 1, 5);
            }
            else{
              player.streak = 0;
            }
            player.lastBattleResult = "Win";
          }
          else{
            if(player.lastBattleResult == "Draw"){
              player.streak += Math.min(player.streak + 1, 5);
            }
            else{
              player.streak = 0;
            }
            player.lastBattleResult = "Draw";
          }
        }
      }
    
      computeIncome() {
        for (let id in this.state.players) {
        let player = this.state.players[id];
        player.interest = Math.min(Math.floor(player.money / 10), 5);
        player.money += player.interest;
        player.money += player.streak;
        if(player.lastBattleResult == "Win"){
            player.money += 1;
        }
        player.money += 5;
        player.experienceManager.addExperience(2);
        }
      }
    
      checkDeath(){
        for (let id in this.state.players) {
          let player = this.state.players[id];
            if(player.life <= 0){
              return player.id;
            }
        }
      }
    
      initializePickingPhase() {
        this.state.phase = STATE.PICK;
        this.state.time = 30000;
        for (let id in this.state.players) {
          let player = this.state.players[id];
          player.simulation.stop();
          player.opponentName = "";
          if(!player.shopLocked){
            this.state.shop.detachShop(player);
            this.state.shop.assignShop(player);
          }
          else{
            player.shopLocked = false;
          }
        }
      }
    
      initializeFightingPhase() {
        this.state.phase = STATE.FIGHT;
        this.state.time = 30000;
        this.state.stageLevel += 1;

        for (let id in this.state.players) {
          let player = this.state.players[id];
          if(this.state.neutralStages.includes(this.state.stageLevel)){
            player.opponentName = "PVE";
            player.simulation = new Simulation(player.board, PokemonFactory.getNeutralPokemonsByLevelStage(this.state.stageLevel));
          }
          else{
            let opponentId = this.room.getRandomOpponent(id);
            player.opponentName = this.state.players[opponentId].name;
            player.simulation = new Simulation(player.board, this.state.players[opponentId].board);
          }
        }
      }
}

class OnEvolutionCommand extends Command{
    execute(sessionId){
        
        let evolve = false;
        for (let id in  this.state.players[sessionId].board) {
          let pokemon =  this.state.players[sessionId].board[id];
          let count = 0;
          let pokemonEvolutionName = pokemon.evolution;
    
          if (pokemonEvolutionName != "") {
            for (let id in  this.state.players[sessionId].board) {
              if ( this.state.players[sessionId].board[id].index == pokemon.index) {
                count += 1;
              }
            }
    
            if (count == 3) {
              for (let id in  this.state.players[sessionId].board) {
                if ( this.state.players[sessionId].board[id].index == pokemon.index && count >= 0) {
                  delete  this.state.players[sessionId].board[id];
                  count -= 1;
                }
              }
              let x = this.room.getFirstAvailablePositionInBoard( this.state.players[sessionId].board);
              let pokemonEvolved = PokemonFactory.createPokemonFromName(pokemonEvolutionName);
              pokemonEvolved.positionX = x;
              pokemonEvolved.positionY = 0;
              this.state.players[sessionId].board[pokemonEvolved.id] = pokemonEvolved;
              evolve = true;
            }
          }
        }
        if(evolve){
            this.state.players[sessionId].synergies.update(this.state.players[sessionId].board);
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
}