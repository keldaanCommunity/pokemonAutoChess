class Lobby{
    constructor(room, container)
    {
        this.room = room;
        this.container = container;
        this.container.innerHTML =`
        <header>
        <h1>Game Lobby</h1>
        <button id="button-home">Home</button>
        </header>
        <main>
        <p>Logged as : ${window._client.auth.username}</p>
        <h3>Available players :</h3>
        <ul id="player-list"></ul>
        <button id="button-game">Start Game</button>
        </main>`;
        this.initialize();
    }

    initialize()
    {
        this.room.onLeave((client, consent) => {
            if (consent) {
              sessionStorage.setItem('PAC_Room_ID', this.room.id);
              sessionStorage.setItem('PAC_Session_ID', this.room.sessionId);
            }
          })
          this.room.onStateChange((state) => {
            console.log("new room state", state);
            this.handleUserChange();
          });
          this.room.onMessage((msg) => {
            console.log("room message"); console.log(msg);
          });
          this.room.send("this is a client message");
    }

    handleUserChange()
    {
      document.getElementById("player-list").innerHTML = "";
      for (let id in this.room.state.users) {
        let el = document.createElement("li");
        el.textContent = this.room.state.users[id].name;
        document.getElementById('player-list').appendChild(el);
      }
    }
}

module.exports = Lobby;