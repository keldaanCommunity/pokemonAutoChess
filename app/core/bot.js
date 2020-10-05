const POKEMON_BOT = require('../models/enum').POKEMON_BOT;
const SCENARIOS = require('../models/scenarios');
const PokemonFactory = require('../models/pokemon-factory');

class Bot{
    constructor(player){
        this.player = player;
        this.step = 0;
        this.progress = 0;
        this.scenario = SCENARIOS[POKEMON_BOT[player.avatar]];
        this.updatePlayerTeam(0);
    }

    updateProgress(){
        if(this.player.lastBattleResult == 'Defeat'){
            this.progress += 1;
        }
        else if(this.player.lastBattleResult == 'Draw'){
            this.progress += 1;
        }
        else if(this.player.lastBattleResult == 'Win'){
            this.progress += 1.5;
        }
        if(this.scenario.steps[this.step + 1] && this.progress >= this.scenario.steps[this.step + 1].roundsRequired){
            this.step += 1;
            this.progress = 0;
            this.updatePlayerTeam();
        }
    }

    updatePlayerTeam(){
        for (const id in this.player.board){
            delete this.player.board[id];
        }

        let stepTeam = this.scenario.steps[this.step];
        for (let i = 0; i < stepTeam.board.length; i++) {
            let pkm = PokemonFactory.createPokemonFromName(stepTeam.board[i].name);
            pkm.positionX = stepTeam.board[i].x;
            pkm.positionY = stepTeam.board[i].y;
            this.player.board[pkm.id] = pkm;
        }

        this.player.synergies.update(this.player.board);
        this.player.effects.update(this.player.synergies);
    }
}

module.exports = Bot;