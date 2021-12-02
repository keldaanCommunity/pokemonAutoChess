const {ITEM_TYPE, BATTLE_RESULT} = require('../models/enum');
const SCENARIOS = require('../models/scenarios');
const PokemonFactory = require('../models/pokemon-factory');
class Bot {
  constructor(player) {
    this.player = player;
    this.step = 0;
    this.progress = 0;
    this.scenario = SCENARIOS[player.id];
    this.updatePlayerTeam(0);
  }

  updateProgress() {
    if (this.player.getLastBattleResult() == BATTLE_RESULT.DEFEAT) {
      this.progress += 1;
    } else if (this.player.getLastBattleResult() == BATTLE_RESULT.DRAW) {
      this.progress += 1;
    } else if (this.player.getLastBattleResult() == BATTLE_RESULT.WIN) {
      this.progress += 1.5;
    }
    if (this.scenario.steps[this.step + 1] && this.progress >= this.scenario.steps[this.step + 1].roundsRequired) {
      this.step += 1;
      this.progress = 0;
      this.updatePlayerTeam();
    }
  }

  updatePlayerTeam() {
    this.player.board.forEach((pokemon, key) => {
      this.player.board.delete(key);
    });

    const stepTeam = this.scenario.steps[this.step];
    for (let i = 0; i < stepTeam.board.length; i++) {
      const pkm = PokemonFactory.createPokemonFromName(stepTeam.board[i].name);
      pkm.positionX = stepTeam.board[i].x;
      pkm.positionY = stepTeam.board[i].y;
      if(stepTeam.board[i].items){
        stepTeam.board[i].items.forEach(item=>{
          pkm.items.add(item);
        });
      }
      this.player.board[pkm.id] = pkm;
    }

    this.player.synergies.update(this.player.board);
    this.player.effects.update(this.player.synergies);
  }
}

module.exports = Bot;
