import GameContainer from "../game/game-container";

class GamePage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.container = document.getElementById("game");
    this.game = new GameContainer(this.room, this.container);
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "game");
    content.innerHTML = `<p>Loading...</p>`;
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }
}

export default GamePage;