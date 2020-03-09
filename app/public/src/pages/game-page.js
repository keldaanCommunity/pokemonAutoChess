
const Game = require('../game');

class GamePage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.addEventListeners();
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "game");
    document.body.innerHTML = "";
    document.body.appendChild(content);
    this.game = new Game.default(this.room);
  }

  addEventListeners() {

  }
}

export default GamePage;