
class LobbyPage {
  static render(lobbyRoom) {
    console.log("room",lobbyRoom);
    createContent();
  }
}

function createContent() {
  var content = document.createElement("div");
  content.setAttribute("id", "lobby");
  content.innerHTML = `
  <p>This is lobby</p>
  `;
  document.body.innerHTML = "";
  document.body.appendChild(content);
}

export default LobbyPage;