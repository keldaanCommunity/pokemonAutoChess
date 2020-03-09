
class RoomPage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.addEventListeners();
  }

  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "pre-game");
    content.innerHTML = `
    <header>
      <h1>Room ID: ${this.room.id}</h1>
      <button id="button-home">Home</button>
    </header>
    <main>
      <p>Logged as : ${_client.auth.username}</p>
      <h3>Players in room :</h3>
      <ul id="player-list"></ul>
      <button id="start">Start Game</button>
      <button id="quit">Quit Room</button>
    </main>`;
    document.body.innerHTML = "";
    document.body.appendChild(content);
    // this.preGame = new PreGame(this.room, content);
  }

  addEventListeners() {
    document.getElementById("button-home").addEventListener("click", e => {
      this.room.leave();
      window.dispatchEvent(new CustomEvent("render-home"));
    });
    document.getElementById("start").addEventListener("click", e => {
      _client.create("game", {/* options */ }).then(room => {
        this.room.leave();
        window.dispatchEvent(new CustomEvent("render-game", { detail: { room: room } }));
      }).catch(e => {
        console.error("join error", e);
      });
    });
    document.getElementById("quit").addEventListener("click", e => {
      _client.joinOrCreate("lobby").then(room => {
        this.room.leave();
        window.dispatchEvent(new CustomEvent("render-lobby", { detail: { room: room } }));
      }).catch(e => {
        console.error("join error", e);
      });
    });

    this.room.onLeave((client, consent) => {
      if (consent) {
        sessionStorage.setItem('PAC_Room_ID', this.room.id);
        sessionStorage.setItem('PAC_Session_ID', this.room.sessionId);
      }
    });
    this.room.onStateChange((state) => {
      console.log("new room state", state);
      this.handleUserChange();
    });
    this.room.onMessage((msg) => {
      console.log("room message", msg);
    });
  }

  handleUserChange(){
    document.getElementById("player-list").innerHTML = "";
    for (let id in this.room.state.users) {
      let item = document.createElement("li");
      item.textContent = this.room.state.users[id].name;
      document.getElementById("player-list").appendChild(item);
    }
  }
}

export default RoomPage;