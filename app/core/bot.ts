import {BATTLE_RESULT} from '../models/enum';
import PokemonFactory from '../models/pokemon-factory';
import BOT, { IBot } from '../models/mongo-models/bot-v2';
import Player from '../models/colyseus-models/player';

export default class Bot {

  player: Player;
  step: number;
  progress: number;
  scenario: IBot;

  constructor(player: Player) {
    this.player = player;
    this.step = 0;
    this.progress = 0;

    BOT.findOne({'avatar': player.name}, ['steps'], null, (err, bot)=>{
      this.scenario = bot;
      this.updatePlayerTeam();
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
