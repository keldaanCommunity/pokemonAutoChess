import GameContainer from "../game/game-container";

class GamePage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.container = document.getElementById("game");
    window.transformCoordinate = function(x,y){
      return [x * 100 + 330, 790 - 80 * y];
    }
    this.game = new GameContainer(this.room, this.container);
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "game");
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }
}

export default GamePage;