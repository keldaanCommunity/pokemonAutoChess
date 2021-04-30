import {WORDS} from '../../../models/enum';

class AfterGamePage {
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
    content.setAttribute('id', 'after-game');
    content.style.padding = '10px';
    content.innerHTML = `
    <button type="button" class="nes-btn" style="width: max-content;" id="quit">${WORDS.GAME_LOBBY[this.langage]}</button>
    <div style="display:flex; flex-flow:row;justify-content:space-between;"> 

    <div class="nes-container with-title is-centered" style="background-color: rgba(255, 255, 255, .6); margin:10px; display:flex; flex-flow:column;">
      <p class="title">${WORDS.ROOM_ID[this.langage]}: ${this.room.id}</p>
      <div style="display:flex;flex-flow:row;justify-content:space-around;">
        <img style="width:50px; height:50px;" src='assets/avatar/${_client.auth.metadata.avatar}.png'></img>
        <p style="margin-right:10%;">${_client.auth.email}</p>
        <p id="xp">+ ${WORDS.EXPERIENCE[this.langage]}</p>
      </div>
      <h3>${WORDS.RESULTS[this.langage]} :</h3>
      <table id="players-table" style="width:100%; border-collapse: separate; border-spacing: 10px;">
        <tr>
          <th>${WORDS.RANK[this.langage]}</th>
          <th>${WORDS.PLAYER[this.langage]}</th>
          <th>${WORDS.COMPOSITION[this.langage]}</th>
        </tr>
      </table>
      </div>

      <section class="nes-container" style="background-color: rgba(255, 255, 255, .6); margin:10px; overflow:scroll; height:90vh;">
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

    document.getElementById('send').addEventListener('click', () => {
      this.sendMessage();
    });

    document.getElementById('inputMessage').addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.sendMessage();
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

    this.room.state.players.onAdd = (player) => this.addPlayer(player);
    this.room.state.players.onRemove = (player, key) => this.removePlayer(player, key);

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
  }


  addPlayer(player){
    let trHTML = document.createElement('tr');
    let tdRank = document.createElement('td');
    let tdName = document.createElement('td');
    let tdTeam = document.createElement('td');

    let divTeam = document.createElement('div');
    divTeam.style.display = 'flex';

    player.pokemons.forEach(pokemon => {
      let pokemonImage = document.createElement('img');
      pokemonImage.src = `assets/avatar/${pokemon}.png`;
      pokemonImage.style.width = '40px';
      pokemonImage.style.height = '40px';
      divTeam.appendChild(pokemonImage);
    });

    let pName = document.createElement('p');

    tdRank.textContent = player.rank;
    pName.textContent = player.name;

    let avatar = document.createElement('img');
    avatar.src = `assets/avatar/${player.avatar}.png`;
    avatar.style.width = '40px';
    avatar.style.height = '40px';

    tdName.appendChild(avatar);
    tdName.appendChild(pName);

    tdName.style.display = 'flex';

    tdTeam.appendChild(divTeam);

    trHTML.appendChild(tdRank);
    trHTML.appendChild(tdName);
    trHTML.appendChild(tdTeam);
    
    trHTML.style.margin = '10px';
    trHTML.setAttribute('id', player.name);

    document.getElementById('players-table').appendChild(trHTML);

    if(player.id == _client.auth._id){
      document.getElementById('xp').innerHTML = `<p id="xp">+${this.room.state.players.get(_client.auth._id).exp} ${WORDS.EXPERIENCE[this.langage]}</p>`;
    }
  }

  removePlayer(player, key){
    let element = document.getElementById(player.name);
    if(element){
      element.remove();
    }
  }
}

export default AfterGamePage;
