
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
    <header>
      <h1>Game Lobby</h1>
      <button id="button-home">Home</button>
    </header>
    <main>
      <p>Logged as : ${_client.auth.username}</p>
      <h3>Available players :</h3>
      <ul id="player-list"></ul>
      <h3>Available room ids:</h3>
      <button id="refresh">Refresh Room List</button>
      <ul id="room-list"></ul>
      <button id="create">Create new room</button>
      <h3>Join room :</h3>
      <label for="room-id">Enter the id of desired room:</label>
      <input type="text" id="room-id" name="room-id" required">
      <button id="join">Join Room</button>
    </main>`;
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }

  addEventListeners() {
    document.getElementById("button-home").addEventListener("click", e => {
      this.room.leave();
      window.dispatchEvent(new CustomEvent("render-home"));
    });
    document.getElementById("refresh").addEventListener("click", e => {
      _client.getAvailableRooms("preGame")
        .then(rooms => this.handleRoomListChange(rooms))
        .catch(e => console.error(e));
    });
    document.getElementById("create").addEventListener("click", e => {
      this.createRoom();
    });
    document.getElementById("join").addEventListener("click", e => {
      this.joinRoomById(document.getElementById("room-id").value);
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

  createRoom() {
    _client.create("room", {/* options */ }).then(room => {
      console.log("create room:", room);
      this.room.leave();
      window.dispatchEvent(new CustomEvent("render-room", { detail: { room: room } }));
    }).catch(e => {
      console.error("join error", e);
      alert(e);
    });
  }

  joinRoomById(id) {
    if (id === "") return;
    _client.joinById(id).then(room => {
      console.log("join room:", room);
      this.room.leave();
      window.dispatchEvent(new CustomEvent("render-room", { detail: { room: room } }));
    }).catch(e => {
      console.error("join error", e);
      alert(e);
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

  handleRoomListChange(rooms){
    document.getElementById("room-list").innerHTML = "";
    rooms.forEach((room) => {
      let item = document.createElement("li");
      item.textContent = `Room id : ${room.roomId} (${room.clients}/${room.maxClients})`;
      document.getElementById("room-list").appendChild(item);
    });
  }
}

export default LobbyPage;