class LobbyPage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.addEventListeners();
    this.allRooms = [];
  }

  render() {
    const content = document.createElement('div');
    content.setAttribute('id', 'lobby');
    content.innerHTML = `
    <header>
      <h1>Game Lobby</h1>
      <button id="button-home">Home</button>
    </header>
    <main>
      <p>Logged as : ${_client.auth.email}</p>
      <h3>Available room ids:</h3>
      <ul id="room-list"></ul>
      <button id="create">Create new room</button>
    </main>`;
    document.body.innerHTML = '';
    document.body.appendChild(content);
  }

  addEventListeners() {
    document.getElementById('button-home').addEventListener('click', (e) => {
      this.room.leave();
      _client.auth.logout();
      window.dispatchEvent(new CustomEvent('render-home'));
    });

    document.getElementById('create').addEventListener('click', (e) => {
      this.createRoom();
    });

    this.room.onLeave((client, consent) => {
      if (consent) {
        // sessionStorage.setItem('PAC_Room_ID', this.room.id);
        // sessionStorage.setItem('PAC_Session_ID', this.room.sessionId);
      }
    });

    this.room.onMessage('rooms', (rooms) => {
      // console.log(rooms);
      this.allRooms = rooms;
      this.handleRoomListChange();
    });

    this.room.onMessage('+', ([roomId, room]) => {
      const roomIndex = this.allRooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        this.allRooms[roomIndex] = room;
      } else {
        this.allRooms.push(room);
      }
      this.handleRoomListChange();
    });

    this.room.onMessage('-', (roomId) => {
      this.allRooms = this.allRooms.filter((room) => room.roomId !== roomId);
      this.handleRoomListChange();
    });
  }

  createRoom() {
    _client.create('room', {/* options */ }).then((room) => {
      this.room.leave();
      window.dispatchEvent(new CustomEvent('render-room', {detail: {room: room}}));
    }).catch((e) => {
      console.error('join error', e);
      alert(e);
    });
  }

  joinRoomById(id) {
    if (id === '') return;
    _client.joinById(id).then((room) => {
      this.room.leave();
      window.dispatchEvent(new CustomEvent('render-room', {detail: {room: room}}));
    }).catch((e) => {
      console.error('join error', e);
      alert(e);
    });
  }

  handleRoomListChange() {
    if (document.getElementById('room-list')) {
      document.getElementById('room-list').innerHTML = '';
      this.allRooms.forEach((room) => {
        if (room.name != 'game') {
          const item = document.createElement('li');
          item.textContent = `Room id : ${room.roomId} (${room.clients}/${room.maxClients})`;
          const button = document.createElement('button');
          button.textContent = 'Join';
          button.addEventListener('click', () => {
            this.joinRoomById(room.roomId);
          });
          item.appendChild(button);
          document.getElementById('room-list').appendChild(item);
        }
      });
    }
  }
}

export default LobbyPage;
