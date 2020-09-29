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

  <div style="display:flex; height:80%;"> 

    <div style="width:30%; height:100%;">      
      <ul id="messages" style="height:100%; overflow: scroll; display:flex; flex-flow:column;">
      </ul>
    </div>

    <div style="display:flex; flex-flow:column; justify-content:space-around; align-items:center; width:70%; height:100%;">   
     <div style="display:flex;flex-flow:row;"><img style="width:50px;" src='assets/avatar/${_client.auth.metadata.avatar}.png'></img><p style='margin-left:10px;'>${_client.auth.email}</p></div>
      <h3>Available room ids:</h3>
      <ul id="room-list"></ul>
      <button id="create">Create new room</button>
    </div>

  </div>

  <div style="width:30%; display:flex;">
    <input style="width:80%;" id="inputMessage" class="inputMessage" placeholder="Type here..." type="text">
    <button style="width:20%;" id="send">Send</button>
  </div>`;
    document.body.innerHTML = '';
    document.body.appendChild(content);
  }

  addEventListeners() {
    let self = this;

    document.getElementById('button-home').addEventListener('click', (e) => {
      this.room.leave();
      _client.auth.logout();
      window.dispatchEvent(new CustomEvent('render-home'));
    });

    document.getElementById('create').addEventListener('click', (e) => {
      this.createRoom();
    });

    document.getElementById('send').addEventListener('click',function(){
      self.sendMessage();
    });
    document.getElementById('inputMessage').addEventListener('keyup', function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        self.sendMessage();
      }
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

    this.room.onMessage('messages', (message) => {
      //console.log(message);
      let messageHTML = document.createElement('li');
      let nameHTML = document.createElement('p');
      let messageContentHTML = document.createElement('p');

      messageContentHTML.textContent = message.message;

      nameHTML.style.color = 'black';
      nameHTML.style.fontWeight = 'bold';
      nameHTML.textContent = message.name + ' : ';
      
      if(message.avatar){
        let imageHTML = document.createElement('img');
        imageHTML.src = `assets/avatar/${message.avatar}.png`;
        imageHTML.style.width = '50px';
        imageHTML.style.height = '50px';
        messageHTML.appendChild(imageHTML);
      }
      
      messageHTML.appendChild(nameHTML);
      messageHTML.appendChild(messageContentHTML);
      messageHTML.style.display = 'flex';
      document.getElementById('messages').appendChild(messageHTML);

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

  sendMessage(){
    if(document.getElementById('inputMessage').value != ''){
      this.room.send('messages', {'name': _client.auth.email, 'message': document.getElementById('inputMessage').value, 'avatar': _client.auth.metadata.avatar});
      document.getElementById('inputMessage').value = '';
    }
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
