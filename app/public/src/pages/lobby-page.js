
class LobbyPage {
  constructor(args) {
    console.log("args", args);
    console.log("client", _client);
    this.room = args.room;
    this.render();
    this.addEventListeners();
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "lobby");
    content.innerHTML = `
    <p>This is lobby</p>
    <p>Number of players online: <span id="player-count">${this.room.state.playerCount}</span></p>
    `;
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }

  addEventListeners() {
    this.room.onLeave((client, consent) => {
      if (consent) {
        sessionStorage.setItem('PAC_Room_ID', this.room.id);
        sessionStorage.setItem('PAC_Session_ID', this.room.sessionId);
      }
    })
    this.room.onStateChange((state) => {
      console.log("new room state", state);
      document.getElementById("player-count").innerText = this.room.state.playerCount;
    });
    this.room.onMessage((msg) => {
      console.log("room message"); console.log(msg);
    });
    this.room.send("this is a client message");
  }
}


export default LobbyPage;