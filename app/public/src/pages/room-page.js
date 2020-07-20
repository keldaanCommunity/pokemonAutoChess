
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
      <p>Logged as : ${_client.auth.email}</p>
      <h3>Players in room :</h3>
      <table id="players-table">
      <tr>
        <th>Player</th>
        <th>Elo</th>
        <th>Ready</th>
      </tr>
    </table>
    <div style="display:flex;">      
    <button id="ready">Ready</button>
    <button id="start">Start Game</button>
    <button id="quit">Quit Room</button>
    </div>
    </main>`;
    document.body.innerHTML = "";
    document.body.appendChild(content);
    // this.preGame = new PreGame(this.room, content);
  }

  addEventListeners() {
    document.getElementById("button-home").addEventListener("click", e => {
      this.room.leave();
      _client.auth.logout();
      window.dispatchEvent(new CustomEvent("render-home"));
    });
    document.getElementById("start").addEventListener("click", e => {
      let allUsersReady = true;
      for (let id in this.room.state.users) {
        if(!this.room.state.users[id].ready){
          allUsersReady = false;
        }
      }
      if(allUsersReady){
        _client.create("game", {/* options */ }).then(room => {
          this.room.send("game-start", { id: room.id});
          this.room.leave();
          window.dispatchEvent(new CustomEvent("render-game", { detail: { room: room } }));
        }).catch(e => {
          console.error("join error", e);
        });
      }
    });

    document.getElementById("quit").addEventListener("click", e => {
      _client.joinOrCreate("lobby").then(room => {
        this.room.leave();
        window.dispatchEvent(new CustomEvent("render-lobby", { detail: { room: room } }));
      }).catch(e => {
        console.error("join error", e);
      });
    });
    document.getElementById("ready").addEventListener("click", e => {
      this.room.send("toggle-ready");
    });
    this.room.onLeave((client, consent) => {
      if (consent) {
        //sessionStorage.setItem('PAC_Room_ID', this.room.id);
        //sessionStorage.setItem('PAC_Session_ID', this.room.sessionId);
      }
    });
    this.room.onStateChange((state) => {
      this.handleUserChange();
    });

    this.room.onMessage("game-start", (message) => {
      _client.joinById(message.id).then(room => {
        this.room.leave();
        window.dispatchEvent(new CustomEvent("render-game", { detail: { room: room } }));
      }).catch(e => {
        console.error("join error", e);
      });
    });
  }

  handleUserChange(){
    document.getElementById("players-table").innerHTML = `
    <tr>
    <th>Player</th>
    <th>Elo</th>
    <th>Ready</th>
    </tr>`;
    
    for (let id in this.room.state.users) {
      let icon = "";
      if(this.room.state.users[id].ready){
        icon = `<i class="fa fa-check" aria-hidden="true"></i>`;
      }
      else{
        icon = `<i class="fa fa-times" aria-hidden="true"></i>`;
      }
      document.getElementById("players-table").innerHTML +=`
      <tr>
      <td>${this.room.state.users[id].name}</td>
      <td>1000</td>
      <td>${icon}</td>
      </tr>`;
    }
  }
}

export default RoomPage;