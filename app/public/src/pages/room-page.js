import {WORDS} from '../../../models/enum';

class RoomPage {
  constructor(args) {
    this.room = args.room;
    this.langage = 'esp';
    if (window._client.auth.lang) {
      this.langage = window._client.auth.lang;
    }
    this.render();
    this.addEventListeners();
  }

  render() {
    const content = document.createElement('div');
    content.setAttribute('id', 'pre-game');
    content.style.padding = '10px';
    content.innerHTML = `
    <button type="button" class="nes-btn" style="width: max-content;" id="quit">${WORDS.GAME_LOBBY[this.langage]}</button>
    <div style="display:flex; flex-flow:row;justify-content:space-between;"> 

    <div class="nes-container with-title is-centered" style="background-color: rgba(255, 255, 255, .5); margin:10px; display:flex; flex-flow:column; justify-content:space-between;">
      <p class="title">${WORDS.ROOM_ID[this.langage]}: ${this.room.id}</p>
      <div style="display:flex;flex-flow:row;"><img style="width:50px;" src='assets/avatar/${_client.auth.metadata.avatar}.png'></img>
      <p style='margin-left:10px;'>${_client.auth.email.slice(0, _client.auth.email.indexOf('@'))} (${_client.auth.metadata.elo})</p>
      </div>
      <h3>${WORDS.PLAYERS_IN_ROOM[this.langage]} :</h3>
      <table id="players-table" style="width:100%; flex-grow:2; border-spacing: 10px;">
        <tr>
          <th>${WORDS.PLAYER[this.langage]}</th>
          <th>${WORDS.READY[this.langage]}</th>
        </tr>
      </table>
      <div>
      <button type="button" class="nes-btn is-warning" id="ready">${WORDS.READY[this.langage]}</button>
      <button type="button" class="nes-btn is-success" id="start">${WORDS.START_GAME[this.langage]}</button>
      <button type="button" class="nes-btn is-primary" id="addBot">${WORDS.ADD_BOT[this.langage]}</button>
      <button type="button" class="nes-btn is-primary" id="removeBot">${WORDS.REMOVE_BOT[this.langage]}</button>
    </div>
      </div>

      <section class="nes-container" style="background-color: rgba(255, 255, 255, .5); margin:10px; overflow:scroll; height:90vh;">
      <section class="message-list" id="messages" style="height:95%;">
        </section>
  
        <div id='chat-container' style="display:flex; position:relative; bottom:0px; left:0px;">
        <div class="nes-field" style="width:78%; margin-right:2%;">
          <input type="text" id="inputMessage" class="nes-input" placeholder="${WORDS.TYPE_HERE[this.langage]}...">
        </div>
        <button type="button" class="nes-btn is-error" style="width:20%;" id="send">${WORDS.SEND[this.langage]}</button>
        </div>
      </section>
    </div>
    </div>
    </div> 
    `;
    document.body.innerHTML = '';
    document.body.appendChild(content);
  }

  sendMessage() {
    if (document.getElementById('inputMessage').value != '') {
      this.room.send('messages', {
        'name': _client.auth.email.split('@')[0],
        'payload': document.getElementById('inputMessage').value,
        'avatar': _client.auth.metadata.avatar,
        'time': Date.now()
      });
      document.getElementById('inputMessage').value = '';
    }
  }

  addEventListeners() {
    document.getElementById('addBot').addEventListener('click', () => {
      this.room.send('addBot');
    });

    document.getElementById('removeBot').addEventListener('click', () => {
      this.room.send('removeBot');
    });

    document.getElementById('send').addEventListener('click', () => {
      this.sendMessage();
    });

    document.getElementById('inputMessage').addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.sendMessage();
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
        _client.create('game', {'users': this.room.state.users}).then((room) => {
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

    this.room.onStateChange((state) => {
      // console.log(state);
      this.handleUserChange();
    });

    this.room.onMessage('messages', (message) => {
    // console.log(message);
      if (document.getElementById('messages')) {
        const messageHTML = document.createElement('section');
        messageHTML.className = 'message -left';
        messageHTML.style.display = 'flex';
  
        const balloonHTML = document.createElement('div');
        balloonHTML.className = 'nes-balloon from-left';
  
        const messageContentHTML = document.createElement('p');
        messageContentHTML.textContent = message.payload;
        balloonHTML.appendChild(messageContentHTML);
        /*
        const timeOfMessage = new Date(message.time);
        nameHTML.style.color = 'black';
        nameHTML.style.fontWeight = 'bold';
        nameHTML.textContent = `${timeOfMessage.getHours()}:${timeOfMessage.getMinutes()} - ${message.name} :`;
        */
        const imageHTML = document.createElement('img');
        imageHTML.src = `assets/avatar/${message.avatar}.png`;
        imageHTML.style.width = '50px';
        imageHTML.style.height = '50px';
  
        const hourHTML = document.createElement('p');
        const timeOfMessage = new Date(message.time);
        hourHTML. textContent = `${timeOfMessage.getHours()}:${timeOfMessage.getMinutes()}`;
        hourHTML.style.marginBottom ='0px;'
  
        const nameHTML = document.createElement('p');
        nameHTML.textContent = `${message.name}`;
        nameHTML.style.marginBottom ='0px;'
        nameHTML.style.fontSize = '10px';
        
        const detailHTML = document.createElement('div');
        detailHTML.style.display = 'flex';
        detailHTML.style.flexFlow = 'column';
        detailHTML.style.alignItems = 'center';
  
        detailHTML.appendChild(imageHTML);
        detailHTML.appendChild(nameHTML);
        detailHTML.appendChild(hourHTML);
  
        messageHTML.appendChild(detailHTML);
        messageHTML.appendChild(balloonHTML);
        document.getElementById('messages').appendChild(messageHTML);
        messageHTML.scrollIntoView();
      }
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
    document.getElementById('players-table').innerHTML = `
    <tr>
    <th>${WORDS.PLAYER[this.langage]}</th>
    <th>${WORDS.READY[this.langage]}</th>
    </tr>`;

    this.room.state.users.forEach((user, key) => {
      let icon = '';
      if (user.name !== undefined) {
        if (user.ready) {
          icon = `<i class="fa fa-check" aria-hidden="true"></i>`;
        } else {
          icon = `<i class="fa fa-times" aria-hidden="true"></i>`;
        }
        document.getElementById('players-table').innerHTML +=`
        <tr>
        <td style="display:flex;"><img style="width:50px; height:50px;"src="assets/avatar/${user.avatar}.png"></img><p>${user.name} (${user.elo})</p></td>
        <td>${icon}</td>
        </tr>`;
      };
    });
  }
}

export default RoomPage;
