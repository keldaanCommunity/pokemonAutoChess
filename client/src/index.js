import * as Colyseus from "colyseus.js";
import Gameview from './GameView';

var client = new Colyseus.Client('ws://localhost:2567');

client.joinOrCreate("my_room", {/* options */}).then(room => {
    console.log("joined successfully", room);
    

    room.onStateChange.once((state) => {
      console.log(state);
      client.gameView = new Gameview(state);
      window.state = state;
    });
    

    room.state.onChange = (changes) => {     
      if(client.gameView && window.initialized)
      {
        changes.forEach(change => {
          switch (change.field) {
            case 'time':
              client.gameView.game.scene.getScene("gameScene").timeText.setText(change.value);
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

  }).catch(e => {
    console.error("join error", e);
  });



