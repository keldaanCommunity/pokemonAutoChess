import GameContainer from '../game/game-container';
import {ORIENTATION} from '../../../models/enum';

class GamePage {
  constructor(args) {
    this.room = args.room;
    window.langage = 'esp';
    if(window._client.auth.lang){
      window.langage = window._client.auth.lang;
    }
    this.render();
    this.container = document.getElementById('game');
    window.transformCoordinate = function(x, y) {
      return [382 + 96 * x, 808 - 120 * y];
    };
    window.transformAttackCoordinate = function(x, y) {
      return [382 + 96 * x, 712 - 120 * y];
    };

    window.getOrientation = function(x1, y1, x2, y2) {
      let angle = Math.atan2(y2 - y1, x2 - x1);
      if(angle < 0){
        angle += 2 * Math.PI;
      }
      let quarterPi = Math.PI / 4;
      //console.log(angle);
      if(angle < quarterPi){
        return ORIENTATION.RIGHT;
      }
      else if(angle < 2 * quarterPi){
        return ORIENTATION.DOWNRIGHT;
      }
      else if(angle < 3 * quarterPi){
        return ORIENTATION.DOWN;
      }
      else if(angle < 4 * quarterPi){
        return ORIENTATION.DOWNLEFT;
      }
      else if(angle < 5 * quarterPi){
        return ORIENTATION.LEFT;
      }
      else if(angle < 6 * quarterPi){
        return ORIENTATION.UPLEFT;
      }
      else if(angle < 7 * quarterPi){
        return ORIENTATION.UP;
      }
      else if(angle < 8 * quarterPi){
        return ORIENTATION.UPRIGHT;
      }
      else{
        return ORIENTATION.RIGHT;
      }
    };

    window.getAttackScale = function(attackSprite) {
      switch (attackSprite) {
        case 'FLYING/range':
          return [1.5, 1.5];

        case 'FLYING/melee':
          return [1.5, 1.5];

        case 'BUG/melee':
          return [1.5, 1.5];

        case 'FAIRY/range':
          return [1.5, 1.5];

        case 'GRASS/range':
          return [3, 3];

        case 'GRASS/melee':
          return [2, 2];

        case 'POISON/range':
          return [1.5, 1.5];

        case 'POISON/melee':
          return [1, 1];

        case 'WATER/range':
          return [3, 3];

        case 'FIRE/melee':
          return [2, 2];

        case 'ROCK/melee':
          return [2, 2];

        case 'ELECTRIC/melee':
          return [2, 2];

        case 'PSYCHIC/range':
          return [2, 2];

        case 'DRAGON/melee':
          return [2, 2];

        default:
          return [2, 2];
      }
    };
    this.game = new GameContainer(this.room, this.container);
  };


  render() {
    const content = document.createElement('div');
    content.setAttribute('id', 'game');
    document.body.innerHTML = '';
    document.body.appendChild(content);
  }
}

export default GamePage;
