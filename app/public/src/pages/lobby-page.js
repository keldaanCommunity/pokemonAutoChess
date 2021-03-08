import {WORDS, XP_TABLE} from '../../../models/enum';

class LobbyPage {
  constructor(args) {
    this.room = args.room;
    if(args.allRooms){
      this.allRooms = args.allRooms;
    }
    else{
      this.allRooms = [];
    }

    this.langage = 'esp';
    if (window._client.auth.lang) {
      this.langage = window._client.auth.lang;
    }
    this.initializeRoom();

    this.render();
    this.addEventListeners();
  }

  addMessage(message) {
    // console.log(message);
    if (document.getElementById('messages')) {
      const messageHTML = document.createElement('section');
      messageHTML.className = 'message -left';
      messageHTML.style.display = 'flex';

      const balloonHTML = document.createElement('div');
      balloonHTML.className = 'nes-balloon from-left';
      balloonHTML.style.borderImageRepeat= 'unset';

      const messageContentHTML = document.createElement('p');
      messageContentHTML.style.fontSize = '10px';
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
  }

  initializeRoom() {
    this.room.onLeave((client, consent) => {
      if (consent) {
        // sessionStorage.setItem('PAC_Room_ID', this.room.id);
        // sessionStorage.setItem('PAC_Session_ID', this.room.sessionId);
      }
    });
    const self = this;
    this.room.state.messages.onAdd = (message, index) => {
      self.addMessage(message);
    };

    this.room.state.leaderboard.onAdd = (player, id) =>{
      self.handleLeaderboardChange();
    }

    this.room.state.users.onAdd = (user, id)=>{
      self.handleUserListChange();
    }

    this.room.state.users.onRemove = (user, id)=>{
      self.handleUserListChange();
    }

    this.room.onMessage('rooms', (rooms) => {
      // console.log(rooms);
      rooms.forEach(room =>{
        if(room.name == 'room'){
          this.allRooms.push(room);
        }
      });
      this.handleRoomListChange();
    });

    this.room.onMessage('to-lobby', ()=>{
      this.room.leave();
      _client.auth.logout();
      window.dispatchEvent(new CustomEvent('render-home'));
    });

    this.room.onMessage('metadata', (metadata) => {
      _client.auth.metadata = metadata;
      // console.log(metadata);
      document.getElementById('avatarModal').src = `assets/avatar/${_client.auth.metadata.avatar}.png`;
      document.getElementById('avatar').src = `assets/avatar/${_client.auth.metadata.avatar}.png`;
    });

    this.room.onMessage('+', ([roomId, room]) => {
      if(room.name == 'room'){
        const roomIndex = this.allRooms.findIndex((room) => room.roomId === roomId);
        if (roomIndex !== -1) {
          this.allRooms[roomIndex] = room;
        } else {
          this.allRooms.push(room);
        }
        this.handleRoomListChange();
      }
    });

    this.room.onMessage('-', (roomId) => {
      this.allRooms = this.allRooms.filter((room) => room.roomId !== roomId);
      this.handleRoomListChange();
    });
  }

  render() {
    const self = this;
    const content = document.createElement('div');
    content.setAttribute('id', 'lobby');
    content.style.padding = '10px';
    content.innerHTML = `
  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
        <div style="display:flex;flex-flow:row;">
          <img style="width:50px;" id='avatarModal' src='assets/avatar/${_client.auth.metadata.avatar}.png'></img>
          <h4>${_client.auth.email}</h4>
        </div>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <h4>Level ${_client.auth.metadata.level}</h4>
          <progress class="nes-progress" value="${_client.auth.metadata.exp}" max="${XP_TABLE[_client.auth.metadata.level]}"></progress>
          <h4>Wins</h4>
          <progress class="nes-progress" value="${_client.auth.metadata.wins}" max="500"></progress>
          <h4>Frosty Forest</h4>
          <progress class="nes-progress is-primary" value="${_client.auth.metadata.mapWin.ICE}" max="100"></progress>
          <h4>Glimmer Desert</h4>
          <progress class="nes-progress is-warning" value="${_client.auth.metadata.mapWin.GROUND}" max="100"></progress>
          <h4>Hidden Highland</h4>
          <progress class="nes-progress is-success" value="${_client.auth.metadata.mapWin.GRASS}" max="100"></progress>
          <h4>Magma Cavern</h4>
          <progress class="nes-progress is-success" value="${_client.auth.metadata.mapWin.FIRE}" max="100"></progress>
          <h4>Tiny Woods</h4>
          <progress class="nes-progress is-success" value="${_client.auth.metadata.mapWin.NORMAL}" max="100"></progress>
          <h4>Stormy Sea</h4>
          <progress class="nes-progress is-primary" value="${_client.auth.metadata.mapWin.WATER}" max="100"></progress>

          <table class="table">
          <tbody>
            <tr>
              <td><button class="invisibleButton" onclick=window.changeAvatar('rattata')><img src="assets/avatar/rattata.png" style="filter:grayscale(${_client.auth.metadata.level >= 0 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 0"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('pidgey')><img src="assets/avatar/pidgey.png" style="filter:grayscale(${_client.auth.metadata.level >= 1 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 1"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('spearow')><img src="assets/avatar/spearow.png" style="filter:grayscale(${_client.auth.metadata.level >= 2 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 2"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('caterpie')><img src="assets/avatar/caterpie.png" style="filter:grayscale(${_client.auth.metadata.level >= 3 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 3"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('weedle')><img src="assets/avatar/weedle.png" style="filter:grayscale(${_client.auth.metadata.level >= 4 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 4"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('igglybuff')><img src="assets/avatar/igglybuff.png" style="filter:grayscale(${_client.auth.metadata.level >= 5 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 5"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('seedot')><img src="assets/avatar/seedot.png" style="filter:grayscale(${_client.auth.metadata.level >= 6 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 6"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('zubat')><img src="assets/avatar/zubat.png" style="filter:grayscale(${_client.auth.metadata.level >= 7 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 7"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('sandshrew')><img src="assets/avatar/sandshrew.png" style="filter:grayscale(${_client.auth.metadata.level >= 8 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 8"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('pikachu')><img src="assets/avatar/pikachu.png" style="filter:grayscale(${_client.auth.metadata.level >= 9 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 9"></button></td>
            </tr>
            <tr>
              <td><button class="invisibleButton" onclick=window.changeAvatar('nidoranF')><img src="assets/avatar/nidoranF.png" style="filter:grayscale(${_client.auth.metadata.level >= 10 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 10"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('machop')><img src="assets/avatar/machop.png" style="filter:grayscale(${_client.auth.metadata.level >= 11 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 11"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('geodude')><img src="assets/avatar/geodude.png" style="filter:grayscale(${_client.auth.metadata.level >= 12 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 12"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('eevee')><img src="assets/avatar/eevee.png" style="filter:grayscale(${_client.auth.metadata.level >= 13 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 13"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('poliwag')><img src="assets/avatar/poliwag.png" style="filter:grayscale(${_client.auth.metadata.level >= 14 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 14"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('turtwig')><img src="assets/avatar/turtwig.png" style="filter:grayscale(${_client.auth.metadata.level >= 15 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 15"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('togepi')><img src="assets/avatar/togepi.png" style="filter:grayscale(${_client.auth.metadata.level >= 16 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 16"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('ralts')><img src="assets/avatar/ralts.png" style="filter:grayscale(${_client.auth.metadata.level >= 17 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 17"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('nidoranM')><img src="assets/avatar/nidoranM.png" style="filter:grayscale(${_client.auth.metadata.level >= 18 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 18"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('slakoth')><img src="assets/avatar/slakoth.png" style="filter:grayscale(${_client.auth.metadata.level >= 19 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 19"></button></td>
            </tr>
            <tr>
              <td><button class="invisibleButton" onclick=window.changeAvatar('growlithe')><img src="assets/avatar/growlithe.png" style="filter:grayscale(${_client.auth.metadata.level >= 20 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 20"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('numel')><img src="assets/avatar/numel.png" style="filter:grayscale(${_client.auth.metadata.level >= 21 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 21"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('abra')><img src="assets/avatar/abra.png" style="filter:grayscale(${_client.auth.metadata.level >= 22 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 22"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('horsea')><img src="assets/avatar/horsea.png" style="filter:grayscale(${_client.auth.metadata.level >= 23 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 23"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('gastly')><img src="assets/avatar/gastly.png" style="filter:grayscale(${_client.auth.metadata.level >= 24 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 24"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('mudkip')><img src="assets/avatar/mudkip.png" style="filter:grayscale(${_client.auth.metadata.level >= 25 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK[this.langage]} 25"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('trapinch')><img src="assets/avatar/trapinch.png" style="filter:grayscale(${_client.auth.metadata.mapWin.GROUND >= 5 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 5 ${WORDS.WINS_IN[this.langage]} Glimmer Desert"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('vibrava')><img src="assets/avatar/vibrava.png" style="filter:grayscale(${_client.auth.metadata.mapWin.GROUND >= 10 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 10 ${WORDS.WINS_IN[this.langage]} Glimmer Desert"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('flygon')><img src="assets/avatar/flygon.png" style="filter:grayscale(${_client.auth.metadata.mapWin.GROUND >= 25 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 25 ${WORDS.WINS_IN[this.langage]} Glimmer Desert"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('regirock')><img src="assets/avatar/regirock.png" style="filter:grayscale(${_client.auth.metadata.mapWin.GROUND >= 100 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 100 ${WORDS.WINS_IN[this.langage]} Glimmer Desert"></button></td>
            </tr>        
            <tr>
              <td><button class="invisibleButton" onclick=window.changeAvatar('bagon')><img src="assets/avatar/bagon.png" style="filter:grayscale(${_client.auth.metadata.mapWin.NORMAL >= 5 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 5 ${WORDS.WINS_IN[this.langage]} Tiny Woods"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('shelgon')><img src="assets/avatar/shelgon.png" style="filter:grayscale(${_client.auth.metadata.mapWin.NORMAL >= 10 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 10 ${WORDS.WINS_IN[this.langage]} Tiny Woods"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('salamence')><img src="assets/avatar/salamence.png" style="filter:grayscale(${_client.auth.metadata.mapWin.NORMAL >= 25 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 25 ${WORDS.WINS_IN[this.langage]} Tiny Woods"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('rayquaza')><img src="assets/avatar/rayquaza.png" style="filter:grayscale(${_client.auth.metadata.mapWin.NORMAL >= 100 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 100 ${WORDS.WINS_IN[this.langage]} Tiny Woods"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('spheal')><img src="assets/avatar/spheal.png" style="filter:grayscale(${_client.auth.metadata.mapWin.ICE >= 5 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 5 ${WORDS.WINS_IN[this.langage]} Frosty Forest"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('sealeo')><img src="assets/avatar/sealeo.png" style="filter:grayscale(${_client.auth.metadata.mapWin.ICE >= 10 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 10 ${WORDS.WINS_IN[this.langage]} Frosty Forest"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('walrein')><img src="assets/avatar/walrein.png" style="filter:grayscale(${_client.auth.metadata.mapWin.ICE >= 25 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 25 ${WORDS.WINS_IN[this.langage]} Frosty Forest"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('articuno')><img src="assets/avatar/articuno.png" style="filter:grayscale(${_client.auth.metadata.mapWin.ICE >= 100 ? 0:1})" alt="" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 100 ${WORDS.WINS_IN[this.langage]} Frosty Forest"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('bulbasaur')><img src="assets/avatar/bulbasaur.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.GRASS >= 5 ? 0:1})" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 5 ${WORDS.WINS_IN[this.langage]} Hidden Highland"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('ivysaur')><img src="assets/avatar/ivysaur.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.GRASS >= 10 ? 0:1})" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 10 ${WORDS.WINS_IN[this.langage]} Hidden Highland"></button></td>
            </tr>
            <tr>
              <td><button class="invisibleButton" onclick=window.changeAvatar('venusaur')><img src="assets/avatar/venusaur.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.GRASS >= 25 ? 0:1})" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 25 ${WORDS.WINS_IN[this.langage]} Hidden Highland"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('shaymin')><img src="assets/avatar/shaymin.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.GRASS >= 100 ? 0:1})" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 100 ${WORDS.WINS_IN[this.langage]} Hidden Highland"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('squirtle')><img src="assets/avatar/squirtle.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.WATER >= 5 ? 0:1})"  class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 5 ${WORDS.WINS_IN[this.langage]} Stormy Sea"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('wartortle')><img src="assets/avatar/wartortle.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.WATER >= 10 ? 0:1})"  class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 10 ${WORDS.WINS_IN[this.langage]} Stormy Sea"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('blastoise')><img src="assets/avatar/blastoise.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.WATER >= 25 ? 0:1})"  class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 25 ${WORDS.WINS_IN[this.langage]} Stormy Sea"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('kyogre')><img src="assets/avatar/kyogre.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.WATER >= 100 ? 0:1})"  class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 100 ${WORDS.WINS_IN[this.langage]} Stormy Sea"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('charmander')><img src="assets/avatar/charmander.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.FIRE >= 5 ? 0:1})" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 5 ${WORDS.WINS_IN[this.langage]} Magma Cavern"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('charmeleon')><img src="assets/avatar/charmeleon.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.FIRE >= 10 ? 0:1})" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 10 ${WORDS.WINS_IN[this.langage]} Magma Cavern"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('charizard')><img src="assets/avatar/charizard.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.FIRE >= 25 ? 0:1})" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 25 ${WORDS.WINS_IN[this.langage]} Magma Cavern"></button></td>
              <td><button class="invisibleButton" onclick=window.changeAvatar('groudon')><img src="assets/avatar/groudon.png" alt="" style="filter:grayscale(${_client.auth.metadata.mapWin.FIRE >= 100 ? 0:1})" class="img-thumbnail" data-toggle="tooltip" data-placement="right" title="${WORDS.UNLOCK_AFTER[this.langage]} 100 ${WORDS.WINS_IN[this.langage]} Magma Cavern"></button></td>
            </tr>
          </tbody>
        </table>
        </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">${WORDS.CLOSE[this.langage]}</button>
      </div>
      </div>
    </div>
  </div>

  <div style="display:flex; justify-content:space-between;"> 
  
    <button type="button" class="nes-btn" id="button-home">${WORDS.HOME[this.langage]}</button>
    <div class="dropdown">

    <!-- Button trigger modal -->
    <button type="button" class="nes-btn is-warning" data-toggle="modal" data-target="#exampleModal">
      Profile
    </button>

    <button class="nes-btn is-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <img src="assets/flags/${this.langage}.png"/>  
    ${WORDS.CHANGE_LANGAGE[this.langage]}
    </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#" id ="eng-button">
        <img src="assets/flags/eng.png"/>
        English</a>
        <a class="dropdown-item" href="#" id ="esp-button">
        <img src="assets/flags/esp.png"/>
        Español</a>
        <a class="dropdown-item" href="#" id ="fra-button">
        <img src="assets/flags/fra.png"/>
        Français</a>
      </div>
    </div>
  </div>
  <div style="display:flex; justify-content:space-between; height:100%;"> 

    <div class="nes-container with-title is-centered" style="background-color: rgba(255, 255, 255, .5); margin:10px;">
      <p class="title">${WORDS.LEADERBOARD[this.langage]}</p> 
      <div id='leaderboard-container'>
      <table>
        <thead>
            <tr>
                <th colspan="2">${WORDS.LEADERBOARD[this.langage]}</th>
                <th>${WORDS.PLAYER[this.langage]}</th>
                <th>${WORDS.LEVEL[this.langage]}</th>
            </tr>
        </thead>
        <tbody id="leaderboard-table">

        </tbody>
      </table>
      </div>
    </div>

    <div class="nes-container with-title is-centered" style="background-color: rgba(255, 255, 255, .5); margin:10px;">
      <p class="title">${WORDS.GAME_LOBBY[this.langage]}</p>  
      <div style="display:flex;flex-flow:row;"><img style="width:50px;" id='avatar' src='assets/avatar/${_client.auth.metadata.avatar}.png'></img><p style='margin-left:10px;'>${_client.auth.email}</p></div>
      <h3 style="margin:10px;">${WORDS.AVAILABLE_ROOM_IDS[this.langage]}:</h3>
      
      <div id="room-list" style="margin-top:10px; list-style: none;"></div>
      <button type="button" class="nes-btn is-success" id="create">${WORDS.CREATE_NEW_ROOM[this.langage]}</button>
    </div>

    <div class="nes-container with-title is-centered" style="background-color: rgba(255, 255, 255, .5); margin:10px;">
      <p class="title">${WORDS.USERS[this.langage]}</p> 
      <div id='user-container'>

      </div>
    </div>

    <section class="nes-container" style="background-color: rgba(255, 255, 255, .5); margin:10px; overflow:scroll; height:90vh; width:30%;">
    <section class="message-list" id="messages">
      </section>

      <div id='chat-container' style="display:flex; position:relative; bottom:0px; left:0px;">
      <div class="nes-field" style="width:78%; margin-right:2%;">
        <input type="text" id="inputMessage" class="nes-input" placeholder="${WORDS.TYPE_HERE[this.langage]}...">
      </div>
      <button type="button" class="nes-btn is-error" style="width:20%;" id="send">${WORDS.SEND[this.langage]}</button>
      </div>
    </section>
  </div>
`;
    document.body.innerHTML = '';
    document.body.appendChild(content);
    $(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.handleRoomListChange();
    this.handleUserListChange();
    this.handleLeaderboardChange();
    this.room.state.messages.forEach((message, index) => {
      self.addMessage(message);
    });
  }

  addEventListeners() {
    // console.log(_client.auth.lang);
    const self = this;

    window.changeAvatar = function(pokemon) {
      self.room.send('avatar', {'pokemon': pokemon});
    };

    document.getElementById('button-home').addEventListener('click', (e) => {
      this.room.leave();
      _client.auth.logout();
      window.dispatchEvent(new CustomEvent('render-home'));
    });

    document.getElementById('create').addEventListener('click', (e) => {
      this.createRoom();
    });

    document.getElementById('send').addEventListener('click', function() {
      self.sendMessage();
    });

    document.getElementById('inputMessage').addEventListener('keyup', function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        self.sendMessage();
      }
    });

    document.getElementById('eng-button').addEventListener('click', (e) => {
      window.dispatchEvent(new CustomEvent('switch-lang', {detail: {lang: 'eng', render: 'lobby', room: self.room, allRooms: self.allRooms}}));
    });

    document.getElementById('esp-button').addEventListener('click', (e) => {
      window.dispatchEvent(new CustomEvent('switch-lang', {detail: {lang: 'esp', render: 'lobby', room: self.room, allRooms: self.allRooms}}));
    });

    document.getElementById('fra-button').addEventListener('click', (e) => {
      window.dispatchEvent(new CustomEvent('switch-lang', {detail: {lang: 'fra', render: 'lobby', room: self.room, allRooms: self.allRooms}}));
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

  sendMessage() {
    if (document.getElementById('inputMessage').value != '') {
      this.room.send('new-message', {'name': _client.auth.email, 'payload': document.getElementById('inputMessage').value, 'avatar': _client.auth.metadata.avatar});
      document.getElementById('inputMessage').value = '';
    }
  }

  handleUserListChange(){
    if(document.getElementById('user-container')){
      document.getElementById('user-container').innerHTML = '';
      this.room.state.users.forEach(user => {
        const userHTML = document.createElement('div');
        userHTML.style.display = 'flex';
        userHTML.style.flexFlow = 'column';
        userHTML.style.alignItems = 'center';
        const imageHTML = document.createElement('img');
        imageHTML.src = `assets/avatar/${user.avatar}.png`;
        const nameHTML = document.createElement('p');
        nameHTML.style.fontSize = '10px';
        nameHTML.textContent = user.name;
        userHTML.appendChild(imageHTML);
        userHTML.appendChild(nameHTML);
        document.getElementById('user-container').appendChild(userHTML);
      });
    }
  }

  handleLeaderboardChange(){
    if(document.getElementById('leaderboard-container')){
      document.getElementById('leaderboard-table').innerHTML = '';
      this.room.state.leaderboard.forEach(player =>{
        const playerHTML = document.createElement('tr');

        const rankHTML = document.createElement('td');
        rankHTML.textContent = player.rank;

        const avatarHTML = document.createElement('td');
        const imageHTML = document.createElement('img');
        imageHTML.src = `assets/avatar/${player.avatar}.png`;
        avatarHTML.appendChild(imageHTML);

        const nameHTML = document.createElement('td');
        nameHTML.textContent = player.name;

        const levelHTML = document.createElement('td');
        levelHTML.textContent = player.lvl;

        playerHTML.appendChild(rankHTML);
        playerHTML.appendChild(avatarHTML);
        playerHTML.appendChild(nameHTML);
        playerHTML.appendChild(levelHTML);

        document.getElementById('leaderboard-table').appendChild(playerHTML);
      });
    }
  }

  handleRoomListChange() {
    if (document.getElementById('room-list')) {
      document.getElementById('room-list').innerHTML = '';
      this.allRooms.forEach((room) => {
        if (room.name != 'game') {
          const nesContainer = document.createElement('div');
          nesContainer.style.marginTop = '20px';
          nesContainer.style.marginBottom = '20px';
          nesContainer.className = 'nes-container with-title is-centered';

          const infoContainer = document.createElement('div');
          infoContainer.style.display = 'flex';
          infoContainer.style.justifyContent = 'space-around';

          const title = document.createElement('p');
          title.className = 'title';
          title.textContent = `Room id : ${room.roomId}`;

          const content = document.createElement('h3');
          content.style.marginTop = '15px';
          content.textContent = `${room.clients} / ${room.maxClients}`;

          const button = document.createElement('button');
          button.textContent = 'Join';
          button.className = 'nes-btn is-warning';
          button.addEventListener('click', () => {
            this.joinRoomById(room.roomId);
          });

          infoContainer.appendChild(content);
          infoContainer.appendChild(button);
          nesContainer.appendChild(title);
          nesContainer.appendChild(infoContainer);

          document.getElementById('room-list').appendChild(nesContainer);
        }
      });
    }
  }
}

export default LobbyPage;
