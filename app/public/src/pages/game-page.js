import GameContainer from "../game/game-container";

class GamePage {
  constructor(args) {
    this.render();
    var room = args.room;
    var container = document.getElementById("game");
    this.game = new GameContainer(room, container);
    console.log("GamePage", this);
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "game");
    content.innerHTML = `
    <p>This is game</p>
    `;
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }
}

export default GamePage;