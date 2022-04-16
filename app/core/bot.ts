import { ITEM } from '../models/enum';
import PokemonFactory from '../models/pokemon-factory';
import BOT, { IBot } from '../models/mongo-models/bot-v2';
import Player from '../models/colyseus-models/player';
import { BattleResult } from '../types/enum/Game';
import { Synergy } from '../types/enum/Synergy';

export default class Bot {

  player: Player;
  step: number;
  progress: number;
  scenario: IBot;

  constructor(player: Player) {
    this.player = player;
    this.step = 0;
    this.progress = 0;

    BOT.findOne({'avatar': player.avatar}, ['steps'], null, (err, bot)=>{
      this.scenario = bot;
      this.updatePlayerTeam();
    });
  }

  updateProgress() {
    if (this.player.getLastBattleResult() == BattleResult.DEFEAT) {
      this.progress += 1;
    } else if (this.player.getLastBattleResult() == BattleResult.DRAW) {
      this.progress += 1;
    } else if (this.player.getLastBattleResult() == BattleResult.WIN) {
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
              switch (item) {
                case ITEM.WATER_STONE:
                  pkm.types.push(Synergy.WATER);
                  break;
                case ITEM.FIRE_STONE:
                  pkm.types.push(Synergy.FIRE);
                  break;
                case ITEM.THUNDER_STONE:
                  pkm.types.push(Synergy.ELECTRIC);
                  break;
                case ITEM.DUSK_STONE:
                  pkm.types.push(Synergy.DARK);
                  break;
                case ITEM.MOON_STONE:
                  pkm.types.push(Synergy.FAIRY);
                  break;
                case ITEM.LEAF_STONE:
                  pkm.types.push(Synergy.GRASS);
                  break;
                case ITEM.DAWN_STONE:
                  pkm.types.push(Synergy.PSYCHIC);
                  break;
                case ITEM.ICY_ROCK:
                  pkm.types.push(Synergy.ICE);
                  break;
                case ITEM.OLD_AMBER:
                  pkm.types.push(Synergy.FOSSIL);
                  break;
                default:
                  break;
              }
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
