import GameContainer from "../game/game-container";

const Game = require('../game');

class GamePage {
  constructor(args) {
    this.room = args.room;
    this.render();
    var room = args.room;
    var container = document.getElementById("game");
    this.game = new GameContainer(room, container);
    console.log("GamePage", this);
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "game");
    document.body.innerHTML = "";
    document.body.appendChild(content);
    this.game = new Game.default(this.room);
  }
}

export default GamePage;