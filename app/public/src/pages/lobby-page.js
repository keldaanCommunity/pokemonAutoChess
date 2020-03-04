
class LobbyPage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.addEventListeners();
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "lobby");
    content.innerHTML = `
    <p>This is lobby</p>
    <p>Number of players online: 
      <span id="player-count">${this.room.state.playerCount}</span></p>
    `;
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }

  addEventListeners() {
    this.room.onStateChange(state => {
      console.log("new room state", state);
      document.getElementById("player-count").innerText = state.playerCount;
    });
    this.room.onMessage(msg => {
      console.log("room message", msg);
    });
  }
}


export default LobbyPage;