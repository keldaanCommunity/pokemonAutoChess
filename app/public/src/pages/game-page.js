import GameContainer from "../game/game-container";

class GamePage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.container = document.getElementById("game");
    window.transformCoordinate = function(x,y){
      return [x * 100 + 330, 790 - 80 * y];
    }
    window.getAttackScale = function(attackSprite){
      switch (attackSprite) {
        case "FAIRY/range":
          return [1.5,1.5];

        case "GRASS/range":
          return [3,3];
        
        case "WATER/range":
          return [3,3];

        case "FIRE/melee":
          return [2,2];
        
        case "ROCK/melee":
          return [2,2];
        
        default:
          return [3,3];
      }
    }
    this.game = new GameContainer(this.room, this.container);
  };


  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "game");
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }
}

export default GamePage;