import * as Colyseus from "colyseus.js";
import Gameview from './GameView';

// define endpoint based on environment
const endpoint = (window.location.hostname.indexOf("herokuapp") === -1)
  ? "ws://localhost:9000" // development (local)
  : `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}` // production (remote)

var client = new Colyseus.Client(endpoint);
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

function initialize(room)
{
  client.gameView.game.scene.stop('loginScene');
  client.gameView.game.scene.start('gameScene');
  console.log("joined successfully", room);
  window.sessionId = room.sessionId;

  room.onStateChange.once((state) => {
    window.state = state;
  });
  
  room.state.onChange = (changes) => {
    changes.forEach(change => {
      if(client.gameView && window.initialized)
      {
        switch (change.field) {
          case 'time':
              client.gameView.game.scene.getScene("gameScene").updateTime();
            break;
        
          default:
            break;
        }
      }
    });
};

  room.state.players.onAdd = (player, key) => {
    if(client.gameView && window.initialized)
    {
      client.gameView.game.scene.getScene("gameScene").playerContainer.updatePortraits();
    }

    player.onChange = function(changes) {
      if(client.gameView && window.initialized)
      {
        changes.forEach(change => {

            switch (change.field) 
            {
              case 'money':
                  if(window.sessionId == player.id)
                  {
                    client.gameView.game.scene.getScene("gameScene").updateMoney();
                  }
                break;
            
              case 'shop':
                client.gameView.game.scene.getScene("gameScene").shopContainer.updatePortraits();
                break;

              case 'board':
                client.gameView.game.scene.getScene("gameScene").boardManager.update();
                break;

              case 'experienceManager':
                client.gameView.game.scene.getScene("gameScene").playerContainer.updatePortraits();
                break;

              default:
                break;
            }
        })
      }
    };

    // force "onChange" to be called immediatelly
    player.triggerAll();
  }

  room.onMessage((message) => 
  {
    console.log(message.message);
    switch (message.message) {
      
      case 'DragDropFailed':
        client.gameView.game.scene.getScene("gameScene").boardManager.update();
        break;
    
      default:
        break;
    }
  });

  room.onError(() => 
  {
    console.log(client.id, "couldn't join", room.name);
  });

  room.onLeave(() => 
  {
    sessionStorage.setItem('lastRoomId', room.id);
    sessionStorage.setItem('lastSessionId',room.sessionId);
    console.log(client.id, "left", room.name);
  });

  window.addEventListener('shopClick',e=>
  {
    room.send({'event':'shop','id':e.detail.id});
  });

  window.addEventListener('playerClick',e=>
  {
    client.gameView.game.scene.getScene("gameScene").fade();
    client.gameView.game.scene.getScene("gameScene").boardManager.clear();
    client.gameView.game.scene.getScene("gameScene").boardManager.player = window.state.players[e.detail.id];
    client.gameView.game.scene.getScene("gameScene").boardManager.buildPokemons();
  });

  window.addEventListener('dragDrop',e=>
  {
    room.send({'event':'dragDrop','detail':e.detail});
  });

  window.addEventListener('refreshClick', e=>
  {
    room.send({'event':'refresh'});
  });

  window.addEventListener('levelUpClick', e=>
  {
    room.send({'event':'levelUp'});
  });
}