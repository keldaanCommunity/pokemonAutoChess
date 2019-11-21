import * as Colyseus from "colyseus.js";
import Gameview from './GameView';

var client = new Colyseus.Client('ws://localhost:2567');
client.gameView = new Gameview();

window.addEventListener('clickPlay',()=>{
  login();
});

if(sessionStorage.getItem('lastRoomId') && sessionStorage.getItem('lastSessionId')){
  let room = client.reconnect(sessionStorage.getItem('lastRoomId'), sessionStorage.getItem('lastSessionId')).then(room => {
  initialize(room);
  }).catch(e => {
    console.log("reconnect error", e);
    sessionStorage.removeItem('lastRoomId');
    sessionStorage.removeItem('lastSessionId');
    login();
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId            : '632593943940001',
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v5.0'
  });
};

function login() {
    let authResponse;
    FB.login(function(response) 
    {
        if (response.authResponse) 
        {
            authResponse = response.authResponse;
            FB.api(
                "/"+ authResponse.userID + "/",
                function (response) {
                    joinOrCreate(authResponse.accessToken, response.name);
                }
            );
            
        }
    }, { scope: 'public_profile,email' });
}

function joinOrCreate(accessToken, facebookName)
{
  client.joinOrCreate("gameRoom", { 'accessToken': accessToken, 'facebookName':facebookName }).then(room => {
    initialize(room);
  }).catch(e => {
    console.error("join error", e);
  });
}

function initialize(room){
  client.gameView.game.scene.stop('loginScene');
  client.gameView.game.scene.start('gameScene');
  console.log("joined successfully", room);
  window.sessionId = room.sessionId;
  room.onStateChange.once((state) => {
    window.state = state;
  });
  
  room.state.onChange = (changes) => {     
    if(client.gameView && window.initialized)
    {
      changes.forEach(change => {
        switch (change.field) {
          case 'time':
            client.gameView.game.scene.getScene("gameScene").updateTimeText(state.time);
            break;
          
          case 'players':
            client.gameView.game.scene.getScene("gameScene").shopContainer.updatePortraits();
            client.gameView.game.scene.getScene("gameScene").playerContainer.updatePortraits();
            client.gameView.game.scene.getScene("gameScene").boardManager.update();
            client.gameView.game.scene.getScene("gameScene").updateMoney();
            break;

          default:
            break;
        }
    });
    }
};

  room.onMessage((message) => {
    console.log(client.id, "received on", room.name, message);
  });

  room.onError(() => {
    console.log(client.id, "couldn't join", room.name);
  });

  room.onLeave(() => {
    sessionStorage.setItem('lastRoomId', room.id);
    sessionStorage.setItem('lastSessionId',room.sessionId);
    console.log(client.id, "left", room.name);
  });

  window.addEventListener('shopClick',e=>{
    room.send({'event':'shop','id':e.detail.id});
  });

  window.addEventListener('playerClick',e=>{
    client.gameView.game.scene.getScene("gameScene").fade();
    client.gameView.game.scene.getScene("gameScene").boardManager.clear();
    client.gameView.game.scene.getScene("gameScene").boardManager.player = window.state.players[e.detail.id];
    client.gameView.game.scene.getScene("gameScene").boardManager.buildPokemons();
  });

  window.addEventListener('dragDrop',e=>{
    room.send({'event':'dragDrop','detail':e.detail});
  });

  window.addEventListener('refreshClick', e=>{
    room.send({'event':'refresh'});
  });

  window.addEventListener('levelUpClick', e=>{
    room.send({'event':'levelUp'});
  });
}