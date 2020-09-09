import GameContainer from '../game/game-container';

class GamePage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.container = document.getElementById('game');
    window.transformCoordinate = function(x, y) {
      return [323 + 102 * x, 800 - 102 * y];
    };
    window.transformAttackCoordinate = function(x, y) {
      return [323 + 102 * x, 698 - 102 * y];
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
