
class GamePage {
  static render() {
    createContent();
  }
}

function createContent() {
  var content = document.createElement("div");
  content.setAttribute("id", "game");
  content.innerHTML = `
  <p>This is game</p>
  `;
  document.body.innerHTML = "";
  document.body.appendChild(content);
}

export default GamePage;