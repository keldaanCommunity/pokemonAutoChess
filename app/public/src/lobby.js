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
        <h3>Available room ids:</h3>
        <button id="refresh">Refresh Room List</button>
        <ul id="room-list"></ul>
        <button id="create-room">Create new room</button>
        <h3>Join room :</h3>
        <label for="room-id">Enter the id of desired room:</label>
        <input type="text" id="room-id" name="room-id" required">
        <button id="join-room">Join Room</button>
        </main>`;
        this.initialize();
    }

    initialize()
    {
      let self = this;
      document.getElementById('create-room').addEventListener("click", function(){
        window._client.create("preGame", {/* options */}).then(room => {
          self.room.leave();
          window.dispatchEvent(new CustomEvent("render-preGame", { detail: { room: room } }));
        }).catch(e => {
          console.error("join error", e);
        });
      });

      document.getElementById('refresh').addEventListener("click",function(){
        window._client.getAvailableRooms("preGame").then(rooms => {
          self.handleRoomListChange(rooms);
        }).catch(e => {
          console.error(e);
        });
      });

      document.getElementById('join-room').addEventListener("click",function(){
        let id = document.getElementById('room-id').value;
        if(id != "")
        {
          window._client.joinById(id).then(room => {
            self.room.leave();
            window.dispatchEvent(new CustomEvent("render-preGame", { detail: { room: room } }));
          }).catch(e => {
            console.error("join error", e);
            alert(e);
          });
        }
      });

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
    }

    handleUserChange(){
      document.getElementById("player-list").innerHTML = "";
      for (let id in this.room.state.users) {
        let el = document.createElement("li");
        el.textContent = this.room.state.users[id].name;
        document.getElementById('player-list').appendChild(el);
      }
    }

    handleRoomListChange(rooms){
      console.log("roomlist");
      
      rooms.forEach((room) => {
        let el = document.createElement("li");
        el.textContent = `Room id : ${room.roomId} (${room.clients}/${room.maxClients})`;
        document.getElementById('room-list').appendChild(el);
      });
    }
}

module.exports = Lobby;