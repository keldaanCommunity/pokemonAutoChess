import { WORDS } from "../../../models/enum";

class RoomPage {
  constructor(args) {
    this.room = args.room;
    this.langage = 'esp';
    if(window._client.auth.lang){
      this.langage = window._client.auth.lang;
    }
    this.render();
    this.addEventListeners();
  }

  render() {
    const content = document.createElement('div');
    content.setAttribute('id', 'pre-game');

    content.innerHTML = `
    <header>
      <h1>${WORDS.ROOM_ID[this.langage]}: ${this.room.id}</h1>
      <button type="button" class="btn btn-secondary" id="button-home">${WORDS.GAME_LOBBY[this.langage]}</button>
    </header>
    <div style="display:flex; height:80%;"> 

      <div style="width:30%; height:100%;">      
        <ul id="messages" style="height:100%; overflow: scroll; display:flex; flex-flow:column;">
        </ul>
      </div>

      <div style="display:flex; flex-flow:column; justify-content:space-around; align-items:center; width:50%; height:100%;">   
        <div style="display:flex;flex-flow:row;"><img style="width:50px;" src='assets/avatar/${_client.auth.metadata.avatar}.png'></img>
        <p style='margin-left:10px;'>${_client.auth.email}</p>
        </div>
        <h3>${WORDS.PLAYERS_IN_ROOM[this.langage]} :</h3>
        <table id="players-table">
          <tr>
            <th>${WORDS.PLAYER[this.langage]}</th>
            <th>${WORDS.READY[this.langage]}</th>
          </tr>
        </table>
        </div>
        <div style="display:flex;  flex-flow:column; justify-content:center;">
          <button type="button" class="btn btn-secondary" id="ready">${WORDS.READY[this.langage]}</button>
          <button type="button" class="btn btn-secondary" id="start">${WORDS.START_GAME[this.langage]}</button>
          <button type="button" class="btn btn-secondary" id="quit">${WORDS.QUIT_ROOM[this.langage]}</button>
          <button type="button" class="btn btn-secondary" id="addBot">${WORDS.ADD_BOT[this.langage]}</button>
          <button type="button" class="btn btn-secondary" id="removeBot">${WORDS.REMOVE_BOT[this.langage]}</button>
        </div>
    </div>
      <div style="width:30%; display:flex;">
        <input style="width:80%;" id="inputMessage" class="inputMessage" placeholder="${WORDS.TYPE_HERE[this.langage]}..." type="text">
        <button type="button" class="btn btn-secondary" style="width:20%;" id="send">${WORDS.SEND[this.langage]}</button>
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

      this.room.state.users.forEach((user, key) => {
        if (!user.ready) {
          allUsersReady = false;
        }
      });

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
      //console.log(state);
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
    <th>${WORDS.PLAYER[this.langage]}</th>
    <th>${WORDS.READY[this.langage]}</th>
    </tr>`;

    this.room.state.users.forEach((user, key) => {
      let icon = '';
      if(user.name !== undefined){
        if (user.ready) {
          icon = `<i class="fa fa-check" aria-hidden="true"></i>`;
        } else {
          icon = `<i class="fa fa-times" aria-hidden="true"></i>`;
        }
        document.getElementById('players-table').innerHTML +=`
        <tr>
        <td style="display:flex;"><img style="width:50px; height:50px;"src="assets/avatar/${user.avatar}.png"></img><p>${user.name}</p></td>
        <td>${icon}</td>
        </tr>`;
      };
    });
  }
}

export default RoomPage;
