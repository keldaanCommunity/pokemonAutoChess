const {BATTLE_RESULT} = require('../models/enum');
const PokemonFactory = require('../models/pokemon-factory');
const BOT = require('../models/mongo-models/bot-v2');

class Bot {
  constructor(player) {
    this.player = player;
    this.step = 0;
    this.progress = 0;
    // console.log(player.name);
    BOT.findOne({'avatar': player.name}, ['steps'], null, (err, bot)=>{
      this.scenario = bot;
      this.updatePlayerTeam(0);
    });
  }

  updateProgress() {
    if (this.player.getLastBattleResult() == BATTLE_RESULT.DEFEAT) {
      this.progress += 1;
    } else if (this.player.getLastBattleResult() == BATTLE_RESULT.DRAW) {
      this.progress += 1;
    } else if (this.player.getLastBattleResult() == BATTLE_RESULT.WIN) {
      this.progress += 1.5;
    }
    // console.log(this.player.name);
    // console.log(this.scenario);
    if (this.scenario && this.scenario.steps[this.step + 1] && this.progress >= this.scenario.steps[this.step + 1].roundsRequired) {
      this.step += 1;
      this.progress = 0;
      this.updatePlayerTeam();
    }
  }

  updatePlayerTeam() {
    // console.log(this.scenario);
    this.player.board.forEach((pokemon, key) => {
      this.player.board.delete(key);
    });

    const stepTeam = this.scenario.steps[this.step];
    for (let i = 0; i < stepTeam.board.length; i++) {
      const pkm = PokemonFactory.createPokemonFromName(stepTeam.board[i].name);
      pkm.positionX = stepTeam.board[i].x;
      pkm.positionY = stepTeam.board[i].y;
      if (stepTeam.board[i].items) {
        stepTeam.board[i].items.forEach((item)=>{
          if (!pkm.items.has(item)) {
            pkm.items.add(item);
          }
        });
      }
      this.player.board.set(pkm.id, pkm);
    }

    this.player.synergies.update(this.player.board);
    this.player.effects.update(this.player.synergies);
  }
}

module.exports = Bot;
