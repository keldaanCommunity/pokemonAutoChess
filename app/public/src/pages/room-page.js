class RoomPage {
  constructor(args) {
    this.room = args.room;
    this.render();
    this.addEventListeners();
  }

  render() {
    const content = document.createElement('div');
    content.setAttribute('id', 'pre-game');
    content.innerHTML = `
    <header>
      <h1>Room ID: ${this.room.id}</h1>
      <button id="button-home">Home</button>
    </header>
    <div style="display:flex; height:80%;"> 

      <div style="width:30%; height:100%;">      
        <ul id="messages" style="height:100%; overflow: scroll; display:flex; flex-flow:column;">
        </ul>
      </div>

      <div style="display:flex; flex-flow:column; justify-content:space-around; align-items:center; width:70%; height:100%;">   
      <div style="display:flex;flex-flow:row;"><img style="width:50px;" src='assets/avatar/${_client.auth.metadata.avatar}.png'></img><p style='margin-left:10px;'>${_client.auth.email}</p></div>
      <h3>Players in room :</h3>
      <table id="players-table">
        <tr>
          <th>Player</th>
          <th>Elo</th>
          <th>Ready</th>
        </tr>
      </table>
      <div style="display:flex;  flex-flow:column;">
        <button id="ready">Ready</button>
        <button id="start">Start Game</button>
        <button id="quit">Quit Room</button>
        <button id="addBot">Add Bot</button>
        <button id="removeBot">Remove Bot</button>
      </div>
    </div>

    </div>
      <div style="width:30%; display:flex;">
        <input style="width:80%;" id="inputMessage" class="inputMessage" placeholder="Type here..." type="text">
        <button style="width:20%;" id="send">Send</button>
      </div>
    </div> 
    `;
    document.body.innerHTML = '';
    document.body.appendChild(content);
  }

  sendMessage(){
    if(document.getElementById('inputMessage').value != ''){
      this.room.send('messages', {'name': _client.auth.email, 'message': document.getElementById('inputMessage').value, 'avatar': _client.auth.metadata.avatar});
      document.getElementById('inputMessage').value = '';
    }
  }

  addEventListeners() {
    document.getElementById('button-home').addEventListener('click', (e) => {
      this.room.leave();
      _client.auth.logout();
      window.dispatchEvent(new CustomEvent('render-home'));
    });

    let self = this;
    document.getElementById('addBot').addEventListener('click', function () {
      self.room.send('addBot');
    });

    document.getElementById('removeBot').addEventListener('click', function () {
      self.room.send('removeBot');
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

    document.getElementById('start').addEventListener('click', (e) => {
      let allUsersReady = true;
      for (const id in this.room.state.users) {
        if (!this.room.state.users[id].ready) {
          allUsersReady = false;
        }
      }
      if (allUsersReady) {
        _client.create('game', {'users':this.room.state.users}).then((room) => {
          this.room.send('game-start', {id: room.id});
          this.room.leave();
          window.dispatchEvent(new CustomEvent('render-game', {detail: {room: room}}));
        }).catch((e) => {
          console.error('join error', e);
        });
      }
    });
    document.getElementById('quit').addEventListener('click', (e) => {
      _client.joinOrCreate('lobby').then((room) => {
        this.room.leave();
        window.dispatchEvent(new CustomEvent('render-lobby', {detail: {room: room}}));
      }).catch((e) => {
        console.error('join error', e);
      });
    });
    document.getElementById('ready').addEventListener('click', (e) => {
      this.room.send('toggle-ready');
    });

    this.room.onLeave((client, consent) => {
      if (consent) {
        // sessionStorage.setItem('PAC_Room_ID', this.room.id);
        // sessionStorage.setItem('PAC_Session_ID', this.room.sessionId);
      }
    });
    this.room.onStateChange((state) => {
      console.log(state);
      this.handleUserChange();
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

    this.room.onMessage('game-start', (message) => {
      _client.joinById(message.id).then((room) => {
        this.room.leave();
        window.dispatchEvent(new CustomEvent('render-game', {detail: {room: room}}));
      }).catch((e) => {
        console.error('join error', e);
      });
    });
  }

  handleUserChange() {
    let self = this;
    document.getElementById('players-table').innerHTML = `
    <tr>
    <th>Player</th>
    <th>Ready</th>
    </tr>`;

    for (const id in this.room.state.users) {
      let icon = '';
      if(this.room.state.users[id].name !== undefined){
        if (this.room.state.users[id].ready) {
          icon = `<i class="fa fa-check" aria-hidden="true"></i>`;
        } else {
          icon = `<i class="fa fa-times" aria-hidden="true"></i>`;
        }
        document.getElementById('players-table').innerHTML +=`
        <tr>
        <td style="display:flex;"><img style="width:50px; height:50px;"src="assets/avatar/${this.room.state.users[id].avatar}.png"></img><p>${this.room.state.users[id].name}</p></td>
        <td>${icon}</td>
        </tr>`;
      };

    }
  }
}

export default RoomPage;
