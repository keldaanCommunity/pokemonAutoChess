import * as Colyseus from "colyseus.js";
import Gameview from './GameView';

var client = new Colyseus.Client('ws://localhost:2567');

window.joinOrCreate = function(accessToken, facebookName)
{
  client.joinOrCreate("gameRoom", { 'accessToken': accessToken, 'facebookName':facebookName }).then(room => {
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

  }).catch(e => {
    console.error("join error", e);
});


}
