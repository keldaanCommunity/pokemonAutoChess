const {POKEMON_BOT,TYPE_ITEM, ITEM_TYPE} = require('../models/enum');
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

        let items = this.player.stuff.getAllItems();
        let specificItems = Object.keys(ITEM_TYPE);

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let itemAdded = false;
            if(specificItems.includes(item)){
                for(const id in this.player.board){
                    let pokemon = this.player.board[id];
                    if(pokemon.types.includes(ITEM_TYPE[item])){
                        pokemon.items.add(item);
                        itemAdded = true;
                    }
                }
            }
            if(!itemAdded){
                let pokemonIds = Object.keys(this.player.board);
                let pokemon = this.player.board[pokemonIds[Math.floor(Math.random() * pokemonIds.length)]];
                pokemon.items.add(item);
            }
        }
        this.player.synergies.update(this.player.board);
        this.player.effects.update(this.player.synergies);
    }
}

module.exports = Bot;