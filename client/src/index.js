import * as Colyseus from "colyseus.js";
import Gameview from './GameView';

var client = new Colyseus.Client('ws://localhost:2567');



if(sessionStorage.getItem('lastRoomId') && sessionStorage.getItem('lastSessionId')){
  let room = client.reconnect(sessionStorage.getItem('lastRoomId'), sessionStorage.getItem('lastSessionId')).then(room => {
  initialize(room);
  }).catch(e => {
    console.log("reconnect error", e);
    sessionStorage.removeItem('lastRoomId');
    sessionStorage.removeItem('lastSessionId');
    window.login();
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

window.login = function() {
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
  console.log("joined successfully", room);
  window.sessionId = room.sessionId;
  

  room.onStateChange.once((state) => {
    window.state = state;
    client.gameView = new Gameview();
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
            break;

          default:
            break;
        }
    });
      //client.gameView.game.scene.getScene("gameScene").updateEntitiesLocation(state.locations);
      //client.gameView.game.scene.getScene("gameScene").updateEntitiesVelocity(state.velocities);
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
    room.send({'event':'shopClick','id':e.detail.id});
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

}