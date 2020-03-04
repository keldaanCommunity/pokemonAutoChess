
class GamePage {
  constructor(args) {
    this.render();
    this.addEventListeners();
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

  addEventListeners() {

  }
}

export default GamePage;